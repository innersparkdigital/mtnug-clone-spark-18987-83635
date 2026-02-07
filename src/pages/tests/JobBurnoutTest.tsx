import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { jobBurnoutQuestions, getStandardSeverity } from "@/lib/assessmentData";

const JobBurnoutTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "job-burnout",
        title: "Job Burnout",
        subtitle: "Take this mental health test. It's quick, free, and you'll get your confidential results instantly.",
        description: "This screening helps assess work-related burnout symptoms. Answer each question honestly based on your experiences over the past few weeks.",
        metaDescription: "Take our free, confidential job burnout screening test. Get instant results and learn about stress management and recovery options.",
        heroColor: "text-amber-200",
        heroGradient: "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800",
        questions: jobBurnoutQuestions,
        recommendation: "Licensed Counselor or Life Coach",
        recommendedFormat: "1:1 Therapy or Support Group",
        maxScore: 36,
        getSeverity: (score) => getStandardSeverity(score, 36),
      }}
    />
  );
};

export default JobBurnoutTest;
