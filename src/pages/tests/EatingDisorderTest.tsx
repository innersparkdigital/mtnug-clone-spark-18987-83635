import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { eatingDisorderQuestions, getStandardSeverity } from "@/lib/assessmentData";

const EatingDisorderTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "eating-disorder",
        title: "Eating Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test helps identify patterns associated with eating disorders. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free eating disorder screening test. Get instant confidential results and learn about eating disorder symptoms, types, and treatment options.",
        heroColor: "text-rose-200",
        heroGradient: "bg-gradient-to-br from-rose-900 via-pink-800 to-red-900",
        questions: eatingDisorderQuestions,
        recommendation: "Eating Disorder Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 75,
        getSeverity: (score) => getStandardSeverity(score, 75),
      }}
    />
  );
};

export default EatingDisorderTest;
