"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQuizAttempts, QuizAttempt } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import {
  Trophy,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowLeft,
  BarChart3,
  Loader
} from 'lucide-react';
import Link from 'next/link';

function QuizAttemptsContent() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'personal' | 'live'>('all');

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const data = await getQuizAttempts({ limit: 50 });
      setAttempts(data);
    } catch (error: any) {
      console.error('Fetch attempts error:', error);
      toast.error('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-5 h-5" />;
    if (percentage >= 60) return <Target className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const calculateStats = () => {
    if (attempts.length === 0) return null;

    const totalAttempts = attempts.length;
    const avgScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts;
    const highestScore = Math.max(...attempts.map(a => a.percentage));
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);

    return {
      totalAttempts,
      avgScore: avgScore.toFixed(1),
      highestScore,
      totalQuestions
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading quiz history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/quiz"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Quiz Center</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
          <p className="text-gray-600">
            Review your past quiz attempts and track your progress
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                </div>
                <Target className="w-10 h-10 text-blue-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Highest Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.highestScore}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Questions Answered</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Quizzes
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'personal'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'live'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Live
          </button>
        </div>

        {/* Attempts List */}
        {attempts.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Attempts Yet</h3>
            <p className="text-gray-600 mb-6">
              Start taking quizzes to see your history and progress here
            </p>
            <Button onClick={() => router.push('/quiz/generate')}>
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <Card
                key={attempt._id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/quiz/result/${attempt._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quiz Attempt
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{attempt.correctAnswers} / {attempt.totalQuestions} correct</span>
                      </div>

                      {attempt.timeTaken && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(attempt.timeTaken / 60)} minutes</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {attempt.aiAnalysis && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {attempt.aiAnalysis.overallFeedback}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end">
                    {getScoreIcon(attempt.percentage)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/quiz/result/${attempt._id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function QuizAttemptsPage() {
  return (
    <ProtectedRoute>
      <QuizAttemptsContent />
    </ProtectedRoute>
  );
}
