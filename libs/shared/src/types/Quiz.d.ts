/**
 * Represents a quiz.
 */
type Quiz = {
  quizId: string;
  title: string;
  description: string;
  questionId?: string;
};  

export type QuizListItem = Omit<Quiz, 'questionId'> & {
  id: string;
  title: string;
  description: string;
  owner: string;
};

/**
 * Represents the form data for creating or editing a quiz.
 */
export type QuizForm = Omit<Quiz, 'questions'> & {
  question: string;
  alternatives: QuizAlternative[];
};


/**
 * Handles the state of a quiz, including its questions and current question.
 */
export type QuizState = Quiz & {
  id: string;
  questionId: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  current?: boolean;
  alternatives: QuizAlternative[];
};
export type QuizAlternative = {
  id: string;
  alternative: string;
  isCorrect: boolean;
};  
export type QuizCreateForm = {
  title: string;
  description: string;
  questions: QuizCreateQuestion[];
};

export type QuizCreateQuestion = {
  question: string;
  current?: boolean;
  alternatives: QuizCreateAlternative[];
};

export type QuizCreateAlternative = {
  id: string;
  text: string;
  isCorrect: boolean;
};