
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamination } from '@/context/ExaminationContext';
import { calculateScoreAnalysis } from '@/utils/scoreCalculation';
import { analyzeWithGemini, GeminiResponse } from '@/utils/geminiAnalysis';
import NavBar from '@/components/NavBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Results = () => {
  const navigate = useNavigate();
  const {
    answers,
    answerDetails,
    totalScore,
    maxPossibleScore,
    isCompleted,
    patientInfo,
    resetExamination
  } = useExamination();
  
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse>({
    analysis: '',
    recommendations: [],
    loading: false,
    error: null
  });
  
  // Redirect if examination not completed
  useEffect(() => {
    if (!isCompleted) {
      navigate('/');
    }
  }, [isCompleted, navigate]);
  
  // Calculate score analysis
  const scoreAnalysis = calculateScoreAnalysis(answers, maxPossibleScore);
  
  // Prepare data for charts
  const pieData = [
    { name: 'Score', value: totalScore, color: '#42A5F5' },
    { name: 'Missed', value: maxPossibleScore - totalScore, color: '#E0E0E0' }
  ];
  
  const categoryData = Object.entries(scoreAnalysis.categoryScores).map(([category, data]) => ({
    name: category.split(' ').pop() || category, // Just use the last word for brevity
    score: data.score,
    maxScore: data.maxScore,
    percentage: data.percentage
  }));
  
  // Handle Gemini analysis
  const handleGeminiAnalysis = async () => {
    if (!geminiApiKey.trim()) {
      return;
    }
    
    setGeminiResponse({ ...geminiResponse, loading: true, error: null });
    
    try {
      const response = await analyzeWithGemini(
        totalScore,
        maxPossibleScore,
        scoreAnalysis.categoryScores,
        patientInfo,
        geminiApiKey
      );
      
      setGeminiResponse(response);
    } catch (error) {
      setGeminiResponse({
        ...geminiResponse,
        loading: false,
        error: 'Failed to analyze results with Gemini API'
      });
    }
  };
  
  const handleReset = () => {
    resetExamination();
    navigate('/');
  };
  
  // Main content
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
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-in">
            <div className="inline-flex px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              Assessment Complete
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">MMSE Results</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Below is a detailed breakdown of the Mini Mental State Examination results
              for {patientInfo.name}, {patientInfo.age} years old.
            </p>
          </div>
          
          {/* Overall Score Card */}
          <div className="bg-card-gradient rounded-2xl p-6 md:p-8 shadow-card border border-border/50 animate-scale-up">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-2">Overall Score</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{totalScore}</span>
                    <span className="text-xl text-muted-foreground">/ {maxPossibleScore}</span>
                    <span className="text-sm ml-2 text-muted-foreground">
                      ({Math.round(scoreAnalysis.percentageScore)}%)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Interpretation</h3>
                  <div className={`text-lg font-medium ${scoreAnalysis.color}`}>
                    {scoreAnalysis.severity} Cognitive Status
                  </div>
                  <p className="text-muted-foreground">
                    {scoreAnalysis.interpretation}
                  </p>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="btn-secondary rounded-lg"
                  >
                    Start New Assessment
                  </button>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-medium">Category Breakdown</h2>
            
            <div className="bg-card-gradient rounded-2xl p-6 md:p-8 shadow-card border border-border/50">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'score' ? 'Points Earned' : 'Maximum Points']}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Bar dataKey="score" fill="#42A5F5" name="Score" />
                    <Bar dataKey="maxScore" fill="#E0E0E0" name="Maximum" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* AI Analysis */}
          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-medium">AI-Powered Analysis</h2>
            
            <div className="bg-card-gradient rounded-2xl p-6 md:p-8 shadow-card border border-border/50">
              {!showApiInput && !geminiResponse.analysis ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">
                    Get advanced analysis of these results using Google's Gemini AI.
                  </p>
                  <button
                    onClick={() => setShowApiInput(true)}
                    className="btn-primary rounded-lg"
                  >
                    Generate AI Analysis
                  </button>
                </div>
              ) : showApiInput && !geminiResponse.analysis ? (
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter your Gemini API key to generate an in-depth analysis of the assessment results.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="Enter Gemini API Key"
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    {geminiResponse.error && (
                      <div className="text-sm text-red-500">
                        {geminiResponse.error}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleGeminiAnalysis}
                      disabled={!geminiApiKey.trim() || geminiResponse.loading}
                      className="btn-primary rounded-lg flex-1"
                    >
                      {geminiResponse.loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        'Generate Analysis'
                      )}
                    </button>
                    <button
                      onClick={() => setShowApiInput(false)}
                      className="btn-secondary rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {geminiResponse.loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <LoadingSpinner size="lg" />
                      <p className="text-muted-foreground">Analyzing results with Gemini AI...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-xl font-medium">Clinical Analysis</h3>
                        <div className="prose prose-slate max-w-none">
                          <p className="text-muted-foreground whitespace-pre-line">
                            {geminiResponse.analysis}
                          </p>
                        </div>
                      </div>
                      
                      {geminiResponse.recommendations.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-medium">Recommendations</h3>
                          <ul className="space-y-2">
                            {geminiResponse.recommendations.map((rec, index) => (
                              <li key={index} className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground mt-6">
                        <p>
                          Analysis generated using Google Gemini AI. This information is for reference only and 
                          should not replace professional medical advice.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
