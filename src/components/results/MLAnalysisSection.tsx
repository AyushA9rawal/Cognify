import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import CognitiveAnalysis from './CognitiveAnalysis';
import ResponseTimeAnalysis from './ResponseTimeAnalysis';
import Recommendations from './Recommendations';
import { geminiService } from '@/utils/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ApiKeySetup from '@/components/ApiKeySetup';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DEFAULT_GEMINI_API_KEY = "AIzaSyDrjVHQKv6mWm7PwKi9jO07c6XrlEyJPfU";

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
  const [showApiKeySetup, setShowApiKeySetup] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (DEFAULT_GEMINI_API_KEY !== "AIzaSyDrjVHQKv6mWm7PwKi9jO07c6XrlEyJPfU") {
      geminiService.setApiKey(DEFAULT_GEMINI_API_KEY);
    }
  }, []);

  const fetchGeminiAnalysis = async () => {
    if (!mlAnalysis) return;
    
    try {
      setIsLoadingGemini(true);
      
      const responses: Record<string, string> = {};
      Object.entries(mlAnalysis.categoryScores).forEach(([category, score]) => {
        const numericScore = typeof score === 'number' ? score : 
                            typeof score === 'object' && score !== null ? 
                            Number((score as any).percentage || 0) / 100 : 0;
                            
        responses[`${category} score`] = `${Math.round(numericScore * 100)}%`;
      });
      
      let overallScoreValue = 0;
      if (mlAnalysis.overallScore) {
        overallScoreValue = Number(mlAnalysis.overallScore);
      } else if (Object.values(mlAnalysis.categoryScores).length > 0) {
        const sum = Object.values(mlAnalysis.categoryScores)
          .reduce((sum: number, score: any) => {
            let scoreValue = 0;
            if (typeof score === 'number') {
              scoreValue = score;
            } else if (typeof score === 'object' && score !== null) {
              scoreValue = Number((score as any).percentage || 0) / 100;
            }
            return sum + scoreValue;
          }, 0);
        
        const categoryCount = Object.values(mlAnalysis.categoryScores).length;
        overallScoreValue = Math.round((Number(sum) * 100) / categoryCount);
      }
          
      responses["Overall cognitive assessment score"] = `${overallScoreValue}%`;
      
      if (geminiService.hasApiKey()) {
        const analysis = await geminiService.analyzeResponses(responses);
        console.log("Gemini analysis result:", analysis);
        setGeminiAnalysis(analysis);
      } else {
        console.log("No Gemini API key available");
        setGeminiAnalysis(
          "Enhanced analysis requires a Gemini API key. Configure your API key to access detailed cognitive insights."
        );
      }
    } catch (error) {
      console.error('Error fetching Gemini analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to get enhanced analysis.",
        variant: "destructive"
      });
      
      setGeminiAnalysis(
        "Based on the assessment results, standard scoring suggests " + 
        mlAnalysis.severity.toLowerCase() + 
        " cognitive status."
      );
    } finally {
      setIsLoadingGemini(false);
    }
  };

  useEffect(() => {
    fetchGeminiAnalysis();
  }, [mlAnalysis]);

  const handleSetupApiKey = () => {
    setShowApiKeySetup(true);
  };

  const handleApiKeySet = () => {
    setShowApiKeySetup(false);
    fetchGeminiAnalysis();
    toast({
      title: "API Key Configured",
      description: "Generating enhanced analysis with Gemini AI...",
    });
  };

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
            
            <div className="mt-8 border-t border-border/30 pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Enhanced Analysis</h3>
                {(DEFAULT_GEMINI_API_KEY === "AIzaSyDrjVHQKv6mWm7PwKi9jO07c6XrlEyJPfU" && !geminiService.hasApiKey() && !showApiKeySetup) && (
                  <Button 
                    onClick={handleSetupApiKey}
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Configure Gemini API Key
                  </Button>
                )}
              </div>
              
              {(DEFAULT_GEMINI_API_KEY === "AIzaSyDrjVHQKv6mWm7PwKi9jO07c6XrlEyJPfU" && !geminiService.hasApiKey() && !showApiKeySetup) && (
                <Alert className="mb-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <AlertTitle className="text-amber-800 dark:text-amber-300">API Key Required</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Enhanced AI analysis requires a Gemini API key. Click the "Configure Gemini API Key" button to set up your key.
                  </AlertDescription>
                </Alert>
              )}
              
              {showApiKeySetup ? (
                <div className="mt-4">
                  <ApiKeySetup onApiKeySet={handleApiKeySet} />
                </div>
              ) : isLoadingGemini ? (
                <div className="text-center py-4">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm text-muted-foreground mt-2">Generating enhanced analysis...</p>
                </div>
              ) : geminiAnalysis ? (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
                  {geminiAnalysis}
                  
                  {geminiAnalysis.includes("requires a Gemini API key") && 
                   DEFAULT_GEMINI_API_KEY === "AIzaSyDrjVHQKv6mWm7PwKi9jO07c6XrlEyJPfU" && 
                   !showApiKeySetup && (
                    <div className="mt-4 flex justify-center">
                      <Button 
                        onClick={handleSetupApiKey}
                        variant="default"
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Configure Gemini API Key
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            
            <Recommendations severity={mlAnalysis.severity} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MLAnalysisSection;
