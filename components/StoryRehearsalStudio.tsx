"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { type StoryDraft } from "@/lib/interview";

interface StoryRehearsalStudioProps {
  story: StoryDraft;
}

interface StoryTake {
  id: string;
  label: string;
  url: string;
  downloadName: string;
  durationSeconds: number | null;
  source: "recorded" | "uploaded";
}

type MicrophoneStatus = "unknown" | "unsupported" | "prompt" | "granted" | "denied";

const RECORDER_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
] as const;

function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

function formatClock(seconds: number | null): string {
  if (seconds === null) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainder}`;
}

function getSupportedRecorderOptions(): MediaRecorderOptions | undefined {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof MediaRecorder.isTypeSupported !== "function"
  ) {
    return undefined;
  }

  const supportedMimeType = RECORDER_MIME_CANDIDATES.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );

  return supportedMimeType ? { mimeType: supportedMimeType } : undefined;
}

function getAudioExtension(mimeType: string): string {
  if (mimeType.includes("mp4")) {
    return "m4a";
  }
  if (mimeType.includes("ogg")) {
    return "ogg";
  }
  return "webm";
}

function getMicrophoneStatusLabel(status: MicrophoneStatus): string {
  switch (status) {
    case "granted":
      return "Permission granted";
    case "denied":
      return "Permission blocked";
    case "prompt":
      return "Permission needed";
    case "unsupported":
      return "Recording unavailable";
    default:
      return "Not checked";
  }
}

function getRecordingErrorMessage(error: unknown): string {
  if (!(error instanceof DOMException)) {
    return "Recording did not start. Try again, or upload a saved take below.";
  }

  switch (error.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Microphone permission is blocked. Allow mic access in the browser address bar, then try again.";
    case "NotFoundError":
      return "No microphone was found. Connect or enable one, then try again.";
    case "NotReadableError":
      return "Your microphone is busy in another app or tab. Close the other app, then try again.";
    case "NotSupportedError":
      return "This browser cannot record audio here. Try Chrome or Safari over HTTPS, or upload an audio file instead.";
    default:
      return "Recording did not start. Try again, or upload a saved take below.";
  }
}

function buildCueCards(story: StoryDraft): Array<{ label: string; text: string }> {
  return [
    { label: "Situation", text: story.situation },
    { label: "Task", text: story.task },
    { label: "Action", text: story.action },
    { label: "Result", text: story.result },
    { label: "Reflection", text: story.reflection },
  ].filter((item) => item.text.trim().length > 0);
}

export default function StoryRehearsalStudio({
  story,
}: StoryRehearsalStudioProps) {
  const [takes, setTakes] = useState<StoryTake[]>([]);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [microphoneStatus, setMicrophoneStatus] =
    useState<MicrophoneStatus>("unknown");
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingRecorder, setIsPreparingRecorder] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const takesRef = useRef<StoryTake[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);

  const cueCards = useMemo(() => buildCueCards(story), [story]);
  const secureContext =
    typeof window !== "undefined"
      ? window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      : false;
  const recordingSupported =
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;
  const canAttemptRecording = recordingSupported && secureContext;

  useEffect(() => {
    takesRef.current = takes;
  }, [takes]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      takesRef.current.forEach((take) => {
        window.URL.revokeObjectURL(take.url);
      });
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const appendTake = (take: StoryTake) => {
    setTakes((previous) => {
      const next = [take, ...previous];
      const trimmed = next.slice(0, 5);

      next.slice(5).forEach((staleTake) => {
        window.URL.revokeObjectURL(staleTake.url);
      });

      return trimmed;
    });
  };

  const removeTake = (takeId: string) => {
    setTakes((previous) => {
      const target = previous.find((take) => take.id === takeId);
      if (target) {
        window.URL.revokeObjectURL(target.url);
      }

      return previous.filter((take) => take.id !== takeId);
    });
  };

  const clearTakes = () => {
    setTakes((previous) => {
      previous.forEach((take) => {
        window.URL.revokeObjectURL(take.url);
      });

      return [];
    });
  };

  const requestMicrophoneAccess = async () => {
    if (!recordingSupported) {
      setMicrophoneStatus("unsupported");
      setRecordingError(
        "This browser does not expose live recording here. Use Chrome or Safari over HTTPS, or upload an audio file instead.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStatus("granted");
      setRecordingError(null);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setMicrophoneStatus(
        error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "SecurityError")
          ? "denied"
          : "prompt",
      );
      setRecordingError(getRecordingErrorMessage(error));
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    setIsRecording(false);
    stopTimer();
    const startedAt = recordingStartedAtRef.current;
    if (startedAt !== null) {
      setElapsedSeconds(
        Math.max(1, Math.round((window.performance.now() - startedAt) / 1000)),
      );
    }
  };

  const startRecording = async () => {
    if (!recordingSupported || !secureContext) {
      setMicrophoneStatus("unsupported");
      setRecordingError(
        secureContext
          ? "This browser does not expose live recording here. Use Chrome or Safari over HTTPS, or upload an audio file instead."
          : "Live recording needs HTTPS or localhost. Open the deployed app on a secure domain, then try again.",
      );
      return;
    }

    try {
      setIsPreparingRecorder(true);
      setRecordingError(null);
      setElapsedSeconds(0);
      chunksRef.current = [];
      mediaRecorderRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setMicrophoneStatus("granted");

      const recorderOptions = getSupportedRecorderOptions();
      const recorder = recorderOptions
        ? new MediaRecorder(stream, recorderOptions)
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onerror = () => {
        setRecordingError(
          "The browser failed while recording this take. Try again or upload a saved file instead.",
        );
      };
      recorder.onstop = () => {
        const mimeType =
          recorder.mimeType ||
          chunksRef.current[chunksRef.current.length - 1]?.type ||
          recorderOptions?.mimeType ||
          "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (blob.size > 0) {
          const storyLabel = story.title.trim() || "story-take";
          appendTake({
            id: `${Date.now()}`,
            label: `${storyLabel} take ${takesRef.current.length + 1}`,
            url: window.URL.createObjectURL(blob),
            downloadName: `${storyLabel.replaceAll(/\s+/g, "-").toLowerCase()}-take-${takesRef.current.length + 1}.${getAudioExtension(mimeType)}`,
            durationSeconds:
              recordingStartedAtRef.current !== null
                ? Math.max(
                    1,
                    Math.round(
                      (window.performance.now() -
                        recordingStartedAtRef.current) /
                        1000,
                    ),
                  )
                : null,
            source: "recorded",
          });
        }

        mediaRecorderRef.current = null;
        recordingStartedAtRef.current = null;
        stopMicrophone();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = window.performance.now();
      setIsRecording(true);
      setIsPreparingRecorder(false);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((previous) => previous + 1);
      }, 1000);
    } catch (error) {
      setMicrophoneStatus(
        error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "SecurityError")
          ? "denied"
          : "prompt",
      );
      setRecordingError(getRecordingErrorMessage(error));
      stopMicrophone();
      stopTimer();
      setIsRecording(false);
      setIsPreparingRecorder(false);
      recordingStartedAtRef.current = null;
    }
  };

  const importTake = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setRecordingError(null);
    appendTake({
      id: `${Date.now()}`,
      label: file.name || `${story.title || "story"} uploaded take`,
      url: window.URL.createObjectURL(file),
      downloadName: file.name || "uploaded-story-take",
      durationSeconds: null,
      source: "uploaded",
    });
    event.target.value = "";
  };

  const primaryButtonLabel = isPreparingRecorder
    ? "Starting microphone..."
    : isRecording
      ? "Stop and save take"
      : "Record story now";

  return (
    <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Story rehearsal studio
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-950">
            Record the story, play it back, and tighten your confidence.
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            This is your repetition lane. Listen for filler words, rushed pacing,
            weak ownership, and places where the proof still sounds vague.
          </p>
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-700">
          Current take length
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {formatClock(elapsedSeconds)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Cue card
              </p>
              <h4 className="mt-1 text-xl font-semibold text-slate-950">
                {story.title.trim() || "Current story draft"}
              </h4>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
              {cueCards.length} active sections
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {cueCards.length ? (
              cueCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/85 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-600">
                Build out the story sections first, then use this studio to
                rehearse the full answer out loud.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Live rehearsal
          </p>
          <h4 className="mt-2 text-xl font-semibold">
            Nothing records automatically. Press the button below to start.
          </h4>
          <p className="mt-2 text-sm leading-6 text-white/78">
            Use the same story three times in a row. Your goal is to sound calm,
            specific, and owned, not memorized.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isPreparingRecorder || !canAttemptRecording}
              className={classNames(
                "rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(15,23,42,0.18)] disabled:cursor-not-allowed disabled:opacity-60",
                isRecording
                  ? "bg-rose-500 text-white hover:bg-rose-400"
                  : "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
              )}
            >
              {primaryButtonLabel}
            </button>
            <button
              type="button"
              onClick={requestMicrophoneAccess}
              disabled={isRecording || isPreparingRecorder || !recordingSupported}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Check microphone
            </button>
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              disabled={isRecording || isPreparingRecorder}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Upload take
            </button>
          </div>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={importTake}
            className="hidden"
          />

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
              Microphone: {getMicrophoneStatusLabel(microphoneStatus)}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
              Secure context: {secureContext ? "ready" : "not secure"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
              Saved takes: {takes.length}
            </span>
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/82">
            Listen for:
            <div className="mt-3 grid gap-2">
              <div className="rounded-2xl bg-black/10 p-3">
                Whether the first 20 seconds set stakes fast enough.
              </div>
              <div className="rounded-2xl bg-black/10 p-3">
                Whether you sound like the decision-maker instead of part of an anonymous team.
              </div>
              <div className="rounded-2xl bg-black/10 p-3">
                Whether the result lands with a real metric, delta, or business consequence.
              </div>
            </div>
          </div>
        </div>
      </div>

      {recordingError ? (
        <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {recordingError}
        </div>
      ) : null}

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/82 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Playback deck
            </p>
            <h4 className="mt-1 text-xl font-semibold text-slate-950">
              Replay your takes until the story sounds earned.
            </h4>
          </div>
          {takes.length ? (
            <button
              type="button"
              onClick={clearTakes}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Clear takes
            </button>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {takes.length ? (
            takes.map((take) => (
              <div
                key={take.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-950">
                        {take.label}
                      </p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {take.source === "recorded" ? "Recorded here" : "Uploaded"}
                      </span>
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                        {formatClock(take.durationSeconds)}
                      </span>
                    </div>
                    <audio controls src={take.url} className="mt-3 w-full" />
                    <a
                      href={take.url}
                      download={take.downloadName}
                      className="mt-3 inline-flex text-sm font-semibold text-cyan-900 hover:text-cyan-700"
                    >
                      Download take
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTake(take.id)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-600">
              Your takes will show up here after you record. Play them back and
              listen for rushed pacing, filler words, soft ownership, and a weak
              result landing.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
