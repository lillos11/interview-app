import { describe, expect, it } from 'vitest';

import {
  coercePart107Progress,
  createInitialPart107Progress,
  PART107_QUESTIONS,
  pickPracticeQuestions,
  recordQuestionAnswer,
  recordQuizResult,
  toggleMasteredCard
} from '../lib/part107';

describe('part107 study helpers', () => {
  it('picks unique questions from selected topics', () => {
    const selected = pickPracticeQuestions(PART107_QUESTIONS, 5, ['weather'], () => 0.42);

    expect(selected).toHaveLength(4);
    expect(selected.every((question) => question.topic === 'weather')).toBe(true);
    expect(new Set(selected.map((question) => question.id)).size).toBe(selected.length);
  });

  it('updates topic stats and streak when recording answers on consecutive days', () => {
    const question = PART107_QUESTIONS[0];
    const dayOne = new Date('2026-02-10T12:00:00.000Z');
    const dayTwo = new Date('2026-02-11T12:00:00.000Z');

    const initial = createInitialPart107Progress(dayOne);
    const afterOne = recordQuestionAnswer(initial, question, question.answerIndex, dayOne).progress;
    const afterTwo = recordQuestionAnswer(afterOne, question, 0, dayTwo).progress;

    expect(afterOne.streak).toBe(1);
    expect(afterTwo.streak).toBe(2);
    expect(afterTwo.topicStats[question.topic].attempted).toBe(2);
    expect(afterTwo.topicStats[question.topic].correct).toBe(1);
  });

  it('adds and removes mastered flashcards without duplicates', () => {
    const now = new Date('2026-02-11T12:00:00.000Z');
    const initial = createInitialPart107Progress(now);

    const added = toggleMasteredCard(initial, 'reg-001', true, now);
    const addedAgain = toggleMasteredCard(added, 'reg-001', true, now);
    const removed = toggleMasteredCard(addedAgain, 'reg-001', false, now);

    expect(added.masteredCardIds).toContain('reg-001');
    expect(addedAgain.masteredCardIds).toEqual(['reg-001']);
    expect(removed.masteredCardIds).toEqual([]);
  });

  it('sanitizes persisted progress objects during coercion', () => {
    const coerced = coercePart107Progress({
      streak: -7,
      lastStudyDate: 'invalid',
      masteredCardIds: ['reg-001', 42, 'reg-001'],
      topicStats: {
        regulations: { attempted: 3, correct: 99 }
      },
      questionStats: {
        a: { attempted: 2, correct: 9 },
        b: { attempted: -1, correct: 1 }
      },
      quizHistory: [{ date: 'bad-date', correct: 8, total: 4 }]
    });

    expect(coerced).not.toBeNull();
    expect(coerced?.streak).toBe(0);
    expect(coerced?.lastStudyDate).toBeNull();
    expect(coerced?.masteredCardIds).toEqual(['reg-001']);
    expect(coerced?.topicStats.regulations).toEqual({ attempted: 3, correct: 3 });
    expect(coerced?.questionStats.a).toEqual({ attempted: 2, correct: 2 });
    expect(coerced?.questionStats.b).toEqual({ attempted: 0, correct: 0 });
    expect(coerced?.quizHistory[0]?.total).toBe(4);
    expect(coerced?.quizHistory[0]?.correct).toBe(4);
  });

  it('records quiz history entries', () => {
    const now = new Date('2026-02-11T12:00:00.000Z');
    const initial = createInitialPart107Progress(now);

    const updated = recordQuizResult(initial, 7, 10, now);

    expect(updated.quizHistory).toHaveLength(1);
    expect(updated.quizHistory[0]).toMatchObject({ correct: 7, total: 10 });
    expect(updated.streak).toBe(1);
  });
});
