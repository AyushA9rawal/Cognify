
// This is a simple service to integrate with Google's Gemini API

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

// Cache key for localStorage
const GEMINI_API_KEY_STORAGE = 'gemini_api_key';

class GeminiService {
  private apiKey: string = '';
  private modelName: string = 'gemini-pro';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1/models';
  
  constructor() {
    console.log("GeminiService initializing...");
    this.loadApiKeyFromStorage();
  }
  
  private loadApiKeyFromStorage(): void {
    try {
      const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
      if (storedKey && storedKey !== "YOUR_GEMINI_API_KEY_HERE") {
        this.apiKey = storedKey;
        console.log("GeminiService: API key loaded from localStorage");
      } else {
        console.log("GeminiService: No valid API key found in localStorage");
      }
    } catch (e) {
      console.error("Failed to load API key from localStorage:", e);
    }
  }
  
  setApiKey(key: string): void {
    if (!key || key.trim() === '') {
      console.error("GeminiService: Attempted to set empty API key");
      return;
    }
    
    this.apiKey = key.trim();
    try {
      // Save to localStorage for persistence
      localStorage.setItem(GEMINI_API_KEY_STORAGE, this.apiKey);
      console.log("GeminiService: API key set and saved to localStorage");
    } catch (e) {
      console.error("Failed to save API key to localStorage:", e);
    }
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
      const url = `${this.baseUrl}/${this.modelName}:generateContent?key=${key}`;
      
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
      return "To enable enhanced AI analysis, please configure your Gemini API key.";
    }
    
    try {
      console.log("GeminiService: Attempting to analyze responses with Gemini");
      const url = `${this.baseUrl}/${this.modelName}:generateContent?key=${this.apiKey}`;
      
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
