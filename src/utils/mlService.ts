import * as tf from '@tensorflow/tfjs';

interface ModelPrediction {
  severity: string;
  confidence: number;
  categoryScores: Record<string, number>;
}

export interface AnswerFeatures {
  categoryResponses: Record<string, number[]>;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  responseTimeMs: Record<number, number>;
}

class MLService {
  private model: tf.LayersModel | null = null;
  private initialized: boolean = false;
  private loading: boolean = false;
  private vocabMap: Record<string, number> = {};
  
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    if (this.loading) return false;
    
    try {
      this.loading = true;
      console.log('Loading custom MMSE assessment model...');
      
      // Load your custom model here
      // Replace this URL with the path to your model files
      this.model = await tf.loadLayersModel('/models/custom-mmse-model/model.json');
      
      // If your model requires a vocabulary map for text analysis, initialize it here
      this.vocabMap = {
        // Update this with the vocabulary required by your model
        "confused": 1, "oriented": 2, "remember": 3, "forget": 4,
        "know": 5, "unsure": 6, "certain": 7, "clear": 8,
        "unclear": 9, "yes": 10, "no": 11, "maybe": 12
        // Add all required words for your model
      };
      
      this.initialized = true;
      this.loading = false;
      console.log('Custom MMSE assessment model loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load custom MMSE model:', error);
      this.loading = false;
      return false;
    }
  }
  
  private preprocessTextResponse(text: string): number[] {
    // Simple bag-of-words approach for text analysis
    const tokens = text.toLowerCase().split(/\s+/);
    const features = new Array(Object.keys(this.vocabMap).length).fill(0);
    
    tokens.forEach(token => {
      const cleanToken = token.replace(/[^\w]/g, '');
      if (this.vocabMap[cleanToken] !== undefined) {
        features[this.vocabMap[cleanToken] - 1] += 1;
      }
    });
    
    return features;
  }
  
  private extractFeaturesFromAnswers(answers: AnswerFeatures): tf.Tensor {
    // Process all features into a tensor
    const features: number[] = [];
    
    // Add category response features
    Object.values(answers.categoryResponses).forEach(responses => {
      features.push(...responses);
    });
    
    // Add demographic features
    features.push(answers.patientAge / 100); // Normalize age
    features.push(answers.patientGender === 'Male' ? 1 : 0);
    features.push(answers.patientGender === 'Female' ? 1 : 0);
    
    // Add response time features (averaged and normalized)
    const avgResponseTime = Object.values(answers.responseTimeMs).reduce((sum, time) => sum + time, 0) / 
                          Object.values(answers.responseTimeMs).length;
    features.push(Math.min(avgResponseTime / 10000, 1)); // Normalize to 0-1 range, cap at 10 seconds
    
    return tf.tensor2d([features]);
  }
  
  async analyzeMentalState(answers: AnswerFeatures): Promise<ModelPrediction> {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Failed to initialize the ML model');
      }
    }
    
    try {
      // Extract features from answers
      const features = this.extractFeaturesFromAnswers(answers);
      
      // Make prediction with the model
      const rawPrediction = this.model!.predict(features) as tf.Tensor;
      const predictionArray = await rawPrediction.array() as number[][];
      
      // Clean up tensors
      features.dispose();
      rawPrediction.dispose();
      
      // Map prediction to severity categories
      const severityCategories = ['Normal', 'Mild', 'Moderate', 'Severe'];
      const predictionIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
      const confidence = predictionArray[0][predictionIndex];
      
      // Simulated category scores for demonstration
      const categoryScores: Record<string, number> = {
        'Orientation': 0.85 - (predictionIndex * 0.2),
        'Memory': 0.9 - (predictionIndex * 0.25),
        'Attention': 0.8 - (predictionIndex * 0.18),
        'Language': 0.95 - (predictionIndex * 0.22),
        'Visuospatial': 0.75 - (predictionIndex * 0.15)
      };
      
      return {
        severity: severityCategories[predictionIndex],
        confidence: confidence,
        categoryScores
      };
    } catch (error) {
      console.error('Error during mental state analysis:', error);
      throw new Error('Failed to analyze mental state');
    }
  }
  
  // Analyze individual text responses
  analyzeTextResponse(text: string, questionCategory: string): number {
    if (!text.trim()) return 0;
    
    const features = this.preprocessTextResponse(text);
    
    // For demonstration: simple heuristics to score text responses
    // In a real implementation, this would use the ML model
    if (questionCategory === 'Orientation to Time' || questionCategory === 'Orientation to Place') {
      // Check for specific keywords indicating orientation
      if (text.match(/\b(today|now|current|present)\b/i)) return 1;
      if (text.length < 5) return 0;
      return 0.5;
    }
    
    if (questionCategory === 'Registration' || questionCategory === 'Recall') {
      // Check if the response contains the test words
      const testWords = ['apple', 'table', 'penny'];
      const matchCount = testWords.filter(word => text.toLowerCase().includes(word)).length;
      return matchCount / testWords.length;
    }
    
    if (questionCategory === 'Language') {
      // Check for coherence and length
      if (text.split(/\s+/).length >= 5) return 1;
      return 0.5;
    }
    
    // Default scoring based on response length
    return Math.min(text.length / 20, 1);
  }
}

// Singleton instance
export const mlService = new MLService();
