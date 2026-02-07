import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { workLifeBalanceQuestions, getStandardSeverity } from "@/lib/assessmentData";

const WorkLifeBalanceTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "work-life-balance",
        title: "Work-Life Balance",
        subtitle: "Take this assessment. It's quick, free, and you'll get your confidential results instantly.",
        description: "This assessment helps evaluate your work-life balance. Answer each question honestly.",
        metaDescription: "Take our free, confidential work-life balance assessment. Get instant results and learn about achieving better balance.",
        heroColor: "text-teal-200",
        heroGradient: "bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800",
        questions: workLifeBalanceQuestions,
        recommendation: "Life Coach or Counselor",
        recommendedFormat: "1:1 Therapy or Coaching",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default WorkLifeBalanceTest;
