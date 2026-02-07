import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { sociopathyQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SociopathyTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "sociopath",
        title: "Sociopathy",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess antisocial behavior patterns. Answer each question honestly.",
        metaDescription: "Take our free, confidential antisocial behavior screening test. Get instant results and learn about support options.",
        heroColor: "text-gray-200",
        heroGradient: "bg-gradient-to-br from-gray-600 via-gray-700 to-slate-800",
        questions: sociopathyQuestions,
        recommendation: "Forensic Psychologist",
        recommendedFormat: "1:1 Specialized Therapy",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default SociopathyTest;
