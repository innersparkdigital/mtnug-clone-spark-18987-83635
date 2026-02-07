import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { bingeEatingQuestions, getStandardSeverity } from "@/lib/assessmentData";

const BingeEatingTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "binge-eating",
        title: "Binge Eating Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess binge eating patterns. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential binge eating disorder screening test. Get instant results and learn about treatment options.",
        heroColor: "text-amber-200",
        heroGradient: "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800",
        questions: bingeEatingQuestions,
        recommendation: "Eating Disorder Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default BingeEatingTest;
