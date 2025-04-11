
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MMSEQuestion } from '@/data/mmseQuestions';
import { mlService } from '@/utils/mlService';
import { Watch } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: MMSEQuestion;
  onAnswer: (score: number, answer: string, responseTimeMs: number) => void;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  className
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const timerStart = useRef<number>(Date.now());
  
  // Start timer when question is shown
  useEffect(() => {
    timerStart.current = Date.now();
    setIsTimerActive(true);
    setTextAnswer('');
    setSelectedOption(null);
    
    return () => {
      setIsTimerActive(false);
    };
  }, [question.id]);
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const option = question.options?.[optionIndex];
    const responseTime = Date.now() - timerStart.current;
    
    if (option) {
      onAnswer(option.score, option.text, responseTime);
    }
  };
  
  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      const responseTime = Date.now() - timerStart.current;
      
      // Use custom validation function if available
      let score = -1;
      if (question.validationFunction) {
        score = question.validationFunction(textAnswer) ? question.maxScore : 0;
      } 
      // Fall back to ML service if validation function not available
      else if (question.autoScore) {
        score = mlService.analyzeTextResponse(textAnswer, question.category);
        score = Math.round(score * question.maxScore);
      }
      
      onAnswer(score, textAnswer, responseTime);
    }
  };
  
  const handleVoiceInput = (transcript: string) => {
    setTextAnswer(transcript);
  };
  
  // Convert multiple-choice to text based
  const renderQuestionInput = () => {
    // For all question types, we'll use text input with voice control
    return (
      <div className="space-y-4">
        <Textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          rows={4}
          placeholder="Enter your answer here..."
          className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
        />
        
        <VoiceInput 
          onTranscript={handleVoiceInput}
          isListening={isListening}
          setIsListening={setIsListening}
          placeholder="Click the microphone to speak your answer..."
        />
        
        <Button 
          onClick={handleTextSubmit}
          disabled={!textAnswer.trim()}
          className="btn-primary w-full mt-2"
        >
          Submit Answer
        </Button>
      </div>
    );
  };
  
  return (
    <div 
      className={cn(
        "bg-card-gradient rounded-2xl p-8 shadow-card max-w-2xl w-full mx-auto",
        "border border-border/50 animate-scale-up",
        className
      )}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {question.category}
          </div>
          <h3 className="text-xl font-medium leading-tight">{question.text}</h3>
          {question.instructions && (
            <p className="text-sm text-muted-foreground">{question.instructions}</p>
          )}
        </div>
        
        {/* Display image if available */}
        {question.image || question.category === "Object Recognition" ? (
          <div className="flex justify-center py-4">
            {question.image ? (
              <img 
                src={question.image} 
                alt="Question visual" 
                className="max-h-56 object-contain rounded-lg border border-border/50" 
              />
            ) : (
              <div className="p-6 border border-border/50 rounded-lg bg-primary/5 flex flex-col items-center">
                <Watch size={96} className="text-primary mb-2" />
                <span className="text-sm text-muted-foreground">Wristwatch</span>
              </div>
            )}
          </div>
        ) : null}
        
        <div className="space-y-4 pt-2">
          {renderQuestionInput()}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
