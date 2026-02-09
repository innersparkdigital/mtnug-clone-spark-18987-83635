// Therapist Matching & Fair Assignment Algorithm
// This module handles condition-based matching and load-balanced therapist assignment

import { supabase } from "@/integrations/supabase/client";

export interface MatchedTherapist {
  id: string;
  name: string;
  type: string;
  specialties: string[];
  experience_years: number;
  price_per_hour: number;
  image_url: string | null;
  bio: string | null;
  matchScore: number;
  matchReason: string;
}

export interface TherapistAssignmentResult {
  therapist: MatchedTherapist | null;
  fallbackMessage: string | null;
  alternativeOptions: {
    generalTherapist: boolean;
    supportGroup: boolean;
    waitlist: boolean;
  };
}

// Mapping of assessment conditions to specialist types and keywords
const conditionToSpecialistMap: Record<string, {
  types: string[];
  keywords: string[];
  categories: string[];
}> = {
  // Addiction-related conditions
  "depression": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["depression", "mood", "bipolar", "anxiety", "emotional"],
    categories: ["depression-anxiety"]
  },
  "anxiety": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["anxiety", "panic", "stress", "worry", "nervous"],
    categories: ["depression-anxiety"]
  },
  "ptsd": {
    types: ["counselor", "Trauma Specialist"],
    keywords: ["trauma", "ptsd", "stress", "abuse", "violence"],
    categories: ["trauma-stress"]
  },
  "adult-adhd": {
    types: ["counselor", "ADHD Specialist"],
    keywords: ["adhd", "attention", "focus", "concentration"],
    categories: ["depression-anxiety"]
  },
  "bpd": {
    types: ["counselor", "Personality Disorder Specialist"],
    keywords: ["borderline", "personality", "emotional regulation", "relationships"],
    categories: ["relationships-intimacy"]
  },
  "eating-disorder": {
    types: ["counselor", "Eating Disorder Specialist"],
    keywords: ["eating", "food", "body image", "weight"],
    categories: ["self-esteem-growth"]
  },
  "gambling-addiction": {
    types: ["counselor"],
    keywords: ["addiction", "gambling", "substance", "recovery"],
    categories: ["addiction"]
  },
  "mania": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["bipolar", "mania", "mood", "manic"],
    categories: ["depression-anxiety"]
  },
  "npd": {
    types: ["counselor", "Personality Disorder Specialist"],
    keywords: ["narcissistic", "personality", "self-esteem"],
    categories: ["self-esteem-growth"]
  },
  "postpartum": {
    types: ["counselor", "Perinatal Mental Health Specialist"],
    keywords: ["postpartum", "perinatal", "pregnancy", "new parents", "parenting"],
    categories: ["family-couples"]
  },
  "sex-addiction": {
    types: ["Relationship & Intimacy Specialist", "counselor"],
    keywords: ["intimacy", "sexual", "relationship", "addiction"],
    categories: ["relationships-intimacy", "addiction"]
  },
  "video-game-addiction": {
    types: ["counselor", "Behavioral Addiction Specialist"],
    keywords: ["addiction", "behavioral", "youth", "adolescent"],
    categories: ["addiction", "child-adolescent"]
  },
  "internet-addiction": {
    types: ["counselor", "Digital Wellness Therapist"],
    keywords: ["addiction", "behavioral", "internet", "digital"],
    categories: ["addiction"]
  },
  "job-burnout": {
    types: ["Work & Occupational Therapist", "counselor"],
    keywords: ["burnout", "work", "occupational", "stress", "workplace"],
    categories: ["work-stress"]
  },
  "toxic-workplace": {
    types: ["Work & Occupational Therapist", "counselor"],
    keywords: ["workplace", "work", "occupational", "stress", "burnout"],
    categories: ["work-stress"]
  },
  "panic-disorder": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["panic", "anxiety", "stress", "fear"],
    categories: ["depression-anxiety"]
  },
  "ocd": {
    types: ["counselor", "OCD Specialist"],
    keywords: ["ocd", "obsessive", "compulsive", "anxiety"],
    categories: ["depression-anxiety"]
  },
  "bipolar": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["bipolar", "mood", "depression", "mania"],
    categories: ["depression-anxiety"]
  },
  "social-anxiety": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["social", "anxiety", "fear", "stress"],
    categories: ["depression-anxiety"]
  },
  "hoarding": {
    types: ["counselor", "OCD Specialist"],
    keywords: ["hoarding", "ocd", "compulsive", "behavioral"],
    categories: ["depression-anxiety"]
  },
  "psychosis": {
    types: ["counselor", "Psychiatrist"],
    keywords: ["psychosis", "mental health", "psychiatric"],
    categories: ["crisis-emergency"]
  },
  "grief": {
    types: ["Family & Couples Counselor", "counselor"],
    keywords: ["grief", "bereavement", "loss", "death", "mourning"],
    categories: ["grief-bereavement"]
  },
  "did": {
    types: ["counselor", "Trauma Specialist"],
    keywords: ["dissociative", "trauma", "identity", "complex trauma"],
    categories: ["trauma-stress"]
  },
  "schizophrenia": {
    types: ["counselor", "Psychiatrist"],
    keywords: ["schizophrenia", "psychosis", "psychiatric"],
    categories: ["crisis-emergency"]
  },
  "stress": {
    types: ["Work & Occupational Therapist", "counselor"],
    keywords: ["stress", "burnout", "anxiety", "overwhelmed"],
    categories: ["work-stress", "depression-anxiety"]
  },
  "agoraphobia": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["agoraphobia", "anxiety", "panic", "fear"],
    categories: ["depression-anxiety"]
  },
  "separation-anxiety": {
    types: ["counselor", "Anxiety Therapist"],
    keywords: ["separation", "anxiety", "attachment", "fear"],
    categories: ["depression-anxiety", "child-adolescent"]
  },
  "sleep-disorder": {
    types: ["counselor", "Sleep Specialist"],
    keywords: ["sleep", "insomnia", "rest", "fatigue"],
    categories: ["depression-anxiety"]
  },
  "empathy-deficit": {
    types: ["counselor", "Psychotherapist"],
    keywords: ["empathy", "emotional", "relationship", "social"],
    categories: ["relationships-intimacy"]
  },
  "binge-eating": {
    types: ["counselor", "Eating Disorder Specialist"],
    keywords: ["eating", "binge", "food", "weight"],
    categories: ["self-esteem-growth"]
  },
  "gender-dysphoria": {
    types: ["counselor", "Gender-Affirming Therapist"],
    keywords: ["gender", "identity", "transition", "lgbtq"],
    categories: ["self-esteem-growth"]
  },
  "relationship-health": {
    types: ["Relationship & Intimacy Specialist", "Family & Couples Counselor", "counselor"],
    keywords: ["relationship", "couples", "intimacy", "communication", "marriage"],
    categories: ["relationships-intimacy", "family-couples"]
  },
  "sociopath": {
    types: ["counselor", "Forensic Psychologist"],
    keywords: ["personality", "behavioral", "forensic"],
    categories: ["self-esteem-growth"]
  },
  "job-satisfaction": {
    types: ["Work & Occupational Therapist", "Self-Esteem & Personal Growth Coach", "counselor"],
    keywords: ["job", "career", "work", "satisfaction", "motivation"],
    categories: ["work-stress", "self-esteem-growth"]
  },
  "work-life-balance": {
    types: ["Work & Occupational Therapist", "Self-Esteem & Personal Growth Coach", "counselor"],
    keywords: ["work", "life", "balance", "stress", "burnout"],
    categories: ["work-stress"]
  },
  "imposter-syndrome": {
    types: ["Self-Esteem & Personal Growth Coach", "counselor"],
    keywords: ["imposter", "self-esteem", "confidence", "self-worth"],
    categories: ["self-esteem-growth"]
  },
  "sad": {
    types: ["Mood & Anxiety Therapist", "counselor"],
    keywords: ["seasonal", "depression", "mood", "affective"],
    categories: ["depression-anxiety"]
  }
};

// Track therapist assignment history for fair distribution
// In production, this would be stored in the database
let assignmentHistory: Map<string, { count: number; lastAssigned: Date }> = new Map();

// Calculate match score for a therapist against a condition
function calculateMatchScore(
  specialist: { type: string; specialties: string[]; bio: string | null },
  condition: string
): { score: number; reason: string } {
  const mapping = conditionToSpecialistMap[condition];
  if (!mapping) {
    return { score: 0, reason: "General mental health support" };
  }

  let score = 0;
  let reasons: string[] = [];

  // Check specialist type match (highest weight)
  if (mapping.types.some(t => specialist.type.toLowerCase().includes(t.toLowerCase()))) {
    score += 50;
    reasons.push("Specialist in this area");
  }

  // Check specialty keywords
  const specialtiesText = specialist.specialties.join(" ").toLowerCase();
  const bioText = (specialist.bio || "").toLowerCase();
  
  const keywordMatches = mapping.keywords.filter(
    keyword => specialtiesText.includes(keyword) || bioText.includes(keyword)
  );
  
  if (keywordMatches.length > 0) {
    score += keywordMatches.length * 10;
    reasons.push(`Experience with ${keywordMatches.slice(0, 2).join(", ")}`);
  }

  // Fallback for general counselors
  if (score === 0 && specialist.type.toLowerCase().includes("counselor")) {
    score = 20;
    reasons.push("Licensed mental health professional");
  }

  return {
    score,
    reason: reasons.length > 0 ? reasons.join(" • ") : "Available for support"
  };
}

// Fair distribution algorithm with weighted round-robin
function applyFairDistribution(
  therapists: MatchedTherapist[],
  topN: number = 5
): MatchedTherapist[] {
  // Sort by match score first
  const sortedByScore = [...therapists].sort((a, b) => b.matchScore - a.matchScore);
  
  // Take top matches for fair distribution consideration
  const topMatches = sortedByScore.slice(0, Math.min(topN, sortedByScore.length));
  
  if (topMatches.length === 0) return [];
  
  // Apply fair distribution weighting
  const now = new Date();
  const weightedTherapists = topMatches.map(therapist => {
    const history = assignmentHistory.get(therapist.id) || { count: 0, lastAssigned: new Date(0) };
    
    // Calculate fairness weight (lower count = higher priority)
    const countWeight = 1 / (history.count + 1);
    
    // Time decay - prefer therapists not recently assigned
    const hoursSinceLastAssignment = (now.getTime() - history.lastAssigned.getTime()) / (1000 * 60 * 60);
    const timeWeight = Math.min(hoursSinceLastAssignment / 24, 1); // Max out at 24 hours
    
    // Add small randomness for unpredictability
    const randomWeight = 0.9 + Math.random() * 0.2;
    
    // Combined fair score (match score still matters most)
    const fairScore = therapist.matchScore * 0.6 + 
                     (countWeight * 20) + 
                     (timeWeight * 10) + 
                     (randomWeight * 5);
    
    return { ...therapist, fairScore };
  });

  // Sort by fair score
  return weightedTherapists.sort((a, b) => (b as any).fairScore - (a as any).fairScore);
}

// Main function to find and assign a therapist
export async function findMatchingTherapist(
  assessmentType: string
): Promise<TherapistAssignmentResult> {
  try {
    // Fetch all active specialists
    const { data: specialists, error } = await supabase
      .from("specialists")
      .select("*")
      .eq("is_active", true);

    if (error || !specialists || specialists.length === 0) {
      return {
        therapist: null,
        fallbackMessage: "We're experiencing technical difficulties. Please try again or contact us directly.",
        alternativeOptions: {
          generalTherapist: true,
          supportGroup: true,
          waitlist: false
        }
      };
    }

    // Calculate match scores for all therapists
    const scoredTherapists: MatchedTherapist[] = specialists.map(specialist => {
      const { score, reason } = calculateMatchScore(
        {
          type: specialist.type,
          specialties: specialist.specialties,
          bio: specialist.bio
        },
        assessmentType
      );

      return {
        id: specialist.id,
        name: specialist.name,
        type: specialist.type,
        specialties: specialist.specialties,
        experience_years: specialist.experience_years,
        price_per_hour: specialist.price_per_hour,
        image_url: specialist.image_url,
        bio: specialist.bio,
        matchScore: score,
        matchReason: reason
      };
    });

    // Filter to only matching therapists
    const matchingTherapists = scoredTherapists.filter(t => t.matchScore > 0);

    if (matchingTherapists.length === 0) {
      // No specialist for this condition - return fallback
      const generalTherapist = scoredTherapists.find(t => 
        t.type.toLowerCase().includes("counselor")
      );

      return {
        therapist: generalTherapist ? {
          ...generalTherapist,
          matchReason: "Licensed mental health professional available for support"
        } : null,
        fallbackMessage: "We currently do not have a specialist available for this specific concern. You can continue with a general therapist, join a relevant support group, or be notified when a specialist becomes available.",
        alternativeOptions: {
          generalTherapist: !!generalTherapist,
          supportGroup: true,
          waitlist: true
        }
      };
    }

    // Apply fair distribution
    const fairlyDistributed = applyFairDistribution(matchingTherapists);
    const selectedTherapist = fairlyDistributed[0];

    // Update assignment history
    const history = assignmentHistory.get(selectedTherapist.id) || { count: 0, lastAssigned: new Date(0) };
    assignmentHistory.set(selectedTherapist.id, {
      count: history.count + 1,
      lastAssigned: new Date()
    });

    return {
      therapist: selectedTherapist,
      fallbackMessage: null,
      alternativeOptions: {
        generalTherapist: false,
        supportGroup: false,
        waitlist: false
      }
    };
  } catch (error) {
    console.error("Error finding matching therapist:", error);
    return {
      therapist: null,
      fallbackMessage: "We're experiencing technical difficulties. Please try again or contact us directly.",
      alternativeOptions: {
        generalTherapist: true,
        supportGroup: true,
        waitlist: false
      }
    };
  }
}

// Get specialist type recommendation based on condition
export function getRecommendedSpecialistType(assessmentType: string): string {
  const mapping = conditionToSpecialistMap[assessmentType];
  if (mapping && mapping.types.length > 0) {
    return mapping.types[0];
  }
  return "Licensed Mental Health Professional";
}

// Reset assignment history (for testing or daily reset)
export function resetAssignmentHistory(): void {
  assignmentHistory.clear();
}
