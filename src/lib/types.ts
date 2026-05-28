export type Difficulty = "easy" | "medium" | "hard" | "trap";

export const CATEGORIES = [
  "Service Value System",
  "Service Value Chain",
  "Guiding Principles",
  "Practices",
  "Incident vs Problem vs Change",
  "Governance",
  "Continual Improvement",
  "Utility vs Warranty",
  "Service Relationships",
  "General Concepts",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Question {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  wrongExplanations: string[]; // length 3, matches non-correct choices in order
  trapExplanation: string;
  difficulty: Difficulty;
  category: Category;
}

export type ExamMode =
  | "practice"
  | "real"
  | "ultra"
  | "scenario"
  | "weakness"
  | "timed"
  | "quick"
  | "full";

export interface ExamConfig {
  mode: ExamMode;
  count: number;
  durationSec?: number;
  showFeedback: boolean; // immediate feedback after each Q
  difficultyMix: Partial<Record<Difficulty, number>>;
  categories?: Category[];
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number | null;
  correct: boolean;
  marked: boolean;
  timeMs: number;
}

export interface ExamSession {
  id: string;
  startedAt: number;
  finishedAt?: number;
  config: ExamConfig;
  // store the *shuffled* choice order per question so review/results match
  questions: Array<{
    q: Question;
    choiceOrder: number[]; // permutation of [0..3]; choiceOrder[displayIdx] = originalIdx
  }>;
  answers: AnswerRecord[];
  currentIndex: number;
  remainingSec?: number;
}

export interface ExamResultSummary {
  id: string;
  date: number;
  mode: ExamMode;
  total: number;
  correct: number;
  scorePct: number;
  passed: boolean;
  categoryStats: Record<string, { correct: number; total: number }>;
  difficultyStats: Record<string, { correct: number; total: number }>;
  durationSec: number;
}

export interface UserProgress {
  history: ExamResultSummary[];
  weakTopics: Record<string, number>; // category -> wrong count
  strongTopics: Record<string, number>;
  incorrectQuestionIds: string[];
  streak: number;
  lastExamDate: number | null;
  achievements: string[];
  confidence: number; // 0-100
  readinessScore: number; // 0-100
  totalAnswered: number;
  totalCorrect: number;
}

export const PASS_PCT = 65; // PeopleCert ITIL 4 Foundation pass mark
