import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { videoGameAddictionQuestions, getStandardSeverity } from "@/lib/assessmentData";

const VideoGameAddictionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "video-game-addiction",
        title: "Video Game Addiction",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess gaming behavior patterns. Answer each question honestly based on your experiences over the past few months.",
        metaDescription: "Take our free, confidential video game addiction screening test. Get instant results and learn about symptoms and support options.",
        heroColor: "text-violet-200",
        heroGradient: "bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800",
        questions: videoGameAddictionQuestions,
        recommendation: "Behavioral Addiction Specialist",
        recommendedFormat: "1:1 Therapy Session",
        maxScore: 30,
        getSeverity: (score) => getStandardSeverity(score, 30),
      }}
    />
  );
};

export default VideoGameAddictionTest;
