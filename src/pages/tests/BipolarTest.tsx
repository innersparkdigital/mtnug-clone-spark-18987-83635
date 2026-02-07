import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { bipolarQuestions, getStandardSeverity } from "@/lib/assessmentData";

const BipolarTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "bipolar",
        title: "Bipolar Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess mood swing patterns associated with bipolar disorder. Answer each question honestly.",
        metaDescription: "Take our free, confidential bipolar disorder screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-blue-200",
        heroGradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
        questions: bipolarQuestions,
        recommendation: "Mood Disorder Specialist or Psychiatrist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 45,
        getSeverity: (score) => getStandardSeverity(score, 45),
      }}
    />
  );
};

export default BipolarTest;
