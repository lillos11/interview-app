import { PrismaClient } from '@prisma/client';

import { BucketName, TaskStatus, TimeCategory } from '../lib/domain';

const prisma = new PrismaClient();

async function main() {
  await prisma.userSettings.upsert({
    where: { id: 1 },
    update: {
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
    },
    create: {
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
    }
  });

  await prisma.debtPlan.upsert({
    where: { id: 1 },
    update: {
      balance: 2500,
      weeksRemaining: 10
    },
    create: {
      id: 1,
      balance: 2500,
      weeksRemaining: 10
    }
  });

  await prisma.tuitionPlan.upsert({
    where: { id: 1 },
    update: {
      amountDue: 1800,
      weeksUntilDue: 12
    },
    create: {
      id: 1,
      amountDue: 1800,
      weeksUntilDue: 12
    }
  });

  const buckets = [
    { name: BucketName.UBER, currentAmount: 0, targetAmount: 200 },
    { name: BucketName.EMERGENCY, currentAmount: 125, targetAmount: 1000 },
    { name: BucketName.TUITION, currentAmount: 200, targetAmount: 1800 },
    { name: BucketName.GOAL, currentAmount: 75, targetAmount: 5000 }
  ];

  for (const bucket of buckets) {
    await prisma.savingsBucket.upsert({
      where: { name: bucket.name },
      update: {
        currentAmount: bucket.currentAmount,
        targetAmount: bucket.targetAmount
      },
      create: bucket
    });
  }

  const taskCount = await prisma.task.count();

  if (taskCount === 0) {
    const now = new Date();

    await prisma.task.createMany({
      data: [
        {
          title: 'Draft strategy memo',
          course: 'MBA-540',
          module: 'Module 4',
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          rubricChecklist: 'Problem statement; options; recommendation',
          status: TaskStatus.TODO,
          estimatedMinutes: 50
        },
        {
          title: 'Post discussion initial response',
          course: 'MBA-500',
          module: 'Module 3',
          dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          rubricChecklist: 'Citations; thesis; question prompt',
          status: TaskStatus.DOING,
          estimatedMinutes: 35
        }
      ]
    });
  }

  const timeCount = await prisma.timeEntry.count();

  if (timeCount === 0) {
    const now = new Date();
    await prisma.timeEntry.createMany({
      data: [
        {
          dateTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          category: TimeCategory.FELLOWSHIP,
          minutes: 55,
          note: 'Peer support call'
        },
        {
          dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          category: TimeCategory.STUDY,
          minutes: 90,
          note: 'Module reading'
        },
        {
          dateTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          category: TimeCategory.WORKOUT,
          minutes: 45,
          note: 'Upper body + cardio'
        }
      ]
    });
  }

  const symptomCount = await prisma.symptomEntry.count();
  if (symptomCount === 0) {
    await prisma.symptomEntry.create({
      data: {
        date: new Date(),
        fatigue: true,
        note: 'Mild fatigue after long shift'
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
