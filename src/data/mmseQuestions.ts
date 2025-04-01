
export interface MMSEOption {
  text: string;
  score: number;
}

export interface MMSEQuestion {
  id: number;
  category: string;
  text: string;
  instructions?: string;
  type: 'multiple-choice' | 'free-text' | 'drawing';
  options?: MMSEOption[];
  maxScore: number;
  autoScore?: boolean; // Indicates if this question should be auto-scored by ML
  expectedAnswers?: string[]; // Expected answers for automatic evaluation
  validationFunction?: (answer: string) => boolean; // Custom validation function
  image?: string; // Optional image to display with the question
}

export const mmseQuestions: MMSEQuestion[] = [
  // Orientation to Time
  {
    id: 1,
    category: "Orientation to Time",
    text: "What is today's date?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      // Get today's date
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1; // 0-indexed
      const monthName = today.toLocaleString('default', { month: 'long' }).toLowerCase();
      const shortMonthName = today.toLocaleString('default', { month: 'short' }).toLowerCase().replace('.', '');
      const year = today.getFullYear();
      
      // Convert answer to lowercase for case-insensitive matching
      const lowerAnswer = answer.toLowerCase().trim();
      
      // Check common date formats
      // Format: 1 April 2025 or April 1 2025
      const monthDayYearRegex = new RegExp(`(${day}\\s+${monthName}\\s+${year})|(${monthName}\\s+${day}\\s+${year})|(${day}\\s+${shortMonthName}\\s+${year})|(${shortMonthName}\\s+${day}\\s+${year})`, 'i');
      
      // Format: 01/04/2025 or 1/4/2025 or 01-04-2025 or 1-4-2025
      const numericDateRegex = new RegExp(`(0?${day}[\\/\\-\\.](0?${month})[\\/\\-\\.]${year})|(${year}[\\/\\-\\.](0?${month})[\\/\\-\\.]0?${day})`, 'i');
      
      return monthDayYearRegex.test(lowerAnswer) || numericDateRegex.test(lowerAnswer);
    }
  },
  
  // Orientation to Place
  {
    id: 2,
    category: "Orientation to Place",
    text: "Where are you right now?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const validPlaces = [
        "hospital", "clinic", "doctor", "office", "medical", "healthcare", 
        "health center", "examination room", "emergency room", "er", 
        "waiting room", "physician", "consultation", "outpatient", "inpatient"
      ];
      
      return validPlaces.some(place => lowerAnswer.includes(place));
    },
    expectedAnswers: ["Hospital", "Clinic", "Doctor's office", "Medical facility"]
  },
  
  // Registration
  {
    id: 3,
    category: "Registration",
    text: "Can you repeat the words: 'apple, table, penny'?",
    instructions: "Score based on first attempt.",
    type: "multiple-choice",
    options: [
      { text: "All 3 words repeated correctly", score: 3 },
      { text: "2 words repeated correctly", score: 2 },
      { text: "1 word repeated correctly", score: 1 },
      { text: "0 words repeated correctly", score: 0 }
    ],
    maxScore: 3
  },
  
  // Calculation
  {
    id: 4,
    category: "Calculation",
    text: "What is 100 minus 7?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const numAnswer = parseInt(answer.trim());
      return numAnswer === 93;
    },
    expectedAnswers: ["93"]
  },
  
  // Current Events
  {
    id: 5,
    category: "Current Events",
    text: "What is the name of the current President?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const validAnswers = ["donald trump", "trump", "donald j trump", "donald john trump", "president trump"];
      
      return validAnswers.some(validAnswer => lowerAnswer.includes(validAnswer));
    },
    expectedAnswers: ["Donald Trump", "Trump"]
  },
  
  // Attention
  {
    id: 6,
    category: "Attention",
    text: "Can you spell 'WORLD' backward?",
    instructions: "Enter the patient's response. The correct answer is 'DLROW'.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const cleanAnswer = answer.trim().toUpperCase();
      return cleanAnswer === "DLROW";
    },
    expectedAnswers: ["DLROW", "dlrow"]
  },
  
  // Object Recognition
  {
    id: 7,
    category: "Object Recognition",
    text: "What is this object called?",
    instructions: "Show the patient a picture of a watch.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const validAnswers = ["watch", "wristwatch", "timepiece", "clock"];
      
      return validAnswers.some(validAnswer => lowerAnswer.includes(validAnswer));
    },
    expectedAnswers: ["Watch", "Wristwatch", "Clock"],
    image: "/images/custom-watch.jpg" // Remember to add this image to public/images/
  },
  
  // Recall
  {
    id: 8,
    category: "Recall",
    text: "Can you recall the three words I mentioned earlier?",
    instructions: "The patient should recall 'apple, table, penny'.",
    type: "multiple-choice",
    options: [
      { text: "All 3 words recalled correctly", score: 3 },
      { text: "2 words recalled correctly", score: 2 },
      { text: "1 word recalled correctly", score: 1 },
      { text: "0 words recalled correctly", score: 0 }
    ],
    maxScore: 3
  },
  
  // Language
  {
    id: 9,
    category: "Language",
    text: "Can you write a complete sentence?",
    instructions: "The sentence should contain a subject and a verb and make sense.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      if (!answer || answer.trim().length < 3) return false;
      
      const trimmedAnswer = answer.trim();
      // Check if the sentence has basic structure (at least one space indicating multiple words)
      if (!trimmedAnswer.includes(' ')) return false;
      
      // Check if sentence has a capital letter at the beginning and punctuation at the end
      const startsWithCapital = /^[A-Z]/.test(trimmedAnswer);
      const endsWithPunctuation = /[.!?]$/.test(trimmedAnswer);
      
      // Check for a basic subject-verb structure
      // This is simplified - a real implementation would use NLP
      const words = trimmedAnswer.split(/\s+/);
      const hasSubjectAndVerb = words.length >= 2;
      
      return hasSubjectAndVerb && (startsWithCapital || endsWithPunctuation);
    }
  }
];

export const getMaxPossibleScore = (): number => {
  return mmseQuestions.reduce((total, question) => total + question.maxScore, 0);
};

export const getQuestionById = (id: number): MMSEQuestion | undefined => {
  return mmseQuestions.find(q => q.id === id);
};

export const getCategoryScores = (answers: Record<number, number>): Record<string, { score: number, maxScore: number }> => {
  const categoryScores: Record<string, { score: number, maxScore: number }> = {};
  
  mmseQuestions.forEach(question => {
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { score: 0, maxScore: 0 };
    }
    
    categoryScores[question.category].maxScore += question.maxScore;
    if (answers[question.id] !== undefined) {
      categoryScores[question.category].score += answers[question.id];
    }
  });
  
  return categoryScores;
};

export const interpretMMSEScore = (score: number): {
  severity: string;
  interpretation: string;
  color: string;
} => {
  // Updated scoring thresholds as requested
  const percentScore = (score / getMaxPossibleScore()) * 100;
  
  if (percentScore >= 75) {
    return {
      severity: "Normal",
      interpretation: "No cognitive impairment detected.",
      color: "text-green-600"
    };
  } else if (percentScore >= 45) {
    return {
      severity: "Moderate",
      interpretation: "Moderate cognitive impairment detected. Further evaluation is recommended.",
      color: "text-orange-600"
    };
  } else {
    return {
      severity: "Severe",
      interpretation: "Severe cognitive impairment detected. Comprehensive evaluation is strongly recommended.",
      color: "text-red-600"
    };
  }
};
