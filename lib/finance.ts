import { addWeeks } from './date';

export type BucketKey = 'UBER' | 'EMERGENCY' | 'TUITION' | 'GOAL';

export interface FinanceSettings {
  amazonHourlyPay: number;
  amazonPlannedHours: number;
  amazonOtHours: number;
  amazonOtMultiplier: number;
  fellowshipHourlyPay: number;
  fellowshipPlannedHours: number;
  fellowshipWeeklyCap: number;
  taxesPercent: number;
  four01kPercent: number;
  insuranceWeekly: number;
  otherDeductionsWeekly: number;
  uberWeekly: number;
  fixedBillsWeekly: number;
  foodBaselineWeekly: number;
}

export interface DebtPlanInput {
  balance: number;
  weeksRemaining: number;
}

export interface TuitionPlanInput {
  amountDue: number;
  weeksUntilDue: number;
}

export interface BucketBalance {
  currentAmount: number;
  targetAmount: number;
}

export type BucketBalances = Record<BucketKey, BucketBalance>;

export interface ScenarioOverrides {
  fellowshipHours?: number;
  overtimeEnabled?: boolean;
  amazonOtHours?: number;
  referenceDate?: Date;
}

export interface AllocationStep {
  step: string;
  required: number;
  allocated: number;
  funded: boolean;
  partial: boolean;
}

export interface AllocationResult {
  allocations: {
    uberBuffer: number;
    emergency: number;
    tuition: number;
    requiredDebt: number;
    extraDebt: number;
    goalSavings: number;
  };
  requirements: {
    uberBuffer: number;
    emergency: number;
    tuition: number;
    requiredDebt: number;
  };
  steps: AllocationStep[];
  grossIncome: number;
  netIncome: number;
  essentials: number;
  surplus: number;
  projections: {
    emergencyTargetDate: string | null;
    tuitionTargetDate: string | null;
    debtPayoffDate: string | null;
  };
  flags: {
    offTrack: boolean;
    partialFunding: boolean;
    gap: number;
    partiallyFundedSteps: string[];
  };
  scenario: {
    fellowshipHours: number;
    overtimeEnabled: boolean;
    overtimeHours: number;
  };
}

const EMERGENCY_TARGET = 1000;

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampPositive(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function projectedDate(
  currentAmount: number,
  targetAmount: number,
  weeklyContribution: number,
  referenceDate: Date
): string | null {
  if (targetAmount <= 0) {
    return toIsoDate(referenceDate);
  }

  if (currentAmount >= targetAmount) {
    return toIsoDate(referenceDate);
  }

  if (weeklyContribution <= 0) {
    return null;
  }

  const weeks = Math.ceil((targetAmount - currentAmount) / weeklyContribution);
  return toIsoDate(addWeeks(referenceDate, weeks));
}

export function allocateWeek(
  settings: FinanceSettings,
  debtPlan: DebtPlanInput,
  tuitionPlan: TuitionPlanInput,
  bucketBalances: BucketBalances,
  scenarioOverrides: ScenarioOverrides = {}
): AllocationResult {
  const referenceDate = scenarioOverrides.referenceDate
    ? new Date(scenarioOverrides.referenceDate)
    : new Date();

  const fellowshipHours = Math.min(
    scenarioOverrides.fellowshipHours ?? settings.fellowshipPlannedHours,
    settings.fellowshipWeeklyCap
  );

  const overtimeEnabled = scenarioOverrides.overtimeEnabled ?? true;
  const overtimeHours = overtimeEnabled
    ? scenarioOverrides.amazonOtHours ?? settings.amazonOtHours
    : 0;

  const amazonGross =
    settings.amazonHourlyPay * settings.amazonPlannedHours +
    settings.amazonHourlyPay * overtimeHours * settings.amazonOtMultiplier;
  const fellowshipGross = settings.fellowshipHourlyPay * clampPositive(fellowshipHours);
  const grossIncome = money(amazonGross + fellowshipGross);

  const taxes = money(grossIncome * (settings.taxesPercent / 100));
  const four01k = money(grossIncome * (settings.four01kPercent / 100));

  const essentials = money(
    settings.fixedBillsWeekly +
      settings.foodBaselineWeekly +
      settings.insuranceWeekly +
      settings.otherDeductionsWeekly +
      taxes +
      four01k
  );

  const netIncome = money(
    grossIncome - taxes - four01k - settings.insuranceWeekly - settings.otherDeductionsWeekly
  );

  let available = money(grossIncome - essentials);
  const offTrack = available < 0;

  const currentEmergency = bucketBalances.EMERGENCY?.currentAmount ?? 0;
  const emergencyNeed = clampPositive(EMERGENCY_TARGET - currentEmergency);
  const emergencyWeeklyBase = money(Math.max(25, netIncome * 0.03));
  const emergencyRequired = money(Math.min(emergencyNeed, emergencyWeeklyBase));

  const currentTuition = bucketBalances.TUITION?.currentAmount ?? 0;
  const tuitionNeed = clampPositive(tuitionPlan.amountDue - currentTuition);
  const tuitionRequired = money(
    tuitionPlan.weeksUntilDue > 0 ? tuitionNeed / tuitionPlan.weeksUntilDue : tuitionNeed
  );

  const debtNeed = clampPositive(debtPlan.balance);
  const requiredDebtPayment = money(
    debtPlan.weeksRemaining > 0 ? debtNeed / debtPlan.weeksRemaining : debtNeed
  );

  const uberRequired = money(settings.uberWeekly);

  const steps: AllocationStep[] = [];

  const runStep = (label: string, required: number): number => {
    const normalizedRequired = money(clampPositive(required));
    if (offTrack || normalizedRequired === 0) {
      steps.push({
        step: label,
        required: normalizedRequired,
        allocated: 0,
        funded: normalizedRequired === 0,
        partial: false
      });
      return 0;
    }

    const allocated = money(Math.min(available, normalizedRequired));
    available = money(available - allocated);

    steps.push({
      step: label,
      required: normalizedRequired,
      allocated,
      funded: allocated >= normalizedRequired,
      partial: allocated > 0 && allocated < normalizedRequired
    });

    return allocated;
  };

  const uberAllocated = runStep('Uber Buffer', uberRequired);
  const emergencyAllocated = runStep('Emergency Starter', emergencyRequired);
  const tuitionAllocated = runStep('Tuition Sinking Fund', tuitionRequired);
  const requiredDebtAllocated = runStep('Debt Required Payment', requiredDebtPayment);

  let extraDebt = 0;
  let goalSavings = 0;

  if (!offTrack && available > 0) {
    const debtRemainingAfterRequired = money(debtNeed - requiredDebtAllocated);
    if (debtRemainingAfterRequired > 0) {
      extraDebt = money(available * 0.7);
      goalSavings = money(available - extraDebt);
    } else {
      goalSavings = money(available);
    }

    steps.push({
      step: 'Overflow Split (70/30)',
      required: 0,
      allocated: money(extraDebt + goalSavings),
      funded: true,
      partial: false
    });

    available = 0;
  } else {
    steps.push({
      step: 'Overflow Split (70/30)',
      required: 0,
      allocated: 0,
      funded: true,
      partial: false
    });
  }

  const partiallyFundedSteps = steps
    .filter((step) => step.required > 0 && step.allocated < step.required)
    .map((step) => step.step);

  const requiredTotal = money(uberRequired + emergencyRequired + tuitionRequired + requiredDebtPayment);
  const fundedRequiredTotal = money(
    uberAllocated + emergencyAllocated + tuitionAllocated + requiredDebtAllocated
  );

  const weeklyDebtPayment = money(requiredDebtAllocated + extraDebt);

  return {
    allocations: {
      uberBuffer: uberAllocated,
      emergency: emergencyAllocated,
      tuition: tuitionAllocated,
      requiredDebt: requiredDebtAllocated,
      extraDebt,
      goalSavings
    },
    requirements: {
      uberBuffer: uberRequired,
      emergency: emergencyRequired,
      tuition: tuitionRequired,
      requiredDebt: requiredDebtPayment
    },
    steps,
    grossIncome,
    netIncome,
    essentials,
    surplus: money(grossIncome - essentials),
    projections: {
      emergencyTargetDate: projectedDate(
        currentEmergency,
        EMERGENCY_TARGET,
        emergencyAllocated,
        referenceDate
      ),
      tuitionTargetDate: projectedDate(
        currentTuition,
        tuitionPlan.amountDue,
        tuitionAllocated,
        referenceDate
      ),
      debtPayoffDate: projectedDate(0, debtNeed, weeklyDebtPayment, referenceDate)
    },
    flags: {
      offTrack,
      partialFunding: partiallyFundedSteps.length > 0,
      gap: offTrack
        ? money(Math.abs(grossIncome - essentials))
        : money(Math.max(0, requiredTotal - fundedRequiredTotal)),
      partiallyFundedSteps
    },
    scenario: {
      fellowshipHours,
      overtimeEnabled,
      overtimeHours
    }
  };
}
