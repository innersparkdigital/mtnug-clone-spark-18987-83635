import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { anxietyQuestions, getStandardSeverity } from "@/lib/assessmentData";

const AnxietyTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "anxiety",
        title: "Anxiety",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test is based on the GAD-7, a widely-used tool for screening generalized anxiety disorder. Answer each question honestly based on how you've been feeling over the past two weeks.",
        metaDescription: "Take our free, confidential anxiety screening test (GAD-7 based). Get instant results and learn about symptoms, diagnosis, and treatment options for anxiety disorders.",
        heroColor: "text-pink-200",
        heroGradient: "bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800",
        questions: anxietyQuestions,
        recommendation: "Licensed Therapist or Counselor",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default AnxietyTest;
