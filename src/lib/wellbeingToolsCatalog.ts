export interface WellbeingTool {
  key: string;
  name: string;
  short: string;
  description: string;
  status: "ready" | "coming-soon";
  category: "core" | "screening" | "safety";
}

// Full 12-tool catalog. Tools shipped in Sub-phase 2A are marked "ready";
// the rest ship in Sub-phase 2B / 2C.
export const WELLBEING_TOOLS: WellbeingTool[] = [
  {
    key: "thought-record",
    name: "Thought recording worksheet",
    short: "Look at a difficult thought and find a more balanced view.",
    description:
      "Guides you through a situation, the automatic thought, the emotion, evidence for and against, and a more balanced conclusion.",
    status: "ready",
    category: "core",
  },
  {
    key: "homework",
    name: "Homework tracker",
    short: "Tasks your therapist set for you between sessions.",
    description:
      "Mark each task as not started, in progress, or complete. Reflect on what helped and what got in the way.",
    status: "ready",
    category: "core",
  },
  {
    key: "emotion-diary",
    name: "Emotion and trigger diary",
    short: "Notice patterns in how you feel across the week.",
    description:
      "Log a situation, the emotions you felt (with intensity), your thoughts, your response, and the outcome.",
    status: "ready",
    category: "core",
  },
  {
    key: "activity-schedule",
    name: "Activity scheduling",
    short: "Plan your week and see what lifted your mood.",
    description:
      "A simple Mon–Sun grid with morning, afternoon, and evening slots to plan and reflect on activities.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "event-scoring",
    name: "Event and situation scoring",
    short: "Rate how much a situation is bothering you (0–100).",
    description:
      "Track distress over time so you can see whether things are getting easier.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "goals",
    name: "Goal setting and tracking",
    short: "Work through a goal your therapist has set with you.",
    description:
      "Tick off steps, note what helped, and share what's getting in the way.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "relaxation",
    name: "Relaxation and coping toolbox",
    short: "Audio exercises, techniques, and affirmations chosen for you.",
    description:
      "Use these whenever you need them — not just when things feel unbearable.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "session-reflection",
    name: "Session reflection",
    short: "A few minutes after your session to hold onto what mattered.",
    description:
      "Notice what was useful, what felt difficult, and what you want to focus on next time.",
    status: "ready",
    category: "core",
  },
  {
    key: "screening-phq9",
    name: "Wellbeing check (PHQ-9)",
    short: "Short questionnaire on how you've been feeling.",
    description: "Validated 9-question mood check-in reviewed by your therapist.",
    status: "coming-soon",
    category: "screening",
  },
  {
    key: "screening-gad7",
    name: "Wellbeing check (GAD-7)",
    short: "Short questionnaire on anxiety over the last two weeks.",
    description: "Validated 7-question anxiety check-in reviewed by your therapist.",
    status: "coming-soon",
    category: "screening",
  },
  {
    key: "gratitude",
    name: "Strengths and gratitude journal",
    short: "Notice what went well and what you did well.",
    description: "Under two minutes. Builds resilience over time.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "self-care",
    name: "Self-care tracker",
    short: "Sleep, water, movement, and mood in one place.",
    description: "Daily basics that affect mental health more than most people realise.",
    status: "coming-soon",
    category: "core",
  },
  {
    key: "safety-checkin",
    name: "Safety check-in",
    short: "A gentle check-in for hard days.",
    description:
      "Activates when you've been having a very hard time. Your therapist and clinical team are notified so you're never alone.",
    status: "ready",
    category: "safety",
  },
];

export const getTool = (key: string) => WELLBEING_TOOLS.find((t) => t.key === key);