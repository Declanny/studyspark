"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WidgetCard } from "@/components/dashboard/WidgetCard";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
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
      <main className="container mx-auto px-4 py-8 max-w-[1216px]">
        <DashboardHeader user={user} />

        {/* CBT Practice Hero Section */}
        <div className="mb-12 mt-8">
          <Card 
            className="overflow-hidden border-0 shadow-2xl w-full flex relative"
            style={{
              height: '350px',
              borderRadius: '32px',
              backgroundImage: 'url(/quizhero.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="relative grid md:grid-cols-2 h-full w-full">
              {/* Left Side - Content */}
              <div className="space-y-6 z-10 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  CBT Practice
                </h1>
                <p className="text-white/90 text-lg">
                  Take practice quizzes and live tests
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

