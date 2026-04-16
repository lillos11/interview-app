import { describe, expect, it } from "vitest";

import { buildExecutiveCoachReply } from "../lib/executiveCoach";
import { AMAZON_PREP_DECK_STORIES } from "../lib/amazonPrepDeck";
import {
  createEmptyStoryDraft,
  createInitialInterviewProgress,
  getQuestionCategoryById,
  INTERVIEW_QUESTIONS,
  saveStarStory,
} from "../lib/interview";

describe("executive coach", () => {
  it("builds an executive opener from the available pitch context", () => {
    const progress = createInitialInterviewProgress();

    const reply = buildExecutiveCoachReply({
      message: "Give me the executive version of tell me about yourself.",
      progress,
      selectedFamily: "lp",
      selectedCategory: getQuestionCategoryById("deliver-results"),
      selectedCompetency: "all",
      storyDraft: createEmptyStoryDraft(),
      currentQuestion: INTERVIEW_QUESTIONS[0],
    });

    expect(reply.mode).toBe("opener");
    expect(reply.executiveRewrite).toContain("I started at Amazon");
    expect(reply.nextMoves.length).toBeGreaterThan(1);
    expect(reply.debriefReadout).toContain("debrief");
    expect(reply.repairPlan.length).toBeGreaterThan(1);
  });

  it("diagnoses weak signals and recommends a real question", () => {
    const progress = createInitialInterviewProgress();

    const reply = buildExecutiveCoachReply({
      message: "What is my weakest interview signal right now?",
      progress,
      selectedFamily: "functional",
      selectedCategory: getQuestionCategoryById("team-and-people-management"),
      selectedCompetency: "all",
      storyDraft: createEmptyStoryDraft(),
      currentQuestion: INTERVIEW_QUESTIONS[0],
    });

    expect(reply.mode).toBe("weakness");
    expect(reply.hardTruths.length).toBeGreaterThan(1);
    expect(reply.debriefReadout).toContain("debrief");
    expect(reply.repairPlan.length).toBeGreaterThan(0);
    expect(reply.recommendedStories.length).toBeGreaterThanOrEqual(
      AMAZON_PREP_DECK_STORIES.length,
    );
    expect(reply.recommendedQuestion).not.toBeNull();
  });

  it("pressure-tests the active story draft and returns a sharper narrative", () => {
    const baseProgress = createInitialInterviewProgress();
    const progress = saveStarStory(baseProgress, {
      competency: "leadership",
      categoryTags: ["deliver-results"],
      title: "Department turnaround",
      situation: "The department was stuck at 80 percent of plan and quality was drifting.",
      task: "I had to reset standards across shifts without losing output.",
      action:
        "I standardized workstation layouts, built first-hour dashboards, coached leads on the same playbook, and audited misses daily.",
      result:
        "Pack rate improved from 80 percent to 110 percent of plan and defects fell 35 percent.",
      reflection:
        "I learned that complacency is expensive, so I turned the fix into standard work.",
    });

    const draft = createEmptyStoryDraft("leadership", ["deliver-results"]);
    draft.title = "Department turnaround";
    draft.situation =
      "The department was stuck at 80 percent of plan and quality was drifting.";
    draft.task =
      "I had to reset standards across shifts without losing output.";
    draft.action =
      "I standardized workstation layouts, built first-hour dashboards, coached leads on the same playbook, and audited misses daily.";
    draft.result =
      "Pack rate improved from 80 percent to 110 percent of plan and defects fell 35 percent.";
    draft.reflection =
      "I learned that complacency is expensive, so I turned the fix into standard work.";

    const reply = buildExecutiveCoachReply({
      message: "Pressure-test my current story like a bar raiser.",
      progress,
      selectedFamily: "lp",
      selectedCategory: getQuestionCategoryById("deliver-results"),
      selectedCompetency: "leadership",
      storyDraft: draft,
      currentQuestion: INTERVIEW_QUESTIONS.find(
        (question) => question.sourceCategoryId === "deliver-results",
      )!,
    });

    expect(reply.mode).toBe("story");
    expect(reply.executiveRewrite).toContain("Pack rate improved");
    expect(reply.hardTruths.length).toBeGreaterThan(0);
    expect(reply.debriefReadout).toContain("Debrief");
    expect(reply.repairPlan.length).toBeGreaterThan(0);
    expect(reply.recommendedStories.length).toBeGreaterThan(0);
  });
});
