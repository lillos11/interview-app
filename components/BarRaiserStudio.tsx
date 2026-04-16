"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  getCompetencyById,
  getInterviewerLensById,
  INTERVIEWER_LENSES,
  reviewInterviewAnswer,
  type DrillRating,
  type InterviewAnswerReview,
  type InterviewerLensId,
  type InterviewQuestion,
} from "@/lib/interview";

interface BarRaiserStudioProps {
  questions: readonly InterviewQuestion[];
  initialQuestionId?: string | null;
  onLogReview?: (
    question: InterviewQuestion,
    review: InterviewAnswerReview,
    durationSeconds: number | null,
  ) => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const ratingMeta: Record<DrillRating, { label: string; badgeClass: string }> = {
  needs_work: {
    label: "Needs work",
    badgeClass: "bg-rose-100 text-rose-900",
  },
  solid: {
    label: "Solid",
    badgeClass: "bg-amber-100 text-amber-900",
  },
  strong: {
    label: "Strong",
    badgeClass: "bg-emerald-100 text-emerald-900",
  },
};

const verdictMeta: Record<
  InterviewAnswerReview["verdict"],
  { badgeClass: string; panelClass: string }
> = {
  below_bar: {
    badgeClass: "bg-rose-100 text-rose-900",
    panelClass: "border-rose-200 bg-rose-50/80",
  },
  borderline: {
    badgeClass: "bg-amber-100 text-amber-900",
    panelClass: "border-amber-200 bg-amber-50/80",
  },
  hire_signal: {
    badgeClass: "bg-cyan-100 text-cyan-900",
    panelClass: "border-cyan-200 bg-cyan-50/80",
  },
  bar_raiser: {
    badgeClass: "bg-emerald-100 text-emerald-900",
    panelClass: "border-emerald-200 bg-emerald-50/80",
  },
};

function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainder}`;
}

const RECORDER_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
] as const;

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

function getRecordingErrorMessage(error: unknown): string {
  if (!(error instanceof DOMException)) {
    return "Recording did not start. Try again, and if the browser still blocks it use the audio upload fallback below.";
  }

  switch (error.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Microphone permission is blocked. Allow microphone access in the browser address bar, then try again.";
    case "NotFoundError":
      return "No microphone was found. Connect or enable a microphone, then try again.";
    case "NotReadableError":
      return "Your microphone is busy in another tab or app. Close the other app using it, then try again.";
    case "NotSupportedError":
      return "This browser cannot record audio in a supported format here. Use the upload fallback below or switch to Chrome or Safari over HTTPS.";
    default:
      return "Recording did not start. Try again, and if the browser still blocks it use the audio upload fallback below.";
  }
}

type MicrophoneStatus = "unknown" | "unsupported" | "prompt" | "granted" | "denied";

function getMicrophoneStatusLabel(status: MicrophoneStatus): string {
  switch (status) {
    case "granted":
      return "Permission granted";
    case "denied":
      return "Permission blocked";
    case "prompt":
      return "Permission needed";
    case "unsupported":
      return "Browser limitation";
    default:
      return "Not checked yet";
  }
}

const ANSWER_DURATION_TARGETS = [60, 90, 120] as const;

function getTimingFeedback(durationSeconds: number, targetSeconds: number) {
  const tolerance = targetSeconds >= 120 ? 20 : 15;
  const delta = durationSeconds - targetSeconds;

  if (Math.abs(delta) <= tolerance) {
    return {
      label: "On target",
      note: "This answer length is in a strong interview window. Keep the structure tight and do not add fluff.",
      badgeClass: "bg-emerald-100 text-emerald-900",
    };
  }

  if (delta < 0) {
    return {
      label: "Too short",
      note: "You are likely skipping stakes, tradeoffs, or proof. Add one concrete decision and one measurable result.",
      badgeClass: "bg-amber-100 text-amber-900",
    };
  }

  return {
    label: "Too long",
    note: "You are likely over-explaining. Cut setup, keep the action sequence crisp, and land the outcome sooner.",
    badgeClass: "bg-rose-100 text-rose-900",
  };
}

export default function BarRaiserStudio({
  questions,
  initialQuestionId,
  onLogReview,
}: BarRaiserStudioProps) {
  const [selectedLensId, setSelectedLensId] =
    useState<InterviewerLensId>("l7_bar_raiser");
  const [selectedQuestionId, setSelectedQuestionId] = useState(() =>
    initialQuestionId &&
    questions.some((question) => question.id === initialQuestionId)
      ? initialQuestionId
      : (questions[0]?.id ?? ""),
  );
  const [answer, setAnswer] = useState("");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [microphoneStatus, setMicrophoneStatus] =
    useState<MicrophoneStatus>("unknown");
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioDownloadName, setRecordedAudioDownloadName] = useState(
    "bar-raiser-answer.webm",
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingRecorder, setIsPreparingRecorder] = useState(false);
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(120);
  const [lastTakeDurationSeconds, setLastTakeDurationSeconds] = useState<
    number | null
  >(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loggedReviewSignature, setLoggedReviewSignature] = useState<
    string | null
  >(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const finalTranscriptRef = useRef("");
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const deferredAnswer = useDeferredValue(answer);
  const selectedLens = useMemo(
    () => getInterviewerLensById(selectedLensId),
    [selectedLensId],
  );
  const activeSelectedQuestionId = useMemo(() => {
    if (questions.some((question) => question.id === selectedQuestionId)) {
      return selectedQuestionId;
    }

    return questions[0]?.id ?? "";
  }, [questions, selectedQuestionId]);
  const selectedQuestion = useMemo(
    () =>
      questions.find((question) => question.id === activeSelectedQuestionId) ??
      questions[0] ??
      null,
    [activeSelectedQuestionId, questions],
  );
  const review = useMemo(
    () =>
      selectedQuestion && deferredAnswer.trim().length
        ? reviewInterviewAnswer(selectedQuestion, deferredAnswer, selectedLensId)
        : null,
    [deferredAnswer, selectedLensId, selectedQuestion],
  );
  const reviewDurationSeconds = useMemo(() => {
    if (lastTakeDurationSeconds !== null) {
      return lastTakeDurationSeconds;
    }

    if (!review) {
      return null;
    }

    return Math.max(30, Math.round((review.wordCount / 140) * 60));
  }, [lastTakeDurationSeconds, review]);
  const timingFeedback = useMemo(
    () =>
      reviewDurationSeconds !== null
        ? getTimingFeedback(reviewDurationSeconds, targetDurationSeconds)
        : null,
    [reviewDurationSeconds, targetDurationSeconds],
  );
  const currentReviewSignature = useMemo(() => {
    if (!selectedQuestion || !deferredAnswer.trim().length) {
      return null;
    }

    return `${selectedQuestion.id}::${deferredAnswer.trim()}`;
  }, [deferredAnswer, selectedQuestion]);
  const hasLoggedCurrentReview =
    currentReviewSignature !== null &&
    loggedReviewSignature === currentReviewSignature;

  const recordingSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "mediaDevices" in navigator &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof window.MediaRecorder !== "undefined";
  const speechRecognitionSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const secureContext =
    typeof window !== "undefined" ? window.isSecureContext : false;
  const canAttemptRecording = recordingSupported && secureContext;
  const primaryRecordingButtonLabel = useMemo(() => {
    if (isPreparingRecorder) {
      return "Preparing mic...";
    }

    if (isRecording) {
      return "Stop recording";
    }

    if (!canAttemptRecording) {
      return "Live recording unavailable here";
    }

    if (microphoneStatus === "granted") {
      return "Record answer now";
    }

    if (microphoneStatus === "denied") {
      return "Allow mic and record";
    }

    return "Record answer now";
  }, [
    canAttemptRecording,
    isPreparingRecorder,
    isRecording,
    microphoneStatus,
  ]);

  useEffect(() => {
    const refreshMicrophoneStatus = async () => {
      if (!recordingSupported || !secureContext) {
        setMicrophoneStatus("unsupported");
        return;
      }

      if (!navigator.permissions?.query) {
        setMicrophoneStatus("prompt");
        return;
      }

      try {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permission.state === "granted") {
          setMicrophoneStatus("granted");
        } else if (permission.state === "denied") {
          setMicrophoneStatus("denied");
        } else {
          setMicrophoneStatus("prompt");
        }
      } catch {
        setMicrophoneStatus("prompt");
      }
    };

    void refreshMicrophoneStatus();
  }, [recordingSupported, secureContext]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      if (recordedAudioUrl) {
        window.URL.revokeObjectURL(recordedAudioUrl);
      }

      try {
        recognitionRef.current?.abort();
      } catch {}

      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [recordedAudioUrl]);

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const requestMicrophoneAccess = async () => {
    if (!recordingSupported || !secureContext) {
      setMicrophoneStatus("unsupported");
      setRecordingError(
        secureContext
          ? "This browser cannot record audio here. Use Chrome or Safari on HTTPS."
          : "Live recording needs HTTPS or localhost. Open the app from a secure origin, then try again.",
      );
      return;
    }

    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStatus("granted");
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

  const revokeRecordedAudioUrl = () => {
    if (!recordedAudioUrl) {
      return;
    }

    window.URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl(null);
  };

  const resetTranscript = () => {
    setAnswer("");
    setLastTakeDurationSeconds(null);
    finalTranscriptRef.current = "";
  };

  const handleQuestionChange = (questionId: string) => {
    setSelectedQuestionId(questionId);
    resetTranscript();
    revokeRecordedAudioUrl();
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      if (typeof mediaRecorderRef.current.requestData === "function") {
        mediaRecorderRef.current.requestData();
      }
      setLastTakeDurationSeconds(elapsedSeconds);
      mediaRecorderRef.current.stop();
    } else {
      stopMicrophone();
    }

    setIsRecording(false);
    setIsPreparingRecorder(false);
    stopTimer();
  };

  const startSpeechRecognition = () => {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalTranscript = finalTranscriptRef.current;
      let interimTranscript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];
        const fragment = result?.[0]?.transcript?.trim() ?? "";

        if (!fragment) {
          continue;
        }

        if (result.isFinal) {
          finalTranscript = `${finalTranscript} ${fragment}`.trim();
        } else {
          interimTranscript = `${interimTranscript} ${fragment}`.trim();
        }
      }

      finalTranscriptRef.current = finalTranscript;
      handleAnswerChange(
        [finalTranscript, interimTranscript].filter(Boolean).join(" ").trim(),
      );
    };
    recognition.onerror = () => {
      setRecordingError(
        "Recording worked, but live transcription was not available for this take.",
      );
    };
    recognition.onend = () => {
      recognitionRef.current = null;
    };
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setRecordingError(
        "Recording started, but live transcription could not start in this browser. You can still score the answer from the text box.",
      );
    }
  };

  const startRecording = async () => {
    if (!recordingSupported || !secureContext) {
      setMicrophoneStatus("unsupported");
      setRecordingError(
        secureContext
          ? "This browser does not expose live recording here. Use the audio upload fallback below or switch to Chrome or Safari over HTTPS."
          : "Live recording needs HTTPS or localhost. Open the app from a secure origin, then try again.",
      );
      return;
    }

    try {
      setIsPreparingRecorder(true);
      setRecordingError(null);
      setElapsedSeconds(0);
      resetTranscript();
      chunksRef.current = [];
      mediaRecorderRef.current = null;

      revokeRecordedAudioUrl();
      setRecordedAudioDownloadName("bar-raiser-answer.webm");

      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
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
          "The browser failed while recording this take. Try again or use the audio upload fallback below.",
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
          setRecordedAudioUrl(window.URL.createObjectURL(blob));
          setRecordedAudioDownloadName(
            `bar-raiser-answer.${getAudioExtension(mimeType)}`,
          );
        }

        mediaRecorderRef.current = null;
        stopMicrophone();
      };
      recorder.start();

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPreparingRecorder(false);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((previous) => previous + 1);
      }, 1000);

      if (speechRecognitionSupported) {
        startSpeechRecognition();
      }
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
    }
  };

  const importAudioTake = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setRecordingError(null);
    setIsRecording(false);
    setIsPreparingRecorder(false);
    stopTimer();
    stopMicrophone();
    resetTranscript();
    revokeRecordedAudioUrl();
    setRecordedAudioUrl(window.URL.createObjectURL(file));
    setRecordedAudioDownloadName(file.name || "bar-raiser-answer.webm");
    setLastTakeDurationSeconds(null);
    setElapsedSeconds(0);
    event.target.value = "";
  };

  const shuffleQuestion = () => {
    if (questions.length < 2 || !selectedQuestion) {
      return;
    }

    const candidates = questions.filter(
      (question) => question.id !== selectedQuestion.id,
    );
    const next = candidates[Math.floor(Math.random() * candidates.length)];

    if (next) {
      handleQuestionChange(next.id);
    }
  };

  const logCurrentReview = () => {
    if (
      !review ||
      !selectedQuestion ||
      hasLoggedCurrentReview ||
      !onLogReview
    ) {
      return;
    }

    onLogReview(selectedQuestion, review, reviewDurationSeconds);
    setLoggedReviewSignature(currentReviewSignature);
  };

  if (!questions.length) {
    return (
      <section className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
        <p className="text-sm text-slate-700">
          No questions are available in this lane yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Elite Bar Raiser
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Practice with a stricter scorecard than most interviewers will
              use.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              This mode is intentionally tough. If your answer lacks proof,
              ownership, tradeoffs, or clean delivery, it will call that out.
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-700">
            The fastest path to elite answers:
            <div className="mt-2 grid gap-2 text-slate-900">
              <div>1. Record a live take.</div>
              <div>2. Review the transcript honestly.</div>
              <div>3. Repeat until the weak spot disappears.</div>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Prompt control
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                Choose the interviewer pressure.
              </h3>
            </div>
            <button
              type="button"
              onClick={shuffleQuestion}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Harder prompt
            </button>
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-slate-700">Question</span>
            <select
              value={activeSelectedQuestionId}
              onChange={(event) => handleQuestionChange(event.target.value)}
            >
              {questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.sourceCategoryLabel}: {question.title}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/82 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Interviewer lens
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Pick the interviewer you want to beat. The scorecard stays
                  strict, but the follow-up pressure shifts with the lens.
                </p>
              </div>
              <select
                value={selectedLensId}
                onChange={(event) => {
                  const nextLensId = event.target.value as InterviewerLensId;
                  setSelectedLensId(nextLensId);
                  setTargetDurationSeconds(
                    getInterviewerLensById(nextLensId).targetDurationSeconds,
                  );
                }}
                className="min-w-[180px]"
              >
                {INTERVIEWER_LENSES.map((lens) => (
                  <option key={lens.id} value={lens.id}>
                    {lens.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {selectedLens.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedLens.demands.map((demand) => (
                <span
                  key={demand}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {demand}
                </span>
              ))}
            </div>
          </div>

          {selectedQuestion ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                    {selectedQuestion.sourceCategoryLabel}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                    {getCompetencyById(selectedQuestion.competency).title}
                  </span>
                  {selectedQuestion.managerOnly ? (
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100">
                      Manager only
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-xl font-semibold leading-8">
                  {selectedQuestion.prompt}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Strong answers include
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedQuestion.listenFors.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-slate-950">
                    Expected pressure follow-ups
                  </p>
                  <div className="mt-3 space-y-2">
                    {selectedQuestion.followUps.map((followUp) => (
                      <div key={followUp} className="rounded-2xl bg-white p-3">
                        {followUp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </article>

        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Recording studio
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                Tap record, answer out loud, then inspect the evidence.
              </h3>
            </div>
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              {formatClock(elapsedSeconds)}
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-white/82 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Answer target
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Elite answers usually land cleanly inside a deliberate time
                  box instead of wandering.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ANSWER_DURATION_TARGETS.map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() => setTargetDurationSeconds(seconds)}
                    className={classNames(
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      targetDurationSeconds === seconds
                        ? "bg-slate-950 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:border-cyan-400",
                    )}
                  >
                    {formatClock(seconds)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Live take
            </p>
            <h4 className="mt-2 text-xl font-semibold">
              Nothing records automatically. Press the button below to start.
            </h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/78">
              Use this like a real interview rep: start the take, answer out
              loud, stop the recording, then score the transcript brutally.
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
                {primaryRecordingButtonLabel}
              </button>
              <button
                type="button"
                onClick={requestMicrophoneAccess}
                disabled={isRecording || isPreparingRecorder || !canAttemptRecording}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Check microphone
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
                Microphone: {getMicrophoneStatusLabel(microphoneStatus)}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
                Secure context: {secureContext ? "ready" : "not secure"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/82">
                Transcript:{" "}
                {speechRecognitionSupported ? "live when supported" : "manual"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isPreparingRecorder || !canAttemptRecording}
              className={classNames(
                "rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] disabled:cursor-not-allowed disabled:opacity-60",
                isRecording
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-slate-950 hover:bg-slate-800",
              )}
            >
              {primaryRecordingButtonLabel}
            </button>
            <button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              disabled={isRecording || isPreparingRecorder}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Upload audio
            </button>
            <button
              type="button"
              onClick={resetTranscript}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Clear transcript
            </button>
          </div>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={importAudioTake}
            className="hidden"
          />

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Microphone
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {getMicrophoneStatusLabel(microphoneStatus)}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Live transcript
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {speechRecognitionSupported
                  ? "Supported in this browser"
                  : "Manual edit or paste needed"}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Rating mode
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {selectedLens.label} pressure
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/90 p-4 text-sm leading-6 text-slate-700">
            Live recording works best on localhost or HTTPS with microphone
            permission enabled. If the big record button is disabled, the page
            is not in a browser context that allows mic capture. Secure
            context:{" "}
            <span className="font-semibold text-slate-950">
              {secureContext ? "ready" : "not secure"}
            </span>
            . If the browser still blocks the mic, upload an audio file and
            score the transcript manually.
          </div>

          {recordingError ? (
            <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {recordingError}
            </div>
          ) : null}

          {recordedAudioUrl ? (
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/85 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Last take
              </p>
              <audio controls src={recordedAudioUrl} className="mt-3 w-full" />
              <a
                href={recordedAudioUrl}
                download={recordedAudioDownloadName}
                className="mt-3 inline-flex text-sm font-semibold text-cyan-900 hover:text-cyan-700"
              >
                Download recording
              </a>
            </div>
          ) : null}

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              Transcript or answer notes
            </span>
            <textarea
              rows={8}
              value={answer}
              onChange={(event) => handleAnswerChange(event.target.value)}
              placeholder="Record a take or paste what you said here. The score updates from this text."
            />
          </label>
        </article>
      </div>

      {review ? (
        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Harsh scorecard
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                The answer does not get the benefit of the doubt.
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                {review.summary}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reviewer lens: {review.interviewerLabel}
              </p>
            </div>
            <div
              className={classNames(
                "rounded-[24px] border px-5 py-4",
                verdictMeta[review.verdict].panelClass,
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={classNames(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    verdictMeta[review.verdict].badgeClass,
                  )}
                >
                  {review.verdictLabel}
                </span>
                <span
                  className={classNames(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    ratingMeta[review.rating].badgeClass,
                  )}
                >
                  {ratingMeta[review.rating].label}
                </span>
              </div>
              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {review.score}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-600">
                Overall score
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Words
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {review.wordCount}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Metrics
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {review.metricsCount}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Fillers
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {review.fillerCount}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Most important correction
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                {review.misses[0] ??
                  "Keep the standard high and repeat the same question once more."}
              </p>
            </div>
          </div>

          {timingFeedback && reviewDurationSeconds !== null ? (
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/82 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Timing pressure
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {timingFeedback.note}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      timingFeedback.badgeClass,
                    )}
                  >
                    {timingFeedback.label}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {formatClock(reviewDurationSeconds)}{" "}
                    {lastTakeDurationSeconds !== null
                      ? "measured"
                      : "estimated"}
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                    Target {formatClock(targetDurationSeconds)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 xl:grid-cols-5">
            {review.dimensions.map((dimension) => (
              <div
                key={dimension.id}
                className="rounded-[24px] border border-slate-200 bg-white/82 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">
                    {dimension.label}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {dimension.score}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {dimension.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What this interviewer expects
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                  {review.interviewerExpectations.map((expectation) => (
                    <div
                      key={expectation}
                      className="rounded-2xl bg-cyan-50 p-3 text-cyan-950"
                    >
                      {expectation}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What worked
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                  {review.strengths.length ? (
                    review.strengths.map((strength) => (
                      <div
                        key={strength}
                        className="rounded-2xl bg-emerald-50 p-3 text-emerald-950"
                      >
                        {strength}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-3">
                      No major strengths logged yet. That is useful signal, not
                      a failure.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Pressure follow-ups
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                  {review.followUps.map((followUp) => (
                    <div key={followUp} className="rounded-2xl bg-slate-50 p-3">
                      {followUp}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What still misses
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                  {review.misses.map((miss) => (
                    <div
                      key={miss}
                      className="rounded-2xl bg-rose-50 p-3 text-rose-950"
                    >
                      {miss}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Rewrite this answer
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-white/88">
                  {review.rewriteMoves.map((move) => (
                    <div
                      key={move}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      {move}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {onLogReview ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={logCurrentReview}
                disabled={hasLoggedCurrentReview}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasLoggedCurrentReview
                  ? "Logged to cockpit"
                  : "Log this rating to your readiness"}
              </button>
              <p className="self-center text-sm text-slate-600">
                Only log takes you want counted in your prep history.
              </p>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
