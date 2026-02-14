import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { borderlinePersonalityQuestions, getStandardSeverity } from "@/lib/assessmentData";

const BorderlinePersonalityTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "borderline-personality",
        title: "Borderline Personality Disorder",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test helps identify patterns associated with Borderline Personality Disorder. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free Borderline Personality Disorder test. Get instant confidential results and learn about BPD symptoms, diagnosis, and treatment options.",
        heroColor: "text-purple-200",
        heroGradient: "bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900",
        questions: borderlinePersonalityQuestions,
        recommendation: "DBT Therapist or Clinical Psychologist",
        recommendedFormat: "1:1 Specialized Therapy",
        maxScore: 40,
        getSeverity: (score) => getStandardSeverity(score, 40),
      }}
    />
  );
};

export default BorderlinePersonalityTest;
