import { Card } from '@/components/Card';
import { MoneyScenarioClient } from '@/components/MoneyScenarioClient';
import { getCoreData, mapBucketsForFinance } from '@/lib/data';

function currency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export default async function MoneyPage() {
  const { settings, debtPlan, tuitionPlan, buckets } = await getCoreData();
  const financeSettings = {
    amazonHourlyPay: settings.amazonHourlyPay,
    amazonPlannedHours: settings.amazonPlannedHours,
    amazonOtHours: settings.amazonOtHours,
    amazonOtMultiplier: settings.amazonOtMultiplier,
    fellowshipHourlyPay: settings.fellowshipHourlyPay,
    fellowshipPlannedHours: settings.fellowshipPlannedHours,
    fellowshipWeeklyCap: settings.fellowshipWeeklyCap,
    taxesPercent: settings.taxesPercent,
    four01kPercent: settings.four01kPercent,
    insuranceWeekly: settings.insuranceWeekly,
    otherDeductionsWeekly: settings.otherDeductionsWeekly,
    uberWeekly: settings.uberWeekly,
    fixedBillsWeekly: settings.fixedBillsWeekly,
    foodBaselineWeekly: settings.foodBaselineWeekly
  };
  const financeDebtPlan = {
    balance: debtPlan.balance,
    weeksRemaining: debtPlan.weeksRemaining
  };
  const financeTuitionPlan = {
    amountDue: tuitionPlan.amountDue,
    weeksUntilDue: tuitionPlan.weeksUntilDue
  };

  return (
    <div className="space-y-4">
      <Card title="Current Balances">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Uber Buffer</p>
            <p className="text-xl font-semibold text-slate-900">{currency(buckets.UBER.currentAmount)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Emergency</p>
            <p className="text-xl font-semibold text-slate-900">{currency(buckets.EMERGENCY.currentAmount)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Tuition</p>
            <p className="text-xl font-semibold text-slate-900">{currency(buckets.TUITION.currentAmount)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Goal Savings</p>
            <p className="text-xl font-semibold text-slate-900">{currency(buckets.GOAL.currentAmount)}</p>
          </div>
        </div>
      </Card>

      <MoneyScenarioClient
        settings={financeSettings}
        debtPlan={financeDebtPlan}
        tuitionPlan={financeTuitionPlan}
        bucketBalances={mapBucketsForFinance(buckets)}
      />
    </div>
  );
}
