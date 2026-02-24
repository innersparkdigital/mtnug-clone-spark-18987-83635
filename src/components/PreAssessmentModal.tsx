import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, ArrowRight, CheckCircle, AlertCircle, User } from "lucide-react";
import { useAssessment, SelectedSpecialist, BookingActionType } from "@/contexts/AssessmentContext";
import { trackAssessmentStarted, trackAssessmentSkipped, trackBookingClick, trackGroupClick } from "@/lib/analytics";
import { getRelevantAssessments } from "@/lib/specialistAssessmentMapping";

interface PreAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: BookingActionType;
  specialist?: SelectedSpecialist | null;
}

// Complete list of all 37 assessments
const assessmentOptions = [
  {
    id: "depression",
    name: "Depression",
    description: "Feeling sad most of the time, losing interest in things, feeling tired or hopeless.",
    path: "/mind-check/depression",
    recommendation: "Clinical Psychologist or Psychiatric Clinician",
    format: "1:1 Therapy Session"
  },
  {
    id: "anxiety",
    name: "Anxiety",
    description: "Excessive worry, fear, panic, racing thoughts, or feeling constantly on edge.",
    path: "/mind-check/anxiety",
    recommendation: "Licensed Therapist or Counselor",
    format: "1:1 Therapy Session"
  },
  {
    id: "ptsd",
    name: "Trauma & PTSD",
    description: "Emotional pain from past shocking or painful experiences that still affect you.",
    path: "/mind-check/ptsd",
    recommendation: "Trauma-Specialized Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "adult-adhd",
    name: "Adult ADHD",
    description: "Difficulty focusing, impulsive behavior, restlessness, or trouble staying organized.",
    path: "/mind-check/adult-adhd",
    recommendation: "ADHD Specialist or Psychiatrist",
    format: "1:1 Therapy Session"
  },
  {
    id: "bpd",
    name: "Borderline Personality Disorder",
    description: "Intense emotions, unstable relationships, fear of abandonment, or identity confusion.",
    path: "/mind-check/bpd",
    recommendation: "DBT-Trained Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "eating-disorder",
    name: "Eating Disorder",
    description: "Unhealthy eating patterns, body image concerns, or extreme dieting behaviors.",
    path: "/mind-check/eating-disorder",
    recommendation: "Eating Disorder Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "gambling-addiction",
    name: "Gambling Addiction",
    description: "Difficulty controlling gambling habits, betting more than you can afford.",
    path: "/mind-check/gambling-addiction",
    recommendation: "Addiction Specialist",
    format: "1:1 Therapy + Support Group"
  },
  {
    id: "mania",
    name: "Mania",
    description: "Elevated mood, excessive energy, reduced need for sleep, or impulsive decisions.",
    path: "/mind-check/mania",
    recommendation: "Psychiatrist or Mood Disorder Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "npd",
    name: "Narcissistic Personality Disorder",
    description: "Need for admiration, lack of empathy, or sense of superiority.",
    path: "/mind-check/npd",
    recommendation: "Personality Disorder Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "postpartum",
    name: "Postpartum Depression",
    description: "Mood changes, sadness, or difficulty bonding after having a baby.",
    path: "/mind-check/postpartum",
    recommendation: "Perinatal Mental Health Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "sex-addiction",
    name: "Sex Addiction",
    description: "Difficulty controlling sexual thoughts or behaviors that affect your life.",
    path: "/mind-check/sex-addiction",
    recommendation: "Sexual Health Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "video-game-addiction",
    name: "Video Game Addiction",
    description: "Excessive gaming that interferes with daily life, work, or relationships.",
    path: "/mind-check/video-game-addiction",
    recommendation: "Behavioral Addiction Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "internet-addiction",
    name: "Internet Addiction",
    description: "Compulsive internet use affecting your daily functioning or relationships.",
    path: "/mind-check/internet-addiction",
    recommendation: "Digital Wellness Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "job-burnout",
    name: "Job Burnout",
    description: "Feeling overwhelmed, exhausted, or disconnected from your work.",
    path: "/mind-check/job-burnout",
    recommendation: "Licensed Counselor or Life Coach",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "toxic-workplace",
    name: "Toxic Workplace",
    description: "Work environment causing stress, anxiety, or emotional distress.",
    path: "/mind-check/toxic-workplace",
    recommendation: "Workplace Wellness Counselor",
    format: "1:1 Therapy Session"
  },
  {
    id: "panic-disorder",
    name: "Panic Disorder",
    description: "Sudden intense fear, panic attacks, or physical symptoms like racing heart.",
    path: "/mind-check/panic-disorder",
    recommendation: "Anxiety Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "ocd",
    name: "Obsessive-Compulsive Disorder (OCD)",
    description: "Unwanted repetitive thoughts or behaviors you feel compelled to do.",
    path: "/mind-check/ocd",
    recommendation: "OCD Specialist (ERP Therapist)",
    format: "1:1 Therapy Session"
  },
  {
    id: "bipolar",
    name: "Bipolar Disorder",
    description: "Extreme mood swings between emotional highs and lows.",
    path: "/mind-check/bipolar",
    recommendation: "Mood Disorder Specialist or Psychiatrist",
    format: "1:1 Therapy Session"
  },
  {
    id: "social-anxiety",
    name: "Social Anxiety Disorder",
    description: "Intense fear of social situations, judgment, or embarrassment.",
    path: "/mind-check/social-anxiety",
    recommendation: "Social Anxiety Therapist",
    format: "1:1 Therapy or Group Therapy"
  },
  {
    id: "hoarding",
    name: "Hoarding Disorder",
    description: "Difficulty discarding possessions, leading to cluttered living spaces.",
    path: "/mind-check/hoarding",
    recommendation: "OCD/Hoarding Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "psychosis",
    name: "Psychosis",
    description: "Experiences of seeing or hearing things others don't, or unusual beliefs.",
    path: "/mind-check/psychosis",
    recommendation: "Psychiatrist",
    format: "Immediate Medical Consultation"
  },
  {
    id: "grief",
    name: "Complicated Grief",
    description: "Struggling emotionally after losing a loved one or something important.",
    path: "/mind-check/grief",
    recommendation: "Grief Counselor or Therapist",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "did",
    name: "Dissociative Identity Disorder",
    description: "Experiencing different identities or significant memory gaps.",
    path: "/mind-check/did",
    recommendation: "Trauma Specialist",
    format: "1:1 Specialized Therapy"
  },
  {
    id: "schizophrenia",
    name: "Schizophrenia",
    description: "Disrupted thoughts, perceptions, or difficulty distinguishing reality.",
    path: "/mind-check/schizophrenia",
    recommendation: "Psychiatrist",
    format: "Psychiatric Care + Therapy"
  },
  {
    id: "stress",
    name: "Stress",
    description: "Feeling overwhelmed, tense, or unable to relax and cope with daily demands.",
    path: "/mind-check/stress",
    recommendation: "Stress Management Counselor",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "agoraphobia",
    name: "Agoraphobia",
    description: "Fear of places or situations that might cause panic or helplessness.",
    path: "/mind-check/agoraphobia",
    recommendation: "Anxiety Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "separation-anxiety",
    name: "Separation Anxiety",
    description: "Excessive fear or anxiety about being separated from attachment figures.",
    path: "/mind-check/separation-anxiety",
    recommendation: "Anxiety Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "sleep-disorder",
    name: "Sleep Disorder",
    description: "Trouble falling asleep, staying asleep, or feeling rested after sleep.",
    path: "/mind-check/sleep-disorder",
    recommendation: "Sleep Specialist or CBT-I Therapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "empathy-deficit",
    name: "Empathy Deficit Disorder",
    description: "Difficulty understanding or connecting with others' emotions.",
    path: "/mind-check/empathy-deficit",
    recommendation: "Psychotherapist",
    format: "1:1 Therapy Session"
  },
  {
    id: "binge-eating",
    name: "Binge Eating Disorder",
    description: "Episodes of eating large amounts of food with loss of control.",
    path: "/mind-check/binge-eating",
    recommendation: "Eating Disorder Specialist",
    format: "1:1 Therapy Session"
  },
  {
    id: "gender-dysphoria",
    name: "Gender Dysphoria",
    description: "Distress from disconnect between gender identity and assigned sex.",
    path: "/mind-check/gender-dysphoria",
    recommendation: "Gender-Affirming Therapist",
    format: "1:1 Specialized Therapy"
  },
  {
    id: "relationship-health",
    name: "Relationship Health",
    description: "Ongoing conflicts, communication issues, trust problems, or emotional distance.",
    path: "/mind-check/relationship-health",
    recommendation: "Couples Therapist or Relationship Counselor",
    format: "1:1 or Couples Therapy"
  },
  {
    id: "sociopath",
    name: "Sociopathy",
    description: "Difficulty following social norms, empathy challenges, or impulsive behavior.",
    path: "/mind-check/sociopath",
    recommendation: "Forensic Psychologist",
    format: "1:1 Specialized Therapy"
  },
  {
    id: "job-satisfaction",
    name: "Job Satisfaction",
    description: "Evaluating your fulfillment and happiness in your current job.",
    path: "/mind-check/job-satisfaction",
    recommendation: "Career Counselor or Life Coach",
    format: "1:1 Coaching Session"
  },
  {
    id: "work-life-balance",
    name: "Work-Life Balance",
    description: "Struggling to balance professional and personal life responsibilities.",
    path: "/mind-check/work-life-balance",
    recommendation: "Life Coach or Counselor",
    format: "1:1 Therapy or Coaching"
  },
  {
    id: "imposter-syndrome",
    name: "Imposter Syndrome",
    description: "Feeling like a fraud despite your accomplishments and qualifications.",
    path: "/mind-check/imposter-syndrome",
    recommendation: "CBT Therapist or Life Coach",
    format: "1:1 Therapy Session"
  },
  {
    id: "sad",
    name: "Seasonal Affective Disorder (SAD)",
    description: "Depression that follows a seasonal pattern, usually in winter months.",
    path: "/mind-check/sad",
    recommendation: "Mood Disorder Specialist",
    format: "1:1 Therapy Session"
  },
  // Crisis option
  {
    id: "crisis",
    name: "Crisis / Emotional Distress",
    description: "Feeling overwhelmed, breaking down emotionally, or unable to cope.",
    path: "/emergency-support",
    recommendation: "Crisis Counselor or Emergency Support",
    format: "Immediate Support"
  },
];

const PreAssessmentModal = ({ isOpen, onClose, actionType, specialist }: PreAssessmentModalProps) => {
  const [wantsAssessment, setWantsAssessment] = useState<boolean | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setPendingAction, setReturnPath, setSelectedSpecialist } = useAssessment();

  // Get recommended assessments based on selected specialist
  const recommendedAssessmentIds = useMemo(() => {
    if (!specialist) return [];
    return getRelevantAssessments(specialist.type, specialist.specialties);
  }, [specialist]);

  // Sort assessments: recommended first, then the rest
  const sortedAssessments = useMemo(() => {
    if (recommendedAssessmentIds.length === 0) return assessmentOptions;

    const recommended = assessmentOptions.filter(a => recommendedAssessmentIds.includes(a.id));
    const others = assessmentOptions.filter(a => !recommendedAssessmentIds.includes(a.id) && a.id !== "crisis");
    const crisis = assessmentOptions.find(a => a.id === "crisis");

    return [...recommended, ...others, ...(crisis ? [crisis] : [])];
  }, [recommendedAssessmentIds]);

  // Auto-select the first recommended assessment when specialist is provided
  useEffect(() => {
    if (specialist && wantsAssessment === true && recommendedAssessmentIds.length > 0 && !selectedCondition) {
      setSelectedCondition(recommendedAssessmentIds[0]);
    }
  }, [specialist, wantsAssessment, recommendedAssessmentIds, selectedCondition]);

  const handleProceedWithAssessment = () => {
    const condition = assessmentOptions.find(c => c.id === selectedCondition);
    if (condition) {
      setPendingAction(actionType);
      setReturnPath(location.pathname);
      
      // Store the selected specialist so it persists through navigation
      if (specialist) {
        setSelectedSpecialist(specialist);
      }
      
      // Track analytics
      trackAssessmentStarted(condition.id);
      if (actionType === "book" || actionType === "consultation") {
        trackBookingClick("pre_assessment_modal");
      } else {
        trackGroupClick("pre_assessment_modal");
      }
      
      onClose();
      navigate(condition.path);
    }
  };

  const handleProceedWithoutAssessment = () => {
    // Track skipped assessment
    trackAssessmentSkipped(actionType);
    if (actionType === "book" || actionType === "consultation") {
      trackBookingClick("pre_assessment_modal_skip");
    } else {
      trackGroupClick("pre_assessment_modal_skip");
    }
    
    onClose();
    const whatsappNumber = "256792085773";
    let message = actionType === "consultation"
      ? "Hi, I would like a free consultation with Innerspark Africa"
      : actionType === "book" 
      ? "Hi, I would like to book a therapy session"
      : "Hi, I would like to join a mental health support group";
    
    if (specialist) {
      message += ` with ${specialist.name}`;
    }
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleReset = () => {
    setWantsAssessment(null);
    setSelectedCondition("");
  };

  const selectedOption = assessmentOptions.find(c => c.id === selectedCondition);
  const isRecommended = (id: string) => recommendedAssessmentIds.includes(id);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); handleReset(); } }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-primary" />
            {actionType === "consultation" ? "Free Consultation" : actionType === "book" ? "Book a Therapy Session" : "Join a Support Group"}
          </DialogTitle>
          <DialogDescription>
            {specialist 
              ? `To ensure the best care with ${specialist.name}, please complete a short assessment aligned with their expertise.`
              : "Understanding your mental health helps us match you with the right support."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Show selected specialist context */}
        {specialist && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {specialist.image_url ? (
                <img src={specialist.image_url} alt={specialist.name} className="w-full h-full object-cover object-top" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{specialist.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{specialist.type}</p>
            </div>
          </div>
        )}

        <div className="space-y-6 py-4">
          {wantsAssessment === null && (
            <>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground font-medium mb-2">
                  {specialist 
                    ? "Would you like to complete a quick assessment first?"
                    : "Would you like to assess your mental health first?"
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {specialist
                    ? "This helps your therapist understand your needs before the session."
                    : "This quick assessment helps us recommend the right type of support for you."
                  }
                </p>
              </div>

              <div className="grid gap-3">
                <Button
                  variant="default"
                  className="w-full justify-start gap-3 h-auto py-4"
                  onClick={() => setWantsAssessment(true)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Yes, I want to assess myself first</p>
                    <p className="text-sm opacity-80">Takes 3-5 minutes</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4"
                  onClick={handleProceedWithoutAssessment}
                >
                  <ArrowRight className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">No, proceed directly</p>
                    <p className="text-sm text-muted-foreground">Skip to booking</p>
                  </div>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                This assessment is not a medical diagnosis but helps guide support options.
              </p>
            </>
          )}

          {wantsAssessment === true && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  {specialist && recommendedAssessmentIds.length > 0
                    ? `Recommended assessments for ${specialist.name}'s expertise`
                    : "Select what you would like to assess"
                  }
                </label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a condition..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {specialist && recommendedAssessmentIds.length > 0 && (
                      <div className="px-2 py-1.5 text-xs font-semibold text-primary border-b">
                        Recommended for {specialist.name}
                      </div>
                    )}
                    {sortedAssessments.map((option, index) => {
                      const recommended = isRecommended(option.id);
                      const isFirstNonRecommended = specialist && recommendedAssessmentIds.length > 0 && 
                        !recommended && index > 0 && isRecommended(sortedAssessments[index - 1]?.id);
                      
                      return (
                        <div key={option.id}>
                          {isFirstNonRecommended && (
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-b">
                              All Assessments
                            </div>
                          )}
                          <SelectItem value={option.id} className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium flex items-center gap-1">
                                {option.name}
                                {recommended && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">
                                    Recommended
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {option.description}
                              </span>
                            </div>
                          </SelectItem>
                        </div>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedOption && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-foreground">{selectedOption.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOption.description}</p>
                  {selectedOption.id === "crisis" && (
                    <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>This will connect you to immediate support</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleProceedWithAssessment}
                  disabled={!selectedCondition}
                  className="flex-1 gap-2"
                >
                  Start Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                This assessment is not a medical diagnosis but helps guide support options.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreAssessmentModal;
