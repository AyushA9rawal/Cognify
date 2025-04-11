
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
import { Button } from '@/components/ui/button';

const Results = () => {
  const navigate = useNavigate();
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
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
          
          {showApiKeySetup ? (
            <ApiKeySetup onApiKeySet={() => setShowApiKeySetup(false)} />
          ) : (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline"
                onClick={() => setShowApiKeySetup(true)}
              >
                Configure Gemini API Key
              </Button>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 shadow-sm">
            <h3 className="text-yellow-800 font-medium mb-2">Voice Input Used</h3>
            <p className="text-yellow-700 text-sm">
              This assessment included voice input capability. Response times may vary based on speech recognition quality.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
