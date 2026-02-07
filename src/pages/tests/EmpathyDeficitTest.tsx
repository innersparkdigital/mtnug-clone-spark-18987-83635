import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { empathyDeficitQuestions, getStandardSeverity } from "@/lib/assessmentData";

const EmpathyDeficitTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "empathy-deficit",
        title: "Empathy Deficit Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess empathy and emotional connection patterns. Answer each question honestly.",
        metaDescription: "Take our free, confidential empathy assessment test. Get instant results and learn about emotional intelligence development.",
        heroColor: "text-rose-200",
        heroGradient: "bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800",
        questions: empathyDeficitQuestions,
        recommendation: "Psychotherapist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default EmpathyDeficitTest;
