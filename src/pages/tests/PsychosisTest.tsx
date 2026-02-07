import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { psychosisQuestions, getStandardSeverity } from "@/lib/assessmentData";

const PsychosisTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "psychosis",
        title: "Psychosis",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess symptoms that may be associated with psychosis. Answer each question honestly.",
        metaDescription: "Take our free, confidential psychosis screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-red-200",
        heroGradient: "bg-gradient-to-br from-red-600 via-red-700 to-rose-800",
        questions: psychosisQuestions,
        recommendation: "Psychiatrist",
        recommendedFormat: "Immediate Medical Consultation",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default PsychosisTest;
