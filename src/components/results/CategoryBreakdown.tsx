
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CategoryBreakdownProps {
  categoryData: Array<{
    name: string;
    score: number;
    maxScore: number;
    percentage: number;
  }>;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categoryData }) => {
  return (
    <div className="space-y-6 animate-slide-in">
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
  );
};

export default CategoryBreakdown;
