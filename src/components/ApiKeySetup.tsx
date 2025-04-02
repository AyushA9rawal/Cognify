
import React, { useState, useEffect } from 'react';
import { geminiService } from '@/utils/geminiService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApiKeySetupProps {
  onApiKeySet?: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if there's already a key stored
    const storedKey = localStorage.getItem('gemini_api_key');
    setHasStoredKey(!!storedKey && storedKey.trim() !== '');
  }, []);
  
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
        description: "API key saved successfully. The enhanced analysis will now be available."
      });
      setHasStoredKey(true);
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
  
  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setHasStoredKey(false);
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed"
    });
  };
  
  return (
    <div className="bg-card-gradient rounded-2xl p-6 shadow-card border border-border/50">
      <h3 className="text-xl font-medium mb-4">Gemini API Configuration</h3>
      
      {hasStoredKey ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A Gemini API key is currently saved and will be used for enhanced analysis.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setHasStoredKey(false)}
              className="flex-1"
            >
              Update Key
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearKey}
              className="flex-1"
            >
              Remove Key
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium">
              Gemini API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                type={isVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full pr-10"
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
          
          <Button
            type="submit"
            className="w-full"
          >
            Save API Key
          </Button>
        </form>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Don't have a Gemini API key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a>.
        </p>
      </div>
      
      <div className="mt-4 bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Troubleshooting</h4>
        <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1 list-disc pl-4 space-y-1">
          <li>Make sure your API key is valid and correctly entered</li>
          <li>Check the browser console for any API errors</li>
          <li>Ensure your Gemini API key has access to the 'gemini-pro' model</li>
          <li>Try clearing your browser cache if issues persist</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeySetup;
