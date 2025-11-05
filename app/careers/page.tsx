"use client";

import { useState, useEffect } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQuizAttempts, QuizAttempt, getQuizAnalysis } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import {
  Trophy,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Loader,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

function HistoryContent() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const data = await getQuizAttempts({ limit: 50 });
      // Calculate percentage for each attempt if missing
      const processedData = data.map(attempt => {
        if (attempt.percentage === undefined && attempt.totalQuestions > 0) {
          return {
            ...attempt,
            percentage: (attempt.correctAnswers / attempt.totalQuestions) * 100
          };
        }
        return attempt;
      });
      setAttempts(processedData);
      if (processedData.length > 0) {
        await fetchAttemptDetails(processedData[0]._id);
      }
    } catch (error: any) {
      console.error('Fetch attempts error:', error);
      toast.error('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetails = async (attemptId: string) => {
    setLoadingDetail(true);
    try {
      console.log('=== Fetching attempt details for:', attemptId);

      // Start with the cached attempt from our list (which already has full data from getQuizAttempts)
      let attempt = attempts.find(a => a._id === attemptId);

      if (!attempt) {
        console.log('Attempt not found in cache, fetching fresh...');
        const freshAttempts = await getQuizAttempts({ limit: 100 });
        attempt = freshAttempts.find(a => a._id === attemptId);

        if (!attempt) {
          console.error('Attempt not found even after fresh fetch');
          toast.error('Could not find quiz attempt');
          return;
        }
      }

      console.log('Base attempt data:', {
        id: attempt._id,
        hasQuizData: !!attempt.quizData,
        hasQuestions: !!attempt.quizData?.questions,
        questionCount: attempt.quizData?.questions?.length,
        hasAnswers: !!attempt.answers,
        answerCount: attempt.answers?.length
      });

      // Calculate percentage if missing
      if (attempt.percentage === undefined && attempt.totalQuestions > 0) {
        attempt.percentage = (attempt.correctAnswers / attempt.totalQuestions) * 100;
      }

      // Try to enrich with AI analysis from analytics endpoint
      try {
        console.log('Attempting to fetch AI analysis...');
        const analysisData = await getQuizAnalysis(attemptId);

        // If we got AI analysis, merge it with our base attempt
        if (analysisData.aiAnalysis) {
          console.log('Got AI analysis, merging...');
          attempt = {
            ...attempt,
            aiAnalysis: analysisData.aiAnalysis
          };
        }

        // If analytics endpoint has better data, use it
        if (analysisData.quizData?.questions && analysisData.quizData.questions.length > 0) {
          console.log('Analytics has better quizData, using it');
          attempt.quizData = analysisData.quizData;
        }

        if (analysisData.answers && analysisData.answers.length > 0) {
          console.log('Analytics has better answers, using them');
          attempt.answers = analysisData.answers;
        }
      } catch (analysisError) {
        console.log('Could not fetch AI analysis (using base data only):', analysisError);
        // This is OK - we still have the base attempt data
      }

      console.log('Final attempt data:', {
        hasQuizData: !!attempt.quizData,
        hasQuestions: !!attempt.quizData?.questions,
        questionCount: attempt.quizData?.questions?.length,
        hasAnswers: !!attempt.answers,
        answerCount: attempt.answers?.length,
        hasAiAnalysis: !!attempt.aiAnalysis
      });

      setSelectedAttempt(attempt);
    } catch (error: any) {
      console.error('Fetch attempt details error:', error);
      toast.error('Failed to load attempt details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectAttempt = (attempt: QuizAttempt) => {
    setSelectedAttempt(attempt);
    fetchAttemptDetails(attempt._id);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (percentage >= 60) return <Target className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const formatDate = (dateString: string | undefined | null | Date) => {
    if (!dateString) {
      return 'N/A';
    }
    try {
      // Handle both string and Date objects
      let date: Date;
      if (dateString instanceof Date) {
        date = dateString;
      } else {
        // Try to parse as ISO string first
        date = new Date(dateString);
        // If that fails, try other common formats
        if (isNaN(date.getTime())) {
          // Try with different separators or formats
          const timestamp = Date.parse(dateString);
          if (!isNaN(timestamp)) {
            date = new Date(timestamp);
          } else {
            return 'N/A';
          }
        }
      }
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'N/A';
    }
  };

  const formatDateFull = (dateString: string | undefined | null | Date) => {
    if (!dateString) return 'N/A';
    try {
      // Handle both string and Date objects
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as ISO string or other formats
        const parsed = new Date(dateString.toString());
        if (isNaN(parsed.getTime())) return 'N/A';
        return parsed.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'N/A';
    }
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Loading quiz history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-8 pb-8 max-w-[1216px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz History</h1>
          <p className="text-muted-foreground">
            Review your past quiz attempts and track your progress
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Attempts</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Highest Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.highestScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Questions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalQuestions}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
          {/* Left Side - History List (40%) */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Attempts</h2>
            {attempts.length === 0 ? (
              <Card className="p-8 text-center border">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Quiz Attempts Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start taking quizzes to see your history here
                </p>
              </Card>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {attempts.map((attempt) => (
                  <Card
                    key={attempt._id}
                    className={`p-4 cursor-pointer transition-all border ${
                      selectedAttempt?._id === attempt._id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'hover:border-primary/50 hover:shadow-sm'
                    }`}
                    onClick={() => handleSelectAttempt(attempt)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getScoreColor(attempt.percentage ?? 0)}`}>
                            {(attempt.percentage ?? 0).toFixed(1)}%
                          </span>
                          {getScoreIcon(attempt.percentage ?? 0)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{attempt.correctAnswers}/{attempt.totalQuestions}</span>
                          {(attempt.timeSpent || attempt.timeTaken) && (
                            <>
                              <span>•</span>
                              <span>{Math.floor((attempt.timeSpent || attempt.timeTaken || 0) / 60)}m</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDate(attempt.submittedAt || attempt.createdAt)}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Detail View (60%) */}
          <div>
            {loadingDetail ? (
              <Card className="p-12 border">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">Loading details...</p>
                </div>
              </Card>
            ) : selectedAttempt ? (
              <Card className="p-6 border">
                <div className="space-y-6">
                  {/* Score Header */}
                  <div className="text-center pb-6 border-b">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {getScoreIcon(selectedAttempt.percentage ?? 0)}
                      <span className={`text-5xl font-bold ${getScoreColor(selectedAttempt.percentage ?? 0).split(' ')[0]}`}>
                        {(selectedAttempt.percentage ?? 0).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {selectedAttempt.correctAnswers} out of {selectedAttempt.totalQuestions} questions correct
                    </p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-semibold">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDateFull(selectedAttempt.submittedAt || selectedAttempt.completedAt || selectedAttempt.createdAt)}
                      </p>
                    </div>

                    {selectedAttempt.timeSpent && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Time Taken</p>
                        <p className="text-sm font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {Math.floor(selectedAttempt.timeSpent / 60)} minutes {selectedAttempt.timeSpent % 60} seconds
                        </p>
                      </div>
                    )}
                    {selectedAttempt.timeTaken && !selectedAttempt.timeSpent && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Time Taken</p>
                        <p className="text-sm font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {Math.floor(selectedAttempt.timeTaken / 60)} minutes {selectedAttempt.timeTaken % 60} seconds
                        </p>
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Correct Answers</p>
                      <p className="text-sm font-semibold text-green-600">
                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        {selectedAttempt.correctAnswers}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Incorrect Answers</p>
                      <p className="text-sm font-semibold text-red-600">
                        <XCircle className="w-4 h-4 inline mr-1" />
                        {selectedAttempt.totalQuestions - selectedAttempt.correctAnswers}
                      </p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {selectedAttempt.aiAnalysis && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">AI Analysis</h3>
                      </div>

                      {selectedAttempt.aiAnalysis.overallFeedback && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm text-foreground leading-relaxed">
                            {selectedAttempt.aiAnalysis.overallFeedback}
                          </p>
                        </div>
                      )}

                      {selectedAttempt.aiAnalysis.strengths && selectedAttempt.aiAnalysis.strengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {selectedAttempt.aiAnalysis.strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedAttempt.aiAnalysis.weaknesses && selectedAttempt.aiAnalysis.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Areas for Improvement</h4>
                          <ul className="space-y-1">
                            {selectedAttempt.aiAnalysis.weaknesses.map((weakness, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedAttempt.aiAnalysis.recommendations && selectedAttempt.aiAnalysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {selectedAttempt.aiAnalysis.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question-by-Question Review */}
                  {selectedAttempt.quizData && selectedAttempt.quizData.questions && selectedAttempt.quizData.questions.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Question Review</h3>

                      <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                        {selectedAttempt.quizData.questions.map((question, index) => {
                          const questionId = question._id || `q-${index}`;
                          const userAnswer = selectedAttempt.answers?.find(a => a.questionId === questionId);
                          const isCorrect = userAnswer?.isCorrect || false;
                          const selectedAnswer = userAnswer?.selectedAnswer || '';

                          return (
                            <div
                              key={questionId}
                              className={`border-2 rounded-lg p-4 ${
                                isCorrect
                                  ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10'
                                  : 'border-red-200 bg-red-50/30 dark:bg-red-900/10'
                              }`}
                            >
                              {/* Question Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    Question {index + 1}
                                  </span>
                                </div>
                                {question.difficulty && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                              <p className="text-sm font-medium text-foreground mb-3">{question.questionText}</p>

                              {/* Options */}
                              <div className="space-y-2 mb-3">
                                {question.options.map((option, optIndex) => {
                                  const isUserSelection = option.text === selectedAnswer;
                                  const isCorrectOption = option.isCorrect;

                                  return (
                                    <div
                                      key={optIndex}
                                      className={`p-3 rounded-lg border text-sm ${
                                        isCorrectOption
                                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                          : isUserSelection && !isCorrect
                                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                          : 'border-gray-200 bg-white dark:bg-gray-800'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                          {isCorrectOption ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          ) : isUserSelection && !isCorrect ? (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                          ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                          )}
                                        </div>

                                        {/* Option Letter */}
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                          {String.fromCharCode(65 + optIndex)}.
                                        </span>

                                        {/* Option Text */}
                                        <div className="flex-1">
                                          <p className={`${
                                            isCorrectOption
                                              ? 'text-green-900 dark:text-green-100 font-medium'
                                              : isUserSelection && !isCorrect
                                              ? 'text-red-900 dark:text-red-100'
                                              : 'text-gray-900 dark:text-gray-100'
                                          }`}>
                                            {option.text}
                                          </p>
                                          {isCorrectOption && (
                                            <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                                              ✓ Correct Answer
                                            </span>
                                          )}
                                          {isUserSelection && !isCorrect && (
                                            <span className="text-xs text-red-700 dark:text-red-300 font-medium">
                                              ✗ Your Answer
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
                                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">💡 Explanation</p>
                                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                                    {question.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select an Attempt</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a quiz attempt from the list to view detailed results
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
