import { api } from './api';

export interface StudyStats {
  totalStudyTime: number;
  totalQuizzes: number;
  averageScore: number;
  completedQuizzes: number;
  totalTopics: number;
  weeklyActivity: Array<{
    date: string;
    quizzes: number;
    studyTime: number;
  }>;
  topicPerformance: Array<{
    topic: string;
    quizzesTaken: number;
    averageScore: number;
  }>;
  recentActivity: Array<{
    type: 'quiz' | 'study';
    title: string;
    date: string;
    score?: number;
  }>;
}

export interface PerformanceAnalysis {
  overallPerformance: {
    totalQuizzes: number;
    averageScore: number;
    improvement: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  strengthsAndWeaknesses: {
    strongTopics: string[];
    weakTopics: string[];
    recommendations: string[];
  };
  studyHabits: {
    avgStudyTime: number;
    bestStudyTime: string;
    consistency: number;
  };
}

/**
 * Get user's study statistics
 */
export async function getStudyStats(): Promise<StudyStats> {
  // Fetch both performance and study progress data
  const [performanceRes, studyProgressRes] = await Promise.all([
    api.get('/analytics/performance'),
    api.get('/analytics/study-progress')
  ]);

  const performanceData = performanceRes.data.analytics;
  const studyData = studyProgressRes.data.studyMetrics;

  // Transform backend data to match frontend interface
  return {
    totalStudyTime: performanceData.totalTimeSpent || 0,
    totalQuizzes: performanceData.totalQuizzes || 0,
    averageScore: performanceData.averageScore || 0,
    completedQuizzes: performanceData.totalQuizzes || 0,
    totalTopics: studyData.topicsStudied?.length || 0,
    weeklyActivity: studyData.weeklyProgress?.map((day: any) => ({
      date: day.date,
      quizzes: day.quizzesTaken,
      studyTime: day.studySessions * 2 // Estimate 2 mins per session
    })) || [],
    topicPerformance: performanceData.topicAnalysis?.byTopic?.map((topic: any) => ({
      topic: topic.topic,
      quizzesTaken: topic.attempts,
      averageScore: parseFloat(topic.averageScore)
    })) || [],
    recentActivity: performanceData.recentAttempts?.map((attempt: any) => ({
      type: 'quiz' as const,
      title: attempt.quizTitle,
      date: attempt.date,
      score: attempt.score
    })) || []
  };
}

/**
 * Get performance analysis with AI insights
 */
export async function getPerformanceAnalysis(): Promise<PerformanceAnalysis> {
  const [performanceRes, studyProgressRes] = await Promise.all([
    api.get('/analytics/performance'),
    api.get('/analytics/study-progress')
  ]);

  const performanceData = performanceRes.data.analytics;
  const studyData = studyProgressRes.data.studyMetrics;
  const aiAnalysis = performanceData.aiAnalysis;

  // Calculate trend
  const recentScores = performanceData.performanceTrend?.map((t: any) => t.score) || [];
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentScores.length >= 2) {
    const firstHalf = recentScores.slice(0, Math.floor(recentScores.length / 2));
    const secondHalf = recentScores.slice(Math.floor(recentScores.length / 2));
    const firstAvg = firstHalf.reduce((a: number, b: number) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a: number, b: number) => a + b, 0) / secondHalf.length;
    const improvement = secondAvg - firstAvg;

    if (improvement > 5) trend = 'improving';
    else if (improvement < -5) trend = 'declining';
  }

  const improvement = recentScores.length >= 2
    ? recentScores[recentScores.length - 1] - recentScores[0]
    : 0;

  return {
    overallPerformance: {
      totalQuizzes: performanceData.totalQuizzes || 0,
      averageScore: performanceData.averageScore || 0,
      improvement,
      trend
    },
    strengthsAndWeaknesses: {
      strongTopics: aiAnalysis?.strengths || [],
      weakTopics: aiAnalysis?.weaknesses || [],
      recommendations: aiAnalysis?.recommendations || []
    },
    studyHabits: {
      avgStudyTime: studyData.totalStudyTime || 0,
      bestStudyTime: 'Evening', // TODO: Calculate from actual data
      consistency: Math.min(100, (studyData.weeklyProgress?.filter((d: any) => d.totalActivity > 0).length / 7) * 100) || 0
    }
  };
}

/**
 * Get quiz performance by topic
 */
export async function getTopicPerformance(topic?: string) {
  const response = await api.get('/analytics/performance');
  const topicData = response.data.analytics.topicAnalysis?.byTopic || [];

  if (topic) {
    return topicData.filter((t: any) => t.topic.toLowerCase().includes(topic.toLowerCase()));
  }

  return topicData;
}

/**
 * Get study progress over time
 */
export async function getStudyProgress(period: 'week' | 'month' | 'year' = 'month') {
  const response = await api.get('/analytics/study-progress');
  return response.data.studyMetrics;
}
