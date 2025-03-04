
export interface GeminiResponse {
  analysis: string;
  recommendations: string[];
  loading: boolean;
  error: string | null;
}

export const analyzeWithGemini = async (
  score: number,
  maxScore: number,
  categoryScores: Record<string, { score: number, maxScore: number, percentage: number }>,
  patientInfo: { name: string, age: string, gender: string },
  apiKey: string
): Promise<GeminiResponse> => {
  try {
    if (!apiKey) {
      return {
        analysis: "",
        recommendations: [],
        loading: false,
        error: "No API key provided"
      };
    }

    const prompt = `
      Analyze the following Mini Mental State Examination (MMSE) results:
      
      Patient Information:
      - Name: ${patientInfo.name}
      - Age: ${patientInfo.age}
      - Gender: ${patientInfo.gender}
      
      Overall Score: ${score} out of ${maxScore} (${Math.round((score / maxScore) * 100)}%)
      
      Category Breakdown:
      ${Object.entries(categoryScores)
        .map(([category, { score, maxScore, percentage }]) => 
          `- ${category}: ${score}/${maxScore} (${Math.round(percentage)}%)`
        )
        .join('\n')}
      
      Based on these results, please provide:
      1. A detailed clinical analysis of the cognitive status
      2. Specific areas of concern based on category scores
      3. Three to five evidence-based recommendations for next steps
      
      Format your response in paragraph form for the analysis, followed by a bulleted list of recommendations.
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text || '';
    
    // Split analysis and recommendations
    const sections = analysisText.split(/Recommendations:|Suggested next steps:|Next steps:/i);
    const analysis = sections[0].trim();
    
    let recommendations: string[] = [];
    if (sections.length > 1) {
      // Extract recommendations from bulleted list or numbered list
      recommendations = sections[1]
        .split(/\n[•\-\*\d]\s+/)
        .filter(item => item.trim().length > 0)
        .map(item => item.trim());
    }

    return {
      analysis,
      recommendations,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    return {
      analysis: "",
      recommendations: [],
      loading: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
