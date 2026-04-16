import { describe, expect, it } from 'vitest';

import {
  applyStudyEvent,
  countMasteredCards,
  createInitialProfile,
  createQuizRound,
  reviewScheduledCard,
  speechMatchScore
} from '../lib/languageApp';

describe('languageApp', () => {
  it('schedules a card into the future after a good review', () => {
    const now = new Date('2026-02-11T12:00:00.000Z');
    const profile = createInitialProfile(now);
    const spanishCard = profile.languages.spanish.deck[0];

    const reviewed = reviewScheduledCard(spanishCard, 'good', now);

    expect(reviewed.repetitions).toBe(1);
    expect(reviewed.intervalDays).toBe(1);
    expect(new Date(reviewed.dueAt).getTime()).toBeGreaterThan(now.getTime());
  });

  it('resets repetitions and tracks a lapse on again', () => {
    const now = new Date('2026-02-11T12:00:00.000Z');
    const profile = createInitialProfile(now);
    const card = { ...profile.languages.spanish.deck[0], repetitions: 3, intervalDays: 7, lapses: 0 };

    const reviewed = reviewScheduledCard(card, 'again', now);

    expect(reviewed.repetitions).toBe(0);
    expect(reviewed.intervalDays).toBe(1);
    expect(reviewed.lapses).toBe(1);
  });

  it('increments streak on consecutive days through study events', () => {
    const dayOne = new Date('2026-02-10T12:00:00.000Z');
    const dayTwo = new Date('2026-02-11T12:00:00.000Z');
    const profile = createInitialProfile(dayOne);
    const progress = profile.languages.spanish;

    const afterDayOne = applyStudyEvent(progress, { minutes: 10, cardsReviewed: 4 }, dayOne);
    const afterDayTwo = applyStudyEvent(afterDayOne, { minutes: 10, cardsReviewed: 4 }, dayTwo);

    expect(afterDayOne.streak).toBe(1);
    expect(afterDayTwo.streak).toBe(2);
  });

  it('counts mastered cards from repetitions or interval', () => {
    const profile = createInitialProfile(new Date('2026-02-11T12:00:00.000Z'));
    const progress = profile.languages.spanish;

    progress.deck[0] = { ...progress.deck[0], repetitions: 4, intervalDays: 10 };
    progress.deck[1] = { ...progress.deck[1], repetitions: 2, intervalDays: 20 };

    expect(countMasteredCards(progress)).toBe(2);
  });

  it('returns high speech scores for near matches and low scores for unrelated speech', () => {
    expect(speechMatchScore('hola mucho gusto', 'hola mucho gusto')).toBe(100);
    expect(speechMatchScore('hola mucho gusto', 'hola gusto')).toBeGreaterThan(55);
    expect(speechMatchScore('hola mucho gusto', 'train station where now')).toBeLessThan(30);
  });

  it('builds a quiz round with four unique options including the answer', () => {
    const round = createQuizRound('spanish', () => 0.2);

    expect(round.options).toHaveLength(4);
    expect(new Set(round.options).size).toBe(4);
    expect(round.options).toContain(round.correctOption);
  });
});
