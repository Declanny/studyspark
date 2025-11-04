"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, Clock, BookOpen, Target, Calendar, BarChart3 } from 'lucide-react';
import { getStudyStats, getPerformanceAnalysis, StudyStats, PerformanceAnalysis } from '@/lib/analyticsApi';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, analysisData] = await Promise.all([
        getStudyStats(),
        getPerformanceAnalysis()
      ]);
      setStats(statsData);
      setAnalysis(analysisData);
    } catch (error: any) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600">No analytics data available yet</p>
          <p className="text-sm text-gray-500 mt-2">Complete some quizzes to see your progress</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Target className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your study progress and performance insights
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              {getTrendIcon(analysis.overallPerformance.trend)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</p>
            <p className={`text-sm mt-1 ${getTrendColor(analysis.overallPerformance.trend)}`}>
              {analysis.overallPerformance.improvement > 0 ? '+' : ''}
              {analysis.overallPerformance.improvement.toFixed(1)}% from last period
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Quizzes Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completedQuizzes}</p>
            <p className="text-sm text-gray-600 mt-1">
              out of {stats.totalQuizzes} total
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Study Time</p>
            <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalStudyTime / 60)}h</p>
            <p className="text-sm text-gray-600 mt-1">
              {Math.floor(analysis.studyHabits.avgStudyTime / 60)}h avg per session
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Topics Studied</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTopics}</p>
            <p className="text-sm text-gray-600 mt-1">
              {analysis.studyHabits.consistency}% consistency
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedPeriod === 'week'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedPeriod === 'month'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quizzes" fill="#3B82F6" name="Quizzes" />
                <Bar dataKey="studyTime" fill="#10B981" name="Study Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Performance Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Topic Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topicPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="topic" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#8B5CF6" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengthsAndWeaknesses.strongTopics.map((topic, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-green-800">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-red-900">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengthsAndWeaknesses.weakTopics.map((topic, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-600 mt-1">!</span>
                  <span className="text-red-800">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengthsAndWeaknesses.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span className="text-blue-800">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'quiz' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'quiz' ? (
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {activity.score !== undefined && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.score >= 80
                      ? 'bg-green-100 text-green-700'
                      : activity.score >= 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.score}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
