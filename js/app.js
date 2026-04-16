import { loadState, updateState, exportJSON, importJSON } from "./store.js";
import { currentRoute, setActiveNav } from "./router.js";
import { Category, addTimeEntry, weekEntries, sumByCategory, fmtDate } from "./time.js";
import { allocateWeek, usd } from "./finance.js";

const $app = document.getElementById("app");
const $toast = document.getElementById("toast");
const $themeBtn = document.getElementById("themeBtn");
const $quickAddBtn = document.getElementById("quickAddBtn");
const $quickAddModal = document.getElementById("quickAddModal");
const $quickAddForm = document.getElementById("quickAddForm");
const $qaType = document.getElementById("qaType");
const $qaMinutes = document.getElementById("qaMinutes");
const $qaNote = document.getElementById("qaNote");
const $qaCancel = document.getElementById("qaCancel");

function toast(msg){
  $toast.textContent = msg;
  $toast.classList.add("show");
  setTimeout(()=> $toast.classList.remove("show"), 2200);
}

function applyTheme(state){
  const pref = state.ui?.theme ?? "system";
  const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = pref === "system" ? (sysDark ? "dark" : "light") : pref;
  document.documentElement.dataset.theme = theme === "dark" ? "" : "light";
}

function minutesToHours(min){ return (min/60); }

function render() {
  const state = loadState();
  applyTheme(state);

  const route = currentRoute();
  setActiveNav(route);

  if (route === "dashboard") return renderDashboard(state);
  if (route === "log") return renderLog(state);
  if (route === "money") return renderMoney(state);
  if (route === "settings") return renderSettings(state);

  location.hash = "#/dashboard";
}

function renderDashboard(state){
  const now = new Date();
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const isAmazonWorkDay = state.settings.amazonWorkDays.includes(day);

  const week = weekEntries(state, now);
  const totals = sumByCategory(week);

  const targetF = state.settings.targets.fellowshipHours;
  const targetS = state.settings.targets.studyMinutes;
  const targetG = state.settings.targets.gymSessions;

  const fellowshipHrs = minutesToHours(totals.FELLOWSHIP);
  const studyMin = totals.STUDY;
  const workoutSessions = state.timeEntries
    .filter(e => e.category === Category.WORKOUT)
    .filter(e => {
      const t = new Date(e.at);
      const ws = startOfWeekCached(state, now);
      const we = new Date(ws); we.setDate(we.getDate()+7);
      return t >= ws && t < we;
    }).length;

  const fPct = Math.min(100, (fellowshipHrs / Math.max(1,targetF))*100);
  const sPct = Math.min(100, (studyMin / Math.max(1,targetS))*100);
  const gPct = Math.min(100, (workoutSessions / Math.max(1,targetG))*100);

  // Priority signals (simple, but effective)
  const moneyAlloc = allocateWeek(state.settings);
  const moneyPriority = moneyAlloc.flags.onTrack
    ? "Money: On track this week."
    : `Money: Off track by ${usd(moneyAlloc.flags.gap)} after essentials + Uber.`;

  const schoolPriority = studyMin < targetS
    ? `School: Behind by ${Math.max(0, targetS - studyMin)} study minutes (Mon–Sun).`
    : "School: Study target hit (Mon–Sun).";

  const healthPriority = workoutSessions < targetG
    ? `Health: ${Math.max(0, targetG - workoutSessions)} workout(s) left to hit weekly target.`
    : "Health: Workout target hit (Mon–Sun).";

  const workBadge = isAmazonWorkDay ? "Amazon Workday (Sun–Wed)" : "Non-workday";

  $app.innerHTML = `
    <section class="card">
      <div class="row" style="align-items:flex-start; justify-content:space-between;">
        <div>
          <div class="h1">Dashboard</div>
          <div class="muted">${fmtDate(now)} • <span class="badge">${workBadge}</span></div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" id="dashStartFellowship">Start Fellowship Timer</button>
          <button class="btn" id="dashLogStudy">Log Study</button>
          <button class="btn" id="dashLogWorkout">Log Workout</button>
        </div>
      </div>

      <div class="hr"></div>

      <div class="row">
        <div class="col">
          <div class="h2">Top 3 Priorities</div>
          <div class="list" style="margin-top:12px;">
            <div class="item"><div><div class="itemTitle">${moneyPriority}</div><div class="itemMeta">Based on your Money settings + dual-week rule.</div></div></div>
            <div class="item"><div><div class="itemTitle">${schoolPriority}</div><div class="itemMeta">Personal week runs Monday–Sunday.</div></div></div>
            <div class="item"><div><div class="itemTitle">${healthPriority}</div><div class="itemMeta">Personal week runs Monday–Sunday.</div></div></div>
          </div>
        </div>

        <div class="col">
          <div class="h2">Weekly Progress (Mon–Sun)</div>

          <div style="margin-top:14px;">
            <div class="row" style="justify-content:space-between;">
              <div>Fellowship</div>
              <div class="kpi">${fellowshipHrs.toFixed(1)} / ${targetF} hrs</div>
            </div>
            <div class="progress" aria-label="Fellowship progress"><div style="width:${fPct}%"></div></div>
          </div>

          <div style="margin-top:14px;">
            <div class="row" style="justify-content:space-between;">
              <div>Study</div>
              <div class="kpi">${studyMin} / ${targetS} min</div>
            </div>
            <div class="progress" aria-label="Study progress"><div style="width:${sPct}%"></div></div>
          </div>

          <div style="margin-top:14px;">
            <div class="row" style="justify-content:space-between;">
              <div>Workouts</div>
              <div class="kpi">${workoutSessions} / ${targetG} sessions</div>
            </div>
            <div class="progress" aria-label="Workout progress"><div style="width:${gPct}%"></div></div>
          </div>

          <div class="hr"></div>
          <div class="muted">
            Amazon schedule is fixed Sun–Wed.
            All weekly targets and summaries use Mon–Sun.
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("dashStartFellowship").onclick = () => (location.hash="#/log?timer=1");
  document.getElementById("dashLogStudy").onclick = () => openQuickAdd(Category.STUDY);
  document.getElementById("dashLogWorkout").onclick = () => openQuickAdd(Category.WORKOUT);
}

function renderLog(state){
  const now = new Date();
  const week = weekEntries(state, now);
  const totals = sumByCategory(week);

  $app.innerHTML = `
    <section class="card">
      <div class="row" style="align-items:flex-start; justify-content:space-between;">
        <div>
          <div class="h1">Log</div>
          <div class="muted">Time logging + weekly totals (Mon–Sun)</div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btnPrimary" id="startTimerBtn">Start Fellowship Timer</button>
          <button class="btn" id="logManualBtn">Quick Add</button>
        </div>
      </div>

      <div class="hr"></div>

      <div class="row">
        <div class="col">
          <div class="h2">Weekly Totals (Mon–Sun)</div>
          <div class="list" style="margin-top:12px;">
            <div class="item">
              <div>
                <div class="itemTitle">Fellowship</div>
                <div class="itemMeta">${(totals.FELLOWSHIP/60).toFixed(1)} hours</div>
              </div>
              <div class="kpi">${totals.FELLOWSHIP} min</div>
            </div>
            <div class="item">
              <div>
                <div class="itemTitle">Study</div>
                <div class="itemMeta">${totals.STUDY} minutes</div>
              </div>
              <div class="kpi">${totals.STUDY} min</div>
            </div>
            <div class="item">
              <div>
                <div class="itemTitle">Workouts</div>
                <div class="itemMeta">${countWorkoutsThisWeek(state, now)} sessions</div>
              </div>
              <div class="kpi">${totals.WORKOUT} min</div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="h2">Recent Entries</div>
          <div class="list" style="margin-top:12px;" id="recentList"></div>
        </div>
      </div>
    </section>
  `;

  const recent = state.timeEntries.slice(0, 12);
  const $recent = document.getElementById("recentList");
  $recent.innerHTML = recent.length ? "" : `<div class="muted">No entries yet. Use Quick Add.</div>`;
  for (const e of recent) {
    const d = new Date(e.at);
    $recent.insertAdjacentHTML("beforeend", `
      <div class="item">
        <div>
          <div class="itemTitle">${e.category}</div>
          <div class="itemMeta">${fmtDate(d)} • ${e.minutes} min${e.note ? " • " + escapeHtml(e.note) : ""}</div>
        </div>
        <button class="btn btnGhost" data-del="${e.id}" aria-label="Delete">Delete</button>
      </div>
    `);
  }

  $recent.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = () => {
      const id = btn.getAttribute("data-del");
      updateState(st => {
        st.timeEntries = st.timeEntries.filter(x => x.id !== id);
      });
      toast("Deleted.");
      render();
    };
  });

  document.getElementById("startTimerBtn").onclick = () => {
    // MVP: just opens Quick Add with default 60. Codex can upgrade to real running timer.
    openQuickAdd(Category.FELLOWSHIP, 60);
  };
  document.getElementById("logManualBtn").onclick = () => openQuickAdd();
}

function renderMoney(state){
  const m = state.settings.money;
  const scenario = { fellowshipHours: m.fellowshipHours };
  const alloc = allocateWeek(state.settings, scenario);

  $app.innerHTML = `
    <section class="card">
      <div class="row" style="align-items:flex-start; justify-content:space-between;">
        <div>
          <div class="h1">Money</div>
          <div class="muted">Dual-track savings + debt payoff engine</div>
        </div>
        <div class="badge">
          <span>${alloc.flags.onTrack ? "On Track" : "Off Track"}</span>
          <span class="kpi">${alloc.flags.onTrack ? "" : ("Gap " + usd(alloc.flags.gap))}</span>
        </div>
      </div>

      <div class="hr"></div>

      <div class="row">
        <div class="col">
          <div class="h2">Weekly Summary</div>
          <div class="list" style="margin-top:12px;">
            <div class="item"><div><div class="itemTitle">Gross</div><div class="itemMeta">Amazon + Fellowship</div></div><div class="kpi">${usd(alloc.gross)}</div></div>
            <div class="item"><div><div class="itemTitle">Net</div><div class="itemMeta">After taxes + 401k + deductions</div></div><div class="kpi">${usd(alloc.net)}</div></div>
            <div class="item"><div><div class="itemTitle">Essentials</div><div class="itemMeta">Bills + food baseline + deductions</div></div><div class="kpi">${usd(alloc.essentials)}</div></div>
            <div class="item"><div><div class="itemTitle">Remaining after essentials</div><div class="itemMeta">Available for buckets/payoff</div></div><div class="kpi">${usd(alloc.surplusAfterEssentials)}</div></div>
          </div>
        </div>

        <div class="col">
          <div class="h2">Allocator (Mon–Sun plan, regardless of Amazon days)</div>
          <div class="list" style="margin-top:12px;">
            ${alloc.steps.map(s => `
              <div class="item">
                <div>
                  <div class="itemTitle">${escapeHtml(s.name)}</div>
                  <div class="itemMeta">${s.status} • Need ${usd(s.need)} • Funded ${usd(s.got)}</div>
                </div>
                <div class="badge">${s.status}</div>
              </div>
            `).join("")}
          </div>

          <div class="hr"></div>
          <div class="grid2">
            <button class="btn" id="scenario25">Scenario: 25 fellowship hrs</button>
            <button class="btn" id="scenario35">Scenario: 35 fellowship hrs</button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("scenario25").onclick = () => showScenario(state, 25);
  document.getElementById("scenario35").onclick = () => showScenario(state, 35);
}

function renderSettings(state){
  const s = state.settings;
  const m = s.money;

  $app.innerHTML = `
    <section class="card">
      <div class="row" style="align-items:flex-start; justify-content:space-between;">
        <div>
          <div class="h1">Settings</div>
          <div class="muted">Amazon schedule is Sun–Wed. Weekly tracking is Mon–Sun.</div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" id="exportBtn">Export JSON</button>
          <button class="btn" id="importBtn">Import JSON</button>
          <button class="btn btnGhost" id="resetBtn">Reset</button>
        </div>
      </div>

      <div class="hr"></div>

      <div class="row">
        <div class="col">
          <div class="h2">Weekly Rules</div>
          <div class="muted" style="margin-top:8px;">
            Personal week = Monday–Sunday (used for targets, progress, and totals).
          </div>

          <div style="margin-top:14px;" class="grid2">
            <label class="field">
              <span>Personal week start</span>
              <select id="personalWeekStart">
                <option value="1" selected>Monday</option>
                <option value="0">Sunday</option>
              </select>
            </label>
            <label class="field">
              <span>Commute (minutes each way)</span>
              <input id="commuteMin" type="number" min="0" step="5" value="${s.commuteMinutesEachWay}" />
            </label>
          </div>

          <div class="hr"></div>
          <div class="h2">Targets (Mon–Sun)</div>
          <div class="grid2" style="margin-top:12px;">
            <label class="field">
              <span>Fellowship hours/week</span>
              <input id="targetF" type="number" min="0" step="1" value="${s.targets.fellowshipHours}" />
            </label>
            <label class="field">
              <span>Study minutes/week</span>
              <input id="targetS" type="number" min="0" step="10" value="${s.targets.studyMinutes}" />
            </label>
            <label class="field">
              <span>Gym sessions/week</span>
              <input id="targetG" type="number" min="0" step="1" value="${s.targets.gymSessions}" />
            </label>
          </div>
        </div>

        <div class="col">
          <div class="h2">Money (weekly)</div>
          <div class="grid2" style="margin-top:12px;">
            <label class="field"><span>Amazon rate</span><input id="amazonRate" type="number" step="0.01" value="${m.amazonRate}"></label>
            <label class="field"><span>Amazon hours</span><input id="amazonHours" type="number" step="1" value="${m.amazonHours}"></label>

            <label class="field"><span>Fellowship rate</span><input id="fRate" type="number" step="0.01" value="${m.fellowshipRate}"></label>
            <label class="field"><span>Fellowship hours</span><input id="fHours" type="number" step="1" value="${m.fellowshipHours}"></label>

            <label class="field"><span>Taxes % (0.20 = 20%)</span><input id="taxPct" type="number" step="0.01" value="${m.taxesPct}"></label>
            <label class="field"><span>401k %</span><input id="kPct" type="number" step="0.01" value="${m.k401Pct}"></label>

            <label class="field"><span>Uber weekly</span><input id="uberW" type="number" step="1" value="${m.uberWeekly}"></label>
            <label class="field"><span>Fixed bills weekly</span><input id="billsW" type="number" step="1" value="${m.fixedBillsWeekly}"></label>

            <label class="field"><span>Food baseline weekly</span><input id="foodW" type="number" step="1" value="${m.foodBaselineWeekly}"></label>
            <label class="field"><span>Insurance weekly</span><input id="insW" type="number" step="1" value="${m.insuranceWeekly}"></label>

            <label class="field"><span>Debt balance</span><input id="debtBal" type="number" step="1" value="${m.debtBalance}"></label>
            <label class="field"><span>Debt weeks remaining</span><input id="debtW" type="number" step="1" value="${m.debtWeeksRemaining}"></label>

            <label class="field"><span>Tuition due</span><input id="tuitDue" type="number" step="1" value="${m.tuitionDue}"></label>
            <label class="field"><span>Tuition weeks until due</span><input id="tuitW" type="number" step="1" value="${m.tuitionWeeksUntilDue}"></label>
          </div>

          <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btnPrimary" id="saveSettings">Save Settings</button>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("saveSettings").onclick = () => {
    updateState(st => {
      st.settings.personalWeekStart = Number(document.getElementById("personalWeekStart").value);
      st.settings.commuteMinutesEachWay = Number(document.getElementById("commuteMin").value);

      st.settings.targets.fellowshipHours = Number(document.getElementById("targetF").value);
      st.settings.targets.studyMinutes = Number(document.getElementById("targetS").value);
      st.settings.targets.gymSessions = Number(document.getElementById("targetG").value);

      const mm = st.settings.money;
      mm.amazonRate = Number(document.getElementById("amazonRate").value);
      mm.amazonHours = Number(document.getElementById("amazonHours").value);
      mm.fellowshipRate = Number(document.getElementById("fRate").value);
      mm.fellowshipHours = Number(document.getElementById("fHours").value);
      mm.taxesPct = Number(document.getElementById("taxPct").value);
      mm.k401Pct = Number(document.getElementById("kPct").value);
      mm.uberWeekly = Number(document.getElementById("uberW").value);
      mm.fixedBillsWeekly = Number(document.getElementById("billsW").value);
      mm.foodBaselineWeekly = Number(document.getElementById("foodW").value);
      mm.insuranceWeekly = Number(document.getElementById("insW").value);
      mm.debtBalance = Number(document.getElementById("debtBal").value);
      mm.debtWeeksRemaining = Number(document.getElementById("debtW").value);
      mm.tuitionDue = Number(document.getElementById("tuitDue").value);
      mm.tuitionWeeksUntilDue = Number(document.getElementById("tuitW").value);
    });
    toast("Settings saved.");
    render();
  };

  document.getElementById("exportBtn").onclick = async () => {
    const json = exportJSON();
    await navigator.clipboard.writeText(json);
    toast("Export copied to clipboard.");
  };

  document.getElementById("importBtn").onclick = () => {
    const txt = prompt("Paste LifeOS export JSON:");
    if (!txt) return;
    try {
      importJSON(txt);
      toast("Imported.");
      render();
    } catch {
      toast("Import failed (invalid JSON).");
    }
  };

  document.getElementById("resetBtn").onclick = () => {
    if (!confirm("Reset LifeOS to defaults? This clears all data.")) return;
    localStorage.removeItem("lifeos:v1");
    toast("Reset complete.");
    render();
  };
}

// Helpers
import { startOfPersonalWeek } from "./time.js";

function startOfWeekCached(state, now){
  return startOfPersonalWeek(now, state.settings.personalWeekStart);
}
function countWorkoutsThisWeek(state, now){
  const ws = startOfWeekCached(state, now);
  const we = new Date(ws); we.setDate(we.getDate()+7);
  return state.timeEntries.filter(e => e.category === Category.WORKOUT).filter(e=>{
    const t = new Date(e.at);
    return t>=ws && t<we;
  }).length;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openQuickAdd(category=null, defaultMinutes=null){
  if (category) $qaType.value = category;
  if (defaultMinutes) $qaMinutes.value = String(defaultMinutes);
  $qaNote.value = "";
  $quickAddModal.showModal();
}

function showScenario(state, fellowshipHours){
  const scenario = { fellowshipHours };
  const alloc = allocateWeek(state.settings, scenario);
  const deltaNet = alloc.net - allocateWeek(state.settings).net;

  alert(
`Scenario: Fellowship ${fellowshipHours} hrs/week

Net: ${usd(alloc.net)} (${deltaNet>=0?"+":""}${usd(deltaNet)} vs current)
Essentials: ${usd(alloc.essentials)}
Remaining after essentials: ${usd(alloc.surplusAfterEssentials)}

Status: ${alloc.flags.onTrack ? "ON TRACK" : "OFF TRACK (gap " + usd(alloc.flags.gap) + ")"}
`);
}

function bindGlobalUI(){
  // Theme toggle
  $themeBtn.onclick = () => {
    updateState(st => {
      const cur = st.ui.theme ?? "system";
      st.ui.theme = cur === "system" ? "dark" : (cur === "dark" ? "light" : "system");
    });
    const state = loadState();
    applyTheme(state);
    toast(`Theme: ${state.ui.theme}`);
  };

  // Quick Add
  $quickAddBtn.onclick = () => openQuickAdd();
  $qaCancel.onclick = () => $quickAddModal.close();

  $quickAddForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const type = $qaType.value;
    const minutes = Number($qaMinutes.value);
    const note = $qaNote.value;

    updateState(st => addTimeEntry(st, { category: type, minutes, note }));
    $quickAddModal.close();
    toast("Saved.");
    render();
  });
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  bindGlobalUI();
  if (!location.hash) location.hash = "#/dashboard";
  render();
});
