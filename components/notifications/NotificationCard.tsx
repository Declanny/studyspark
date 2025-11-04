"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Bell, BookOpen, Trophy, AlertCircle } from "lucide-react";

export interface Notification {
  id: string;
  type: "assignment" | "exam" | "quiz" | "reminder" | "announcement";
  title: string;
  description: string;
  date: Date;
  time?: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  channel?: "email" | "sms" | "whatsapp" | "push";
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onAction,
}: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "assignment":
        return <BookOpen className="w-5 h-5" />;
      case "exam":
        return <AlertCircle className="w-5 h-5" />;
      case "quiz":
        return <Trophy className="w-5 h-5" />;
      case "reminder":
        return <Bell className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getColorScheme = () => {
    switch (notification.priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      default:
        return "border-border";
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case "exam":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      case "assignment":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      case "quiz":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
      case "reminder":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return `${Math.abs(days)} days ago`;
    } else if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Tomorrow";
    } else if (days <= 7) {
      return `In ${days} days`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card
      className={`p-4 transition-all ${getColorScheme()} ${
        !notification.isRead ? "border-l-4" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-lg ${
            notification.priority === "high"
              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
              : notification.priority === "medium"
              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`font-semibold ${
                  !notification.isRead ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {notification.title}
              </h3>
              <Badge variant="outline" className={getTypeColor()}>
                {notification.type}
              </Badge>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {notification.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(notification.date)}</span>
            </div>
            {notification.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{notification.time}</span>
              </div>
            )}
            {notification.channel && (
              <div className="flex items-center gap-1">
                <Bell className="w-3 h-3" />
                <span className="capitalize">{notification.channel}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notification.actionUrl && (
              <Button
                size="sm"
                onClick={() => onAction?.(notification.id)}
                variant="default"
              >
                View Details
              </Button>
            )}
            {!notification.isRead && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead?.(notification.id)}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
