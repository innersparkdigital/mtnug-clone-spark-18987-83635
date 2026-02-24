import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface AssessmentResult {
  assessmentType: string;
  assessmentLabel: string;
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
  score: number;
  maxScore: number;
  recommendation: string;
  recommendedFormat: string;
  timestamp: string;
}

export interface SelectedSpecialist {
  id: string;
  name: string;
  type: string;
  specialties: string[];
  experience_years: number;
  price_per_hour: number;
  image_url: string | null;
  bio: string | null;
}

// Action types supported by the booking flow
export type BookingActionType = "book" | "group" | "consultation";

interface AssessmentContextType {
  pendingAction: BookingActionType | null;
  setPendingAction: (action: BookingActionType | null) => void;
  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult | null) => void;
  clearAssessment: () => void;
  returnPath: string | null;
  setReturnPath: (path: string | null) => void;
  justCompletedAssessment: boolean;
  setJustCompletedAssessment: (value: boolean) => void;
  selectedSpecialist: SelectedSpecialist | null;
  setSelectedSpecialist: (specialist: SelectedSpecialist | null) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingAction, setPendingAction] = useState<BookingActionType | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const [justCompletedAssessment, setJustCompletedAssessment] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SelectedSpecialist | null>(null);
  const initialized = useRef(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const stored = sessionStorage.getItem("innerspark_assessment");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.assessmentResult) setAssessmentResult(parsed.assessmentResult);
        if (parsed.pendingAction) setPendingAction(parsed.pendingAction);
        if (parsed.returnPath) setReturnPath(parsed.returnPath);
        if (parsed.selectedSpecialist) setSelectedSpecialist(parsed.selectedSpecialist);
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
  }, []);

  // Persist to sessionStorage when state changes
  useEffect(() => {
    if (!initialized.current) return;
    
    sessionStorage.setItem("innerspark_assessment", JSON.stringify({
      assessmentResult,
      pendingAction,
      returnPath,
      selectedSpecialist
    }));
  }, [assessmentResult, pendingAction, returnPath, selectedSpecialist]);

  const clearAssessment = () => {
    setAssessmentResult(null);
    setPendingAction(null);
    setReturnPath(null);
    setJustCompletedAssessment(false);
    setSelectedSpecialist(null);
    sessionStorage.removeItem("innerspark_assessment");
  };

  return (
    <AssessmentContext.Provider
      value={{
        pendingAction,
        setPendingAction,
        assessmentResult,
        setAssessmentResult,
        clearAssessment,
        returnPath,
        setReturnPath,
        justCompletedAssessment,
        setJustCompletedAssessment,
        selectedSpecialist,
        setSelectedSpecialist,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};