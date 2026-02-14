import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { maniaQuestions, getStandardSeverity } from "@/lib/assessmentData";

const ManiaTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "mania",
        title: "Mania",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening tool helps identify symptoms of mania or hypomania based on the Mood Disorder Questionnaire. Answer honestly based on your experiences.",
        metaDescription: "Take our free, confidential mania screening test. Get instant results and learn about symptoms, diagnosis, and treatment options.",
        heroColor: "text-amber-200",
        heroGradient: "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800",
        questions: maniaQuestions,
        recommendation: "Psychiatrist or Mood Disorder Specialist",
        recommendedFormat: "Psychiatric Evaluation",
        maxScore: 13,
        getSeverity: (score) => getStandardSeverity(score, 13),
      }}
    />
  );
};

export default ManiaTest;
