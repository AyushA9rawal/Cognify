
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamination } from '@/context/ExaminationContext';
import { calculateScoreAnalysis } from '@/utils/scoreCalculation';
import { mmseQuestions } from '@/data/mmseQuestions';
import NavBar from '@/components/NavBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultsHeader from '@/components/results/ResultsHeader';
import ScoreOverview from '@/components/results/ScoreOverview';
import CategoryBreakdown from '@/components/results/CategoryBreakdown';
import MLAnalysisSection from '@/components/results/MLAnalysisSection';
import ApiKeySetup from '@/components/ApiKeySetup';
import { geminiService } from '@/utils/geminiService';

const Results = () => {
  const navigate = useNavigate();
  const {
    answers,
    answerDetails,
    totalScore,
    maxPossibleScore,
    isCompleted,
    patientInfo,
    mlAnalysis,
    resetExamination
  } = useExamination();
  
  const [showApiKeySetup, setShowApiKeySetup] = useState(!geminiService.hasApiKey());
  
  React.useEffect(() => {
    if (!isCompleted) {
      navigate('/');
    }
  }, [isCompleted, navigate]);
  
  const scoreAnalysis = calculateScoreAnalysis(answers, maxPossibleScore);
  
  const categoryData = Object.entries(scoreAnalysis.categoryScores).map(([category, data]) => ({
    name: category.split(' ').pop() || category,
    score: data.score,
    maxScore: data.maxScore,
    percentage: data.percentage
  }));
  
  const radarData = mlAnalysis ? Object.entries(mlAnalysis.categoryScores).map(([category, score]) => ({
    category,
    score: Number(score) * 100
  })) : [];
  
  const handleReset = () => {
    resetExamination();
    navigate('/');
  };
  
  const responseTimeData = Object.entries(answerDetails).map(([id, detail]) => ({
    id: Number(id),
    responseTime: detail.responseTimeMs / 1000,
    category: mmseQuestions.find(q => q.id === Number(id))?.category.split(' ').pop() || ''
  })).sort((a, b) => a.id - b.id);
  
  if (!isCompleted) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-background pb-16">
      <NavBar />
      
      <main className="pt-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <div className="space-y-12">
          <ResultsHeader 
            patientName={patientInfo.name}
            patientAge={patientInfo.age}
          />
          
          <ScoreOverview
            totalScore={totalScore}
            maxPossibleScore={maxPossibleScore}
            percentageScore={scoreAnalysis.percentageScore}
            severity={scoreAnalysis.severity}
            interpretation={scoreAnalysis.interpretation}
            color={scoreAnalysis.color}
            mlAnalysis={mlAnalysis}
            onReset={handleReset}
          />
          
          <CategoryBreakdown categoryData={categoryData} />
          
          <MLAnalysisSection
            mlAnalysis={mlAnalysis}
            radarData={radarData}
            responseTimeData={responseTimeData}
          />
          
          {/* Gemini API Key Setup Section */}
          {showApiKeySetup ? (
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <h2 className="text-2xl font-medium">Enhanced Analysis Configuration</h2>
              <ApiKeySetup onApiKeySet={() => setShowApiKeySetup(false)} />
            </div>
          ) : (
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium">Enhanced Analysis Configuration</h2>
                <button 
                  onClick={() => setShowApiKeySetup(true)}
                  className="btn-secondary text-sm px-3 py-1 rounded-md"
                >
                  Change API Key
                </button>
              </div>
              <div className="bg-card-gradient rounded-2xl p-6 shadow-card border border-border/50">
                <p className="text-muted-foreground">
                  Gemini API key is configured. Enhanced analysis is available.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Results;
