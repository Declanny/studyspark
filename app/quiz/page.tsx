"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  Keyboard,
  Play,
  HelpCircle,
  Zap,
  Clock,
  BarChart3,
  History,
  Target,
  TrendingUp,
  TrendingDown,
  Loader
} from "lucide-react";
import { getQuizAttempts, QuizAttempt } from "@/lib/quizApi";
import { toast } from "react-hot-toast";

function QuizHubContent() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [activeTab, setActiveTab] = useState("practice");
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getQuizAttempts({ limit: 10 });
      setAttempts(data);
    } catch (error: any) {
      console.error('Fetch history error:', error);
      toast.error('Failed to load quiz history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-4 h-4" />;
    if (percentage >= 60) return <Target className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const handleJoin = () => {
    if (joinCode.trim()) {
      router.push(`/quiz/join?code=${joinCode.trim()}`);
    } else {
      router.push("/quiz/join");
    }
  };

  const practiceQuizzes = [
    {
      title: "Introduction to Course Fundamentals",
      description: "Test your knowledge on the basics covered in Week 1-2",
      questions: 10,
      difficulty: "Fundamentals",
      time: "10 minutes",
      gradient: "from-green-500 to-emerald-500",
      href: "/quiz/personal"
    },
    {
      title: "Advanced Concepts Quiz",
      description: "Challenge yourself with advanced topics from Week 3-4",
      questions: 10,
      difficulty: "Advanced",
      time: "20 minutes",
      gradient: "from-orange-500 to-amber-500",
      href: "/quiz/personal"
    },
    {
      title: "Final Exam Preparation",
      description: "Comprehensive quiz covering all course materials",
      questions: 10,
      difficulty: "Comprehensive",
      time: "45 minutes",
      gradient: "from-red-500 to-pink-500",
      href: "/quiz/personal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-8 pb-8 max-w-[1216px]">
        {/* Join Live Quiz Hero Section */}
        <div className="mb-12">
          <Card 
            className="overflow-hidden border-0 shadow-2xl w-full flex"
            style={{
              height: '350px',
              borderRadius: '32px',
              backgroundColor: '#9654F4',
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`
              }}
            />
            
            <div className="relative grid md:grid-cols-2 h-full w-full">
              {/* Left Side - Content */}
              <div className="space-y-6 z-10 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Join Live Quiz
                </h1>
                <p className="text-white/90 text-lg">
                  Enter a quiz code to join a live competition with other students
                </p>
                
                {/* Input Field */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <Keyboard className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleJoin();
                        }
                      }}
                      placeholder="Enter Quiz Code or Link"
                      className="pl-20 pr-4 py-6 text-base bg-white/95 border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <Button
                    onClick={handleJoin}
                    className="px-8 py-6 bg-white text-purple-600 hover:bg-white/90 rounded-xl shadow-lg font-semibold text-base hover:scale-105 transition-transform"
                  >
                    Join
                  </Button>
                </div>
              </div>

              {/* Right Side - Illustrations */}
              <div className="relative hidden md:block h-full w-full z-10 overflow-hidden">
                <img 
                  src="/Frame 126.png" 
                  alt="Quiz hero illustration" 
                  className="absolute inset-0 h-full w-full"
                  style={{ 
                    height: '350px',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: 'right center'
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="practice">Practice Quizzes</TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {practiceQuizzes.map((quiz, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => router.push(quiz.href)}
                >
                  {/* Header */}
                  <div className={`h-16 bg-gradient-to-br ${quiz.gradient}`} />

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{quiz.questions} Questions</span>
                      <span>•</span>
                      <span>{quiz.difficulty}</span>
                      <span>•</span>
                      <span>{quiz.time}</span>
                    </div>

                    {/* Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(quiz.href);
                      }}
                    >
                      <Play className="mr-2 h-3.5 w-3.5" />
                      Start Quiz
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {loadingHistory ? (
              <Card className="p-12">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Loading quiz history...</p>
                </div>
              </Card>
            ) : attempts.length === 0 ? (
              <Card className="p-6">
                <div className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Quiz History</h3>
                  <p className="text-muted-foreground mb-6">
                    Start taking quizzes to see your history and progress here
                  </p>
                  <Button onClick={() => router.push('/quiz/generate')}>
                    Create Your First Quiz
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <Card
                    key={attempt._id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer border"
                    onClick={() => router.push(`/quiz/result/${attempt._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            Quiz Attempt
                          </h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(attempt.percentage)}`}>
                            {attempt.percentage.toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{attempt.correctAnswers} / {attempt.totalQuestions} correct</span>
                          </div>
                          {attempt.timeTaken && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{Math.floor(attempt.timeTaken / 60)}m</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        {getScoreIcon(attempt.percentage)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/quiz/result/${attempt._id}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/quiz/attempts')}
                  >
                    View Full History
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function QuizHubPage() {
  return (
    <ProtectedRoute>
      <QuizHubContent />
    </ProtectedRoute>
  );
}
