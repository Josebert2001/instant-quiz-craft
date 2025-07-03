export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  timeLimit?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  period: string;
}

export interface QuizSettings {
  topic: string;
  period: string;
  numQuestions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
  questionTypes: string[];
  model: string;
}

export interface UserProgress {
  totalQuizzes: number;
  totalPoints: number;
  streak: number;
  achievements: Achievement[];
  topicMastery: Record<string, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  streak: number;
  avatar?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}