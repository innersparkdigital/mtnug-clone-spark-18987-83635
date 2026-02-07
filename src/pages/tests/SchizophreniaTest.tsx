import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { schizophreniaQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SchizophreniaTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "schizophrenia",
        title: "Schizophrenia",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess symptoms that may be associated with schizophrenia. Answer each question honestly.",
        metaDescription: "Take our free, confidential schizophrenia screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-gray-200",
        heroGradient: "bg-gradient-to-br from-gray-600 via-gray-700 to-slate-800",
        questions: schizophreniaQuestions,
        recommendation: "Psychiatrist",
        recommendedFormat: "Psychiatric Care + Therapy",
        maxScore: 45,
        getSeverity: (score) => getStandardSeverity(score, 45),
      }}
    />
  );
};

export default SchizophreniaTest;
