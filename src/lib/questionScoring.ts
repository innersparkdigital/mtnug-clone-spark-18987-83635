export type ScoredQuestion = {
  id: string;
  label: string;
  type: "text" | "long_text" | "scale" | "yes_no" | "mcq";
  options?: string[];
  option_scores?: number[];
  scale_min?: number;
  scale_max?: number;
  required?: boolean;
  scored?: boolean;
  yes_score?: number;
  no_score?: number;
};

/** Points a single answer contributes. Returns null when the question isn't scored. */
export function scoreAnswer(q: ScoredQuestion, answer: unknown): number | null {
  if (!q.scored) return null;
  if (answer === undefined || answer === null || answer === "") return 0;
  switch (q.type) {
    case "scale":
      return Number(answer) || 0;
    case "yes_no":
      return answer === "Yes" ? (q.yes_score ?? 1) : (q.no_score ?? 0);
    case "mcq": {
      const idx = (q.options || []).indexOf(String(answer));
      if (idx < 0) return 0;
      return q.option_scores?.[idx] ?? idx;
    }
    default:
      return 0;
  }
}

/** Highest achievable points for a single question (0 when unscored/unscorable). */
export function maxPointsFor(q: ScoredQuestion): number {
  if (!q.scored) return 0;
  switch (q.type) {
    case "scale":
      return q.scale_max ?? 10;
    case "yes_no":
      return Math.max(q.yes_score ?? 1, q.no_score ?? 0);
    case "mcq": {
      const scores = (q.options || []).map((_, i) => q.option_scores?.[i] ?? i);
      return scores.length ? Math.max(...scores) : 0;
    }
    default:
      return 0;
  }
}

export function maxScoreForSet(questions: ScoredQuestion[]): number {
  return questions.reduce((sum, q) => sum + maxPointsFor(q), 0);
}

export function hasScoredQuestions(questions: ScoredQuestion[]): boolean {
  return questions.some((q) => q.scored && maxPointsFor(q) > 0);
}

/** Total score for a submission, or null when nothing is scored. */
export function totalScore(questions: ScoredQuestion[], answers: Record<string, unknown>): number | null {
  if (!hasScoredQuestions(questions)) return null;
  return questions.reduce((sum, q) => sum + (scoreAnswer(q, answers[q.id]) ?? 0), 0);
}
