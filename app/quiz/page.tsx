"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Timer } from "@/components/quiz/Timer";
import { Brain, Trophy, Users, Clock, Target, Zap } from "lucide-react";

// Mock quiz data
const AVAILABLE_QUIZZES = [
  {
    id: "intro-101",
    title: "Introduction to Course Fundamentals",
    description: "Test your knowledge on the basics covered in Week 1-2",
    questions: 10,
    duration: 15,
    difficulty: "Easy",
    topic: "Fundamentals",
  },
  {
    id: "advanced-201",
    title: "Advanced Concepts Quiz",
    description: "Challenge yourself with advanced topics from Week 3-4",
    questions: 15,
    duration: 20,
    difficulty: "Medium",
    topic: "Advanced",
  },
  {
    id: "final-prep",
    title: "Final Exam Preparation",
    description: "Comprehensive quiz covering all course materials",
    questions: 30,
    duration: 45,
    difficulty: "Hard",
    topic: "Comprehensive",
  },
];

const MOCK_QUESTIONS = [
  {
    id: "q1",
    question: "What is the primary purpose of the concept discussed in Week 1?",
    options: [
      "To introduce basic terminology",
      "To establish foundational understanding",
      "To prepare for advanced topics",
      "All of the above",
    ],
    correctAnswer: 3,
    topic: "Week 1 Fundamentals",
  },
  {
    id: "q2",
    question: "Which of the following best describes the key principle?",
    options: [
      "It focuses on theoretical concepts only",
      "It emphasizes practical applications",
      "It combines theory and practice",
      "It is purely abstract",
    ],
    correctAnswer: 2,
    topic: "Core Principles",
  },
];

function QuizContent() {
  const router = useRouter();
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: number; correct: boolean }>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [liveCode, setLiveCode] = useState("");
  const { setQuizData } = useQuizStore();

  const handleStartQuiz = (quizId: string) => {
    setActiveQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizComplete(false);

    const quiz = AVAILABLE_QUIZZES.find((q) => q.id === quizId);
    if (quiz) {
      setQuizData({
        questions: MOCK_QUESTIONS,
        duration: quiz.duration * 60,
        currentQuestion: 0,
      });
    }
  };

  const handleAnswer = (questionId: string, selectedIndex: number, isCorrect: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: selectedIndex, correct: isCorrect },
    }));

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    setQuizComplete(true);
  };

  const handleJoinLive = () => {
    if (liveCode.trim()) {
      router.push(`/quiz/live/${liveCode.trim()}`);
    }
  };

  const calculateScore = () => {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const total = MOCK_QUESTIONS.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  // Quiz Selection View
  if (!activeQuiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">CBT Practice & Quizzes</h1>
            <p className="text-muted-foreground mt-2">
              Test your knowledge and prepare for exams with AI-powered quizzes
            </p>
          </div>

          {/* Join Live Quiz */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary rounded-lg">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Join Live Quiz</h2>
                <p className="text-muted-foreground mb-4">
                  Enter a quiz code to join a live competition with other students
                </p>
                <div className="flex gap-2 max-w-md">
                  <Input
                    placeholder="Enter quiz code (e.g., ABC123)"
                    value={liveCode}
                    onChange={(e) => setLiveCode(e.target.value.toUpperCase())}
                    className="uppercase"
                  />
                  <Button onClick={handleJoinLive} disabled={!liveCode.trim()}>
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Available Quizzes */}
          <div>
            <h2 className="text-xl font-bold mb-4">Practice Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVAILABLE_QUIZZES.map((quiz) => (
                <Card key={quiz.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Brain className="w-8 h-8 text-primary" />
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          quiz.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : quiz.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      <span>{quiz.topic}</span>
                    </div>
                  </div>

                  <Button onClick={() => handleStartQuiz(quiz.id)} className="w-full">
                    Start Quiz
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Quiz Complete View
  if (quizComplete) {
    const { correct, total, percentage } = calculateScore();
    const currentQuiz = AVAILABLE_QUIZZES.find((q) => q.id === activeQuiz);

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-20 h-20 mx-auto text-primary mb-4" />
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-muted-foreground">
                Great job completing {currentQuiz?.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-sm text-muted-foreground mt-1">Score</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold">
                  {correct}/{total}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Correct</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold">{total - correct}</p>
                <p className="text-sm text-muted-foreground mt-1">Incorrect</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/report")} size="lg">
                View Detailed Report
              </Button>
              <Button onClick={() => setActiveQuiz(null)} variant="outline" size="lg">
                Take Another Quiz
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Active Quiz View
  const currentQuiz = AVAILABLE_QUIZZES.find((q) => q.id === activeQuiz);
  const question = MOCK_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentQuiz?.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
            </span>
            <span>Topic: {currentQuiz?.topic}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Timer duration={currentQuiz?.duration ? currentQuiz.duration * 60 : 900} onTimeUp={handleTimeUp} />
          <QuizCard question={question} onAnswer={handleAnswer} />
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}
