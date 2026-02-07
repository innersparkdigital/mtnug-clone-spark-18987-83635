import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { griefQuestions, getStandardSeverity } from "@/lib/assessmentData";

const GriefTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "grief",
        title: "Complicated Grief",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess grief and bereavement symptoms. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential grief assessment test. Get instant results and learn about coping strategies and support options.",
        heroColor: "text-slate-200",
        heroGradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-gray-800",
        questions: griefQuestions,
        recommendation: "Grief Counselor or Therapist",
        recommendedFormat: "1:1 Therapy or Support Group",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default GriefTest;
