// Validated screening scales used inside the client portal.
// Every scale is data-driven so a therapist can preview the exact
// questions before assigning, and the client answers with any number
// of response options (not limited to 3/4).

export interface ScaleOption {
  label: string;
  value: number;
}

export interface ScaleItem {
  text: string;
  /** Optional per-item override of the shared option set. */
  options?: ScaleOption[];
}

export interface FollowUpQuestion {
  text: string;
  options: ScaleOption[];
  /** Not counted in the total score. */
  scored?: false;
}

export interface ScreeningScale {
  key: string;            // tool_key used in assignment_tools
  name: string;
  shortName: string;
  instructions: string;
  timeframe: string;
  options: ScaleOption[];
  items: ScaleItem[];
  followUp?: FollowUpQuestion;
  /** Index of the item that should raise a safety alert when answered above 0. */
  safetyItemIndex?: number;
  /** WHO-5 style: report a percentage instead of a raw total. */
  percentage?: boolean;
  maxScore: number;
  severity: (score: number) => string;
  interpretation: string;
  bestFor: string;
}

const FREQ_0_3: ScaleOption[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const DIFFICULTY: ScaleOption[] = [
  { label: "Not difficult at all", value: 0 },
  { label: "Somewhat difficult", value: 1 },
  { label: "Very difficult", value: 2 },
  { label: "Extremely difficult", value: 3 },
];

const SPIN_OPTIONS: ScaleOption[] = [
  { label: "Not at all", value: 0 },
  { label: "A little bit", value: 1 },
  { label: "Somewhat", value: 2 },
  { label: "Very much", value: 3 },
  { label: "Extremely", value: 4 },
];

const WHO5_OPTIONS: ScaleOption[] = [
  { label: "All of the time", value: 5 },
  { label: "Most of the time", value: 4 },
  { label: "More than half the time", value: 3 },
  { label: "Less than half the time", value: 2 },
  { label: "Some of the time", value: 1 },
  { label: "At no time", value: 0 },
];

const YES_NO: ScaleOption[] = [
  { label: "No", value: 0 },
  { label: "Yes", value: 1 },
];

const PCL5_OPTIONS: ScaleOption[] = [
  { label: "Not at all", value: 0 },
  { label: "A little bit", value: 1 },
  { label: "Moderately", value: 2 },
  { label: "Quite a bit", value: 3 },
  { label: "Extremely", value: 4 },
];

export const SCREENING_SCALES: ScreeningScale[] = [
  {
    key: "screening-phq9",
    name: "Wellbeing check (PHQ-9)",
    shortName: "PHQ-9",
    instructions:
      "Over the last two weeks, how often have you been bothered by any of the following problems?",
    timeframe: "Last 2 weeks",
    options: FREQ_0_3,
    items: [
      { text: "Little interest or pleasure in doing things" },
      { text: "Feeling down, depressed, or hopeless" },
      { text: "Trouble falling or staying asleep, or sleeping too much" },
      { text: "Feeling tired or having little energy" },
      { text: "Poor appetite or overeating" },
      { text: "Feeling bad about yourself — or that you are a failure, or have let yourself or your family down" },
      { text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
      { text: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
      { text: "Thoughts that you would be better off dead, or of hurting yourself in some way" },
    ],
    followUp: {
      text: "If you checked off any problem on this questionnaire so far: how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
      options: DIFFICULTY,
      scored: false,
    },
    safetyItemIndex: 8,
    maxScore: 27,
    severity: (s) => (s <= 4 ? "minimal" : s <= 9 ? "mild" : s <= 14 ? "moderate" : s <= 19 ? "moderately severe" : "severe"),
    interpretation: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20–27 severe",
    bestFor: "Depression screening and progress monitoring",
  },
  {
    key: "screening-gad7",
    name: "Wellbeing check (GAD-7)",
    shortName: "GAD-7",
    instructions: "Over the last two weeks, how often have you been bothered by the following problems?",
    timeframe: "Last 2 weeks",
    options: FREQ_0_3,
    items: [
      { text: "Feeling nervous, anxious, or on edge" },
      { text: "Not being able to stop or control worrying" },
      { text: "Worrying too much about different things" },
      { text: "Trouble relaxing" },
      { text: "Being so restless that it is hard to sit still" },
      { text: "Becoming easily annoyed or irritable" },
      { text: "Feeling afraid as if something awful might happen" },
    ],
    followUp: {
      text: "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
      options: DIFFICULTY,
      scored: false,
    },
    maxScore: 21,
    severity: (s) => (s <= 4 ? "minimal" : s <= 9 ? "mild" : s <= 14 ? "moderate" : "severe"),
    interpretation: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe",
    bestFor: "Anxiety screening and progress monitoring",
  },
  {
    key: "screening-who5",
    name: "WHO-5 Wellbeing Index",
    shortName: "WHO-5",
    instructions:
      "Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.",
    timeframe: "Last 2 weeks",
    options: WHO5_OPTIONS,
    items: [
      { text: "I have felt cheerful and in good spirits" },
      { text: "I have felt calm and relaxed" },
      { text: "I have felt active and vigorous" },
      { text: "I woke up feeling fresh and rested" },
      { text: "My daily life has been filled with things that interest me" },
    ],
    percentage: true,
    maxScore: 100,
    severity: (pct) => (pct <= 28 ? "very low wellbeing" : pct <= 50 ? "low wellbeing" : pct <= 75 ? "moderate wellbeing" : "good wellbeing"),
    interpretation: "Raw score × 4 = percentage. 50% or below suggests low wellbeing and warrants follow-up.",
    bestFor: "Overall emotional wellbeing and quality of life over time",
  },
  {
    key: "screening-spin",
    name: "Social Phobia Inventory (SPIN)",
    shortName: "SPIN",
    instructions:
      "Beside each statement, choose the option that best describes how you have been feeling during the last week.",
    timeframe: "Last week",
    options: SPIN_OPTIONS,
    items: [
      { text: "I am afraid of people in authority" },
      { text: "I am bothered by blushing in front of people" },
      { text: "Parties and social events scare me" },
      { text: "I avoid talking to people I don't know" },
      { text: "Being criticized scares me a lot" },
      { text: "I avoid doing things or speaking to people for fear of embarrassment" },
      { text: "Sweating in front of people causes me distress" },
      { text: "I avoid going to parties" },
      { text: "I avoid activities in which I am the centre of attention" },
      { text: "Talking to strangers scares me" },
      { text: "I avoid having to give speeches" },
      { text: "I would do anything to avoid being criticized" },
      { text: "Heart palpitations bother me when I am around people" },
      { text: "I am afraid of doing things when people might be watching" },
      { text: "Being embarrassed or looking stupid are among my worst fears" },
      { text: "I avoid speaking to anyone in authority" },
      { text: "Trembling or shaking in front of others is distressing to me" },
    ],
    maxScore: 68,
    severity: (s) => (s <= 20 ? "none to minimal" : s <= 30 ? "mild" : s <= 40 ? "moderate" : s <= 50 ? "severe" : "very severe"),
    interpretation: "0–20 none/minimal · 21–30 mild · 31–40 moderate · 41–50 severe · 51+ very severe",
    bestFor: "Social anxiety and social phobia",
  },
  {
    key: "screening-ace",
    name: "Adverse Childhood Experiences (ACE)",
    shortName: "ACE",
    instructions:
      "Before your 18th birthday, did any of the following happen to you? Answer only what you feel comfortable sharing.",
    timeframe: "Before age 18",
    options: YES_NO,
    items: [
      { text: "Did a parent or adult in your household often swear at you, insult you, or put you down?" },
      { text: "Did a parent or adult in your household often push, grab, slap, or hit you hard enough to leave marks?" },
      { text: "Did an adult or person at least 5 years older ever touch you sexually, or try to make you touch them sexually?" },
      { text: "Did you often feel that no one in your family loved you or thought you were important or special?" },
      { text: "Did you often feel that you did not have enough to eat, wore dirty clothes, or had no one to protect you?" },
      { text: "Were your parents ever separated or divorced?" },
      { text: "Was your mother or stepmother often pushed, hit, or threatened by a partner?" },
      { text: "Did you live with anyone who was a problem drinker or alcoholic, or who used street drugs?" },
      { text: "Was a household member depressed, mentally ill, or did a household member attempt suicide?" },
      { text: "Did a household member go to prison?" },
    ],
    maxScore: 10,
    severity: (s) => (s === 0 ? "no reported adversity" : s <= 3 ? "low to moderate" : s <= 5 ? "high" : "very high"),
    interpretation: "A score of 4 or more is linked to higher risk of adult health and mental health difficulties.",
    bestFor: "Childhood trauma history and its impact on adult functioning",
  },
  {
    key: "screening-pcptsd5",
    name: "PTSD screen (PC-PTSD-5)",
    shortName: "PC-PTSD-5",
    instructions:
      "Sometimes things happen that are unusually frightening, horrible, or traumatic. In the past month, have you...",
    timeframe: "Last month",
    options: YES_NO,
    items: [
      { text: "Had nightmares about the event(s), or thought about the event(s) when you did not want to?" },
      { text: "Tried hard not to think about the event(s), or went out of your way to avoid situations that reminded you of it?" },
      { text: "Been constantly on guard, watchful, or easily startled?" },
      { text: "Felt numb or detached from people, activities, or your surroundings?" },
      { text: "Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems it caused?" },
    ],
    maxScore: 5,
    severity: (s) => (s >= 3 ? "positive screen" : "negative screen"),
    interpretation: "3 or more 'Yes' answers is a positive screen — a full PCL-5 assessment is recommended.",
    bestFor: "Quick PTSD screening in first sessions",
  },
  {
    key: "screening-pcl5",
    name: "PTSD Checklist (PCL-5)",
    shortName: "PCL-5",
    instructions:
      "Below is a list of problems people sometimes have after a very stressful experience. In the past month, how much were you bothered by each problem?",
    timeframe: "Last month",
    options: PCL5_OPTIONS,
    items: [
      { text: "Repeated, disturbing, and unwanted memories of the stressful experience" },
      { text: "Repeated, disturbing dreams of the stressful experience" },
      { text: "Suddenly feeling or acting as if the stressful experience were actually happening again" },
      { text: "Feeling very upset when something reminded you of the stressful experience" },
      { text: "Having strong physical reactions when something reminded you of the stressful experience" },
      { text: "Avoiding memories, thoughts, or feelings related to the stressful experience" },
      { text: "Avoiding external reminders of the stressful experience" },
      { text: "Trouble remembering important parts of the stressful experience" },
      { text: "Having strong negative beliefs about yourself, other people, or the world" },
      { text: "Blaming yourself or someone else for the stressful experience or what happened after it" },
      { text: "Having strong negative feelings such as fear, horror, anger, guilt, or shame" },
      { text: "Loss of interest in activities that you used to enjoy" },
      { text: "Feeling distant or cut off from other people" },
      { text: "Trouble experiencing positive feelings" },
      { text: "Irritable behaviour, angry outbursts, or acting aggressively" },
      { text: "Taking too many risks or doing things that could cause you harm" },
      { text: "Being superalert or watchful or on guard" },
      { text: "Feeling jumpy or easily startled" },
      { text: "Having difficulty concentrating" },
      { text: "Trouble falling or staying asleep" },
    ],
    maxScore: 80,
    severity: (s) => (s <= 20 ? "minimal" : s <= 30 ? "mild" : s <= 45 ? "moderate (provisional PTSD)" : "severe"),
    interpretation: "A total of 31–33 or higher suggests probable PTSD and a full clinical assessment.",
    bestFor: "PTSD symptom severity and progress monitoring",
  },
];

export const getScale = (key: string) => SCREENING_SCALES.find((s) => s.key === key);
export const isScreeningKey = (key: string) => SCREENING_SCALES.some((s) => s.key === key);
