
import { getCategoryScores, interpretMMSEScore } from '@/data/mmseQuestions';

export interface ScoreAnalysis {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  categoryScores: Record<string, { score: number, maxScore: number, percentage: number }>;
  severity: string;
  interpretation: string;
  color: string;
}

export const calculateScoreAnalysis = (
  answers: Record<number, number>,
  maxPossibleScore: number
): ScoreAnalysis => {
  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
  const percentageScore = (totalScore / maxPossibleScore) * 100;
  
  // Get category scores
  const rawCategoryScores = getCategoryScores(answers);
  
  // Add percentage to each category
  const categoryScores: Record<string, { score: number, maxScore: number, percentage: number }> = {};
  Object.entries(rawCategoryScores).forEach(([category, data]) => {
    categoryScores[category] = {
      ...data,
      percentage: data.maxScore ? (data.score / data.maxScore) * 100 : 0
    };
  });
  
  // Determine severity based on user-specified thresholds
  let severity, interpretation, color;
  
  if (percentageScore < 45) {
    severity = "Severe";
    interpretation = "Indicates severe cognitive impairment. Immediate medical consultation is recommended.";
    color = "text-red-600";
  } else if (percentageScore >= 45 && percentageScore < 75) {
    severity = "Moderate";
    interpretation = "Indicates moderate cognitive impairment. Follow-up with a healthcare provider is recommended.";
    color = "text-orange-600";
  } else {
    severity = "Normal";
    interpretation = "Cognitive function appears to be within normal parameters.";
    color = "text-green-600";
  }
  
  return {
    totalScore,
    maxPossibleScore,
    percentageScore,
    categoryScores,
    severity,
    interpretation,
    color
  };
};
