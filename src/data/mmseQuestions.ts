
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
}

export const mmseQuestions: MMSEQuestion[] = [
  // Orientation to Time - 5 points
  {
    id: 1,
    category: "Orientation to Time",
    text: "What year is it now?",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    expectedAnswers: [new Date().getFullYear().toString()]
  },
  {
    id: 2,
    category: "Orientation to Time",
    text: "What season is it?",
    type: "multiple-choice",
    options: [
      { text: "Spring", score: 1 },
      { text: "Summer", score: 1 },
      { text: "Fall/Autumn", score: 1 },
      { text: "Winter", score: 1 },
      { text: "Don't know", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 3,
    category: "Orientation to Time",
    text: "What month is it?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 4,
    category: "Orientation to Time",
    text: "What is today's date?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 5,
    category: "Orientation to Time",
    text: "What day of the week is it?",
    type: "multiple-choice",
    options: [
      { text: "Monday", score: 1 },
      { text: "Tuesday", score: 1 },
      { text: "Wednesday", score: 1 },
      { text: "Thursday", score: 1 },
      { text: "Friday", score: 1 },
      { text: "Saturday", score: 1 },
      { text: "Sunday", score: 1 },
      { text: "Don't know", score: 0 }
    ],
    maxScore: 1
  },

  // Orientation to Place - 5 points
  {
    id: 6,
    category: "Orientation to Place",
    text: "What country are we in?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 7,
    category: "Orientation to Place",
    text: "What state/province are we in?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 8,
    category: "Orientation to Place",
    text: "What city/town are we in?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 9,
    category: "Orientation to Place",
    text: "What is the name of this building/hospital/clinic?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },
  {
    id: 10,
    category: "Orientation to Place",
    text: "What floor are we on?",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },

  // Registration - 3 points
  {
    id: 11,
    category: "Registration",
    text: "Remember these three words: APPLE, TABLE, PENNY.",
    instructions: "Ask the patient to repeat the words. Score based on first attempt. Then repeat the words until all three are learned (up to 6 trials).",
    type: "multiple-choice",
    options: [
      { text: "All 3 words repeated correctly", score: 3 },
      { text: "2 words repeated correctly", score: 2 },
      { text: "1 word repeated correctly", score: 1 },
      { text: "0 words repeated correctly", score: 0 }
    ],
    maxScore: 3
  },

  // Attention and Calculation - 5 points
  {
    id: 12,
    category: "Attention and Calculation",
    text: "Serial 7s: Count backwards from 100 by subtracting 7 each time (provide five answers).",
    instructions: "Enter the five numbers the patient gives, separated by commas (e.g., 93, 86, 79, 72, 65)",
    type: "free-text",
    maxScore: 5,
    autoScore: true,
    expectedAnswers: ["93, 86, 79, 72, 65"]
  },

  // Recall - 3 points
  {
    id: 13,
    category: "Recall",
    text: "Recall the three words I asked you to remember earlier.",
    instructions: "Enter the words the patient recalls, separated by commas.",
    type: "free-text",
    maxScore: 3,
    autoScore: true,
    expectedAnswers: ["apple, table, penny", "apple,table,penny"]
  },

  // Language - 2 points
  {
    id: 14,
    category: "Language",
    text: "Name these objects:",
    instructions: "Show a watch and a pencil. Enter the names provided by the patient, separated by commas.",
    type: "free-text",
    maxScore: 2,
    autoScore: true,
    expectedAnswers: ["watch, pencil", "watch,pencil"]
  },

  // Language - 1 point
  {
    id: 15,
    category: "Language",
    text: "Repeat the following phrase: 'No ifs, ands, or buts.'",
    instructions: "Enter exactly what the patient says.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    expectedAnswers: ["no ifs, ands, or buts", "no ifs ands or buts"]
  },

  // Language - 3 points
  {
    id: 16,
    category: "Language",
    text: "Follow a 3-stage command: 'Take this paper in your right hand, fold it in half, and put it on the floor.'",
    instructions: "Check which actions were completed correctly.",
    type: "multiple-choice",
    options: [
      { text: "All 3 commands performed correctly", score: 3 },
      { text: "2 commands performed correctly", score: 2 },
      { text: "1 command performed correctly", score: 1 },
      { text: "0 commands performed correctly", score: 0 }
    ],
    maxScore: 3
  },

  // Language - 1 point
  {
    id: 17,
    category: "Language",
    text: "Read and obey the following: 'CLOSE YOUR EYES'",
    instructions: "Show the patient the written instruction and observe their response.",
    type: "multiple-choice",
    options: [
      { text: "Closes eyes", score: 1 },
      { text: "Does not close eyes", score: 0 }
    ],
    maxScore: 1
  },

  // Language - 1 point
  {
    id: 18,
    category: "Language",
    text: "Write a sentence.",
    instructions: "Ask the patient to write a sentence. The sentence must contain a subject and a verb and make sense.",
    type: "free-text",
    maxScore: 1,
    autoScore: true
  },

  // Visuospatial - 1 point
  {
    id: 19,
    category: "Visuospatial",
    text: "Copy this design (two intersecting pentagons).",
    instructions: "Ask the patient to copy the design. All 10 angles must be present and the two figures must intersect.",
    type: "drawing",
    maxScore: 1
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
  if (score >= 24) {
    return {
      severity: "Normal",
      interpretation: "No cognitive impairment detected.",
      color: "text-green-600"
    };
  } else if (score >= 19) {
    return {
      severity: "Mild",
      interpretation: "Mild cognitive impairment detected.",
      color: "text-yellow-600"
    };
  } else if (score >= 10) {
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
