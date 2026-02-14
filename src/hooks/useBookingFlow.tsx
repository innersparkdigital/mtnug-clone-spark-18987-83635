import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAssessment } from "@/contexts/AssessmentContext";

type FlowStep = "idle" | "assessment-choice" | "booking-form" | "group-form";
type ActionType = "book" | "group";

export const useBookingFlow = () => {
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");
  const [actionType, setActionType] = useState<ActionType>("book");
  const [searchParams] = useSearchParams();
  const { 
    assessmentResult, 
    pendingAction, 
    clearAssessment,
    justCompletedAssessment,
    setJustCompletedAssessment
  } = useAssessment();
  const hasCheckedReturn = useRef(false);
  const hasCheckedPayment = useRef(false);

  // (Stripe payment return handling removed - manual payment flow now)

  // Check if user JUST completed assessment and should see form
  // This only triggers once when justCompletedAssessment becomes true
  useEffect(() => {
    if (justCompletedAssessment && assessmentResult && pendingAction && !hasCheckedReturn.current) {
      hasCheckedReturn.current = true;
      
      // User just completed an assessment, show the appropriate form
      if (pendingAction === "book") {
        setFlowStep("booking-form");
        setActionType("book");
      } else if (pendingAction === "group") {
        setFlowStep("group-form");
        setActionType("group");
      }
      
      // Reset the flag after showing the form
      setJustCompletedAssessment(false);
    }
  }, [justCompletedAssessment, assessmentResult, pendingAction, setJustCompletedAssessment]);

  // Reset the check flag when flow is closed
  useEffect(() => {
    if (flowStep === "idle") {
      hasCheckedReturn.current = false;
    }
  }, [flowStep]);

  const startBooking = useCallback(() => {
    // Always show assessment choice first (no auto-skip based on stale data)
    setFlowStep("assessment-choice");
    setActionType("book");
  }, []);

  const startGroup = useCallback(() => {
    // Always show assessment choice first (no auto-skip based on stale data)
    setFlowStep("assessment-choice");
    setActionType("group");
  }, []);

  const closeFlow = useCallback(() => {
    setFlowStep("idle");
  }, []);

  const goToForm = useCallback(() => {
    if (actionType === "book") {
      setFlowStep("booking-form");
    } else {
      setFlowStep("group-form");
    }
  }, [actionType]);

  const resetFlow = useCallback(() => {
    setFlowStep("idle");
    clearAssessment();
  }, [clearAssessment]);

  return {
    flowStep,
    actionType,
    startBooking,
    startGroup,
    closeFlow,
    goToForm,
    resetFlow,
    isAssessmentModalOpen: flowStep === "assessment-choice",
    isBookingFormOpen: flowStep === "booking-form",
    isGroupFormOpen: flowStep === "group-form",
    hasAssessment: !!assessmentResult,
  };
};
