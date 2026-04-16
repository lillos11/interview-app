import { describe, expect, it } from 'vitest';

import { allocateWeek, type BucketBalances, type FinanceSettings } from '../lib/finance';

const baseSettings: FinanceSettings = {
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
  foodBaselineWeekly: 100
};

const baseBuckets: BucketBalances = {
  UBER: { currentAmount: 0, targetAmount: 200 },
  EMERGENCY: { currentAmount: 0, targetAmount: 1000 },
  TUITION: { currentAmount: 0, targetAmount: 1800 },
  GOAL: { currentAmount: 0, targetAmount: 5000 }
};

describe('allocateWeek', () => {
  it('flags off track when surplus is negative', () => {
    const result = allocateWeek(
      {
        ...baseSettings,
        amazonHourlyPay: 10,
        amazonPlannedHours: 10,
        fellowshipHourlyPay: 5,
        fellowshipPlannedHours: 5,
        fixedBillsWeekly: 700,
        foodBaselineWeekly: 200
      },
      { balance: 2500, weeksRemaining: 10 },
      { amountDue: 1800, weeksUntilDue: 12 },
      baseBuckets,
      { referenceDate: new Date('2026-02-05') }
    );

    expect(result.flags.offTrack).toBe(true);
    expect(result.flags.gap).toBeGreaterThan(0);
    expect(result.allocations.uberBuffer).toBe(0);
    expect(result.allocations.requiredDebt).toBe(0);
  });

  it('allocates in order and marks partial funding when surplus is insufficient', () => {
    const result = allocateWeek(
      {
        ...baseSettings,
        amazonHourlyPay: 30,
        amazonPlannedHours: 35,
        fellowshipHourlyPay: 12,
        fellowshipPlannedHours: 15,
        fixedBillsWeekly: 550,
        foodBaselineWeekly: 120,
        uberWeekly: 300
      },
      { balance: 2000, weeksRemaining: 8 },
      { amountDue: 1500, weeksUntilDue: 10 },
      baseBuckets,
      { referenceDate: new Date('2026-02-05') }
    );

    expect(result.flags.offTrack).toBe(false);
    expect(result.flags.partialFunding).toBe(true);

    const partialStepNames = result.flags.partiallyFundedSteps;
    expect(partialStepNames.length).toBeGreaterThan(0);

    expect(result.allocations.uberBuffer).toBeLessThanOrEqual(result.requirements.uberBuffer);
    expect(result.allocations.emergency).toBeLessThanOrEqual(result.requirements.emergency);
    expect(result.allocations.tuition).toBeLessThanOrEqual(result.requirements.tuition);
  });

  it('skips emergency deposit when emergency bucket is already at target', () => {
    const result = allocateWeek(
      baseSettings,
      { balance: 2500, weeksRemaining: 10 },
      { amountDue: 1800, weeksUntilDue: 12 },
      {
        ...baseBuckets,
        EMERGENCY: { currentAmount: 1000, targetAmount: 1000 }
      },
      { referenceDate: new Date('2026-02-05') }
    );

    expect(result.requirements.emergency).toBe(0);
    expect(result.allocations.emergency).toBe(0);
    expect(result.projections.emergencyTargetDate).toBe('2026-02-05');
  });

  it('handles weeksRemaining=0 by requiring full debt balance this week', () => {
    const result = allocateWeek(
      baseSettings,
      { balance: 900, weeksRemaining: 0 },
      { amountDue: 500, weeksUntilDue: 5 },
      baseBuckets,
      { referenceDate: new Date('2026-02-05') }
    );

    expect(result.requirements.requiredDebt).toBe(900);
    expect(result.allocations.requiredDebt).toBeLessThanOrEqual(900);

    if (result.allocations.requiredDebt >= 900) {
      expect(result.projections.debtPayoffDate).toBe('2026-02-12');
    }
  });
});
