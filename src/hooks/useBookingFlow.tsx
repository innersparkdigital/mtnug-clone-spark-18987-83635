import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAssessment } from "@/contexts/AssessmentContext";

type FlowStep = "idle" | "assessment-choice" | "booking-form" | "group-form";
type ActionType = "book" | "group";

export const useBookingFlow = () => {
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");
  const [actionType, setActionType] = useState<ActionType>("book");
  const { assessmentResult, pendingAction, clearAssessment } = useAssessment();
  const location = useLocation();

  // Check if user is returning from an assessment
  useEffect(() => {
    if (assessmentResult && pendingAction) {
      // User completed assessment and returned
      if (pendingAction === "book") {
        setFlowStep("booking-form");
        setActionType("book");
      } else if (pendingAction === "group") {
        setFlowStep("group-form");
        setActionType("group");
      }
    }
  }, [assessmentResult, pendingAction, location.pathname]);

  const startBooking = useCallback(() => {
    if (assessmentResult) {
      // Already has assessment, go directly to form
      setFlowStep("booking-form");
    } else {
      // Show assessment choice first
      setFlowStep("assessment-choice");
    }
    setActionType("book");
  }, [assessmentResult]);

  const startGroup = useCallback(() => {
    if (assessmentResult) {
      // Already has assessment, go directly to form
      setFlowStep("group-form");
    } else {
      // Show assessment choice first
      setFlowStep("assessment-choice");
    }
    setActionType("group");
  }, [assessmentResult]);

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
