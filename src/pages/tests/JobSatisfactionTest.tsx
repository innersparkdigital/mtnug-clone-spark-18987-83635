import AssessmentTestTemplate from "@/components/AssessmentTestTemplate";
import { jobSatisfactionQuestions } from "@/lib/assessmentData";

// Inverted scoring for job satisfaction (lower score = less satisfied)
const getJobSatisfactionSeverity = (score: number) => {
  const maxScore = 30;
  const percentage = (score / maxScore) * 100;
  
  // Higher score = more satisfied (inverted interpretation)
  if (percentage >= 80) {
    return {
      level: "Minimal" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "You appear highly satisfied with your job. Continue nurturing what works well and consider ways to help others find similar fulfillment."
    };
  } else if (percentage >= 60) {
    return {
      level: "Mild" as const,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "You have good job satisfaction but there may be areas for improvement. Consider what changes could enhance your work experience."
    };
  } else if (percentage >= 40) {
    return {
      level: "Moderate" as const,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Your job satisfaction is moderate. It may be helpful to identify specific areas of dissatisfaction and explore possible solutions."
    };
  } else if (percentage >= 20) {
    return {
      level: "Moderately Severe" as const,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Your job satisfaction is low. Consider speaking with a career counselor or coach to explore your options and improve your work situation."
    };
  } else {
    return {
      level: "Severe" as const,
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      description: "Your job satisfaction is very low. We strongly recommend seeking support from a career counselor to address this situation."
    };
  }
};

const JobSatisfactionTest = () => {
  return (
    <AssessmentTestTemplate
      config={{
        id: "job-satisfaction",
        title: "Job Satisfaction",
        subtitle: "Take this assessment. It's quick, free, and you'll get your confidential results instantly.",
        description: "This assessment helps evaluate your satisfaction with your current job. Answer each question honestly.",
        metaDescription: "Take our free, confidential job satisfaction assessment. Get instant results and learn about career fulfillment.",
        heroColor: "text-green-200",
        heroGradient: "bg-gradient-to-br from-green-600 via-green-700 to-emerald-800",
        questions: jobSatisfactionQuestions,
        recommendation: "Career Counselor or Life Coach",
        recommendedFormat: "1:1 Coaching Session",
        maxScore: 30,
        getSeverity: getJobSatisfactionSeverity,
      }}
    />
  );
};

export default JobSatisfactionTest;
