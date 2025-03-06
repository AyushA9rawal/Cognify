
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';

// Helper function for formatting values in radar chart
const formatRadarValue = (value: number): string => {
  return `${value.toFixed(0)}%`;
};

interface CognitiveAnalysisProps {
  mlAnalysis: any;
  radarData: Array<{
    category: string;
    score: number;
  }>;
}

const CognitiveAnalysis: React.FC<CognitiveAnalysisProps> = ({ mlAnalysis, radarData }) => {
  return (
    <>
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
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return [formatRadarValue(value), 'Strength'];
              }
              return ['N/A', 'Strength'];
            }} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default CognitiveAnalysis;
