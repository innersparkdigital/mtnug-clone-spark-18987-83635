export type LikertQ = { id: string; text: string; scale: "likert5"; dimension: string; reverse?: boolean };
export type AptitudeQ = { id: string; text: string; scale: "mcq"; options: string[]; correct: number; dimension: string };
export type PsychQuestion = LikertQ | AptitudeQ;
export type DimensionMeta = { key: string; label: string; low: string; mid: string; high: string };
export type AssessmentDef = { id: string; dimensions: DimensionMeta[]; questions: PsychQuestion[]; disclaimer: string };

const L = (id: string, text: string, dimension: string, reverse = false): LikertQ => ({ id, text, scale: "likert5", dimension, reverse });

export const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export const ASSESSMENT_DEFS: Record<string, AssessmentDef> = {
  "workplace-personality": {
    id: "workplace-personality",
    disclaimer: "Workplace tendencies for development — not a clinical diagnosis or hiring pass/fail.",
    dimensions: [
      { key: "drive", label: "Drive & initiative", low: "Steady and paced", mid: "Balanced push", high: "High initiative" },
      { key: "people", label: "People orientation", low: "Independent focus", mid: "Selective connector", high: "Highly social" },
      { key: "structure", label: "Structure & detail", low: "Flexible", mid: "Adaptive planner", high: "High structure" },
      { key: "openness", label: "Openness to change", low: "Prefers proven ways", mid: "Open when useful", high: "Seeks novelty" },
      { key: "steadiness", label: "Emotional steadiness", low: "Reactive under load", mid: "Mostly steady", high: "Very composed" },
    ],
    questions: [
      L("p1", "I often take the lead when a task is unclear.", "drive"),
      L("p2", "I prefer starting new work over finishing long checklists.", "drive"),
      L("p3", "I wait for clear instructions before acting.", "drive", true),
      L("p4", "I feel energised after group meetings.", "people"),
      L("p5", "I do my best thinking alone before sharing.", "people", true),
      L("p6", "I build rapport quickly with new colleagues.", "people"),
      L("p7", "I keep detailed plans and track them closely.", "structure"),
      L("p8", "Loose deadlines make me uncomfortable.", "structure"),
      L("p9", "I am fine changing the plan mid-way if needed.", "structure", true),
      L("p10", "I enjoy trying new tools and methods at work.", "openness"),
      L("p11", "I prefer proven processes over experiments.", "openness", true),
      L("p12", "I volunteer for pilot projects.", "openness"),
      L("p13", "I stay calm when priorities suddenly change.", "steadiness"),
      L("p14", "Criticism at work stays with me for a long time.", "steadiness", true),
      L("p15", "I recover quickly after a difficult day.", "steadiness"),
      L("p16", "I push for stretch goals even when others hesitate.", "drive"),
      L("p17", "I check in on teammates without being asked.", "people"),
      L("p18", "My files and workspace are highly organised.", "structure"),
      L("p19", "Routine work bores me quickly.", "openness"),
      L("p20", "Under pressure I still communicate clearly.", "steadiness"),
    ],
  },
  "stress-resilience": {
    id: "stress-resilience",
    disclaimer: "Workplace coping patterns — not a medical diagnosis. Offer private support where needed.",
    dimensions: [
      { key: "recovery", label: "Recovery habits", low: "Rarely resets", mid: "Some recovery", high: "Strong recovery" },
      { key: "boundaries", label: "Work boundaries", low: "Always on", mid: "Mixed", high: "Clear boundaries" },
      { key: "support", label: "Support seeking", low: "Keeps it in", mid: "Selective", high: "Asks early" },
      { key: "load_coping", label: "Load coping", low: "Easily overloaded", mid: "Copes in bursts", high: "Handles peaks well" },
    ],
    questions: [
      L("s1", "I sleep enough most work nights.", "recovery"),
      L("s2", "I take real breaks during the workday.", "recovery"),
      L("s3", "I have hobbies that help me switch off.", "recovery"),
      L("s4", "I answer work messages late into the night.", "boundaries", true),
      L("s5", "I can say no when my plate is full.", "boundaries"),
      L("s6", "Weekends are mostly free of work tasks.", "boundaries"),
      L("s7", "I ask for help before I am overwhelmed.", "support"),
      L("s8", "I talk to a trusted person when work is heavy.", "support"),
      L("s9", "I hide stress so others will not worry.", "support", true),
      L("s10", "I prioritise well when deadlines stack up.", "load_coping"),
      L("s11", "Multiple urgent tasks make me freeze.", "load_coping", true),
      L("s12", "I break big pressure into small next steps.", "load_coping"),
      L("s13", "After a tough week I bounce back within a day or two.", "recovery"),
      L("s14", "I feel guilty resting when there is still work.", "boundaries", true),
      L("s15", "My manager knows when I am stretched.", "support"),
      L("s16", "I keep quality high even in busy seasons.", "load_coping"),
    ],
  },
  "leadership-style": {
    id: "leadership-style",
    disclaimer: "Development snapshot for people-managers — not a performance rating.",
    dimensions: [
      { key: "direction", label: "Clear direction", low: "Leaves it open", mid: "Sometimes clear", high: "Sets sharp direction" },
      { key: "involve", label: "Involvement", low: "Decides alone", mid: "Consults sometimes", high: "Highly inclusive" },
      { key: "feedback", label: "Feedback culture", low: "Rare feedback", mid: "Occasional", high: "Frequent and specific" },
      { key: "standards", label: "Standards", low: "Flexible standards", mid: "Balanced", high: "High bar" },
    ],
    questions: [
      L("l1", "My team knows what success looks like this week.", "direction"),
      L("l2", "I restate priorities when things get noisy.", "direction"),
      L("l3", "I assume people will figure goals out themselves.", "direction", true),
      L("l4", "I ask for input before major team decisions.", "involve"),
      L("l5", "I prefer deciding quickly without discussion.", "involve", true),
      L("l6", "Quieter people get space to speak in my meetings.", "involve"),
      L("l7", "I give specific praise when work is strong.", "feedback"),
      L("l8", "I delay hard feedback hoping the issue passes.", "feedback", true),
      L("l9", "People leave 1:1s with a clear next step.", "feedback"),
      L("l10", "I follow up when commitments slip.", "standards"),
      L("l11", "I accept lower quality to keep the peace.", "standards", true),
      L("l12", "I model the standards I expect.", "standards"),
      L("l13", "I share the why behind targets.", "direction"),
      L("l14", "I co-create plans with the team when possible.", "involve"),
      L("l15", "I schedule regular feedback, not only annual reviews.", "feedback"),
      L("l16", "Missed deadlines are discussed without blame-shifting.", "standards"),
    ],
  },
  "team-collaboration": {
    id: "team-collaboration",
    disclaimer: "Preferred team contribution style — not a clinical tool.",
    dimensions: [
      { key: "ideate", label: "Idea generation", low: "Prefers refine", mid: "Mixed", high: "Idea starter" },
      { key: "deliver", label: "Delivery follow-through", low: "Starts many", mid: "Finishes most", high: "Reliable finisher" },
      { key: "harmonise", label: "Harmony seeking", low: "Direct clash OK", mid: "Balanced", high: "Avoids friction" },
      { key: "organise", label: "Coordination", low: "Goes solo", mid: "Coordinates when needed", high: "Natural organiser" },
    ],
    questions: [
      L("t1", "I am usually the one who suggests new approaches.", "ideate"),
      L("t2", "Brainstorms energise me.", "ideate"),
      L("t3", "I prefer polishing existing ideas over inventing.", "ideate", true),
      L("t4", "I close loops and mark tasks done.", "deliver"),
      L("t5", "I start more work than I finish.", "deliver", true),
      L("t6", "Teammates trust me to ship on time.", "deliver"),
      L("t7", "I speak up even when it creates tension.", "harmonise", true),
      L("t8", "I smooth over disagreements quickly.", "harmonise"),
      L("t9", "I would rather keep peace than win an argument.", "harmonise"),
      L("t10", "I naturally track who owns what.", "organise"),
      L("t11", "I dislike project admin and status updates.", "organise", true),
      L("t12", "I set up shared boards and timelines.", "organise"),
      L("t13", "I bring options others have not considered.", "ideate"),
      L("t14", "I chase dependencies until they move.", "deliver"),
      L("t15", "Conflict in the team makes me withdraw.", "harmonise"),
      L("t16", "I remind the group of deadlines without being asked.", "organise"),
    ],
  },
  "role-fit-interest": {
    id: "role-fit-interest",
    disclaimer: "Interest energy map for career conversations — not pass/fail.",
    dimensions: [
      { key: "people_work", label: "People and service", low: "Low draw", mid: "Moderate", high: "Strong draw" },
      { key: "process", label: "Process and systems", low: "Low draw", mid: "Moderate", high: "Strong draw" },
      { key: "problems", label: "Problem solving", low: "Low draw", mid: "Moderate", high: "Strong draw" },
      { key: "delivery", label: "Delivery and results", low: "Low draw", mid: "Moderate", high: "Strong draw" },
    ],
    questions: [
      L("r1", "I enjoy coaching or supporting other people.", "people_work"),
      L("r2", "Customer-facing work gives me energy.", "people_work"),
      L("r3", "I prefer tasks with little human interaction.", "people_work", true),
      L("r4", "I like designing clear processes.", "process"),
      L("r5", "Spreadsheets and systems feel satisfying.", "process"),
      L("r6", "Messy undefined work is more fun than SOPs.", "process", true),
      L("r7", "I love hard puzzles with no obvious answer.", "problems"),
      L("r8", "Analysis and research make time disappear.", "problems"),
      L("r9", "I prefer simple tasks I can finish fast.", "problems", true),
      L("r10", "Hitting a target motivates me strongly.", "delivery"),
      L("r11", "I track metrics without being asked.", "delivery"),
      L("r12", "I care more about the journey than the number.", "delivery", true),
      L("r13", "Facilitating a workshop sounds appealing.", "people_work"),
      L("r14", "I would happily own a compliance checklist.", "process"),
      L("r15", "Debugging a complex issue is exciting.", "problems"),
      L("r16", "I push to close the week with visible wins.", "delivery"),
    ],
  },
  "workplace-aptitude": {
    id: "workplace-aptitude",
    disclaimer: "Short workplace reasoning check — not an IQ claim or clinical tool.",
    dimensions: [
      { key: "verbal", label: "Verbal reasoning", low: "Developing", mid: "Solid", high: "Strong" },
      { key: "numerical", label: "Numerical sense", low: "Developing", mid: "Solid", high: "Strong" },
      { key: "judgement", label: "Practical judgement", low: "Developing", mid: "Solid", high: "Strong" },
    ],
    questions: [
      { id: "a1", scale: "mcq", dimension: "verbal", text: "Closest meaning to 'concise'?", options: ["Lengthy", "Brief", "Confusing", "Emotional"], correct: 1 },
      { id: "a2", scale: "mcq", dimension: "verbal", text: "'The policy was amended' means it was:", options: ["Deleted", "Changed", "Printed", "Ignored"], correct: 1 },
      { id: "a3", scale: "mcq", dimension: "verbal", text: "Clearest sentence?", options: ["It is requested that action be taken soon by you.", "Please take action soon.", "Action-taking soonness is requested.", "You will maybe act."], correct: 1 },
      { id: "a4", scale: "mcq", dimension: "verbal", text: "Antonym of 'scarce':", options: ["Rare", "Abundant", "Hidden", "Costly"], correct: 1 },
      { id: "a5", scale: "mcq", dimension: "verbal", text: "'Mitigate risk' most nearly means:", options: ["Ignore risk", "Increase risk", "Reduce risk", "Measure only"], correct: 2 },
      { id: "a6", scale: "mcq", dimension: "numerical", text: "15% of 200 is:", options: ["15", "20", "30", "35"], correct: 2 },
      { id: "a7", scale: "mcq", dimension: "numerical", text: "Price rises from 80,000 to 100,000. Increase is:", options: ["20%", "25%", "15%", "12.5%"], correct: 1 },
      { id: "a8", scale: "mcq", dimension: "numerical", text: "3 printers take 6 hours. 6 identical printers take:", options: ["12 hours", "6 hours", "3 hours", "1 hour"], correct: 2 },
      { id: "a9", scale: "mcq", dimension: "numerical", text: "Average of 12, 18, 30 is:", options: ["18", "20", "22", "15"], correct: 1 },
      { id: "a10", scale: "mcq", dimension: "numerical", text: "4 people share 360,000 equally. Each gets:", options: ["80,000", "90,000", "100,000", "120,000"], correct: 1 },
      { id: "a11", scale: "mcq", dimension: "judgement", text: "Angry client email about a delay you did not cause. Best first step?", options: ["Ignore until they calm down", "Reply defensively", "Acknowledge impact and give a clear next step", "CC the whole company"], correct: 2 },
      { id: "a12", scale: "mcq", dimension: "judgement", text: "Data error could mislead a board pack due tomorrow. You should:", options: ["Hope nobody notices", "Fix it and flag the change", "Delete the slide", "Wait for someone else"], correct: 1 },
      { id: "a13", scale: "mcq", dimension: "judgement", text: "Two urgent tasks, one owner. Best approach?", options: ["Do both halfway", "Agree priority with stakeholder", "Pick at random", "Do neither"], correct: 1 },
      { id: "a14", scale: "mcq", dimension: "judgement", text: "Colleague shares confidential salary data in chat. You should:", options: ["Forward it", "Laugh it off", "Ask them to delete and report if needed", "Post it elsewhere"], correct: 2 },
      { id: "a15", scale: "mcq", dimension: "judgement", text: "Unsure how to do a new task. Best move?", options: ["Guess and submit", "Ask a clarifying question early", "Wait until the deadline", "Pass blame later"], correct: 1 },
    ],
  },
};

export type ScoreMap = Record<string, { raw: number; max: number; pct: number; band: string; label: string; narrative: string }>;

function bandFromPct(pct: number) {
  if (pct >= 70) return "high";
  if (pct >= 40) return "mid";
  return "low";
}

export function scoreAssessment(def: AssessmentDef, answers: Record<string, number>) {
  const buckets: Record<string, { sum: number; max: number }> = {};
  def.dimensions.forEach((d) => { buckets[d.key] = { sum: 0, max: 0 }; });
  def.questions.forEach((q) => {
    const a = answers[q.id];
    if (a == null || Number.isNaN(a)) return;
    if (q.scale === "likert5") {
      const v = q.reverse ? 6 - a : a;
      buckets[q.dimension].sum += v;
      buckets[q.dimension].max += 5;
    } else {
      buckets[q.dimension].sum += a === q.correct ? 1 : 0;
      buckets[q.dimension].max += 1;
    }
  });
  const scores: ScoreMap = {};
  let totalPct = 0;
  def.dimensions.forEach((d) => {
    const b = buckets[d.key];
    const pct = b.max > 0 ? Math.round((b.sum / b.max) * 100) : 0;
    const band = bandFromPct(pct);
    const narrative = band === "high" ? d.high : band === "mid" ? d.mid : d.low;
    scores[d.key] = { raw: b.sum, max: b.max, pct, band, label: d.label, narrative };
    totalPct += pct;
  });
  const overall_pct = def.dimensions.length ? Math.round(totalPct / def.dimensions.length) : 0;
  const ranked = Object.values(scores).sort((a, b) => b.pct - a.pct);
  const strengths = ranked.filter((s) => s.band === "high").slice(0, 3).map((s) => s.label + ": " + s.narrative);
  const watchouts = ranked.filter((s) => s.band === "low").slice(0, 3).map((s) => s.label + ": " + s.narrative);
  const summary =
    overall_pct >= 70
      ? "Overall pattern sits in a stronger range. Use strengths intentionally and review lower areas in role context."
      : overall_pct >= 40
        ? "Overall pattern is mixed — typical for working adults. Focus development on one or two job-relevant lower areas."
        : "Several areas score lower. Treat as a coaching start point with the employee, not a verdict.";
  return { scores, overall_pct, summary, strengths, watchouts };
}

export function buildReportPayload(def: AssessmentDef, employeeName: string, companyName: string | null, answers: Record<string, number>) {
  const scored = scoreAssessment(def, answers);
  return {
    version: 1,
    assessment_id: def.id,
    employee_name: employeeName,
    company_name: companyName,
    generated_at: new Date().toISOString(),
    disclaimer: def.disclaimer,
    ...scored,
    dimensions: def.dimensions.map((d) => ({ ...d, ...(scored.scores[d.key] || {}) })),
  };
}
