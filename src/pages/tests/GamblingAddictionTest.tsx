import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { gamblingAddictionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const GamblingAddictionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "gambling-addiction",
        title: "Gambling Addiction",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test helps identify patterns associated with problem gambling. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free gambling addiction screening test. Get instant confidential results and learn about problem gambling signs, symptoms, and treatment options.",
        heroColor: "text-amber-200",
        heroGradient: "bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900",
        questions: gamblingAddictionQuestions,
        recommendation: "Addiction Counselor",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default GamblingAddictionTest;
