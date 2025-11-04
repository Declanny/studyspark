"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLive?: boolean;
}

export function Leaderboard({ entries, isLive = false }: LeaderboardProps) {
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Leaderboard</h2>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
              entry.isCurrentUser
                ? "bg-primary/10 border-2 border-primary"
                : "bg-muted/50 hover:bg-muted"
            } ${isLive ? "animate-in fade-in slide-in-from-right-2" : ""}`}
          >
            {/* Position */}
            <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
              {getMedalIcon(index) || <span className="text-muted-foreground">#{index + 1}</span>}
            </div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${entry.isCurrentUser ? "text-primary" : ""}`}>
                {entry.name}
                {entry.isCurrentUser && " (You)"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {entry.correctAnswers}/{entry.totalQuestions} correct
                </span>
                <span>•</span>
                <span>{formatTime(entry.timeTaken)}</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="text-2xl font-bold">{entry.score}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>

            {/* Trend (for live mode) */}
            {isLive && index < 3 && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Be the first to complete the quiz!</p>
          </div>
        )}
      </div>
    </Card>
  );
}
