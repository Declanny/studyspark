"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Play, Square, Copy, CheckCircle, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import { getLiveQuiz, startLiveQuiz, endLiveQuiz, Quiz } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function LiveQuizAdminPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    fetchQuiz();
    // Poll for updates every 5 seconds when live
    const interval = setInterval(() => {
      if (quiz?.isLive) {
        fetchQuiz();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [quizId, quiz?.isLive]);

  const fetchQuiz = async () => {
    try {
      const data = await getLiveQuiz(quizId);
      setQuiz(data);
    } catch (error: any) {
      console.error('Fetch quiz error:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!confirm('Start this quiz? Participants will be able to begin answering.')) {
      return;
    }

    setIsStarting(true);
    try {
      const updated = await startLiveQuiz(quizId);
      setQuiz(updated);
      toast.success('Quiz started!');
    } catch (error: any) {
      console.error('Start quiz error:', error);
      toast.error(error.response?.data?.error || 'Failed to start quiz');
    } finally {
      setIsStarting(false);
    }
  };

  const handleEnd = async () => {
    if (!confirm('End this quiz? Participants will no longer be able to answer.')) {
      return;
    }

    setIsEnding(true);
    try {
      await endLiveQuiz(quizId);
      toast.success('Quiz ended!');
      router.push(`/quiz/results/${quizId}`);
    } catch (error: any) {
      console.error('End quiz error:', error);
      toast.error(error.response?.data?.error || 'Failed to end quiz');
    } finally {
      setIsEnding(false);
    }
  };

  const copyJoinCode = () => {
    if (quiz?.code) {
      navigator.clipboard.writeText(quiz.code);
      toast.success('Join code copied!');
    }
  };

  const copyJoinLink = () => {
    const link = `${window.location.origin}/quiz/join?code=${quiz?.code}`;
    navigator.clipboard.writeText(link);
    toast.success('Join link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Quiz not found</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>{quiz.topic}</span>
                {quiz.subject && (
                  <>
                    <span>•</span>
                    <span>{quiz.subject}</span>
                  </>
                )}
                <span>•</span>
                <span className="capitalize">{quiz.difficulty}</span>
                <span>•</span>
                <span>{quiz.questions.length} questions</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full font-medium ${
              quiz.isLive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {quiz.isLive ? '🟢 Live' : '⚪ Not Started'}
            </div>
          </div>
        </div>

        {/* Join Code Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-6">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Join Code</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-5xl font-bold tracking-widest">{quiz.code}</div>
              <button
                onClick={copyJoinCode}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Copy code"
              >
                <Copy className="h-6 w-6" />
              </button>
            </div>
            <button
              onClick={copyJoinLink}
              className="text-sm underline hover:no-underline"
            >
              Copy join link
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quiz.participants?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <BarChart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{quiz.questions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Controls</h3>
          <div className="flex items-center space-x-4">
            {!quiz.isLive ? (
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>{isStarting ? 'Starting...' : 'Start Quiz'}</span>
              </button>
            ) : (
              <button
                onClick={handleEnd}
                disabled={isEnding}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Square className="h-5 w-5" />
                <span>{isEnding ? 'Ending...' : 'End Quiz'}</span>
              </button>
            )}

            <Link
              href={`/quiz/results/${quizId}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>

          {quiz.participants && quiz.participants.length > 0 ? (
            <div className="space-y-2">
              {quiz.participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Participant {index + 1}</p>
                      <p className="text-sm text-gray-600">
                        Joined {formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    participant.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : participant.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {participant.status === 'completed' && <CheckCircle className="inline h-4 w-4 mr-1" />}
                    {participant.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">No participants yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Share the join code with students to get started
              </p>
            </div>
          )}
        </div>

        {/* Questions Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions Preview</h3>
          <div className="space-y-4">
            {quiz.questions.slice(0, 3).map((question, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">
                  {index + 1}. {question.questionText}
                </p>
                <div className="space-y-1">
                  {question.options.map((option, optIndex) => (
                    <p
                      key={optIndex}
                      className={`text-sm ${
                        optIndex === question.correctAnswer
                          ? 'text-green-600 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {quiz.questions.length > 3 && (
              <p className="text-sm text-gray-600 text-center">
                ... and {quiz.questions.length - 3} more questions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
