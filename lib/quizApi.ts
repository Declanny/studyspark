import { api } from './api';

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
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
    questionId: string;
    selectedAnswer: string;
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
  submittedAt?: string;
  timeTaken?: number;
  timeSpent?: number;
  createdAt?: string;
  quizData?: Quiz; // Full quiz data including questions
}

export interface GenerateQuizRequest {
  topic: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount?: number;
  includeExplanations?: boolean;
}

/**
 * Generate quiz questions using AI (without saving to database)
 */
export async function generateQuizQuestions(data: GenerateQuizRequest): Promise<Question[]> {
  const response = await api.post('/quiz/questions/generate', data);
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
 * Create a personal quiz with AI-generated questions
 * Backend now generates questions automatically using Groq AI
 */
export async function createPersonalQuiz(data: {
  topic: string;
  course?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberQuestions: number;
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
 * Get a specific quiz by ID (works for both personal and live quizzes)
 */
export async function getQuiz(quizId: string): Promise<Quiz> {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data.quiz;
}

/**
 * Save quiz progress without submitting
 */
export async function saveQuizProgress(
  quizId: string,
  answers: Array<{ questionId: string; selectedAnswer: string; timeSpent?: number }>
): Promise<{ attemptId: string }> {
  const response = await api.post(`/quiz/${quizId}/save`, { answers });
  return response.data;
}

/**
 * Submit quiz answers
 */
export async function submitQuizAnswers(
  quizId: string,
  answers: Array<{ questionId: string; selectedAnswer: string; timeSpent?: number }>,
  timeSpent?: number
): Promise<{ attemptId: string }> {
  const response = await api.post(`/quiz/${quizId}/submit`, { answers, timeSpent });
  return { attemptId: response.data.attemptId };
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
  const response = await api.get(`/analytics/quiz/${attemptId}/analysis`);
  return response.data.attempt;
}

/**
 * Delete a quiz
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  await api.delete(`/quiz/${quizId}`);
}
