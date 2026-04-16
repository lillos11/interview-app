import { BucketName, TaskStatus, TimeCategory, type BucketName as BucketNameType } from '@/lib/domain';

export const DEFAULT_USER_SETTINGS = {
  id: 1,
  amazonHourlyPay: 26.5,
  amazonPlannedHours: 40,
  amazonOtHours: 0,
  amazonOtMultiplier: 1.5,
  fellowshipHourlyPay: 17,
  fellowshipPlannedHours: 30,
  fellowshipWeeklyCap: 35,
  taxesPercent: 20,
  four01kPercent: 15,
  insuranceWeekly: 60,
  otherDeductionsWeekly: 0,
  uberWeekly: 200,
  fixedBillsWeekly: 500,
  foodBaselineWeekly: 100,
  commuteMinutes: 30,
  gymTargetSessions: 3,
  studyTargetMinutes: 300
} as const;

export const DEFAULT_DEBT_PLAN = {
  id: 1,
  balance: 2500,
  weeksRemaining: 10
} as const;

export const DEFAULT_TUITION_PLAN = {
  id: 1,
  amountDue: 1800,
  weeksUntilDue: 12
} as const;

export const DEFAULT_BUCKETS: Array<{
  name: BucketNameType;
  currentAmount: number;
  targetAmount: number;
}> = [
  { name: BucketName.UBER, currentAmount: 0, targetAmount: 200 },
  { name: BucketName.EMERGENCY, currentAmount: 0, targetAmount: 1000 },
  { name: BucketName.TUITION, currentAmount: 0, targetAmount: 1800 },
  { name: BucketName.GOAL, currentAmount: 0, targetAmount: 5000 }
];

export const DEFAULT_TASK = {
  title: 'Outline Module Discussion Post',
  course: 'MBA-500',
  module: 'Module 2',
  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  rubricChecklist: 'Prompt alignment; citation; response quality',
  status: TaskStatus.TODO,
  estimatedMinutes: 45
};

export const DEFAULT_TIME_ENTRY = {
  dateTime: new Date(),
  category: TimeCategory.STUDY,
  minutes: 30,
  note: 'Kickoff study block'
};
