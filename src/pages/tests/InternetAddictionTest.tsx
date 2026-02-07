import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { internetAddictionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const InternetAddictionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "internet-addiction",
        title: "Internet Addiction",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess compulsive internet use patterns. Answer each question honestly based on your experiences over the past few months.",
        metaDescription: "Take our free, confidential internet addiction screening test. Get instant results and learn about digital wellness and support options.",
        heroColor: "text-sky-200",
        heroGradient: "bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800",
        questions: internetAddictionQuestions,
        recommendation: "Digital Wellness Therapist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default InternetAddictionTest;
