import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { imposterSyndromeQuestions, getStandardSeverity } from "@/lib/assessmentData";

const ImposterSyndromeTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "imposter-syndrome",
        title: "Imposter Syndrome",
        subtitle: "Take this assessment. It's quick, free, and you'll get your confidential results instantly.",
        description: "This assessment helps evaluate imposter feelings. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential imposter syndrome assessment. Get instant results and learn about overcoming self-doubt.",
        heroColor: "text-yellow-200",
        heroGradient: "bg-gradient-to-br from-yellow-600 via-yellow-700 to-amber-800",
        questions: imposterSyndromeQuestions,
        recommendation: "CBT Therapist or Life Coach",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default ImposterSyndromeTest;
