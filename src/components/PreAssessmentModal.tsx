import { useState } from "react";
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
import { Brain, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useAssessment } from "@/contexts/AssessmentContext";

interface PreAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: "book" | "group";
}

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
    id: "stress",
    name: "Stress & Burnout",
    description: "Feeling overwhelmed, exhausted, pressured, or mentally drained.",
    path: "/mind-check/job-burnout",
    recommendation: "Licensed Counselor or Life Coach",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "self-esteem",
    name: "Self-Esteem Issues",
    description: "Feeling not good enough, low confidence, or constant self-doubt.",
    path: "/mind-check/depression",
    recommendation: "Counselor or Personal Growth Coach",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "relationship",
    name: "Relationship Challenges",
    description: "Ongoing conflicts, communication issues, trust problems, or emotional distance.",
    path: "/mind-check/relationship-health",
    recommendation: "Couples Therapist or Relationship Counselor",
    format: "1:1 or Couples Therapy"
  },
  {
    id: "addiction",
    name: "Addiction & Substance Use",
    description: "Difficulty controlling alcohol, drugs, betting, or other habits.",
    path: "/mind-check/gambling-addiction",
    recommendation: "Addiction Specialist or Counselor",
    format: "1:1 Therapy + Support Group"
  },
  {
    id: "grief",
    name: "Grief & Loss",
    description: "Struggling emotionally after losing a loved one or something important.",
    path: "/mind-check/grief",
    recommendation: "Grief Counselor or Therapist",
    format: "1:1 Therapy or Support Group"
  },
  {
    id: "crisis",
    name: "Crisis / Emotional Distress",
    description: "Feeling overwhelmed, breaking down emotionally, or unable to cope.",
    path: "/emergency-support",
    recommendation: "Crisis Counselor or Emergency Support",
    format: "Immediate Support"
  },
];

const PreAssessmentModal = ({ isOpen, onClose, actionType }: PreAssessmentModalProps) => {
  const [wantsAssessment, setWantsAssessment] = useState<boolean | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setPendingAction, setReturnPath } = useAssessment();

  const handleProceedWithAssessment = () => {
    const condition = assessmentOptions.find(c => c.id === selectedCondition);
    if (condition) {
      setPendingAction(actionType);
      setReturnPath(location.pathname);
      onClose();
      navigate(condition.path);
    }
  };

  const handleProceedWithoutAssessment = () => {
    onClose();
    const whatsappNumber = "256792085773";
    const message = actionType === "book" 
      ? "Hi, I would like to book a therapy session"
      : "Hi, I would like to join a mental health support group";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleReset = () => {
    setWantsAssessment(null);
    setSelectedCondition("");
  };

  const selectedOption = assessmentOptions.find(c => c.id === selectedCondition);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); handleReset(); } }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-primary" />
            {actionType === "book" ? "Book a Therapy Session" : "Join a Support Group"}
          </DialogTitle>
          <DialogDescription>
            Understanding your mental health helps us match you with the right support.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {wantsAssessment === null && (
            <>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground font-medium mb-2">
                  Would you like to assess your mental health first?
                </p>
                <p className="text-sm text-muted-foreground">
                  This quick assessment helps us recommend the right type of support for you.
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
                  Select what you would like to assess
                </label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a condition..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {assessmentOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{option.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
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
