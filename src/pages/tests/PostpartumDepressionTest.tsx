import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { postpartumDepressionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const PostpartumDepressionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "postpartum-depression",
        title: "Postpartum Depression",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening tool is based on the Edinburgh Postnatal Depression Scale (EPDS). Answer based on how you have felt in the past 7 days.",
        metaDescription: "Take our free, confidential postpartum depression screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-pink-200",
        heroGradient: "bg-gradient-to-br from-pink-500 via-pink-600 to-rose-700",
        questions: postpartumDepressionQuestions,
        recommendation: "Perinatal Mental Health Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default PostpartumDepressionTest;
