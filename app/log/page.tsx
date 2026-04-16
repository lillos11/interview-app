import { addTimeEntryAction } from '@/app/actions';
import { Card } from '@/components/Card';
import { FellowshipTimer } from '@/components/FellowshipTimer';
import { TimeCategory } from '@/lib/domain';
import { getWeekEntries } from '@/lib/data';

function categoryLabel(category: string): string {
  switch (category) {
    case TimeCategory.FELLOWSHIP:
      return 'Fellowship';
    case TimeCategory.STUDY:
      return 'Study';
    case TimeCategory.WORKOUT:
      return 'Workout';
    default:
      return category;
  }
}

export default async function LogPage() {
  const entries = await getWeekEntries(new Date());

  const summary = {
    fellowship: entries
      .filter((entry) => entry.category === TimeCategory.FELLOWSHIP)
      .reduce((sum, entry) => sum + entry.minutes, 0),
    study: entries
      .filter((entry) => entry.category === TimeCategory.STUDY)
      .reduce((sum, entry) => sum + entry.minutes, 0),
    workout: entries
      .filter((entry) => entry.category === TimeCategory.WORKOUT)
      .reduce((sum, entry) => sum + entry.minutes, 0)
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Fellowship Timer">
          <FellowshipTimer />
        </Card>

        <Card title="Manual Time Entry">
          <div className="space-y-3">
            <form action={addTimeEntryAction} className="space-y-2 rounded-lg border border-slate-200 p-3">
              <h3 className="font-medium text-slate-900">Log Study</h3>
              <input type="hidden" name="category" value="STUDY" />
              <label className="block text-xs text-slate-600" htmlFor="study-minutes">
                Minutes
              </label>
              <input id="study-minutes" type="number" name="minutes" min={1} defaultValue={30} required />
              <input name="note" placeholder="Optional note" />
              <button type="submit" className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white">
                Save Study
              </button>
            </form>

            <form action={addTimeEntryAction} className="space-y-2 rounded-lg border border-slate-200 p-3">
              <h3 className="font-medium text-slate-900">Log Workout</h3>
              <input type="hidden" name="category" value="WORKOUT" />
              <label className="block text-xs text-slate-600" htmlFor="workout-minutes">
                Minutes
              </label>
              <input id="workout-minutes" type="number" name="minutes" min={1} defaultValue={45} required />
              <input name="note" placeholder="Workout details" />
              <button type="submit" className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white">
                Save Workout
              </button>
            </form>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Fellowship (weekly)</p>
          <p className="text-2xl font-bold text-slate-900">{summary.fellowship} min</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Study (weekly)</p>
          <p className="text-2xl font-bold text-slate-900">{summary.study} min</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Workout (weekly)</p>
          <p className="text-2xl font-bold text-slate-900">{summary.workout} min</p>
        </Card>
      </div>

      <Card title="This Week Entries">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Minutes</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0">
                  <td className="py-2 pr-3 text-slate-700">{entry.dateTime.toLocaleString()}</td>
                  <td className="py-2 pr-3 font-medium text-slate-800">{categoryLabel(entry.category)}</td>
                  <td className="py-2 pr-3 text-slate-700">{entry.minutes}</td>
                  <td className="py-2 text-slate-700">{entry.note ?? '-'}</td>
                </tr>
              ))}
              {entries.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={4}>
                    No entries logged this week.
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
