import { useState } from "react";
import { useAssessment, AssessmentResult } from "@/contexts/AssessmentContext";

interface TestConfig {
  assessmentType: string;
  assessmentLabel: string;
  maxScore: number;
  recommendation: string;
  recommendedFormat: string;
  getSeverity: (score: number) => {
    level: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  };
}

export const useAssessmentTest = (config: TestConfig) => {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTherapistPopup, setShowTherapistPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const { 
    setAssessmentResult, 
    pendingAction, 
    setPendingAction,
    setJustCompletedAssessment 
  } = useAssessment();

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const handleShowResults = () => {
    setShowResults(true);
    
    const score = calculateScore();
    const severity = config.getSeverity(score);
    
    const assessmentData: AssessmentResult = {
      assessmentType: config.assessmentType,
      assessmentLabel: config.assessmentLabel,
      severity: severity.level,
      score: score,
      maxScore: config.maxScore,
      recommendation: config.recommendation,
      recommendedFormat: config.recommendedFormat,
      timestamp: new Date().toISOString(),
    };
    
    setAssessmentResult(assessmentData);
    
    // If user came from booking flow (book OR group), show form after delay
    if (pendingAction) {
      // Mark that assessment was just completed - this triggers the form
      setJustCompletedAssessment(true);
      setTimeout(() => {
        setShowBookingForm(true);
      }, 1500);
    } else {
      setShowTherapistPopup(true);
    }
  };

  const handleNext = (questionsLength: number) => {
    if (currentQuestion < questionsLength - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleShowResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleContinueToBooking = () => {
    if (!pendingAction) {
      setPendingAction("book");
    }
    setShowBookingForm(true);
  };

  return {
    testStarted,
    setTestStarted,
    currentQuestion,
    answers,
    showResults,
    showTherapistPopup,
    setShowTherapistPopup,
    showBookingForm,
    setShowBookingForm,
    pendingAction,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleRestart,
    handleContinueToBooking,
    calculateScore,
    getResultInterpretation: config.getSeverity,
  };
};
