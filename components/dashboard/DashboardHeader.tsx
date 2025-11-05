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

  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    const messages = {
      morning: [
        "Ready to start your day strong? Let's make it productive!",
        "A fresh start means fresh opportunities. Let's ace today!",
        "Every great achievement begins with a single step. Let's begin!",
        "Morning energy is the best energy. Time to learn something new!",
      ],
      afternoon: [
        "Ready to study today? Let's make it productive!",
        "Keep up the momentum! You're doing great!",
        "Afternoon focus time - let's tackle those goals!",
        "The best time to study was earlier, the second best is now!",
      ],
      evening: [
        "Evening study session? That's dedication! Let's go!",
        "Winding down doesn't mean slowing down. Keep pushing forward!",
        "Evening productivity is powerful. Let's make the most of it!",
        "Your future self will thank you for this effort today!",
      ],
    };

    let timeKey: keyof typeof messages = "afternoon";
    if (hour < 12) timeKey = "morning";
    else if (hour >= 18) timeKey = "evening";

    // Use user's name to seed for consistent daily message
    const userSeed = user?.name?.charCodeAt(0) || 0;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = (userSeed + dayOfYear) % messages[timeKey].length;
    
    return messages[timeKey][index];
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold">
          {getGreeting()}, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          {getMotivationalMessage()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quizzes Taken */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <img src="/Layer 1.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-5xl font-bold mb-2">12</div>
                <div className="text-sm font-medium text-muted-foreground">Quizzes Taken</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center">
                <img src="/Layer 2.png" alt="Quiz icon" className="w-8 h-12" />
              </div>
            </div>
          </div>
        </Card>

        {/* Average Score */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <img src="/Layer 1.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-5xl font-bold mb-2">85%</div>
                <div className="text-sm font-medium text-muted-foreground">Average Score</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center">
                <img src="/Subtract.png" alt="Checkmark icon" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </Card>

        {/* Study Hours */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <img src="/Layer 1.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-5xl font-bold mb-2">24</div>
                <div className="text-sm font-medium text-muted-foreground">Study Hours</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center">
                <img src="/Frame 124.png" alt="Clock icon" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

