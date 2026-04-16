import { addTimeEntryAction, logSymptomAction } from '@/app/actions';
import { Card } from '@/components/Card';
import { TimeCategory } from '@/lib/domain';
import { getCoreData, getSymptoms, getWeekEntries, getWorkoutStreak } from '@/lib/data';

export default async function HealthPage() {
  const [{ settings }, weekEntries, symptoms] = await Promise.all([
    getCoreData(),
    getWeekEntries(new Date()),
    getSymptoms()
  ]);
  const streak = await getWorkoutStreak(settings.gymTargetSessions);

  const weeklySessions = weekEntries.filter((entry) => entry.category === TimeCategory.WORKOUT).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Target Sessions / Week</p>
          <p className="text-3xl font-bold text-slate-900">{settings.gymTargetSessions}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Sessions This Week</p>
          <p className="text-3xl font-bold text-slate-900">{weeklySessions}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Weekly Goal Streak</p>
          <p className="text-3xl font-bold text-slate-900">{streak} wk</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Quick Workout Log">
          <form action={addTimeEntryAction} className="space-y-3">
            <input type="hidden" name="category" value="WORKOUT" />
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Minutes
              <input type="number" name="minutes" min={1} defaultValue={45} required />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Note
              <input name="note" placeholder="Leg day / cardio / etc." />
            </label>
            <button type="submit" className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white">
              Log Workout
            </button>
          </form>
        </Card>

        <Card title="Symptom Log">
          <form action={logSymptomAction} className="space-y-3">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Date
              <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required />
            </label>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="tremor" className="h-4 w-4" /> Tremor
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="tingling" className="h-4 w-4" /> Tingling
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="cramps" className="h-4 w-4" /> Cramps
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="fatigue" className="h-4 w-4" /> Fatigue
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Note
              <textarea name="note" rows={2} placeholder="Optional context" />
            </label>
            <button type="submit" className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white">
              Save Symptom Entry
            </button>
          </form>
        </Card>
      </div>

      <Card title="Symptom Trend List">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Flags</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.map((entry) => {
                const flags = [
                  entry.tremor ? 'Tremor' : null,
                  entry.tingling ? 'Tingling' : null,
                  entry.cramps ? 'Cramps' : null,
                  entry.fatigue ? 'Fatigue' : null
                ]
                  .filter(Boolean)
                  .join(', ');

                return (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 text-slate-700">{entry.date.toLocaleDateString()}</td>
                    <td className="py-2 pr-3 text-slate-700">{flags || '-'}</td>
                    <td className="py-2 text-slate-700">{entry.note ?? '-'}</td>
                  </tr>
                );
              })}
              {symptoms.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-3 text-slate-500">
                    No symptom entries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
