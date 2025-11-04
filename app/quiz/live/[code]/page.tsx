"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Timer } from "@/components/quiz/Timer";
import { Leaderboard, LeaderboardEntry } from "@/components/quiz/Leaderboard";
import { Users, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
// import { io, Socket } from "socket.io-client";

// Mock data for demonstration
const MOCK_QUIZ = {
  id: "live-001",
  title: "Live Quiz: Advanced Concepts",
  questions: [
    {
      id: "q1",
      text: "What is the correct approach to this problem?",
      options: [
        "Option A: Using method one",
        "Option B: Using method two",
        "Option C: Combining both methods",
        "Option D: Using a different approach",
      ],
      correctAnswer: 2,
    },
    {
      id: "q2",
      text: "Which statement is most accurate?",
      options: [
        "Statement A is always true",
        "Statement B applies in most cases",
        "Both A and B are contextual",
        "Neither A nor B is correct",
      ],
      correctAnswer: 2,
    },
  ],
  duration: 10 * 60, // 10 minutes
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Chisom Okafor",
    score: 850,
    correctAnswers: 8,
    totalQuestions: 10,
    timeTaken: 420,
  },
  {
    id: "2",
    name: "Tunde Adebayo",
    score: 780,
    correctAnswers: 7,
    totalQuestions: 10,
    timeTaken: 480,
  },
  {
    id: "3",
    name: "Amara Nwosu",
    score: 720,
    correctAnswers: 7,
    totalQuestions: 10,
    timeTaken: 510,
  },
];

function LiveQuizContent() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const quizCode = params.code as string;

  const [isConnected, setIsConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: number; correct: boolean }>>({});
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [participants] = useState(12);
  const [quizComplete, setQuizComplete] = useState(false);

  // Socket.io connection (commented for now)
  // useEffect(() => {
  //   const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001");

  //   socket.on("connect", () => {
  //     setIsConnected(true);
  //     socket.emit("join-quiz", { code: quizCode, userId: user?.id });
  //   });

  //   socket.on("disconnect", () => {
  //     setIsConnected(false);
  //   });

  //   socket.on("leaderboard-update", (data) => {
  //     setLeaderboard(data);
  //   });

  //   socket.on("participant-count", (count) => {
  //     setParticipants(count);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [quizCode, user?.id]);

  // Simulate connection for demo
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const connectTimer = setTimeout(() => setIsConnected(true), 0);

    // Simulate live updates
    const interval = setInterval(() => {
      setLeaderboard((prev) =>
        prev.map((entry) => ({
          ...entry,
          score: entry.score + Math.floor(Math.random() * 50),
        })).sort((a, b) => b.score - a.score)
      );
    }, 5000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, []);

  const handleAnswer = (questionId: string, selectedIndex: number, isCorrect: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: selectedIndex, correct: isCorrect },
    }));

    // Simulate sending to server
    // socket.emit("submit-answer", { questionId, selectedIndex, isCorrect });

    setTimeout(() => {
      if (currentQuestion < MOCK_QUIZ.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    setQuizComplete(true);
  };

  const calculateScore = () => {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const total = MOCK_QUIZ.questions.length;
    return { correct, total };
  };

  // Update leaderboard with current user
  const updatedLeaderboard = [...leaderboard];
  if (user && !updatedLeaderboard.find((e) => e.id === user.id)) {
    const { correct, total } = calculateScore();
    updatedLeaderboard.push({
      id: user.id,
      name: user.name,
      score: correct * 100,
      correctAnswers: correct,
      totalQuestions: total,
      timeTaken: 300,
      isCurrentUser: true,
    });
    updatedLeaderboard.sort((a, b) => b.score - a.score);
  }

  if (quizComplete) {
    const { correct, total } = calculateScore();
    const userRank = updatedLeaderboard.findIndex((e) => e.id === user?.id) + 1;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="p-8 text-center mb-6">
            <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold text-primary">#{userRank}</p>
                <p className="text-sm text-muted-foreground mt-1">Your Rank</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold">
                  {correct}/{total}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Correct</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold">{participants}</p>
                <p className="text-sm text-muted-foreground mt-1">Participants</p>
              </div>
            </div>
            <Button onClick={() => router.push("/quiz")} size="lg">
              Back to Quizzes
            </Button>
          </Card>

          <Leaderboard entries={updatedLeaderboard} isLive={false} />
        </main>
      </div>
    );
  }

  const question = MOCK_QUIZ.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{MOCK_QUIZ.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span className="font-medium">{participants} participants</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isConnected ? "text-green-600" : "text-red-600"}`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {MOCK_QUIZ.questions.length}
            </span>
            <span className="px-3 py-1 bg-primary/10 rounded-full font-medium">
              Code: {quizCode}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Area */}
          <div className="lg:col-span-2 space-y-6">
            <Timer duration={MOCK_QUIZ.duration} onTimeUp={handleTimeUp} />
            <QuizCard question={question} onAnswer={handleAnswer} />
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard entries={updatedLeaderboard} isLive={true} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LiveQuizPage() {
  return (
    <ProtectedRoute>
      <LiveQuizContent />
    </ProtectedRoute>
  );
}
