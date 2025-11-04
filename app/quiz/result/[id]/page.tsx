"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Target, Lightbulb, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getQuizAnalysis, QuizAttempt } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const data = await getQuizAnalysis(attemptId);
      setAttempt(data);
    } catch (error: any) {
      console.error('Fetch result error:', error);
      toast.error('Failed to load quiz result');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Result not found</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50';
    if (percentage >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getPerformanceBorder = (percentage: number) => {
    if (percentage >= 80) return 'border-green-200';
    if (percentage >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
        </div>

        {/* Score Card */}
        <div className={`bg-white rounded-lg shadow-lg border-2 p-8 mb-6 ${getPerformanceBorder(attempt.percentage)}`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${getPerformanceBg(attempt.percentage)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getPerformanceColor(attempt.percentage)}`}>
                  {attempt.percentage.toFixed(1)}%
                </div>
                <div className={`text-2xl font-bold ${getPerformanceColor(attempt.percentage)}`}>
                  {getGrade(attempt.percentage)}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {attempt.percentage >= 80 ? 'Excellent Work!' : attempt.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600">
              You scored {attempt.correctAnswers} out of {attempt.totalQuestions} questions correctly
            </p>

            {attempt.timeTaken && (
              <p className="text-sm text-gray-500 mt-2">
                Completed in {Math.floor(attempt.timeTaken / 60)} minutes {attempt.timeTaken % 60} seconds
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Score</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{attempt.score}</p>
            <p className="text-sm text-gray-600">out of {attempt.totalQuestions}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{attempt.percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">correct answers</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Performance</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{attempt.aiAnalysis?.performanceLevel || 'Good'}</p>
            <p className="text-sm text-gray-600">level</p>
          </div>
        </div>

        {/* AI Analysis */}
        {attempt.aiAnalysis && (
          <div className="space-y-6">
            {/* Overall Feedback */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {attempt.aiAnalysis.overallFeedback}
              </p>
            </div>

            {/* Strengths */}
            {attempt.aiAnalysis.strengths && attempt.aiAnalysis.strengths.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {attempt.aiAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {attempt.aiAnalysis.weaknesses && attempt.aiAnalysis.weaknesses.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {attempt.aiAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-600 mt-1">!</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {attempt.aiAnalysis.recommendations && attempt.aiAnalysis.recommendations.length > 0 && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Study Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {attempt.aiAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span className="text-blue-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/quiz/generate"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Another Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
