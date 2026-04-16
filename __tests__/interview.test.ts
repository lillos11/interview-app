import { describe, expect, it } from "vitest";

import {
  buildStoryPressureTest,
  coerceInterviewProgress,
  createInitialInterviewProgress,
  deleteStarStory,
  GAME_DAY_CHECKLIST,
  getAmazonCoverageSummary,
  getStoryCategoryCoverage,
  getOverallReadiness,
  INTERVIEW_QUESTION_CATEGORIES,
  INTERVIEW_QUESTIONS,
  pickDrillQuestions,
  recordBarRaiserReview,
  recordDrillResult,
  reviewInterviewAnswer,
  saveStarStory,
  scoreStarStory,
  toggleChecklistItem,
  updatePitchPack,
} from "../lib/interview";

describe("interview prep helpers", () => {
  it("preserves the full Amazon source bank and category taxonomy", () => {
    const byCategory = INTERVIEW_QUESTIONS.reduce(
      (result, question) => {
        result[question.sourceCategoryId] =
          (result[question.sourceCategoryId] ?? 0) + 1;
        return result;
      },
      {} as Record<string, number>,
    );

    expect(INTERVIEW_QUESTION_CATEGORIES).toHaveLength(28);
    expect(INTERVIEW_QUESTIONS).toHaveLength(243);
    expect(
      INTERVIEW_QUESTIONS.filter((question) => question.sourceFamily === "lp"),
    ).toHaveLength(139);
    expect(
      INTERVIEW_QUESTIONS.filter(
        (question) => question.sourceFamily === "functional",
      ),
    ).toHaveLength(104);
    expect(
      INTERVIEW_QUESTIONS.filter((question) => question.managerOnly),
    ).toHaveLength(38);
    expect(byCategory).toEqual({
      adaptability: 8,
      "are-right-a-lot": 8,
      "bias-for-action": 9,
      collaboration: 9,
      conscientiousness: 9,
      "customer-obsession": 10,
      "customer-orientation": 5,
      "deal-with-ambiguity": 10,
      "deliver-results": 8,
      "dive-deep": 8,
      "earn-trust": 9,
      frugality: 8,
      "have-backbone-disagree-and-commit": 9,
      "hire-and-develop-the-best": 11,
      influencing: 8,
      "insist-on-the-highest-standards": 8,
      "interpretation-and-analysis": 9,
      "invent-and-simplify": 8,
      "judgment-and-decision-making": 9,
      "learn-and-be-curious": 8,
      "learning-orientation": 9,
      ownership: 6,
      "plan-and-prioritize": 8,
      "strive-to-be-earth-s-best-employer": 11,
      "success-and-scale-bring-broad-responsibility": 9,
      "team-and-people-management": 12,
      "think-big": 9,
      "vision-and-strategy": 8,
    });

    const pushbackPrompt = INTERVIEW_QUESTIONS.find(
      (question) => question.id === "lp-customer-obsession-07",
    );
    expect(pushbackPrompt?.prompt).toBe(
      "Sometimes customers make unreasonable requests. Tell me about a time when you have had to push back or say no to a customer request.",
    );
    expect(pushbackPrompt?.followUps).toEqual([
      "What did you say or do in response to that request?",
    ]);
  });

  it("picks unique drill questions from the active category pool", () => {
    const categoryPool = INTERVIEW_QUESTIONS.filter(
      (question) => question.sourceCategoryId === "dive-deep",
    );
    const selected = pickDrillQuestions(
      categoryPool,
      4,
      ["technical_depth"],
      () => 0.42,
    );

    expect(selected).toHaveLength(4);
    expect(
      selected.every((question) => question.sourceCategoryId === "dive-deep"),
    ).toBe(true);
    expect(
      selected.every((question) => question.competency === "technical_depth"),
    ).toBe(true);
    expect(new Set(selected.map((question) => question.id)).size).toBe(
      selected.length,
    );
  });

  it("records drill ratings and updates streak across days", () => {
    const question = INTERVIEW_QUESTIONS[0];
    const dayOne = new Date("2026-03-01T12:00:00.000Z");
    const dayTwo = new Date("2026-03-02T12:00:00.000Z");

    const initial = createInitialInterviewProgress(dayOne);
    const afterOne = recordDrillResult(initial, question, "solid", dayOne);
    const afterTwo = recordDrillResult(afterOne, question, "strong", dayTwo);

    expect(afterOne.streak).toBe(1);
    expect(afterTwo.streak).toBe(2);
    expect(afterTwo.questionStats[question.id]).toEqual({
      attempted: 2,
      solid: 1,
      strong: 1,
    });
    expect(afterTwo.competencyStats[question.competency]).toEqual({
      attempted: 2,
      solid: 1,
      strong: 1,
    });
    expect(afterTwo.drillHistory).toHaveLength(2);
    expect(afterTwo.drillHistory[0]).toMatchObject({
      questionId: question.id,
      sourceCategoryId: question.sourceCategoryId,
      sourceCategoryLabel: question.sourceCategoryLabel,
      managerOnly: question.managerOnly,
    });
  });

  it("stores harsh bar raiser reviews with question metadata", () => {
    const now = new Date("2026-03-03T12:00:00.000Z");
    const question =
      INTERVIEW_QUESTIONS.find(
        (entry) => entry.sourceCategoryId === "think-big",
      ) ?? INTERVIEW_QUESTIONS[0];
    const review = reviewInterviewAnswer(
      question,
      [
        "I had to decide whether to narrow scope before a high-risk launch.",
        "I rebuilt the review cadence, cut lower-value work, and aligned engineering and support on the fallback.",
        "We shipped on time, reduced critical defects by 42%, and I kept churn flat that quarter.",
      ].join(" "),
    );

    const progress = recordBarRaiserReview(
      createInitialInterviewProgress(now),
      question,
      review,
      96,
      now,
    );

    expect(progress.barRaiserHistory).toHaveLength(1);
    expect(progress.barRaiserHistory[0]).toMatchObject({
      questionId: question.id,
      score: review.score,
      verdict: review.verdict,
      durationSeconds: 96,
      sourceCategoryId: question.sourceCategoryId,
    });
    expect(progress.drillHistory).toHaveLength(1);
  });

  it("saves, updates, and deletes STAR stories", () => {
    const now = new Date("2026-03-03T12:00:00.000Z");
    const initial = createInitialInterviewProgress(now);

    const saved = saveStarStory(
      initial,
      {
        competency: "leadership",
        categoryTags: ["think-big", "vision-and-strategy"],
        title: "Steering a risky launch",
        situation:
          "The release date was fixed and the team had major defects late in the cycle.",
        task: "I needed to protect the launch without hiding the risk.",
        action:
          "I created a red-yellow-green review, narrowed scope, and aligned engineering and support on the fallback plan.",
        result:
          "We shipped on time, reduced open critical defects by 42%, and avoided customer-facing downtime.",
        reflection: "Now I escalate risk with tighter thresholds much earlier.",
      },
      now,
      () => "story-fixed",
    );

    const updated = saveStarStory(
      saved,
      {
        id: "story-fixed",
        competency: "leadership",
        categoryTags: ["think-big", "vision-and-strategy"],
        title: "Steering a risky launch",
        situation:
          "The release date was fixed and the team had major defects late in the cycle.",
        task: "I needed to protect the launch without hiding the risk.",
        action:
          "I created a red-yellow-green review, narrowed scope, set daily exec updates, and aligned support on the fallback plan.",
        result:
          "We shipped on time, reduced open critical defects by 42%, and kept churn flat that quarter.",
        reflection: "Now I escalate risk with tighter thresholds much earlier.",
      },
      now,
    );

    const removed = deleteStarStory(updated, "story-fixed", now);

    expect(saved.stories).toHaveLength(1);
    expect(updated.stories).toHaveLength(1);
    expect(updated.stories[0]?.action).toContain("daily exec updates");
    expect(updated.stories[0]?.categoryTags).toEqual([
      "think-big",
      "vision-and-strategy",
    ]);
    expect(removed.stories).toEqual([]);
  });

  it("sanitizes persisted progress objects during coercion", () => {
    const coerced = coerceInterviewProgress({
      streak: -4,
      lastPracticeDate: "bad-date",
      competencyStats: {
        leadership: { attempted: 3, solid: 9, strong: 9 },
      },
      questionStats: {
        a: { attempted: 2, solid: 3, strong: 7 },
      },
      checklistDoneIds: [GAME_DAY_CHECKLIST[0].id, "nope"],
      stories: [
        {
          competency: "ownership",
          title: "Recovered a slipping project",
          situation: "A launch slipped.",
          task: "I had to reset the plan.",
          action: "I re-scoped the work and rebuilt the timeline.",
          result: "We recovered and hit the revised date.",
          reflection: "I now expose risk earlier.",
        },
      ],
      pitch: {
        present: "I lead high-leverage launches.",
        proof: "I have shipped across product and operations.",
        future: "I want larger scope.",
        whyHere: "The company is at an inflection point.",
      },
      barRaiserHistory: [
        {
          date: "2026-03-03T12:00:00.000Z",
          questionId: "think-big-missing",
          competency: "leadership",
          rating: "strong",
          score: 88,
          summary: "Should be dropped because the question is unknown.",
          wordCount: 180,
          metricsCount: 2,
          fillerCount: 0,
        },
      ],
    });

    expect(coerced).not.toBeNull();
    expect(coerced?.streak).toBe(0);
    expect(coerced?.lastPracticeDate).toBeNull();
    expect(coerced?.competencyStats.leadership).toEqual({
      attempted: 3,
      solid: 0,
      strong: 3,
    });
    expect(coerced?.questionStats.a).toEqual({
      attempted: 2,
      solid: 0,
      strong: 2,
    });
    expect(coerced?.checklistDoneIds).toEqual([GAME_DAY_CHECKLIST[0].id]);
    expect(coerced?.stories).toHaveLength(1);
    expect(coerced?.stories[0]?.categoryTags).toEqual([]);
    expect(coerced?.barRaiserHistory).toEqual([]);
  });

  it("scores stronger prep state higher", () => {
    const now = new Date("2026-03-03T12:00:00.000Z");
    let progress = createInitialInterviewProgress(now);

    progress = updatePitchPack(
      progress,
      {
        present: "I lead product and operations systems.",
        proof: "I have led launches, reduced defects, and improved retention.",
        future: "I want to own more strategic scope.",
        whyHere: "This team has the right customer and scale challenge.",
      },
      now,
    );
    progress = saveStarStory(
      progress,
      {
        competency: "leadership",
        categoryTags: ["ownership", "deliver-results", "think-big"],
        title: "Raised launch quality",
        situation: "The launch process was unstable.",
        task: "I needed to improve reliability quickly.",
        action:
          "I rebuilt the review process, made ownership explicit, and tracked defects daily.",
        result: "Critical defects fell 42% and launch confidence improved.",
        reflection:
          "I now use the same operating cadence on every high-risk release.",
      },
      now,
      () => "story-1",
    );
    progress = toggleChecklistItem(
      progress,
      GAME_DAY_CHECKLIST[0].id,
      true,
      now,
    );

    const question =
      INTERVIEW_QUESTIONS.find((entry) => entry.competency === "leadership") ??
      INTERVIEW_QUESTIONS[0];
    progress = recordDrillResult(progress, question, "strong", now);

    expect(scoreStarStory(progress.stories[0])).toBeGreaterThanOrEqual(70);
    expect(getOverallReadiness(progress)).toBeGreaterThan(40);
    expect(
      getAmazonCoverageSummary(progress).categoryCoverageCount,
    ).toBeGreaterThanOrEqual(3);
  });

  it("tracks story category coverage across multiple Amazon tags", () => {
    const now = new Date("2026-03-03T12:00:00.000Z");
    const progress = saveStarStory(
      createInitialInterviewProgress(now),
      {
        competency: "leadership",
        categoryTags: ["think-big", "vision-and-strategy", "earn-trust"],
        title: "Set the org direction",
        situation: "The team lacked a clear roadmap.",
        task: "I needed to align multiple groups on a direction.",
        action:
          "I built the narrative, aligned leaders, and reset the roadmap around a shared operating plan.",
        result: "We moved faster and reduced escalations.",
        reflection: "I now make the adoption plan part of the strategy itself.",
      },
      now,
      () => "story-tags",
    );

    expect(getStoryCategoryCoverage(progress)).toMatchObject({
      "think-big": 1,
      "vision-and-strategy": 1,
      "earn-trust": 1,
    });
  });

  it("grades a strong answer with a hire-level signal", () => {
    const question =
      INTERVIEW_QUESTIONS.find(
        (entry) => entry.sourceCategoryId === "think-big",
      ) ?? INTERVIEW_QUESTIONS[0];
    const review = reviewInterviewAnswer(
      question,
      [
        "I had to decide whether to ship a launch on the original date even though the defect trend was getting worse.",
        "First, I rebuilt the review around a red-yellow-green threshold, then I cut lower-value scope and aligned engineering and support on a fallback plan.",
        "I chose that path because waiting for perfect certainty would have created more customer and revenue risk than narrowing scope.",
        "We shipped on time, reduced open critical defects by 42%, and I now use the same operating cadence on every high-risk release.",
      ].join(" "),
    );

    expect(review.score).toBeGreaterThanOrEqual(70);
    expect(review.rating).not.toBe("needs_work");
    expect(review.metricsCount).toBeGreaterThan(0);
    expect(review.strengths.length).toBeGreaterThan(0);
  });

  it("flags weak answers that lack proof and ownership", () => {
    const question =
      INTERVIEW_QUESTIONS.find(
        (entry) => entry.sourceCategoryId === "ownership",
      ) ?? INTERVIEW_QUESTIONS[0];
    const review = reviewInterviewAnswer(
      question,
      "We had a project that was hard, and basically there were issues. We worked on it and kind of got it done in the end.",
    );

    expect(review.score).toBeLessThan(68);
    expect(review.rating).toBe("needs_work");
    expect(review.metricsCount).toBe(0);
    expect(
      review.misses.some((item) => item.toLowerCase().includes("ownership")),
    ).toBe(true);
    expect(
      review.misses.some((item) => item.toLowerCase().includes("proof")),
    ).toBe(true);
  });

  it("pressure-tests stories and surfaces upgrade paths", () => {
    const pressureTest = buildStoryPressureTest({
      competency: "technical_depth",
      title: "Migration story",
      situation: "We needed to move to a new platform quickly.",
      task: "I was responsible for helping.",
      action:
        "I worked with the team on the migration plan and handled tasks as they came up.",
      result: "The migration finished.",
      reflection: "",
    });

    expect(pressureTest.vulnerabilities.length).toBeGreaterThan(0);
    expect(pressureTest.upgradeMoves.length).toBeGreaterThan(0);
    expect(pressureTest.pressureQuestions.length).toBeGreaterThan(0);
  });
});
