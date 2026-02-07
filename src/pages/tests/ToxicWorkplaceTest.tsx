import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { toxicWorkplaceQuestions, getStandardSeverity } from "@/lib/assessmentData";

const ToxicWorkplaceTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "toxic-workplace",
        title: "Toxic Workplace",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess your work environment and its impact on your mental health. Answer each question honestly.",
        metaDescription: "Take our free, confidential toxic workplace screening test. Get instant results and learn about workplace wellness.",
        heroColor: "text-red-200",
        heroGradient: "bg-gradient-to-br from-red-600 via-red-700 to-rose-800",
        questions: toxicWorkplaceQuestions,
        recommendation: "Workplace Wellness Counselor",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default ToxicWorkplaceTest;
