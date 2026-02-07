import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { separationAnxietyQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SeparationAnxietyTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "separation-anxiety",
        title: "Separation Anxiety",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess separation anxiety symptoms. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential separation anxiety screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-pink-200",
        heroGradient: "bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800",
        questions: separationAnxietyQuestions,
        recommendation: "Anxiety Therapist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default SeparationAnxietyTest;
