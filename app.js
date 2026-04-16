const STORAGE_KEY = "lifeos-html-v1";

const seedSettings = {
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
  foodBaselineWeekly: 100,
  commuteMinutes: 30,
  gymTargetSessions: 3,
  studyTargetMinutes: 300,
};

const seedDebtPlan = {
  balance: 2500,
  weeksRemaining: 10,
};

const seedTuitionPlan = {
  amountDue: 1800,
  weeksUntilDue: 12,
};

const seedBuckets = {
  UBER: { currentAmount: 0, targetAmount: 200 },
  EMERGENCY: { currentAmount: 125, targetAmount: 1000 },
  TUITION: { currentAmount: 200, targetAmount: 1800 },
  GOAL: { currentAmount: 75, targetAmount: 5000 },
};

function createSeedState() {
  const now = new Date();
  return {
    settings: { ...seedSettings },
    debtPlan: { ...seedDebtPlan },
    tuitionPlan: { ...seedTuitionPlan },
    buckets: JSON.parse(JSON.stringify(seedBuckets)),
    timeEntries: [
      {
        id: makeId(),
        dateTime: new Date(now.getTime() - 2 * dayMs).toISOString(),
        category: "FELLOWSHIP",
        minutes: 55,
        note: "Peer support call",
      },
      {
        id: makeId(),
        dateTime: new Date(now.getTime() - dayMs).toISOString(),
        category: "STUDY",
        minutes: 90,
        note: "Module reading",
      },
      {
        id: makeId(),
        dateTime: new Date(now.getTime() - 3 * dayMs).toISOString(),
        category: "WORKOUT",
        minutes: 45,
        note: "Upper body + cardio",
      },
    ],
    tasks: [
      {
        id: makeId(),
        title: "Draft strategy memo",
        course: "MBA-540",
        module: "Module 4",
        dueDate: toInputDate(new Date(now.getTime() + 2 * dayMs)),
        rubricChecklist: "Problem statement; options; recommendation",
        status: "todo",
        estimatedMinutes: 50,
        createdAt: now.toISOString(),
      },
      {
        id: makeId(),
        title: "Post discussion initial response",
        course: "MBA-500",
        module: "Module 3",
        dueDate: toInputDate(new Date(now.getTime() + dayMs)),
        rubricChecklist: "Citations; thesis; question prompt",
        status: "doing",
        estimatedMinutes: 35,
        createdAt: now.toISOString(),
      },
    ],
    symptoms: [
      {
        id: makeId(),
        date: toInputDate(now),
        tremor: false,
        tingling: false,
        cramps: false,
        fatigue: true,
        note: "Mild fatigue after long shift",
      },
    ],
    checkins: {
      [toInputDate(now)]: {
        energy: 3,
        note: "Stay consistent and finish priority tasks.",
      },
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw);
    return {
      settings: { ...seedSettings, ...(parsed.settings || {}) },
      debtPlan: { ...seedDebtPlan, ...(parsed.debtPlan || {}) },
      tuitionPlan: { ...seedTuitionPlan, ...(parsed.tuitionPlan || {}) },
      buckets: {
        UBER: { ...seedBuckets.UBER, ...(parsed.buckets?.UBER || {}) },
        EMERGENCY: { ...seedBuckets.EMERGENCY, ...(parsed.buckets?.EMERGENCY || {}) },
        TUITION: { ...seedBuckets.TUITION, ...(parsed.buckets?.TUITION || {}) },
        GOAL: { ...seedBuckets.GOAL, ...(parsed.buckets?.GOAL || {}) },
      },
      timeEntries: Array.isArray(parsed.timeEntries) ? parsed.timeEntries : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      checkins: parsed.checkins && typeof parsed.checkins === "object" ? parsed.checkins : {},
    };
  } catch {
    return createSeedState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const dayMs = 24 * 60 * 60 * 1000;
const state = loadState();

const ui = {
  activeTab: "dashboard",
  scenario: {
    fellowshipHours: 30,
    overtimeEnabled: false,
  },
};

const timer = {
  running: false,
  elapsedMs: 0,
  startedAt: null,
  interval: null,
};

const el = {
  tabs: [...document.querySelectorAll(".tab-button")],
  panels: [...document.querySelectorAll(".tab-panel")],
  todayDate: document.getElementById("todayDate"),
  dayModeBadge: document.getElementById("dayModeBadge"),
  focusSummary: document.getElementById("focusSummary"),
  debtDeadlineText: document.getElementById("debtDeadlineText"),
  tuitionWindowText: document.getElementById("tuitionWindowText"),
  tonightBlockText: document.getElementById("tonightBlockText"),
  oneTapFellowship: document.getElementById("oneTapFellowship"),
  oneTapStudy: document.getElementById("oneTapStudy"),
  oneTapWorkout: document.getElementById("oneTapWorkout"),
  energySlider: document.getElementById("energySlider"),
  energyValue: document.getElementById("energyValue"),
  dailyNote: document.getElementById("dailyNote"),
  saveCheckin: document.getElementById("saveCheckin"),
  checkinMessage: document.getElementById("checkinMessage"),
  timelineList: document.getElementById("timelineList"),
  topPriorities: document.getElementById("topPriorities"),
  fellowshipProgressText: document.getElementById("fellowshipProgressText"),
  studyProgressText: document.getElementById("studyProgressText"),
  gymProgressText: document.getElementById("gymProgressText"),
  fellowshipProgressBar: document.getElementById("fellowshipProgressBar"),
  studyProgressBar: document.getElementById("studyProgressBar"),
  gymProgressBar: document.getElementById("gymProgressBar"),
  dashNetIncome: document.getElementById("dashNetIncome"),
  dashEssentials: document.getElementById("dashEssentials"),
  dashSurplus: document.getElementById("dashSurplus"),
  quickStartTimer: document.getElementById("quickStartTimer"),
  quickStudyForm: document.getElementById("quickStudyForm"),
  quickWorkoutForm: document.getElementById("quickWorkoutForm"),
  quickTaskForm: document.getElementById("quickTaskForm"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerNote: document.getElementById("timerNote"),
  timerStart: document.getElementById("timerStart"),
  timerPause: document.getElementById("timerPause"),
  timerStop: document.getElementById("timerStop"),
  timerReset: document.getElementById("timerReset"),
  timerMessage: document.getElementById("timerMessage"),
  manualTimeForm: document.getElementById("manualTimeForm"),
  weeklyFellowshipMinutes: document.getElementById("weeklyFellowshipMinutes"),
  weeklyStudyMinutes: document.getElementById("weeklyStudyMinutes"),
  weeklyWorkoutMinutes: document.getElementById("weeklyWorkoutMinutes"),
  timeEntryRows: document.getElementById("timeEntryRows"),
  fellowshipScenarioButtons: document.getElementById("fellowshipScenarioButtons"),
  toggleOt: document.getElementById("toggleOt"),
  moneyNetIncome: document.getElementById("moneyNetIncome"),
  moneyEssentials: document.getElementById("moneyEssentials"),
  moneySurplus: document.getElementById("moneySurplus"),
  offTrackBanner: document.getElementById("offTrackBanner"),
  offTrackText: document.getElementById("offTrackText"),
  moneyStepRows: document.getElementById("moneyStepRows"),
  moneyOutputs: document.getElementById("moneyOutputs"),
  moneyProjections: document.getElementById("moneyProjections"),
  partialFundingText: document.getElementById("partialFundingText"),
  nextActionText: document.getElementById("nextActionText"),
  taskForm: document.getElementById("taskForm"),
  taskRows: document.getElementById("taskRows"),
  healthTargetSessions: document.getElementById("healthTargetSessions"),
  healthSessionsWeek: document.getElementById("healthSessionsWeek"),
  healthStreak: document.getElementById("healthStreak"),
  healthWorkoutForm: document.getElementById("healthWorkoutForm"),
  symptomForm: document.getElementById("symptomForm"),
  symptomRows: document.getElementById("symptomRows"),
  settingsForm: document.getElementById("settingsForm"),
  settingsMessage: document.getElementById("settingsMessage"),
  resetSeed: document.getElementById("resetSeed"),
};

init();

function init() {
  const plannedHours = Math.round(state.settings.fellowshipPlannedHours);
  ui.scenario.fellowshipHours = [25, 30, 35].includes(plannedHours) ? plannedHours : 30;
  ui.scenario.overtimeEnabled = state.settings.amazonOtHours > 0;

  bindEvents();
  hydrateDefaults();
  renderAll();
}

function bindEvents() {
  el.tabs.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });

  el.quickStartTimer.addEventListener("click", () => {
    setTab("log");
    startTimer();
  });

  el.quickStudyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    addTimeEntry("STUDY", number(fd.get("minutes"), 30), "Quick study log");
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='minutes']").value = 30;
  });

  el.quickWorkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    addTimeEntry("WORKOUT", number(fd.get("minutes"), 45), "Quick workout log");
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='minutes']").value = 45;
  });

  el.quickTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const title = str(fd.get("title"));
    if (!title) return;

    state.tasks.push({
      id: makeId(),
      title,
      course: "MBA",
      module: "Current Module",
      dueDate: toInputDate(new Date(Date.now() + 2 * dayMs)),
      rubricChecklist: "Define deliverable and grading points",
      status: "todo",
      estimatedMinutes: 30,
      createdAt: new Date().toISOString(),
    });

    saveState();
    renderAll();
    event.currentTarget.reset();
  });

  el.oneTapFellowship.addEventListener("click", () => {
    addTimeEntry("FELLOWSHIP", 50, "One-tap fellowship block");
    setTab("dashboard");
  });

  el.oneTapStudy.addEventListener("click", () => {
    addTimeEntry("STUDY", 30, "One-tap study block");
    setTab("dashboard");
  });

  el.oneTapWorkout.addEventListener("click", () => {
    addTimeEntry("WORKOUT", 45, "One-tap workout block");
    setTab("dashboard");
  });

  el.energySlider.addEventListener("input", () => {
    el.energyValue.textContent = el.energySlider.value;
  });

  el.saveCheckin.addEventListener("click", () => {
    const today = toInputDate(new Date());
    state.checkins[today] = {
      energy: clamp(number(el.energySlider.value, 3), 1, 5),
      note: str(el.dailyNote.value),
    };
    saveState();
    renderDashboard();
    el.checkinMessage.textContent = "Daily check-in saved.";
  });

  el.timerStart.addEventListener("click", startTimer);
  el.timerPause.addEventListener("click", pauseTimer);
  el.timerStop.addEventListener("click", stopTimerAndSave);
  el.timerReset.addEventListener("click", resetTimer);

  el.manualTimeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const date = str(fd.get("date")) || toInputDate(new Date());
    const category = str(fd.get("category")) || "STUDY";
    const minutes = number(fd.get("minutes"), 30);
    const note = str(fd.get("note"));

    addTimeEntry(category, minutes, note, date);
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='date']").value = toInputDate(new Date());
    event.currentTarget.querySelector("input[name='minutes']").value = 30;
  });

  el.timeEntryRows.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-delete-entry]");
    if (!button) return;
    const id = button.dataset.deleteEntry;
    state.timeEntries = state.timeEntries.filter((entry) => entry.id !== id);
    saveState();
    renderAll();
  });

  el.fellowshipScenarioButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-hours]");
    if (!button) return;
    ui.scenario.fellowshipHours = number(button.dataset.hours, 30);
    renderMoney();
    renderDashboard();
  });

  el.toggleOt.addEventListener("click", () => {
    ui.scenario.overtimeEnabled = !ui.scenario.overtimeEnabled;
    renderMoney();
    renderDashboard();
  });

  el.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const title = str(fd.get("title"));
    if (!title) return;

    state.tasks.push({
      id: makeId(),
      title,
      course: str(fd.get("course")),
      module: str(fd.get("module")),
      dueDate: str(fd.get("dueDate")),
      rubricChecklist: str(fd.get("rubricChecklist")),
      status: "todo",
      estimatedMinutes: Math.max(25, number(fd.get("estimatedMinutes"), 45)),
      createdAt: new Date().toISOString(),
    });

    saveState();
    renderAll();
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='dueDate']").value = toInputDate(new Date());
    event.currentTarget.querySelector("input[name='estimatedMinutes']").value = 45;
  });

  el.taskRows.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-task-status]");
    if (!select) return;
    const task = state.tasks.find((item) => item.id === select.dataset.taskStatus);
    if (!task) return;
    task.status = select.value;
    saveState();
    renderAll();
  });

  el.taskRows.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-delete-task]");
    if (!button) return;
    state.tasks = state.tasks.filter((task) => task.id !== button.dataset.deleteTask);
    saveState();
    renderAll();
  });

  el.healthWorkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    addTimeEntry("WORKOUT", number(fd.get("minutes"), 45), str(fd.get("note")) || "Workout log");
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='minutes']").value = 45;
  });

  el.symptomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    state.symptoms.unshift({
      id: makeId(),
      date: str(fd.get("date")) || toInputDate(new Date()),
      tremor: fd.get("tremor") === "on",
      tingling: fd.get("tingling") === "on",
      cramps: fd.get("cramps") === "on",
      fatigue: fd.get("fatigue") === "on",
      note: str(fd.get("note")),
    });
    saveState();
    renderHealth();
    event.currentTarget.reset();
    event.currentTarget.querySelector("input[name='date']").value = toInputDate(new Date());
  });

  el.symptomRows.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-delete-symptom]");
    if (!button) return;
    state.symptoms = state.symptoms.filter((entry) => entry.id !== button.dataset.deleteSymptom);
    saveState();
    renderHealth();
  });

  el.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);

    const s = state.settings;
    s.amazonHourlyPay = number(fd.get("amazonHourlyPay"), s.amazonHourlyPay);
    s.amazonPlannedHours = number(fd.get("amazonPlannedHours"), s.amazonPlannedHours);
    s.amazonOtHours = number(fd.get("amazonOtHours"), s.amazonOtHours);
    s.amazonOtMultiplier = number(fd.get("amazonOtMultiplier"), s.amazonOtMultiplier);
    s.fellowshipHourlyPay = number(fd.get("fellowshipHourlyPay"), s.fellowshipHourlyPay);
    s.fellowshipPlannedHours = number(fd.get("fellowshipPlannedHours"), s.fellowshipPlannedHours);
    s.fellowshipWeeklyCap = number(fd.get("fellowshipWeeklyCap"), s.fellowshipWeeklyCap);
    s.taxesPercent = number(fd.get("taxesPercent"), s.taxesPercent);
    s.four01kPercent = number(fd.get("four01kPercent"), s.four01kPercent);
    s.insuranceWeekly = number(fd.get("insuranceWeekly"), s.insuranceWeekly);
    s.otherDeductionsWeekly = number(fd.get("otherDeductionsWeekly"), s.otherDeductionsWeekly);
    s.uberWeekly = number(fd.get("uberWeekly"), s.uberWeekly);
    s.fixedBillsWeekly = number(fd.get("fixedBillsWeekly"), s.fixedBillsWeekly);
    s.foodBaselineWeekly = number(fd.get("foodBaselineWeekly"), s.foodBaselineWeekly);
    s.commuteMinutes = Math.max(0, Math.round(number(fd.get("commuteMinutes"), s.commuteMinutes)));
    s.gymTargetSessions = Math.max(0, Math.round(number(fd.get("gymTargetSessions"), s.gymTargetSessions)));
    s.studyTargetMinutes = Math.max(0, Math.round(number(fd.get("studyTargetMinutes"), s.studyTargetMinutes)));

    state.debtPlan.balance = number(fd.get("debtBalance"), state.debtPlan.balance);
    state.debtPlan.weeksRemaining = Math.max(
      0,
      Math.round(number(fd.get("debtWeeksRemaining"), state.debtPlan.weeksRemaining))
    );

    state.tuitionPlan.amountDue = number(fd.get("tuitionAmountDue"), state.tuitionPlan.amountDue);
    state.tuitionPlan.weeksUntilDue = Math.max(
      0,
      Math.round(number(fd.get("tuitionWeeksUntilDue"), state.tuitionPlan.weeksUntilDue))
    );

    state.buckets.UBER.currentAmount = number(fd.get("bucketUberCurrent"), state.buckets.UBER.currentAmount);
    state.buckets.UBER.targetAmount = number(fd.get("bucketUberTarget"), state.buckets.UBER.targetAmount);
    state.buckets.EMERGENCY.currentAmount = number(
      fd.get("bucketEmergencyCurrent"),
      state.buckets.EMERGENCY.currentAmount
    );
    state.buckets.EMERGENCY.targetAmount = number(
      fd.get("bucketEmergencyTarget"),
      state.buckets.EMERGENCY.targetAmount
    );
    state.buckets.TUITION.currentAmount = number(fd.get("bucketTuitionCurrent"), state.buckets.TUITION.currentAmount);
    state.buckets.TUITION.targetAmount = number(fd.get("bucketTuitionTarget"), state.buckets.TUITION.targetAmount);
    state.buckets.GOAL.currentAmount = number(fd.get("bucketGoalCurrent"), state.buckets.GOAL.currentAmount);
    state.buckets.GOAL.targetAmount = number(fd.get("bucketGoalTarget"), state.buckets.GOAL.targetAmount);

    saveState();
    el.settingsMessage.textContent = "Settings saved.";
    renderAll();
  });

  el.resetSeed.addEventListener("click", () => {
    const seeded = createSeedState();
    Object.assign(state, seeded);
    saveState();
    hydrateDefaults();
    renderAll();
    el.settingsMessage.textContent = "Seed data restored.";
  });
}

function hydrateDefaults() {
  const today = toInputDate(new Date());
  const todayCheckin = state.checkins[today] || { energy: 3, note: "" };

  el.manualTimeForm.querySelector("input[name='date']").value = toInputDate(new Date());
  el.taskForm.querySelector("input[name='dueDate']").value = toInputDate(new Date());
  el.symptomForm.querySelector("input[name='date']").value = toInputDate(new Date());
  el.energySlider.value = clamp(number(todayCheckin.energy, 3), 1, 5);
  el.energyValue.textContent = el.energySlider.value;
  el.dailyNote.value = todayCheckin.note || "";
  hydrateSettingsForm();
}

function hydrateSettingsForm() {
  const s = state.settings;
  const form = el.settingsForm;

  assignValue(form, "amazonHourlyPay", s.amazonHourlyPay);
  assignValue(form, "amazonPlannedHours", s.amazonPlannedHours);
  assignValue(form, "amazonOtHours", s.amazonOtHours);
  assignValue(form, "amazonOtMultiplier", s.amazonOtMultiplier);
  assignValue(form, "fellowshipHourlyPay", s.fellowshipHourlyPay);
  assignValue(form, "fellowshipPlannedHours", s.fellowshipPlannedHours);
  assignValue(form, "fellowshipWeeklyCap", s.fellowshipWeeklyCap);
  assignValue(form, "taxesPercent", s.taxesPercent);
  assignValue(form, "four01kPercent", s.four01kPercent);
  assignValue(form, "insuranceWeekly", s.insuranceWeekly);
  assignValue(form, "otherDeductionsWeekly", s.otherDeductionsWeekly);
  assignValue(form, "uberWeekly", s.uberWeekly);
  assignValue(form, "fixedBillsWeekly", s.fixedBillsWeekly);
  assignValue(form, "foodBaselineWeekly", s.foodBaselineWeekly);
  assignValue(form, "commuteMinutes", s.commuteMinutes);
  assignValue(form, "gymTargetSessions", s.gymTargetSessions);
  assignValue(form, "studyTargetMinutes", s.studyTargetMinutes);

  assignValue(form, "debtBalance", state.debtPlan.balance);
  assignValue(form, "debtWeeksRemaining", state.debtPlan.weeksRemaining);
  assignValue(form, "tuitionAmountDue", state.tuitionPlan.amountDue);
  assignValue(form, "tuitionWeeksUntilDue", state.tuitionPlan.weeksUntilDue);

  assignValue(form, "bucketUberCurrent", state.buckets.UBER.currentAmount);
  assignValue(form, "bucketUberTarget", state.buckets.UBER.targetAmount);
  assignValue(form, "bucketEmergencyCurrent", state.buckets.EMERGENCY.currentAmount);
  assignValue(form, "bucketEmergencyTarget", state.buckets.EMERGENCY.targetAmount);
  assignValue(form, "bucketTuitionCurrent", state.buckets.TUITION.currentAmount);
  assignValue(form, "bucketTuitionTarget", state.buckets.TUITION.targetAmount);
  assignValue(form, "bucketGoalCurrent", state.buckets.GOAL.currentAmount);
  assignValue(form, "bucketGoalTarget", state.buckets.GOAL.targetAmount);
}

function renderAll() {
  renderTabs();
  renderDashboard();
  renderLog();
  renderMoney();
  renderSchool();
  renderHealth();
  hydrateSettingsForm();
}

function renderTabs() {
  el.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === ui.activeTab);
  });

  el.panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === ui.activeTab);
  });
}

function setTab(tabName) {
  ui.activeTab = tabName;
  renderTabs();
}

function renderDashboard() {
  const today = new Date();
  const todayKey = toInputDate(today);
  const todayCheckin = state.checkins[todayKey] || { energy: 3, note: "" };
  const isWorkDay = [0, 1, 2, 3].includes(today.getDay());

  el.todayDate.textContent = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  el.dayModeBadge.textContent = isWorkDay ? "Workday (Sun-Wed)" : "Recovery + Build Day";

  const timeline = buildTimeline(state.settings.commuteMinutes, today.getDay());
  el.timelineList.innerHTML = timeline
    .map((block) => `<li><strong>${block.label}</strong> ${block.start} - ${block.end}</li>`)
    .join("");

  const week = getWeeklyStats();
  const finance = getFinanceResult();
  const nextTask = getNextTask();

  const debtDeadlineDate =
    state.debtPlan.weeksRemaining > 0 ? new Date(today.getTime() + state.debtPlan.weeksRemaining * 7 * dayMs) : null;
  const tuitionDueDate =
    state.tuitionPlan.weeksUntilDue > 0
      ? new Date(today.getTime() + state.tuitionPlan.weeksUntilDue * 7 * dayMs)
      : null;

  const tonightBlock = nextTask
    ? `${clamp(nextTask.estimatedMinutes, 25, 50)} min: ${nextTask.title}`
    : "30 min: Review MBA module + checklist";

  el.debtDeadlineText.textContent = debtDeadlineDate
    ? debtDeadlineDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Pay this week";
  el.tuitionWindowText.textContent = tuitionDueDate
    ? tuitionDueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Due now";
  el.tonightBlockText.textContent = tonightBlock;

  const moneyPriority = finance.flags.offTrack
    ? `Close weekly money gap of ${money(finance.flags.gap)}.`
    : finance.flags.partialFunding
    ? `Fund ${finance.flags.partiallyFundedSteps[0]} first.`
    : `Send at least ${money(finance.allocations.requiredDebt)} to debt this week.`;

  const schoolPriority = nextTask
    ? `Complete ${nextTask.title} in ${clamp(nextTask.estimatedMinutes, 25, 50)} minutes.`
    : "Add your next MBA task and complete a 25-minute block.";

  const gymLeft = Math.max(0, state.settings.gymTargetSessions - week.gymSessions);
  const healthPriority =
    gymLeft > 0
      ? `Log ${gymLeft} more gym session${gymLeft === 1 ? "" : "s"} this week.`
      : "Maintain recovery with sleep, hydration, and stretching.";

  const energyText =
    number(todayCheckin.energy, 3) <= 2
      ? "Low-energy day: keep blocks short and minimum viable."
      : number(todayCheckin.energy, 3) >= 4
      ? "High-energy day: push your hardest school or debt task first."
      : "Balanced-energy day: execute one solid block in each area.";

  const noteText = todayCheckin.note ? ` Note: ${todayCheckin.note}` : "";
  el.focusSummary.textContent = `${isWorkDay ? "After-shift plan:" : "Off-day plan:"} ${energyText}${noteText}`;

  el.topPriorities.innerHTML = `
    <li><strong>Money:</strong> ${moneyPriority}</li>
    <li><strong>School:</strong> ${schoolPriority}</li>
    <li><strong>Health:</strong> ${healthPriority}</li>
  `;

  const fellowshipTargetHours = round1(
    Math.min(state.settings.fellowshipPlannedHours, state.settings.fellowshipWeeklyCap)
  );
  const fellowshipCurrentHours = round1(week.fellowshipMinutes / 60);

  el.fellowshipProgressText.textContent = `${fellowshipCurrentHours} / ${fellowshipTargetHours} hrs`;
  el.studyProgressText.textContent = `${week.studyMinutes} / ${state.settings.studyTargetMinutes} min`;
  el.gymProgressText.textContent = `${week.gymSessions} / ${state.settings.gymTargetSessions} sessions`;

  setProgress(el.fellowshipProgressBar, fellowshipCurrentHours, fellowshipTargetHours);
  setProgress(el.studyProgressBar, week.studyMinutes, state.settings.studyTargetMinutes);
  setProgress(el.gymProgressBar, week.gymSessions, state.settings.gymTargetSessions);

  el.dashNetIncome.textContent = money(finance.netIncome);
  el.dashEssentials.textContent = money(finance.essentials);
  el.dashSurplus.textContent = money(finance.surplus);
  el.dashSurplus.style.color = finance.surplus >= 0 ? "var(--success)" : "var(--danger)";
}

function renderLog() {
  const week = getWeeklyStats();
  el.weeklyFellowshipMinutes.textContent = `${week.fellowshipMinutes} min`;
  el.weeklyStudyMinutes.textContent = `${week.studyMinutes} min`;
  el.weeklyWorkoutMinutes.textContent = `${week.workoutMinutes} min`;

  const rows = [...state.timeEntries].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  if (!rows.length) {
    el.timeEntryRows.innerHTML = `<tr><td colspan="5">No time entries yet.</td></tr>`;
    return;
  }

  el.timeEntryRows.innerHTML = rows
    .map(
      (entry) => `
      <tr>
        <td>${new Date(entry.dateTime).toLocaleString()}</td>
        <td>${entry.category}</td>
        <td>${entry.minutes}</td>
        <td>${escapeHtml(entry.note || "-")}</td>
        <td><button class="btn" data-delete-entry="${entry.id}">Delete</button></td>
      </tr>
    `
    )
    .join("");
}

function renderMoney() {
  const result = getFinanceResult();

  [...el.fellowshipScenarioButtons.querySelectorAll("button[data-hours]")].forEach((button) => {
    button.classList.toggle("active", number(button.dataset.hours, 0) === ui.scenario.fellowshipHours);
  });

  el.toggleOt.textContent = ui.scenario.overtimeEnabled ? "OT On" : "OT Off";
  el.moneyNetIncome.textContent = money(result.netIncome);
  el.moneyEssentials.textContent = money(result.essentials);
  el.moneySurplus.textContent = money(result.surplus);
  el.moneySurplus.style.color = result.surplus >= 0 ? "var(--success)" : "var(--danger)";

  el.offTrackBanner.classList.toggle("hidden", !result.flags.offTrack);
  el.offTrackText.textContent = `Weekly gap: ${money(result.flags.gap)}.`;

  el.moneyStepRows.innerHTML = result.steps
    .map((step) => {
      const status =
        step.required === 0 ? "N/A" : step.funded ? "Funded" : step.partial ? "Partially Funded" : "Unfunded";
      return `
        <tr>
          <td>${step.step}</td>
          <td>${money(step.required)}</td>
          <td>${money(step.allocated)}</td>
          <td>${status}</td>
        </tr>
      `;
    })
    .join("");

  el.moneyOutputs.innerHTML = `
    <li>Uber Buffer: ${money(result.allocations.uberBuffer)}</li>
    <li>Emergency Starter: ${money(result.allocations.emergency)}</li>
    <li>Tuition Sinking Fund: ${money(result.allocations.tuition)}</li>
    <li>Required Debt: ${money(result.allocations.requiredDebt)}</li>
    <li>Extra Debt: ${money(result.allocations.extraDebt)}</li>
    <li>Goal Savings: ${money(result.allocations.goalSavings)}</li>
  `;

  el.moneyProjections.innerHTML = `
    <li>Emergency $1,000: ${result.projections.emergencyTargetDate || "Not reachable yet"}</li>
    <li>Tuition Goal: ${result.projections.tuitionTargetDate || "Not reachable yet"}</li>
    <li>Debt Payoff: ${result.projections.debtPayoffDate || "Not reachable yet"}</li>
  `;

  el.partialFundingText.textContent = result.flags.partialFunding
    ? `Partial funding: ${result.flags.partiallyFundedSteps.join(", ")}.`
    : "";
}

function renderSchool() {
  const nextAction = getNextTask();
  el.nextActionText.textContent = nextAction
    ? `Highest urgency: ${nextAction.title} (${nextAction.course}/${nextAction.module}). Suggested block: ${clamp(
        nextAction.estimatedMinutes,
        25,
        50
      )} minutes.`
    : "No open tasks. Add a task to generate the next action.";

  const sorted = [...state.tasks].sort((a, b) => {
    const statusOrder = { todo: 0, doing: 1, done: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (!sorted.length) {
    el.taskRows.innerHTML = `<tr><td colspan="7">No tasks yet.</td></tr>`;
    return;
  }

  el.taskRows.innerHTML = sorted
    .map(
      (task) => `
    <tr>
      <td>${escapeHtml(task.title)}</td>
      <td>${escapeHtml(task.course)} / ${escapeHtml(task.module)}</td>
      <td>${new Date(task.dueDate).toLocaleDateString()}</td>
      <td>${escapeHtml(task.rubricChecklist)}</td>
      <td>${task.estimatedMinutes} min</td>
      <td>
        <span class="badge ${task.status}">${task.status.toUpperCase()}</span>
        <div style="margin-top: 0.35rem;">
          <select data-task-status="${task.id}">
            <option value="todo" ${task.status === "todo" ? "selected" : ""}>TODO</option>
            <option value="doing" ${task.status === "doing" ? "selected" : ""}>DOING</option>
            <option value="done" ${task.status === "done" ? "selected" : ""}>DONE</option>
          </select>
        </div>
      </td>
      <td><button class="btn" data-delete-task="${task.id}">Delete</button></td>
    </tr>
  `
    )
    .join("");
}

function renderHealth() {
  const week = getWeeklyStats();
  const streak = getGymStreak(state.settings.gymTargetSessions);

  el.healthTargetSessions.textContent = state.settings.gymTargetSessions;
  el.healthSessionsWeek.textContent = week.gymSessions;
  el.healthStreak.textContent = streak;

  if (!state.symptoms.length) {
    el.symptomRows.innerHTML = `<tr><td colspan="4">No symptom entries yet.</td></tr>`;
    return;
  }

  el.symptomRows.innerHTML = [...state.symptoms]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((entry) => {
      const flags = [
        entry.tremor ? "Tremor" : "",
        entry.tingling ? "Tingling" : "",
        entry.cramps ? "Cramps" : "",
        entry.fatigue ? "Fatigue" : "",
      ]
        .filter(Boolean)
        .join(", ");

      return `
        <tr>
          <td>${new Date(entry.date).toLocaleDateString()}</td>
          <td>${flags || "-"}</td>
          <td>${escapeHtml(entry.note || "-")}</td>
          <td><button class="btn" data-delete-symptom="${entry.id}">Delete</button></td>
        </tr>
      `;
    })
    .join("");
}

function startTimer() {
  if (timer.running) return;
  timer.running = true;
  timer.startedAt = Date.now();
  timer.interval = setInterval(updateTimerDisplay, 1000);
  showTimerMessage("Timer running.");
}

function pauseTimer() {
  if (!timer.running) return;
  timer.elapsedMs += Date.now() - timer.startedAt;
  timer.running = false;
  timer.startedAt = null;
  clearInterval(timer.interval);
  timer.interval = null;
  updateTimerDisplay();
  showTimerMessage("Timer paused.");
}

function stopTimerAndSave() {
  if (timer.running) {
    timer.elapsedMs += Date.now() - timer.startedAt;
  }

  clearInterval(timer.interval);
  timer.interval = null;
  timer.running = false;
  timer.startedAt = null;

  if (timer.elapsedMs <= 0) {
    showTimerMessage("No timer minutes to save.");
    return;
  }

  const minutes = Math.max(1, Math.round(timer.elapsedMs / 60000));
  addTimeEntry("FELLOWSHIP", minutes, str(el.timerNote.value) || "Fellowship timer session");
  showTimerMessage(`Saved ${minutes} fellowship minutes.`);
  el.timerNote.value = "";

  timer.elapsedMs = 0;
  updateTimerDisplay();
}

function resetTimer() {
  clearInterval(timer.interval);
  timer.interval = null;
  timer.running = false;
  timer.startedAt = null;
  timer.elapsedMs = 0;
  updateTimerDisplay();
  showTimerMessage("Timer reset.");
}

function updateTimerDisplay() {
  const totalMs = timer.elapsedMs + (timer.running ? Date.now() - timer.startedAt : 0);
  const totalSeconds = Math.floor(totalMs / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  el.timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function showTimerMessage(message) {
  el.timerMessage.textContent = message;
}

function addTimeEntry(category, minutes, note = "", dateInput = null) {
  const isoDateTime = dateInput
    ? new Date(`${dateInput}T12:00:00`).toISOString()
    : new Date().toISOString();

  state.timeEntries.push({
    id: makeId(),
    dateTime: isoDateTime,
    category,
    minutes: Math.max(1, Math.round(minutes)),
    note,
  });
  saveState();
  renderAll();
}

function getWeeklyStats(referenceDate = new Date()) {
  const weekStart = startOfWeek(referenceDate);
  const weekEnd = new Date(weekStart.getTime() + 7 * dayMs);

  const inWeek = state.timeEntries.filter((entry) => {
    const date = new Date(entry.dateTime);
    return date >= weekStart && date < weekEnd;
  });

  return {
    fellowshipMinutes: sumMinutes(inWeek, "FELLOWSHIP"),
    studyMinutes: sumMinutes(inWeek, "STUDY"),
    workoutMinutes: sumMinutes(inWeek, "WORKOUT"),
    gymSessions: inWeek.filter((entry) => entry.category === "WORKOUT").length,
  };
}

function sumMinutes(entries, category) {
  return entries
    .filter((entry) => entry.category === category)
    .reduce((total, entry) => total + number(entry.minutes, 0), 0);
}

function buildTimeline(commuteMinutes, day) {
  const isWorkDay = [0, 1, 2, 3].includes(day);
  if (!isWorkDay) {
    return [
      { label: "Gym", start: "08:00", end: "09:00" },
      { label: "Fellowship", start: "10:00", end: "11:00" },
      { label: "MBA", start: "13:00", end: "14:00" },
    ];
  }

  return [
    { label: "Commute", start: shiftTime("07:00", -commuteMinutes), end: "07:00" },
    { label: "Work", start: "07:00", end: "18:00" },
    { label: "Commute", start: "18:00", end: shiftTime("18:00", commuteMinutes) },
    { label: "Fellowship", start: "19:00", end: "20:00" },
    { label: "MBA", start: "20:15", end: "21:00" },
    { label: "Gym", start: "21:15", end: "22:00" },
  ];
}

function shiftTime(hhmm, minutesDelta) {
  const [h, m] = hhmm.split(":").map(Number);
  let total = h * 60 + m + minutesDelta;
  if (total < 0) total += 24 * 60;
  if (total >= 24 * 60) total -= 24 * 60;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getNextTask() {
  const open = state.tasks.filter((task) => task.status !== "done");
  if (!open.length) return null;

  const now = Date.now();
  return open
    .map((task) => {
      const dueMs = Math.max(1, new Date(task.dueDate).getTime() - now);
      const urgency = task.estimatedMinutes / 10 + 1000000 / dueMs;
      return { task, urgency };
    })
    .sort((a, b) => b.urgency - a.urgency)[0].task;
}

function getGymStreak(targetSessions) {
  if (targetSessions <= 0) return 0;

  const sessionsByWeek = new Map();
  state.timeEntries
    .filter((entry) => entry.category === "WORKOUT")
    .forEach((entry) => {
      const key = startOfWeek(new Date(entry.dateTime)).toISOString();
      sessionsByWeek.set(key, (sessionsByWeek.get(key) || 0) + 1);
    });

  let streak = 0;
  let cursor = startOfWeek(new Date());

  while (true) {
    const count = sessionsByWeek.get(cursor.toISOString()) || 0;
    if (count >= targetSessions) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 7 * dayMs);
    } else {
      break;
    }
  }

  return streak;
}

function getFinanceResult() {
  return allocateWeek(
    state.settings,
    state.debtPlan,
    state.tuitionPlan,
    state.buckets,
    {
      fellowshipHours: ui.scenario.fellowshipHours,
      overtimeEnabled: ui.scenario.overtimeEnabled,
      referenceDate: new Date(),
    }
  );
}

function allocateWeek(settings, debtPlan, tuitionPlan, buckets, scenarioOverrides = {}) {
  const referenceDate = scenarioOverrides.referenceDate || new Date();

  const fellowshipHours = Math.min(
    scenarioOverrides.fellowshipHours ?? settings.fellowshipPlannedHours,
    settings.fellowshipWeeklyCap
  );

  const overtimeEnabled = scenarioOverrides.overtimeEnabled ?? true;
  const overtimeHours = overtimeEnabled ? settings.amazonOtHours : 0;

  const amazonGross =
    settings.amazonHourlyPay * settings.amazonPlannedHours +
    settings.amazonHourlyPay * overtimeHours * settings.amazonOtMultiplier;
  const fellowshipGross = settings.fellowshipHourlyPay * Math.max(0, fellowshipHours);
  const grossIncome = round2(amazonGross + fellowshipGross);

  const taxes = round2(grossIncome * (settings.taxesPercent / 100));
  const four01k = round2(grossIncome * (settings.four01kPercent / 100));

  const essentials = round2(
    settings.fixedBillsWeekly +
      settings.foodBaselineWeekly +
      settings.insuranceWeekly +
      settings.otherDeductionsWeekly +
      taxes +
      four01k
  );

  const netIncome = round2(grossIncome - taxes - four01k - settings.insuranceWeekly - settings.otherDeductionsWeekly);

  let available = round2(grossIncome - essentials);
  const offTrack = available < 0;

  const emergencyTarget = 1000;
  const emergencyNeed = Math.max(0, emergencyTarget - buckets.EMERGENCY.currentAmount);
  const emergencyWeeklyBase = round2(Math.max(25, netIncome * 0.03));
  const emergencyRequired = round2(Math.min(emergencyNeed, emergencyWeeklyBase));

  const tuitionNeed = Math.max(0, tuitionPlan.amountDue - buckets.TUITION.currentAmount);
  const tuitionRequired = round2(tuitionPlan.weeksUntilDue > 0 ? tuitionNeed / tuitionPlan.weeksUntilDue : tuitionNeed);

  const debtNeed = Math.max(0, debtPlan.balance);
  const requiredDebtPayment = round2(
    debtPlan.weeksRemaining > 0 ? debtNeed / debtPlan.weeksRemaining : debtNeed
  );

  const uberRequired = round2(settings.uberWeekly);
  const steps = [];

  function runStep(label, required) {
    const needed = round2(Math.max(0, required));
    if (offTrack || needed === 0) {
      steps.push({ step: label, required: needed, allocated: 0, funded: needed === 0, partial: false });
      return 0;
    }

    const allocated = round2(Math.min(available, needed));
    available = round2(available - allocated);

    steps.push({
      step: label,
      required: needed,
      allocated,
      funded: allocated >= needed,
      partial: allocated > 0 && allocated < needed,
    });

    return allocated;
  }

  const uberAllocated = runStep("Uber Buffer", uberRequired);
  const emergencyAllocated = runStep("Emergency Starter", emergencyRequired);
  const tuitionAllocated = runStep("Tuition Sinking Fund", tuitionRequired);
  const requiredDebtAllocated = runStep("Debt Required Payment", requiredDebtPayment);

  let extraDebt = 0;
  let goalSavings = 0;

  if (!offTrack && available > 0) {
    const remainingDebt = round2(debtNeed - requiredDebtAllocated);
    if (remainingDebt > 0) {
      extraDebt = round2(available * 0.7);
      goalSavings = round2(available - extraDebt);
    } else {
      goalSavings = round2(available);
    }

    steps.push({
      step: "Overflow Split (70/30)",
      required: 0,
      allocated: round2(extraDebt + goalSavings),
      funded: true,
      partial: false,
    });
  } else {
    steps.push({
      step: "Overflow Split (70/30)",
      required: 0,
      allocated: 0,
      funded: true,
      partial: false,
    });
  }

  const partiallyFundedSteps = steps
    .filter((step) => step.required > 0 && step.allocated < step.required)
    .map((step) => step.step);

  const requiredTotal = round2(uberRequired + emergencyRequired + tuitionRequired + requiredDebtPayment);
  const fundedTotal = round2(uberAllocated + emergencyAllocated + tuitionAllocated + requiredDebtAllocated);

  const weeklyDebtPayment = round2(requiredDebtAllocated + extraDebt);

  return {
    allocations: {
      uberBuffer: uberAllocated,
      emergency: emergencyAllocated,
      tuition: tuitionAllocated,
      requiredDebt: requiredDebtAllocated,
      extraDebt,
      goalSavings,
    },
    steps,
    grossIncome,
    netIncome,
    essentials,
    surplus: round2(grossIncome - essentials),
    projections: {
      emergencyTargetDate: projectedDate(
        buckets.EMERGENCY.currentAmount,
        emergencyTarget,
        emergencyAllocated,
        referenceDate
      ),
      tuitionTargetDate: projectedDate(
        buckets.TUITION.currentAmount,
        tuitionPlan.amountDue,
        tuitionAllocated,
        referenceDate
      ),
      debtPayoffDate: projectedDate(0, debtNeed, weeklyDebtPayment, referenceDate),
    },
    flags: {
      offTrack,
      partialFunding: partiallyFundedSteps.length > 0,
      gap: offTrack ? round2(Math.abs(grossIncome - essentials)) : round2(Math.max(0, requiredTotal - fundedTotal)),
      partiallyFundedSteps,
    },
  };
}

function projectedDate(currentAmount, targetAmount, weeklyContribution, referenceDate) {
  if (targetAmount <= 0 || currentAmount >= targetAmount) return toInputDate(referenceDate);
  if (weeklyContribution <= 0) return null;
  const weeks = Math.ceil((targetAmount - currentAmount) / weeklyContribution);
  return toInputDate(new Date(referenceDate.getTime() + weeks * 7 * dayMs));
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function toInputDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function setProgress(element, current, target) {
  const safeTarget = target > 0 ? target : 1;
  const pct = Math.max(0, Math.min(100, Math.round((current / safeTarget) * 100)));
  element.style.width = `${pct}%`;
}

function assignValue(form, name, value) {
  const input = form.querySelector(`[name='${name}']`);
  if (input) input.value = value;
}

function makeId() {
  return Math.random().toString(36).slice(2, 11);
}

function number(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function str(value) {
  return String(value || "").trim();
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function money(value) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
