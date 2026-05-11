// Single source of truth for the WHO-5 + Workplace per-question intelligence layer.
// Every interpretation, recommendation, and flag flows from QUESTION_INTELLIGENCE.

export type Domain = "who5" | "workplace";
export type RiskCategory = "healthy" | "at_risk" | "critical";

export interface QuestionMeta {
  id: QuestionId;
  text: string;
  shortLabel: string;
  domain: Domain;
  reverseScored: boolean;
  flagName: string;
  // 0=worst, 4=best (we render the matching one based on percentageScore)
  bands: {
    range: [number, number]; // inclusive percentage range
    label: string;
    meaning: string; // shown to employee (clinical meaning, 1-2 sentences)
  }[];
  individualRecommendation: string;
  companyRecommendation: string;
  recommendedServiceSlug: string; // route slug
  recommendedServiceLabel: string;
}

export type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";

export const QUESTION_ORDER: QuestionId[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

export const QUESTION_INTELLIGENCE: Record<QuestionId, QuestionMeta> = {
  q1: {
    id: "q1",
    text: "I have felt cheerful and in good spirits",
    shortLabel: "Mood",
    domain: "who5",
    reverseScored: false,
    flagName: "FLAG_MORALE_LOW",
    bands: [
      { range: [0, 0], label: "Persistent low mood", meaning: "Persistent low mood. Combined with low daily interest, this is a primary depression indicator and needs immediate attention." },
      { range: [1, 40], label: "Low mood", meaning: "Low mood consistently. You may be withdrawing socially or struggling to find enjoyment in things you usually like." },
      { range: [41, 60], label: "Moderate mood", meaning: "Moderate mood — some dips but generally stable." },
      { range: [61, 100], label: "Strong baseline", meaning: "Your emotional baseline is strong. Positive mood appears sustained." },
    ],
    individualRecommendation:
      "Your responses suggest your mood has been lower than usual recently. This is more common than most people realise, and it does not mean something is permanently wrong. Talking to a therapist — even for one session — can help you understand what is affecting you. InnerSpark's therapists are available today.",
    companyRecommendation:
      "Team morale is below the healthy threshold. This is often triggered by recent organisational change, poor recognition culture, or leadership communication gaps. Recommended action: all-team appreciation event, management communication session, or S.P.A.R.K wellbeing workshop on emotional resilience.",
    recommendedServiceSlug: "/specialists",
    recommendedServiceLabel: "Talk to a therapist",
  },
  q2: {
    id: "q2",
    text: "I have felt calm and relaxed",
    shortLabel: "Calm",
    domain: "who5",
    reverseScored: false,
    flagName: "FLAG_ANXIETY_HIGH",
    bands: [
      { range: [0, 0], label: "High anxiety", meaning: "High anxiety. Combined with frequent overwhelm, this is a significant burnout precursor." },
      { range: [1, 40], label: "Elevated anxiety", meaning: "Elevated anxiety. You may be in a state of low-grade chronic stress that has been normalised." },
      { range: [41, 60], label: "Moderate stress", meaning: "Moderate stress — manageable but present." },
      { range: [61, 100], label: "Calm", meaning: "Low anxiety. You manage pressure well." },
    ],
    individualRecommendation:
      "Your responses suggest you have been carrying significant tension recently. Chronic stress that is not addressed tends to compound over time. InnerSpark offers guided breathing exercises and stress management tools in-app, and our therapists specialise in anxiety support.",
    companyRecommendation:
      "Elevated anxiety levels across the team. This frequently signals unclear job expectations, fear of job loss, or a high-pressure management culture. Recommended action: Manager Wellbeing Workshop on psychological safety, role clarification, and stress-management tools for all employees.",
    recommendedServiceSlug: "/meditations",
    recommendedServiceLabel: "Stress & calm tools",
  },
  q3: {
    id: "q3",
    text: "I have felt active and vigorous",
    shortLabel: "Energy",
    domain: "who5",
    reverseScored: false,
    flagName: "FLAG_BURNOUT_RISK",
    bands: [
      { range: [0, 0], label: "Severe energy depletion", meaning: "Severe energy depletion. You may be in the exhaustion phase of burnout. Immediate support is recommended." },
      { range: [1, 40], label: "Energy depletion", meaning: "Energy depletion. This is the earliest measurable burnout signal — appearing 3–6 months before visible performance decline." },
      { range: [41, 60], label: "Moderate energy", meaning: "Moderate energy — some fatigue but generally coping." },
      { range: [61, 100], label: "Good vitality", meaning: "Good energy. You appear to be recovering well and have capacity." },
    ],
    individualRecommendation:
      "Your responses suggest your energy levels have been significantly reduced. This is not laziness — it is your system signalling it needs help. InnerSpark's therapists can help you understand what is driving this and create a practical recovery plan.",
    companyRecommendation:
      "Energy depletion across the team is a strong burnout warning. Typically caused by unsustainable workload, lack of recovery time, or meeting-heavy cultures. Recommended action: Workload audit, meeting reduction review, S.P.A.R.K burnout prevention workshop, and access to InnerSpark's recovery tools.",
    recommendedServiceSlug: "/meditations",
    recommendedServiceLabel: "Recovery & meditation",
  },
  q4: {
    id: "q4",
    text: "I woke up feeling fresh and rested",
    shortLabel: "Sleep",
    domain: "who5",
    reverseScored: false,
    flagName: "FLAG_SLEEP_DISRUPTION",
    bands: [
      { range: [0, 0], label: "Severe sleep disruption", meaning: "Severe sleep disruption with significant cognitive, emotional and physical consequences. Urgent support is recommended." },
      { range: [1, 40], label: "Disrupted sleep", meaning: "Sleep disruption — your mind cannot fully switch off. Often caused by work anxiety or always-on communication." },
      { range: [41, 60], label: "Moderate sleep", meaning: "Moderate sleep quality — some disruption but generally recovering." },
      { range: [61, 100], label: "Restful sleep", meaning: "Good sleep and recovery. You appear to be disconnecting from work adequately." },
    ],
    individualRecommendation:
      "Your responses suggest you have been struggling to get restorative sleep. Poor sleep both causes and worsens mental health challenges. InnerSpark's app includes guided sleep meditations and breathing exercises designed for minds that stay active at night.",
    companyRecommendation:
      "Sleep disruption across the team often signals an always-on work culture. Recommended action: introduce a formal after-hours communication policy (no non-urgent messages after 7pm), share InnerSpark's sleep tools, and review whether workload is causing employees to take work anxiety home.",
    recommendedServiceSlug: "/meditations",
    recommendedServiceLabel: "Sleep meditations",
  },
  q5: {
    id: "q5",
    text: "My daily life has been filled with things that interest me",
    shortLabel: "Interest",
    domain: "who5",
    reverseScored: false,
    flagName: "FLAG_DISENGAGEMENT_HIGH",
    bands: [
      { range: [0, 0], label: "Complete loss of interest", meaning: "Complete loss of interest. This is a primary depression signal regardless of other scores. Speaking to a therapist today is strongly recommended." },
      { range: [1, 40], label: "Significant disengagement", meaning: "Significant disengagement. You may feel detached from work, relationships, or activities you previously enjoyed." },
      { range: [41, 60], label: "Some disengagement", meaning: "Some disengagement — you may be going through the motions in certain areas." },
      { range: [61, 100], label: "Engaged", meaning: "You appear engaged and finding meaning in your daily activities." },
    ],
    individualRecommendation:
      "Your response suggests you may be finding it difficult to feel interest or pleasure in things that usually matter to you. This — known as anhedonia — is one of the most common signs that someone needs support. It does not mean you are broken. Please reach out to an InnerSpark therapist today.",
    companyRecommendation:
      "Low engagement scores indicate a significant share of your team may be experiencing early or moderate depression symptoms. This is both a wellbeing concern and a productivity risk. Recommended action: prioritise 1:1 therapy access for affected employees, run a team purpose and recognition session, and activate InnerSpark's full EAP programme.",
    recommendedServiceSlug: "/specialists",
    recommendedServiceLabel: "Book a therapist",
  },
  q6: {
    id: "q6",
    text: "My workload feels manageable",
    shortLabel: "Workload",
    domain: "workplace",
    reverseScored: false,
    flagName: "FLAG_WORKLOAD_HIGH",
    bands: [
      { range: [0, 0], label: "Unmanageable workload", meaning: "Workload is completely unmanageable. You may be in firefighting mode constantly with no time for recovery." },
      { range: [1, 40], label: "Workload exceeds capacity", meaning: "Workload is consistently exceeding capacity. You are likely working beyond contracted hours or cutting quality to keep up." },
      { range: [41, 60], label: "Stretched", meaning: "Workload is manageable but stretched." },
      { range: [61, 100], label: "Manageable", meaning: "Workload is well-managed with adequate time and resources." },
    ],
    individualRecommendation:
      "Your responses suggest your workload has been consistently beyond what feels manageable — one of the most common causes of stress and burnout. This is not a personal failure. InnerSpark's counsellors can help you develop strategies for managing pressure while longer-term solutions are pursued.",
    companyRecommendation:
      "Workload is the primary stress driver for this team. This is directly actionable — it requires operational change, not just therapy. Recommended action: structured workload review with each manager, identify top three time drains, and consider whether the team is adequately resourced. S.P.A.R.K training on workload management is recommended as an immediate intervention.",
    recommendedServiceSlug: "/for-business",
    recommendedServiceLabel: "Workplace support",
  },
  q7: {
    id: "q7",
    text: "I feel supported at work",
    shortLabel: "Support",
    domain: "workplace",
    reverseScored: false,
    flagName: "FLAG_SUPPORT_LOW",
    bands: [
      { range: [0, 0], label: "No felt support", meaning: "Complete absence of felt support. You are carrying everything alone — a significant psychological-safety failure and high resignation risk." },
      { range: [1, 40], label: "Low support", meaning: "Low support. You may feel alone in your challenges and hesitant to speak up." },
      { range: [41, 60], label: "Moderate support", meaning: "Moderate support — some relationships are supportive but others may not be." },
      { range: [61, 100], label: "Strong support", meaning: "Strong support network. You feel safe raising concerns and asking for help." },
    ],
    individualRecommendation:
      "Your responses suggest you have felt alone in the challenges you face at work. That isolation is one of the hardest things to carry. InnerSpark's support groups and 1:1 therapy offer a confidential space where you can speak openly without fear of consequences.",
    companyRecommendation:
      "Low support scores indicate a breakdown in psychological safety. Employees do not feel safe raising concerns or being vulnerable at work. This is a leadership culture issue. Recommended action: Manager Wellbeing Workshop on supportive conversations and psychological safety, peer mentoring programme, and a review of how complaints are currently handled.",
    recommendedServiceSlug: "/support-groups",
    recommendedServiceLabel: "Support groups",
  },
  q8: {
    id: "q8",
    text: "I feel overwhelmed at work",
    shortLabel: "Overwhelm",
    domain: "workplace",
    reverseScored: true,
    flagName: "FLAG_OVERWHELM_CRITICAL",
    bands: [
      { range: [0, 0], label: "Constant overwhelm", meaning: "Constant overwhelm — acute distress. Combined with low calm and low energy, this is the clearest possible signal of active clinical burnout." },
      { range: [1, 40], label: "Frequent overwhelm", meaning: "Frequently overwhelmed — past your coping threshold on a regular basis. Burnout is imminent without intervention." },
      { range: [41, 60], label: "Sometimes overwhelmed", meaning: "Occasionally overwhelmed but generally managing." },
      { range: [61, 100], label: "Rarely overwhelmed", meaning: "You rarely or never feel overwhelmed. Good coping capacity." },
    ],
    individualRecommendation:
      "Your responses suggest significant overwhelm at work on a regular basis. This is a serious signal that your capacity has been exceeded for a sustained period. InnerSpark can connect you today with a therapist who specialises in workplace stress and burnout recovery.",
    companyRecommendation:
      "Frequent overwhelm across the team is the highest-urgency flag. The combination of workload pressure and depleted coping capacity is the direct precursor to mass burnout events. Recommended action: immediate S.P.A.R.K crisis management session, workload reduction review, and activation of InnerSpark's EAP for all employees in the At Risk and Critical categories.",
    recommendedServiceSlug: "/specialists",
    recommendedServiceLabel: "Burnout support",
  },
};

// ----- Answer-level computation -----

export interface AnswerDetail {
  rawAnswer: number;
  effectiveScore: number; // 0–5 after reverse scoring
  percentageScore: number; // 0–100
  flagged: boolean; // < 60%
  criticalFlag: boolean; // q5 == 0
}

export type AnswerMap = Record<QuestionId, AnswerDetail>;

export function computeAnswers(rawAnswers: number[]): AnswerMap {
  const out = {} as AnswerMap;
  QUESTION_ORDER.forEach((qid, idx) => {
    const meta = QUESTION_INTELLIGENCE[qid];
    const raw = Math.max(0, Math.min(5, rawAnswers[idx] ?? 0));
    const effective = meta.reverseScored ? 5 - raw : raw;
    const pct = Math.round((effective / 5) * 100);
    out[qid] = {
      rawAnswer: raw,
      effectiveScore: effective,
      percentageScore: pct,
      flagged: pct < 60,
      criticalFlag: qid === "q5" && effective === 0,
    };
  });
  return out;
}

export function getBand(qid: QuestionId, percentageScore: number) {
  const meta = QUESTION_INTELLIGENCE[qid];
  return meta.bands.find((b) => percentageScore >= b.range[0] && percentageScore <= b.range[1]) ?? meta.bands[meta.bands.length - 1];
}

export function getRiskCategory(overallPct: number): RiskCategory {
  if (overallPct >= 70) return "healthy";
  if (overallPct >= 40) return "at_risk";
  return "critical";
}

export const RISK_LABEL: Record<RiskCategory, string> = {
  healthy: "Healthy",
  at_risk: "At Risk",
  critical: "Critical",
};

export const RISK_COLOR: Record<RiskCategory, string> = {
  healthy: "#22c55e",
  at_risk: "#eab308",
  critical: "#ef4444",
};

// ----- Per-record aggregate -----

export type ClusterId = "BURNOUT_CLUSTER" | "ANXIETY_CLUSTER" | "DEPRESSION_RISK_CLUSTER";

export const CLUSTER_INFO: Record<ClusterId, { label: string; questions: QuestionId[]; interpretation: string }> = {
  BURNOUT_CLUSTER: {
    label: "Burnout cluster",
    questions: ["q3", "q4", "q8"],
    interpretation:
      "Classic burnout pattern. Energy is depleted, sleep is disrupted, and daily overwhelm is frequent. Requires immediate workload and recovery intervention.",
  },
  ANXIETY_CLUSTER: {
    label: "Workplace anxiety cluster",
    questions: ["q2", "q8", "q6"],
    interpretation:
      "Workplace-driven anxiety. Unmanageable workload, constant overwhelm and loss of calm indicate a high-pressure environment exceeding the team's coping capacity.",
  },
  DEPRESSION_RISK_CLUSTER: {
    label: "Depression-risk cluster",
    questions: ["q1", "q5", "q7"],
    interpretation:
      "Significant wellbeing concern. Low mood, loss of interest and feeling unsupported are the three primary early indicators of team-wide depression risk. Requires prioritised therapeutic intervention, not just training.",
  },
};

export interface ScreeningAggregate {
  who5Score: { raw: number; percentage: number };
  workplaceScore: { raw: number; percentage: number };
  overallScore: { raw: number; percentage: number };
  riskCategory: RiskCategory;
  triggeredFlags: string[];
  triggeredClusters: ClusterId[];
  crisisAlertRequired: boolean;
  crisisAlertLevel: 1 | 2 | 3 | null;
}

export function computeAggregate(answers: AnswerMap): ScreeningAggregate {
  const who5Q: QuestionId[] = ["q1", "q2", "q3", "q4", "q5"];
  const workplaceQ: QuestionId[] = ["q6", "q7", "q8"];
  const sum = (qs: QuestionId[]) => qs.reduce((s, q) => s + answers[q].effectiveScore, 0);

  const who5Raw = sum(who5Q);
  const workplaceRaw = sum(workplaceQ);
  const overallRaw = who5Raw + workplaceRaw;

  const who5Pct = Math.round((who5Raw / 25) * 100);
  const workplacePct = Math.round((workplaceRaw / 15) * 100);
  const overallPct = Math.round((overallRaw / 40) * 100);

  const triggeredFlags = QUESTION_ORDER.filter((q) => answers[q].flagged).map((q) => QUESTION_INTELLIGENCE[q].flagName);

  const triggeredClusters: ClusterId[] = (Object.keys(CLUSTER_INFO) as ClusterId[]).filter((cid) =>
    CLUSTER_INFO[cid].questions.every((q) => answers[q].percentageScore < 60),
  );

  // Crisis alert determination
  let crisisAlertLevel: 1 | 2 | 3 | null = null;
  const anyZero = QUESTION_ORDER.some((q) => answers[q].effectiveScore === 0);
  const q5Critical = answers.q5.criticalFlag;
  const anxietyOverwhelmCombo = answers.q2.effectiveScore <= 1 && answers.q8.effectiveScore <= 1;
  if (q5Critical || (overallPct < 20 && anyZero)) crisisAlertLevel = 1;
  else if (anxietyOverwhelmCombo || overallPct < 20) crisisAlertLevel = 2;
  else if (anyZero) crisisAlertLevel = 3;

  return {
    who5Score: { raw: who5Raw, percentage: who5Pct },
    workplaceScore: { raw: workplaceRaw, percentage: workplacePct },
    overallScore: { raw: overallRaw, percentage: overallPct },
    riskCategory: getRiskCategory(overallPct),
    triggeredFlags,
    triggeredClusters,
    crisisAlertRequired: crisisAlertLevel !== null,
    crisisAlertLevel,
  };
}

// ----- Personalised next steps -----

export interface NextStep {
  flagFor: QuestionId;
  label: string;
  href: string;
  rationale: string;
}

const NEXT_STEP_GROUPS: { qs: QuestionId[]; href: string; label: string; rationale: string }[] = [
  { qs: ["q1", "q5"], href: "/specialists", label: "Book a therapist", rationale: "Mood and engagement signals — 1:1 therapy is the right next step." },
  { qs: ["q2", "q8"], href: "/support-groups", label: "Join a support group", rationale: "Anxiety and overwhelm — connect with others and learn coping tools." },
  { qs: ["q3", "q4"], href: "/meditations", label: "Guided meditations & sleep", rationale: "Energy and sleep — start with short guided practices in the app." },
  { qs: ["q6", "q7"], href: "/specialists", label: "Workplace stress therapy", rationale: "Workload and support gaps — speak to a therapist trained in workplace stress." },
];

export function getNextSteps(answers: AnswerMap): NextStep[] {
  const seenHrefs = new Set<string>();
  const steps: NextStep[] = [];
  for (const group of NEXT_STEP_GROUPS) {
    const triggered = group.qs.find((q) => answers[q].flagged);
    if (triggered && !seenHrefs.has(group.href)) {
      seenHrefs.add(group.href);
      steps.push({ flagFor: triggered, label: group.label, href: group.href, rationale: group.rationale });
    }
    if (steps.length >= 3) break;
  }
  return steps;
}

export function getPriorityAreas(answers: AnswerMap, count = 3): QuestionId[] {
  return [...QUESTION_ORDER]
    .sort((a, b) => answers[a].percentageScore - answers[b].percentageScore)
    .filter((q) => answers[q].percentageScore < 60)
    .slice(0, count);
}

// Plain-English label for the answer the employee gave (different scale for workplace q6/q7/q8)
export function getAnswerLabel(qid: QuestionId, rawAnswer: number): string {
  const meta = QUESTION_INTELLIGENCE[qid];
  if (meta.domain === "who5") {
    return ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"][rawAnswer] ?? "—";
  }
  return ["Not at all", "Rarely", "Sometimes", "Often", "Very often", "Always"][rawAnswer] ?? "—";
}

// ----- Company-level aggregate -----

export interface CompanyTriggeredFlag {
  flagName: string;
  qid: QuestionId;
  affectedEmployees: number;
  averagePct: number;
  recommendation: string;
  serviceLabel: string;
  serviceHref: string;
  productivityCostDaysPerMonth: number;
}

export interface CompanyAggregateResult {
  totalEmployees: number;
  questionAverages: Record<QuestionId, number>;
  questionFlagStatus: Record<QuestionId, "green" | "amber" | "red">;
  triggeredFlags: CompanyTriggeredFlag[]; // ranked
  triggeredClusters: ClusterId[];
  recommendedServices: { primary?: CompanyTriggeredFlag; secondary?: CompanyTriggeredFlag };
  actionPlan: { week: number; title: string; items: string[] }[];
  riskDistribution: { healthy: number; at_risk: number; critical: number };
  averageOverallScore: number;
}

const PRODUCTIVITY_DAYS_PER_AFFECTED_EMPLOYEE = 1.25; // transparent placeholder per month

export function aggregateCompany(records: AnswerMap[]): CompanyAggregateResult {
  const total = records.length;
  const questionAverages = {} as Record<QuestionId, number>;
  const questionFlagStatus = {} as Record<QuestionId, "green" | "amber" | "red">;
  const triggeredFlags: CompanyTriggeredFlag[] = [];

  QUESTION_ORDER.forEach((qid) => {
    const avg = total === 0 ? 0 : Math.round(records.reduce((s, r) => s + r[qid].percentageScore, 0) / total);
    questionAverages[qid] = avg;
    questionFlagStatus[qid] = avg >= 70 ? "green" : avg >= 50 ? "amber" : "red";

    const affected = records.filter((r) => r[qid].flagged).length;
    if (affected > 0 && questionFlagStatus[qid] !== "green") {
      const meta = QUESTION_INTELLIGENCE[qid];
      triggeredFlags.push({
        flagName: meta.flagName,
        qid,
        affectedEmployees: affected,
        averagePct: avg,
        recommendation: meta.companyRecommendation,
        serviceLabel: meta.recommendedServiceLabel,
        serviceHref: meta.recommendedServiceSlug,
        productivityCostDaysPerMonth: Math.round(affected * PRODUCTIVITY_DAYS_PER_AFFECTED_EMPLOYEE * 10) / 10,
      });
    }
  });

  triggeredFlags.sort((a, b) => b.affectedEmployees - a.affectedEmployees || a.averagePct - b.averagePct);

  const triggeredClusters: ClusterId[] = (Object.keys(CLUSTER_INFO) as ClusterId[]).filter((cid) => {
    const matched = records.filter((r) => CLUSTER_INFO[cid].questions.every((q) => r[q].percentageScore < 60)).length;
    return matched >= 3;
  });

  const riskDistribution = records.reduce(
    (acc, r) => {
      const overallPct = Math.round(
        (QUESTION_ORDER.reduce((s, q) => s + r[q].effectiveScore, 0) / 40) * 100,
      );
      const cat = getRiskCategory(overallPct);
      acc[cat] += 1;
      return acc;
    },
    { healthy: 0, at_risk: 0, critical: 0 },
  );

  const averageOverallScore =
    total === 0
      ? 0
      : Math.round(
          records.reduce(
            (s, r) => s + Math.round((QUESTION_ORDER.reduce((ss, q) => ss + r[q].effectiveScore, 0) / 40) * 100),
            0,
          ) / total,
        );

  const recommendedServices = {
    primary: triggeredFlags[0],
    secondary: triggeredFlags[1],
  };

  const actionPlan = buildActionPlan(triggeredFlags, triggeredClusters);

  return {
    totalEmployees: total,
    questionAverages,
    questionFlagStatus,
    triggeredFlags,
    triggeredClusters,
    recommendedServices,
    actionPlan,
    riskDistribution,
    averageOverallScore,
  };
}

function buildActionPlan(flags: CompanyTriggeredFlag[], clusters: ClusterId[]) {
  const top = flags[0];
  const second = flags[1];
  return [
    {
      week: 1,
      title: "Immediate triage",
      items: [
        "InnerSpark contacts any employees flagged for crisis-level alerts within 24–48 hours.",
        "HR shares the high-level summary with senior leadership (no individual data).",
        top ? `Action area: ${top.recommendation.split(".")[0]}.` : "Confirm participation rate and address gaps.",
      ],
    },
    {
      week: 2,
      title: "First intervention",
      items: [
        top ? `Launch ${top.serviceLabel} for affected employees.` : "Schedule a wellbeing all-hands.",
        clusters.length ? `Address detected pattern: ${CLUSTER_INFO[clusters[0]].label}.` : "Open access to InnerSpark EAP for the team.",
        "Communicate confidentiality and how to access support.",
      ],
    },
    {
      week: 3,
      title: "Follow-up & education",
      items: [
        second ? `Layer in ${second.serviceLabel} as a secondary support.` : "Run a manager wellbeing briefing.",
        "Run a S.P.A.R.K micro-session (60 min) on the most-flagged area.",
        "Manager 1:1s focused on workload and support quality.",
      ],
    },
    {
      week: 4,
      title: "Interim review",
      items: [
        "Pulse check (single-question) on the most-flagged area.",
        "Schedule the 90-day re-screening.",
        "Document policy or workload changes made in response.",
      ],
    },
  ];
}

// Helper used in DB write/read: reconstruct an AnswerMap from a stored per_question jsonb.
export function answerMapFromStored(stored: any): AnswerMap | null {
  if (!stored || typeof stored !== "object") return null;
  const out = {} as AnswerMap;
  for (const qid of QUESTION_ORDER) {
    const v = stored[qid];
    if (!v) return null;
    out[qid] = {
      rawAnswer: Number(v.rawAnswer) || 0,
      effectiveScore: Number(v.effectiveScore) || 0,
      percentageScore: Number(v.percentageScore) || 0,
      flagged: !!v.flagged,
      criticalFlag: !!v.criticalFlag,
    };
  }
  return out;
}