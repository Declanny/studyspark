"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { PerformanceChart } from "@/components/report/PerformanceChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
} from "lucide-react";

// Mock data
const PERFORMANCE_BY_TOPIC = [
  { category: "Week 1", score: 85, average: 75 },
  { category: "Week 2", score: 78, average: 72 },
  { category: "Week 3", score: 92, average: 80 },
  { category: "Week 4", score: 88, average: 78 },
  { category: "Week 5", score: 95, average: 82 },
  { category: "Week 6", score: 90, average: 85 },
];

const PROGRESS_OVER_TIME = [
  { week: "W1", score: 85 },
  { week: "W2", score: 78 },
  { week: "W3", score: 92 },
  { week: "W4", score: 88 },
  { week: "W5", score: 95 },
  { week: "W6", score: 90 },
];

const SKILLS_ANALYSIS = [
  { category: "Theory", score: 90, average: 75 },
  { category: "Application", score: 85, average: 78 },
  { category: "Analysis", score: 88, average: 72 },
  { category: "Problem Solving", score: 92, average: 80 },
  { category: "Critical Thinking", score: 87, average: 76 },
  { category: "Time Management", score: 95, average: 82 },
];

const STRENGTHS = [
  { area: "Problem Solving", score: 92, improvement: "+15%" },
  { area: "Time Management", score: 95, improvement: "+20%" },
  { area: "Theory Understanding", score: 90, improvement: "+12%" },
];

const WEAKNESSES = [
  { area: "Week 2 Concepts", score: 78, recommendation: "Review lecture notes and practice problems" },
  { area: "Application Skills", score: 85, recommendation: "Work on more practical exercises" },
];

const AI_RECOMMENDATIONS = [
  "Focus on strengthening your understanding of Week 2 materials, particularly the core concepts that form the foundation for later topics.",
  "Your problem-solving skills are excellent! Continue challenging yourself with advanced practice questions.",
  "Consider joining study groups to discuss application-based problems with peers.",
  "Allocate more time to hands-on exercises to improve practical application skills.",
];

function ReportContent() {
  const overallScore = 88;
  const quizzesTaken = 12;
  const quizzesCompleted = 10;
  const averageTime = "8 mins";
  const totalStudyHours = 24;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Performance Report</h1>
              <p className="text-muted-foreground">
                Detailed analysis of your learning progress and performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-primary" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{overallScore}%</p>
            <p className="text-sm text-muted-foreground">Overall Score</p>
            <Progress value={overallScore} className="mt-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-600" />
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">
              {quizzesCompleted}/{quizzesTaken}
            </p>
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            <Progress value={(quizzesCompleted / quizzesTaken) * 100} className="mt-2" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{averageTime}</p>
            <p className="text-sm text-muted-foreground">Avg. Quiz Time</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              15% faster than last month
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">{totalStudyHours}h</p>
            <p className="text-sm text-muted-foreground">Total Study Hours</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +3h from last week
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart
            type="bar"
            data={PERFORMANCE_BY_TOPIC}
            title="Performance by Week"
            description="Compare your scores with class averages"
          />

          <PerformanceChart
            type="line"
            data={PROGRESS_OVER_TIME}
            title="Progress Over Time"
            description="Track your improvement week by week"
          />
        </div>

        <div className="mb-8">
          <PerformanceChart
            type="radar"
            data={SKILLS_ANALYSIS}
            title="Skills Analysis"
            description="Detailed breakdown of your competencies"
          />
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold">Your Strengths</h3>
            </div>
            <div className="space-y-4">
              {STRENGTHS.map((strength, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{strength.area}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600">{strength.improvement}</span>
                      <span className="text-lg font-bold">{strength.score}%</span>
                    </div>
                  </div>
                  <Progress value={strength.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold">Areas for Improvement</h3>
            </div>
            <div className="space-y-4">
              {WEAKNESSES.map((weakness, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{weakness.area}</span>
                    <span className="text-lg font-bold">{weakness.score}%</span>
                  </div>
                  <Progress value={weakness.score} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    💡 {weakness.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">AI-Powered Recommendations</h3>
          </div>
          <div className="space-y-3">
            {AI_RECOMMENDATIONS.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border-l-4 border-primary"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => (window.location.href = "/study")}>
            <BookOpen className="w-4 h-4 mr-2" />
            Start Studying
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => (window.location.href = "/quiz")}
          >
            <Target className="w-4 h-4 mr-2" />
            Take Practice Quiz
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <ReportContent />
    </ProtectedRoute>
  );
}
