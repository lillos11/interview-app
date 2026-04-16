import { describe, expect, it } from 'vitest';

import { getAllTasks, getCoreData, getSymptoms, getWeekEntries, getWorkoutStreak } from '../lib/data';
import { DATABASE_UNAVAILABLE_MESSAGE, isDatabaseConfigured } from '../lib/prisma';

describe('deployment-safe persistence fallbacks', () => {
  it('returns safe defaults when DATABASE_URL is not configured', async () => {
    const originalDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = '';

    try {
      expect(isDatabaseConfigured()).toBe(false);

      const [coreData, entries, tasks, symptoms, streak] = await Promise.all([
        getCoreData(),
        getWeekEntries(),
        getAllTasks(),
        getSymptoms(),
        getWorkoutStreak(3)
      ]);

      expect(coreData.settings.studyTargetMinutes).toBe(300);
      expect(coreData.debtPlan.balance).toBe(2500);
      expect(coreData.buckets.UBER.targetAmount).toBe(200);
      expect(entries).toEqual([]);
      expect(tasks).toEqual([]);
      expect(symptoms).toEqual([]);
      expect(streak).toBe(0);
    } finally {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('exposes a clear deployment message for missing persistence', () => {
    expect(DATABASE_UNAVAILABLE_MESSAGE).toContain('DATABASE_URL');
  });
});
