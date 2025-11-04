"use client";

import { Card } from "@/components/ui/card";

interface User {
  name: string;
  course: string;
  level: string;
}

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">
          {getGreeting()}, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Ready to study today? Let&apos;s make it productive!
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Your Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.course} • Level {user?.level}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Quizzes Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">85%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">24</div>
              <div className="text-xs text-muted-foreground">Study Hours</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

