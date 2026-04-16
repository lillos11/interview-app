"use client";

import { useMemo, useState } from "react";

import {
  buildExecutiveCoachReply,
  EXECUTIVE_COACH_STARTER_PROMPTS,
  type ExecutiveCoachReply,
} from "@/lib/executiveCoach";
import {
  INTERVIEW_SOURCE_FAMILY_LABELS,
  type CompetencyId,
  type InterviewPrepProgress,
  type InterviewQuestion,
  type InterviewQuestionCategory,
  type StoryDraft,
} from "@/lib/interview";

interface ExecutiveCoachPanelProps {
  progress: InterviewPrepProgress;
  selectedFamily: "lp" | "functional";
  selectedCategory: InterviewQuestionCategory | null;
  selectedCompetency: CompetencyId | "all";
  storyDraft: StoryDraft;
  currentQuestion: InterviewQuestion | null;
  onPracticeQuestion: (questionId: string) => void;
  onLoadPrepDeckStory: (storyId: string) => void;
  onLoadSavedStory: (storyId: string) => void;
}

interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  reply?: ExecutiveCoachReply;
}

function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

function createMessageId(): string {
  return `coach-${Math.random().toString(36).slice(2, 10)}`;
}

function modeLabel(mode: ExecutiveCoachReply["mode"]): string {
  switch (mode) {
    case "opener":
      return "Opener";
    case "story":
      return "Story";
    case "pressure":
      return "Pressure";
    case "weakness":
      return "Diagnosis";
    case "drill":
      return "Drill";
    default:
      return "Brief";
  }
}

function renderReply(
  reply: ExecutiveCoachReply,
  onPracticeQuestion: (questionId: string) => void,
  onLoadPrepDeckStory: (storyId: string) => void,
  onLoadSavedStory: (storyId: string) => void,
) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
          {modeLabel(reply.mode)}
        </span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
          Executive Elite Coach
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-950">
        {reply.title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{reply.summary}</p>

      {reply.executiveRewrite ? (
        <div className="mt-4 rounded-[22px] bg-slate-950 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Executive version
          </p>
          <p className="mt-3 text-sm leading-7 text-white/90">
            {reply.executiveRewrite}
          </p>
        </div>
      ) : null}

      {reply.debriefReadout ? (
        <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Debrief readout
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-800">
            {reply.debriefReadout}
          </p>
        </div>
      ) : null}

      {reply.hardTruths.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Hard truths
          </p>
          <div className="mt-3 space-y-2">
            {reply.hardTruths.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-sm leading-6 text-rose-950"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {reply.repairPlan.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Repair plan
          </p>
          <div className="mt-3 space-y-2">
            {reply.repairPlan.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-3 text-sm leading-6 text-cyan-950"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {reply.nextMoves.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Next moves
          </p>
          <div className="mt-3 space-y-2">
            {reply.nextMoves.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-sm leading-6 text-emerald-950"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {reply.recommendedQuestion ? (
        <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/90 p-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {reply.recommendedQuestion.categoryLabel}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Lens: {reply.recommendedQuestion.recommendedLensId.replaceAll("_", " ")}
            </span>
            {reply.recommendedQuestion.managerOnly ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                Manager only
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-950">
            {reply.recommendedQuestion.prompt}
          </p>
          {reply.recommendedQuestion.followUps.length ? (
            <div className="mt-3 space-y-2">
              {reply.recommendedQuestion.followUps.map((followUp) => (
                <div
                  key={followUp}
                  className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-700"
                >
                  {followUp}
                </div>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => onPracticeQuestion(reply.recommendedQuestion?.id ?? "")}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Open in Bar Raiser
          </button>
        </div>
      ) : null}

      {reply.recommendedStories.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Story references
          </p>
          <div className="mt-3 grid gap-3">
            {reply.recommendedStories.map((story) => (
              <div
                key={`${story.source}-${story.id}`}
                className="rounded-[22px] border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {story.source === "prep_deck" ? "Prep deck" : "Saved story"}
                  </span>
                  {story.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {story.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.detail}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    story.source === "prep_deck"
                      ? onLoadPrepDeckStory(story.id)
                      : onLoadSavedStory(story.id)
                  }
                  className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  {story.source === "prep_deck"
                    ? "Load in STAR Lab"
                    : "Edit saved story"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function ExecutiveCoachPanel({
  progress,
  selectedFamily,
  selectedCategory,
  selectedCompetency,
  storyDraft,
  currentQuestion,
  onPracticeQuestion,
  onLoadPrepDeckStory,
  onLoadSavedStory,
}: ExecutiveCoachPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoachMessage[]>([]);

  const context = useMemo(
    () => ({
      message: "",
      progress,
      selectedFamily,
      selectedCategory,
      selectedCompetency,
      storyDraft,
      currentQuestion,
    }),
    [
      currentQuestion,
      progress,
      selectedCategory,
      selectedCompetency,
      selectedFamily,
      storyDraft,
    ],
  );

  const briefing = useMemo(
    () => buildExecutiveCoachReply(context),
    [context],
  );

  const sendPrompt = (prompt: string) => {
    const trimmed = prompt.trim();

    if (!trimmed) {
      return;
    }

    const reply = buildExecutiveCoachReply({
      ...context,
      message: trimmed,
    });

    setMessages((previous) => [
      ...previous,
      { id: createMessageId(), role: "user", content: trimmed },
      { id: createMessageId(), role: "assistant", reply },
    ]);
    setInput("");
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-4">
        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Executive context
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Coach the lane you are actually in.
          </h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
              Family:{" "}
              <span className="font-semibold text-slate-950">
                {INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}
              </span>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
              Category:{" "}
              <span className="font-semibold text-slate-950">
                {selectedCategory ? selectedCategory.label : "All categories"}
              </span>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
              Coaching lane:{" "}
              <span className="font-semibold text-slate-950">
                {selectedCompetency === "all"
                  ? "All lanes"
                  : selectedCompetency.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Executive briefing
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                The coach starts with a point of view.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Reset chat
            </button>
          </div>
          <div className="mt-4">
            {renderReply(
              briefing,
              onPracticeQuestion,
              onLoadPrepDeckStory,
              onLoadSavedStory,
            )}
          </div>
        </article>

        <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Fast prompts
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...EXECUTIVE_COACH_STARTER_PROMPTS, ...briefing.suggestedPrompts]
              .filter((prompt, index, prompts) => prompts.indexOf(prompt) === index)
              .map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendPrompt(prompt)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  {prompt}
                </button>
              ))}
          </div>
        </article>
      </div>

      <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Executive chat
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Ask for harder feedback, better framing, or the next best rep.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          This coach is calibrated to be useful, not flattering. Ask for
          sharper stories, a harder drill, a cleaner opener, or the weak point
          you are still avoiding.
        </p>

        <div className="mt-5 space-y-4">
          {messages.length ? (
            messages.map((message) =>
              message.role === "user" ? (
                <div
                  key={message.id}
                  className="ml-auto max-w-2xl rounded-[22px] bg-slate-950 px-4 py-3 text-sm leading-6 text-white"
                >
                  {message.content}
                </div>
              ) : message.reply ? (
                <div key={message.id}>
                  {renderReply(
                    message.reply,
                    onPracticeQuestion,
                    onLoadPrepDeckStory,
                    onLoadSavedStory,
                  )}
                </div>
              ) : null,
            )
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 p-6 text-sm leading-7 text-slate-600">
              Start with a direct request like{" "}
              <span className="font-semibold text-slate-950">
                &ldquo;Pressure-test my current story&rdquo;
              </span>{" "}
              or{" "}
              <span className="font-semibold text-slate-950">
                &ldquo;Give me the hardest question in this lane&rdquo;
              </span>
              .
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendPrompt(input);
          }}
          className="mt-5 space-y-3"
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              Coach request
            </span>
            <textarea
              rows={4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Examples: Rewrite my opener to sound more senior. Pressure-test my current story. What is my weakest signal right now?"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!input.trim().length}
              className={classNames(
                "rounded-full px-5 py-3 text-sm font-semibold text-white",
                input.trim().length
                  ? "bg-slate-950"
                  : "cursor-not-allowed bg-slate-400",
              )}
            >
              Ask the coach
            </button>
            <button
              type="button"
              onClick={() => sendPrompt("What is my weakest interview signal right now?")}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Diagnose me
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
