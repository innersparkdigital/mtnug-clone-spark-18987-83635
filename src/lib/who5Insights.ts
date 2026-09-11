// WHO-5 presentation helpers. Questions and scoring are unchanged —
// this file only holds plain-language, non-clinical context for each item.

export const WHO5_QUESTIONS = [
  'I have felt cheerful and in good spirits',
  'I have felt calm and relaxed',
  'I have felt active and vigorous',
  'I woke up feeling fresh and rested',
  'My daily life has been filled with things that interest me',
];

export const WHO5_ANSWER_OPTIONS = [
  { value: 0, label: 'At no time' },
  { value: 1, label: 'Some of the time' },
  { value: 2, label: 'Less than half the time' },
  { value: 3, label: 'More than half the time' },
  { value: 4, label: 'Most of the time' },
  { value: 5, label: 'All of the time' },
];

export const getAnswerLabel = (value: number | null) =>
  WHO5_ANSWER_OPTIONS.find((o) => o.value === value)?.label ?? 'Not answered';

type Band = 'lower' | 'middle' | 'higher';

export const getAnswerBand = (value: number | null): Band => {
  if (value === null) return 'middle';
  if (value <= 1) return 'lower';
  if (value <= 3) return 'middle';
  return 'higher';
};

interface ItemInsight {
  area: string;
  notes: Record<Band, string>;
  suggestions: Record<Band, string>;
}

const ITEMS: ItemInsight[] = [
  {
    area: 'Mood and spirits',
    notes: {
      lower:
        'This area generally reflects day-to-day mood and emotional energy. Answering at the lower end often means the past two weeks have felt heavy or flat.',
      middle:
        'This area generally reflects day-to-day mood and emotional energy. A middle answer usually means good spirits come and go depending on the day.',
      higher:
        'This area generally reflects day-to-day mood and emotional energy, and your answer suggests it has held up fairly well recently.',
    },
    suggestions: {
      lower:
        'Try ten minutes of morning sunlight before you pick up your phone — light early in the day gently supports mood.',
      middle:
        'Notice which days feel lighter and what was different about them, then repeat one small part of that on purpose.',
      higher:
        'Keep the small routines that lift your spirits — a favourite playlist, a short chat with someone you like.',
    },
  },
  {
    area: 'Calm and tension',
    notes: {
      lower:
        'This area generally reflects how settled your body and mind feel. A lower answer often points to ongoing tension or a mind that stays busy.',
      middle:
        'This area generally reflects how settled your body and mind feel. A middle answer usually means calm is available but easily interrupted.',
      higher:
        'This area generally reflects how settled your body and mind feel, and your answer suggests you find calm reasonably often.',
    },
    suggestions: {
      lower:
        'Once today, breathe in for four counts, out for six, for one minute. Slow exhales help the body settle.',
      middle:
        'Put one screen-free pause in your day — even five quiet minutes after lunch counts.',
      higher:
        'Protect the pause you already take; it is doing more for you than it looks like.',
    },
  },
  {
    area: 'Energy and activity',
    notes: {
      lower:
        'This area generally reflects physical energy and drive. A lower answer often shows up when rest, movement, or motivation have been in short supply.',
      middle:
        'This area generally reflects physical energy and drive. A middle answer usually means energy is uneven across the week.',
      higher:
        'This area generally reflects physical energy and drive, and your answer suggests it has been fairly steady.',
    },
    suggestions: {
      lower:
        'Start smaller than feels useful: a ten-minute walk outside, once a day. Movement usually comes before motivation, not after.',
      middle:
        'Add one short walk to a part of the day you already keep — after a meal, or before you settle in for the evening.',
      higher:
        'Keep the movement you enjoy rather than the movement you think you should do.',
    },
  },
  {
    area: 'Sleep and rest',
    notes: {
      lower:
        'This area generally reflects how restorative your sleep feels. A lower answer often relates to short, broken, or restless nights.',
      middle:
        'This area generally reflects how restorative your sleep feels. A middle answer usually means some mornings land better than others.',
      higher:
        'This area generally reflects how restorative your sleep feels, and your answer suggests you are waking up reasonably rested.',
    },
    suggestions: {
      lower:
        'Aim for the same wake-up time for the next few days, and keep your phone out of reach for the first thirty minutes.',
      middle:
        'Try dimming lights and screens an hour before bed for a few nights and see if mornings feel different.',
      higher:
        'Hold on to your current sleep and wake times, especially over weekends.',
    },
  },
  {
    area: 'Interest and meaning',
    notes: {
      lower:
        'This area generally reflects how engaging daily life feels. A lower answer often means days have felt repetitive or hard to care about.',
      middle:
        'This area generally reflects how engaging daily life feels. A middle answer usually means interest is there in some parts of the day.',
      higher:
        'This area generally reflects how engaging daily life feels, and your answer suggests your days hold things you care about.',
    },
    suggestions: {
      lower:
        'Pick one thing you used to enjoy and do a fifteen-minute version of it this week — no need to enjoy it fully yet.',
      middle:
        'Schedule one thing you look forward to before the week starts, however small.',
      higher:
        'Keep making room for what interests you; it is part of what is holding your wellbeing up.',
    },
  },
];

export interface QuestionBreakdown {
  question: string;
  area: string;
  answerLabel: string;
  value: number | null;
  band: Band;
  note: string;
  suggestion: string;
}

export const buildWho5Breakdown = (answers: (number | null)[]): QuestionBreakdown[] =>
  WHO5_QUESTIONS.map((question, i) => {
    const value = answers[i] ?? null;
    const band = getAnswerBand(value);
    const item = ITEMS[i];
    return {
      question,
      area: item.area,
      answerLabel: getAnswerLabel(value),
      value,
      band,
      note: item.notes[band],
      suggestion: item.suggestions[band],
    };
  });
