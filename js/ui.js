import { allocateWeek, compareScenarios, deriveFinanceInput, usd } from "./finance.js";
import {
  buildTodayTimeline,
  createTimeEntriesCsv,
  createTimeEntry,
  deleteTimeEntry,
  downloadCsv,
  formatDate,
  formatDateTime,
  getRemainingWindows,
  getTimerSnapshot,
  getWeekStart,
  pauseTimer,
  resetTimer,
  startTimer,
  stopTimerAndCreateEntry,
  summarizeWeekly,
} from "./time.js";
import {
  createTask,
  deleteTask,
  filterAndSortTasks,
  getNextAction,
  getSchoolPriorityText,
  getTaskById,
  getTaskCourses,
  setTaskStatus,
  updateTask,
} from "./tasks.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function text(value, max = 180) {
  return String(value || "").trim().slice(0, max);
}

function signedMoney(value) {
  const amount = Number(value) || 0;
  return `${amount >= 0 ? "+" : "-"}${usd.format(Math.abs(amount))}`;
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function openFileDownload(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function computeGymStreak(state) {
  const target = Number(state.settings.targets.gymSessions) || 0;
  if (target <= 0) return 0;

  const workouts = state.timeEntries.filter((entry) => entry.category === "WORKOUT");
  const counts = new Map();

  workouts.forEach((entry) => {
    const key = getWeekStart(entry.dateTime, state.settings.weekStart).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  let streak = 0;
  let cursor = getWeekStart(new Date(), state.settings.weekStart);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    const count = counts.get(key) || 0;
    if (count >= target) {
      streak += 1;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 7);
    } else {
      break;
    }
  }

  return streak;
}

function symptomCounts(symptoms, days) {
  const now = new Date();
  const limit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return symptoms.filter((item) => new Date(item.date) >= limit).length;
}

function createElRefs() {
  return {
    routeView: document.getElementById("route-view"),
    navLinks: [...document.querySelectorAll(".nav-link")],
    sideLinks: [...document.querySelectorAll(".side-link")],
    bottomLinks: [...document.querySelectorAll(".bottom-link")],
    sidebarTip: document.getElementById("sidebar-tip"),
    quickAddBtn: document.getElementById("quick-add-btn"),
    quickAddModal: document.getElementById("quick-add-modal"),
    quickAddType: document.getElementById("quick-add-type"),
    quickAddForm: document.getElementById("quick-add-form"),
    confirmModal: document.getElementById("confirm-modal"),
    confirmMessage: document.getElementById("confirm-message"),
    confirmOk: document.getElementById("confirm-ok"),
    timerStopModal: document.getElementById("timer-stop-modal"),
    timerStopForm: document.getElementById("timer-stop-form"),
    timerStopSummary: document.getElementById("timer-stop-summary"),
    themeToggle: document.getElementById("theme-toggle"),
    installBtn: document.getElementById("install-btn"),
    toastRegion: document.getElementById("toast-region"),
  };
}

export function createUI({ store, router }) {
  const refs = createElRefs();
  const stateful = {
    route: "dashboard",
    moneyScenario: {
      fellowshipHours: num(store.getState().settings.income.fellowshipHours, 30),
      otHours: num(store.getState().settings.income.otHours, 0),
    },
    schoolFilters: {
      status: "all",
      course: "all",
      timeline: "all",
    },
    schoolEditingTaskId: null,
    healthSymptomFilter: "30",
    confirmAction: null,
    timerTick: null,
    installPromptEvent: null,
  };

  const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentState() {
    return store.getState();
  }

  function toast(message, type = "success") {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    refs.toastRegion.appendChild(item);
    setTimeout(() => {
      item.remove();
    }, 3400);
  }

  function openModal(modal) {
    modal.classList.remove("hidden");
    const first = modal.querySelector("input, select, textarea, button");
    if (first) first.focus();
  }

  function closeModal(modal) {
    modal.classList.add("hidden");
  }

  function closeAllModals() {
    closeModal(refs.quickAddModal);
    closeModal(refs.confirmModal);
    closeModal(refs.timerStopModal);
  }

  function setFeedback(scope, message, isError = false) {
    const node = refs.routeView.querySelector(`[data-feedback="${scope}"]`);
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("error", isError);
  }

  function updateNavActive(route) {
    const all = [...refs.navLinks, ...refs.sideLinks, ...refs.bottomLinks];
    all.forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const actual = theme === "system" ? (mediaDark.matches ? "dark" : "light") : theme;
    root.dataset.theme = actual;

    const iconUse = refs.themeToggle.querySelector("use");
    if (iconUse) {
      iconUse.setAttribute("href", actual === "dark" ? "#i-sun" : "#i-moon");
    }

    refs.themeToggle.title = `Theme: ${theme}. Click to change`;
  }

  function cycleTheme() {
    const state = currentState();
    const current = state.settings.theme;
    const next = current === "system" ? "dark" : current === "dark" ? "light" : "system";

    store.setState((draft) => {
      draft.settings.theme = next;
      return draft;
    });

    applyTheme(next);
    toast(`Theme set to ${next}`);
  }

  function setSidebarTip(textValue) {
    if (!refs.sidebarTip) return;
    const p = refs.sidebarTip.querySelector("p:last-child");
    if (p) {
      p.textContent = textValue;
    }
  }

  function renderDashboard() {
    const state = currentState();
    const now = new Date();

    const weekly = summarizeWeekly(state.timeEntries, now, state.settings.weekStart);
    const financeInput = deriveFinanceInput(state);
    const financeResult = allocateWeek(financeInput, {
      fellowshipHours: num(state.settings.income.fellowshipHours, 30),
      otHours: num(state.settings.income.otHours, 0),
      referenceDate: now,
    });

    const timeline = buildTodayTimeline(state.settings, now);
    const windows = getRemainingWindows(timeline, now);

    const nextAction = getNextAction(state.tasks);

    const weekStart = getWeekStart(now, state.settings.weekStart);
    const weekElapsedRatio = clamp((now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000), 0, 1);
    const fellowshipTargetHours = num(state.settings.targets.fellowshipHours, 0);
    const expectedFellowship = fellowshipTargetHours * weekElapsedRatio;
    const actualFellowship = weekly.totals.fellowship / 60;
    const fellowshipDelta = actualFellowship - expectedFellowship;

    let moneyPriority = financeResult.flags.offTrack
      ? `Off track by ${usd.format(financeResult.flags.gap)} this week.`
      : `Surplus ${usd.format(financeResult.summary.surplus)}. Keep allocations consistent.`;

    if (fellowshipDelta < -0.1) {
      moneyPriority = `Behind fellowship pace by ${Math.abs(fellowshipDelta).toFixed(1)}h.`;
    }

    const schoolPriority = getSchoolPriorityText(state.tasks);

    const todayWorkouts = weekly.totals.gymSessions;
    const targetGym = num(state.settings.targets.gymSessions, 0);
    const healthPriority =
      todayWorkouts < targetGym
        ? `Log ${Math.max(0, targetGym - todayWorkouts)} more workout session(s) this week.`
        : "Gym target on pace. Keep recovery and mobility routine.";

    const progress = [
      {
        label: "Fellowship hours",
        current: (weekly.totals.fellowship / 60).toFixed(1),
        target: fellowshipTargetHours.toFixed(1),
        unit: "h",
        pct: clamp((weekly.totals.fellowship / 60 / Math.max(fellowshipTargetHours, 0.1)) * 100, 0, 100),
      },
      {
        label: "Study minutes",
        current: weekly.totals.study,
        target: num(state.settings.targets.studyMinutes, 0),
        unit: "min",
        pct: clamp((weekly.totals.study / Math.max(num(state.settings.targets.studyMinutes, 1), 1)) * 100, 0, 100),
      },
      {
        label: "Gym sessions",
        current: weekly.totals.gymSessions,
        target: targetGym,
        unit: "sessions",
        pct: clamp((weekly.totals.gymSessions / Math.max(targetGym, 1)) * 100, 0, 100),
      },
    ];

    setSidebarTip(moneyPriority);

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">Today Command</h2>
          <p class="route-description">${formatDate(now, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</p>
        </div>
        <span class="pill">${financeResult.summary.onTrack ? "ON TRACK" : "OFF TRACK"}</span>
      </header>

      <section class="row-kpis">
        <article class="kpi-card">
          <p class="kpi-label">Net weekly income</p>
          <p class="kpi">${usd.format(financeResult.summary.netIncome)}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-label">Essentials</p>
          <p class="kpi">${usd.format(financeResult.summary.essentials)}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-label">Surplus</p>
          <p class="kpi ${financeResult.summary.surplus >= 0 ? "good" : "bad"}">${usd.format(
      financeResult.summary.surplus
    )}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-label">Next school block</p>
          <p class="kpi">${nextAction ? `${nextAction.suggestedMinutes} min` : "25 min"}</p>
        </article>
      </section>

      <section class="cards-grid">
        <article class="card" style="grid-column: span 7;">
          <h3>Today Timeline</h3>
          <p class="card-subtitle">Work template + suggested focus blocks.</p>
          ${
            timeline.length
              ? `<ul class="timeline">${timeline
                  .map(
                    (item) => `<li class="timeline-item"><strong>${escapeHtml(item.label)}</strong><span class="meta">${
                      item.start
                    } - ${item.end}</span></li>`
                  )
                  .join("")}</ul>`
              : `<div class="empty-state">No timeline configured yet. Set schedule details in Settings.</div>`
          }

          <h4 style="margin-top: 1rem;">Remaining windows today</h4>
          ${
            windows.length
              ? `<ul class="clean-list list-muted">${windows
                  .map((window) => `<li>${window.start} - ${window.end} (${window.minutes} min free)</li>`)
                  .join("")}</ul>`
              : `<div class="empty-state">No major windows left today. Use a 15-minute recovery reset.</div>`
          }
        </article>

        <article class="card" style="grid-column: span 5;">
          <h3>Top 3 Priorities</h3>
          <ul class="stat-list">
            <li><strong>Money:</strong> ${escapeHtml(moneyPriority)}</li>
            <li><strong>School:</strong> ${escapeHtml(schoolPriority)}</li>
            <li><strong>Health:</strong> ${escapeHtml(healthPriority)}</li>
          </ul>

          <h4 style="margin-top: 1rem;">Quick actions</h4>
          <div class="inline-actions">
            <button class="btn btn-primary" data-action="start-fellowship">Start Fellowship Timer</button>
            <button class="btn" data-action="quick-study" data-minutes="30">Log Study</button>
            <button class="btn" data-action="quick-workout" data-minutes="45">Log Workout</button>
            <button class="btn" data-action="open-quick-task">Add MBA Task</button>
          </div>
        </article>
      </section>

      <section class="card route-section">
        <h3>Weekly Progress</h3>
        <ul class="progress-list">
          ${progress
            .map(
              (row) => `
            <li class="progress-row">
              <div class="progress-head"><span>${row.label}</span><span>${row.current} / ${row.target} ${row.unit}</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${row.pct.toFixed(1)}%"></div></div>
            </li>
          `
            )
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderLog() {
    const state = currentState();
    const weekly = summarizeWeekly(state.timeEntries, new Date(), state.settings.weekStart);
    const timer = getTimerSnapshot(state);

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">Time Logging</h2>
          <p class="route-description">Fellowship timer + manual entries + weekly reports.</p>
        </div>
        <button class="btn" data-action="export-csv">Export CSV</button>
      </header>

      <section class="split">
        <article class="card route-section">
          <h3>Fellowship Timer</h3>
          <p class="kpi" id="timer-live">${timer.display}</p>
          <p class="helper">State survives refresh. Stop prompts note + category before save.</p>
          <div class="inline-actions">
            <button class="btn btn-primary" data-action="timer-start">Start</button>
            <button class="btn" data-action="timer-pause">Pause</button>
            <button class="btn" data-action="timer-reset">Reset</button>
            <button class="btn" data-action="timer-stop">Stop & Save</button>
          </div>
          <p class="helper" data-feedback="timer">${timer.running ? "Timer running..." : "Timer idle."}</p>
        </article>

        <article class="card route-section">
          <h3>Manual Time Logs</h3>
          <form class="form-grid cols-2" data-form="manual-time" novalidate>
            <label>
              Category
              <select name="category">
                <option value="STUDY">Study</option>
                <option value="WORKOUT">Workout</option>
                <option value="FELLOWSHIP">Fellowship</option>
              </select>
            </label>
            <label>
              Minutes
              <input name="minutes" type="number" min="1" value="30" required />
            </label>
            <label>
              Date
              <input name="date" type="date" value="${getTodayIso()}" required />
            </label>
            <label>
              Note
              <input name="note" type="text" maxlength="180" placeholder="Optional note" />
            </label>
            <div class="inline-actions" style="grid-column: 1/-1;">
              <button class="btn btn-primary" type="submit">Save Time Entry</button>
              <p class="helper" data-feedback="manual-time"></p>
            </div>
          </form>

          <form class="form-grid cols-2" data-form="symptom-quick" novalidate>
            <label>
              Symptom Date
              <input name="date" type="date" value="${getTodayIso()}" required />
            </label>
            <label>
              Note
              <input name="note" type="text" maxlength="180" placeholder="Optional symptom note" />
            </label>
            <label><input type="checkbox" name="tremor" /> Tremor</label>
            <label><input type="checkbox" name="tingling" /> Tingling</label>
            <label><input type="checkbox" name="cramps" /> Cramps</label>
            <label><input type="checkbox" name="fatigue" /> Fatigue</label>
            <div class="inline-actions" style="grid-column: 1/-1;">
              <button class="btn" type="submit">Save Symptom Log</button>
              <p class="helper" data-feedback="symptom-quick"></p>
            </div>
          </form>
        </article>
      </section>

      <section class="row-kpis">
        <article class="kpi-card"><p class="kpi-label">Fellowship</p><p class="kpi">${weekly.totals.fellowship} min</p></article>
        <article class="kpi-card"><p class="kpi-label">Study</p><p class="kpi">${weekly.totals.study} min</p></article>
        <article class="kpi-card"><p class="kpi-label">Workout</p><p class="kpi">${weekly.totals.workout} min</p></article>
        <article class="kpi-card"><p class="kpi-label">Gym Sessions</p><p class="kpi">${weekly.totals.gymSessions}</p></article>
      </section>

      <section class="card route-section">
        <h3>Daily Breakdown (This Week)</h3>
        ${
          weekly.daily.length
            ? `<ul class="clean-list list-muted">${weekly.daily
                .map(
                  (item) =>
                    `<li>${item.day} • ${item.category} • ${item.minutes} min${
                      item.note ? ` • ${escapeHtml(item.note)}` : ""
                    }</li>`
                )
                .join("")}</ul>`
            : `<div class="empty-state">No entries yet this week. Start with one focus block.</div>`
        }
      </section>

      <section class="card route-section">
        <h3>Time Entries</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Category</th><th>Minutes</th><th>Note</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${
                state.timeEntries.length
                  ? state.timeEntries
                      .slice()
                      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                      .map(
                        (entry) => `
                      <tr>
                        <td>${formatDateTime(entry.dateTime)}</td>
                        <td>${entry.category}</td>
                        <td>${entry.minutes}</td>
                        <td>${escapeHtml(entry.note || "-")}</td>
                        <td><button class="btn btn-ghost" data-action="delete-time" data-id="${entry.id}">Delete</button></td>
                      </tr>
                    `
                      )
                      .join("")
                  : `<tr><td colspan="5"><div class="empty-state">No entries yet. Use timer or manual log to begin.</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    `;

    startOrStopTimerTick();
  }

  function renderMoney() {
    const state = currentState();
    const input = deriveFinanceInput(state);

    const base = allocateWeek(input, {
      fellowshipHours: num(state.settings.income.fellowshipHours, 30),
      otHours: num(state.settings.income.otHours, 0),
      referenceDate: new Date(),
    });

    const scenario = allocateWeek(input, {
      fellowshipHours: stateful.moneyScenario.fellowshipHours,
      otHours: stateful.moneyScenario.otHours,
      referenceDate: new Date(),
    });

    const delta = compareScenarios(base, scenario);

    const bucketRows = [
      {
        label: "Uber Buffer",
        current: input.buckets.uber.balance,
        target: input.essentials.uberWeekly,
      },
      {
        label: "Emergency Starter",
        current: input.buckets.emergency.balance,
        target: input.buckets.emergency.target,
      },
      {
        label: "Tuition Fund",
        current: input.buckets.tuition.balance,
        target: input.tuition.amountDue,
      },
      {
        label: "Goal Savings",
        current: input.buckets.goal.balance,
        target: Math.max(input.buckets.goal.balance + 1, 1000),
      },
    ];

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">Money Command Center</h2>
          <p class="route-description">Cashflow + dual-track savings + debt payoff projection engine.</p>
        </div>
        <span class="pill">${scenario.flags.offTrack ? "OFF TRACK" : "ON TRACK"}</span>
      </header>

      <section class="card route-section">
        <h3>Scenario Toggles</h3>
        <div class="inline-actions">
          ${[25, 30, 35]
            .map(
              (hours) =>
                `<button class="btn ${
                  stateful.moneyScenario.fellowshipHours === hours ? "btn-primary" : ""
                }" data-action="set-scenario-fellowship" data-hours="${hours}">${hours} Fellowship Hrs</button>`
            )
            .join("")}
          ${[0, 5, 10]
            .map(
              (ot) =>
                `<button class="btn ${
                  stateful.moneyScenario.otHours === ot ? "btn-primary" : ""
                }" data-action="set-scenario-ot" data-ot="${ot}">${ot} OT Hrs</button>`
            )
            .join("")}
        </div>
        <p class="helper">Recomputes instantly with delta comparisons.</p>
      </section>

      <section class="row-kpis">
        <article class="kpi-card"><p class="kpi-label">Net Income</p><p class="kpi">${usd.format(
          scenario.summary.netIncome
        )}</p></article>
        <article class="kpi-card"><p class="kpi-label">Essentials</p><p class="kpi">${usd.format(
          scenario.summary.essentials
        )}</p></article>
        <article class="kpi-card"><p class="kpi-label">Surplus</p><p class="kpi ${
          scenario.summary.surplus >= 0 ? "good" : "bad"
        }">${usd.format(scenario.summary.surplus)}</p></article>
        <article class="kpi-card"><p class="kpi-label">Track</p><p class="kpi ${
          scenario.flags.offTrack ? "bad" : "good"
        }">${scenario.flags.offTrack ? "Off Track" : "On Track"}</p></article>
      </section>

      ${
        scenario.flags.offTrack
          ? `<section class="card route-section"><h3>Off Track Gap</h3><p class="kpi bad">${usd.format(
              scenario.flags.gap
            )}</p><ul class="clean-list list-muted">${scenario.suggestions
              .map(
                (s) => `<li>${escapeHtml(s.label)}: ${signedMoney(s.deltaSurplus)} impact, resulting ${usd.format(
                  s.resultingSurplus
                )}</li>`
              )
              .join("")}</ul></section>`
          : ""
      }

      <section class="split">
        <article class="card route-section">
          <h3>Waterfall Allocation</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Step</th><th>Required</th><th>Allocated</th><th>Status</th></tr></thead>
              <tbody>
                ${scenario.steps
                  .map(
                    (step) => `<tr>
                      <td>${escapeHtml(step.label)}</td>
                      <td>${usd.format(step.required)}</td>
                      <td>${usd.format(step.allocated)}</td>
                      <td><span class="badge ${
                        step.status === "funded" ? "done" : step.status === "partial" ? "doing" : "todo"
                      }">${step.status.toUpperCase()}</span></td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <h4 style="margin-top:1rem;">Projections</h4>
          <ul class="clean-list list-muted">
            <li>Debt payoff: ${scenario.projections.debtPayoffDate || "Not projected"}</li>
            <li>Emergency $1000: ${scenario.projections.emergencyTargetDate || "Not projected"}</li>
            <li>Tuition target: ${scenario.projections.tuitionTargetDate || "Not projected"}</li>
            <li>Tuition by due week: ${scenario.projections.tuitionFundedByDueWeek ? "Likely" : "At risk"}</li>
          </ul>
        </article>

        <article class="card route-section">
          <h3>Bucket Progress</h3>
          <ul class="progress-list">
            ${bucketRows
              .map((row) => {
                const pct = clamp((row.current / Math.max(row.target, 1)) * 100, 0, 100);
                return `<li class="progress-row">
                  <div class="progress-head"><span>${row.label}</span><span>${usd.format(row.current)} / ${usd.format(
                  row.target
                )}</span></div>
                  <div class="progress-track"><div class="progress-fill" style="width:${pct.toFixed(1)}%"></div></div>
                </li>`;
              })
              .join("")}
          </ul>

          <h4 style="margin-top:1rem;">What changed vs current settings</h4>
          <ul class="clean-list list-muted">
            <li>Surplus: ${signedMoney(delta.surplusDelta)}</li>
            <li>Net income: ${signedMoney(delta.netIncomeDelta)}</li>
            <li>Extra debt: ${signedMoney(delta.debtExtraDelta)}</li>
            <li>Goal savings: ${signedMoney(delta.goalSavingsDelta)}</li>
            <li>Emergency deposit: ${signedMoney(delta.emergencyDelta)}</li>
            <li>Tuition deposit: ${signedMoney(delta.tuitionDelta)}</li>
          </ul>
        </article>
      </section>
    `;
  }

  function renderSchool() {
    const state = currentState();
    const filters = stateful.schoolFilters;
    const nextAction = getNextAction(state.tasks);
    const courses = getTaskCourses(state.tasks);
    const tasks = filterAndSortTasks(state.tasks, filters);
    const editingTask = stateful.schoolEditingTaskId ? getTaskById(state.tasks, stateful.schoolEditingTaskId) : null;

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">School Tasks</h2>
          <p class="route-description">MBA task command board with urgency-aware next action.</p>
        </div>
      </header>

      <section class="card route-section">
        <h3>Next Action</h3>
        <p class="card-subtitle">${escapeHtml(getSchoolPriorityText(state.tasks))}</p>
        ${
          nextAction
            ? `<div class="inline-actions">
                <button class="btn btn-primary" data-action="start-task-timer" data-id="${nextAction.task.id}">Start ${nextAction.suggestedMinutes}m Study Timer</button>
              </div>`
            : ""
        }
      </section>

      <section class="split">
        <article class="card route-section">
          <h3>${editingTask ? "Edit Task" : "Add Task"}</h3>
          <form class="form-grid cols-2" data-form="task-editor" novalidate>
            <input type="hidden" name="taskId" value="${editingTask ? editingTask.id : ""}" />
            <label>Title<input name="title" type="text" maxlength="120" value="${
              editingTask ? escapeHtml(editingTask.title) : ""
            }" required /></label>
            <label>Course<input name="course" type="text" maxlength="40" value="${
              editingTask ? escapeHtml(editingTask.course) : "MBA"
            }" required /></label>
            <label>Module<input name="module" type="text" maxlength="40" value="${
              editingTask ? escapeHtml(editingTask.module) : "Module"
            }" required /></label>
            <label>Due Date<input name="dueDate" type="date" value="${
              editingTask ? editingTask.dueDate : getTodayIso()
            }" required /></label>
            <label>Estimated Minutes<input name="estimatedMinutes" type="number" min="25" value="${
              editingTask ? editingTask.estimatedMinutes : 45
            }" required /></label>
            <label>Status
              <select name="status">
                <option value="todo" ${editingTask?.status === "todo" ? "selected" : ""}>Todo</option>
                <option value="doing" ${editingTask?.status === "doing" ? "selected" : ""}>Doing</option>
                <option value="done" ${editingTask?.status === "done" ? "selected" : ""}>Done</option>
              </select>
            </label>
            <label style="grid-column:1/-1;">Rubric Checklist<textarea name="rubricChecklist" rows="3" maxlength="220" required>${
              editingTask ? escapeHtml(editingTask.rubricChecklist) : ""
            }</textarea></label>
            <div class="inline-actions" style="grid-column:1/-1;">
              <button class="btn btn-primary" type="submit">${editingTask ? "Update" : "Create"} Task</button>
              ${editingTask ? '<button class="btn" type="button" data-action="cancel-edit-task">Cancel</button>' : ""}
              <p class="helper" data-feedback="task-editor"></p>
            </div>
          </form>
        </article>

        <article class="card route-section">
          <h3>Filters</h3>
          <form class="form-grid cols-3" data-form="task-filters">
            <label>Status
              <select name="status">
                <option value="all" ${filters.status === "all" ? "selected" : ""}>All</option>
                <option value="todo" ${filters.status === "todo" ? "selected" : ""}>Todo</option>
                <option value="doing" ${filters.status === "doing" ? "selected" : ""}>Doing</option>
                <option value="done" ${filters.status === "done" ? "selected" : ""}>Done</option>
              </select>
            </label>
            <label>Course
              <select name="course">
                <option value="all">All Courses</option>
                ${courses
                  .map((course) => `<option value="${escapeHtml(course)}" ${filters.course === course ? "selected" : ""}>${
                    course
                  }</option>`)
                  .join("")}
              </select>
            </label>
            <label>Timeline
              <select name="timeline">
                <option value="all" ${filters.timeline === "all" ? "selected" : ""}>All</option>
                <option value="dueSoon" ${filters.timeline === "dueSoon" ? "selected" : ""}>Due Soon (3d)</option>
                <option value="overdue" ${filters.timeline === "overdue" ? "selected" : ""}>Overdue</option>
              </select>
            </label>
          </form>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Due</th><th>Est.</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                ${
                  tasks.length
                    ? tasks
                        .map(
                          (task) => `
                      <tr>
                        <td>
                          <strong>${escapeHtml(task.title)}</strong><br />
                          <span class="helper">${escapeHtml(task.course)} · ${escapeHtml(task.module)}</span>
                        </td>
                        <td>${formatDate(task.dueDate)}</td>
                        <td>${task.estimatedMinutes} min</td>
                        <td>
                          <select data-action="task-status" data-id="${task.id}">
                            <option value="todo" ${task.status === "todo" ? "selected" : ""}>Todo</option>
                            <option value="doing" ${task.status === "doing" ? "selected" : ""}>Doing</option>
                            <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                          </select>
                        </td>
                        <td>
                          <div class="inline-actions">
                            <button class="btn btn-ghost" data-action="edit-task" data-id="${task.id}">Edit</button>
                            <button class="btn btn-ghost" data-action="start-task-timer" data-id="${task.id}">Timer</button>
                            <button class="btn btn-danger" data-action="delete-task" data-id="${task.id}">Delete</button>
                          </div>
                        </td>
                      </tr>
                    `
                        )
                        .join("")
                    : `<tr><td colspan="5"><div class="empty-state">No tasks in this filter view. Create a focused task with clear rubric checkpoints.</div></td></tr>`
                }
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `;
  }

  function renderHealth() {
    const state = currentState();
    const weekly = summarizeWeekly(state.timeEntries, new Date(), state.settings.weekStart);
    const streak = computeGymStreak(state);
    const filterDays = Number(stateful.healthSymptomFilter);

    const filteredSymptoms =
      filterDays > 0
        ? state.symptoms.filter((item) => new Date(item.date) >= new Date(Date.now() - filterDays * 86400000))
        : state.symptoms;

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">Health</h2>
          <p class="route-description">Gym tracking + symptom awareness with weekly and monthly trends.</p>
        </div>
      </header>

      <section class="row-kpis">
        <article class="kpi-card"><p class="kpi-label">Gym Target</p><p class="kpi">${num(
          state.settings.targets.gymSessions,
          0
        )} / wk</p></article>
        <article class="kpi-card"><p class="kpi-label">Sessions This Week</p><p class="kpi">${weekly.totals.gymSessions}</p></article>
        <article class="kpi-card"><p class="kpi-label">Streak</p><p class="kpi">${streak} week(s)</p></article>
        <article class="kpi-card"><p class="kpi-label">Symptoms (7d / 30d)</p><p class="kpi">${symptomCounts(
          state.symptoms,
          7
        )} / ${symptomCounts(state.symptoms, 30)}</p></article>
      </section>

      <section class="split">
        <article class="card route-section">
          <h3>Log Workout</h3>
          <form class="form-grid cols-2" data-form="health-workout" novalidate>
            <label>Minutes<input name="minutes" type="number" min="1" value="45" required /></label>
            <label>Type<input name="workoutType" type="text" maxlength="60" placeholder="Strength, cardio, mobility" /></label>
            <label>Date<input name="date" type="date" value="${getTodayIso()}" required /></label>
            <label>Note<input name="note" type="text" maxlength="180" placeholder="Optional note" /></label>
            <div class="inline-actions" style="grid-column:1/-1;">
              <button class="btn btn-primary" type="submit">Save Workout</button>
              <p class="helper" data-feedback="health-workout"></p>
            </div>
          </form>
        </article>

        <article class="card route-section">
          <h3>Symptom Log</h3>
          <form class="form-grid cols-2" data-form="health-symptom" novalidate>
            <label>Date<input name="date" type="date" value="${getTodayIso()}" required /></label>
            <label>Note<input name="note" type="text" maxlength="180" placeholder="Optional note" /></label>
            <label><input name="tremor" type="checkbox" /> Tremor</label>
            <label><input name="tingling" type="checkbox" /> Tingling</label>
            <label><input name="cramps" type="checkbox" /> Cramps</label>
            <label><input name="fatigue" type="checkbox" /> Fatigue</label>
            <div class="inline-actions" style="grid-column:1/-1;">
              <button class="btn" type="submit">Save Symptom Entry</button>
              <p class="helper" data-feedback="health-symptom"></p>
            </div>
          </form>
        </article>
      </section>

      <section class="card route-section">
        <h3>Symptom Trend List</h3>
        <div class="inline-actions">
          <label style="max-width:220px;">Filter
            <select data-action="health-symptom-filter">
              <option value="7" ${stateful.healthSymptomFilter === "7" ? "selected" : ""}>Last 7 days</option>
              <option value="30" ${stateful.healthSymptomFilter === "30" ? "selected" : ""}>Last 30 days</option>
              <option value="0" ${stateful.healthSymptomFilter === "0" ? "selected" : ""}>All</option>
            </select>
          </label>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Flags</th><th>Note</th><th>Action</th></tr></thead>
            <tbody>
              ${
                filteredSymptoms.length
                  ? filteredSymptoms
                      .slice()
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((item) => {
                        const flags = [
                          item.tremor ? "Tremor" : "",
                          item.tingling ? "Tingling" : "",
                          item.cramps ? "Cramps" : "",
                          item.fatigue ? "Fatigue" : "",
                        ]
                          .filter(Boolean)
                          .join(", ");

                        return `<tr>
                          <td>${formatDate(item.date)}</td>
                          <td>${flags || "-"}</td>
                          <td>${escapeHtml(item.note || "-")}</td>
                          <td><button class="btn btn-ghost" data-action="delete-symptom" data-id="${item.id}">Delete</button></td>
                        </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="4"><div class="empty-state">No symptom entries in this range. Log only what you notice; no diagnosis here.</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderSettings() {
    const state = currentState();
    const s = state.settings;
    const m = state.money;
    const dayMap = [
      { value: 0, label: "Sun" },
      { value: 1, label: "Mon" },
      { value: 2, label: "Tue" },
      { value: 3, label: "Wed" },
      { value: 4, label: "Thu" },
      { value: 5, label: "Fri" },
      { value: 6, label: "Sat" },
    ];

    refs.routeView.innerHTML = `
      <header class="route-header">
        <div>
          <h2 class="route-title">Settings</h2>
          <p class="route-description">Control schedule, income model, savings rules, debt plan, and backups.</p>
        </div>
      </header>

      <section class="card route-section">
        <form class="form-stack" data-form="settings" novalidate>
          <section class="route-section">
            <h3>Schedule</h3>
            <div class="form-grid cols-4">
              <label>Work Start<input name="workStart" type="time" value="${s.schedule.workStart}" required /></label>
              <label>Work End<input name="workEnd" type="time" value="${s.schedule.workEnd}" required /></label>
             <label>Commute Minutes<input name="commuteMinutes" type="number" min="0" value="${s.schedule.commuteMinutes}" required /></label>
             <label>Week Start
               <select name="weekStart">
                 <option value="sun" ${s.weekStart === "sun" ? "selected" : ""}>Sunday</option>
                 <option value="mon" ${s.weekStart === "mon" ? "selected" : ""}>Monday</option>
               </select>
             </label>
             <label>Fellowship Block (min)<input name="blockFellowship" type="number" min="15" value="${s.schedule.suggestedBlocks.fellowship}" required /></label>
             <label>Study Block (min)<input name="blockStudy" type="number" min="15" value="${s.schedule.suggestedBlocks.study}" required /></label>
             <label>Gym Block (min)<input name="blockGym" type="number" min="15" value="${s.schedule.suggestedBlocks.gym}" required /></label>
             <label>Admin Block (min)<input name="blockAdmin" type="number" min="10" value="${s.schedule.suggestedBlocks.admin}" required /></label>
             <fieldset style="grid-column:1/-1; border:var(--border); border-radius:var(--radius-sm); padding:0.7rem;">
               <legend style="padding:0 0.3rem; color:var(--text-soft); font-size:var(--font-sm);">Work Days</legend>
               <div class="inline-actions">
                 ${dayMap
                   .map(
                     (day) =>
                       `<label style="display:inline-flex;align-items:center;gap:0.35rem;"><input type="checkbox" name="workDays" value="${day.value}" ${
                         s.schedule.workDays.includes(day.value) ? "checked" : ""
                       } /> ${day.label}</label>`
                   )
                   .join("")}
               </div>
             </fieldset>
           </div>
         </section>

          <section class="route-section">
            <h3>Income</h3>
            <div class="form-grid cols-4">
              <label>Amazon Rate<input name="amazonRate" type="number" step="0.01" value="${s.income.amazonRate}" required /></label>
              <label>Amazon Hours<input name="amazonHours" type="number" step="0.1" value="${s.income.amazonHours}" required /></label>
              <label>OT Hours<input name="otHours" type="number" step="0.1" value="${s.income.otHours}" required /></label>
              <label>OT Multiplier<input name="otMultiplier" type="number" step="0.01" value="${s.income.otMultiplier}" required /></label>
              <label>Fellowship Rate<input name="fellowshipRate" type="number" step="0.01" value="${s.income.fellowshipRate}" required /></label>
              <label>Fellowship Hours<input name="fellowshipHours" type="number" step="0.1" value="${s.income.fellowshipHours}" required /></label>
              <label>Fellowship Cap<input name="fellowshipCap" type="number" step="0.1" value="${s.income.fellowshipCap}" required /></label>
            </div>
          </section>

          <section class="route-section">
            <h3>Deductions + Essentials</h3>
            <div class="form-grid cols-4">
              <label>Taxes %<input name="taxesPct" type="number" step="0.1" value="${s.deductions.taxesPct}" required /></label>
              <label>401k %<input name="k401Pct" type="number" step="0.1" value="${s.deductions.k401Pct}" required /></label>
              <label>401k Base
                <select name="k401Base">
                  <option value="gross" ${s.deductions.k401Base === "gross" ? "selected" : ""}>Gross</option>
                  <option value="amazon" ${s.deductions.k401Base === "amazon" ? "selected" : ""}>Amazon only</option>
                </select>
              </label>
              <label>Insurance Weekly<input name="insuranceWeekly" type="number" step="0.01" value="${
                s.deductions.insuranceWeekly
              }" required /></label>
              <label>Other Deductions<input name="otherDeductionsWeekly" type="number" step="0.01" value="${
                s.deductions.otherDeductionsWeekly
              }" required /></label>
              <label>Fixed Bills<input name="fixedBillsWeekly" type="number" step="0.01" value="${
                s.essentials.fixedBillsWeekly
              }" required /></label>
              <label>Food Baseline<input name="foodBaselineWeekly" type="number" step="0.01" value="${
                s.essentials.foodBaselineWeekly
              }" required /></label>
              <label>Uber Weekly<input name="uberWeekly" type="number" step="0.01" value="${
                s.essentials.uberWeekly
              }" required /></label>
            </div>
          </section>

          <section class="route-section">
            <h3>Debt + Tuition + Buckets</h3>
            <div class="form-grid cols-4">
              <label>Debt Balance<input name="debtBalance" type="number" step="0.01" value="${m.debt.balance}" required /></label>
              <label>Debt Weeks Remaining<input name="debtWeeksRemaining" type="number" step="1" value="${
                m.debt.weeksRemaining
              }" required /></label>
              <label>Tuition Amount Due<input name="tuitionAmountDue" type="number" step="0.01" value="${
                m.tuition.amountDue
              }" required /></label>
              <label>Tuition Weeks Until Due<input name="tuitionWeeksUntilDue" type="number" step="1" value="${
                m.tuition.weeksUntilDue
              }" required /></label>
              <label>Uber Bucket Balance<input name="bucketUber" type="number" step="0.01" value="${
                m.buckets.uber.balance
              }" required /></label>
              <label>Emergency Balance<input name="bucketEmergency" type="number" step="0.01" value="${
                m.buckets.emergency.balance
              }" required /></label>
              <label>Emergency Target<input name="bucketEmergencyTarget" type="number" step="0.01" value="${
                m.buckets.emergency.target
              }" required /></label>
              <label>Tuition Balance<input name="bucketTuition" type="number" step="0.01" value="${
                m.buckets.tuition.balance
              }" required /></label>
              <label>Tuition Target<input name="bucketTuitionTarget" type="number" step="0.01" value="${
                m.buckets.tuition.target
              }" required /></label>
              <label>Goal Savings Balance<input name="bucketGoal" type="number" step="0.01" value="${
                m.buckets.goal.balance
              }" required /></label>
              <label>Fellowship Target Hours<input name="targetFellowship" type="number" step="0.1" value="${
                s.targets.fellowshipHours
              }" required /></label>
              <label>Study Target Minutes<input name="targetStudy" type="number" step="1" value="${
                s.targets.studyMinutes
              }" required /></label>
              <label>Gym Target Sessions<input name="targetGym" type="number" step="1" value="${
                s.targets.gymSessions
              }" required /></label>
            </div>
          </section>

          <div class="inline-actions">
            <button class="btn btn-primary" type="submit">Save Settings</button>
            <button class="btn" type="button" data-action="export-json">Export JSON</button>
            <button class="btn" type="button" data-action="trigger-import-json">Import JSON</button>
            <button class="btn btn-danger" type="button" data-action="reset-defaults">Reset Defaults</button>
            <input id="import-json-input" type="file" accept="application/json" class="hidden" />
            <p class="helper" data-feedback="settings"></p>
          </div>
        </form>
      </section>
    `;
  }

  function renderRoute(route) {
    stateful.route = route;
    updateNavActive(route);

    if (route !== "log") {
      stopTimerTick();
    }

    switch (route) {
      case "dashboard":
        renderDashboard();
        break;
      case "log":
        renderLog();
        break;
      case "money":
        renderMoney();
        break;
      case "school":
        renderSchool();
        break;
      case "health":
        renderHealth();
        break;
      case "settings":
        renderSettings();
        break;
      default:
        renderDashboard();
        break;
    }
  }

  function withConfirm(message, onConfirm) {
    stateful.confirmAction = onConfirm;
    refs.confirmMessage.textContent = message;
    openModal(refs.confirmModal);
  }

  function handleQuickAddTypeChange() {
    const selected = refs.quickAddType.value;
    const groups = refs.quickAddForm.querySelectorAll("[data-qa-section]");
    groups.forEach((group) => {
      const isActive = group.dataset.qaSection === selected;
      group.classList.toggle("hidden", !isActive);
      group.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !isActive;
      });
    });
  }

  function openQuickAdd(defaultType = "time") {
    refs.quickAddForm.reset();
    refs.quickAddType.value = defaultType;
    refs.quickAddForm.querySelector('input[name="date"]').value = getTodayIso();
    refs.quickAddForm.querySelector('input[name="workoutDate"]').value = getTodayIso();
    refs.quickAddForm.querySelector('input[name="taskDueDate"]').value = getTodayIso();
    handleQuickAddTypeChange();
    openModal(refs.quickAddModal);
  }

  function handleQuickAddSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const type = data.get("type");

    if (type === "time") {
      createTimeEntry(store, {
        category: data.get("category"),
        minutes: num(data.get("minutes"), 30),
        date: data.get("date"),
        note: text(data.get("note")),
      });
      toast("Time entry saved");
    } else if (type === "task") {
      createTask(store, {
        title: text(data.get("taskTitle"), 120),
        course: text(data.get("taskCourse"), 40),
        module: text(data.get("taskModule"), 40),
        dueDate: data.get("taskDueDate"),
        estimatedMinutes: num(data.get("taskMinutes"), 45),
        rubricChecklist: text(data.get("taskRubric"), 220),
        status: "todo",
      });
      toast("Task created");
    } else {
      createTimeEntry(store, {
        category: "WORKOUT",
        minutes: num(data.get("workoutMinutes"), 45),
        date: data.get("workoutDate"),
        note: text(data.get("workoutNote"), 180),
        workoutType: text(data.get("workoutType"), 60),
      });
      toast("Workout logged");
    }

    closeModal(refs.quickAddModal);
  }

  function openTimerStopModal() {
    const timer = getTimerSnapshot(currentState());
    refs.timerStopSummary.textContent = `Current session: ${timer.display} (${timer.minutesRounded} minute log)`;
    refs.timerStopForm.reset();
    refs.timerStopForm.category.value = timer.category;
    refs.timerStopForm.note.value = timer.note || "";
    openModal(refs.timerStopModal);
  }

  function handleTimerStopSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const entry = stopTimerAndCreateEntry(store, {
      category: data.get("category"),
      note: text(data.get("note"), 180),
    });

    closeModal(refs.timerStopModal);

    if (entry) {
      toast(`Saved ${entry.minutes} minute ${entry.category.toLowerCase()} entry.`);
    } else {
      toast("No timer minutes to save.", "error");
    }
  }

  function startOrStopTimerTick() {
    stopTimerTick();
    if (stateful.route !== "log") return;

    stateful.timerTick = window.setInterval(() => {
      const timerDisplay = refs.routeView.querySelector("#timer-live");
      if (!timerDisplay) return;
      const timer = getTimerSnapshot(currentState());
      timerDisplay.textContent = timer.display;
      setFeedback("timer", timer.running ? "Timer running..." : "Timer idle.");
    }, 1000);
  }

  function stopTimerTick() {
    if (stateful.timerTick) {
      window.clearInterval(stateful.timerTick);
      stateful.timerTick = null;
    }
  }

  function handleRouteClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    event.preventDefault();

    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
      case "start-fellowship": {
        startTimer(store, { category: "FELLOWSHIP", note: "Fellowship session" });
        toast("Fellowship timer started");
        router.navigate("log");
        break;
      }
      case "quick-study": {
        createTimeEntry(store, {
          category: "STUDY",
          minutes: num(button.dataset.minutes, 30),
          note: "Quick study log",
        });
        toast("Study logged");
        break;
      }
      case "quick-workout": {
        createTimeEntry(store, {
          category: "WORKOUT",
          minutes: num(button.dataset.minutes, 45),
          note: "Quick workout log",
        });
        toast("Workout logged");
        break;
      }
      case "open-quick-task": {
        openQuickAdd("task");
        break;
      }
      case "timer-start": {
        const timer = getTimerSnapshot(currentState());
        if (!timer.running) {
          startTimer(store, { category: timer.category, note: timer.note, linkedTaskId: timer.linkedTaskId });
          toast("Timer started");
        }
        break;
      }
      case "timer-pause": {
        pauseTimer(store);
        toast("Timer paused");
        break;
      }
      case "timer-reset": {
        resetTimer(store);
        toast("Timer reset");
        break;
      }
      case "timer-stop": {
        openTimerStopModal();
        break;
      }
      case "export-csv": {
        const csv = createTimeEntriesCsv(currentState().timeEntries);
        downloadCsv(`lifeos-time-${getTodayIso()}.csv`, csv);
        toast("CSV exported");
        break;
      }
      case "delete-time": {
        withConfirm("Delete this time entry?", () => {
          deleteTimeEntry(store, id);
          toast("Time entry deleted");
        });
        break;
      }
      case "set-scenario-fellowship": {
        stateful.moneyScenario.fellowshipHours = num(button.dataset.hours, stateful.moneyScenario.fellowshipHours);
        renderRoute("money");
        break;
      }
      case "set-scenario-ot": {
        stateful.moneyScenario.otHours = num(button.dataset.ot, stateful.moneyScenario.otHours);
        renderRoute("money");
        break;
      }
      case "edit-task": {
        stateful.schoolEditingTaskId = id;
        renderRoute("school");
        break;
      }
      case "cancel-edit-task": {
        stateful.schoolEditingTaskId = null;
        renderRoute("school");
        break;
      }
      case "delete-task": {
        withConfirm("Delete this task permanently?", () => {
          deleteTask(store, id);
          if (stateful.schoolEditingTaskId === id) {
            stateful.schoolEditingTaskId = null;
          }
          toast("Task deleted");
        });
        break;
      }
      case "start-task-timer": {
        const task = getTaskById(currentState().tasks, id);
        if (!task) return;
        startTimer(store, {
          category: "STUDY",
          note: `Study: ${task.title}`,
          linkedTaskId: task.id,
        });
        toast(`Study timer started for ${task.title}`);
        router.navigate("log");
        break;
      }
      case "delete-symptom": {
        withConfirm("Delete this symptom entry?", () => {
          store.setState((draft) => {
            draft.symptoms = draft.symptoms.filter((item) => item.id !== id);
            return draft;
          });
          toast("Symptom entry deleted");
        });
        break;
      }
      case "export-json": {
        openFileDownload(`lifeos-backup-${getTodayIso()}.json`, store.exportJson(), "application/json");
        toast("JSON export complete");
        break;
      }
      case "trigger-import-json": {
        const input = refs.routeView.querySelector("#import-json-input");
        if (input) input.click();
        break;
      }
      case "reset-defaults": {
        withConfirm("Reset all LifeOS data to defaults?", () => {
          store.reset();
          stateful.schoolEditingTaskId = null;
          toast("Data reset to defaults");
        });
        break;
      }
      default:
        break;
    }
  }

  function handleRouteChange(event) {
    const select = event.target.closest("select[data-action='task-status']");
    if (select) {
      setTaskStatus(store, select.dataset.id, select.value);
      toast("Task status updated");
      return;
    }

    const symptomFilter = event.target.closest("select[data-action='health-symptom-filter']");
    if (symptomFilter) {
      stateful.healthSymptomFilter = symptomFilter.value;
      renderRoute("health");
      return;
    }

    if (event.target.matches("#import-json-input")) {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          store.importJson(String(reader.result || "{}"));
          toast("JSON imported");
        } catch {
          toast("Import failed: invalid JSON", "error");
        }
      };
      reader.readAsText(file);
    }
  }

  function handleRouteSubmit(event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;

    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const formName = form.dataset.form;

    if (formName === "manual-time") {
      createTimeEntry(store, {
        category: data.get("category"),
        minutes: num(data.get("minutes"), 30),
        date: data.get("date"),
        note: text(data.get("note"), 180),
      });
      setFeedback("manual-time", "Saved.");
      toast("Time entry saved");
      return;
    }

    if (formName === "symptom-quick" || formName === "health-symptom") {
      const hasFlag = ["tremor", "tingling", "cramps", "fatigue"].some((key) => data.get(key) === "on");
      store.setState((draft) => {
        draft.symptoms.push({
          id: `sym-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          date: String(data.get("date") || getTodayIso()),
          tremor: data.get("tremor") === "on",
          tingling: data.get("tingling") === "on",
          cramps: data.get("cramps") === "on",
          fatigue: data.get("fatigue") === "on",
          note: text(data.get("note"), 180),
        });
        return draft;
      });

      setFeedback(formName, hasFlag ? "Symptom entry saved." : "Saved note (no symptom flags selected).");
      toast("Symptom saved");
      return;
    }

    if (formName === "health-workout") {
      createTimeEntry(store, {
        category: "WORKOUT",
        minutes: num(data.get("minutes"), 45),
        date: data.get("date"),
        note: text(data.get("note"), 180),
        workoutType: text(data.get("workoutType"), 60),
      });
      setFeedback("health-workout", "Workout saved.");
      toast("Workout logged");
      return;
    }

    if (formName === "task-editor") {
      const payload = {
        title: text(data.get("title"), 120),
        course: text(data.get("course"), 40),
        module: text(data.get("module"), 40),
        dueDate: String(data.get("dueDate") || getTodayIso()),
        estimatedMinutes: num(data.get("estimatedMinutes"), 45),
        rubricChecklist: text(data.get("rubricChecklist"), 220),
        status: String(data.get("status") || "todo"),
      };

      const taskId = String(data.get("taskId") || "");
      if (taskId) {
        updateTask(store, taskId, payload);
        stateful.schoolEditingTaskId = null;
        toast("Task updated");
      } else {
        createTask(store, payload);
        toast("Task created");
      }
      return;
    }

    if (formName === "task-filters") {
      stateful.schoolFilters = {
        status: String(data.get("status") || "all"),
        course: String(data.get("course") || "all"),
        timeline: String(data.get("timeline") || "all"),
      };
      renderRoute("school");
      return;
    }

    if (formName === "settings") {
      const selectedWorkDays = data
        .getAll("workDays")
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);

      store.setState((draft) => {
        draft.settings.weekStart = String(data.get("weekStart") || "sun");
        draft.settings.schedule.workStart = String(data.get("workStart") || "07:00");
        draft.settings.schedule.workEnd = String(data.get("workEnd") || "18:00");
        draft.settings.schedule.commuteMinutes = Math.max(0, Math.round(num(data.get("commuteMinutes"), 30)));
        draft.settings.schedule.workDays = selectedWorkDays.length ? selectedWorkDays : [0, 1, 2, 3];
        draft.settings.schedule.suggestedBlocks.fellowship = Math.max(15, Math.round(num(data.get("blockFellowship"), 60)));
        draft.settings.schedule.suggestedBlocks.study = Math.max(15, Math.round(num(data.get("blockStudy"), 45)));
        draft.settings.schedule.suggestedBlocks.gym = Math.max(15, Math.round(num(data.get("blockGym"), 45)));
        draft.settings.schedule.suggestedBlocks.admin = Math.max(10, Math.round(num(data.get("blockAdmin"), 30)));

        draft.settings.income.amazonRate = num(data.get("amazonRate"), 26.5);
        draft.settings.income.amazonHours = num(data.get("amazonHours"), 40);
        draft.settings.income.otHours = num(data.get("otHours"), 0);
        draft.settings.income.otMultiplier = num(data.get("otMultiplier"), 1.5);
        draft.settings.income.fellowshipRate = num(data.get("fellowshipRate"), 17);
        draft.settings.income.fellowshipHours = num(data.get("fellowshipHours"), 30);
        draft.settings.income.fellowshipCap = num(data.get("fellowshipCap"), 40);

        draft.settings.deductions.taxesPct = num(data.get("taxesPct"), 20);
        draft.settings.deductions.k401Pct = num(data.get("k401Pct"), 15);
        draft.settings.deductions.k401Base = String(data.get("k401Base") || "gross");
        draft.settings.deductions.insuranceWeekly = num(data.get("insuranceWeekly"), 60);
        draft.settings.deductions.otherDeductionsWeekly = num(data.get("otherDeductionsWeekly"), 0);

        draft.settings.essentials.fixedBillsWeekly = num(data.get("fixedBillsWeekly"), 500);
        draft.settings.essentials.foodBaselineWeekly = num(data.get("foodBaselineWeekly"), 100);
        draft.settings.essentials.uberWeekly = num(data.get("uberWeekly"), 200);

        draft.money.debt.balance = num(data.get("debtBalance"), 2500);
        draft.money.debt.weeksRemaining = Math.max(0, Math.round(num(data.get("debtWeeksRemaining"), 10)));
        draft.money.tuition.amountDue = num(data.get("tuitionAmountDue"), 1800);
        draft.money.tuition.weeksUntilDue = Math.max(0, Math.round(num(data.get("tuitionWeeksUntilDue"), 12)));

        draft.money.buckets.uber.balance = num(data.get("bucketUber"), 0);
        draft.money.buckets.emergency.balance = num(data.get("bucketEmergency"), 0);
        draft.money.buckets.emergency.target = num(data.get("bucketEmergencyTarget"), 1000);
        draft.money.buckets.tuition.balance = num(data.get("bucketTuition"), 0);
        draft.money.buckets.tuition.target = num(data.get("bucketTuitionTarget"), draft.money.tuition.amountDue);
        draft.money.buckets.goal.balance = num(data.get("bucketGoal"), 0);

        draft.settings.targets.fellowshipHours = num(data.get("targetFellowship"), 30);
        draft.settings.targets.studyMinutes = Math.max(0, Math.round(num(data.get("targetStudy"), 300)));
        draft.settings.targets.gymSessions = Math.max(0, Math.round(num(data.get("targetGym"), 3)));
        return draft;
      });

      setFeedback("settings", "Settings saved.");
      toast("Settings saved");
      return;
    }
  }

  function handleGlobalClick(event) {
    const closeBtn = event.target.closest("[data-close-modal]");
    if (closeBtn) {
      const modal = document.getElementById(closeBtn.dataset.closeModal);
      if (modal) closeModal(modal);
      return;
    }

    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
    }
  }

  function bindEvents() {
    refs.quickAddBtn.addEventListener("click", () => openQuickAdd("time"));
    refs.quickAddType.addEventListener("change", handleQuickAddTypeChange);
    refs.quickAddForm.addEventListener("submit", handleQuickAddSubmit);
    refs.timerStopForm.addEventListener("submit", handleTimerStopSubmit);

    refs.themeToggle.addEventListener("click", cycleTheme);

    mediaDark.addEventListener("change", () => {
      if (currentState().settings.theme === "system") {
        applyTheme("system");
      }
    });

    refs.confirmOk.addEventListener("click", () => {
      if (stateful.confirmAction) {
        stateful.confirmAction();
      }
      stateful.confirmAction = null;
      closeModal(refs.confirmModal);
    });

    refs.routeView.addEventListener("click", handleRouteClick);
    refs.routeView.addEventListener("submit", handleRouteSubmit);
    refs.routeView.addEventListener("change", handleRouteChange);

    document.addEventListener("click", handleGlobalClick);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    });

    refs.installBtn.addEventListener("click", async () => {
      if (!stateful.installPromptEvent) return;
      stateful.installPromptEvent.prompt();
      const choice = await stateful.installPromptEvent.userChoice;
      if (choice.outcome === "accepted") {
        toast("LifeOS install started");
      }
      stateful.installPromptEvent = null;
      refs.installBtn.classList.add("hidden");
    });
  }

  return {
    init() {
      bindEvents();
      handleQuickAddTypeChange();
      applyTheme(currentState().settings.theme);
    },

    render(route) {
      renderRoute(route);
    },

    onStateChange() {
      applyTheme(currentState().settings.theme);
      renderRoute(stateful.route);
    },

    setInstallPromptEvent(event) {
      stateful.installPromptEvent = event;
      refs.installBtn.classList.remove("hidden");
    },

    clearInstallPromptEvent() {
      stateful.installPromptEvent = null;
      refs.installBtn.classList.add("hidden");
    },

    setRoute(route) {
      stateful.route = route;
      renderRoute(route);
    },

    updateNav(route) {
      updateNavActive(route);
    },

    toast,
  };
}
