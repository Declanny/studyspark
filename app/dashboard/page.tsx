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
  Clock,
} from "lucide-react";

function DashboardContent() {
  const user = useAuthStore((state) => state.user);

  const widgets = [
    {
      title: "AI Study Assistant",
      description: "Chat with AI about your course materials",
      icon: Brain,
      href: "/study",
      color: "bg-primary",
    },
    {
      title: "Quiz Center",
      description: "Create, practice, and take quizzes",
      icon: Trophy,
      href: "/quiz",
      color: "bg-accent",
    },
    {
      title: "Study Materials",
      description: "Upload and manage your course materials",
      icon: BookOpen,
      href: "/materials",
      color: "bg-chart-5",
    },
    {
      title: "Analytics & Progress",
      description: "Track your performance and get AI insights",
      icon: TrendingUp,
      href: "/analytics",
      color: "bg-chart-4",
    },
    {
      title: "Smart Reminders",
      description: "Never miss an important deadline",
      icon: Bell,
      href: "/notifications",
      color: "bg-chart-3",
    },
    {
      title: "Reports & History",
      description: "View your learning history and reports",
      icon: Clock,
      href: "/quiz/attempts",
      color: "bg-chart-2",
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

        {user?.role === "admin" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <WidgetCard
                title="Admin Panel"
                description="Manage content and users"
                icon={BookOpen}
                href="/admin"
                color="bg-destructive"
              />
            </div>
          </div>
        )}
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

