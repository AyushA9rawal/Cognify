
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
    autoScore: true
  },
  
  // Orientation to Place
  {
    id: 2,
    category: "Orientation to Place",
    text: "Where are you right now?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    expectedAnswers: ["Hospital", "Clinic", "Doctor's office"]
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
    expectedAnswers: ["93"]
  },
  
  // Current Events
  {
    id: 5,
    category: "Current Events",
    text: "What is the name of the current President?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
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
    expectedAnswers: ["Watch", "Wristwatch", "Clock"],
    image: "/images/custom-watch.jpg" // UPDATE THIS PATH to your custom watch image
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
    autoScore: true
  }
  
  // Visuospatial question (pentagon) has been removed as requested
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
