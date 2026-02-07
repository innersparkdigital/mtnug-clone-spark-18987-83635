import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { sleepDisorderQuestions, getStandardSeverity } from "@/lib/assessmentData";

const SleepDisorderTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "sleep-disorder",
        title: "Sleep Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess sleep quality and potential sleep disorders. Answer each question honestly.",
        metaDescription: "Take our free, confidential sleep disorder screening test. Get instant results and learn about improving your sleep.",
        heroColor: "text-blue-200",
        heroGradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
        questions: sleepDisorderQuestions,
        recommendation: "Sleep Specialist or CBT-I Therapist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default SleepDisorderTest;
