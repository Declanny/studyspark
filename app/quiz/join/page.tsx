"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, LogIn, Loader } from 'lucide-react';
import Link from 'next/link';
import { joinLiveQuiz } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';

function JoinQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  const [joinCode, setJoinCode] = useState(codeFromUrl || '');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Auto-join if code is in URL
    if (codeFromUrl) {
      handleJoin();
    }
  }, []);

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    setIsJoining(true);

    try {
      const quiz = await joinLiveQuiz(joinCode.trim().toUpperCase());

      if (!quiz.isLive) {
        toast.error('This quiz has not started yet. Please wait for the host to start it.');
        setIsJoining(false);
        return;
      }

      toast.success('Joined quiz successfully!');
      router.push(`/quiz/take/${quiz._id}`);
    } catch (error: any) {
      console.error('Join error:', error);
      toast.error(error.response?.data?.error || 'Failed to join quiz. Please check the code.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isJoining) {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Live Quiz</h1>
            <p className="text-gray-600">
              Enter the code provided by your instructor
            </p>
          </div>

          {/* Join Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Code
              </label>
              <input
                type="text"
                id="code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="ABC123"
                maxLength={6}
                disabled={isJoining}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-character code
              </p>
            </div>

            <button
              onClick={handleJoin}
              disabled={isJoining || !joinCode.trim()}
              className={`
                w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all
                ${isJoining || !joinCode.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isJoining ? (
                <>
                  <Loader className="h-6 w-6 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  <span>Join Quiz</span>
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Need help?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure you have the correct 6-character code</li>
              <li>• Wait for your instructor to start the quiz</li>
              <li>• Check your internet connection</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have a code?{' '}
          <Link href="/quiz/personal" className="text-blue-600 hover:underline">
            Take a personal quiz instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function JoinQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <JoinQuizContent />
    </Suspense>
  );
}
