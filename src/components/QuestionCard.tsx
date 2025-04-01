
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MMSEQuestion } from '@/data/mmseQuestions';
import { mlService } from '@/utils/mlService';
import { Watch } from 'lucide-react';

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
  const timerStart = useRef<number>(Date.now());
  
  // Start timer when question is shown
  useEffect(() => {
    timerStart.current = Date.now();
    setIsTimerActive(true);
    
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
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border border-border/50 transition-all",
                    "hover:border-primary/30 hover:bg-primary/5",
                    selectedOption === index ? "border-primary bg-primary/10" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                      selectedOption === index 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {question.type === 'free-text' && (
            <div className="space-y-3">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={4}
                placeholder="Enter your answer here..."
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              />
              <button 
                onClick={handleTextSubmit}
                disabled={!textAnswer.trim()}
                className="btn-primary w-full mt-2"
              >
                Submit Answer
              </button>
            </div>
          )}
          
          {question.type === 'drawing' && (
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4 bg-white aspect-square flex items-center justify-center">
                <p className="text-muted-foreground">Drawing interface would be implemented here</p>
              </div>
              <button 
                onClick={() => {
                  const responseTime = Date.now() - timerStart.current;
                  onAnswer(0, "Drawing submission", responseTime);
                }}
                className="btn-primary w-full mt-2"
              >
                Submit Drawing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
