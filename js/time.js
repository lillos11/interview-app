export const Category = Object.freeze({
  FELLOWSHIP: "FELLOWSHIP",
  STUDY: "STUDY",
  WORKOUT: "WORKOUT"
});

export function fmtDate(dt) {
  return new Intl.DateTimeFormat(undefined, { weekday:"short", month:"short", day:"2-digit" }).format(dt);
}

export function fmtTime(dt) {
  return new Intl.DateTimeFormat(undefined, { hour:"2-digit", minute:"2-digit" }).format(dt);
}

export function parseHHMM(hhmm) {
  const [h,m] = hhmm.split(":").map(n => Number(n));
  return { h, m };
}

export function startOfPersonalWeek(now, personalWeekStart /* 0=Sun,1=Mon */) {
  const d = new Date(now);
  d.setHours(0,0,0,0);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  // compute how many days to go back to reach weekStart
  const diff = (day - personalWeekStart + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function isSameDay(a, b) {
  return a.getFullYear()===b.getFullYear() &&
         a.getMonth()===b.getMonth() &&
         a.getDate()===b.getDate();
}

export function weekEntries(state, now) {
  const ws = startOfPersonalWeek(now, state.settings.personalWeekStart);
  const we = new Date(ws);
  we.setDate(we.getDate() + 7);

  return state.timeEntries.filter(e => {
    const t = new Date(e.at);
    return t >= ws && t < we;
  });
}

export function sumByCategory(entries) {
  const totals = { FELLOWSHIP:0, STUDY:0, WORKOUT:0 };
  for (const e of entries) {
    totals[e.category] = (totals[e.category] ?? 0) + Number(e.minutes || 0);
  }
  return totals;
}

export function addTimeEntry(state, { category, minutes, note }) {
  state.timeEntries.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    category,
    minutes: Number(minutes),
    note: note?.slice(0,140) ?? ""
  });
}
