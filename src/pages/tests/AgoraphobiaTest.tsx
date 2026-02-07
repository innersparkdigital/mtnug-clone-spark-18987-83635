import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { agoraphobiaQuestions, getStandardSeverity } from "@/lib/assessmentData";

const AgoraphobiaTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "agoraphobia",
        title: "Agoraphobia",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess agoraphobia symptoms. Answer each question honestly based on your experiences.",
        metaDescription: "Take our free, confidential agoraphobia screening test. Get instant results and learn about symptoms and treatment options.",
        heroColor: "text-cyan-200",
        heroGradient: "bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800",
        questions: agoraphobiaQuestions,
        recommendation: "Anxiety Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default AgoraphobiaTest;
