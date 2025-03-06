
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Helper function for formatting response time values
const formatResponseTime = (value: number): string => {
  return `${value.toFixed(1)} sec`;
};

interface ResponseTimeAnalysisProps {
  responseTimeData: Array<{
    id: number;
    responseTime: number;
    category: string;
  }>;
}

const ResponseTimeAnalysis: React.FC<ResponseTimeAnalysisProps> = ({ responseTimeData }) => {
  return (
    <>
      <h3 className="text-xl font-medium mb-4">Response Time Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" label={{ value: 'Question Number', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Response Time (sec)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [formatResponseTime(value), 'Response Time'];
                }
                return ['N/A', 'Response Time'];
              }}
              labelFormatter={(id) => `Question ${id} (${responseTimeData.find(d => d.id === Number(id))?.category || ''})`}
            />
            <Bar dataKey="responseTime" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ResponseTimeAnalysis;
