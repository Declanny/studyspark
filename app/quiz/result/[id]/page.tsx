"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Target, Lightbulb, Award, BarChart3, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getQuizAnalysis, QuizAttempt, Question } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';

type FilterType = 'all' | 'correct' | 'incorrect';

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      console.log('Fetching quiz analysis for attemptId:', attemptId);
      const data = await getQuizAnalysis(attemptId);
      console.log('Quiz analysis data received:', data);
      console.log('Quiz data:', data.quizData);
      console.log('Answers:', data.answers);
      setAttempt(data);
    } catch (error) {
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

  if (!attempt || !attempt.quizData) {
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

  // Build a map of question answers for easy lookup
  const answerMap = new Map<string, { selectedAnswer: string; isCorrect: boolean }>();
  attempt.answers.forEach(answer => {
    answerMap.set(answer.questionId, {
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect
    });
  });

  // Filter questions based on selected filter
  const filteredQuestions = attempt.quizData!.questions.filter((question, index) => {
    const questionId = question._id || `q-${index}`;
    const answer = answerMap.get(questionId);

    if (filter === 'correct') return answer?.isCorrect === true;
    if (filter === 'incorrect') return answer?.isCorrect === false;
    return true; // 'all'
  });

  const circumference = 2 * Math.PI * 54;
  const progressOffset = circumference - (attempt.percentage / 100) * circumference;

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
          <p className="text-gray-600 mt-1">{attempt.quizData!.title}</p>
        </div>

        {/* Score Card with Circular Progress */}
        <div className={`bg-white rounded-lg shadow-lg border-2 p-8 mb-6 ${getPerformanceBorder(attempt.percentage)}`}>
          <div className="text-center">
            {/* Circular Progress Indicator */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="transform -rotate-90 w-32 h-32">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  className={
                    attempt.percentage >= 80
                      ? 'text-green-500'
                      : attempt.percentage >= 60
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(attempt.percentage)}`}>
                  {attempt.percentage.toFixed(0)}%
                </div>
                <div className={`text-xl font-semibold ${getPerformanceColor(attempt.percentage)}`}>
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
            <p className="text-3xl font-bold text-gray-900">{attempt.correctAnswers}</p>
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
            <p className="text-3xl font-bold text-gray-900 capitalize">
              {attempt.aiAnalysis?.performanceLevel || 'Good'}
            </p>
            <p className="text-sm text-gray-600">level</p>
          </div>
        </div>

        {/* AI Analysis */}
        {attempt.aiAnalysis && (
          <div className="space-y-6 mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
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
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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
                      <span className="text-blue-600 mt-1 font-bold">→</span>
                      <span className="text-blue-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Question-by-Question Review */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Questions ({attempt.quizData!.questions.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'correct'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Correct ({attempt.correctAnswers})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'incorrect'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Incorrect ({attempt.totalQuestions - attempt.correctAnswers})
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No questions match the selected filter.
              </p>
            ) : (
              filteredQuestions.map((question, index) => {
                const questionId = question._id || `q-${index}`;
                const userAnswer = answerMap.get(questionId);
                const isCorrect = userAnswer?.isCorrect || false;
                const selectedAnswer = userAnswer?.selectedAnswer || '';

                return (
                  <div
                    key={questionId}
                    className={`border-2 rounded-lg p-6 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50/30'
                        : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                          )}
                          <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Question {(attempt.quizData?.questions.indexOf(question) ?? -1) + 1}
                        </h4>
                      </div>
                      {question.difficulty && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <p className="text-gray-900 font-medium mb-4">{question.questionText}</p>

                    {/* Options */}
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, optIndex) => {
                        const isUserSelection = option.text === selectedAnswer;
                        const isCorrectOption = option.isCorrect;

                        return (
                          <div
                            key={optIndex}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isCorrectOption
                                ? 'border-green-500 bg-green-50'
                                : isUserSelection && !isCorrect
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Icon */}
                              <div className="flex-shrink-0 mt-0.5">
                                {isCorrectOption ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : isUserSelection && !isCorrect ? (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                )}
                              </div>

                              {/* Option Letter */}
                              <span className="font-semibold text-gray-700 mr-2">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>

                              {/* Option Text */}
                              <div className="flex-1">
                                <p className={`${
                                  isCorrectOption
                                    ? 'text-green-900 font-medium'
                                    : isUserSelection && !isCorrect
                                    ? 'text-red-900'
                                    : 'text-gray-900'
                                }`}>
                                  {option.text}
                                </p>
                                {isCorrectOption && (
                                  <span className="text-sm text-green-700 font-medium">
                                    Correct Answer
                                  </span>
                                )}
                                {isUserSelection && !isCorrect && (
                                  <span className="text-sm text-red-700 font-medium">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-blue-900 mb-1">Explanation</p>
                            <p className="text-blue-800 text-sm leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
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
