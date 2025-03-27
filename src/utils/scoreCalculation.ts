
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
  
  // Get interpretation based on updated thresholds
  const { severity, interpretation, color } = interpretMMSEScore(totalScore);
  
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
