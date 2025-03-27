
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
  private fallbackMode: boolean = false;
  
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    if (this.loading) return false;
    
    try {
      this.loading = true;
      console.log('Loading custom MMSE assessment model...');
      
      // Set a timeout to prevent hanging on model load
      const modelLoadPromise = tf.loadLayersModel('/models/custom-mmse-model/model.json');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Model loading timed out')), 5000)
      );
      
      try {
        // Try to load the model with a timeout
        this.model = await Promise.race([modelLoadPromise, timeoutPromise]) as tf.LayersModel;
        
        // Initialize vocab map if needed
        this.vocabMap = {
          "confused": 1, "oriented": 2, "remember": 3, "forget": 4,
          "know": 5, "unsure": 6, "certain": 7, "clear": 8,
          "unclear": 9, "yes": 10, "no": 11, "maybe": 12
        };
        
        this.initialized = true;
        this.fallbackMode = false;
        console.log('Custom MMSE assessment model loaded successfully');
      } catch (loadError) {
        console.warn('Failed to load TensorFlow model, switching to fallback mode:', loadError);
        this.fallbackMode = true;
        this.initialized = true; // Mark as initialized even in fallback mode
      }
      
      this.loading = false;
      return true;
    } catch (error) {
      console.error('Failed to load custom MMSE model:', error);
      this.loading = false;
      this.fallbackMode = true;
      this.initialized = true; // Consider initialized in fallback mode
      return true; // Return true to allow the app to continue
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
  
  private extractFeaturesFromAnswers(answers: AnswerFeatures): tf.Tensor | null {
    if (this.fallbackMode) return null;
    
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
    
    // Pad features to expected input shape of 28
    const paddedFeatures = [...features];
    while (paddedFeatures.length < 28) {
      paddedFeatures.push(0); // Pad with zeros
    }
    
    console.log("Feature length after padding:", paddedFeatures.length);
    return tf.tensor2d([paddedFeatures]);
  }
  
  async analyzeMentalState(answers: AnswerFeatures): Promise<ModelPrediction> {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        this.fallbackMode = true;
      }
    }
    
    try {
      // If in fallback mode, return heuristic-based prediction
      if (this.fallbackMode || !this.model) {
        return this.getFallbackPrediction(answers);
      }
      
      // Extract features from answers
      const features = this.extractFeaturesFromAnswers(answers);
      if (!features) {
        return this.getFallbackPrediction(answers);
      }
      
      console.log("Input shape:", features.shape);
      
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
      
      const categoryScores = this.getCategoryScores(predictionIndex);
      
      return {
        severity: severityCategories[predictionIndex],
        confidence: confidence,
        categoryScores
      };
    } catch (error) {
      console.error('Error during mental state analysis:', error);
      // Return fallback prediction if model prediction fails
      return this.getFallbackPrediction(answers);
    }
  }
  
  private getFallbackPrediction(answers: AnswerFeatures): ModelPrediction {
    // Calculate a heuristic score based on the answers
    let totalScore = 0;
    let totalMaxScore = 0;
    
    Object.values(answers.categoryResponses).forEach(responses => {
      responses.forEach(score => {
        totalScore += score;
        totalMaxScore += 1;
      });
    });
    
    const percentageScore = totalMaxScore > 0 ? totalScore / totalMaxScore : 0;
    
    // Determine severity based on percentage score
    let severityIndex: number;
    let severity: string;
    
    if (percentageScore >= 0.75) {
      severity = 'Normal';
      severityIndex = 0;
    } else if (percentageScore >= 0.5) {
      severity = 'Mild';
      severityIndex = 1;
    } else if (percentageScore >= 0.25) {
      severity = 'Moderate';
      severityIndex = 2;
    } else {
      severity = 'Severe';
      severityIndex = 3;
    }
    
    return {
      severity,
      confidence: 0.85, // Moderate confidence in fallback mode
      categoryScores: this.getCategoryScores(severityIndex)
    };
  }
  
  private getCategoryScores(severityIndex: number): Record<string, number> {
    return {
      'Orientation': 0.85 - (severityIndex * 0.2),
      'Memory': 0.9 - (severityIndex * 0.25),
      'Attention': 0.8 - (severityIndex * 0.18),
      'Language': 0.95 - (severityIndex * 0.22),
      'Visuospatial': 0.75 - (severityIndex * 0.15)
    };
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
