import {
  type DebtPlan,
  type SavingsBucket,
  type Task,
  type TimeEntry,
  type TuitionPlan,
  type UserSettings
} from '@prisma/client';

import { endOfWeek, startOfWeek } from '@/lib/date';
import { BucketName, TaskStatus, TimeCategory, type BucketName as BucketNameType } from '@/lib/domain';
import {
  DEFAULT_BUCKETS,
  DEFAULT_DEBT_PLAN,
  DEFAULT_TASK,
  DEFAULT_TIME_ENTRY,
  DEFAULT_TUITION_PLAN,
  DEFAULT_USER_SETTINGS
} from '@/lib/defaults';
import { prisma } from '@/lib/prisma';

export async function ensureBaseData() {
  await prisma.userSettings.upsert({
    where: { id: 1 },
    update: {},
    create: DEFAULT_USER_SETTINGS
  });

  await prisma.debtPlan.upsert({
    where: { id: 1 },
    update: {},
    create: DEFAULT_DEBT_PLAN
  });

  await prisma.tuitionPlan.upsert({
    where: { id: 1 },
    update: {},
    create: DEFAULT_TUITION_PLAN
  });

  for (const bucket of DEFAULT_BUCKETS) {
    await prisma.savingsBucket.upsert({
      where: { name: bucket.name },
      update: {},
      create: bucket
    });
  }
}

export async function seedIfEmpty() {
  await ensureBaseData();

  const [taskCount, timeCount] = await Promise.all([
    prisma.task.count(),
    prisma.timeEntry.count()
  ]);

  if (taskCount === 0) {
    await prisma.task.create({ data: DEFAULT_TASK });
  }

  if (timeCount === 0) {
    await prisma.timeEntry.create({ data: DEFAULT_TIME_ENTRY });
  }
}

export async function getCoreData(): Promise<{
  settings: UserSettings;
  debtPlan: DebtPlan;
  tuitionPlan: TuitionPlan;
  buckets: Record<BucketNameType, SavingsBucket>;
}> {
  await ensureBaseData();

  const [settings, debtPlan, tuitionPlan, buckets] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.debtPlan.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.tuitionPlan.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.savingsBucket.findMany()
  ]);

  const bucketMap = buckets.reduce<Record<BucketNameType, SavingsBucket>>((acc, bucket) => {
    acc[bucket.name as BucketNameType] = bucket;
    return acc;
  }, {} as Record<BucketNameType, SavingsBucket>);

  return {
    settings,
    debtPlan,
    tuitionPlan,
    buckets: bucketMap
  };
}

export async function getWeekEntries(reference = new Date()): Promise<TimeEntry[]> {
  const weekStart = startOfWeek(reference);
  const weekEnd = endOfWeek(reference);

  return prisma.timeEntry.findMany({
    where: {
      dateTime: {
        gte: weekStart,
        lt: weekEnd
      }
    },
    orderBy: {
      dateTime: 'asc'
    }
  });
}

export async function getAllTasks(): Promise<Task[]> {
  return prisma.task.findMany({
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }]
  });
}

export async function getOpenTaskByUrgency(): Promise<Task | null> {
  const tasks = await prisma.task.findMany({
    where: {
      status: {
        not: TaskStatus.DONE
      }
    }
  });

  if (tasks.length === 0) {
    return null;
  }

  const now = Date.now();

  return tasks
    .map((task) => {
      const dueMs = Math.max(1, task.dueDate.getTime() - now);
      const urgency = task.estimatedMinutes / 10 + 1_000_000 / dueMs;
      return { task, urgency };
    })
    .sort((a, b) => b.urgency - a.urgency)[0]?.task ?? null;
}

export async function getSymptoms(limit = 20) {
  return prisma.symptomEntry.findMany({
    orderBy: {
      date: 'desc'
    },
    take: limit
  });
}

export async function getWorkoutStreak(targetSessionsPerWeek: number): Promise<number> {
  if (targetSessionsPerWeek <= 0) {
    return 0;
  }

  const workouts = await prisma.timeEntry.findMany({
    where: {
      category: TimeCategory.WORKOUT
    },
    orderBy: {
      dateTime: 'desc'
    }
  });

  if (workouts.length === 0) {
    return 0;
  }

  const sessionsByWeek = new Map<string, number>();

  for (const entry of workouts) {
    const weekKey = startOfWeek(entry.dateTime).toISOString();
    sessionsByWeek.set(weekKey, (sessionsByWeek.get(weekKey) ?? 0) + 1);
  }

  let streak = 0;
  let cursor = startOfWeek(new Date());

  while (true) {
    const key = cursor.toISOString();
    const count = sessionsByWeek.get(key) ?? 0;
    if (count >= targetSessionsPerWeek) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

export function mapBucketsForFinance(buckets: Record<BucketNameType, SavingsBucket>) {
  return {
    UBER: {
      currentAmount: buckets.UBER?.currentAmount ?? 0,
      targetAmount: buckets.UBER?.targetAmount ?? 0
    },
    EMERGENCY: {
      currentAmount: buckets.EMERGENCY?.currentAmount ?? 0,
      targetAmount: buckets.EMERGENCY?.targetAmount ?? 1000
    },
    TUITION: {
      currentAmount: buckets.TUITION?.currentAmount ?? 0,
      targetAmount: buckets.TUITION?.targetAmount ?? 0
    },
    GOAL: {
      currentAmount: buckets.GOAL?.currentAmount ?? 0,
      targetAmount: buckets.GOAL?.targetAmount ?? 0
    }
  };
}
