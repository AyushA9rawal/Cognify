
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamination } from '@/context/ExaminationContext';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import LoadingSpinner from '@/components/LoadingSpinner';
import { mmseQuestions } from '@/data/mmseQuestions';
import { motion, AnimatePresence } from 'framer-motion';

const PatientInfoForm: React.FC<{
  onSubmit: (info: { name: string; age: string; gender: string }) => void;
}> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !age.trim() || !gender) {
      setError('Please fill in all fields');
      return;
    }
    
    onSubmit({ name, age, gender });
  };

  return (
    <div className="bg-card-gradient rounded-2xl p-8 shadow-card max-w-md w-full mx-auto border border-border/50 animate-scale-up">
      <h2 className="text-2xl font-medium mb-6">Patient Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Patient Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Full Name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="age" className="text-sm font-medium">
            Patient Age
          </label>
          <input
            id="age"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Age in years"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {['Male', 'Female', 'Other'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                className={`p-3 border rounded-lg text-center transition-all ${
                  gender === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full py-3 rounded-lg"
        >
          Begin Assessment
        </button>
      </form>
    </div>
  );
};

const Examination = () => {
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    answers,
    totalScore,
    hasStarted,
    isAnalyzing,
    startExamination,
    goToNextQuestion,
    goToPreviousQuestion,
    setAnswer,
    completeExamination
  } = useExamination();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Current question
  const currentQuestion = mmseQuestions[currentQuestionIndex];
  
  // Check if question is answered
  const isCurrentQuestionAnswered = answers[currentQuestion?.id] !== undefined;
  
  // Handle answer selection
  const handleAnswerSelect = (score: number, answer: string, responseTimeMs: number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, score, answer, responseTimeMs);
  };
  
  // Navigate to next question with transition
  const handleNext = () => {
    if (currentQuestionIndex < mmseQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        goToNextQuestion();
        setIsTransitioning(false);
      }, 300);
    } else {
      // Complete examination with ML analysis
      handleComplete();
    }
  };
  
  // Handle completion with ML analysis
  const handleComplete = async () => {
    setIsTransitioning(true);
    await completeExamination();
    navigate('/results');
  };
  
  // Navigate to previous question with transition
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        goToPreviousQuestion();
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Show loading during ML analysis
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-medium">Analyzing Responses</h2>
          <p className="text-muted-foreground">Using ML model to evaluate cognitive status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-background py-8 md:py-12 flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col justify-center items-center">
        {!hasStarted ? (
          <PatientInfoForm onSubmit={startExamination} />
        ) : (
          <div className="w-full space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Mini Mental State Examination</h1>
              <p className="text-muted-foreground">Answer each question by typing or speaking your response</p>
            </div>
            
            <ProgressIndicator 
              currentStep={currentQuestionIndex + 1} 
              totalSteps={mmseQuestions.length}
              className="mb-8"
            />
            
            <AnimatePresence mode="wait">
              {!isTransitioning && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswerSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn-secondary px-6 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
                className="btn-primary px-6 rounded-lg disabled:opacity-50"
              >
                {currentQuestionIndex < mmseQuestions.length - 1 ? 'Next' : 'Complete Assessment'}
              </button>
            </div>
            
            <div className="text-center mt-6 text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {mmseQuestions.length} | Current Score: {totalScore}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p className="font-medium">Voice Input Available!</p>
              <p>Click the microphone icon to answer questions using your voice.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Examination;
