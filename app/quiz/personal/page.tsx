"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Play, Trash2, Clock, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { getPersonalQuizzes, deleteQuiz, Quiz } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function PersonalQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredQuizzes(
        quizzes.filter(
          q =>
            q.title.toLowerCase().includes(query) ||
            q.topic?.toLowerCase().includes(query) ||
            q.subject?.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredQuizzes(quizzes);
    }
  }, [searchQuery, quizzes]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getPersonalQuizzes();
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (error: any) {
      console.error('Fetch quizzes error:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q._id !== id));
      toast.success('Quiz deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Quizzes</h1>
              <p className="text-gray-600 mt-2">
                Create and take quizzes at your own pace
              </p>
            </div>
            <Link
              href="/quiz/generate"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Quiz</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Easy</p>
              <p className="text-2xl font-bold text-green-600">
                {quizzes.filter(q => q.difficulty === 'easy').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quizzes.filter(q => q.difficulty === 'medium').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Hard</p>
              <p className="text-2xl font-bold text-red-600">
                {quizzes.filter(q => q.difficulty === 'hard').length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Quiz List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-64 animate-pulse"
              />
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <FileQuestion className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first quiz to get started'}
            </p>
            <Link
              href="/quiz/generate"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Quiz</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {quiz.topic && <span>{quiz.topic}</span>}
                    {quiz.subject && (
                      <>
                        <span>•</span>
                        <span>{quiz.subject}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center space-x-2 mb-4">
                  {quiz.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {quiz.questions.length} questions
                  </span>
                </div>

                {/* Time Info */}
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                  <Clock className="h-3 w-3" />
                  <span>Created {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  <Link
                    href={`/quiz/take/${quiz._id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Take Quiz</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
