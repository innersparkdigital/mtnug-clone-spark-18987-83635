import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { relationshipHealthQuestions, getStandardSeverity } from "@/lib/assessmentData";

const RelationshipHealthTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "relationship-health",
        title: "Relationship Health",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess the health of your relationships. Answer each question honestly.",
        metaDescription: "Take our free, confidential relationship health assessment. Get instant results and learn about improving your relationships.",
        heroColor: "text-pink-200",
        heroGradient: "bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800",
        questions: relationshipHealthQuestions,
        recommendation: "Couples Therapist or Relationship Counselor",
        recommendedFormat: "1:1 or Couples Therapy",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default RelationshipHealthTest;
