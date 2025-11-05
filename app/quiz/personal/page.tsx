"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Play, Trash2, Clock, FileQuestion, TrendingUp, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';
import { getPersonalQuizzes, deleteQuiz, Quiz } from '@/lib/quizApi';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function PersonalQuizzesContent() {
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

  const easyCount = quizzes.filter(q => q.difficulty === 'easy').length;
  const mediumCount = quizzes.filter(q => q.difficulty === 'medium').length;
  const hardCount = quizzes.filter(q => q.difficulty === 'hard').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Personal Quizzes
              </h1>
              <p className="text-muted-foreground text-lg">
                Create and take quizzes at your own pace
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/quiz/generate">
                <Plus className="h-5 w-5 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Quizzes</p>
                  <p className="text-3xl font-bold text-foreground">{quizzes.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:border-green-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Easy</p>
                  <p className="text-3xl font-bold text-green-600">{easyCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Medium</p>
                  <p className="text-3xl font-bold text-yellow-600">{mediumCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:border-red-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Hard</p>
                  <p className="text-3xl font-bold text-red-600">{hardCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-4 border-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="pl-14 pr-4 py-8 text-lg placeholder:text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-background shadow-none"
              />
            </div>
          </Card>
        </div>

        {/* Quiz List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first quiz to get started'}
              </p>
              <Button asChild size="lg">
                <Link href="/quiz/generate">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Quiz
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz._id}
                className="overflow-hidden border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {quiz.topic && (
                        <span className="font-medium capitalize">{quiz.topic}</span>
                      )}
                      {quiz.subject && (
                        <>
                          <span>•</span>
                          <span>{quiz.subject}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {quiz.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      {quiz.questions.length} questions
                    </span>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      asChild
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/quiz/take/${quiz._id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(quiz._id);
                      }}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
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

export default function PersonalQuizzesPage() {
  return (
    <ProtectedRoute>
      <PersonalQuizzesContent />
    </ProtectedRoute>
  );
}
