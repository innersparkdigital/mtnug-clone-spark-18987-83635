import React, { createContext, useContext, useState, useEffect } from "react";

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

interface AssessmentContextType {
  pendingAction: "book" | "group" | null;
  setPendingAction: (action: "book" | "group" | null) => void;
  assessmentResult: AssessmentResult | null;
  setAssessmentResult: (result: AssessmentResult | null) => void;
  clearAssessment: () => void;
  returnPath: string | null;
  setReturnPath: (path: string | null) => void;
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
  const [pendingAction, setPendingAction] = useState<"book" | "group" | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [returnPath, setReturnPath] = useState<string | null>(null);

  // Persist to sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("innerspark_assessment");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.assessmentResult) setAssessmentResult(parsed.assessmentResult);
        if (parsed.pendingAction) setPendingAction(parsed.pendingAction);
        if (parsed.returnPath) setReturnPath(parsed.returnPath);
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("innerspark_assessment", JSON.stringify({
      assessmentResult,
      pendingAction,
      returnPath
    }));
  }, [assessmentResult, pendingAction, returnPath]);

  const clearAssessment = () => {
    setAssessmentResult(null);
    setPendingAction(null);
    setReturnPath(null);
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
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
