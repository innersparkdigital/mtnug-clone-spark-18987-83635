import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { genderDysphoriaQuestions, getStandardSeverity } from "@/lib/assessmentData";

const GenderDysphoriaTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "gender-dysphoria",
        title: "Gender Dysphoria",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess gender identity experiences. Answer each question honestly and at your own pace.",
        metaDescription: "Take our free, confidential gender dysphoria screening test. Get instant results and learn about support options.",
        heroColor: "text-violet-200",
        heroGradient: "bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800",
        questions: genderDysphoriaQuestions,
        recommendation: "Gender-Affirming Therapist",
        recommendedFormat: "1:1 Specialized Therapy",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default GenderDysphoriaTest;
