'use client';

import { useMemo, useState } from 'react';

import {
  allocateWeek,
  type BucketBalances,
  type DebtPlanInput,
  type FinanceSettings,
  type TuitionPlanInput
} from '@/lib/finance';

function currency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

interface MoneyScenarioClientProps {
  settings: FinanceSettings;
  debtPlan: DebtPlanInput;
  tuitionPlan: TuitionPlanInput;
  bucketBalances: BucketBalances;
}

const fellowshipScenarioOptions = [25, 30, 35];

export function MoneyScenarioClient({
  settings,
  debtPlan,
  tuitionPlan,
  bucketBalances
}: MoneyScenarioClientProps) {
  const [fellowshipHours, setFellowshipHours] = useState<number>(
    Math.round(settings.fellowshipPlannedHours)
  );
  const [overtimeEnabled, setOvertimeEnabled] = useState<boolean>(settings.amazonOtHours > 0);

  const result = useMemo(
    () =>
      allocateWeek(settings, debtPlan, tuitionPlan, bucketBalances, {
        fellowshipHours,
        overtimeEnabled
      }),
    [settings, debtPlan, tuitionPlan, bucketBalances, fellowshipHours, overtimeEnabled]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Scenario Toggles</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {fellowshipScenarioOptions.map((hours) => (
            <button
              key={hours}
              type="button"
              onClick={() => setFellowshipHours(hours)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                fellowshipHours === hours
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {hours} Fellowship Hrs
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOvertimeEnabled((prev) => !prev)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              overtimeEnabled
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            OT {overtimeEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Net Weekly Income</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{currency(result.netIncome)}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Weekly Essentials</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{currency(result.essentials)}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Surplus</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              result.surplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {currency(result.surplus)}
          </p>
        </article>
      </section>

      {result.flags.offTrack ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <h3 className="font-semibold">Off Track</h3>
          <p className="text-sm">Weekly gap: {currency(result.flags.gap)}. Increase income or reduce essentials.</p>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Weekly Allocation Waterfall</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-3">Step</th>
                <th className="py-2 pr-3">Required</th>
                <th className="py-2 pr-3">Allocated</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.steps.map((step) => (
                <tr key={step.step} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium text-slate-800">{step.step}</td>
                  <td className="py-2 pr-3 text-slate-600">{currency(step.required)}</td>
                  <td className="py-2 pr-3 text-slate-600">{currency(step.allocated)}</td>
                  <td className="py-2">
                    {step.required === 0
                      ? 'N/A'
                      : step.funded
                        ? 'Funded'
                        : step.partial
                          ? 'Partially Funded'
                          : 'Unfunded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Allocation Outputs</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Uber Buffer: {currency(result.allocations.uberBuffer)}</li>
            <li>Emergency Starter: {currency(result.allocations.emergency)}</li>
            <li>Tuition Sinking Fund: {currency(result.allocations.tuition)}</li>
            <li>Required Debt: {currency(result.allocations.requiredDebt)}</li>
            <li>Extra Debt: {currency(result.allocations.extraDebt)}</li>
            <li>Goal Savings: {currency(result.allocations.goalSavings)}</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Projected Dates</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              Emergency $1,000:{' '}
              <span className="font-medium">{result.projections.emergencyTargetDate ?? 'Not reachable yet'}</span>
            </li>
            <li>
              Tuition Goal:{' '}
              <span className="font-medium">{result.projections.tuitionTargetDate ?? 'Not reachable yet'}</span>
            </li>
            <li>
              Debt Payoff:{' '}
              <span className="font-medium">{result.projections.debtPayoffDate ?? 'Not reachable yet'}</span>
            </li>
          </ul>
          {result.flags.partialFunding ? (
            <p className="mt-3 text-xs text-amber-700">
              Partial funding: {result.flags.partiallyFundedSteps.join(', ')}
            </p>
          ) : null}
        </article>
      </section>
    </div>
  );
}
