// This is a simple service to integrate with Google's Gemini API

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

// Default API key - replace with your actual Gemini API key
const DEFAULT_GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

// Cache key for localStorage
const GEMINI_API_KEY_STORAGE = 'gemini_api_key';

class GeminiService {
  private apiKey: string = DEFAULT_GEMINI_API_KEY;
  private modelName: string = 'gemini-1.5-pro';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  
  constructor() {
    console.log("GeminiService initializing...");
    // Default to the hardcoded key, no need to load from storage
    this.apiKey = DEFAULT_GEMINI_API_KEY;
  }
  
  // This method is kept for backward compatibility but no longer needed to initialize
  private loadApiKeyFromStorage(): void {
    // Now we default to the hardcoded API key
    this.apiKey = DEFAULT_GEMINI_API_KEY;
    console.log("GeminiService: Using default API key");
  }
  
  setApiKey(key: string): void {
    if (!key || key.trim() === '') {
      console.error("GeminiService: Attempted to set empty API key");
      return;
    }
    
    this.apiKey = key.trim();
    console.log("GeminiService: API key set manually");
  }
  
  setModel(modelName: string): void {
    this.modelName = modelName;
  }
  
  getConfig(): GeminiConfig | null {
    if (!this.hasApiKey()) return null;
    return {
      apiKey: this.apiKey,
      modelName: this.modelName
    };
  }
  
  hasApiKey(): boolean {
    const hasKey = this.apiKey !== null && 
           this.apiKey !== undefined &&
           this.apiKey !== "YOUR_GEMINI_API_KEY_HERE" && 
           this.apiKey.trim() !== '';
    
    console.log("GeminiService.hasApiKey() ->", hasKey);
    return hasKey;
  }
  
  async testApiKey(key: string): Promise<{ valid: boolean, message: string }> {
    try {
      // Updated to use the v1beta endpoint with the new model name
      const url = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${key}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Hello, please respond with 'API key is valid'." }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API test error:", errorData);
        return { 
          valid: false, 
          message: `API key validation failed: ${errorData.error?.message || 'Unknown error'}` 
        };
      }
      
      return { valid: true, message: "API key is valid" };
    } catch (error) {
      console.error('Error testing Gemini API key:', error);
      return { 
        valid: false, 
        message: error instanceof Error ? error.message : "Unknown error testing API key" 
      };
    }
  }
  
  async analyzeResponses(responses: Record<string, string>): Promise<string> {
    if (!this.hasApiKey()) {
      console.warn("GeminiService: No API key available for analysis");
      return "Enhanced AI analysis is currently unavailable.";
    }
    
    try {
      console.log("GeminiService: Attempting to analyze responses with Gemini");
      // Updated to use the newer model and correct endpoint path
      const url = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Format responses for the prompt
      const formattedResponses = Object.entries(responses)
        .map(([question, answer]) => `Question: ${question}\nResponse: ${answer}`)
        .join('\n\n');
      
      const prompt = `
        You are an expert in cognitive assessments like the Mini-Mental State Examination (MMSE).
        Please analyze the following responses from a cognitive assessment and provide:
        1. A brief analysis of the patient's cognitive state
        2. Areas of concern, if any
        3. Recommendations for follow-up
        
        Patient Responses:
        ${formattedResponses}
        
        The score categorization is as follows:
        - Less than 45%: Severe cognitive impairment
        - 45% to 75%: Moderate cognitive impairment 
        - Above 75%: Normal cognitive function
        
        Format your response as a cohesive clinical analysis. Be specific about patterns observed and provide evidence-based recommendations.
      `;
      
      console.log("GeminiService: Sending request to Gemini API");
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("GeminiService: API error response:", errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("GeminiService: Received successful response from Gemini API");
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('GeminiService: Error analyzing responses with Gemini:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();
