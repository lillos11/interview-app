'use server';

import { revalidatePath } from 'next/cache';

import { ensureBaseData } from '@/lib/data';
import { BucketName, TaskStatus, TimeCategory } from '@/lib/domain';
import { assertDatabaseConfigured, prisma } from '@/lib/prisma';

function numberFromForm(formData: FormData, key: string, fallback = 0): number {
  const raw = formData.get(key);
  const value = typeof raw === 'string' ? Number(raw) : Number.NaN;
  return Number.isFinite(value) ? value : fallback;
}

function stringFromForm(formData: FormData, key: string, fallback = ''): string {
  const raw = formData.get(key);
  return typeof raw === 'string' ? raw : fallback;
}

function dateFromForm(formData: FormData, key: string, fallback = new Date()): Date {
  const raw = formData.get(key);
  if (typeof raw !== 'string' || raw.length === 0) {
    return fallback;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/log');
  revalidatePath('/money');
  revalidatePath('/school');
  revalidatePath('/health');
  revalidatePath('/settings');
}

export async function addTimeEntryAction(formData: FormData) {
  assertDatabaseConfigured();
  await ensureBaseData();

  const category = stringFromForm(formData, 'category', 'STUDY').toUpperCase();
  const minutes = Math.max(1, Math.round(numberFromForm(formData, 'minutes', 0)));
  const note = stringFromForm(formData, 'note').trim();
  const dateTime = dateFromForm(formData, 'dateTime', new Date());

  if (!Object.values(TimeCategory).includes(category as TimeCategory)) {
    throw new Error('Invalid category');
  }

  await prisma.timeEntry.create({
    data: {
      category: category as TimeCategory,
      minutes,
      note: note.length > 0 ? note : null,
      dateTime
    }
  });

  revalidateAll();
}

export async function createTaskAction(formData: FormData) {
  assertDatabaseConfigured();
  await ensureBaseData();

  const title = stringFromForm(formData, 'title').trim();
  if (!title) {
    throw new Error('Task title is required');
  }

  const course = stringFromForm(formData, 'course', 'MBA').trim() || 'MBA';
  const moduleName =
    stringFromForm(formData, 'module', 'Current Module').trim() || 'Current Module';
  const rubricChecklist =
    stringFromForm(formData, 'rubricChecklist', 'Review assignment rubric').trim() ||
    'Review assignment rubric';
  const estimatedMinutes = Math.max(25, Math.round(numberFromForm(formData, 'estimatedMinutes', 25)));
  const dueDate = dateFromForm(formData, 'dueDate', new Date());

  await prisma.task.create({
    data: {
      title,
      course,
      module: moduleName,
      rubricChecklist,
      estimatedMinutes,
      dueDate,
      status: TaskStatus.TODO
    }
  });

  revalidatePath('/');
  revalidatePath('/school');
}

export async function quickAddTaskAction(formData: FormData) {
  assertDatabaseConfigured();
  await ensureBaseData();
  const title = stringFromForm(formData, 'title').trim();

  if (!title) {
    throw new Error('Task title is required');
  }

  await prisma.task.create({
    data: {
      title,
      course: 'MBA',
      module: 'Current Module',
      rubricChecklist: 'Define deliverable and grading points',
      estimatedMinutes: 30,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: TaskStatus.TODO
    }
  });

  revalidatePath('/');
  revalidatePath('/school');
}

export async function updateTaskStatusAction(formData: FormData) {
  assertDatabaseConfigured();
  const id = Math.round(numberFromForm(formData, 'id', 0));
  const status = stringFromForm(formData, 'status', 'TODO').toUpperCase();

  if (!id) {
    throw new Error('Task ID is required');
  }

  if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
    throw new Error('Invalid task status');
  }

  await prisma.task.update({
    where: { id },
    data: {
      status: status as TaskStatus
    }
  });

  revalidatePath('/');
  revalidatePath('/school');
}

export async function deleteTaskAction(formData: FormData) {
  assertDatabaseConfigured();
  const id = Math.round(numberFromForm(formData, 'id', 0));
  if (!id) {
    throw new Error('Task ID is required');
  }

  await prisma.task.delete({
    where: {
      id
    }
  });

  revalidatePath('/');
  revalidatePath('/school');
}

export async function logSymptomAction(formData: FormData) {
  assertDatabaseConfigured();
  await ensureBaseData();

  await prisma.symptomEntry.create({
    data: {
      date: dateFromForm(formData, 'date', new Date()),
      tremor: formData.get('tremor') === 'on',
      tingling: formData.get('tingling') === 'on',
      cramps: formData.get('cramps') === 'on',
      fatigue: formData.get('fatigue') === 'on',
      note: stringFromForm(formData, 'note').trim() || null
    }
  });

  revalidatePath('/health');
}

export async function updateSettingsAction(formData: FormData) {
  assertDatabaseConfigured();
  await ensureBaseData();

  const amountDue = numberFromForm(formData, 'tuitionAmountDue', 0);

  await prisma.userSettings.upsert({
    where: { id: 1 },
    update: {
      amazonHourlyPay: numberFromForm(formData, 'amazonHourlyPay'),
      amazonPlannedHours: numberFromForm(formData, 'amazonPlannedHours'),
      amazonOtHours: numberFromForm(formData, 'amazonOtHours'),
      amazonOtMultiplier: numberFromForm(formData, 'amazonOtMultiplier', 1.5),
      fellowshipHourlyPay: numberFromForm(formData, 'fellowshipHourlyPay'),
      fellowshipPlannedHours: numberFromForm(formData, 'fellowshipPlannedHours'),
      fellowshipWeeklyCap: numberFromForm(formData, 'fellowshipWeeklyCap'),
      taxesPercent: numberFromForm(formData, 'taxesPercent'),
      four01kPercent: numberFromForm(formData, 'four01kPercent'),
      insuranceWeekly: numberFromForm(formData, 'insuranceWeekly'),
      otherDeductionsWeekly: numberFromForm(formData, 'otherDeductionsWeekly'),
      uberWeekly: numberFromForm(formData, 'uberWeekly'),
      fixedBillsWeekly: numberFromForm(formData, 'fixedBillsWeekly'),
      foodBaselineWeekly: numberFromForm(formData, 'foodBaselineWeekly'),
      commuteMinutes: Math.round(numberFromForm(formData, 'commuteMinutes', 30)),
      gymTargetSessions: Math.round(numberFromForm(formData, 'gymTargetSessions', 3)),
      studyTargetMinutes: Math.round(numberFromForm(formData, 'studyTargetMinutes', 300))
    },
    create: {
      id: 1,
      amazonHourlyPay: numberFromForm(formData, 'amazonHourlyPay'),
      amazonPlannedHours: numberFromForm(formData, 'amazonPlannedHours'),
      amazonOtHours: numberFromForm(formData, 'amazonOtHours'),
      amazonOtMultiplier: numberFromForm(formData, 'amazonOtMultiplier', 1.5),
      fellowshipHourlyPay: numberFromForm(formData, 'fellowshipHourlyPay'),
      fellowshipPlannedHours: numberFromForm(formData, 'fellowshipPlannedHours'),
      fellowshipWeeklyCap: numberFromForm(formData, 'fellowshipWeeklyCap'),
      taxesPercent: numberFromForm(formData, 'taxesPercent'),
      four01kPercent: numberFromForm(formData, 'four01kPercent'),
      insuranceWeekly: numberFromForm(formData, 'insuranceWeekly'),
      otherDeductionsWeekly: numberFromForm(formData, 'otherDeductionsWeekly'),
      uberWeekly: numberFromForm(formData, 'uberWeekly'),
      fixedBillsWeekly: numberFromForm(formData, 'fixedBillsWeekly'),
      foodBaselineWeekly: numberFromForm(formData, 'foodBaselineWeekly'),
      commuteMinutes: Math.round(numberFromForm(formData, 'commuteMinutes', 30)),
      gymTargetSessions: Math.round(numberFromForm(formData, 'gymTargetSessions', 3)),
      studyTargetMinutes: Math.round(numberFromForm(formData, 'studyTargetMinutes', 300))
    }
  });

  await prisma.debtPlan.upsert({
    where: { id: 1 },
    update: {
      balance: numberFromForm(formData, 'debtBalance'),
      weeksRemaining: Math.round(numberFromForm(formData, 'debtWeeksRemaining', 1))
    },
    create: {
      id: 1,
      balance: numberFromForm(formData, 'debtBalance'),
      weeksRemaining: Math.round(numberFromForm(formData, 'debtWeeksRemaining', 1))
    }
  });

  await prisma.tuitionPlan.upsert({
    where: { id: 1 },
    update: {
      amountDue,
      weeksUntilDue: Math.round(numberFromForm(formData, 'tuitionWeeksUntilDue', 1))
    },
    create: {
      id: 1,
      amountDue,
      weeksUntilDue: Math.round(numberFromForm(formData, 'tuitionWeeksUntilDue', 1))
    }
  });

  await prisma.savingsBucket.upsert({
    where: { name: BucketName.UBER },
    update: {
      currentAmount: numberFromForm(formData, 'bucketUberCurrent'),
      targetAmount: numberFromForm(formData, 'bucketUberTarget', numberFromForm(formData, 'uberWeekly'))
    },
    create: {
      name: BucketName.UBER,
      currentAmount: numberFromForm(formData, 'bucketUberCurrent'),
      targetAmount: numberFromForm(formData, 'bucketUberTarget', numberFromForm(formData, 'uberWeekly'))
    }
  });

  await prisma.savingsBucket.upsert({
    where: { name: BucketName.EMERGENCY },
    update: {
      currentAmount: numberFromForm(formData, 'bucketEmergencyCurrent'),
      targetAmount: numberFromForm(formData, 'bucketEmergencyTarget', 1000)
    },
    create: {
      name: BucketName.EMERGENCY,
      currentAmount: numberFromForm(formData, 'bucketEmergencyCurrent'),
      targetAmount: numberFromForm(formData, 'bucketEmergencyTarget', 1000)
    }
  });

  await prisma.savingsBucket.upsert({
    where: { name: BucketName.TUITION },
    update: {
      currentAmount: numberFromForm(formData, 'bucketTuitionCurrent'),
      targetAmount: numberFromForm(formData, 'bucketTuitionTarget', amountDue)
    },
    create: {
      name: BucketName.TUITION,
      currentAmount: numberFromForm(formData, 'bucketTuitionCurrent'),
      targetAmount: numberFromForm(formData, 'bucketTuitionTarget', amountDue)
    }
  });

  await prisma.savingsBucket.upsert({
    where: { name: BucketName.GOAL },
    update: {
      currentAmount: numberFromForm(formData, 'bucketGoalCurrent'),
      targetAmount: numberFromForm(formData, 'bucketGoalTarget', 5000)
    },
    create: {
      name: BucketName.GOAL,
      currentAmount: numberFromForm(formData, 'bucketGoalCurrent'),
      targetAmount: numberFromForm(formData, 'bucketGoalTarget', 5000)
    }
  });

  revalidateAll();
}
