
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CognitiveAnalysis from './CognitiveAnalysis';
import ResponseTimeAnalysis from './ResponseTimeAnalysis';
import Recommendations from './Recommendations';
import { geminiService } from '@/utils/geminiService';
import { useToast } from '@/hooks/use-toast';

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
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // If mlAnalysis exists and Gemini has API key, fetch Gemini analysis
    const fetchGeminiAnalysis = async () => {
      if (!mlAnalysis) return;
      
      try {
        setIsLoadingGemini(true);
        
        // Format responses for Gemini
        const responses: Record<string, string> = {};
        Object.entries(mlAnalysis.categoryScores).forEach(([category, score]) => {
          // Make sure score is converted to a number before multiplying
          const numericScore = typeof score === 'number' ? score : 
                              typeof score === 'object' && score !== null ? 
                              Number((score as any).percentage || 0) / 100 : 0;
                              
          responses[`${category} score`] = `${Math.round(numericScore * 100)}%`;
        });
        
        // Add total score - Fix the calculation to ensure we're working with numbers
        let overallScoreValue = 0;
        if (mlAnalysis.overallScore) {
          overallScoreValue = mlAnalysis.overallScore;
        } else if (Object.values(mlAnalysis.categoryScores).length > 0) {
          const sum = Object.values(mlAnalysis.categoryScores)
            .reduce((sum: number, score: any) => {
              // Convert to number first, then do calculations
              let scoreValue = 0;
              if (typeof score === 'number') {
                scoreValue = score;
              } else if (typeof score === 'object' && score !== null) {
                scoreValue = Number((score as any).percentage || 0) / 100;
              }
              return sum + scoreValue;
            }, 0);
          
          overallScoreValue = Math.round((sum * 100) / Object.values(mlAnalysis.categoryScores).length);
        }
            
        responses["Overall cognitive assessment score"] = `${overallScoreValue}%`;
        
        if (geminiService.hasApiKey()) {
          const analysis = await geminiService.analyzeResponses(responses);
          setGeminiAnalysis(analysis);
        } else {
          // No API key, provide a default analysis
          setGeminiAnalysis(
            "Enhanced analysis requires a Gemini API key. The analysis would provide more detailed insights into cognitive patterns, areas of concern, and personalized recommendations based on the assessment results."
          );
        }
      } catch (error) {
        console.error('Error fetching Gemini analysis:', error);
        toast({
          title: "Analysis Notice",
          description: "Using standard analysis. For enhanced insights, update Gemini API key.",
          variant: "default"
        });
        
        // Provide a fallback analysis
        setGeminiAnalysis(
          "Based on the assessment results, standard scoring suggests " + 
          mlAnalysis.severity.toLowerCase() + 
          " cognitive status. For personalized analysis, please ensure a valid Gemini API key is configured."
        );
      } finally {
        setIsLoadingGemini(false);
      }
    };
    
    fetchGeminiAnalysis();
  }, [mlAnalysis, toast]);

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
            
            {/* Enhanced Gemini Analysis */}
            {isLoadingGemini ? (
              <div className="mt-6 text-center py-4">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-muted-foreground mt-2">Generating enhanced analysis...</p>
              </div>
            ) : geminiAnalysis ? (
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-medium">Enhanced Analysis</h3>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
                  {geminiAnalysis}
                </div>
              </div>
            ) : null}
            
            <Recommendations severity={mlAnalysis.severity} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MLAnalysisSection;
