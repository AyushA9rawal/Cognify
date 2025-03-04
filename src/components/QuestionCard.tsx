
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MMSEQuestion } from '@/data/mmseQuestions';

interface QuestionCardProps {
  question: MMSEQuestion;
  onAnswer: (score: number, answer: string) => void;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  className
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const option = question.options?.[optionIndex];
    if (option) {
      onAnswer(option.score, option.text);
    }
  };
  
  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      // For free text answers, defer scoring to parent component
      onAnswer(-1, textAnswer);
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
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
