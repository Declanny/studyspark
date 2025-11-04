"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function Timer({ duration, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const isUrgent = timeLeft <= 60; // Last minute
  const isCritical = timeLeft <= 30; // Last 30 seconds

  return (
    <Card
      className={`p-4 ${
        isCritical
          ? "border-red-500 bg-red-50 dark:bg-red-950"
          : isUrgent
          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
          <span className="font-semibold">Time Remaining</span>
        </div>

        <div
          className={`text-2xl font-bold tabular-nums ${
            isCritical
              ? "text-red-600 animate-pulse"
              : isUrgent
              ? "text-yellow-600"
              : ""
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isCritical
              ? "bg-red-600"
              : isUrgent
              ? "bg-yellow-600"
              : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCritical && (
        <p className="text-sm text-red-600 mt-2 font-medium">
          Hurry! Time is running out!
        </p>
      )}
    </Card>
  );
}
