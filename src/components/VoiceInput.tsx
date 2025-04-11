
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening,
  setIsListening,
  placeholder = "Click the microphone to speak..."
}) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        console.log('Transcript received:', transcriptText);
        setTranscript(transcriptText);
        
        // If result is final, send it back
        if (result.isFinal) {
          onTranscript(transcriptText);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setError('Speech recognition is not supported in this browser.');
      console.error('Speech recognition not supported');
    }
    
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        if (isListening) {
          recognition.stop();
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="relative w-full">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <p className="p-3 border border-border rounded-lg bg-background min-h-[80px] text-sm">
              {transcript || placeholder}
            </p>
          </div>
          <Button
            type="button"
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className="flex-shrink-0"
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>
        {isListening && (
          <div className="absolute right-14 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default VoiceInput;
