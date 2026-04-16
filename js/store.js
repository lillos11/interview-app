export const STORAGE_KEY = "lifeos:v1";

export function defaultState() {
  return {
    meta: { version: 1, updatedAt: new Date().toISOString() },
    settings: {
      // Week rules:
      // - personalWeekStart: 1 means Monday
      // - amazonWorkDays: [0..6] where 0=Sunday
      personalWeekStart: 1,
      amazonWorkDays: [0,1,2,3], // Sun–Wed
      amazonWorkStart: "07:00",
      amazonWorkEnd: "18:00",
      commuteMinutesEachWay: 30,

      // Weekly targets (Mon–Sun)
      targets: {
        fellowshipHours: 30,
        studyMinutes: 300,
        gymSessions: 3
      },

      // Money (simple MVP inputs)
      money: {
        amazonRate: 26.5,
        amazonHours: 40,
        otHours: 0,
        otMultiplier: 1.5,

        fellowshipRate: 17,
        fellowshipHours: 30,
        fellowshipCap: 40,

        taxesPct: 0.20,
        k401Pct: 0.15,
        k401AppliesToAmazonOnly: true,

        insuranceWeekly: 60,
        otherDeductionsWeekly: 0,

        uberWeekly: 200,
        fixedBillsWeekly: 500,
        foodBaselineWeekly: 100,

        debtBalance: 2500,
        debtWeeksRemaining: 10,

        tuitionDue: 1800,
        tuitionWeeksUntilDue: 12,

        overflowExtraDebtPct: 0.70
      }
    },
    timeEntries: [],
    money: {
      buckets: {
        uber: { balance: 0 },
        emergency: { balance: 0, target: 1000 },
        tuition: { balance: 0 },
        goal: { balance: 0 }
      }
    },
    ui: {
      theme: "system"
    }
  };
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const st = defaultState();
    saveState(st);
    return st;
  }
  try {
    const st = JSON.parse(raw);
    if (!st?.meta?.version) return defaultState();
    return st;
  } catch {
    const st = defaultState();
    saveState(st);
    return st;
  }
}

export function saveState(state) {
  state.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateState(mutator) {
  const st = loadState();
  mutator(st);
  saveState(st);
  return st;
}

export function exportJSON() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function importJSON(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed?.meta?.version) throw new Error("Invalid LifeOS export.");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}
