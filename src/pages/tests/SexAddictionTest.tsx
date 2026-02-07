import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { sexAddictionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SexAddictionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "sex-addiction",
        title: "Sex Addiction",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess compulsive sexual behavior patterns. Answer each question honestly based on your experiences over the past few months.",
        metaDescription: "Take our free, confidential sex addiction screening test. Get instant results and learn about symptoms, support, and treatment options.",
        heroColor: "text-fuchsia-200",
        heroGradient: "bg-gradient-to-br from-fuchsia-600 via-fuchsia-700 to-purple-800",
        questions: sexAddictionQuestions,
        recommendation: "Sexual Health Therapist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default SexAddictionTest;
