// Rotating warm, non-pressuring lines shown under the client greeting.
// Seeded by day-of-year so it's stable within a day but varies across days.

const LINES = [
  "Whatever today looks like, you're doing enough by showing up here.",
  "Small steps count. There's no pace you need to match.",
  "Some days are for doing, some are for resting — both are okay.",
  "You don't have to feel a certain way to be welcome here.",
  "Take your time. This space isn't going anywhere.",
  "Being here is already a kind of care.",
  "Whatever you're carrying today, you don't have to carry it perfectly.",
  "Notice one small thing that feels okay right now.",
  "You get to choose what to focus on today.",
  "Softness is allowed. So is difficulty.",
  "Progress isn't linear — and that's completely fine.",
  "You showed up. That already means something.",
];

export const getEncouragement = (date = new Date()) => {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const day = Math.floor(diff / 86400000);
  return LINES[day % LINES.length];
};

export const getGreeting = (name: string, date = new Date()) => {
  const h = date.getHours();
  const part = h < 5 ? "Hello" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const first = (name || "").split(" ")[0] || "there";
  return `${part}, ${first}`;
};