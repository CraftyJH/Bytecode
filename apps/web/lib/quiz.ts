export type QuizType =
  | "multiple_choice"
  | "fill_in_blank"
  | "predict_output"
  | "find_the_bug"
  | "order_the_steps";

interface QuizBase {
  id: string;
  type: QuizType;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
}

export interface MultipleChoiceQuiz extends QuizBase {
  type: "multiple_choice";
  question: string;
  options: Array<{ text: string; correct: boolean; feedback?: string }>;
}

export interface FillInBlankQuiz extends QuizBase {
  type: "fill_in_blank";
  prompt: string;
  code?: string;
  correctAnswers: string[];
  caseSensitive?: boolean;
}

export interface PredictOutputQuiz extends QuizBase {
  type: "predict_output";
  code: string;
  expectedOutput: string;
}

export interface FindTheBugQuiz extends QuizBase {
  type: "find_the_bug";
  code: string;
  buggyLine: number; // 1-indexed
  issue: string;
}

export interface OrderTheStepsQuiz extends QuizBase {
  type: "order_the_steps";
  prompt: string;
  items: Array<{ id: string; text: string }>;
  correctOrder: string[];
}

export type QuizItem =
  | MultipleChoiceQuiz
  | FillInBlankQuiz
  | PredictOutputQuiz
  | FindTheBugQuiz
  | OrderTheStepsQuiz;
