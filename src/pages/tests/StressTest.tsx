import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { stressQuestions, getStandardSeverity } from "@/lib/assessmentData";

const StressTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "stress",
        title: "Stress",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess your stress levels. Answer each question honestly based on your experiences over the past month.",
        metaDescription: "Take our free, confidential stress assessment test. Get instant results and learn about stress management techniques.",
        heroColor: "text-teal-200",
        heroGradient: "bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800",
        questions: stressQuestions,
        recommendation: "Stress Management Counselor",
        recommendedFormat: "1:1 Therapy or Support Group",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default StressTest;
