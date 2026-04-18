"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import {
  AMAZON_PREP_DECK_INTERVIEW_DAY_REMINDERS,
  AMAZON_PREP_DECK_PANEL_PLAN,
  AMAZON_PREP_DECK_PITCH_TEMPLATE,
  AMAZON_PREP_DECK_QUESTIONS_TO_ASK,
  AMAZON_PREP_DECK_STORIES,
  buildPrepDeckElitePreview,
  buildPrepDeckEliteStoryDraft,
  buildPrepDeckStoryDraft,
  getPrepDeckRouteByCategory,
  getPrepDeckStoriesForCategory,
  getPrepDeckStoriesForFamily,
  getPrepDeckStoryById,
  type PrepDeckElitePreview,
  type PrepDeckStoryTemplate,
} from "@/lib/amazonPrepDeck";
import {
  buildBarRaiserAmplification,
  buildEnduranceLoopPlan,
  buildEliteStoryDraft,
  buildEliteStoryPolish,
  buildPrepMomentumDashboard,
  buildReadinessForecast,
  buildStoryScorecardSuggestions,
  buildStoryCalibrationReport,
  buildStoryPivotPack,
  buildStoryPressureTest,
  buildStorySaturationReport,
  buildPitchPreview,
  buildStarCoachTips,
  coerceInterviewProgress,
  createEmptyStoryDraft,
  createInitialInterviewProgress,
  deleteStarStory,
  GAME_DAY_CHECKLIST,
  getAmazonCoverageSummary,
  getCompetencyById,
  getCompetencyConfidence,
  getInterviewQuestionById,
  getOverallReadiness,
  getPromptReadiness,
  getQuestionCategoriesByFamily,
  getQuestionCategoryById,
  getRelatedQuestionPrompts,
  getStoryCoverage,
  getStoryCategoryCoverage,
  getTopPassBlockers,
  getWeakestCompetency,
  INTERVIEW_COMPETENCIES,
  INTERVIEW_QUESTIONS,
  INTERVIEW_RESCUE_SCRIPTS,
  INTERVIEW_SOURCE_FAMILY_LABELS,
  INTERVIEW_STAGES,
  INTERVIEW_STORAGE_KEY,
  NEGOTIATION_REMINDERS,
  pickDrillQuestions,
  recordBarRaiserReview,
  recordDrillResult,
  RED_FLAGS,
  reviewStarStory,
  saveStarStory,
  toggleChecklistItem,
  updateCareerProfile,
  updatePitchPack,
  type BarRaiserAmplificationField,
  type CompetencyId,
  type DrillRating,
  type InterviewAnswerReview,
  type InterviewCareerProfile,
  type InterviewPrepProgress,
  type InterviewQuestion,
  type InterviewerLensId,
  type InterviewSourceFamily,
  type PrepTabTarget,
  type StoryPivotNode,
  type StoryDraft,
} from "@/lib/interview";
import BarRaiserStudio from "@/components/BarRaiserStudio";
import ExecutiveCoachPanel from "@/components/ExecutiveCoachPanel";
import StoryRehearsalStudio from "@/components/StoryRehearsalStudio";

type InterviewTab = PrepTabTarget;
type CompetencyFilter = CompetencyId | "all";
type CategoryFilter = string | "all";
type EditableStoryField =
  | "competency"
  | "title"
  | "situation"
  | "task"
  | "action"
  | "result"
  | "reflection";
type StoryWriterField =
  | "titleHint"
  | "context"
  | "stakes"
  | "actions"
  | "result"
  | "lesson";
type CareerProfileField =
  | "currentRole"
  | "currentLevel"
  | "targetRole"
  | "targetLevel"
  | "currentTotalComp"
  | "targetTotalComp";

const tabs: Array<{ id: InterviewTab; label: string }> = [
  { id: "cockpit", label: "Cockpit" },
  { id: "star_lab", label: "STAR Lab" },
  { id: "drills", label: "Mock Drills" },
  { id: "bar_raiser", label: "Bar Raiser" },
  { id: "executive_coach", label: "Exec Coach" },
  { id: "frameworks", label: "Question Bank" },
  { id: "game_day", label: "Game Day" },
];

const drillLengthOptions = [3, 5, 8] as const;
const amazonFamilies: InterviewSourceFamily[] = ["lp", "functional"];

function createEmptyStoryWriterInput() {
  return {
    titleHint: "",
    context: "",
    stakes: "",
    actions: "",
    result: "",
    lesson: "",
  };
}

const ratingMeta: Record<
  DrillRating,
  {
    label: string;
    buttonClass: string;
    badgeClass: string;
    summaryClass: string;
  }
> = {
  needs_work: {
    label: "Needs work",
    buttonClass:
      "border border-rose-300 bg-rose-50 text-rose-900 hover:border-rose-400",
    badgeClass: "bg-rose-100 text-rose-900",
    summaryClass: "text-rose-700",
  },
  solid: {
    label: "Solid",
    buttonClass:
      "border border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400",
    badgeClass: "bg-amber-100 text-amber-900",
    summaryClass: "text-amber-700",
  },
  strong: {
    label: "Strong",
    buttonClass:
      "border border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400",
    badgeClass: "bg-emerald-100 text-emerald-900",
    summaryClass: "text-emerald-700",
  },
};

const checklistPhaseLabels: Record<
  (typeof GAME_DAY_CHECKLIST)[number]["phase"],
  string
> = {
  "48_hours": "48 hours before",
  "60_minutes": "60 minutes before",
  post_round: "After the round",
};

function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

function PrepDeckStoryCard({
  story,
  elitePreview,
  expanded,
  onToggle,
  onLoadElite,
  onLoadSource,
  emphasisLabel,
}: {
  story: PrepDeckStoryTemplate;
  elitePreview: PrepDeckElitePreview;
  expanded: boolean;
  onToggle: () => void;
  onLoadElite: () => void;
  onLoadSource: () => void;
  emphasisLabel?: string;
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
              Story {story.storyNumber}
            </span>
            {emphasisLabel ? (
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                {emphasisLabel}
              </span>
            ) : null}
            <h3 className="text-lg font-semibold text-slate-950">
              {story.title}
            </h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {story.keyNumbers.map((item) => (
              <span
                key={item}
                className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900"
              >
                {item}
              </span>
            ))}
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Source {elitePreview.sourceScore}%
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
              Elite start {elitePreview.polishedScore}%
            </span>
            {elitePreview.scoreDelta > 0 ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
                +{elitePreview.scoreDelta} polish
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {story.reflection}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
            Primary LPs: {story.primaryPrinciples.join(" · ")}
          </p>
          {story.secondaryPrinciples.length ? (
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
              Secondary LPs: {story.secondaryPrinciples.join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
          >
            {expanded ? "Hide details" : "Show details"}
          </button>
          <button
            type="button"
            onClick={onLoadElite}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Load elite start
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Situation
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.situation}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Task
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.task}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Action
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.action}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Result
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.result}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Reflection
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {story.reflection}
                </p>
              </div>
              {story.whatChanged ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    What changed
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {story.whatChanged}
                  </p>
                </div>
              ) : null}
              {story.followUpQuestions.length ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Follow-up gauntlet
                  </p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {story.followUpQuestions.map((item) => (
                      <div key={item} className="rounded-2xl bg-white p-3">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Amazon categories
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {story.categoryIds.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {getQuestionCategoryById(categoryId).label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  Elite path
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {elitePreview.headline}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onLoadElite}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Start from elite version
                </button>
                <button
                  type="button"
                  onClick={onLoadSource}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  Load source version
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                Source {elitePreview.sourceScore}%
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900">
                Elite start {elitePreview.polishedScore}%
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
              {elitePreview.adjustments.map((item) => (
                <div key={item} className="rounded-2xl bg-white p-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {elitePreview.remainingGaps.length ? (
            <div className="rounded-[22px] border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                Still blocking elite
              </p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
                {elitePreview.remainingGaps.map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function readinessLabel(score: number): string {
  if (score >= 85) {
    return "Dialed in";
  }
  if (score >= 70) {
    return "Competitive";
  }
  if (score >= 50) {
    return "Building range";
  }
  return "Early reps";
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function countDrillRatings(
  ratings: readonly (DrillRating | null)[],
): Record<DrillRating, number> {
  return ratings.reduce(
    (result, rating) => {
      if (rating) {
        result[rating] += 1;
      }
      return result;
    },
    {
      needs_work: 0,
      solid: 0,
      strong: 0,
    },
  );
}

export default function HomePage() {
  const [progress, setProgress] = useState<InterviewPrepProgress>(() =>
    createInitialInterviewProgress(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<InterviewTab>("cockpit");
  const [selectedFamily, setSelectedFamily] =
    useState<InterviewSourceFamily>("lp");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryFilter>("all");
  const [selectedCompetency, setSelectedCompetency] =
    useState<CompetencyFilter>("all");

  const [questionBankIndex, setQuestionBankIndex] = useState(0);

  const [drillLength, setDrillLength] =
    useState<(typeof drillLengthOptions)[number]>(5);
  const [drillQuestions, setDrillQuestions] = useState<InterviewQuestion[]>([]);
  const [drillRatings, setDrillRatings] = useState<Array<DrillRating | null>>(
    [],
  );
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillRevealed, setDrillRevealed] = useState(false);
  const [drillRating, setDrillRating] = useState<DrillRating | null>(null);
  const [drillFinished, setDrillFinished] = useState(false);

  const [storyDraft, setStoryDraft] = useState<StoryDraft>(() =>
    createEmptyStoryDraft(),
  );
  const [storyWriterInput, setStoryWriterInput] = useState(() =>
    createEmptyStoryWriterInput(),
  );
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [expandedPrepDeckStoryId, setExpandedPrepDeckStoryId] = useState<
    string | null
  >(null);
  const [storyLoadNotice, setStoryLoadNotice] = useState<string | null>(null);
  const [storyBuilderRevealTick, setStoryBuilderRevealTick] = useState(0);
  const [barRaiserLensId, setBarRaiserLensId] =
    useState<InterviewerLensId | null>(null);
  const [barRaiserQuestionId, setBarRaiserQuestionId] = useState<string | null>(
    null,
  );
  const starLabBuilderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(INTERVIEW_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        const safe = coerceInterviewProgress(parsed);

        startTransition(() => {
          if (safe) {
            setProgress(safe);
          }

          setHydrated(true);
        });
      } catch {
        window.localStorage.removeItem(INTERVIEW_STORAGE_KEY);
        startTransition(() => setHydrated(true));
      }
    } else {
      startTransition(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      INTERVIEW_STORAGE_KEY,
      JSON.stringify(progress),
    );
  }, [hydrated, progress]);

  useEffect(() => {
    if (typeof window === "undefined" || !storyLoadNotice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStoryLoadNotice(null);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [storyLoadNotice]);

  useEffect(() => {
    if (activeTab !== "star_lab" || storyBuilderRevealTick === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      starLabBuilderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, storyBuilderRevealTick]);

  const resetPracticeState = () => {
    setQuestionBankIndex(0);
    setDrillQuestions([]);
    setDrillRatings([]);
    setDrillIndex(0);
    setDrillRevealed(false);
    setDrillRating(null);
    setDrillFinished(false);
  };

  const selectedFamilyCategories = useMemo(
    () => getQuestionCategoriesByFamily(selectedFamily),
    [selectedFamily],
  );
  const effectiveSelectedCategoryId = useMemo(() => {
    if (selectedCategoryId === "all") {
      return "all";
    }

    return selectedFamilyCategories.some(
      (category) => category.id === selectedCategoryId,
    )
      ? selectedCategoryId
      : "all";
  }, [selectedCategoryId, selectedFamilyCategories]);
  const selectedCategory = useMemo(
    () =>
      effectiveSelectedCategoryId === "all"
        ? null
        : (selectedFamilyCategories.find(
            (category) => category.id === effectiveSelectedCategoryId,
          ) ?? getQuestionCategoryById(effectiveSelectedCategoryId)),
    [effectiveSelectedCategoryId, selectedFamilyCategories],
  );
  const categoryGroups = useMemo(
    () =>
      amazonFamilies.map((family) => ({
        family,
        label: INTERVIEW_SOURCE_FAMILY_LABELS[family],
        categories: getQuestionCategoriesByFamily(family),
      })),
    [],
  );
  const filteredCompetencies = useMemo(
    () =>
      selectedCompetency === "all"
        ? INTERVIEW_COMPETENCIES.map((competency) => competency.id)
        : [selectedCompetency],
    [selectedCompetency],
  );
  const familyQuestions = useMemo(
    () =>
      INTERVIEW_QUESTIONS.filter(
        (question) => question.sourceFamily === selectedFamily,
      ),
    [selectedFamily],
  );
  const amazonFilteredQuestions = useMemo(
    () =>
      familyQuestions.filter((question) =>
        effectiveSelectedCategoryId === "all"
          ? true
          : question.sourceCategoryId === effectiveSelectedCategoryId,
      ),
    [effectiveSelectedCategoryId, familyQuestions],
  );
  const filteredQuestions = useMemo(
    () =>
      amazonFilteredQuestions.filter((question) =>
        filteredCompetencies.includes(question.competency),
      ),
    [amazonFilteredQuestions, filteredCompetencies],
  );
  const currentQuestionBankEntry = filteredQuestions.length
    ? filteredQuestions[
        (questionBankIndex + filteredQuestions.length) %
          filteredQuestions.length
      ]
    : null;

  const totalDrillReps = progress.drillHistory.length;
  const totalPitchFields = Object.values(progress.pitch).filter(
    (value) => value.trim().length > 0,
  ).length;

  const readiness = useMemo(() => getOverallReadiness(progress), [progress]);
  const weakestCompetencyId = useMemo(
    () => getWeakestCompetency(progress),
    [progress],
  );
  const weakestCompetency = weakestCompetencyId
    ? getCompetencyById(weakestCompetencyId)
    : null;
  const storyCoverage = useMemo(() => getStoryCoverage(progress), [progress]);
  const storyCategoryCoverage = useMemo(
    () => getStoryCategoryCoverage(progress),
    [progress],
  );
  const pitchPreview = useMemo(
    () => buildPitchPreview(progress.pitch),
    [progress.pitch],
  );
  const liveStoryReview = useMemo(
    () => reviewStarStory(storyDraft),
    [storyDraft],
  );
  const storyCalibrationReport = useMemo(
    () => buildStoryCalibrationReport(storyDraft, progress.careerProfile),
    [progress.careerProfile, storyDraft],
  );
  const liveStoryTips = useMemo(
    () => buildStarCoachTips(storyDraft),
    [storyDraft],
  );
  const eliteStoryPolish = useMemo(
    () => buildEliteStoryPolish(storyDraft),
    [storyDraft],
  );
  const barRaiserAmplification = useMemo(
    () => buildBarRaiserAmplification(storyDraft),
    [storyDraft],
  );
  const storyScorecardSuggestions = useMemo(
    () => buildStoryScorecardSuggestions(storyDraft),
    [storyDraft],
  );
  const liveStoryPressureTest = useMemo(
    () => buildStoryPressureTest(storyDraft),
    [storyDraft],
  );
  const questionCountsByCategory = useMemo(
    () =>
      INTERVIEW_QUESTIONS.reduce(
        (result, question) => {
          result[question.sourceCategoryId] =
            (result[question.sourceCategoryId] ?? 0) + 1;
          return result;
        },
        {} as Record<string, number>,
      ),
    [],
  );
  const amazonCoverageSummary = useMemo(
    () => getAmazonCoverageSummary(progress),
    [progress],
  );
  const prepMomentumDashboard = useMemo(
    () => buildPrepMomentumDashboard(progress),
    [progress],
  );
  const readinessForecast = useMemo(
    () => buildReadinessForecast(progress),
    [progress],
  );
  const storySaturationReport = useMemo(
    () => buildStorySaturationReport(progress, selectedFamily),
    [progress, selectedFamily],
  );
  const storyPivotPack = useMemo(
    () => buildStoryPivotPack(storyDraft),
    [storyDraft],
  );

  const drillHasStarted = drillQuestions.length > 0;
  const currentDrillQuestion =
    drillHasStarted && !drillFinished ? drillQuestions[drillIndex] : null;
  const currentPromptSet = useMemo(
    () => filteredQuestions.slice(0, 3),
    [filteredQuestions],
  );
  const recentDrills = progress.drillHistory.slice(0, 5);
  const recentBarRaiserReviews = progress.barRaiserHistory.slice(0, 5);
  const recentStories = progress.stories.slice(0, 5);
  const averageBarRaiserScore = recentBarRaiserReviews.length
    ? Math.round(
        recentBarRaiserReviews.reduce((sum, entry) => sum + entry.score, 0) /
          recentBarRaiserReviews.length,
      )
    : null;
  const selectedPrepDeckRoute = useMemo(
    () =>
      selectedCategory ? getPrepDeckRouteByCategory(selectedCategory.id) : null,
    [selectedCategory],
  );
  const prepDeckElitePreviews = useMemo(
    () =>
      Object.fromEntries(
        AMAZON_PREP_DECK_STORIES.map((story) => [
          story.id,
          buildPrepDeckElitePreview(story),
        ]),
      ) as Record<string, PrepDeckElitePreview>,
    [],
  );
  const prepDeckStoriesForFilter = useMemo(() => {
    if (selectedPrepDeckRoute) {
      return selectedPrepDeckRoute.primaryStoryIds
        .map((storyId) => getPrepDeckStoryById(storyId))
        .filter((story) => story !== null);
    }

    if (selectedCategory) {
      return getPrepDeckStoriesForCategory(selectedCategory.id).slice(0, 4);
    }

    return getPrepDeckStoriesForFamily(selectedFamily).slice(0, 4);
  }, [selectedCategory, selectedFamily, selectedPrepDeckRoute]);
  const storyWriterSuggestion = useMemo(
    () =>
      buildEliteStoryDraft({
        competency:
          selectedCompetency === "all"
            ? storyDraft.competency
            : selectedCompetency,
        categoryTags: selectedCategory
          ? [selectedCategory.id]
          : storyDraft.categoryTags,
        ...storyWriterInput,
      }),
    [
      selectedCategory,
      selectedCompetency,
      storyDraft.categoryTags,
      storyDraft.competency,
      storyWriterInput,
    ],
  );
  const checklistByPhase = useMemo(
    () =>
      Object.entries(checklistPhaseLabels).map(([phase, label]) => ({
        phase,
        label,
        items: GAME_DAY_CHECKLIST.filter((item) => item.phase === phase),
      })),
    [],
  );

  const competencyCards = useMemo(
    () =>
      INTERVIEW_COMPETENCIES.map((competency) => {
        const confidence = getCompetencyConfidence(progress, competency.id);
        const storyCount = storyCoverage[competency.id];
        const stat = progress.competencyStats[competency.id];

        return {
          ...competency,
          confidence,
          storyCount,
          attempts: stat.attempted,
          signal: clampPercent(Math.max(confidence, storyCount * 18)),
        };
      }),
    [progress, storyCoverage],
  );
  const passBlockers = useMemo(
    () =>
      getTopPassBlockers(
        progress,
        selectedFamily,
        selectedCategory?.id ?? null,
      ),
    [progress, selectedCategory, selectedFamily],
  );
  const currentQuestionReadiness = useMemo(
    () =>
      currentQuestionBankEntry
        ? getPromptReadiness(progress, currentQuestionBankEntry)
        : null,
    [currentQuestionBankEntry, progress],
  );
  const currentQuestionMatchedStories = useMemo(() => {
    if (!currentQuestionBankEntry) {
      return [];
    }

    return progress.stories
      .filter((story) =>
        story.categoryTags.includes(currentQuestionBankEntry.sourceCategoryId),
      )
      .sort(
        (left, right) => reviewStarStory(right).score - reviewStarStory(left).score,
      )
      .slice(0, 3);
  }, [currentQuestionBankEntry, progress.stories]);
  const currentQuestionPrepDeckStories = useMemo(
    () =>
      currentQuestionBankEntry
        ? getPrepDeckStoriesForCategory(
            currentQuestionBankEntry.sourceCategoryId,
          ).slice(0, 3)
        : [],
    [currentQuestionBankEntry],
  );
  const currentDrillAdjacentPrompts = useMemo(
    () =>
      currentDrillQuestion
        ? getRelatedQuestionPrompts(currentDrillQuestion, 3)
        : [],
    [currentDrillQuestion],
  );
  const currentQuestionAdjacentPrompts = useMemo(
    () =>
      currentQuestionBankEntry
        ? getRelatedQuestionPrompts(currentQuestionBankEntry, 3)
        : [],
    [currentQuestionBankEntry],
  );
  const enduranceLoopPlan = useMemo(
    () => buildEnduranceLoopPlan(filteredQuestions, progress),
    [filteredQuestions, progress],
  );

  const nextMoves = useMemo(() => {
    const moves: string[] = [];

    if (progress.stories.length < 4) {
      moves.push(
        "Build a six-story STAR bank that covers leadership, conflict, failure, ownership, ambiguity, and impact.",
      );
    }
    if (
      selectedCategory &&
      (storyCategoryCoverage[selectedCategory.id] ?? 0) === 0
    ) {
      moves.push(
        `Write one bulletproof STAR story tagged to ${selectedCategory.label} so this focus area has reusable proof.`,
      );
    }
    if (totalPitchFields < 4) {
      moves.push(
        'Tighten your opening pitch so "tell me about yourself" is ready without improvising.',
      );
    }
    if (weakestCompetency) {
      moves.push(
        `Run a focused drill on ${weakestCompetency.title.toLowerCase()} and add one story for that lane.`,
      );
    }
    if (amazonCoverageSummary.lpCovered < amazonCoverageSummary.lpTotal / 2) {
      moves.push(
        "Broaden your Amazon coverage by touching more Leadership Principles instead of repeating the same few stories.",
      );
    }
    if (amazonCoverageSummary.managerRepCount < 3) {
      moves.push(
        "Practice at least three manager-only prompts so your stories can survive higher-bar follow-up pressure.",
      );
    }
    if (averageBarRaiserScore !== null && averageBarRaiserScore < 75) {
      moves.push(
        "Re-record one recent harsh review until it clears 75. Elite prep comes from fixing the same weak answer, not hunting a new question.",
      );
    }
    if (progress.checklistDoneIds.length < GAME_DAY_CHECKLIST.length / 2) {
      moves.push(
        "Finish the game-day checklist before your next live round so logistics never steal signal.",
      );
    }

    return moves.slice(0, 4);
  }, [
    amazonCoverageSummary,
    progress,
    selectedCategory,
    storyCategoryCoverage,
    totalPitchFields,
    weakestCompetency,
    averageBarRaiserScore,
  ]);

  const drillSummary = useMemo(
    () => countDrillRatings(drillRatings),
    [drillRatings],
  );

  const applyFamilyFilter = (family: InterviewSourceFamily) => {
    setSelectedFamily(family);
    setSelectedCategoryId("all");
    resetPracticeState();
  };

  const applyCategoryFilter = (categoryId: CategoryFilter) => {
    setSelectedCategoryId(categoryId);
    resetPracticeState();
  };

  const applyCompetencyFilter = (competency: CompetencyFilter) => {
    setSelectedCompetency(competency);
    resetPracticeState();
  };

  const startDrillSession = () => {
    const count = Math.min(drillLength, Math.max(1, filteredQuestions.length));
    const questions = pickDrillQuestions(
      filteredQuestions,
      count,
      filteredCompetencies,
    );

    setDrillQuestions(questions);
    setDrillRatings(new Array(questions.length).fill(null));
    setDrillIndex(0);
    setDrillRevealed(false);
    setDrillRating(null);
    setDrillFinished(false);
    setActiveTab("drills");
  };

  const revealCurrentDrill = () => {
    if (!currentDrillQuestion) {
      return;
    }

    setDrillRevealed(true);
  };

  const rateCurrentDrill = (rating: DrillRating) => {
    if (!currentDrillQuestion || !drillRevealed || drillRating !== null) {
      return;
    }

    setProgress((previous) =>
      recordDrillResult(previous, currentDrillQuestion, rating, new Date()),
    );
    setDrillRatings((previous) => {
      const next = [...previous];
      next[drillIndex] = rating;
      return next;
    });
    setDrillRating(rating);
  };

  const moveToNextDrill = () => {
    if (drillRating === null) {
      return;
    }

    const isLastQuestion = drillIndex >= drillQuestions.length - 1;

    if (isLastQuestion) {
      setDrillFinished(true);
      return;
    }

    setDrillIndex((previous) => previous + 1);
    setDrillRevealed(false);
    setDrillRating(null);
  };

  const resetDrillSession = () => {
    setDrillQuestions([]);
    setDrillRatings([]);
    setDrillIndex(0);
    setDrillRevealed(false);
    setDrillRating(null);
    setDrillFinished(false);
  };

  const openQuestionInBarRaiser = (
    questionId: string,
    lensId: InterviewerLensId | null = null,
  ) => {
    const question = getInterviewQuestionById(questionId);

    if (!question) {
      return;
    }

    setSelectedFamily(question.sourceFamily);
    setSelectedCategoryId(question.sourceCategoryId);
    setSelectedCompetency(question.competency);
    setBarRaiserLensId(lensId);
    setBarRaiserQuestionId(question.id);
    resetPracticeState();
    setActiveTab("bar_raiser");
  };

  const openPrepTab = (tab: PrepTabTarget) => {
    setActiveTab(tab);
  };

  const rotateQuestionBank = (step: number) => {
    if (!filteredQuestions.length) {
      return;
    }

    setQuestionBankIndex(
      (previous) =>
        (previous + step + filteredQuestions.length) % filteredQuestions.length,
    );
  };

  const updatePitchField = (
    field: keyof InterviewPrepProgress["pitch"],
    value: string,
  ) => {
    setProgress((previous) =>
      updatePitchPack(previous, { [field]: value }, new Date()),
    );
  };

  const loadPrepDeckPitch = () => {
    setProgress((previous) =>
      updatePitchPack(previous, AMAZON_PREP_DECK_PITCH_TEMPLATE.pack, new Date()),
    );
  };

  const updateCareerProfileField = (
    field: CareerProfileField,
    value: string,
  ) => {
    const normalizedValue =
      field === "currentTotalComp" || field === "targetTotalComp"
        ? (() => {
            const digitsOnly = value.replace(/[^\d]/g, "");
            return digitsOnly ? Number(digitsOnly) : null;
          })()
        : value;

    setProgress((previous) =>
      updateCareerProfile(
        previous,
        { [field]: normalizedValue } as Partial<InterviewCareerProfile>,
        new Date(),
      ),
    );
  };

  const updateStoryField = (field: EditableStoryField, value: string) => {
    setStoryDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateStoryWriterField = (field: StoryWriterField, value: string) => {
    setStoryWriterInput((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const loadStoryWriterDraft = () => {
    setEditingStoryId(null);
    setStoryDraft(storyWriterSuggestion.draft);
    setStoryLoadNotice(
      `Loaded writer draft into STAR Lab: ${storyWriterSuggestion.draft.title || "Untitled story"}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyEliteStoryPolish = () => {
    setStoryDraft(eliteStoryPolish.draft);
    setStoryLoadNotice(
      `Applied elite polish to ${eliteStoryPolish.draft.title || "your story"}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyBarRaiserAmplification = () => {
    setStoryDraft(barRaiserAmplification.draft);
    setStoryLoadNotice(
      `Applied Bar Raiser amplify to ${barRaiserAmplification.draft.title || "your story"}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyBarRaiserAmplifiedField = (
    field: BarRaiserAmplificationField,
  ) => {
    const upgrade = barRaiserAmplification.sectionUpgrades.find(
      (item) => item.field === field,
    );

    setStoryDraft((previous) => ({
      ...previous,
      [field]: barRaiserAmplification.draft[field],
    }));
    setStoryLoadNotice(
      `Applied Bar Raiser amplify to ${upgrade?.label.toLowerCase() ?? field}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyScorecardSuggestion = (fields: BarRaiserAmplificationField[]) => {
    setStoryDraft((previous) => ({
      ...previous,
      ...Object.fromEntries(
        fields.map((field) => [field, barRaiserAmplification.draft[field]]),
      ),
    }));
    setStoryLoadNotice(
      `Added scorecard upgrade to ${fields.map((field) => field.replace(/_/g, " ")).join(" + ")}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyCalibrationFieldValue = (
    field: BarRaiserAmplificationField,
    value: string,
    notice: string,
  ) => {
    setStoryDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
    setStoryLoadNotice(notice);
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyGhostMetric = (
    field: "action" | "result" | "reflection",
    placeholder: string,
  ) => {
    const existingValue = storyDraft[field].trim();
    const nextValue = existingValue
      ? `${existingValue} ${placeholder}`.trim()
      : placeholder;

    applyCalibrationFieldValue(
      field,
      nextValue,
      `Added a ghost metric scaffold to ${field}.`,
    );
  };

  const applyFullCalibrationPass = () => {
    const nextDraft = { ...barRaiserAmplification.draft };

    for (const ghost of storyCalibrationReport.ghostMetrics) {
      const existingValue = nextDraft[ghost.field].trim();
      nextDraft[ghost.field] = existingValue
        ? `${existingValue} ${ghost.placeholder}`.trim()
        : ghost.placeholder;
    }

    setStoryDraft(nextDraft);
    setStoryLoadNotice(
      `Applied the full calibration pass to ${nextDraft.title || "your story"}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const applyStoryPivotNode = (node: StoryPivotNode) => {
    setStoryDraft((previous) => ({
      ...previous,
      categoryTags: previous.categoryTags.includes(node.categoryId)
        ? previous.categoryTags
        : [...previous.categoryTags, node.categoryId],
      result: node.pivotedResult,
      reflection: node.pivotedReflection,
    }));
    setStoryLoadNotice(
      `Applied the ${node.label.toLowerCase()} to this story without crossing the source facts.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const clearStoryWriter = () => {
    setStoryWriterInput(createEmptyStoryWriterInput());
  };

  const toggleStoryCategoryTag = (categoryId: string) => {
    setStoryDraft((previous) => {
      const nextTags = previous.categoryTags.includes(categoryId)
        ? previous.categoryTags.filter((tag) => tag !== categoryId)
        : [...previous.categoryTags, categoryId];

      return {
        ...previous,
        categoryTags: nextTags,
      };
    });
  };

  const saveCurrentStory = () => {
    const hasCoreContent = [
      storyDraft.title,
      storyDraft.situation,
      storyDraft.action,
      storyDraft.result,
    ].some((value) => value.trim().length > 0);

    if (!hasCoreContent) {
      return;
    }

    const nextDraft: StoryDraft = {
      ...storyDraft,
      id: editingStoryId ?? storyDraft.id,
    };

    setProgress((previous) => saveStarStory(previous, nextDraft, new Date()));
    setEditingStoryId(null);
    setStoryDraft(
      createEmptyStoryDraft(
        storyDraft.competency,
        selectedCategory ? [selectedCategory.id] : [],
      ),
    );
  };

  const loadStoryForEdit = (storyId: string) => {
    const story = progress.stories.find((entry) => entry.id === storyId);
    if (!story) {
      return;
    }

    setStoryDraft({
      id: story.id,
      competency: story.competency,
      categoryTags: story.categoryTags,
      title: story.title,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      reflection: story.reflection,
      grounding: story.grounding,
    });
    setEditingStoryId(story.id);
    setStoryLoadNotice(`Loaded saved story: ${story.title || "Untitled story"}.`);
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const removeStory = (storyId: string) => {
    setProgress((previous) => deleteStarStory(previous, storyId, new Date()));

    if (editingStoryId === storyId) {
      setEditingStoryId(null);
      setStoryDraft(
        createEmptyStoryDraft(
          selectedCategory?.signalLane ?? "storytelling",
          selectedCategory ? [selectedCategory.id] : [],
        ),
      );
    }
  };

  const startFreshStory = () => {
    const competency =
      selectedCompetency === "all"
        ? (selectedCategory?.signalLane ?? storyDraft.competency)
        : selectedCompetency;
    const categoryTags = selectedCategory ? [selectedCategory.id] : [];
    setEditingStoryId(null);
    setStoryDraft(createEmptyStoryDraft(competency, categoryTags));
  };

  const loadPrepDeckStory = (
    storyId: string,
    mode: "source" | "elite" = "elite",
  ) => {
    const story = getPrepDeckStoryById(storyId);
    if (!story) {
      return;
    }

    setEditingStoryId(null);
    setExpandedPrepDeckStoryId(storyId);
    setStoryDraft(
      mode === "elite"
        ? buildPrepDeckEliteStoryDraft(story)
        : buildPrepDeckStoryDraft(story),
    );
    setStoryLoadNotice(
      `${mode === "elite" ? "Loaded elite start" : "Loaded source version"}: ${story.title}.`,
    );
    setActiveTab("star_lab");
    setStoryBuilderRevealTick((previous) => previous + 1);
  };

  const togglePrepDeckStoryDetails = (storyId: string) => {
    setExpandedPrepDeckStoryId((previous) =>
      previous === storyId ? null : storyId,
    );
  };

  const toggleChecklist = (itemId: string, done: boolean) => {
    setProgress((previous) =>
      toggleChecklistItem(previous, itemId, done, new Date()),
    );
  };

  const logBarRaiserReview = (
    question: InterviewQuestion,
    review: InterviewAnswerReview,
    durationSeconds: number | null,
  ) => {
    setProgress((previous) =>
      recordBarRaiserReview(
        previous,
        question,
        review,
        durationSeconds,
        new Date(),
      ),
    );
  };

  return (
    <div className="space-y-6 pb-10 rise">
      <header className="glass-panel rounded-[30px] border border-slate-200/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700">
              Interview Command Center
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Amazon-first interview prep built around bulletproof stories,
                harsh scoring, and real answer reps.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-700">
                Preserve the full question bank, drill by Leadership Principle
                or functional competency, record live answers, get bar-raiser
                feedback on weak spots, and show up with a sharper operating
                rhythm than the average candidate.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Readiness
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-3xl font-semibold text-slate-950">
                    {readiness}%
                  </p>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {readinessLabel(readiness)}
                  </span>
                </div>
              </article>
              <article className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  STAR Stories
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {progress.stories.length}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Saved and reusable for future loops
                </p>
              </article>
              <article className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Drill Reps
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {totalDrillReps}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Logged mock answers and hard-scored reps
                </p>
              </article>
              <article className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Prep Streak
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {progress.streak}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Days with deliberate prep
                </p>
              </article>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[28px] bg-slate-950 p-5 text-slate-50 shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Loop Blueprint
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Know what each stage is testing.
                </h2>
              </div>
              <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
                Operator mode
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {INTERVIEW_STAGES.map((stage, index) => (
                <article
                  key={stage.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-semibold text-cyan-100">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {stage.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-white/72">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </header>

      <section className="glass-panel rounded-[26px] border border-slate-200/70 p-5">
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Amazon taxonomy
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Use LPs and functional competencies as the main navigation.
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {amazonFamilies.map((family) => (
                <button
                  key={family}
                  type="button"
                  onClick={() => applyFamilyFilter(family)}
                  className={classNames(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    selectedFamily === family
                      ? "bg-slate-950 text-white shadow-md"
                      : "border border-slate-300 bg-white/80 text-slate-700 hover:border-cyan-400",
                  )}
                >
                  {INTERVIEW_SOURCE_FAMILY_LABELS[family]}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {categoryGroups.map((group) => (
                <div
                  key={group.family}
                  className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {group.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {group.categories.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Canonical categories in the source bank
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Current category
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {selectedCategory
                  ? selectedCategory.label
                  : `All ${INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}`}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedCategory
                  ? selectedCategory.description
                  : `Browse the full ${INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily].toLowerCase()} bank, then narrow to one category when you want focused reps.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyCategoryFilter("all")}
                className={classNames(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  effectiveSelectedCategoryId === "all"
                    ? "bg-cyan-700 text-white shadow-[0_10px_30px_rgba(14,116,144,0.28)]"
                    : "border border-cyan-200/80 bg-white/80 text-cyan-900 hover:bg-cyan-50",
                )}
              >
                All {INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}
              </button>
              {selectedFamilyCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => applyCategoryFilter(category.id)}
                  className={classNames(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    effectiveSelectedCategoryId === category.id
                      ? "bg-cyan-700 text-white shadow-[0_10px_30px_rgba(14,116,144,0.28)]"
                      : "border border-cyan-200/80 bg-white/80 text-cyan-900 hover:bg-cyan-50",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Secondary coaching lane
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyCompetencyFilter("all")}
                  className={classNames(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    selectedCompetency === "all"
                      ? "bg-slate-950 text-white shadow-md"
                      : "border border-slate-300 bg-white/80 text-slate-700 hover:border-cyan-400",
                  )}
                >
                  All lanes
                </button>
                {INTERVIEW_COMPETENCIES.map((competency) => (
                  <button
                    key={competency.id}
                    type="button"
                    onClick={() => applyCompetencyFilter(competency.id)}
                    className={classNames(
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      selectedCompetency === competency.id
                        ? "bg-slate-950 text-white shadow-md"
                        : "border border-slate-300 bg-white/80 text-slate-700 hover:border-cyan-400",
                    )}
                  >
                    {competency.title}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Amazon categories drive question selection. Signal lanes stay
                available to tune coaching and story work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              "rounded-2xl px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.id
                ? "bg-cyan-700 text-white shadow-[0_10px_30px_rgba(14,116,144,0.28)]"
                : "border border-cyan-200/80 bg-white/80 text-cyan-900 hover:bg-cyan-50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "cockpit" ? (
        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
          <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Readiness map
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Where your signal is strong and where it still leaks.
                </h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {amazonCoverageSummary.lpCovered +
                  amazonCoverageSummary.functionalCovered}{" "}
                categories with proof
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {competencyCards.map((competency) => (
                <article
                  key={competency.id}
                  className="rounded-[22px] border border-slate-200 bg-white/75 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-950">
                          {competency.title}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {competency.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-700">
                        {competency.description}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                        {competency.cue}
                      </p>
                    </div>
                    <div className="grid min-w-[180px] gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <span>Stories</span>
                        <span className="font-semibold text-slate-950">
                          {competency.storyCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Drill reps</span>
                        <span className="font-semibold text-slate-950">
                          {competency.attempts}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Signal score</span>
                        <span className="font-semibold text-slate-950">
                          {competency.signal}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-amber-400 transition-all"
                      style={{ width: `${competency.signal}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Amazon coverage
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Track breadth across LPs, functional areas, and manager prompts.
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    LP coverage
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {amazonCoverageSummary.lpCovered}/
                    {amazonCoverageSummary.lpTotal}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Leadership Principles touched by stories or reps
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Functional coverage
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {amazonCoverageSummary.functionalCovered}/
                    {amazonCoverageSummary.functionalTotal}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Functional categories touched by stories or reps
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Manager question coverage
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {amazonCoverageSummary.managerRepCount}/
                    {amazonCoverageSummary.managerPromptCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Manager-only prompts you have practiced so far
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Current category pool
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {selectedCategory
                      ? (questionCountsByCategory[selectedCategory.id] ?? 0)
                      : familyQuestions.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedCategory
                      ? `${selectedCategory.label} prompts available in the source bank`
                      : "Prompts available in the active family"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Recent category reps
                </p>
                <div className="mt-3 space-y-3">
                  {recentDrills.length ? (
                    recentDrills.map((entry) => (
                      <div
                        key={`${entry.questionId}-${entry.date}`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-white">
                            {entry.sourceCategoryLabel ??
                              getInterviewQuestionById(entry.questionId)
                                ?.sourceCategoryLabel ??
                              getCompetencyById(entry.competency).title}
                          </span>
                          <span
                            className={classNames(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              ratingMeta[entry.rating].badgeClass,
                            )}
                          >
                            {ratingMeta[entry.rating].label}
                          </span>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/60">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/72">
                      No category reps yet. Start a drill session to establish
                      your Amazon baseline.
                    </div>
                  )}
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                ROI and trajectory
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                See the scope jump and the upside your prep is buying.
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Current role
                  </span>
                  <input
                    type="text"
                    value={progress.careerProfile.currentRole}
                    onChange={(event) =>
                      updateCareerProfileField("currentRole", event.target.value)
                    }
                    placeholder="Process Assistant"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Current level
                  </span>
                  <input
                    type="text"
                    value={progress.careerProfile.currentLevel}
                    onChange={(event) =>
                      updateCareerProfileField("currentLevel", event.target.value)
                    }
                    placeholder="L3 / Tier 3"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Target role
                  </span>
                  <input
                    type="text"
                    value={progress.careerProfile.targetRole}
                    onChange={(event) =>
                      updateCareerProfileField("targetRole", event.target.value)
                    }
                    placeholder="Area Manager"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Target level
                  </span>
                  <input
                    type="text"
                    value={progress.careerProfile.targetLevel}
                    onChange={(event) =>
                      updateCareerProfileField("targetLevel", event.target.value)
                    }
                    placeholder="L4"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Current total comp
                  </span>
                  <input
                    inputMode="numeric"
                    type="text"
                    value={
                      progress.careerProfile.currentTotalComp?.toString() ?? ""
                    }
                    onChange={(event) =>
                      updateCareerProfileField(
                        "currentTotalComp",
                        event.target.value,
                      )
                    }
                    placeholder="70000"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Target total comp
                  </span>
                  <input
                    inputMode="numeric"
                    type="text"
                    value={
                      progress.careerProfile.targetTotalComp?.toString() ?? ""
                    }
                    onChange={(event) =>
                      updateCareerProfileField(
                        "targetTotalComp",
                        event.target.value,
                      )
                    }
                    placeholder="95000"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Package path
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                    {prepMomentumDashboard.compSummary}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Total upside
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {formatCurrency(prepMomentumDashboard.compDelta)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Weekly upside at risk
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {formatCurrency(prepMomentumDashboard.weeklyUpsideAtRisk)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      Prep load and burnout
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {prepMomentumDashboard.burnoutSummary}
                    </p>
                  </div>
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      prepMomentumDashboard.burnoutRisk === "high"
                        ? "bg-rose-300/15 text-rose-100"
                        : prepMomentumDashboard.burnoutRisk === "medium"
                          ? "bg-amber-300/15 text-amber-100"
                          : "bg-emerald-300/15 text-emerald-100",
                    )}
                  >
                    {prepMomentumDashboard.burnoutRisk} risk
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/82">
                    {prepMomentumDashboard.cadenceSummary}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/82">
                    {prepMomentumDashboard.repetitionRisk}
                  </div>
                  {prepMomentumDashboard.burnoutSignals.map((signal) => (
                    <div
                      key={signal}
                      className="rounded-2xl border border-white/10 bg-black/10 p-3 text-sm leading-6 text-white/82"
                    >
                      {signal}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        L-level calibration
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-950">
                        Predictive readiness for {readinessForecast.levelTarget}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {readinessForecast.summary}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      {readinessForecast.projectedPassProbability}% projected pass
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Required average
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        {readinessForecast.requiredAverageScore}
                      </p>
                    </div>
                    <div className="rounded-[22px] bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Momentum
                      </p>
                      <p className="mt-2 text-2xl font-semibold capitalize text-slate-950">
                        {readinessForecast.momentum}
                      </p>
                    </div>
                    <div className="rounded-[22px] bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Deliberate-practice days
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        {readinessForecast.daysToPeakReadiness}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[22px] bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {readinessForecast.trajectoryNote}
                  </div>

                  <div className="mt-4 space-y-3">
                    {readinessForecast.blockers.map((blocker) => (
                      <div
                        key={blocker}
                        className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-sm leading-6 text-rose-950"
                      >
                        {blocker}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Story saturation metrics
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Stop over-indexing on one safe signal while another lane stays exposed.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {storySaturationReport.summary}
                  </p>

                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                        Over-indexed
                      </p>
                      {storySaturationReport.overIndexedCategories.length ? (
                        storySaturationReport.overIndexedCategories.map((gap) => (
                          <div
                            key={gap.categoryId}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3"
                          >
                            <p className="text-sm font-semibold text-white">
                              {gap.label} ({gap.count})
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/72">
                              {gap.detail}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/72">
                          No single category is dominating the story bank right now.
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                        Critical signal gaps
                      </p>
                      {storySaturationReport.starvedCategories.length ? (
                        storySaturationReport.starvedCategories.map((gap) => (
                          <div
                            key={gap.categoryId}
                            className="rounded-2xl border border-white/10 bg-black/10 p-3"
                          >
                            <p className="text-sm font-semibold text-white">
                              {gap.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/72">
                              {gap.detail}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-black/10 p-3 text-sm leading-6 text-white/72">
                          No obvious starved categories in the current family filter.
                        </div>
                      )}
                    </div>
                  </div>

                  {storySaturationReport.criticalSignalGaps.length ? (
                    <div className="mt-4 space-y-3">
                      {storySaturationReport.criticalSignalGaps.map((gap) => (
                        <div
                          key={gap}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/82"
                        >
                          {gap}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Pass blockers
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Close the gaps most likely to cost you the interview.
              </h2>
              <div className="mt-4 space-y-3">
                {passBlockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-950">
                            {blocker.title}
                          </p>
                          <span
                            className={classNames(
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                              blocker.urgency === "high"
                                ? "bg-rose-100 text-rose-900"
                                : "bg-amber-100 text-amber-900",
                            )}
                          >
                            {blocker.urgency}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {blocker.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openPrepTab(blocker.tab)}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                      >
                        {blocker.actionLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Next best moves
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Do the highest-leverage prep next.
              </h2>
              <div className="mt-4 space-y-3">
                {nextMoves.map((move) => (
                  <div
                    key={move}
                    className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-700"
                  >
                    {move}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-700">
                {weakestCompetency
                  ? `Current soft spot: ${weakestCompetency.title}. Use the filter above to run drills and write a fresh story in that lane.`
                  : "No weakest lane yet. Start with a mixed drill session to establish your baseline."}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Pitch workshop
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Build your opening answer.
                  </h2>
                </div>
                <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                  {totalPitchFields}/4 sections filled
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Present
                  </span>
                  <textarea
                    rows={2}
                    value={progress.pitch.present}
                    onChange={(event) =>
                      updatePitchField("present", event.target.value)
                    }
                    placeholder="Who you are now and the lane you operate in."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Proof
                  </span>
                  <textarea
                    rows={2}
                    value={progress.pitch.proof}
                    onChange={(event) =>
                      updatePitchField("proof", event.target.value)
                    }
                    placeholder="Two proof points with real outcomes or scope."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Future
                  </span>
                  <textarea
                    rows={2}
                    value={progress.pitch.future}
                    onChange={(event) =>
                      updatePitchField("future", event.target.value)
                    }
                    placeholder="What you want more of in your next role."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Why here
                  </span>
                  <textarea
                    rows={2}
                    value={progress.pitch.whyHere}
                    onChange={(event) =>
                      updatePitchField("whyHere", event.target.value)
                    }
                    placeholder="Why this team or company is the right fit now."
                  />
                </label>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/82 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Imported prep-deck opener
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Your slide deck already had a strong baseline opener. Load
                      it here, then tighten the wording until it sounds like you
                      and not a script.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadPrepDeckPitch}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                  >
                    Load pitch from deck
                  </button>
                </div>
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {AMAZON_PREP_DECK_PITCH_TEMPLATE.fullIntro}
                </p>
              </div>

              <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Live preview
                </p>
                <p className="mt-3 text-base leading-7 text-white/88">
                  {pitchPreview ||
                    "Your tell-me-about-yourself answer will appear here as you fill the pitch sections."}
                </p>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Harsh review trend
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-950">
                  Recent bar-raiser signal
                </h2>
                <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                  {averageBarRaiserScore !== null
                    ? `${averageBarRaiserScore} avg`
                    : "No logged reviews"}
                </div>
              </div>
              <div className="mt-3 grid gap-3">
                {recentBarRaiserReviews.length ? (
                  recentBarRaiserReviews.map((entry) => (
                    <div
                      key={`${entry.questionId}-${entry.date}`}
                      className="rounded-2xl border border-slate-200 bg-white/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {entry.sourceCategoryLabel ??
                              getInterviewQuestionById(entry.questionId)
                                ?.sourceCategoryLabel ??
                              getCompetencyById(entry.competency).title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                            {entry.verdict.replaceAll("_", " ")}
                            {entry.managerOnly ? " • Manager only" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-slate-950">
                            {entry.score}
                          </div>
                          <span
                            className={classNames(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              ratingMeta[entry.rating].badgeClass,
                            )}
                          >
                            {ratingMeta[entry.rating].label}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {entry.summary}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {formatDate(entry.date)}
                        {entry.durationSeconds !== null
                          ? ` • ${entry.durationSeconds}s take`
                          : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    No harsh reviews logged yet. Use Bar Raiser mode and save
                    the takes you actually want counted.
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {activeTab === "star_lab" ? (
        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Story bank
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Your reusable STAR inventory.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={startFreshStory}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  New story
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    LP story coverage
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-900">
                    {
                      getQuestionCategoriesByFamily("lp").filter(
                        (category) =>
                          (storyCategoryCoverage[category.id] ?? 0) > 0,
                      ).length
                    }
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Leadership Principles tagged by saved stories
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Functional story coverage
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-900">
                    {
                      getQuestionCategoriesByFamily("functional").filter(
                        (category) =>
                          (storyCategoryCoverage[category.id] ?? 0) > 0,
                      ).length
                    }
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Functional areas tagged by saved stories
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Active category matches
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-900">
                    {selectedCategory
                      ? progress.stories.filter((story) =>
                          story.categoryTags.includes(selectedCategory.id),
                        ).length
                      : progress.stories.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {selectedCategory
                      ? `${selectedCategory.label} stories ready for reuse`
                      : "Total saved stories"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    Current family question bank
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-900">
                    {familyQuestions.length}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Prompts available in the active Amazon family
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentStories.length ? (
                  recentStories.map((story) => (
                    <article
                      key={story.id}
                      className="rounded-[24px] border border-slate-200 bg-white/82 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-950">
                              {story.title}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              {getCompetencyById(story.competency).title}
                            </span>
                          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                              {reviewStarStory(story).score}%
                            </span>
                          </div>
                          {story.categoryTags.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {story.categoryTags
                                .slice(0, 4)
                                .map((categoryId) => (
                                  <span
                                    key={categoryId}
                                    className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900"
                                  >
                                    {getQuestionCategoryById(categoryId).label}
                                  </span>
                                ))}
                            </div>
                          ) : null}
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {story.result ||
                              "Add a measured result to sharpen this story."}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                            Updated {formatDate(story.updatedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => loadStoryForEdit(story.id)}
                            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStory(story.id)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    No stories saved yet. Start with one leadership or ownership
                    story and make the Action section do most of the work.
                  </div>
                )}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Source prompts
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Seed stories from the actual bank, not made-up extras.
              </h2>
              <div className="mt-4 space-y-3">
                {currentPromptSet.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => {
                      updateStoryField("title", prompt.title);
                      if (
                        !storyDraft.categoryTags.includes(
                          prompt.sourceCategoryId,
                        )
                      ) {
                        toggleStoryCategoryTag(prompt.sourceCategoryId);
                      }
                    }}
                    className="w-full rounded-[22px] border border-slate-200 bg-white/82 p-4 text-left text-sm leading-6 text-slate-700 transition hover:border-cyan-400"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-900">
                        {prompt.sourceCategoryLabel}
                      </span>
                      {prompt.managerOnly ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900">
                          Manager only
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3">{prompt.prompt}</div>
                  </button>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Imported story bank
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Every imported story-bank entry is here, not just the shortlist.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    The lane-matched section below shows the best fits for your
                    current category. The full library shows all imported story-bank
                    stories with the details you gave me, plus an elite-start
                    path for each one.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {AMAZON_PREP_DECK_STORIES.length} imported stories
                </div>
              </div>
              {selectedPrepDeckRoute ? (
                <div className="mt-4 rounded-[22px] border border-cyan-200 bg-cyan-50/80 p-4 text-sm leading-6 text-cyan-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800">
                    Router cue for this category
                  </p>
                  <p className="mt-2">
                    If you hear: <span className="font-semibold">{selectedPrepDeckRoute.cue}</span>
                  </p>
                </div>
              ) : null}
              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Best matches for this lane
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      These are the stories that best match your current family
                      or category filter.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {prepDeckStoriesForFilter.length} shown
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {prepDeckStoriesForFilter.map((story) => (
                    <PrepDeckStoryCard
                      key={story.id}
                      story={story}
                      elitePreview={prepDeckElitePreviews[story.id]}
                      expanded={expandedPrepDeckStoryId === story.id}
                      onToggle={() => togglePrepDeckStoryDetails(story.id)}
                      onLoadElite={() => loadPrepDeckStory(story.id, "elite")}
                      onLoadSource={() => loadPrepDeckStory(story.id, "source")}
                      emphasisLabel="Lane match"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/82 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Full story library
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      This is the full imported story bank. Nothing is hidden
                      behind the lane filter here.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {AMAZON_PREP_DECK_STORIES.length} total
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {AMAZON_PREP_DECK_STORIES.map((story) => (
                    <PrepDeckStoryCard
                      key={story.id}
                      story={story}
                      elitePreview={prepDeckElitePreviews[story.id]}
                      expanded={expandedPrepDeckStoryId === story.id}
                      onToggle={() => togglePrepDeckStoryDetails(story.id)}
                      onLoadElite={() => loadPrepDeckStory(story.id, "elite")}
                      onLoadSource={() => loadPrepDeckStory(story.id, "source")}
                    />
                  ))}
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Elite story writer
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Drop in raw facts and let the app finish the STAR draft.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    This writer will scaffold missing parts, but it will not
                    invent your facts. Bracketed text means you still need to
                    replace that with something real before rehearsal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadStoryWriterDraft}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Load writer draft
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Title hint
                  </span>
                  <input
                    type="text"
                    value={storyWriterInput.titleHint}
                    onChange={(event) =>
                      updateStoryWriterField("titleHint", event.target.value)
                    }
                    placeholder="Floor rescue during peak"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Context and stakes
                  </span>
                  <textarea
                    rows={4}
                    value={storyWriterInput.context}
                    onChange={(event) =>
                      updateStoryWriterField("context", event.target.value)
                    }
                    placeholder="What was happening, why it mattered, and what risk was real?"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Your exact task
                  </span>
                  <textarea
                    rows={2}
                    value={storyWriterInput.stakes}
                    onChange={(event) =>
                      updateStoryWriterField("stakes", event.target.value)
                    }
                    placeholder='Try "I needed to..." or "My objective was..."'
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Actions you took
                  </span>
                  <textarea
                    rows={4}
                    value={storyWriterInput.actions}
                    onChange={(event) =>
                      updateStoryWriterField("actions", event.target.value)
                    }
                    placeholder="List the moves you made in sequence, including the tradeoff if there was one."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Result and proof
                  </span>
                  <textarea
                    rows={3}
                    value={storyWriterInput.result}
                    onChange={(event) =>
                      updateStoryWriterField("result", event.target.value)
                    }
                    placeholder="Add the metric, delta, scope, or customer impact."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Lesson or standard work
                  </span>
                  <textarea
                    rows={3}
                    value={storyWriterInput.lesson}
                    onChange={(event) =>
                      updateStoryWriterField("lesson", event.target.value)
                    }
                    placeholder="What changed in how you lead, inspect, coach, or escalate after this?"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadStoryWriterDraft}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  Use this draft in builder
                </button>
                <button
                  type="button"
                  onClick={clearStoryWriter}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  Clear writer
                </button>
              </div>

              <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Writer headline
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {storyWriterSuggestion.headline}
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Missing pieces
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/88">
                      {storyWriterSuggestion.missingPieces.length ? (
                        storyWriterSuggestion.missingPieces.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          The writer has enough raw material to build a strong
                          first draft. Tighten the language in the builder next.
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      High-level interviewer warnings
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/88">
                      {storyWriterSuggestion.interviewerWarnings.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                          {item}
                        </div>
                      ))}
                      {storyWriterSuggestion.polishNotes.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-100"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <article
            ref={starLabBuilderRef}
            className="glass-panel rounded-[28px] border border-slate-200/70 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  STAR builder
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {editingStoryId ? "Refine the story" : "Build a new story"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  {liveStoryReview.score}% score
                </span>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                  {getCompetencyById(storyDraft.competency).title}
                </span>
              </div>
            </div>

            {storyLoadNotice ? (
              <div className="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50/80 p-4 text-sm font-semibold text-emerald-950">
                {storyLoadNotice}
              </div>
            ) : null}

            <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Story grounding
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {storyDraft.grounding?.sourceLabel || "Current manual story draft"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {storyDraft.grounding?.kind === "prep_bank"
                  ? "Amplify, polish, scorecard fixes, and saved edits stay anchored to this imported story plus your current edits. They do not borrow facts from other stories."
                  : storyDraft.grounding
                    ? "This story is grounded to its own saved snapshot. The editing features stay inside this story instead of mixing details from other stories."
                    : "This draft is manual right now. Once you save it, the app will ground future edits to this story so features stay aligned."}
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Story title
                </span>
                <input
                  type="text"
                  value={storyDraft.title}
                  onChange={(event) =>
                    updateStoryField("title", event.target.value)
                  }
                  placeholder="Launch turnaround in a difficult quarter"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Competency
                </span>
                <select
                  value={storyDraft.competency}
                  onChange={(event) =>
                    updateStoryField("competency", event.target.value)
                  }
                >
                  {INTERVIEW_COMPETENCIES.map((competency) => (
                    <option key={competency.id} value={competency.id}>
                      {competency.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3">
                <span className="text-sm font-medium text-slate-700">
                  Amazon category tags
                </span>
                <div className="grid gap-3 md:grid-cols-2">
                  {categoryGroups.map((group) => (
                    <div
                      key={group.family}
                      className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {group.label}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.categories.map((category) => {
                          const selected = storyDraft.categoryTags.includes(
                            category.id,
                          );

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() =>
                                toggleStoryCategoryTag(category.id)
                              }
                              className={classNames(
                                "rounded-full px-3 py-2 text-xs font-semibold transition",
                                selected
                                  ? "bg-slate-950 text-white"
                                  : "border border-slate-300 bg-white text-slate-700 hover:border-cyan-400",
                              )}
                            >
                              {category.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Tag each story to every Amazon category it can credibly
                  answer. That is what powers coverage and focused practice.
                </p>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Situation
                </span>
                <textarea
                  rows={3}
                  value={storyDraft.situation}
                  onChange={(event) =>
                    updateStoryField("situation", event.target.value)
                  }
                  placeholder="Set the stakes quickly. What was happening and why did it matter?"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Task</span>
                <textarea
                  rows={2}
                  value={storyDraft.task}
                  onChange={(event) =>
                    updateStoryField("task", event.target.value)
                  }
                  placeholder="What were you responsible for?"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Action
                </span>
                <textarea
                  rows={5}
                  value={storyDraft.action}
                  onChange={(event) =>
                    updateStoryField("action", event.target.value)
                  }
                  placeholder="What did you do, in sequence? This should be the longest section."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Result
                </span>
                <textarea
                  rows={3}
                  value={storyDraft.result}
                  onChange={(event) =>
                    updateStoryField("result", event.target.value)
                  }
                  placeholder="What changed? Add metrics, speed, revenue, quality, or risk reduction."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Reflection
                </span>
                <textarea
                  rows={2}
                  value={storyDraft.reflection}
                  onChange={(event) =>
                    updateStoryField("reflection", event.target.value)
                  }
                  placeholder="What did you learn or change about how you operate?"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5 lg:col-span-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Story scorecard
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">
                      Accurate story scoring, capped at 100.
                    </h3>
                  </div>
                  <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {liveStoryReview.verdictLabel}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 xl:grid-cols-5">
                  {liveStoryReview.dimensions.map((dimension) => {
                    const suggestion = storyScorecardSuggestions.find(
                      (item) => item.dimensionId === dimension.id,
                    );

                    return (
                      <div
                        key={dimension.id}
                        className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-950">
                            {dimension.label}
                          </p>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {dimension.score}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {dimension.note}
                        </p>

                        {suggestion ? (
                          <div className="mt-4 space-y-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  Elite target
                                </p>
                                <span
                                  className={classNames(
                                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                    suggestion.gapToTarget === 0
                                      ? "bg-emerald-100 text-emerald-900"
                                      : "bg-amber-100 text-amber-900",
                                  )}
                                >
                                  {suggestion.amplifiedScore}/{suggestion.eliteTarget}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {suggestion.gapToTarget === 0
                                  ? "This section is already at the elite bar. Keep the same standard."
                                  : `${suggestion.gapToTarget} points still open. ${suggestion.whyThisHelps}`}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-3">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-900">
                                {suggestion.exampleLabel}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-cyan-950">
                                {suggestion.exampleText}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                applyScorecardSuggestion(suggestion.applyFields)
                              }
                              className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white"
                            >
                              {suggestion.applyLabel}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={applyBarRaiserAmplification}
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]"
                  >
                    Add every scorecard fix
                  </button>
                  <p className="self-center text-sm text-slate-600">
                    If you do not want to apply fixes one section at a time, use
                    the full Bar Raiser rewrite and then trim anything that does
                    not sound like you.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-[22px] bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                      What already lands
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-emerald-950">
                      {liveStoryReview.strengths.length ? (
                        liveStoryReview.strengths.map((item) => (
                          <div key={item} className="rounded-2xl bg-white p-3">
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-white p-3">
                          Strong signals will show up here as the story gets
                          sharper and more specific.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-rose-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-900">
                      Interview risk
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-rose-950">
                      {liveStoryReview.misses.map((item) => (
                        <div key={item} className="rounded-2xl bg-white p-3">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5 lg:col-span-2">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      AI calibration engine
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">
                      Derender the fluff, isolate your signal, and force the missing proof.
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                      This layer treats the story like a high-bar data labeler. It boxes what you owned, what the team owned, what is just setup, and what still needs hard proof.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {storyCalibrationReport.strictnessScore}% strictness
                  </span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Bounding-box story analysis
                    </p>
                    <div className="mt-3 space-y-3">
                      {storyCalibrationReport.ownershipBoxes.length ? (
                        storyCalibrationReport.ownershipBoxes.map((box, index) => (
                          <div
                            key={`${box.field}-${index}-${box.text}`}
                            className="rounded-2xl bg-white p-3"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                                {box.label}
                              </span>
                              <span
                                className={classNames(
                                  "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                                  box.classification === "ownership"
                                    ? "bg-emerald-100 text-emerald-900"
                                    : box.classification === "team"
                                      ? "bg-amber-100 text-amber-900"
                                      : box.classification === "evidence"
                                        ? "bg-cyan-100 text-cyan-900"
                                        : box.classification === "fluff"
                                          ? "bg-rose-100 text-rose-900"
                                          : "bg-slate-100 text-slate-700",
                                )}
                              >
                                {box.classification}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-800">
                              {box.text}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              {box.reason}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-600">
                          Add more story detail and the calibration engine will box ownership, team blur, evidence, and fluff here.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Textual inpainting and ghost metrics
                      </p>
                      <div className="mt-3 space-y-3">
                        {storyCalibrationReport.ghostMetrics.length ? (
                          storyCalibrationReport.ghostMetrics.map((ghost) => (
                            <div
                              key={`${ghost.field}-${ghost.label}`}
                              className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-3"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-900">
                                {ghost.label}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-cyan-950">
                                {ghost.placeholder}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-cyan-900/80">
                                {ghost.reason}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  applyGhostMetric(ghost.field, ghost.placeholder)
                                }
                                className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
                              >
                                Add this ghost scaffold
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-600">
                            No ghost metrics are needed right now. The story already has enough structure for a hard rep.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Zero waste filter
                      </p>
                      <div className="mt-3 space-y-3">
                        {storyCalibrationReport.zeroWasteSuggestions.length ? (
                          storyCalibrationReport.zeroWasteSuggestions.map((item) => (
                            <div
                              key={`${item.field}-${item.cleaned}`}
                              className="rounded-2xl bg-white p-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                                  {item.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    applyCalibrationFieldValue(
                                      item.field,
                                      item.cleaned,
                                      `Applied the zero-waste filter to ${item.label.toLowerCase()}.`,
                                    )
                                  }
                                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                                >
                                  Apply cut
                                </button>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-slate-500 line-through decoration-rose-400">
                                {item.original}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-900">
                                {item.cleaned}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                Removed: {item.removedTerms.join(", ")}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-600">
                            The zero-waste filter did not find obvious adjective or buzzword waste in the current draft.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Anti-placeholder mechanism
                      </p>
                      <div className="mt-3 space-y-3">
                        {storyCalibrationReport.placeholderDefects.length ? (
                          storyCalibrationReport.placeholderDefects.map((defect) => (
                            <div
                              key={`${defect.field}-${defect.token}-${defect.detail}`}
                              className="rounded-2xl bg-white p-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                                  {defect.label}
                                </span>
                                <span
                                  className={classNames(
                                    "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                                    defect.severity === "critical"
                                      ? "bg-rose-100 text-rose-900"
                                      : "bg-amber-100 text-amber-900",
                                  )}
                                >
                                  {defect.severity}
                                </span>
                              </div>
                              <p className="mt-3 text-sm font-semibold text-slate-950">
                                Trigger: {defect.token}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {defect.detail}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                Fix: {defect.repairMove}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl bg-white p-3 text-sm leading-6 text-slate-600">
                            No obvious placeholder, chronology, or fake-metric defects were detected in this draft.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Role-scale enforcement
                    </p>
                    <div
                      className={classNames(
                        "mt-3 rounded-2xl p-4 text-sm leading-6",
                        storyCalibrationReport.roleScale.verdict === "aligned"
                          ? "bg-emerald-50 text-emerald-950"
                          : "bg-amber-50 text-amber-950",
                      )}
                    >
                      <p className="font-semibold">
                        {storyCalibrationReport.roleScale.summary}
                      </p>
                      <p className="mt-2">
                        {storyCalibrationReport.roleScale.rewriteMove}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {storyCalibrationReport.deliveryMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="rounded-2xl bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-950">
                              {metric.label}
                            </p>
                            <span
                              className={classNames(
                                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                                metric.status === "good"
                                  ? "bg-emerald-100 text-emerald-900"
                                  : metric.status === "watch"
                                    ? "bg-amber-100 text-amber-900"
                                    : "bg-rose-100 text-rose-900",
                              )}
                            >
                              {metric.value}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {metric.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] bg-slate-950 p-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Red team Bar Raiser mode
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      These are the aggressive follow-ups the system would throw based on this exact story, not another one.
                    </p>
                    <div className="mt-3 space-y-3">
                      {storyCalibrationReport.redTeamFollowUps.map((followUp) => (
                        <div
                          key={followUp}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/88"
                        >
                          {followUp}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={applyFullCalibrationPass}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Apply full calibration pass
                      </button>
                      <p className="self-center text-sm text-white/68">
                        This applies the Bar Raiser rewrite plus any missing ghost scaffolds in one shot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-rose-200 bg-rose-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-900">
                  Brutal honesty
                </p>
                <p className="mt-3 text-sm leading-7 text-rose-950">
                  {liveStoryReview.brutalTruth}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Debrief readout
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-800">
                  {liveStoryReview.debriefReadout}
                </p>
              </div>

              <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Coach notes
                </p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                  {liveStoryTips.length ? (
                    liveStoryTips.map((tip) => (
                      <p
                        key={tip}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        {tip}
                      </p>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      The structure is in good shape. Rehearse it aloud so the
                      transitions sound conversational, not memorized.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Repair plan
                </p>
                <div className="mt-3 grid gap-3 text-sm text-slate-700">
                  {liveStoryReview.repairPlan.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-3">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  STAR reminder
                </p>
                <div className="mt-3 grid gap-3 text-sm text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="font-semibold text-slate-950">S:</span>{" "}
                    Keep the setup brief.
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="font-semibold text-slate-950">T:</span>{" "}
                    Make ownership explicit.
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="font-semibold text-slate-950">A:</span>{" "}
                    Show judgment, tradeoffs, and sequencing.
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <span className="font-semibold text-slate-950">R:</span>{" "}
                    Close with evidence, then the lesson.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <StoryRehearsalStudio story={storyDraft} />
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/82 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Modular story pivoting
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950">
                    Re-aim the same grounded story without crossing into another one.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {storyPivotPack.summary}
                  </p>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  {storyPivotPack.nodes.length} pivot nodes
                </span>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-3">
                {storyPivotPack.nodes.length ? (
                  storyPivotPack.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50/85 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                          {node.label}
                        </span>
                        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                          {node.targetCategoryLabel}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {node.framingMove}
                      </p>
                      <div className="mt-4 rounded-2xl bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Pivoted result
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-800">
                          {node.pivotedResult}
                        </p>
                      </div>
                      <div className="mt-3 rounded-2xl bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Pivoted reflection
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-800">
                          {node.pivotedReflection}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyStoryPivotNode(node)}
                        className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                      >
                        Apply this pivot ending
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-600 xl:col-span-3">
                    Build out the story and tag it to one or more Amazon categories. The app will then generate safe pivot endings that stay grounded to the same source facts.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Bulletproof check
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">
                      Pressure-test the story before an interviewer does.
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {liveStoryPressureTest.score}% pressure score
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {liveStoryPressureTest.vulnerabilities.length ? (
                    liveStoryPressureTest.vulnerabilities.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-rose-50 p-4 text-sm leading-6 text-rose-950"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                      No obvious story leaks right now. Keep rehearsing the same
                      story out loud so the structure sounds natural instead of
                      memorized.
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-[22px] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Best upgrade moves
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                    {liveStoryPressureTest.upgradeMoves.length ? (
                      liveStoryPressureTest.upgradeMoves.map((move) => (
                        <div key={move} className="rounded-2xl bg-white p-3">
                          {move}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-white p-3">
                        Keep adding crisp proof points and repeating the story
                        under time pressure.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Source-bank prompts this story should survive
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/88">
                  {liveStoryPressureTest.pressureQuestions.length ? (
                    liveStoryPressureTest.pressureQuestions.map((question) => (
                      <div
                        key={question}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        {question}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      Tag the story to an Amazon category and the matching
                      source-bank prompts will show up here for rehearsal.
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    What already lands
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                    {liveStoryPressureTest.strengths.length ? (
                      liveStoryPressureTest.strengths.map((strength) => (
                        <div
                          key={strength}
                          className="rounded-2xl border border-white/10 bg-black/10 p-3"
                        >
                          {strength}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                        Strong signals will show up here once the story has
                        clearer ownership, proof, and decision quality.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_18px_48px_rgba(15,23,42,0.22)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Bar Raiser amplify
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    Let the hardest interviewer rewrite the story with you.
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/80">
                    This pass acts like a skeptical Bar Raiser. It tightens the
                    story, shows the exact sections that need surgery, and tells
                    you the proof still missing before the story is truly safe
                    in a hard loop.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    Current {liveStoryReview.score}%
                  </span>
                  <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                    Amplified {barRaiserAmplification.amplifiedReview.score}%
                  </span>
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      barRaiserAmplification.scoreDelta > 0
                        ? "bg-emerald-300/15 text-emerald-100"
                        : barRaiserAmplification.scoreDelta < 0
                          ? "bg-rose-300/15 text-rose-100"
                          : "bg-white/10 text-white/80",
                    )}
                  >
                    {barRaiserAmplification.scoreDelta > 0 ? "+" : ""}
                    {barRaiserAmplification.scoreDelta} pts
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="lg:col-span-2">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {barRaiserAmplification.dimensionGoals.map((dimension) => (
                      <div
                        key={dimension.id}
                        className="rounded-[22px] border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
                          {dimension.label}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white">
                            {dimension.currentScore}
                          </span>
                          <span className="text-white/45">{"->"}</span>
                          <span className="rounded-full bg-cyan-300/15 px-2.5 py-1 font-semibold text-cyan-100">
                            {dimension.amplifiedScore}
                          </span>
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/45">
                          Elite bar {dimension.targetScore}+
                        </p>
                        <p
                          className={classNames(
                            "mt-2 text-sm font-semibold",
                            dimension.gapToTarget === 0
                              ? "text-emerald-200"
                              : "text-amber-100",
                          )}
                        >
                          {dimension.gapToTarget === 0
                            ? "At elite bar"
                            : `${dimension.gapToTarget} pts still open`}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/72">
                          {dimension.nextLift}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Bar Raiser readout
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white">
                      {barRaiserAmplification.headline}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/82">
                      {barRaiserAmplification.barRaiserReadout}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Proof I still need from you
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                      {barRaiserAmplification.proofDemands.length ? (
                        barRaiserAmplification.proofDemands.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/10 p-3"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-emerald-100">
                          No obvious proof gaps are left. The next lift is live
                          rehearsal so the evidence lands fast when challenged.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Next amplifier moves
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                      {barRaiserAmplification.amplifierMoves.length ? (
                        barRaiserAmplification.amplifierMoves.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/10 p-3"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                          The structure is already in good shape. Stay focused
                          on delivery and repeat the story until it sounds calm,
                          specific, and earned.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Source-bank prompts I would use to probe it
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                      {barRaiserAmplification.sourceBankPrompts.length ? (
                        barRaiserAmplification.sourceBankPrompts.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/10 p-3"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                          Tag the story to the right Amazon categories and the
                          matching source-bank prompts will appear here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Section-by-section surgery
                    </p>
                    <div className="mt-3 space-y-4">
                      {barRaiserAmplification.sectionUpgrades.length ? (
                        barRaiserAmplification.sectionUpgrades.map((item) => (
                          <div
                            key={item.field}
                            className="rounded-[22px] border border-white/10 bg-black/10 p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">
                                  Why this changed
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/72">
                                  {item.reason}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  applyBarRaiserAmplifiedField(item.field)
                                }
                                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950"
                              >
                                Use this {item.label.toLowerCase()}
                              </button>
                            </div>

                            <div className="mt-4 grid gap-3 lg:grid-cols-2">
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                                  Before
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white/72">
                                  {item.before}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
                                  After
                                </p>
                                <p className="mt-2 text-sm leading-6 text-white">
                                  {item.after}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white/78">
                          The wording is already tight enough that line edits are
                          not the blocker. What remains is proof quality,
                          tradeoff clarity, and live delivery under pressure.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Amplified draft
                    </p>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                          Title
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white">
                          {barRaiserAmplification.draft.title ||
                            "Title still needed"}
                        </p>
                      </div>
                      {(
                        [
                          ["Situation", barRaiserAmplification.draft.situation],
                          ["Task", barRaiserAmplification.draft.task],
                          ["Action", barRaiserAmplification.draft.action],
                          ["Result", barRaiserAmplification.draft.result],
                          ["Reflection", barRaiserAmplification.draft.reflection],
                        ] as const
                      ).map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/10 bg-black/10 p-3"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                            {label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/82">
                            {value || `${label} still needs real facts.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Remaining risks
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-white/82">
                      {barRaiserAmplification.remainingRisks.length ? (
                        barRaiserAmplification.remainingRisks.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-rose-100"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-emerald-100">
                          No obvious risk flags remain. Keep this story sharp by
                          rehearsing it until the proof and tradeoff land in the
                          first answer, not only after follow-ups.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={applyBarRaiserAmplification}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                >
                  Apply Bar Raiser amplify
                </button>
                <p className="self-center text-sm text-white/70">
                  Apply the amplified version, then record it and listen for any
                  place where the proof still sounds thin or rushed.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-slate-200 bg-white/82 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Elite polish
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    Tighten the story after the pressure test.
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                    This version keeps your facts, trims weak phrasing, sharpens
                    ownership, and makes the story sound more senior without
                    inventing proof you did not give.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Current {liveStoryReview.score}%
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                    Polished {eliteStoryPolish.polishedReview.score}%
                  </span>
                  <span
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      eliteStoryPolish.scoreDelta > 0
                        ? "bg-emerald-100 text-emerald-900"
                        : eliteStoryPolish.scoreDelta < 0
                          ? "bg-rose-100 text-rose-900"
                          : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {eliteStoryPolish.scoreDelta > 0 ? "+" : ""}
                    {eliteStoryPolish.scoreDelta} pts
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-cyan-200 bg-cyan-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-900">
                      What changed
                    </p>
                    <p className="mt-3 text-sm leading-7 text-cyan-950">
                      {eliteStoryPolish.headline}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Adjustments made
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                      {eliteStoryPolish.adjustments.map((item) => (
                        <div key={item} className="rounded-2xl bg-white p-3">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Still blocking elite
                    </p>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                      {eliteStoryPolish.remainingGaps.length ? (
                        eliteStoryPolish.remainingGaps.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl bg-rose-50 p-3 text-rose-950"
                          >
                            {item}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-950">
                          No obvious remaining gaps. The next lift is delivery:
                          repeat it aloud until it sounds calm and earned.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Polished story draft
                    </p>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Title
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                          {eliteStoryPolish.draft.title || "Title still needed"}
                        </p>
                      </div>
                      {(
                        [
                          ["Situation", eliteStoryPolish.draft.situation],
                          ["Task", eliteStoryPolish.draft.task],
                          ["Action", eliteStoryPolish.draft.action],
                          ["Result", eliteStoryPolish.draft.result],
                          ["Reflection", eliteStoryPolish.draft.reflection],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {value || `${label} still needs real facts.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-slate-950 p-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Polished verdict
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {eliteStoryPolish.polishedReview.verdictLabel}
                      </span>
                      <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                        {eliteStoryPolish.polishedReview.score}% score
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/88">
                      {eliteStoryPolish.polishedReview.debriefReadout}
                    </p>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-white/82">
                      {eliteStoryPolish.polishedReview.repairPlan.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={applyEliteStoryPolish}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                >
                  Apply elite polish
                </button>
                <p className="self-center text-sm text-slate-600">
                  Apply the tightened version, then rehearse it in the story
                  recorder until the delivery sounds natural.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveCurrentStory}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
              >
                {editingStoryId ? "Save story" : "Add to story bank"}
              </button>
              <button
                type="button"
                onClick={startFreshStory}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Clear draft
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === "drills" ? (
        <section className="space-y-4">
          <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Mock drill engine
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Practice questions that force clarity under pressure.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Reveal the scorecard only after you answer out loud. Then rate
                  yourself honestly.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="drill-length"
                  className="text-sm font-medium text-slate-700"
                >
                  Questions
                </label>
                <select
                  id="drill-length"
                  value={drillLength}
                  onChange={(event) =>
                    setDrillLength(
                      Number(
                        event.target.value,
                      ) as (typeof drillLengthOptions)[number],
                    )
                  }
                  className="min-w-[84px]"
                >
                  {drillLengthOptions.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={startDrillSession}
                  disabled={!filteredQuestions.length}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start session
                </button>
                {drillHasStarted ? (
                  <button
                    type="button"
                    onClick={resetDrillSession}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
                  >
                    Reset
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Available prompts
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {filteredQuestions.length}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Strong ratings
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {
                    progress.drillHistory.filter(
                      (entry) => entry.rating === "strong",
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Current focus
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {selectedCategory
                    ? selectedCategory.label
                    : INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedCompetency === "all"
                    ? "All coaching lanes"
                    : getCompetencyById(selectedCompetency).title}
                </p>
              </div>
            </div>
          </article>

          <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Endurance loop simulator
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Four rising-pressure rounds that test stamina, not just story quality.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {enduranceLoopPlan.summary}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white/82 px-4 py-3 text-sm text-slate-700">
                <div>{enduranceLoopPlan.totalRounds} rounds</div>
                <div className="mt-1">{enduranceLoopPlan.totalQuestions} prompts</div>
                <div className="mt-1">{enduranceLoopPlan.totalMinutes} minutes</div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {enduranceLoopPlan.rounds.map((round) => (
                <div
                  key={round.id}
                  className="rounded-[24px] border border-slate-200 bg-white/82 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      {round.lensLabel}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                      {round.questionIds.length} prompts
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">
                    {round.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {round.pressureNote}
                  </p>
                  <div className="mt-4 space-y-2">
                    {round.promptTitles.length ? (
                      round.promptTitles.map((promptTitle) => (
                        <div
                          key={promptTitle}
                          className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"
                        >
                          {promptTitle}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                        Not enough prompts are available in the current filter for this round yet.
                      </div>
                    )}
                  </div>
                  {round.questionIds[0] ? (
                    <button
                      type="button"
                      onClick={() =>
                        openQuestionInBarRaiser(round.questionIds[0], round.lensId)
                      }
                      className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open round in Bar Raiser
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          {drillHasStarted && currentDrillQuestion ? (
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Question {drillIndex + 1} / {drillQuestions.length}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    {currentDrillQuestion.title}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                    {currentDrillQuestion.sourceCategoryLabel}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {getCompetencyById(currentDrillQuestion.competency).title}
                  </span>
                  {currentDrillQuestion.managerOnly ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                      Manager only
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 rounded-[26px] bg-slate-950 p-6 text-white">
                <p className="text-lg leading-8 text-white/92">
                  {currentDrillQuestion.prompt}
                </p>
              </div>

              {!drillRevealed ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={revealCurrentDrill}
                    className="rounded-full bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,116,144,0.22)]"
                  >
                    Reveal scorecard
                  </button>
                  <p className="text-sm text-slate-600">
                    Answer aloud first, then use the rubric.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        A strong answer includes
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentDrillQuestion.listenFors.map((signal) => (
                          <span
                            key={signal}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-800"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        <p className="font-semibold text-slate-950">
                          Follow-up pressure test
                        </p>
                        <div className="mt-3 space-y-2">
                          {currentDrillQuestion.followUps.map((followUp) => (
                            <div
                              key={followUp}
                              className="rounded-2xl bg-white p-3"
                            >
                              {followUp}
                            </div>
                          ))}
                        </div>
                      </div>
                      {currentDrillAdjacentPrompts.length ? (
                        <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 text-sm leading-6 text-cyan-950">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-900">
                            More prompts from your source bank
                          </p>
                          <div className="mt-3 space-y-2">
                            {currentDrillAdjacentPrompts.map((prompt) => (
                              <div
                                key={prompt}
                                className="rounded-2xl bg-white p-3 text-slate-700"
                              >
                                {prompt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white/82 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Self score
                      </p>
                      <div className="mt-3 grid gap-3">
                        {(Object.keys(ratingMeta) as DrillRating[]).map(
                          (rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => rateCurrentDrill(rating)}
                              disabled={drillRating !== null}
                              className={classNames(
                                "rounded-2xl px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                                ratingMeta[rating].buttonClass,
                              )}
                            >
                              {ratingMeta[rating].label}
                            </button>
                          ),
                        )}
                      </div>
                      {drillRating ? (
                        <div
                          className={classNames(
                            "mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-medium",
                            ratingMeta[drillRating].summaryClass,
                          )}
                        >
                          Rated {ratingMeta[drillRating].label}. Move on only
                          after you can explain why you chose it.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={moveToNextDrill}
                      disabled={drillRating === null}
                      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {drillIndex >= drillQuestions.length - 1
                        ? "Finish session"
                        : "Next question"}
                    </button>
                  </div>
                </>
              )}
            </article>
          ) : null}

          {drillFinished ? (
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Session recap
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                    Your last round, scored honestly.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={startDrillSession}
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800"
                >
                  Run it again
                </button>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {(Object.keys(ratingMeta) as DrillRating[]).map((rating) => (
                  <div
                    key={rating}
                    className="rounded-[22px] border border-slate-200 bg-white/80 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {ratingMeta[rating].label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      {drillSummary[rating]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-sm leading-7 text-white/84">
                  Best next move: rerun the same lane until the weakest answer
                  feels structured without the scorecard, then switch filters
                  and stress a different competency.
                </p>
              </div>
            </article>
          ) : null}
        </section>
      ) : null}

      {activeTab === "bar_raiser" ? (
        <BarRaiserStudio
          key={`bar-raiser-${barRaiserQuestionId ?? "default"}-${barRaiserLensId ?? "default"}-${selectedFamily}-${effectiveSelectedCategoryId}-${selectedCompetency}`}
          questions={filteredQuestions}
          initialQuestionId={barRaiserQuestionId}
          initialLensId={barRaiserLensId}
          onLogReview={logBarRaiserReview}
        />
      ) : null}

      {activeTab === "executive_coach" ? (
        <ExecutiveCoachPanel
          progress={progress}
          selectedFamily={selectedFamily}
          selectedCategory={selectedCategory}
          selectedCompetency={selectedCompetency}
          storyDraft={storyDraft}
          currentQuestion={currentQuestionBankEntry}
          onPracticeQuestion={openQuestionInBarRaiser}
          onLoadPrepDeckStory={loadPrepDeckStory}
          onLoadSavedStory={loadStoryForEdit}
        />
      ) : null}

      {activeTab === "frameworks" ? (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Question bank browser
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Browse the exact prompts from your source bank.
                </h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {filteredQuestions.length
                  ? `${(questionBankIndex % filteredQuestions.length) + 1} / ${filteredQuestions.length}`
                  : "0 prompts"}
              </div>
            </div>

            {currentQuestionBankEntry ? (
              <>
                <div className="mt-5 rounded-[28px] border border-slate-200 bg-white/82 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
                      {currentQuestionBankEntry.sourceCategoryLabel}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {
                        getCompetencyById(currentQuestionBankEntry.competency)
                          .title
                      }
                    </span>
                    {currentQuestionBankEntry.managerOnly ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                        Manager only
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-2xl font-semibold leading-9 text-slate-950">
                    {currentQuestionBankEntry.prompt}
                  </p>
                  {currentQuestionBankEntry.followUps.length ? (
                    <div className="mt-5 rounded-[22px] bg-slate-950 p-5 text-sm leading-7 text-white/90">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Follow-up pressure prompts
                      </p>
                      <div className="mt-3 space-y-3">
                        {currentQuestionBankEntry.followUps.map((followUp) => (
                          <div
                            key={followUp}
                            className="rounded-2xl border border-white/10 bg-white/5 p-3"
                          >
                            {followUp}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => rotateQuestionBank(-1)}
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => rotateQuestionBank(1)}
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      currentQuestionBankEntry
                        ? openQuestionInBarRaiser(currentQuestionBankEntry.id)
                        : setActiveTab("bar_raiser")
                    }
                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Practice this prompt
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-600">
                No prompts in this filter. Switch family, category, or coaching
                lane above.
              </div>
            )}
          </article>

          <div className="space-y-4">
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Category inventory
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                All visible prompts come from the imported bank.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Canonical source count:{" "}
                <span className="font-semibold text-slate-950">
                  {INTERVIEW_QUESTIONS.length}
                </span>{" "}
                imported prompts.
              </p>
              <div className="mt-4 space-y-3">
                {selectedFamilyCategories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-[22px] border border-slate-200 bg-white/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {category.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {category.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {questionCountsByCategory[category.id] ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Prompt readiness
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Know whether this exact prompt is covered or exposed.
              </h2>
              {currentQuestionBankEntry && currentQuestionReadiness ? (
                <>
                  <div className="mt-4 rounded-[22px] border border-slate-200 bg-white/82 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={classNames(
                          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                          currentQuestionReadiness.label === "ready"
                            ? "bg-emerald-100 text-emerald-900"
                            : currentQuestionReadiness.label === "at_risk"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-900",
                        )}
                      >
                        {currentQuestionReadiness.label.replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {currentQuestionReadiness.score}% readiness
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {currentQuestionReadiness.detail}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {currentQuestionMatchedStories.length ? (
                      currentQuestionMatchedStories.map((story) => (
                        <div
                          key={story.id}
                          className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-950">
                                  {story.title}
                                </p>
                                <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                                  {reviewStarStory(story).score}%
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {story.result || story.reflection || story.action}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => loadStoryForEdit(story.id)}
                              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                            >
                              Edit story
                            </button>
                          </div>
                        </div>
                      ))
                    ) : currentQuestionPrepDeckStories.length ? (
                      currentQuestionPrepDeckStories.map((story) => (
                        <div
                          key={story.id}
                          className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                Story-bank fallback: {story.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {story.reflection}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => loadPrepDeckStory(story.id, "elite")}
                              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                            >
                              Load elite fallback
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[22px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                        No saved story is tagged to this prompt yet. Treat this as exposed until you build one.
                      </div>
                    )}
                  </div>

                  {currentQuestionAdjacentPrompts.length ? (
                    <div className="mt-4 rounded-[22px] border border-cyan-200 bg-cyan-50/80 p-4 text-sm leading-6 text-cyan-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-900">
                        More prompts from the same source bank
                      </p>
                      <div className="mt-3 space-y-2">
                        {currentQuestionAdjacentPrompts.map((prompt) => (
                          <div
                            key={prompt}
                            className="rounded-2xl bg-white p-3 text-slate-700"
                          >
                            {prompt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-4 rounded-[22px] border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                  Choose a prompt to see whether you are genuinely covered or still exposed.
                </div>
              )}
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Current filter summary
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  Active family:{" "}
                  <span className="font-semibold text-slate-950">
                    {INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  Active category:{" "}
                  <span className="font-semibold text-slate-950">
                    {selectedCategory
                      ? selectedCategory.label
                      : "All categories"}
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
                  Active coaching lane:{" "}
                  <span className="font-semibold text-slate-950">
                    {selectedCompetency === "all"
                      ? "All lanes"
                      : getCompetencyById(selectedCompetency).title}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {activeTab === "game_day" ? (
        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Execution checklist
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Make the day predictable before it starts.
              </h2>
              <div className="mt-5 space-y-4">
                {checklistByPhase.map((group) => (
                  <div
                    key={group.phase}
                    className="rounded-[24px] border border-slate-200 bg-white/82 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {group.label}
                    </p>
                    <div className="mt-3 space-y-3">
                      {group.items.map((item) => {
                        const done = progress.checklistDoneIds.includes(
                          item.id,
                        );

                        return (
                          <label
                            key={item.id}
                            className={classNames(
                              "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition",
                              done
                                ? "border-emerald-200 bg-emerald-50/80"
                                : "border-slate-200 bg-white",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={(event) =>
                                toggleChecklist(item.id, event.target.checked)
                              }
                              className="mt-1 h-4 w-4 rounded border-slate-300"
                            />
                            <span>
                              <span className="block text-sm font-semibold text-slate-950">
                                {item.title}
                              </span>
                              <span className="mt-1 block text-sm leading-6 text-slate-700">
                                {item.detail}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-4">
            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Interview day reminders
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Use the story bank on the day, not just before it.
              </h2>
              <div className="mt-4 space-y-3">
                {AMAZON_PREP_DECK_INTERVIEW_DAY_REMINDERS.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[22px] bg-slate-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  Questions to ask
                </p>
                <div className="mt-3 space-y-3">
                  {AMAZON_PREP_DECK_QUESTIONS_TO_ASK.map((question) => (
                    <div
                      key={question}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/88"
                    >
                      {question}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Panel game plan
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Walk in with a no-repeat story map.
              </h2>
              <div className="mt-4 space-y-3">
                {AMAZON_PREP_DECK_PANEL_PLAN.map((entry) => {
                  const primaryStory = getPrepDeckStoryById(entry.primaryStoryId);
                  const backupStory = getPrepDeckStoryById(entry.backupStoryId);

                  return (
                    <div
                      key={`${entry.interviewer}-${entry.categoryId}`}
                      className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                          {entry.interviewer}
                        </span>
                        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-900">
                          {getQuestionCategoryById(entry.categoryId).label}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Primary:{" "}
                        <span className="font-semibold text-slate-950">
                          {primaryStory?.shortLabel ?? entry.primaryStoryId}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        Backup:{" "}
                        <span className="font-semibold text-slate-950">
                          {backupStory?.shortLabel ?? entry.backupStoryId}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Rescue scripts
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Prepare for the ugly moments, not just the clean answers.
              </h2>
              <div className="mt-4 space-y-3">
                {INTERVIEW_RESCUE_SCRIPTS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-white/82 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-950">
                        {item.title}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {item.scenario}
                      </span>
                    </div>
                    <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-white">
                      {item.script}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {item.whyItWorks}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Prompt readiness
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Stay inside your real bank on game day.
              </h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700">
                  Active family:{" "}
                  <span className="font-semibold text-slate-950">
                    {INTERVIEW_SOURCE_FAMILY_LABELS[selectedFamily]}
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700">
                  Active category:{" "}
                  <span className="font-semibold text-slate-950">
                    {selectedCategory
                      ? selectedCategory.label
                      : "All categories"}
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700">
                  Prompt count in current filter:{" "}
                  <span className="font-semibold text-slate-950">
                    {filteredQuestions.length}
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700">
                  Manager-only prompts in current filter:{" "}
                  <span className="font-semibold text-slate-950">
                    {
                      filteredQuestions.filter(
                        (question) => question.managerOnly,
                      ).length
                    }
                  </span>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700">
                  Keep your final reps anchored to the imported bank so your
                  practice language matches the real loop.
                </div>
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Negotiation posture
              </p>
              <div className="mt-4 space-y-3">
                {NEGOTIATION_REMINDERS.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-slate-200 bg-white/82 p-4 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel rounded-[28px] border border-slate-200/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Red flags
              </p>
              <div className="mt-4 space-y-3">
                {RED_FLAGS.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-rose-200 bg-rose-50/80 p-4 text-sm leading-6 text-rose-950"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
