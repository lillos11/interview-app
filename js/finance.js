const moneyFmt = new Intl.NumberFormat(undefined, { style:"currency", currency:"USD" });

export function usd(n){ return moneyFmt.format(Number(n||0)); }

export function allocateWeek(settings, scenario = {}) {
  const m = settings.money;

  const amazonRate = scenario.amazonRate ?? m.amazonRate;
  const amazonHours = scenario.amazonHours ?? m.amazonHours;
  const otHours = scenario.otHours ?? m.otHours;
  const otMultiplier = scenario.otMultiplier ?? m.otMultiplier;

  const fellowshipRate = scenario.fellowshipRate ?? m.fellowshipRate;
  const fellowshipHours = scenario.fellowshipHours ?? m.fellowshipHours;
  const fellowshipCap = scenario.fellowshipCap ?? m.fellowshipCap;

  const taxesPct = scenario.taxesPct ?? m.taxesPct;
  const k401Pct = scenario.k401Pct ?? m.k401Pct;

  const insuranceWeekly = scenario.insuranceWeekly ?? m.insuranceWeekly;
  const otherDeductionsWeekly = scenario.otherDeductionsWeekly ?? m.otherDeductionsWeekly;

  const uberWeekly = scenario.uberWeekly ?? m.uberWeekly;
  const fixedBillsWeekly = scenario.fixedBillsWeekly ?? m.fixedBillsWeekly;
  const foodBaselineWeekly = scenario.foodBaselineWeekly ?? m.foodBaselineWeekly;

  const debtBalance = scenario.debtBalance ?? m.debtBalance;
  const debtWeeksRemaining = Math.max(1, Number(scenario.debtWeeksRemaining ?? m.debtWeeksRemaining));

  const tuitionDue = scenario.tuitionDue ?? m.tuitionDue;
  const tuitionWeeksUntilDue = Math.max(1, Number(scenario.tuitionWeeksUntilDue ?? m.tuitionWeeksUntilDue));

  const overflowExtraDebtPct = scenario.overflowExtraDebtPct ?? m.overflowExtraDebtPct;

  // Income
  const amazonGross = (amazonRate * amazonHours) + (amazonRate * otMultiplier * otHours);
  const fellowshipGross = fellowshipRate * Math.min(fellowshipHours, fellowshipCap);
  const gross = amazonGross + fellowshipGross;

  // Deductions
  const taxes = gross * taxesPct;
  const k401Base = (m.k401AppliesToAmazonOnly ? amazonGross : gross);
  const k401 = k401Base * k401Pct;
  const deductions = taxes + k401 + insuranceWeekly + otherDeductionsWeekly;

  const net = gross - deductions;

  // Essentials (note: uber shows both as essential and as bucket deposit)
  const essentials = fixedBillsWeekly + foodBaselineWeekly + insuranceWeekly + otherDeductionsWeekly;

  // Surplus available after essentials
  let remaining = net - essentials;

  const steps = [];
  const mark = (name, need, got) => {
    const status = got >= need ? "FUNDED" : (got > 0 ? "PARTIAL" : "SKIPPED");
    steps.push({ name, need, got, status });
  };

  // Step B: Uber Buffer deposit
  const uberNeed = uberWeekly;
  const uberGot = Math.max(0, Math.min(remaining, uberNeed));
  remaining -= uberGot;
  mark("Uber Buffer deposit", uberNeed, uberGot);

  // Step C: Emergency deposit (max(25, 3% of net)) until $1000
  const emergencyNeed = Math.max(25, 0.03 * net);
  const emergencyGot = Math.max(0, Math.min(remaining, emergencyNeed));
  remaining -= emergencyGot;
  mark("Emergency deposit", emergencyNeed, emergencyGot);

  // Step D: Tuition deposit
  const tuitionNeed = tuitionDue / tuitionWeeksUntilDue;
  const tuitionGot = Math.max(0, Math.min(remaining, tuitionNeed));
  remaining -= tuitionGot;
  mark("Tuition deposit", tuitionNeed, tuitionGot);

  // Step E: Required debt payment
  const debtNeed = debtBalance / debtWeeksRemaining;
  const debtGot = Math.max(0, Math.min(remaining, debtNeed));
  remaining -= debtGot;
  mark("Debt payment (required)", debtNeed, debtGot);

  // Step F: Overflow split
  const overflow = Math.max(0, remaining);
  const extraDebt = overflow * overflowExtraDebtPct;
  const goalSave = overflow - extraDebt;
  remaining -= overflow; // becomes 0
  steps.push({ name:"Overflow → Extra debt", need:0, got:extraDebt, status: extraDebt>0 ? "FUNDED":"SKIPPED" });
  steps.push({ name:"Overflow → Goal savings", need:0, got:goalSave, status: goalSave>0 ? "FUNDED":"SKIPPED" });

  const surplusAfter = net - essentials - uberWeekly; // view uber as essential cost too
  const onTrack = surplusAfter >= 0;

  return {
    gross, net, taxes, k401, deductions,
    essentials, uberWeekly,
    surplusAfterEssentials: net - essentials,
    steps,
    flags: {
      onTrack,
      gap: onTrack ? 0 : Math.abs(surplusAfter)
    }
  };
}
