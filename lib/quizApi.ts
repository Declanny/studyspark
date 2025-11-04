import { api } from './api';

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  type: 'personal' | 'live';
  code?: string;
  topic?: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isLive: boolean;
  questions: Question[];
  timeLimit?: number;
  createdBy: string;
  createdAt: string;
  participants?: Array<{
    userId: string;
    joinedAt: Date;
    status: string;
  }>;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  user: string;
  answers: Array<{
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }>;
  score: number;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    overallFeedback: string;
    performanceLevel: string;
  };
  completedAt: string;
  timeTaken?: number;
}

export interface GenerateQuizRequest {
  topic: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  includeExplanations?: boolean;
}

/**
 * Generate quiz questions using AI
 */
export async function generateQuizQuestions(data: GenerateQuizRequest): Promise<Question[]> {
  const response = await api.post('/quiz/generate', data);
  return response.data.questions;
}

/**
 * Create a live quiz
 */
export async function createLiveQuiz(data: {
  title: string;
  topic: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: Question[];
  timeLimit?: number;
}): Promise<Quiz> {
  const response = await api.post('/quiz/live/create', data);
  return response.data.quiz;
}

/**
 * Start a live quiz
 */
export async function startLiveQuiz(quizId: string): Promise<Quiz> {
  const response = await api.post(`/quiz/live/${quizId}/start`);
  return response.data.quiz;
}

/**
 * End a live quiz
 */
export async function endLiveQuiz(quizId: string): Promise<void> {
  await api.post(`/quiz/live/${quizId}/end`);
}

/**
 * Join a live quiz using code
 */
export async function joinLiveQuiz(code: string): Promise<Quiz> {
  const response = await api.post('/quiz/live/join', { code });
  return response.data.quiz;
}

/**
 * Get live quiz by ID
 */
export async function getLiveQuiz(quizId: string): Promise<Quiz> {
  const response = await api.get(`/quiz/live/${quizId}`);
  return response.data.quiz;
}

/**
 * Create a personal quiz
 */
export async function createPersonalQuiz(data: {
  title: string;
  topic: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: Question[];
}): Promise<Quiz> {
  const response = await api.post('/quiz/personal/create', data);
  return response.data.quiz;
}

/**
 * Get all personal quizzes
 */
export async function getPersonalQuizzes(): Promise<Quiz[]> {
  const response = await api.get('/quiz/personal');
  return response.data.quizzes;
}

/**
 * Get a specific personal quiz
 */
export async function getPersonalQuiz(quizId: string): Promise<Quiz> {
  const response = await api.get(`/quiz/personal/${quizId}`);
  return response.data.quiz;
}

/**
 * Submit quiz answers
 */
export async function submitQuizAnswers(
  quizId: string,
  answers: Array<{ questionIndex: number; selectedOption: number }>
): Promise<QuizAttempt> {
  const response = await api.post(`/quiz/${quizId}/submit`, { answers });
  return response.data.attempt;
}

/**
 * Get quiz attempts
 */
export async function getQuizAttempts(filters?: {
  quizId?: string;
  limit?: number;
}): Promise<QuizAttempt[]> {
  const params = new URLSearchParams();
  if (filters?.quizId) params.append('quizId', filters.quizId);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/quiz/attempts?${params.toString()}`);
  return response.data.attempts;
}

/**
 * Get quiz analysis with AI insights
 */
export async function getQuizAnalysis(attemptId: string): Promise<QuizAttempt> {
  const response = await api.get(`/quiz/attempt/${attemptId}/analysis`);
  return response.data.attempt;
}

/**
 * Delete a quiz
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  await api.delete(`/quiz/${quizId}`);
}
