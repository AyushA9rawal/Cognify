
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mmseQuestions, getMaxPossibleScore } from '@/data/mmseQuestions';

type AnswerData = {
  score: number;
  answer: string;
};

type ExaminationContextType = {
  currentQuestionIndex: number;
  answers: Record<number, number>;
  answerDetails: Record<number, AnswerData>;
  totalScore: number;
  maxPossibleScore: number;
  isCompleted: boolean;
  hasStarted: boolean;
  patientInfo: PatientInfo;
  startExamination: (info: PatientInfo) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: number, score: number, answer: string) => void;
  completeExamination: () => void;
  resetExamination: () => void;
};

type PatientInfo = {
  name: string;
  age: string;
  gender: string;
};

const initialPatientInfo: PatientInfo = {
  name: '',
  age: '',
  gender: '',
};

const ExaminationContext = createContext<ExaminationContextType | undefined>(undefined);

export const ExaminationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [answerDetails, setAnswerDetails] = useState<Record<number, AnswerData>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  
  const maxPossibleScore = getMaxPossibleScore();
  
  // Recalculate total score whenever answers change
  useEffect(() => {
    const newTotalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    setTotalScore(newTotalScore);
  }, [answers]);
  
  const startExamination = (info: PatientInfo) => {
    setPatientInfo(info);
    setHasStarted(true);
    setCurrentQuestionIndex(0);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < mmseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const setAnswer = (questionId: number, score: number, answer: string) => {
    // For free text questions where score is deferred (-1), we need to evaluate
    if (score === -1) {
      // Simple evaluation for sentence question - if it has subject and verb, give 1 point
      if (questionId === 18) { // Write a sentence question
        const hasSentenceStructure = answer.trim().split(' ').length >= 2;
        score = hasSentenceStructure ? 1 : 0;
      }
    }
    
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setAnswerDetails(prev => ({ ...prev, [questionId]: { score, answer } }));
  };
  
  const completeExamination = () => {
    setIsCompleted(true);
  };
  
  const resetExamination = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnswerDetails({});
    setTotalScore(0);
    setIsCompleted(false);
    setHasStarted(false);
    setPatientInfo(initialPatientInfo);
  };
  
  const value = {
    currentQuestionIndex,
    answers,
    answerDetails,
    totalScore,
    maxPossibleScore,
    isCompleted,
    hasStarted,
    patientInfo,
    startExamination,
    goToNextQuestion,
    goToPreviousQuestion,
    setAnswer,
    completeExamination,
    resetExamination,
  };
  
  return (
    <ExaminationContext.Provider value={value}>
      {children}
    </ExaminationContext.Provider>
  );
};

export const useExamination = (): ExaminationContextType => {
  const context = useContext(ExaminationContext);
  if (!context) {
    throw new Error('useExamination must be used within an ExaminationProvider');
  }
  return context;
};
