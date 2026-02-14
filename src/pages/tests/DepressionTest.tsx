import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { depressionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const DepressionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "depression",
        title: "Depression",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test is based on the PHQ-9, a widely-used tool for screening depression. Answer each question honestly based on how you've been feeling over the past two weeks.",
        metaDescription: "Take our free, confidential depression screening test. Get instant results and learn about symptoms, diagnosis, and treatment options for depression.",
        heroColor: "text-blue-200",
        heroGradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
        questions: depressionQuestions,
        recommendation: "Clinical Psychologist or Psychiatric Clinician",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 27,
        getSeverity: (score) => getStandardSeverity(score, 27),
      }}
    />
  );
};

export default DepressionTest;
