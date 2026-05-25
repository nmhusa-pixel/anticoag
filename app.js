const HOUR = 60 * 60 * 1000;

const procedureTypes = {
  neuraxial: {
    label: "Regional / deep plexus block",
    risk: "neuraxial",
    text: "Uses ASRA fifth-edition regional/deep plexus timing."
  },
  painHigh: {
    label: "Pain procedure - high risk",
    risk: "high",
    text: "Examples: spinal cord stimulation trial/implant, DRG stimulation, intrathecal catheter/pump implant, vertebroplasty/kyphoplasty, percutaneous decompression laminotomy, epiduroscopy or epidural decompression."
  },
  painIntermediate: {
    label: "Pain procedure - medium risk (intermediate)",
    risk: "intermediate",
    text: "Examples: interlaminar ESI, transforaminal ESI, cervical facet medial branch block/RFA, intradiscal procedures, sympathetic blocks, trigeminal or sphenopalatine ganglion blocks."
  },
  painLow: {
    label: "Pain procedure - low risk",
    risk: "low",
    text: "Examples: peripheral nerve blocks, peripheral joint or musculoskeletal injections, trigger point or piriformis injections, SI joint injection, sacral lateral branch blocks, thoracic/lumbar facet medial branch block/RFA, many peripheral nerve stimulation procedures."
  }
};

const painRiskOrder = ["low", "intermediate", "high"];

const rules = {
  aspirin: {
    name: "Aspirin / NSAID",
    options: [{ id: "standard", label: "Any dose" }],
    holdHours: () => 0,
    restartHours: 0,
    catheter: "No additional regional timing restriction when used alone.",
    summary: "NSAIDs, including aspirin, do not create a level of risk that interferes with regional or deep plexus/peripheral blocks when used alone.",
    notes: ["Avoid treating this as low risk when other anticoagulants or antiplatelets are also active."]
  },
  clopidogrel: {
    name: "Clopidogrel",
    options: [{ id: "standard", label: "P2Y12 therapy" }],
    holdHours: () => 5 * 24,
    rangeText: "5-7 days",
    restartHours: 0,
    catheter: "May be resumed immediately after catheter removal if no loading dose is used. With a loading dose, wait 6 hours after removal.",
    summary: "Suggested interval from discontinuation to needle placement is 5-7 days.",
    notes: ["Catheters may be maintained for 1-2 days only if no loading dose is given."]
  },
  prasugrel: {
    name: "Prasugrel",
    options: [{ id: "standard", label: "P2Y12 therapy" }],
    holdHours: () => 7 * 24,
    rangeText: "7-10 days",
    restartHours: 0,
    catheter: "Do not maintain regional or deep plexus/peripheral catheters on prasugrel.",
    summary: "Suggested interval from discontinuation to needle placement is 7-10 days.",
    notes: ["May be resumed immediately after catheter removal if no loading dose is used."]
  },
  ticagrelor: {
    name: "Ticagrelor",
    options: [{ id: "standard", label: "P2Y12 therapy" }],
    holdHours: () => 5 * 24,
    rangeText: "5 days",
    restartHours: 24,
    catheter: "Do not maintain regional or deep plexus/peripheral catheters on ticagrelor.",
    summary: "Suggested interval from discontinuation to needle placement is 5 days.",
    notes: ["Restart is suggested 24 hours after catheter removal or needle placement."]
  },
  cangrelor: {
    name: "Cangrelor",
    options: [{ id: "infusion", label: "IV infusion" }],
    holdHours: () => 3,
    rangeText: "3 hours",
    restartHours: 8,
    catheter: "Avoid maintaining catheters during cangrelor therapy.",
    summary: "Suggested interval from discontinuation to needle placement is 3 hours.",
    notes: ["Restart is suggested 8 hours after catheter removal or needle placement."]
  },
  cilostazol: {
    name: "Cilostazol",
    options: [{ id: "standard", label: "Antiplatelet therapy" }],
    holdHours: () => 2 * 24,
    rangeText: "2 days",
    restartHours: 6,
    catheter: "Remove catheter before resuming cilostazol.",
    summary: "Suggested interval from discontinuation to needle placement is 2 days.",
    notes: ["First postoperative dose is suggested 6 hours after catheter removal."]
  },
  warfarin: {
    name: "Warfarin",
    options: [{ id: "standard", label: "Chronic therapy" }],
    holdHours: () => 5 * 24,
    rangeText: "5 days plus normalized INR",
    restartHours: 0,
    catheter: "Remove regional catheters when INR is less than 1.5 when feasible, with continued neurologic assessment.",
    summary: "Stop 5 days before needle placement and confirm the INR has normalized before block.",
    notes: ["This calculator cannot verify INR. Treat an unknown or elevated INR as not cleared."]
  },
  apixaban: {
    name: "Apixaban",
    options: [
      { id: "low", label: "Low dose prophylaxis" },
      { id: "high", label: "High dose / therapeutic" }
    ],
    holdHours: ({ dose }) => dose === "low" ? 36 : 72,
    rangeText: ({ dose }) => dose === "low" ? "36 hours" : "72 hours",
    restartHours: ({ dose }) => dose === "low" ? 6 : 24,
    catheter: "For unanticipated dosing with a catheter in place, withhold apixaban until the relevant hold interval or an acceptable calibrated anti-Xa/apixaban level is documented.",
    summary: "Low-dose apixaban: 36 hours. High-dose apixaban: 72 hours. Acceptable residual level may be used when timing is shorter.",
    level: "Acceptable level described by the guideline: apixaban concentration below 30 ng/mL or calibrated anti-Xa activity at or below 0.1 IU/mL.",
    notes: ["High-dose therapy should not be administered until at least 24 hours after needle placement or catheter removal.", "Low-dose therapy restart interval is 6 hours after needle placement or catheter removal."]
  },
  rivaroxaban: {
    name: "Rivaroxaban",
    options: [
      { id: "low", label: "Low dose prophylaxis" },
      { id: "high", label: "High dose / therapeutic" }
    ],
    holdHours: ({ dose, renal }) => dose === "low" && renal === "lt30" ? 30 : dose === "low" ? 24 : 72,
    rangeText: ({ dose, renal }) => dose === "low" && renal === "lt30" ? "30 hours" : dose === "low" ? "24 hours" : "72 hours",
    restartHours: ({ dose }) => dose === "low" ? 6 : 24,
    catheter: "For unanticipated dosing with a catheter in place, withhold rivaroxaban until the relevant hold interval or an acceptable calibrated anti-Xa/rivaroxaban level is documented.",
    summary: "Low-dose rivaroxaban: 24 hours, extended to 30 hours when CrCl is below 30 mL/min. High-dose rivaroxaban: 72 hours.",
    level: "Acceptable level described by the guideline: rivaroxaban concentration below 30 ng/mL or calibrated anti-Xa activity at or below 0.1 IU/mL.",
    notes: ["High-dose therapy should not be administered until at least 24 hours after needle placement or catheter removal."]
  },
  edoxaban: {
    name: "Edoxaban",
    options: [
      { id: "low", label: "Low dose" },
      { id: "high", label: "High dose / therapeutic" }
    ],
    holdHours: ({ dose }) => dose === "low" ? 24 : 72,
    rangeText: ({ dose }) => dose === "low" ? "24 hours" : "72 hours",
    restartHours: ({ dose }) => dose === "low" ? 6 : 24,
    catheter: "For unanticipated dosing with a catheter in place, withhold edoxaban until the relevant hold interval or an acceptable calibrated anti-Xa/edoxaban level is documented.",
    summary: "Low-dose edoxaban: 24 hours. High-dose edoxaban: 72 hours.",
    level: "Acceptable level described by the guideline: edoxaban concentration below 30 ng/mL or calibrated anti-Xa activity at or below 0.1 IU/mL."
  },
  dabigatran: {
    name: "Dabigatran",
    options: [
      { id: "low", label: "Low dose" },
      { id: "high", label: "High dose / therapeutic" }
    ],
    holdHours: ({ dose, renal }) => {
      if (renal === "lt30") return Infinity;
      if (dose === "low") return renal === "30-49" ? 72 : 48;
      if (renal === "30-49") return 120;
      return 72;
    },
    rangeText: ({ dose, renal }) => {
      if (renal === "lt30") return "Avoid procedure unless drug level confirms clearance";
      if (dose === "low") return renal === "30-49" ? "72 hours" : "48 hours";
      return renal === "30-49" ? "120 hours" : "72 hours";
    },
    restartHours: ({ dose }) => dose === "low" ? 6 : 24,
    catheter: "For unanticipated dosing with a catheter in place, withhold dabigatran until the relevant hold interval or an acceptable dabigatran/aPTT/dTT level is documented.",
    summary: "Dabigatran hold depends strongly on renal function: high dose 72 hours when CrCl is at least 50, 120 hours for CrCl 30-49; low dose 48 or 72 hours.",
    level: "Acceptable level described by the guideline: dabigatran concentration below 30 ng/mL. Normal aPTT or dilute thrombin time can also indicate minimal residual effect.",
    notes: ["This procedure is not suggested when CrCl is below 30 mL/min unless a drug-specific assay confirms acceptable residual activity."]
  },
  ivHeparin: {
    name: "Unfractionated heparin IV",
    options: [{ id: "infusion", label: "Continuous infusion" }],
    holdHours: () => 4,
    rangeText: "4-6 hours plus normal coagulation status",
    restartHours: 1,
    catheter: "Stop infusion 4-6 hours and assess coagulation before catheter manipulation. Restart at least 1 hour after needle placement or catheter removal.",
    summary: "Discontinue IV heparin 4-6 hours before placement and verify normal coagulation status.",
    notes: ["Delay IV heparin administration for at least 1 hour after needle placement.", "Review platelet count if heparin exposure exceeds 4 days."]
  },
  scHeparinLow: {
    name: "Unfractionated heparin SQ",
    options: [
      { id: "low", label: "5,000 units BID/TID" },
      { id: "intermediate", label: "7,500-10,000 units BID or <= 20,000/day" },
      { id: "high", label: "> 10,000/dose or > 20,000/day" }
    ],
    holdHours: ({ dose }) => dose === "low" ? 4 : dose === "intermediate" ? 12 : 24,
    rangeText: ({ dose }) => dose === "low" ? "4-6 hours" : dose === "intermediate" ? "12 hours" : "24 hours plus coagulation assessment",
    restartHours: 1,
    catheter: "Catheter management depends on total daily dose. Higher-dose postoperative SQ heparin requires individualized risk assessment and neurologic monitoring.",
    summary: "SQ UFH hold: 4-6 hours for 5,000 units BID/TID, 12 hours for intermediate dosing, and 24 hours for higher-dose regimens.",
    notes: ["Assess coagulation status for intermediate and high-dose regimens.", "Review platelet count if heparin exposure exceeds 4 days."]
  },
  enoxaparin: {
    name: "LMWH / enoxaparin",
    options: [
      { id: "low", label: "Low dose prophylaxis" },
      { id: "high", label: "Therapeutic dose" }
    ],
    holdHours: ({ dose }) => dose === "low" ? 12 : 24,
    rangeText: ({ dose }) => dose === "low" ? "12 hours" : "24 hours",
    restartHours: ({ dose }) => dose === "low" ? 12 : 24,
    catheter: "Do not combine an indwelling regional catheter with therapeutic LMWH. Twice-daily prophylaxis requires catheter removal before LMWH is initiated.",
    summary: "Needle placement should occur at least 12 hours after low-dose LMWH and 24 hours after therapeutic-dose LMWH.",
    notes: ["For twice-daily low-dose LMWH, first dose should be the following day and at least 12 hours after needle/catheter placement.", "For single-daily low-dose LMWH, remove catheter 12 hours after last dose and restart at least 4 hours after removal."]
  },
  fondaparinux: {
    name: "Fondaparinux",
    options: [
      { id: "low", label: "Low dose 2.5 mg daily" },
      { id: "high", label: "High dose / therapeutic" }
    ],
    holdHours: ({ dose }) => dose === "low" ? 36 : Infinity,
    rangeText: ({ dose }) => dose === "low" ? "36 hours" : "Avoid procedure unless anti-Xa confirms low/no activity",
    restartHours: 6,
    catheter: "Remove catheter at least 6 hours before the first postoperative fondaparinux dose.",
    summary: "Low-dose fondaparinux should be held 36 hours. High-dose fondaparinux is generally not suitable for these techniques unless an acceptable drug-specific anti-Xa level is documented.",
    notes: ["Use caution because sustained and irreversible antithrombin-mediated factor Xa inhibition limits rescue options."]
  },
  thrombolytic: {
    name: "Thrombolytic / fibrinolytic",
    options: [{ id: "standard", label: "Alteplase, tenecteplase, similar agents" }],
    holdHours: () => 48,
    rangeText: "At least 48 hours and normal coagulation/fibrinogen",
    restartHours: 48,
    catheter: "Avoid these procedures when fibrinolytic therapy is planned. If given unexpectedly with a catheter in place, perform frequent neurologic checks.",
    summary: "Needle placement should be avoided for at least 48 hours after thrombolytic/fibrinolytic therapy and until coagulation studies, including fibrinogen, are normal.",
    notes: ["This is a high-risk scenario. Consult anesthesia pain/regional leadership and the treating service."]
  }
};

const el = {
  procedureType: document.querySelector("#procedureType"),
  bleedingModifier: document.querySelector("#bleedingModifier"),
  procedureRiskPill: document.querySelector("#procedureRiskPill"),
  procedureRiskText: document.querySelector("#procedureRiskText"),
  medication: document.querySelector("#medication"),
  doseType: document.querySelector("#doseType"),
  renal: document.querySelector("#renalFunction"),
  lastDose: document.querySelector("#lastDose"),
  procedureTime: document.querySelector("#procedureTime"),
  catheterFields: document.querySelector("#catheterFields"),
  catheterAction: document.querySelector("#catheterAction"),
  catheterRemoval: document.querySelector("#catheterRemoval"),
  bloodyTap: document.querySelector("#bloodyTap"),
  labCleared: document.querySelector("#labCleared"),
  riskBand: document.querySelector("#riskBand"),
  earliestTime: document.querySelector("#earliestTime"),
  minimumHold: document.querySelector("#minimumHold"),
  restartGuidance: document.querySelector("#restartGuidance"),
  elapsedBar: document.querySelector("#elapsedBar"),
  notesList: document.querySelector("#notesList"),
  selectedRuleTitle: document.querySelector("#selectedRuleTitle"),
  selectedRuleText: document.querySelector("#selectedRuleText"),
  resetButton: document.querySelector("#resetButton"),
  clockChip: document.querySelector("#clockChip")
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function toLocalInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(date) {
  if (!date || Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatHours(hours, rangeText) {
  if (rangeText) return rangeText;
  if (!Number.isFinite(hours)) return "Not recommended without lab clearance";
  if (hours === 0) return "No hold required";
  if (hours % 24 === 0) return `${hours / 24} day${hours === 24 ? "" : "s"}`;
  return `${hours} hours`;
}

function selectedContext() {
  return document.querySelector("input[name='context']:checked").value;
}

function populateProcedures() {
  Object.entries(procedureTypes).forEach(([id, procedure]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = procedure.label;
    el.procedureType.append(option);
  });
}

function populateMedication() {
  Object.entries(rules).forEach(([id, rule]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = rule.name;
    el.medication.append(option);
  });
}

function populateDoseOptions() {
  const rule = rules[el.medication.value];
  el.doseType.replaceChildren();
  rule.options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    el.doseType.append(option);
  });
}

function inputDate(node) {
  return node.value ? new Date(node.value) : null;
}

function currentParams() {
  return {
    dose: el.doseType.value,
    renal: el.renal.value,
    risk: effectiveProcedureRisk()
  };
}

function effectiveProcedureRisk() {
  const procedure = procedureTypes[el.procedureType.value];
  if (procedure.risk === "neuraxial") return "neuraxial";
  if (el.bleedingModifier.value !== "upgrade") return procedure.risk;
  const index = painRiskOrder.indexOf(procedure.risk);
  return painRiskOrder[Math.min(index + 1, painRiskOrder.length - 1)];
}

function painProcedureGuidance(ruleId, rule, params) {
  const risk = params.risk;
  if (risk === "neuraxial") return null;
  const low = risk === "low";
  const riskLabel = risk === "intermediate" ? "medium/intermediate" : risk;
  const highOrIntermediate = risk === "high" || risk === "intermediate";
  const guidance = {
    holdHours: rule.holdHours(params),
    restartHours: typeof rule.restartHours === "function" ? rule.restartHours(params) : rule.restartHours,
    rangeText: typeof rule.rangeText === "function" ? rule.rangeText(params) : rule.rangeText,
    notes: [`Pain-procedure risk category applied: ${riskLabel}.`]
  };

  if (ruleId === "aspirin") {
    guidance.holdHours = risk === "high" ? 6 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = risk === "high" ? "6 days for primary prophylaxis; shared decision if secondary prophylaxis" : risk === "intermediate" ? "Shared assessment; consider hold for cervical interlaminar ESI or stellate ganglion block" : "No routine hold";
    guidance.notes.push("For aspirin used for secondary prevention, coordinate the decision with the prescribing clinician.");
  } else if (ruleId === "clopidogrel") {
    guidance.holdHours = highOrIntermediate ? 7 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "7 days" : "No routine hold; shared assessment";
  } else if (ruleId === "prasugrel") {
    guidance.holdHours = highOrIntermediate ? 7 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "7-10 days" : "No routine hold; shared assessment";
  } else if (ruleId === "ticagrelor") {
    guidance.holdHours = highOrIntermediate ? 5 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "5 days" : "No routine hold; shared assessment";
  } else if (ruleId === "cangrelor") {
    guidance.holdHours = highOrIntermediate ? 3 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "3 hours" : "Shared assessment";
  } else if (ruleId === "cilostazol") {
    guidance.holdHours = risk === "high" ? 2 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = risk === "high" ? "2 days" : "No routine hold";
  } else if (ruleId === "warfarin") {
    guidance.holdHours = highOrIntermediate ? 5 * 24 : 0;
    guidance.restartHours = low ? 0 : 6;
    guidance.rangeText = highOrIntermediate ? "5 days plus normal INR" : "No routine hold; shared assessment";
  } else if (["apixaban", "rivaroxaban", "edoxaban"].includes(ruleId)) {
    guidance.holdHours = highOrIntermediate ? 3 * 24 : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "3 days" : "Shared assessment and risk stratification";
  } else if (ruleId === "dabigatran") {
    guidance.holdHours = highOrIntermediate ? (params.renal === "30-49" || params.renal === "lt30" ? 5 * 24 : 4 * 24) : 0;
    guidance.restartHours = 24;
    guidance.rangeText = highOrIntermediate ? "4 days; 5-6 days with impaired renal function" : "Shared assessment and risk stratification";
  } else if (ruleId === "ivHeparin") {
    guidance.holdHours = 6;
    guidance.restartHours = 2;
    guidance.rangeText = "6 hours";
  } else if (ruleId === "scHeparinLow") {
    guidance.holdHours = risk === "high" ? 24 : 6;
    guidance.restartHours = low ? 2 : 8;
    guidance.rangeText = risk === "high" ? "24 hours" : "6 hours";
  } else if (ruleId === "enoxaparin") {
    guidance.holdHours = params.dose === "low" ? 12 : 24;
    guidance.restartHours = low ? 4 : 24;
    guidance.rangeText = params.dose === "low" ? "12 hours" : "24 hours";
  } else if (ruleId === "fondaparinux") {
    guidance.holdHours = highOrIntermediate ? 4 * 24 : 0;
    guidance.restartHours = low ? 6 : 24;
    guidance.rangeText = highOrIntermediate ? "4 days" : "Shared assessment and risk stratification";
  } else if (ruleId === "thrombolytic") {
    guidance.holdHours = 48;
    guidance.restartHours = Infinity;
    guidance.rangeText = "48 hours";
  }

  if (low) guidance.notes.push("Low-risk pain procedures often allow continuation for selected agents, but shared assessment is still required when thrombotic or bleeding risks are unusual.");
  if (el.bleedingModifier.value === "upgrade") guidance.notes.push("Bleeding-risk modifier upgraded the procedure one category, consistent with ASRA pain-procedure guidance.");
  return guidance;
}

function setNotes(notes) {
  el.notesList.replaceChildren();
  notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    el.notesList.append(li);
  });
}

function calculate() {
  const ruleId = el.medication.value;
  const rule = rules[ruleId];
  const params = currentParams();
  const lastDose = inputDate(el.lastDose);
  const plannedProcedure = inputDate(el.procedureTime);
  const removal = inputDate(el.catheterRemoval);
  const context = selectedContext();
  const painGuidance = painProcedureGuidance(ruleId, rule, params);
  const holdHours = painGuidance ? painGuidance.holdHours : rule.holdHours(params);
  const restartHours = painGuidance ? painGuidance.restartHours : typeof rule.restartHours === "function" ? rule.restartHours(params) : rule.restartHours;
  const rangeText = painGuidance ? painGuidance.rangeText : typeof rule.rangeText === "function" ? rule.rangeText(params) : rule.rangeText;
  const notes = [...(rule.notes || [])];
  if (painGuidance) notes.push(...painGuidance.notes);

  const selectedProcedure = procedureTypes[el.procedureType.value];
  const effectiveRisk = effectiveProcedureRisk();
  el.procedureRiskPill.className = effectiveRisk === "neuraxial" ? "" : effectiveRisk;
  const effectiveRiskLabel = effectiveRisk === "intermediate" ? "medium" : effectiveRisk;
  el.procedureRiskPill.textContent = effectiveRisk === "neuraxial" ? "Regional" : `${effectiveRiskLabel} risk`;
  el.procedureRiskText.textContent = selectedProcedure.risk === effectiveRisk ? selectedProcedure.text : `${selectedProcedure.text} Risk upgraded to ${effectiveRiskLabel} because a bleeding-risk modifier is present.`;

  el.catheterFields.classList.toggle("active", context === "catheter");
  el.selectedRuleTitle.textContent = rule.name;
  el.selectedRuleText.textContent = `${rule.summary} ${rule.catheter}`;
  el.minimumHold.textContent = formatHours(holdHours, rangeText);
  el.restartGuidance.textContent = !Number.isFinite(restartHours) ? "Specialist-directed restart" : restartHours === 0 ? "No required delay after removal/placement unless loading dose or bleeding concern" : `${restartHours} hours after needle placement or catheter removal`;

  if (rule.level) notes.push(rule.level);
  if (el.bloodyTap.checked) notes.push("Traumatic placement may justify delaying postoperative dosing longer than the default restart interval.");
  if (el.renal.value === "unknown" && ["dabigatran", "rivaroxaban"].includes(ruleId)) notes.push("Renal function is required for the most reliable DOAC timing decision.");
  if (context === "catheter") notes.push(rule.catheter);

  if (!lastDose) {
    el.riskBand.className = "result-band";
    el.riskBand.textContent = "Enter the last dose time";
    el.earliestTime.textContent = "--";
    el.elapsedBar.style.width = "0%";
    setNotes(notes);
    return;
  }

  let earliest = Number.isFinite(holdHours) ? new Date(lastDose.getTime() + holdHours * HOUR) : null;
  const labOverride = el.labCleared.checked && rule.level;
  if (!earliest && !labOverride) {
    el.riskBand.className = "result-band stop";
    el.riskBand.textContent = "Do not proceed without specialist review and documented drug clearance";
    el.earliestTime.textContent = "Lab-confirmed clearance required";
    el.elapsedBar.style.width = "0%";
    setNotes(notes);
    return;
  }

  if (labOverride && (!earliest || plannedProcedure && plannedProcedure < earliest)) {
    notes.push("A documented acceptable drug-specific level can support proceeding earlier than the default pharmacokinetic interval.");
  }

  if (context === "catheter" && el.catheterAction.value === "restart" && removal) {
    if (!Number.isFinite(restartHours)) {
      el.earliestTime.textContent = "Specialist-directed restart";
      el.riskBand.className = "result-band stop";
      el.riskBand.textContent = "Restart timing is not routine";
      el.elapsedBar.style.width = "0%";
      setNotes(notes);
      return;
    }
    const restartAt = new Date(removal.getTime() + restartHours * HOUR);
    el.earliestTime.textContent = formatDate(restartAt);
    el.riskBand.className = "result-band ready";
    el.riskBand.textContent = "Earliest restart time calculated";
    el.elapsedBar.style.width = "100%";
    setNotes(notes);
    return;
  }

  if (!plannedProcedure) {
    el.riskBand.className = "result-band";
    el.riskBand.textContent = "Enter the planned injection time";
    el.earliestTime.textContent = labOverride && !earliest ? "Now if level is acceptable" : formatDate(earliest);
    el.elapsedBar.style.width = "0%";
    setNotes(notes);
    return;
  }

  const elapsed = (plannedProcedure.getTime() - lastDose.getTime()) / HOUR;
  const progress = Number.isFinite(holdHours) && holdHours > 0 ? Math.max(0, Math.min(100, elapsed / holdHours * 100)) : 100;
  el.elapsedBar.style.width = `${progress}%`;
  el.earliestTime.textContent = labOverride && (!earliest || procedure < earliest) ? "Acceptable level documented" : formatDate(earliest);

  if (labOverride && (!earliest || procedure < earliest)) {
    el.riskBand.className = "result-band ready";
    el.riskBand.textContent = "Level-based clearance documented";
  } else if (holdHours === 0 || plannedProcedure >= earliest) {
    el.riskBand.className = "result-band ready";
    el.riskBand.textContent = "Timing criterion met";
  } else {
    const hoursRemaining = Math.ceil((earliest.getTime() - plannedProcedure.getTime()) / HOUR);
    el.riskBand.className = "result-band wait";
    el.riskBand.textContent = `Wait ${hoursRemaining} more hour${hoursRemaining === 1 ? "" : "s"}`;
  }

  if (ruleId === "warfarin" && !el.labCleared.checked) {
    notes.push("Use the lab checkbox only when the INR is confirmed normalized according to local policy.");
  }

  setNotes(notes);
}

function resetDefaults() {
  const now = new Date();
  const last = new Date(now.getTime() - 48 * HOUR);
  const planned = new Date(now.getTime() + 2 * HOUR);
  el.lastDose.value = toLocalInput(last);
  el.procedureTime.value = toLocalInput(planned);
  el.catheterRemoval.value = toLocalInput(planned);
  el.renal.value = "normal";
  el.procedureType.value = "neuraxial";
  el.bleedingModifier.value = "none";
  el.bloodyTap.checked = false;
  el.labCleared.checked = false;
  document.querySelector("input[name='context'][value='needle']").checked = true;
  calculate();
}

function tickClock() {
  el.clockChip.textContent = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

populateProcedures();
populateMedication();
populateDoseOptions();
resetDefaults();
tickClock();
setInterval(tickClock, 30000);

el.medication.addEventListener("change", () => {
  populateDoseOptions();
  calculate();
});

document.querySelectorAll("select, input").forEach((node) => {
  node.addEventListener("input", calculate);
  node.addEventListener("change", calculate);
});

el.resetButton.addEventListener("click", resetDefaults);

if ("serviceWorker" in navigator && ["http:", "https:"].includes(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works online when service worker registration is unavailable.
    });
  });
}
