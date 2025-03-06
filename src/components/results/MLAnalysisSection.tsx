
import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CognitiveAnalysis from './CognitiveAnalysis';
import ResponseTimeAnalysis from './ResponseTimeAnalysis';
import Recommendations from './Recommendations';

interface MLAnalysisSectionProps {
  mlAnalysis: any;
  radarData: Array<{
    category: string;
    score: number;
  }>;
  responseTimeData: Array<{
    id: number;
    responseTime: number;
    category: string;
  }>;
}

const MLAnalysisSection: React.FC<MLAnalysisSectionProps> = ({ 
  mlAnalysis, 
  radarData, 
  responseTimeData 
}) => {
  return (
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
            <CognitiveAnalysis mlAnalysis={mlAnalysis} radarData={radarData} />
            <ResponseTimeAnalysis responseTimeData={responseTimeData} />
            <Recommendations severity={mlAnalysis.severity} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MLAnalysisSection;
