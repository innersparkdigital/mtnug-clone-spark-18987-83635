import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { adultADHDQuestions, getStandardSeverity } from "@/lib/assessmentData";

const AdultADHDTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "adult-adhd",
        title: "Adult ADHD",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening test is based on the Adult ADHD Self-Report Scale (ASRS-v1.1). Answer each question honestly based on how you have felt and conducted yourself over the past 6 months.",
        metaDescription: "Take our free, confidential Adult ADHD screening test (ASRS-based). Get instant results and learn about symptoms, diagnosis, and treatment options for ADHD.",
        heroColor: "text-red-200",
        heroGradient: "bg-gradient-to-br from-red-600 via-red-700 to-orange-800",
        questions: adultADHDQuestions,
        recommendation: "ADHD Specialist or Psychiatrist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 48,
        getSeverity: (score) => getStandardSeverity(score, 48),
      }}
    />
  );
};

export default AdultADHDTest;
