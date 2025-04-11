
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MMSEQuestion } from '@/data/mmseQuestions';
import { mlService } from '@/utils/mlService';
import { Watch } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { Textarea } from '@/components/ui/textarea';
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
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerStart = useRef<number>(Date.now());
  
  // Start timer when question is shown
  useEffect(() => {
    timerStart.current = Date.now();
    setIsTimerActive(true);
    setTextAnswer('');
    setIsSubmitted(false);
    
    return () => {
      setIsTimerActive(false);
    };
  }, [question.id]);
  
  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      const responseTime = Date.now() - timerStart.current;
      
      // Use -1 as a marker for answers that need to be evaluated
      // The actual scoring will happen in the ExaminationContext
      let score = -1;
      
      onAnswer(score, textAnswer, responseTime);
      setIsSubmitted(true);
    }
  };
  
  const handleVoiceInput = (transcript: string) => {
    setTextAnswer(transcript);
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
              disabled={!textAnswer.trim() || isSubmitted}
              className="btn-primary w-full mt-2"
            >
              {isSubmitted ? "Answer Submitted" : "Submit Answer"}
            </Button>
          </div>
          
          {question.expectedAnswers && question.expectedAnswers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p className="font-medium">Expected response format:</p>
              <p>{question.expectedAnswers.join(' or ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
