import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { socialAnxietyQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SocialAnxietyTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "social-anxiety",
        title: "Social Anxiety Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess social anxiety symptoms. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential social anxiety screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-purple-200",
        heroGradient: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800",
        questions: socialAnxietyQuestions,
        recommendation: "Social Anxiety Therapist",
        recommendedFormat: "1:1 Therapy or Group Therapy",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default SocialAnxietyTest;
