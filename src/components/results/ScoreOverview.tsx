
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ScoreOverviewProps {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  severity: string;
  interpretation: string;
  color: string;
  mlAnalysis: any;
  onReset: () => void;
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  totalScore,
  maxPossibleScore,
  percentageScore,
  severity,
  interpretation,
  color,
  mlAnalysis,
  onReset
}) => {
  
  const pieData = [
    { name: 'Score', value: totalScore, color: '#42A5F5' },
    { name: 'Missed', value: maxPossibleScore - totalScore, color: '#E0E0E0' }
  ];
  
  return (
    <div className="bg-card-gradient rounded-2xl p-6 md:p-8 shadow-card border border-border/50 animate-scale-up">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-2">Overall Score</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{totalScore}</span>
              <span className="text-xl text-muted-foreground">/ {maxPossibleScore}</span>
              <span className="text-sm ml-2 text-muted-foreground">
                ({Math.round(percentageScore)}%)
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
              : color
            }`}>
              {mlAnalysis ? `${mlAnalysis.severity} Cognitive Status` : severity}
              {mlAnalysis && (
                <span className="text-sm ml-2 opacity-75">
                  (Confidence: {Math.round(mlAnalysis.confidence * 100)}%)
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              {mlAnalysis ? 
                `The ML model has detected ${mlAnalysis.severity.toLowerCase()} cognitive impairment based on response patterns, response times, and answer content.` :
                interpretation
              }
            </p>
          </div>
          
          <div className="pt-2">
            <button
              onClick={onReset}
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
  );
};

export default ScoreOverview;
