
// This is a simple service to integrate with Google's Gemini API

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

// *** PUT YOUR API KEY RIGHT HERE ***
// Replace "YOUR_GEMINI_API_KEY_HERE" with your actual Gemini API key
const GEMINI_KEY = "YOUR_GEMINI_API_KEY_HERE";

class GeminiService {
  private apiKey: string = GEMINI_KEY;
  private modelName: string = 'gemini-pro';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1/models';
  
  constructor() {
    // If no key is hardcoded, try to get API key from localStorage if previously saved
    if (!this.apiKey || this.apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
      }
    }
    console.log("GeminiService initialized with API key:", this.hasApiKey() ? "Valid key present" : "No valid key");
  }
  
  setApiKey(key: string): void {
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem('gemini_api_key', key);
    console.log("API key set successfully");
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
    return this.apiKey !== null && 
           this.apiKey !== "YOUR_GEMINI_API_KEY_HERE" && 
           this.apiKey.trim() !== '';
  }
  
  async analyzeResponses(responses: Record<string, string>): Promise<string> {
    if (!this.hasApiKey()) {
      console.log("No Gemini API key available for analysis");
      return "To enable enhanced AI analysis, please configure your Gemini API key.";
    }
    
    try {
      console.log("Attempting to analyze responses with Gemini");
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
      `;
      
      console.log("Sending request to Gemini API");
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
        console.error("Gemini API error response:", errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("Received successful response from Gemini API");
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error analyzing responses with Gemini:', error);
      return "Could not generate enhanced analysis. Using standard assessment results instead.";
    }
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();
