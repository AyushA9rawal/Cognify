
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mmseQuestions, getMaxPossibleScore } from '@/data/mmseQuestions';
import { mlService, AnswerFeatures } from '@/utils/mlService';

type AnswerData = {
  score: number;
  answer: string;
  responseTimeMs: number;
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
  mlAnalysis: any;
  isAnalyzing: boolean;
  startExamination: (info: PatientInfo) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: number, score: number, answer: string, responseTimeMs: number) => void;
  completeExamination: () => Promise<void>;
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
  const [mlAnalysis, setMlAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const maxPossibleScore = getMaxPossibleScore();
  
  // Load ML model on initial mount
  useEffect(() => {
    // Initialize ML service in the background
    mlService.initialize().then(success => {
      console.log('ML model initialization:', success ? 'successful' : 'failed');
    });
  }, []);
  
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
  
  const setAnswer = (questionId: number, score: number, answer: string, responseTimeMs: number) => {
    // For auto-scored questions where score is deferred (-1), evaluate using validation function or ML service
    const question = mmseQuestions.find(q => q.id === questionId);
    
    if (score === -1 && question) {
      console.log(`Auto-scoring question ${questionId}: "${answer}"`);
      if (question.validationFunction) {
        // Use custom validation function
        const isValid = question.validationFunction(answer);
        score = isValid ? question.maxScore : 0;
        console.log(`Validation function result: ${isValid ? 'Valid' : 'Invalid'} (score: ${score})`);
      } else if (question.autoScore) {
        // Use ML service to score the response
        const confidenceScore = mlService.analyzeTextResponse(answer, question.category);
        score = Math.round(confidenceScore * question.maxScore);
        console.log(`ML service result: confidence ${confidenceScore} (score: ${score})`);
      } else if (question.id === 9) { // Write a sentence question
        // Simple evaluation for sentence question
        const hasSentenceStructure = answer.trim().split(' ').length >= 2;
        score = hasSentenceStructure ? 1 : 0;
        console.log(`Sentence structure check: ${hasSentenceStructure ? 'Valid' : 'Invalid'} (score: ${score})`);
      }
    }
    
    console.log(`Setting answer for question ${questionId}:`, { score, answer: answer.substring(0, 30) + (answer.length > 30 ? '...' : '') });
    
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setAnswerDetails(prev => ({ 
      ...prev, 
      [questionId]: { score, answer, responseTimeMs } 
    }));
  };
  
  const completeExamination = async () => {
    setIsAnalyzing(true);
    
    try {
      // Prepare data for ML analysis
      const features: AnswerFeatures = {
        categoryResponses: {},
        patientAge: parseInt(patientInfo.age) || 0,
        patientGender: patientInfo.gender as 'Male' | 'Female' | 'Other',
        responseTimeMs: {}
      };
      
      // Group answers by category for ML analysis
      mmseQuestions.forEach(question => {
        // Initialize category array if not exists
        if (!features.categoryResponses[question.category]) {
          features.categoryResponses[question.category] = [];
        }
        
        // Add answer score (normalized) to category responses
        const answerDetail = answerDetails[question.id];
        if (answerDetail) {
          features.categoryResponses[question.category].push(
            answerDetail.score / question.maxScore
          );
          features.responseTimeMs[question.id] = answerDetail.responseTimeMs;
        } else {
          // No answer provided, add 0
          features.categoryResponses[question.category].push(0);
          features.responseTimeMs[question.id] = 0;
        }
      });
      
      // Get ML analysis
      const analysis = await mlService.analyzeMentalState(features);
      setMlAnalysis(analysis);
      
      setIsCompleted(true);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error during ML analysis:", error);
      // Fallback to traditional scoring if ML fails
      setMlAnalysis(null);
      setIsCompleted(true);
      setIsAnalyzing(false);
    }
  };
  
  const resetExamination = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnswerDetails({});
    setTotalScore(0);
    setIsCompleted(false);
    setHasStarted(false);
    setPatientInfo(initialPatientInfo);
    setMlAnalysis(null);
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
    mlAnalysis,
    isAnalyzing,
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
