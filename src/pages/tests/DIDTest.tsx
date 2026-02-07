import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { didQuestions, getStandardSeverity } from "@/lib/assessmentData";

const DIDTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "did",
        title: "Dissociative Identity Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess symptoms associated with dissociative experiences. Answer each question honestly.",
        metaDescription: "Take our free, confidential DID screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-indigo-200",
        heroGradient: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800",
        questions: didQuestions,
        recommendation: "Trauma Specialist",
        recommendedFormat: "1:1 Specialized Therapy",
        maxScore: 45,
        getSeverity: (score) => getStandardSeverity(score, 45),
      }}
    />
  );
};

export default DIDTest;
