import { createTaskAction, deleteTaskAction, updateTaskStatusAction } from '@/app/actions';
import { Card } from '@/components/Card';
import { formatDateInput } from '@/lib/date';
import { TaskStatus } from '@/lib/domain';
import { getAllTasks, getOpenTaskByUrgency } from '@/lib/data';

function statusBadge(status: string): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-slate-100 text-slate-700';
    case TaskStatus.DOING:
      return 'bg-amber-100 text-amber-800';
    case TaskStatus.DONE:
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export default async function SchoolPage() {
  const [tasks, nextAction] = await Promise.all([getAllTasks(), getOpenTaskByUrgency()]);

  const suggestedBlock = nextAction
    ? Math.min(50, Math.max(25, nextAction.estimatedMinutes))
    : 25;

  return (
    <div className="space-y-4">
      <Card title="Next Action Generator">
        {nextAction ? (
          <p className="text-sm text-slate-700">
            Highest urgency: <span className="font-semibold">{nextAction.title}</span> ({nextAction.course} /{' '}
            {nextAction.module}). Suggested block: <span className="font-semibold">{suggestedBlock} minutes</span>.
          </p>
        ) : (
          <p className="text-sm text-slate-700">No open tasks. Add a task to generate your next action.</p>
        )}
      </Card>

      <Card title="Add MBA Task">
        <form action={createTaskAction} className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Title
            <input name="title" required />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Course
            <input name="course" placeholder="MBA-540" required />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Module
            <input name="module" placeholder="Module 5" required />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Due Date
            <input name="dueDate" type="date" defaultValue={formatDateInput(new Date())} required />
          </label>
          <label className="md:col-span-2 flex flex-col gap-1 text-sm text-slate-700">
            Rubric Checklist
            <textarea name="rubricChecklist" rows={2} placeholder="Checklist points" required />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Estimated Minutes
            <input name="estimatedMinutes" type="number" min={25} defaultValue={45} required />
          </label>
          <div className="flex items-end">
            <button type="submit" className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white">
              Create Task
            </button>
          </div>
        </form>
      </Card>

      <Card title="Task Tracker">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-3">Task</th>
                <th className="py-2 pr-3">Course / Module</th>
                <th className="py-2 pr-3">Due</th>
                <th className="py-2 pr-3">Checklist</th>
                <th className="py-2 pr-3">Estimate</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b align-top last:border-0">
                  <td className="py-2 pr-3 font-medium text-slate-900">{task.title}</td>
                  <td className="py-2 pr-3 text-slate-700">
                    {task.course} / {task.module}
                  </td>
                  <td className="py-2 pr-3 text-slate-700">{task.dueDate.toLocaleDateString()}</td>
                  <td className="py-2 pr-3 text-slate-700">{task.rubricChecklist}</td>
                  <td className="py-2 pr-3 text-slate-700">{task.estimatedMinutes} min</td>
                  <td className="py-2 pr-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-col gap-2">
                      <form action={updateTaskStatusAction} className="flex gap-2">
                        <input type="hidden" name="id" value={task.id} />
                        <select name="status" defaultValue={task.status}>
                          <option value="TODO">TODO</option>
                          <option value="DOING">DOING</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-white"
                        >
                          Update
                        </button>
                      </form>
                      <form action={deleteTaskAction}>
                        <input type="hidden" name="id" value={task.id} />
                        <button
                          type="submit"
                          className="rounded-md bg-rose-600 px-3 py-2 text-xs font-medium text-white"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-3 text-slate-500">
                    No tasks yet.
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
