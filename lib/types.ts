export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  point?: number | null;
  isCorrectUserAnswer?: boolean | null;
  userSelectedAnswer?: string | null;
}

export interface Quizz {
  title: string;
  icon: string;
  questions: Question[];
}
