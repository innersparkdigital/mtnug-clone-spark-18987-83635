import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { panicDisorderQuestions, getStandardSeverity } from "@/lib/assessmentData";

const PanicDisorderTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "panic-disorder",
        title: "Panic Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess panic attack symptoms and related anxiety. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential panic disorder screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-pink-200",
        heroGradient: "bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800",
        questions: panicDisorderQuestions,
        recommendation: "Anxiety Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default PanicDisorderTest;
