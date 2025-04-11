
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

// Helper function to check for similarity between strings (allows for minor typos)
const isStringSimilar = (input: string, target: string, allowedDistance = 2): boolean => {
  // Convert both strings to lowercase and trim whitespace
  const str1 = input.toLowerCase().trim();
  const str2 = target.toLowerCase().trim();
  
  // If strings are identical, return true
  if (str1 === str2) return true;
  
  // If difference in length is more than allowed distance, strings are too different
  if (Math.abs(str1.length - str2.length) > allowedDistance) return false;
  
  // Count character differences (very simple Levenshtein distance implementation)
  let differences = 0;
  for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
    if (str1[i] !== str2[i]) differences++;
    if (differences > allowedDistance) return false;
  }
  
  return true;
};

// Helper function to check if any of the target strings match the input with allowed typos
const matchesAnyWithTolerance = (input: string, targets: string[], allowedDistance = 2): boolean => {
  return targets.some(target => isStringSimilar(input, target, allowedDistance));
};

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
      
      // Check common date formats with tolerance for minor errors
      // Format: 1 April 2025 or April 1 2025
      const monthDayYearRegex = new RegExp(`(${day}\\s+${monthName}\\s+${year})|(${monthName}\\s+${day}\\s+${year})|(${day}\\s+${shortMonthName}\\s+${year})|(${shortMonthName}\\s+${day}\\s+${year})`, 'i');
      
      // Format: 01/04/2025 or 1/4/2025 or 01-04-2025 or 1-4-2025
      const numericDateRegex = new RegExp(`(0?${day}[\\/\\-\\.](0?${month})[\\/\\-\\.]${year})|(${year}[\\/\\-\\.](0?${month})[\\/\\-\\.]0?${day})`, 'i');
      
      // Check for variants like "today", "current date", etc.
      const generalDateTerms = ["today", "current date", "today's date", "present day", `${monthName} ${day}`, `${day} ${monthName}`];
      
      return monthDayYearRegex.test(lowerAnswer) || 
             numericDateRegex.test(lowerAnswer) || 
             matchesAnyWithTolerance(lowerAnswer, generalDateTerms);
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
        "waiting room", "physician", "consultation", "outpatient", "inpatient",
        "medical center", "exam room", "doctor's", "assessment room", "testing facility"
      ];
      
      // More flexible matching - check if any valid place term is contained within the answer
      return validPlaces.some(place => lowerAnswer.includes(place));
    },
    expectedAnswers: ["Hospital", "Clinic", "Doctor's office", "Medical facility"]
  },
  
  // Registration
  {
    id: 3,
    category: "Registration",
    text: "Repeat the words: 'apple, table, penny'",
    instructions: "Please say all three words clearly.",
    type: "free-text",
    maxScore: 3,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const targetWords = ["apple", "table", "penny"];
      
      let score = 0;
      targetWords.forEach(word => {
        // Check if the word or similar variation is in the answer
        if (lowerAnswer.includes(word) || 
            matchesAnyWithTolerance(lowerAnswer, [word]) ||
            // Check for word boundaries to avoid partial matches
            new RegExp(`\\b${word}\\b`, 'i').test(lowerAnswer)) {
          score++;
        }
      });
      
      // Return true for full score, the actual score will be calculated in setAnswer
      return score === 3;
    },
    expectedAnswers: ["Apple, table, penny", "Apple table penny"]
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
      // Clean the answer - remove non-numeric characters except for negative sign
      const cleanedAnswer = answer.replace(/[^\d-]/g, '');
      const numAnswer = parseInt(cleanedAnswer);
      
      // Check for exact match or spoken variants
      return numAnswer === 93 || 
             answer.toLowerCase().includes("ninety-three") || 
             answer.toLowerCase().includes("ninety three") ||
             matchesAnyWithTolerance(answer, ["93", "ninety-three", "ninety three"]);
    },
    expectedAnswers: ["93", "Ninety-three", "Ninety three"]
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
      
      return matchesAnyWithTolerance(lowerAnswer, validAnswers, 3);
    },
    expectedAnswers: ["Donald Trump", "Trump", "President Trump"]
  },
  
  // Attention
  {
    id: 6,
    category: "Attention",
    text: "Can you spell 'WORLD' backward?",
    instructions: "Please spell out the letters one by one.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const cleanAnswer = answer.trim().toUpperCase();
      // Allow for potential speech recognition variations
      return cleanAnswer === "DLROW" || 
             answer.toLowerCase().includes("d l r o w") ||
             answer.toLowerCase().includes("d.l.r.o.w") ||
             matchesAnyWithTolerance(cleanAnswer, ["DLROW", "D L R O W", "D-L-R-O-W"], 2);
    },
    expectedAnswers: ["DLROW", "D L R O W", "D-L-R-O-W"]
  },
  
  // Object Recognition
  {
    id: 7,
    category: "Object Recognition",
    text: "What is this object called?",
    instructions: "Identify the object shown in the image.",
    type: "free-text",
    maxScore: 1,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const validAnswers = ["watch", "wristwatch", "timepiece", "clock", "time", "wrist watch"];
      
      return matchesAnyWithTolerance(lowerAnswer, validAnswers, 2);
    },
    expectedAnswers: ["Watch", "Wristwatch", "Clock"],
    image: "/images/custom-watch.jpg" // Remember to add this image to public/images/
  },
  
  // Recall
  {
    id: 8,
    category: "Recall",
    text: "Can you recall the three words I mentioned earlier?",
    instructions: "Try to remember all three words: 'apple, table, penny'.",
    type: "free-text",
    maxScore: 3,
    autoScore: true,
    validationFunction: (answer: string) => {
      const lowerAnswer = answer.toLowerCase().trim();
      const targetWords = ["apple", "table", "penny"];
      
      let score = 0;
      targetWords.forEach(word => {
        // Check if the word or similar variation is in the answer
        if (lowerAnswer.includes(word) || 
            matchesAnyWithTolerance(lowerAnswer, [word]) ||
            new RegExp(`\\b${word}\\b`, 'i').test(lowerAnswer)) {
          score++;
        }
      });
      
      // Full credit requires all 3 words
      return score === 3;
    },
    expectedAnswers: ["Apple, table, penny", "Apple table penny"]
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
      
      // Simple check - sentence must be at least 4 words long for spoken input
      const words = trimmedAnswer.split(/\s+/);
      if (words.length < 3) return false;
      
      // Check for a basic subject-verb pattern (very simplified)
      // This is a very basic heuristic - real NLP would be better
      return true;
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
