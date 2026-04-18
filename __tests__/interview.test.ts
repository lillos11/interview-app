import { describe, expect, it } from "vitest";

import {
  buildBarRaiserAmplification,
  buildEliteStoryDraft,
  buildEliteStoryPolish,
  buildCurveballPack,
  buildStoryPressureTest,
  coerceInterviewProgress,
  createInitialInterviewProgress,
  deleteStarStory,
  GAME_DAY_CHECKLIST,
  getAmazonCoverageSummary,
  getPromptReadiness,
  getRelatedQuestionPrompts,
  getStoryCategoryCoverage,
  getTopPassBlockers,
  getOverallReadiness,
  INTERVIEW_QUESTION_CATEGORIES,
  INTERVIEW_QUESTIONS,
  INTERVIEW_RESCUE_SCRIPTS,
  pickDrillQuestions,
  recordBarRaiserReview,
  recordDrillResult,
  reviewInterviewAnswer,
  reviewStarStory,
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

  it("caps story scores at 100 and returns a detailed review", () => {
    const story = {
      competency: "leadership" as const,
      categoryTags: ["deliver-results", "ownership"],
      title: "Saved a failing peak shift",
      situation:
        "Peak volume hit all at once and the team was at risk of missing customer promise within the hour.",
      task:
        "I needed to recover the flow without creating a safety issue or starving the rest of the building.",
      action:
        "First, I checked the real bottleneck instead of reacting to the loudest symptom. Then I moved labor, escalated the equipment issue, and reset the monitoring cadence so we could stabilize the floor before the backlog crossed the shutdown threshold.",
      result:
        "We recovered 3,000 units, kept the backlog under the shutdown point, and documented a repeatable watch-point playbook for future peak shifts.",
      reflection:
        "Since then, I act earlier on watch points and build the escalation path into shift handoff so the next leader is not starting cold.",
    };

    const review = reviewStarStory(story);

    expect(scoreStarStory(story)).toBeLessThanOrEqual(100);
    expect(review.score).toBeLessThanOrEqual(100);
    expect(review.dimensions).toHaveLength(5);
    expect(review.verdict).not.toBe("not_ready");
  });

  it("builds an elite story draft from raw notes without inventing proof", () => {
    const suggestion = buildEliteStoryDraft({
      competency: "ownership",
      categoryTags: ["ownership", "deliver-results"],
      titleHint: "Prime window recovery",
      context:
        "Volume hit at once during Prime week and the floor was close to missing truck windows.",
      stakes:
        "I needed to recover the at-risk work without creating a new bottleneck.",
      actions:
        "I re-read staffing, moved support from a safe area, and set a tighter recovery cadence with the leads.",
      result: "",
      lesson: "Since then I front-load the pacing check at the start of the shift.",
    });

    expect(suggestion.draft.title).toBe("Prime window recovery");
    expect(suggestion.draft.task).toContain("I needed to recover");
    expect(suggestion.draft.result).toContain("[insert metric or delta]");
    expect(suggestion.missingPieces.length).toBeGreaterThan(0);
  });

  it("builds an elite polish pass that tightens an existing story", () => {
    const original = {
      competency: "leadership" as const,
      categoryTags: ["deliver-results", "ownership"],
      title: "Peak recovery",
      situation:
        "Peak volume hit all at once and the department risked missing customer promise across the shift. The setup had gotten noisy and people were reacting to symptoms instead of the actual bottleneck.",
      task:
        "Reset the flow and keep output moving without creating a safety issue or starving the rest of the building.",
      action:
        "I checked the real bottleneck, moved labor, escalated the equipment issue, reset the cadence with the leads, and stayed close to the floor until the watch points stabilized.",
      result:
        "We recovered 3,000 units and kept the backlog under the shutdown point.",
      reflection:
        "Since then I act earlier on watch points and build the escalation path into shift handoff.",
    };

    const originalReview = reviewStarStory(original);
    const polished = buildEliteStoryPolish(original);

    expect(polished.draft.title).toBe(original.title);
    expect(polished.draft.result).toContain("3,000 units");
    expect(polished.headline.length).toBeGreaterThan(20);
    expect(polished.adjustments.length).toBeGreaterThan(0);
    expect(polished.polishedReview.score).toBeGreaterThanOrEqual(
      originalReview.score,
    );
  });

  it("amplifies stories like a bar raiser without leaving the source bank", () => {
    const original = {
      competency: "leadership" as const,
      categoryTags: ["deliver-results"],
      title: "Shift save with live labor rebalance",
      situation:
        "Mid-shift, outbound volume spiked and one critical conveyor started failing, which put the customer promise for the night at risk.",
      task:
        "I had to recover the flow fast without creating a safety issue or starving the rest of the building.",
      action:
        "Checked the real bottleneck, moved labor, escalated the equipment issue, reset the cadence with the leads, and stayed close to the floor until the watch points stabilized.",
      result:
        "We recovered 3,000 units and kept the backlog under the shutdown point.",
      reflection:
        "Since then I act earlier on watch points and build the escalation path into shift handoff.",
    };

    const originalReview = reviewStarStory(original);
    const amplified = buildBarRaiserAmplification(original);
    const originalActionScore =
      originalReview.dimensions.find((dimension) => dimension.id === "action")
        ?.score ?? 0;
    const amplifiedActionScore =
      amplified.amplifiedReview.dimensions.find(
        (dimension) => dimension.id === "action",
      )?.score ?? 0;

    expect(amplified.draft.result).toContain("3,000 units");
    expect(amplified.headline.length).toBeGreaterThan(20);
    expect(amplified.barRaiserReadout.toLowerCase()).toContain("bar raiser");
    expect(amplified.amplifiedReview.score).toBeGreaterThanOrEqual(
      originalReview.score,
    );
    expect(amplified.dimensionGoals).toHaveLength(5);
    expect(
      amplified.dimensionGoals.some((dimension) => dimension.targetScore >= 90),
    ).toBe(true);
    expect(amplifiedActionScore).toBeGreaterThanOrEqual(originalActionScore);
    expect(Array.isArray(amplified.proofDemands)).toBe(true);
    expect(amplified.sectionUpgrades.length).toBeGreaterThan(0);
    expect(amplified.sourceBankPrompts.length).toBeGreaterThan(0);
    expect(
      amplified.sourceBankPrompts.every((prompt) =>
        INTERVIEW_QUESTIONS.some((question) => question.prompt === prompt),
      ),
    ).toBe(true);
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
    expect(review.debriefReadout.length).toBeGreaterThan(20);
    expect(review.repairPlan.length).toBeGreaterThan(0);
  });

  it("gets stricter under the bar-raiser lens", () => {
    const question =
      INTERVIEW_QUESTIONS.find(
        (entry) => entry.sourceCategoryId === "deliver-results",
      ) ?? INTERVIEW_QUESTIONS[0];
    const answer = [
      "I had to recover a high-risk operational miss before customer promise broke.",
      "I moved support and kept the work flowing.",
      "We got through the shift and performance improved.",
    ].join(" ");

    const opsReview = reviewInterviewAnswer(question, answer, "l6_ops");
    const barRaiserReview = reviewInterviewAnswer(
      question,
      answer,
      "l7_bar_raiser",
    );

    expect(barRaiserReview.score).toBeLessThanOrEqual(opsReview.score);
    expect(barRaiserReview.interviewerLabel).toBe("L7 Bar Raiser");
    expect(barRaiserReview.interviewerExpectations.length).toBeGreaterThan(0);
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
    expect(review.brutalTruth.toLowerCase()).toContain("would not move you forward");
    expect(review.repairPlan.length).toBeGreaterThan(1);
    expect(
      review.misses.some((item) => item.toLowerCase().includes("ownership")),
    ).toBe(true);
    expect(
      review.misses.some((item) => item.toLowerCase().includes("proof")),
    ).toBe(true);
  });

  it("keeps answer follow-ups tied to the imported source bank", () => {
    const question =
      INTERVIEW_QUESTIONS.find((entry) => entry.followUps.length > 0) ??
      INTERVIEW_QUESTIONS[0];
    const review = reviewInterviewAnswer(
      question,
      "We had a problem, the team worked on it, and we got through it without much structure or proof.",
    );

    expect(review.followUps).toEqual(question.followUps);
  });

  it("pressure-tests stories and surfaces upgrade paths", () => {
    const pressureTest = buildStoryPressureTest({
      competency: "technical_depth",
      categoryTags: ["dive-deep"],
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
    expect(
      pressureTest.pressureQuestions.every((prompt) =>
        INTERVIEW_QUESTIONS.some((question) => question.prompt === prompt),
      ),
    ).toBe(true);
  });

  it("returns detailed story debriefs and repair plans", () => {
    const review = reviewStarStory({
      competency: "leadership",
      categoryTags: ["deliver-results"],
      title: "Underpowered story",
      situation: "Things were hard.",
      task: "I had to help.",
      action: "I worked with the team and handled tasks.",
      result: "It got better.",
      reflection: "",
    });

    expect(review.brutalTruth.length).toBeGreaterThan(20);
    expect(review.debriefReadout.toLowerCase()).toContain("debrief");
    expect(review.repairPlan.length).toBeGreaterThan(1);
  });

  it("scores prompt readiness from saved stories and reps", () => {
    const question = INTERVIEW_QUESTIONS.find(
      (entry) => entry.sourceCategoryId === "deliver-results",
    )!;
    const baseline = createInitialInterviewProgress(
      new Date("2026-03-04T12:00:00.000Z"),
    );

    expect(getPromptReadiness(baseline, question).label).toBe("uncovered");

    const withStory = saveStarStory(baseline, {
      competency: "ownership",
      categoryTags: ["deliver-results"],
      title: "Recovery story",
      situation: "A key area was underperforming and service risk was rising.",
      task: "I needed to recover output without creating a new failure elsewhere.",
      action:
        "I reset staffing, changed the inspection rhythm, and coached leads on the same recovery playbook.",
      result:
        "Throughput recovered from 80 percent to 110 percent of plan and defects dropped 35 percent.",
      reflection:
        "I turned the intervention into standard work so the same miss would surface earlier.",
    });

    const partial = getPromptReadiness(withStory, question);
    expect(partial.label).toBe("at_risk");

    const withRep = recordDrillResult(
      withStory,
      question,
      "strong",
      new Date("2026-03-05T12:00:00.000Z"),
    );

    const improved = getPromptReadiness(withRep, question);
    expect(improved.label).not.toBe("uncovered");
    expect(improved.score).toBeGreaterThan(partial.score);
  });

  it("builds curveball packs, pass blockers, and rescue scripts", () => {
    const managerQuestion = INTERVIEW_QUESTIONS.find(
      (entry) => entry.managerOnly,
    )!;
    const curveballPack = buildCurveballPack(managerQuestion);
    const blockers = getTopPassBlockers(
      createInitialInterviewProgress(),
      "lp",
      "deliver-results",
    );

    expect(curveballPack.prompts.length).toBeGreaterThan(2);
    expect(curveballPack.trap.length).toBeGreaterThan(10);
    expect(blockers.some((blocker) => blocker.tab === "star_lab")).toBe(true);
    expect(blockers.some((blocker) => blocker.tab === "bar_raiser")).toBe(
      true,
    );
    expect(INTERVIEW_RESCUE_SCRIPTS.length).toBeGreaterThan(4);
  });

  it("finds adjacent prompts only from the imported question bank", () => {
    const question = INTERVIEW_QUESTIONS.find(
      (entry) => entry.sourceCategoryId === "deliver-results",
    )!;
    const related = getRelatedQuestionPrompts(question, 3);

    expect(related.length).toBeGreaterThan(0);
    expect(related).not.toContain(question.prompt);
    expect(
      related.every((prompt) =>
        INTERVIEW_QUESTIONS.some((entry) => entry.prompt === prompt),
      ),
    ).toBe(true);
  });
});
