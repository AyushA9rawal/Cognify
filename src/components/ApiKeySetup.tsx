
import React, { useState } from 'react';
import { geminiService } from '@/utils/geminiService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet?: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    
    try {
      geminiService.setApiKey(apiKey.trim());
      toast({
        title: "Success",
        description: "API key saved successfully"
      });
      if (onApiKeySet) onApiKeySet();
      setApiKey('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="bg-card-gradient rounded-2xl p-6 shadow-card border border-border/50">
      <h3 className="text-xl font-medium mb-4">Gemini API Configuration</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block text-sm font-medium">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        
        <button
          type="submit"
          className="btn-primary px-4 py-2 rounded-lg w-full"
        >
          Save API Key
        </button>
      </form>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Don't have a Gemini API key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySetup;
