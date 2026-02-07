import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { sadQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SADTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "sad",
        title: "Seasonal Affective Disorder (SAD)",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess seasonal depression patterns. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential SAD screening test. Get instant results and learn about seasonal depression and treatment options.",
        heroColor: "text-sky-200",
        heroGradient: "bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800",
        questions: sadQuestions,
        recommendation: "Mood Disorder Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default SADTest;
