// Amani demo mode: scripted conversation and crisis detection.
// Pure functions only. Nothing typed by a visitor is sent or stored anywhere.

export const GREETING =
  "Hello, I'm Amani. I'm here to listen and share simple ideas that may help you feel a little calmer. What's on your mind today?";

export const QUICK_REPLIES = [
  { id: "school", label: "I feel stressed about school" },
  { id: "anxious", label: "I feel anxious" },
  { id: "counsellor", label: "I want to talk to a counsellor" },
] as const;

/** Words and phrases that switch demo mode to the safety card. */
const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/,
  /\bkill(ing)?\s+my\s*self\b/,
  /\bend(ing)?\s+(my\s+(own\s+)?life|it\s+all)\b/,
  /\btake\s+my\s+own\s+life\b/,
  /\bself[\s-]?harm/,
  /\b(hurt(ing)?|harm(ing)?|cut(ting)?)\s+my\s*self\b/,
  /\babus(e|ed|es|ing|ive)\b/,
  /\brap(e|ed|es|ing|ist)\b/,
  /\bwant(ed|s)?\s+to\s+die\b/,
  /\bdon'?t\s+want\s+to\s+(live|be\s+alive|be\s+here)\b/,
  /\bno\s+reason\s+to\s+live\b/,
  /\bbetter\s+off\s+dead\b/,
  /\boverdos(e|ed|ing)\b/,
];

export function normalise(text: string): string {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isCrisisMessage(text: string): boolean {
  const t = normalise(text);
  return CRISIS_PATTERNS.some((p) => p.test(t));
}

export interface DemoReply {
  text: string;
  /** True when the visitor asked for a person: show the counsellor prompt at once. */
  wantsCounsellor?: boolean;
}

const SCHOOL =
  "That sounds like a lot to carry. A few small things that often help:\n\n• Write down everything due this week, then pick just one task for the next 25 minutes.\n• Take a 5-minute break after each study block: stand up, stretch, drink some water.\n• Try to keep a regular bedtime, even in busy weeks.\n\nYou do not have to do it all today. What feels heaviest right now?";

const ANXIOUS =
  "I'm glad you said it out loud. When anxiety is loud, these can help in the moment:\n\n• Breathe in for 4 counts, out for 6. Repeat five times.\n• Name 5 things you can see, 4 you can touch, 3 you can hear.\n• Loosen your shoulders and unclench your jaw.\n\nThese ease the moment; they do not replace support. What do you notice in your body right now?";

const COUNSELLOR =
  "Choosing to talk to a person is a strong step. A licensed counsellor can listen properly and plan support with you. I can point you to booking whenever you are ready.";

const SLEEP =
  "Poor sleep makes everything feel heavier. Gentle ideas: keep a steady bedtime, put your phone away 30 minutes before sleep, and write tomorrow's worries on paper so your mind can put them down. How have your nights been?";

const LONELY =
  "Feeling alone can hurt, and many people feel it more than they say. One small step: message one person you trust with something simple, like 'thinking of you'. Connection can start small. Who feels safest to reach out to?";

const WORK =
  "Work pressure can follow you home. Try a short reset between tasks: stand, stretch, and take three slow breaths. Writing down what is in your control, and what is not, can also lighten the load. What part of work weighs on you most?";

const FAMILY =
  "Family and relationships can bring both comfort and stress. It can help to pause before a hard conversation, name how you feel in one sentence, and choose one thing you want the other person to understand. What has been hardest?";

const GENERIC = [
  "Thank you for sharing that. Feelings like this are more common than people admit. If you can, take one slow breath and drop your shoulders. Would you like to tell me a little more?",
  "I hear you. Small steps can help: a glass of water, a short walk, or a few slow breaths. What is one thing that would make today a little easier?",
  "It takes courage to put this into words. You do not have to solve everything now. What would feel like a small, kind step for yourself today?",
];

const RULES: { test: RegExp; reply: string; counsellor?: boolean }[] = [
  { test: /\b(counsel+or|therapist|psycholog|talk to (a |some)?(one|person|professional)|speak to (a |some)?(one|person))\b/, reply: COUNSELLOR, counsellor: true },
  { test: /\b(school|exam|exams|study|studying|teacher|grades|university|class|homework)\b/, reply: SCHOOL },
  { test: /\b(anxious|anxiety|panic|worried|worry|nervous|overthink\w*|on edge)\b/, reply: ANXIOUS },
  { test: /\b(sleep|insomnia|tired|can'?t sleep|exhausted)\b/, reply: SLEEP },
  { test: /\b(lonely|alone|isolated|no friends)\b/, reply: LONELY },
  { test: /\b(work|job|boss|office|burn ?out|workload)\b/, reply: WORK },
  { test: /\b(family|parents|mother|father|marriage|partner|boyfriend|girlfriend|relationship)\b/, reply: FAMILY },
];

/** Scripted reply. `turn` is the zero-based count of earlier visitor messages. */
export function demoReply(text: string, turn = 0): DemoReply {
  const t = normalise(text);
  const rule = RULES.find((r) => r.test.test(t));
  if (rule) return { text: rule.reply, wantsCounsellor: !!rule.counsellor };
  return { text: GENERIC[Math.abs(turn) % GENERIC.length] };
}
