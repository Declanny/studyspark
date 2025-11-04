import { create } from "zustand";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic: string;
}

interface QuizState {
  currentQuiz: {
    id: string;
    title: string;
    questions: Question[];
  } | null;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  score: number | null;
  timeRemaining: number;
  isLive: boolean;
  liveCode: string | null;
  leaderboard: Array<{ name: string; score: number; rank: number }>;
  startQuiz: (quiz: QuizState["currentQuiz"]) => void;
  setQuizData: (data: { questions: Question[]; duration: number; currentQuestion: number }) => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  setLiveMode: (isLive: boolean, code?: string) => void;
  updateLeaderboard: (leaderboard: QuizState["leaderboard"]) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  score: null,
  timeRemaining: 0,
  isLive: false,
  liveCode: null,
  leaderboard: [],
  startQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      answers: {},
      score: null,
      timeRemaining: quiz ? quiz.questions.length * 60 : 0, // 1 min per question
    }),
  setQuizData: (data) =>
    set({
      timeRemaining: data.duration,
      currentQuestionIndex: data.currentQuestion,
    }),
  answerQuestion: (questionId, answerIndex) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerIndex },
    })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        (state.currentQuiz?.questions.length || 1) - 1
      ),
    })),
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  submitQuiz: () => {
    const state = get();
    if (!state.currentQuiz) return;

    let correctCount = 0;
    state.currentQuiz.questions.forEach((q) => {
      if (state.answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = state.currentQuiz.questions.length;
    const calculatedScore = (correctCount / totalQuestions) * 100;

    set({ score: calculatedScore });
  },
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setLiveMode: (isLive, code) => set({ isLive, liveCode: code }),
  updateLeaderboard: (leaderboard) => set({ leaderboard }),
  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: {},
      score: null,
      timeRemaining: 0,
      isLive: false,
      liveCode: null,
      leaderboard: [],
    }),
}));

