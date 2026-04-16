function nowIso() {
  return new Date().toISOString();
}

function uid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeText(value, max = 120, fallback = "") {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, max) : fallback;
}

function sanitizeStatus(value) {
  return ["todo", "doing", "done"].includes(value) ? value : "todo";
}

export function sanitizeTaskInput(payload) {
  const dueDate = sanitizeText(payload.dueDate, 20, new Date().toISOString().slice(0, 10));
  return {
    title: sanitizeText(payload.title, 120, "Untitled Task"),
    course: sanitizeText(payload.course, 40, "MBA"),
    module: sanitizeText(payload.module, 40, "Module"),
    dueDate,
    estimatedMinutes: Math.max(1, Math.round(Number(payload.estimatedMinutes) || 30)),
    rubricChecklist: sanitizeText(payload.rubricChecklist, 220, "Review rubric"),
    status: sanitizeStatus(payload.status || "todo"),
  };
}

export function createTask(store, payload) {
  const safe = sanitizeTaskInput(payload);

  const task = {
    id: uid(),
    ...safe,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  store.setState((draft) => {
    draft.tasks.push(task);
    return draft;
  });

  return task;
}

export function updateTask(store, taskId, patch) {
  let updated = null;

  store.setState((draft) => {
    draft.tasks = draft.tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const next = {
        ...task,
        ...sanitizeTaskInput({ ...task, ...patch }),
        updatedAt: nowIso(),
      };
      updated = next;
      return next;
    });

    return draft;
  });

  return updated;
}

export function setTaskStatus(store, taskId, status) {
  return updateTask(store, taskId, { status: sanitizeStatus(status) });
}

export function deleteTask(store, taskId) {
  store.setState((draft) => {
    draft.tasks = draft.tasks.filter((task) => task.id !== taskId);
    return draft;
  });
}

export function getTaskById(tasks, taskId) {
  return tasks.find((task) => task.id === taskId) || null;
}

export function getTaskCourses(tasks) {
  return Array.from(new Set(tasks.map((task) => task.course).filter(Boolean))).sort();
}

function taskUrgencyScore(task, now = Date.now()) {
  const dueMs = Math.max(1, new Date(task.dueDate).getTime() - now);
  const statusWeight = task.status === "doing" ? 1.1 : task.status === "todo" ? 1 : 0.4;
  const minutesWeight = Math.max(0.3, Math.min(3, task.estimatedMinutes / 45));
  return statusWeight * (minutesWeight + 5_000_000 / dueMs);
}

export function getNextAction(tasks) {
  const candidates = tasks.filter((task) => task.status !== "done");
  if (candidates.length === 0) {
    return null;
  }

  const best = candidates
    .map((task) => ({ task, urgency: taskUrgencyScore(task) }))
    .sort((a, b) => b.urgency - a.urgency)[0]?.task;

  if (!best) {
    return null;
  }

  return {
    task: best,
    suggestedMinutes: Math.max(25, Math.min(50, Math.round(best.estimatedMinutes))),
  };
}

export function filterAndSortTasks(tasks, filters = {}) {
  const now = new Date();
  const dueSoonLimit = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return tasks
    .filter((task) => {
      if (filters.status && filters.status !== "all" && task.status !== filters.status) {
        return false;
      }
      if (filters.course && filters.course !== "all" && task.course !== filters.course) {
        return false;
      }
      if (filters.timeline === "dueSoon" && new Date(task.dueDate) > dueSoonLimit) {
        return false;
      }
      if (filters.timeline === "overdue" && new Date(task.dueDate) >= now) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        const order = { todo: 0, doing: 1, done: 2 };
        return order[a.status] - order[b.status];
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
}

export function getSchoolPriorityText(tasks) {
  const next = getNextAction(tasks);
  if (!next) {
    return "No open MBA tasks. Add one to generate your next action.";
  }
  const due = new Date(next.task.dueDate);
  return `Next: ${next.task.title} (${next.task.course}) due ${due.toLocaleDateString()} - block ${next.suggestedMinutes} min.`;
}
