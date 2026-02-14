import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { ptsdQuestions, getStandardSeverity } from "@/lib/assessmentData";

const PTSDTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "ptsd",
        title: "PTSD",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test is based on the PCL-5 (PTSD Checklist). Answer each question based on how much you have been bothered by each problem in the past month.",
        metaDescription: "Take our free, confidential PTSD screening test (PCL-5 based). Get instant results and learn about symptoms, diagnosis, and treatment options.",
        heroColor: "text-purple-200",
        heroGradient: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800",
        questions: ptsdQuestions,
        recommendation: "Trauma Specialist (EMDR/CBT)",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 40,
        getSeverity: (score) => getStandardSeverity(score, 40),
      }}
    />
  );
};

export default PTSDTest;
