import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamination } from '@/context/ExaminationContext';
import { calculateScoreAnalysis } from '@/utils/scoreCalculation';
import { mmseQuestions } from '@/data/mmseQuestions';
import NavBar from '@/components/NavBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

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
  
  React.useEffect(() => {
    if (!isCompleted) {
      navigate('/');
    }
  }, [isCompleted, navigate]);
  
  const scoreAnalysis = calculateScoreAnalysis(answers, maxPossibleScore);
  
  const pieData = [
    { name: 'Score', value: totalScore, color: '#42A5F5' },
    { name: 'Missed', value: maxPossibleScore - totalScore, color: '#E0E0E0' }
  ];
  
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
                  <h3 className="font-medium">ML-Based Interpretation</h3>
                  <div className={`text-lg font-medium ${
                    mlAnalysis ? 
                      mlAnalysis.severity === 'Normal' ? 'text-green-600' :
                      mlAnalysis.severity === 'Mild' ? 'text-yellow-600' :
                      mlAnalysis.severity === 'Moderate' ? 'text-orange-600' :
                      'text-red-600'
                    : scoreAnalysis.color
                  }`}>
                    {mlAnalysis ? `${mlAnalysis.severity} Cognitive Status` : scoreAnalysis.severity}
                    {mlAnalysis && (
                      <span className="text-sm ml-2 opacity-75">
                        (Confidence: {Math.round(mlAnalysis.confidence * 100)}%)
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {mlAnalysis ? 
                      `The ML model has detected ${mlAnalysis.severity.toLowerCase()} cognitive impairment based on response patterns, response times, and answer content.` :
                      scoreAnalysis.interpretation
                    }
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
          
          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-medium">ML Model Analysis</h2>
            
            <div className="bg-card-gradient rounded-2xl p-6 md:p-8 shadow-card border border-border/50">
              {!mlAnalysis ? (
                <div className="text-center py-8 space-y-4">
                  <LoadingSpinner size="md" />
                  <p className="text-muted-foreground">
                    ML analysis could not be performed.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Cognitive Domain Analysis</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar
                            name="Cognitive Function"
                            dataKey="score"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                          <Tooltip formatter={(value) => [formatRadarValue(value), 'Strength']} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4">Response Time Analysis</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={responseTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="id" label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Response Time (sec)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => [formatResponseTime(value), 'Response Time']}
                            labelFormatter={(id) => `Question ${id} (${responseTimeData.find(d => d.id === id)?.category || ''})`}
                          />
                          <Bar dataKey="responseTime" fill="#FF8042" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-medium">Recommendations</h3>
                    <ul className="space-y-2">
                      {mlAnalysis.severity === 'Normal' ? (
                        <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          Maintain cognitive health through regular mental exercises and social engagement.
                        </li>
                      ) : mlAnalysis.severity === 'Mild' ? (
                        <>
                          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            Consider a follow-up assessment with a healthcare professional.
                          </li>
                          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            Engage in regular cognitive exercises targeting areas of weakness.
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            Comprehensive evaluation by a neurologist or geriatric specialist is recommended.
                          </li>
                          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            Consider structured cognitive rehabilitation therapy.
                          </li>
                          <li className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            Evaluation for possible medication or treatment options.
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-6">
                    <p>
                      Analysis generated using an integrated machine learning model. This information is for reference only and 
                      should not replace professional medical advice.
                    </p>
                  </div>
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
