import {
  AMAZON_PREP_DECK_PITCH_TEMPLATE,
  getPrepDeckStoriesForCategory,
  getPrepDeckStoriesForFamily,
  type PrepDeckStoryTemplate,
} from "./amazonPrepDeck";
import {
  buildEliteStoryDraft,
  buildStoryPressureTest,
  getAmazonCoverageSummary,
  getCompetencyById,
  getQuestionCategoryById,
  getWeakestCompetency,
  INTERVIEW_QUESTIONS,
  INTERVIEW_SOURCE_FAMILY_LABELS,
  reviewStarStory,
  type CompetencyId,
  type InterviewPrepProgress,
  type InterviewQuestion,
  type InterviewQuestionCategory,
  type InterviewSourceFamily,
  type InterviewerLensId,
  type StarStory,
  type StoryDraft,
} from "./interview";

export type ExecutiveCoachMode =
  | "briefing"
  | "opener"
  | "story"
  | "pressure"
  | "weakness"
  | "drill";

export interface ExecutiveCoachContext {
  message: string;
  progress: InterviewPrepProgress;
  selectedFamily: InterviewSourceFamily;
  selectedCategory: InterviewQuestionCategory | null;
  selectedCompetency: CompetencyId | "all";
  storyDraft: StoryDraft;
  currentQuestion: InterviewQuestion | null;
}

export interface ExecutiveCoachQuestionReference {
  id: string;
  prompt: string;
  categoryLabel: string;
  followUps: string[];
  managerOnly: boolean;
  recommendedLensId: InterviewerLensId;
}

export interface ExecutiveCoachStoryReference {
  source: "saved" | "prep_deck";
  id: string;
  title: string;
  detail: string;
  metrics: string[];
}

export interface ExecutiveCoachReply {
  mode: ExecutiveCoachMode;
  title: string;
  summary: string;
  executiveRewrite: string | null;
  debriefReadout: string | null;
  hardTruths: string[];
  repairPlan: string[];
  nextMoves: string[];
  suggestedPrompts: string[];
  recommendedQuestion: ExecutiveCoachQuestionReference | null;
  recommendedStories: ExecutiveCoachStoryReference[];
}

export const EXECUTIVE_COACH_STARTER_PROMPTS = [
  "Give me the executive version of tell me about yourself.",
  "Pressure-test my current story like a bar raiser.",
  "What is my weakest interview signal right now?",
  "Give me the hardest question in this lane.",
  "Which story should I lead with for this category?",
  "Turn my current draft into a sharper executive story.",
] as const;

function clampList(items: string[], limit: number): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))].slice(
    0,
    limit,
  );
}

function buildCoachDebriefReadout(
  title: string,
  summary: string,
  hardTruths: string[],
): string {
  return [summary, ...hardTruths.slice(0, 2)]
    .filter(Boolean)
    .join(" ")
    .replace(/^/, `${title} debrief: `);
}

function countStorySignals(story: Partial<StoryDraft>): number {
  return [
    story.title,
    story.situation,
    story.task,
    story.action,
    story.result,
    story.reflection,
  ].filter((value) => typeof value === "string" && value.trim().length > 0)
    .length;
}

function hasDraftContent(story: Partial<StoryDraft>): boolean {
  return countStorySignals(story) >= 2;
}

function getAverageBarRaiserScore(progress: InterviewPrepProgress): number | null {
  if (!progress.barRaiserHistory.length) {
    return null;
  }

  return Math.round(
    progress.barRaiserHistory.reduce((sum, review) => sum + review.score, 0) /
      progress.barRaiserHistory.length,
  );
}

function getQuestionAttemptCount(
  progress: InterviewPrepProgress,
  questionId: string,
): number {
  return progress.questionStats[questionId]?.attempted ?? 0;
}

function buildExecutiveOpening(progress: InterviewPrepProgress): string {
  const present =
    progress.pitch.present.trim() || AMAZON_PREP_DECK_PITCH_TEMPLATE.pack.present;
  const proof =
    progress.pitch.proof.trim() || AMAZON_PREP_DECK_PITCH_TEMPLATE.pack.proof;
  const future =
    progress.pitch.future.trim() || AMAZON_PREP_DECK_PITCH_TEMPLATE.pack.future;
  const whyHere =
    progress.pitch.whyHere.trim() || AMAZON_PREP_DECK_PITCH_TEMPLATE.pack.whyHere;

  return [present, proof, future, whyHere].filter(Boolean).join(" ");
}

function buildExecutiveStoryNarrative(story: StoryDraft): string {
  const setup = [story.situation, story.task].filter(Boolean).join(" ");
  const close = [story.result, story.reflection].filter(Boolean).join(" ");

  return [setup, story.action, close].filter(Boolean).join(" ");
}

function inferMode(message: string): ExecutiveCoachMode {
  const normalized = message.toLowerCase();

  if (
    /\b(tell me about yourself|introduce|introduction|intro|opening pitch|opener|pitch)\b/.test(
      normalized,
    )
  ) {
    return "opener";
  }

  if (
    /\b(weak|weakest|gap|fix|improve|why am i not ready|what am i missing)\b/.test(
      normalized,
    )
  ) {
    return "weakness";
  }

  if (
    /\b(story|star|rewrite|write|finish|draft|bulletproof)\b/.test(normalized)
  ) {
    return "story";
  }

  if (
    /\b(grill|pressure|push back|bar raiser|follow-up|hard on me|cross examine)\b/.test(
      normalized,
    )
  ) {
    return "pressure";
  }

  if (
    /\b(drill|practice|question|mock|ask me|hardest question)\b/.test(
      normalized,
    )
  ) {
    return "drill";
  }

  return "briefing";
}

function getRecommendedLensId(question: InterviewQuestion): InterviewerLensId {
  if (question.managerOnly) {
    return "l7_bar_raiser";
  }

  switch (question.competency) {
    case "technical_depth":
    case "problem_solving":
    case "ownership":
      return "l6_ops";
    case "leadership":
    case "stakeholder_management":
      return "hrbp";
    default:
      return "l7_bar_raiser";
  }
}

function toQuestionReference(
  question: InterviewQuestion,
): ExecutiveCoachQuestionReference {
  return {
    id: question.id,
    prompt: question.prompt,
    categoryLabel: question.sourceCategoryLabel,
    followUps: [...question.followUps].slice(0, 3),
    managerOnly: question.managerOnly,
    recommendedLensId: getRecommendedLensId(question),
  };
}

function scoreStoryMatch(
  story: StarStory,
  selectedCategory: InterviewQuestionCategory | null,
  selectedCompetency: CompetencyId | "all",
): number {
  let score = 0;

  if (selectedCategory && story.categoryTags.includes(selectedCategory.id)) {
    score += 4;
  }
  if (selectedCompetency !== "all" && story.competency === selectedCompetency) {
    score += 3;
  }
  if (story.result.trim().length > 0) {
    score += 2;
  }
  if (story.reflection.trim().length > 0) {
    score += 1;
  }

  return score;
}

function buildSavedStoryReference(story: StarStory): ExecutiveCoachStoryReference {
  return {
    source: "saved",
    id: story.id,
    title: story.title || "Saved story",
    detail:
      story.result.trim() ||
      story.action.trim() ||
      story.situation.trim() ||
      "Saved STAR draft",
    metrics: [],
  };
}

function buildPrepDeckStoryReference(
  story: PrepDeckStoryTemplate,
): ExecutiveCoachStoryReference {
  return {
    source: "prep_deck",
    id: story.id,
    title: story.title,
    detail: story.challenge,
    metrics: story.keyNumbers.slice(0, 3),
  };
}

function getRecommendedStories(
  context: ExecutiveCoachContext,
): ExecutiveCoachStoryReference[] {
  const savedStories = [...context.progress.stories]
    .sort(
      (left, right) =>
        scoreStoryMatch(right, context.selectedCategory, context.selectedCompetency) -
        scoreStoryMatch(left, context.selectedCategory, context.selectedCompetency),
    )
    .filter(
      (story) =>
        scoreStoryMatch(
          story,
          context.selectedCategory,
          context.selectedCompetency,
        ) > 0,
    )
    .slice(0, 2)
    .map(buildSavedStoryReference);

  const prepDeckStories = context.selectedCategory
    ? getPrepDeckStoriesForCategory(context.selectedCategory.id)
    : getPrepDeckStoriesForFamily(context.selectedFamily);

  const prepDeckRefs = prepDeckStories
    .slice(0, 2)
    .map(buildPrepDeckStoryReference);

  return [...savedStories, ...prepDeckRefs].slice(0, 3);
}

function pickRecommendedQuestion(
  context: ExecutiveCoachContext,
  options: {
    preferManagerOnly?: boolean;
    preferredCompetency?: CompetencyId | null;
  } = {},
): InterviewQuestion | null {
  const preferredCompetency =
    options.preferredCompetency ??
    (context.selectedCompetency === "all" ? null : context.selectedCompetency);

  let pool = INTERVIEW_QUESTIONS.filter(
    (question) => question.sourceFamily === context.selectedFamily,
  );

  if (context.selectedCategory) {
    pool = pool.filter(
      (question) => question.sourceCategoryId === context.selectedCategory?.id,
    );
  }

  if (preferredCompetency) {
    const byCompetency = pool.filter(
      (question) => question.competency === preferredCompetency,
    );

    if (byCompetency.length) {
      pool = byCompetency;
    }
  }

  if (!pool.length && preferredCompetency) {
    pool = INTERVIEW_QUESTIONS.filter(
      (question) => question.competency === preferredCompetency,
    );
  }

  if (!pool.length) {
    pool = INTERVIEW_QUESTIONS.filter(
      (question) => question.sourceFamily === context.selectedFamily,
    );
  }

  if (options.preferManagerOnly) {
    const managerPool = pool.filter((question) => question.managerOnly);
    if (managerPool.length) {
      pool = managerPool;
    }
  }

  if (!pool.length) {
    return null;
  }

  return [...pool].sort((left, right) => {
    const attemptsDelta =
      getQuestionAttemptCount(context.progress, left.id) -
      getQuestionAttemptCount(context.progress, right.id);

    if (attemptsDelta !== 0) {
      return attemptsDelta;
    }

    const managerDelta = Number(right.managerOnly) - Number(left.managerOnly);
    if (managerDelta !== 0) {
      return managerDelta;
    }

    return right.followUps.length - left.followUps.length;
  })[0];
}

function buildBriefingReply(
  context: ExecutiveCoachContext,
): ExecutiveCoachReply {
  const weakestCompetencyId = getWeakestCompetency(context.progress);
  const weakestCompetency = weakestCompetencyId
    ? getCompetencyById(weakestCompetencyId)
    : null;
  const coverage = getAmazonCoverageSummary(context.progress);
  const averageScore = getAverageBarRaiserScore(context.progress);
  const recommendedQuestion = pickRecommendedQuestion(context, {
    preferredCompetency: weakestCompetencyId,
  });

  const hardTruths: string[] = [];
  if (!context.progress.stories.length) {
    hardTruths.push(
      "You are still underpowered on reusable proof because there is no saved story bank yet.",
    );
  }
  if (averageScore !== null && averageScore < 75) {
    hardTruths.push(
      `Your recent bar-raiser average is ${averageScore}%, which means your answers are still too easy to challenge.`,
    );
  }
  if (coverage.managerRepCount < 3) {
    hardTruths.push(
      "Manager-only pressure is still undertrained. That is where senior candidates get exposed fast.",
    );
  }
  if (weakestCompetency) {
    hardTruths.push(
      `Your weakest signal right now is ${weakestCompetency.title.toLowerCase()}, so do not hide from that lane.`,
    );
  }

  const nextMoves = clampList(
    [
      weakestCompetency
        ? `Run one hard rep in ${weakestCompetency.title.toLowerCase()} and do not switch lanes until the answer gets cleaner.`
        : "",
      context.selectedCategory
        ? `Anchor one bulletproof story to ${context.selectedCategory.label} so this lane has proof instead of theory.`
        : `Broaden coverage across ${INTERVIEW_SOURCE_FAMILY_LABELS[context.selectedFamily]} instead of repeating your easiest stories.`,
      "Use the executive coach for one opener rep, one story rep, and one pressure rep each session.",
      "Record the answer, inspect the transcript, then re-record the exact same prompt until the weak spot disappears.",
    ],
    4,
  );
  const summary = context.selectedCategory
    ? `Current lane: ${context.selectedCategory.label}. I am optimizing for sharper signal, cleaner proof, and answers that survive senior follow-up.`
    : `Current lane: ${INTERVIEW_SOURCE_FAMILY_LABELS[context.selectedFamily]}. I am optimizing for sharper signal, cleaner proof, and answers that survive senior follow-up.`;

  return {
    mode: "briefing",
    title: "Executive Briefing",
    summary,
    executiveRewrite: buildExecutiveOpening(context.progress),
    debriefReadout: buildCoachDebriefReadout("Executive briefing", summary, hardTruths),
    hardTruths: clampList(hardTruths, 4),
    repairPlan: nextMoves,
    nextMoves,
    suggestedPrompts: [
      "What is my weakest interview signal right now?",
      "Give me the hardest question in this lane.",
      "Pressure-test my current story like a bar raiser.",
    ],
    recommendedQuestion: recommendedQuestion
      ? toQuestionReference(recommendedQuestion)
      : null,
    recommendedStories: getRecommendedStories(context),
  };
}

function buildOpenerReply(context: ExecutiveCoachContext): ExecutiveCoachReply {
  const opening = buildExecutiveOpening(context.progress);
  const missingPitchFields = Object.entries(context.progress.pitch)
    .filter(([, value]) => value.trim().length === 0)
    .map(([field]) => field);
  const recommendedQuestion = pickRecommendedQuestion(context);
  const hardTruths = clampList(
    [
      missingPitchFields.length
        ? `Your pitch pack is incomplete: ${missingPitchFields.join(", ")} still needs sharper language.`
        : "",
      "If your opener takes too long to reach measurable proof, you sound junior even when your experience is real.",
      "A senior opener must explain why you fit this role now, not just where you have worked before.",
    ],
    4,
  );
  const repairPlan = clampList(
    [
      "Cut the opener to 60 to 75 seconds and remove any autobiographical filler.",
      "Lead with trajectory, land the proof fast, and close with why this next role is the logical scale move.",
      "Practice the opener until you can say it cleanly without filler words or apologetic setup.",
    ],
    4,
  );
  const summary =
    "Your opener should sound like a leader with receipts, not a candidate searching for a safe summary.";

  return {
    mode: "opener",
    title: "Executive Opening",
    summary,
    executiveRewrite: opening,
    debriefReadout: buildCoachDebriefReadout("Opener", summary, hardTruths),
    hardTruths,
    repairPlan,
    nextMoves: repairPlan,
    suggestedPrompts: [
      "Make that opener sharper for an Area Manager interview.",
      "Turn my opener into something a bar raiser would respect.",
      "What follow-up will they ask after this opener?",
    ],
    recommendedQuestion: recommendedQuestion
      ? toQuestionReference(recommendedQuestion)
      : null,
    recommendedStories: getRecommendedStories(context),
  };
}

function buildStoryReply(context: ExecutiveCoachContext): ExecutiveCoachReply {
  const activeStory = hasDraftContent(context.storyDraft)
    ? context.storyDraft
    : context.progress.stories[0] ??
      buildEliteStoryDraft({
        competency:
          context.selectedCompetency === "all"
            ? context.selectedCategory?.signalLane
            : context.selectedCompetency,
        categoryTags: context.selectedCategory ? [context.selectedCategory.id] : [],
      }).draft;
  const review = reviewStarStory(activeStory);
  const pressure = buildStoryPressureTest(activeStory);
  const draftSuggestion = buildEliteStoryDraft({
    competency: activeStory.competency,
    categoryTags: activeStory.categoryTags,
    titleHint: activeStory.title,
    context: activeStory.situation,
    stakes: activeStory.task,
    actions: activeStory.action,
    result: activeStory.result,
    lesson: activeStory.reflection,
  });
  const categoryHint =
    activeStory.categoryTags[0] ?? context.selectedCategory?.id ?? null;
  const recommendedQuestion = categoryHint
    ? INTERVIEW_QUESTIONS.find(
        (question) => question.sourceCategoryId === categoryHint,
      ) ?? pickRecommendedQuestion(context)
    : pickRecommendedQuestion(context);
  const summary = `Story verdict: ${review.verdictLabel}. I am looking for executive clarity, obvious ownership, measurable proof, and a lesson that scales.`;
  const hardTruths = clampList(
    [...review.misses, ...pressure.vulnerabilities, ...draftSuggestion.missingPieces],
    5,
  );
  const repairPlan = clampList(
    [...review.repairPlan, ...pressure.upgradeMoves, ...draftSuggestion.polishNotes],
    6,
  );

  return {
    mode: "story",
    title: "Story Audit",
    summary,
    executiveRewrite: buildExecutiveStoryNarrative(draftSuggestion.draft),
    debriefReadout: review.debriefReadout,
    hardTruths,
    repairPlan,
    nextMoves: clampList(
      [...pressure.upgradeMoves, ...draftSuggestion.polishNotes],
      5,
    ),
    suggestedPrompts: [
      "Pressure-test this story harder.",
      "Which question should I use this story for?",
      "Rewrite this story to sound more senior.",
    ],
    recommendedQuestion: recommendedQuestion
      ? toQuestionReference(recommendedQuestion)
      : null,
    recommendedStories: getRecommendedStories(context),
  };
}

function buildPressureReply(
  context: ExecutiveCoachContext,
): ExecutiveCoachReply {
  const question =
    context.currentQuestion ??
    pickRecommendedQuestion(context, { preferManagerOnly: true });
  const summary = question
    ? "I am assuming the interviewer is not trying to help you. They are looking for the weak seam in your logic, proof, or ownership."
    : "I am assuming the interviewer is not trying to help you. They are looking for the weak seam in your logic, proof, or ownership.";
  const hardTruths = clampList(
    [
      "If you cannot name the tradeoff, the interviewer will assume you got lucky.",
      "If you cannot prove the delta, the interviewer will discount the story.",
      question?.managerOnly
        ? "Manager-only questions punish vague people leadership language especially hard."
        : "",
    ],
    4,
  );
  const repairPlan = clampList(
    [
      "Answer with stake, action sequence, metric, and lesson. Skip the warm-up.",
      question?.followUps[0] ?? "",
      question?.followUps[1] ?? "",
      "Expect a second follow-up on what became repeatable after your intervention.",
    ],
    5,
  );

  return {
    mode: "pressure",
    title: "Bar Raiser Pressure",
    summary,
    executiveRewrite: null,
    debriefReadout: buildCoachDebriefReadout("Pressure", summary, hardTruths),
    hardTruths,
    repairPlan,
    nextMoves: repairPlan,
    suggestedPrompts: [
      "Give me harder follow-up questions.",
      "What would an L7 bar raiser attack in my answer?",
      "How do I make this answer survive pushback?",
    ],
    recommendedQuestion: question ? toQuestionReference(question) : null,
    recommendedStories: getRecommendedStories(context),
  };
}

function buildWeaknessReply(
  context: ExecutiveCoachContext,
): ExecutiveCoachReply {
  const weakestCompetencyId = getWeakestCompetency(context.progress);
  const weakestCompetency = weakestCompetencyId
    ? getCompetencyById(weakestCompetencyId)
    : null;
  const coverage = getAmazonCoverageSummary(context.progress);
  const averageScore = getAverageBarRaiserScore(context.progress);
  const recommendedQuestion = pickRecommendedQuestion(context, {
    preferManagerOnly: true,
    preferredCompetency: weakestCompetencyId,
  });
  const hardTruths = clampList(
    [
      weakestCompetency
        ? `${weakestCompetency.title} is underdeveloped enough that it could drag a strong overall loop.`
        : "",
      averageScore !== null
        ? `Your recent harsh-review average is ${averageScore}%. Anything below the mid-70s is still too fragile.`
        : "You do not have enough harsh-review reps logged yet to prove consistency.",
      coverage.categoryCoverageCount < 10
        ? `Category coverage is still thin at ${coverage.categoryCoverageCount}/${coverage.categoryCoverageTotal}.`
        : "",
      coverage.managerRepCount < 3
        ? "Manager-level pressure is still too lightly trained."
        : "",
    ],
    5,
  );
  const repairPlan = clampList(
    [
      weakestCompetency
        ? `Build one saved story and one bar-raiser rep in ${weakestCompetency.title.toLowerCase()} this session.`
        : "",
      "Do not chase novelty. Repeat the same weak prompt until the answer gets visibly tighter.",
      "Use numbers, scope, and lesson learned in every answer until that becomes automatic.",
    ],
    4,
  );
  const summary = weakestCompetency
    ? `Your weakest interview signal is ${weakestCompetency.title.toLowerCase()}. That is the lane I would attack first if I were interviewing you.`
    : "Your current profile needs sharper proof density and more deliberate reps before it looks truly senior.";

  return {
    mode: "weakness",
    title: "Weakness Diagnosis",
    summary,
    executiveRewrite: null,
    debriefReadout: buildCoachDebriefReadout("Weakness", summary, hardTruths),
    hardTruths,
    repairPlan,
    nextMoves: repairPlan,
    suggestedPrompts: [
      "Give me the best fix for that weakness.",
      "Ask me a drill question that targets that gap.",
      "Which saved story should I improve first?",
    ],
    recommendedQuestion: recommendedQuestion
      ? toQuestionReference(recommendedQuestion)
      : null,
    recommendedStories: getRecommendedStories(context),
  };
}

function buildDrillReply(context: ExecutiveCoachContext): ExecutiveCoachReply {
  const preferredCompetency =
    context.selectedCompetency === "all" ? null : context.selectedCompetency;
  const recommendedQuestion =
    pickRecommendedQuestion(context, {
      preferManagerOnly: /hard|manager|bar raiser/.test(
        context.message.toLowerCase(),
      ),
      preferredCompetency,
    }) ?? context.currentQuestion;
  const hardTruths = clampList(
    [
      recommendedQuestion
        ? `This question lives in ${recommendedQuestion.sourceCategoryLabel}, so a weak answer here leaks into multiple adjacent prompts.`
        : "",
      recommendedQuestion?.managerOnly
        ? "This is a manager-only prompt, so the interviewer will expect bigger judgment and stronger people leadership proof."
        : "",
    ],
    4,
  );
  const repairPlan = clampList(
    [
      "Take one live rep before you let yourself read the suggested follow-ups.",
      "After the first take, cut 20% of the setup and add one measurable outcome.",
      recommendedQuestion?.followUps[0] ?? "",
    ],
    4,
  );
  const summary = recommendedQuestion
    ? "Use this prompt as a real rep. I picked it because it is under-trained relative to your current focus."
    : "Use a real prompt and do not switch categories until your answer is cleaner on the replay.";

  return {
    mode: "drill",
    title: "Executive Drill",
    summary,
    executiveRewrite: null,
    debriefReadout: buildCoachDebriefReadout("Drill", summary, hardTruths),
    hardTruths,
    repairPlan,
    nextMoves: repairPlan,
    suggestedPrompts: [
      "Give me another question in this lane.",
      "How should I structure the answer to this prompt?",
      "What follow-up questions should I expect?",
    ],
    recommendedQuestion: recommendedQuestion
      ? toQuestionReference(recommendedQuestion)
      : null,
    recommendedStories: getRecommendedStories(context),
  };
}

export function buildExecutiveCoachReply(
  context: ExecutiveCoachContext,
): ExecutiveCoachReply {
  const normalizedMessage = context.message.trim();
  const effectiveCategory =
    context.selectedCategory ??
    (context.currentQuestion
      ? getQuestionCategoryById(context.currentQuestion.sourceCategoryId)
      : null);
  const nextContext = {
    ...context,
    selectedCategory: effectiveCategory,
    message: normalizedMessage,
  };

  switch (inferMode(normalizedMessage)) {
    case "opener":
      return buildOpenerReply(nextContext);
    case "story":
      return buildStoryReply(nextContext);
    case "pressure":
      return buildPressureReply(nextContext);
    case "weakness":
      return buildWeaknessReply(nextContext);
    case "drill":
      return buildDrillReply(nextContext);
    default:
      return buildBriefingReply(nextContext);
  }
}
