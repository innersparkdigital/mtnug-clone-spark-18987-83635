import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { narcissisticPersonalityQuestions, getStandardSeverity } from "@/lib/assessmentData";

const NarcissisticPersonalityTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "narcissistic-personality",
        title: "Narcissistic Personality",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test helps identify traits associated with narcissistic personality patterns. Answer each question honestly based on your typical behavior.",
        metaDescription: "Take our free, confidential narcissistic personality screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-indigo-200",
        heroGradient: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800",
        questions: narcissisticPersonalityQuestions,
        recommendation: "Clinical Psychologist",
        recommendedFormat: "1:1 Specialized Therapy",
        maxScore: 45,
        getSeverity: (score) => getStandardSeverity(score, 45),
      }}
    />
  );
};

export default NarcissisticPersonalityTest;
