"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import {
  BookOpen,
  Brain,
  Bell,
  TrendingUp,
  Trophy,
} from "lucide-react";

function DashboardContent() {
  const user = useAuthStore((state) => state.user);

  const widgets = [
    {
      title: "AI Study Assistant",
      description: "Chat with AI about your course materials",
      icon: Brain,
      href: "/study",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      iconBg: "bg-blue-200 dark:bg-blue-800/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "CBT Practice",
      description: "Take practice quizzes and live tests",
      icon: Trophy,
      href: "/quiz",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      iconBg: "bg-purple-200 dark:bg-purple-800/50",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Smart Reminders",
      description: "Never miss an important deadline",
      icon: Bell,
      href: "/notifications",
      bgColor: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconBg: "bg-green-200 dark:bg-green-800/50",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Performance Reports",
      description: "Track your progress and insights",
      icon: TrendingUp,
      href: "/report",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      iconBg: "bg-orange-200 dark:bg-orange-800/50",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Study Materials",
      description: "Access your course resources",
      icon: BookOpen,
      href: "/study",
      bgColor: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
      iconBg: "bg-pink-200 dark:bg-pink-800/50",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {widgets.map((widget, index) => (
            <WidgetCard key={index} {...widget} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

