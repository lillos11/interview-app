import { describe, expect, it } from "vitest";

import {
  AMAZON_PREP_DECK_PANEL_PLAN,
  AMAZON_PREP_DECK_PITCH_TEMPLATE,
  AMAZON_PREP_DECK_ROUTER,
  AMAZON_PREP_DECK_STORIES,
  AMAZON_PREP_DECK_QUESTIONS_TO_ASK,
  buildPrepDeckStoryDraft,
  getPrepDeckRouteByCategory,
  getPrepDeckStoriesForCategory,
  getPrepDeckStoriesForFamily,
  getPrepDeckStoryById,
} from "../lib/amazonPrepDeck";

describe("amazon prep deck", () => {
  it("preserves the imported prep-deck structure", () => {
    expect(AMAZON_PREP_DECK_STORIES).toHaveLength(10);
    expect(AMAZON_PREP_DECK_ROUTER).toHaveLength(16);
    expect(AMAZON_PREP_DECK_PANEL_PLAN).toHaveLength(12);
    expect(AMAZON_PREP_DECK_QUESTIONS_TO_ASK).toHaveLength(2);
    expect(AMAZON_PREP_DECK_PITCH_TEMPLATE.fullIntro).toContain(
      "Carlos McCain",
    );
  });

  it("maps selected categories to deck stories and routes", () => {
    const thinkBigRoute = getPrepDeckRouteByCategory("think-big");
    const thinkBigStories = getPrepDeckStoriesForCategory("think-big");
    const lpStories = getPrepDeckStoriesForFamily("lp");
    const functionalStories = getPrepDeckStoriesForFamily("functional");

    expect(thinkBigRoute?.primaryStoryIds).toEqual(["story-7", "story-1"]);
    expect(thinkBigStories.map((story) => story.id)).toEqual(
      expect.arrayContaining(["story-1", "story-7", "story-10"]),
    );
    expect(lpStories.length).toBeGreaterThanOrEqual(thinkBigStories.length);
    expect(functionalStories.length).toBeGreaterThan(0);
  });

  it("builds a reusable STAR draft from an imported deck story", () => {
    const story = getPrepDeckStoryById("story-5");

    expect(story).not.toBeNull();
    expect(story?.keyNumbers).toContain("Scanned bucket 10K to under 7K");

    const draft = buildPrepDeckStoryDraft(story!);

    expect(draft.title).toBe("The Floor Rescue");
    expect(draft.competency).toBe("ownership");
    expect(draft.categoryTags).toEqual(
      expect.arrayContaining(["ownership", "bias-for-action"]),
    );
    expect(draft.action).toContain("I called RME directly");
  });
});
