import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { hoardingQuestions, getStandardSeverity } from "@/lib/assessmentData";

const HoardingTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "hoarding",
        title: "Hoarding Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess hoarding behavior patterns. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential hoarding disorder screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-orange-200",
        heroGradient: "bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800",
        questions: hoardingQuestions,
        recommendation: "OCD/Hoarding Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default HoardingTest;
