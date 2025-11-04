"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Users,
  Trophy,
  Plus,
  History,
  Sparkles,
  Clock,
  Target
} from "lucide-react";

function QuizHubContent() {
  const router = useRouter();

  const quizOptions = [
    {
      title: "Generate Quiz",
      description: "Create AI-powered quizzes on any topic with customizable difficulty",
      icon: Sparkles,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      href: "/quiz/generate",
      action: "Generate New Quiz"
    },
    {
      title: "Personal Quizzes",
      description: "Access your saved quizzes and practice at your own pace",
      icon: Brain,
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      href: "/quiz/personal",
      action: "View My Quizzes"
    },
    {
      title: "Join Live Quiz",
      description: "Enter a code to join a live quiz session with others",
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      href: "/quiz/join",
      action: "Join Quiz"
    },
    {
      title: "Quiz History",
      description: "Review your past quiz attempts and track your progress",
      icon: History,
      color: "bg-gradient-to-br from-orange-500 to-red-500",
      href: "/quiz/attempts",
      action: "View History"
    }
  ];

  const stats = [
    {
      label: "Quizzes Taken",
      value: "0",
      icon: Trophy,
      color: "text-yellow-600"
    },
    {
      label: "Average Score",
      value: "0%",
      icon: Target,
      color: "text-blue-600"
    },
    {
      label: "Study Time",
      value: "0m",
      icon: Clock,
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Center</h1>
          <p className="text-gray-600 text-lg">
            Create, practice, and master your subjects with AI-powered quizzes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quiz Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizOptions.map((option, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => router.push(option.href)}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>

                <p className="text-gray-600 mb-6 min-h-[48px]">
                  {option.description}
                </p>

                <Button
                  className="w-full group-hover:bg-gray-900 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(option.href);
                  }}
                >
                  {option.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Start Guide */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Getting Started
              </h3>
              <p className="text-gray-700 mb-4">
                New to quizzes? Start by generating a quiz on any topic you're studying,
                or join a live quiz using a code from your instructor.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => router.push('/quiz/generate')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Quiz
                </Button>
                <Button
                  onClick={() => router.push('/quiz/join')}
                  variant="outline"
                >
                  Join a Live Quiz
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function QuizHubPage() {
  return (
    <ProtectedRoute>
      <QuizHubContent />
    </ProtectedRoute>
  );
}
