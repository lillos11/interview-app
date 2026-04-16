import { updateSettingsAction } from '@/app/actions';
import { Card } from '@/components/Card';
import { getCoreData } from '@/lib/data';

export default async function SettingsPage() {
  const { settings, debtPlan, tuitionPlan, buckets } = await getCoreData();

  return (
    <div className="space-y-4">
      <Card title="LifeOS Settings">
        <form action={updateSettingsAction} className="space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Income Inputs</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                Amazon Hourly Pay
                <input name="amazonHourlyPay" type="number" step="0.01" defaultValue={settings.amazonHourlyPay} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Amazon Planned Hours/Week
                <input name="amazonPlannedHours" type="number" step="0.1" defaultValue={settings.amazonPlannedHours} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Amazon OT Hours/Week
                <input name="amazonOtHours" type="number" step="0.1" defaultValue={settings.amazonOtHours} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                OT Multiplier
                <input
                  name="amazonOtMultiplier"
                  type="number"
                  step="0.01"
                  defaultValue={settings.amazonOtMultiplier}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Fellowship Hourly Pay
                <input
                  name="fellowshipHourlyPay"
                  type="number"
                  step="0.01"
                  defaultValue={settings.fellowshipHourlyPay}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Fellowship Planned Hours/Week
                <input
                  name="fellowshipPlannedHours"
                  type="number"
                  step="0.1"
                  defaultValue={settings.fellowshipPlannedHours}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Fellowship Weekly Cap
                <input
                  name="fellowshipWeeklyCap"
                  type="number"
                  step="0.1"
                  defaultValue={settings.fellowshipWeeklyCap}
                  required
                />
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Deductions & Costs</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                Taxes %
                <input name="taxesPercent" type="number" step="0.1" defaultValue={settings.taxesPercent} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                401k %
                <input name="four01kPercent" type="number" step="0.1" defaultValue={settings.four01kPercent} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Insurance Weekly
                <input name="insuranceWeekly" type="number" step="0.01" defaultValue={settings.insuranceWeekly} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Other Deductions Weekly
                <input
                  name="otherDeductionsWeekly"
                  type="number"
                  step="0.01"
                  defaultValue={settings.otherDeductionsWeekly}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Uber Weekly Cost
                <input name="uberWeekly" type="number" step="0.01" defaultValue={settings.uberWeekly} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Fixed Bills Weekly
                <input
                  name="fixedBillsWeekly"
                  type="number"
                  step="0.01"
                  defaultValue={settings.fixedBillsWeekly}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Food Baseline Weekly
                <input
                  name="foodBaselineWeekly"
                  type="number"
                  step="0.01"
                  defaultValue={settings.foodBaselineWeekly}
                  required
                />
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Debt & Tuition Plans</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                Debt Balance
                <input name="debtBalance" type="number" step="0.01" defaultValue={debtPlan.balance} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Debt Weeks Remaining
                <input
                  name="debtWeeksRemaining"
                  type="number"
                  step="1"
                  defaultValue={debtPlan.weeksRemaining}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tuition Amount Due
                <input
                  name="tuitionAmountDue"
                  type="number"
                  step="0.01"
                  defaultValue={tuitionPlan.amountDue}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tuition Weeks Until Due
                <input
                  name="tuitionWeeksUntilDue"
                  type="number"
                  step="1"
                  defaultValue={tuitionPlan.weeksUntilDue}
                  required
                />
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Savings Buckets</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                Uber Current
                <input
                  name="bucketUberCurrent"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.UBER.currentAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Uber Target
                <input
                  name="bucketUberTarget"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.UBER.targetAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Emergency Current
                <input
                  name="bucketEmergencyCurrent"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.EMERGENCY.currentAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Emergency Target
                <input
                  name="bucketEmergencyTarget"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.EMERGENCY.targetAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tuition Current
                <input
                  name="bucketTuitionCurrent"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.TUITION.currentAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tuition Target
                <input
                  name="bucketTuitionTarget"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.TUITION.targetAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Goal Current
                <input
                  name="bucketGoalCurrent"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.GOAL.currentAmount}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Goal Target
                <input
                  name="bucketGoalTarget"
                  type="number"
                  step="0.01"
                  defaultValue={buckets.GOAL.targetAmount}
                  required
                />
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Routine Targets</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                Commute Minutes
                <input name="commuteMinutes" type="number" step="1" defaultValue={settings.commuteMinutes} required />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Gym Target Sessions
                <input
                  name="gymTargetSessions"
                  type="number"
                  step="1"
                  defaultValue={settings.gymTargetSessions}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Study Target Minutes
                <input
                  name="studyTargetMinutes"
                  type="number"
                  step="1"
                  defaultValue={settings.studyTargetMinutes}
                  required
                />
              </label>
            </div>
          </section>

          <button type="submit" className="rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white">
            Save Settings
          </button>
        </form>
      </Card>
    </div>
  );
}
