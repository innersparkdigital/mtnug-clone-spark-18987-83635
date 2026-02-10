// Maps specialist specialties/types to relevant assessment IDs
// Used when a user selects a specialist first and needs auto-assigned assessments

const specialtyToAssessments: Record<string, string[]> = {
  // Keywords found in specialist specialties/type fields
  "depression": ["depression", "sad"],
  "anxiety": ["anxiety", "social-anxiety", "panic-disorder", "agoraphobia", "separation-anxiety"],
  "mood": ["depression", "bipolar", "mania", "sad"],
  "trauma": ["ptsd", "did", "grief"],
  "ptsd": ["ptsd"],
  "stress": ["stress", "job-burnout", "work-life-balance"],
  "burnout": ["job-burnout", "stress", "work-life-balance", "toxic-workplace"],
  "addiction": ["gambling-addiction", "internet-addiction", "video-game-addiction", "sex-addiction"],
  "substance": ["gambling-addiction"],
  "alcohol": ["gambling-addiction"],
  "gambling": ["gambling-addiction"],
  "eating": ["eating-disorder", "binge-eating"],
  "body image": ["eating-disorder", "binge-eating"],
  "relationship": ["relationship-health", "sex-addiction"],
  "intimacy": ["relationship-health", "sex-addiction"],
  "couples": ["relationship-health"],
  "marriage": ["relationship-health"],
  "family": ["relationship-health", "grief", "postpartum"],
  "parenting": ["postpartum"],
  "postpartum": ["postpartum"],
  "perinatal": ["postpartum"],
  "ocd": ["ocd", "hoarding"],
  "obsessive": ["ocd"],
  "compulsive": ["ocd", "hoarding"],
  "bipolar": ["bipolar", "mania"],
  "adhd": ["adult-adhd"],
  "attention": ["adult-adhd"],
  "focus": ["adult-adhd"],
  "personality": ["bpd", "npd", "sociopath"],
  "borderline": ["bpd"],
  "narcissistic": ["npd"],
  "grief": ["grief"],
  "bereavement": ["grief"],
  "loss": ["grief"],
  "sleep": ["sleep-disorder"],
  "insomnia": ["sleep-disorder"],
  "psychosis": ["psychosis", "schizophrenia"],
  "schizophrenia": ["schizophrenia"],
  "dissociative": ["did"],
  "gender": ["gender-dysphoria"],
  "lgbtq": ["gender-dysphoria"],
  "self-esteem": ["imposter-syndrome", "job-satisfaction"],
  "confidence": ["imposter-syndrome"],
  "career": ["job-satisfaction", "work-life-balance", "job-burnout"],
  "work": ["job-burnout", "toxic-workplace", "work-life-balance", "job-satisfaction"],
  "workplace": ["toxic-workplace", "job-burnout"],
  "occupational": ["job-burnout", "toxic-workplace", "work-life-balance"],
  "panic": ["panic-disorder", "anxiety", "agoraphobia"],
  "social": ["social-anxiety", "empathy-deficit"],
  "empathy": ["empathy-deficit"],
  "emotional": ["depression", "anxiety", "empathy-deficit"],
  "behavioral": ["video-game-addiction", "internet-addiction"],
  "internet": ["internet-addiction"],
  "gaming": ["video-game-addiction"],
  "sexual": ["sex-addiction"],
  "child": ["separation-anxiety"],
  "adolescent": ["separation-anxiety"],
  "youth": ["video-game-addiction", "separation-anxiety"],
};

/**
 * Given a specialist's type and specialties, return a list of relevant assessment IDs
 * sorted by relevance (most matches first).
 */
export function getRelevantAssessments(
  specialistType: string,
  specialties: string[]
): string[] {
  const assessmentScores: Record<string, number> = {};

  const allText = [specialistType, ...specialties]
    .join(" ")
    .toLowerCase();

  for (const [keyword, assessmentIds] of Object.entries(specialtyToAssessments)) {
    if (allText.includes(keyword.toLowerCase())) {
      for (const id of assessmentIds) {
        assessmentScores[id] = (assessmentScores[id] || 0) + 1;
      }
    }
  }

  // Sort by score descending
  const sorted = Object.entries(assessmentScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  // If no matches found, return general assessments
  if (sorted.length === 0) {
    return ["depression", "anxiety", "stress"];
  }

  return sorted;
}
