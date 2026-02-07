import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { ocdQuestions, getStandardSeverity } from "@/lib/assessmentData";

const OCDTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "ocd",
        title: "Obsessive-Compulsive Disorder (OCD)",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess OCD symptoms including obsessions and compulsions. Answer each question honestly.",
        metaDescription: "Take our free, confidential OCD screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-emerald-200",
        heroGradient: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800",
        questions: ocdQuestions,
        recommendation: "OCD Specialist (ERP Therapist)",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default OCDTest;
