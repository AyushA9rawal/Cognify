
export interface MMSEOption {
  text: string;
  score: number;
}

export interface MMSEQuestion {
  id: number;
  category: string;
  text: string;
  instructions?: string;
  type: 'multiple-choice' | 'free-text';
  options?: MMSEOption[];
  maxScore: number;
}

export const mmseQuestions: MMSEQuestion[] = [
  // Orientation to Time - 5 points
  {
    id: 1,
    category: "Orientation to Time",
    text: "What year is it now?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 2,
    category: "Orientation to Time",
    text: "What season is it?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 3,
    category: "Orientation to Time",
    text: "What month is it?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 4,
    category: "Orientation to Time",
    text: "What is today's date?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 5,
    category: "Orientation to Time",
    text: "What day of the week is it?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },

  // Orientation to Place - 5 points
  {
    id: 6,
    category: "Orientation to Place",
    text: "What country are we in?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 7,
    category: "Orientation to Place",
    text: "What state/province are we in?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 8,
    category: "Orientation to Place",
    text: "What city/town are we in?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 9,
    category: "Orientation to Place",
    text: "What is the name of this building/hospital/clinic?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },
  {
    id: 10,
    category: "Orientation to Place",
    text: "What floor are we on?",
    type: "multiple-choice",
    options: [
      { text: "Correct", score: 1 },
      { text: "Incorrect", score: 0 }
    ],
    maxScore: 1
  },

  // Registration - 3 points
  {
    id: 11,
    category: "Registration",
    text: "Remember these three words: APPLE, TABLE, PENNY.",
    instructions: "Ask the patient if they can repeat the words. Score one point for each word correctly repeated on this first attempt. Then repeat the words until all three are learned (up to 6 trials).",
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
    text: "Serial 7s: Count backwards from 100 by subtracting 7 each time.",
    instructions: "Score one point for each correct subtraction up to 5 points. Stop after 5 subtractions.",
    type: "multiple-choice",
    options: [
      { text: "All 5 calculations correct (93, 86, 79, 72, 65)", score: 5 },
      { text: "4 calculations correct", score: 4 },
      { text: "3 calculations correct", score: 3 },
      { text: "2 calculations correct", score: 2 },
      { text: "1 calculation correct", score: 1 },
      { text: "0 calculations correct", score: 0 }
    ],
    maxScore: 5
  },

  // Recall - 3 points
  {
    id: 13,
    category: "Recall",
    text: "Recall the three words I asked you to remember earlier.",
    instructions: "Score one point for each word correctly recalled.",
    type: "multiple-choice",
    options: [
      { text: "All 3 words recalled correctly", score: 3 },
      { text: "2 words recalled correctly", score: 2 },
      { text: "1 word recalled correctly", score: 1 },
      { text: "0 words recalled correctly", score: 0 }
    ],
    maxScore: 3
  },

  // Language - 2 points
  {
    id: 14,
    category: "Language",
    text: "Name these objects:",
    instructions: "Point to a watch and a pencil. Score one point for each item correctly named.",
    type: "multiple-choice",
    options: [
      { text: "Both objects named correctly", score: 2 },
      { text: "1 object named correctly", score: 1 },
      { text: "0 objects named correctly", score: 0 }
    ],
    maxScore: 2
  },

  // Language - 1 point
  {
    id: 15,
    category: "Language",
    text: "Repeat the following phrase: 'No ifs, ands, or buts.'",
    type: "multiple-choice",
    options: [
      { text: "Phrase repeated correctly", score: 1 },
      { text: "Phrase not repeated correctly", score: 0 }
    ],
    maxScore: 1
  },

  // Language - 3 points
  {
    id: 16,
    category: "Language",
    text: "Follow a 3-stage command: 'Take this paper in your right hand, fold it in half, and put it on the floor.'",
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
    instructions: "Show the patient the written instruction.",
    type: "multiple-choice",
    options: [
      { text: "Command obeyed correctly", score: 1 },
      { text: "Command not obeyed correctly", score: 0 }
    ],
    maxScore: 1
  },

  // Language - 1 point
  {
    id: 18,
    category: "Language",
    text: "Write a sentence.",
    instructions: "The sentence must contain a subject and a verb and make sense. Spelling, grammar, and punctuation are not important.",
    type: "free-text",
    maxScore: 1
  },

  // Visuospatial - 1 point
  {
    id: 19,
    category: "Visuospatial",
    text: "Copy this design (two intersecting pentagons).",
    instructions: "All 10 angles must be present and the two figures must intersect to score 1 point.",
    type: "multiple-choice",
    options: [
      { text: "Design copied correctly", score: 1 },
      { text: "Design not copied correctly", score: 0 }
    ],
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
