"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { NotificationCard, Notification } from "@/components/notifications/NotificationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck } from "lucide-react";

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "exam",
    title: "Final Exam Scheduled",
    description: "Your final examination for Advanced Concepts has been scheduled. Make sure to prepare adequately and arrive 15 minutes early.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "9:00 AM",
    isRead: false,
    priority: "high",
    actionUrl: "/study",
    channel: "email",
  },
  {
    id: "2",
    type: "assignment",
    title: "Assignment Due Soon",
    description: "Your Week 5 assignment submission deadline is approaching. Submit your work before the deadline to avoid penalties.",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "11:59 PM",
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard",
    channel: "whatsapp",
  },
  {
    id: "3",
    type: "quiz",
    title: "New Practice Quiz Available",
    description: "A new quiz on Week 6 materials is now available. Test your understanding before the exam.",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    isRead: false,
    priority: "medium",
    actionUrl: "/quiz",
    channel: "push",
  },
  {
    id: "4",
    type: "reminder",
    title: "Study Session Reminder",
    description: "Don't forget to review your notes for tomorrow's class. Focus on the topics covered in Week 5.",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    time: "2:00 PM",
    isRead: true,
    priority: "low",
    channel: "push",
  },
  {
    id: "5",
    type: "announcement",
    title: "Course Material Updated",
    description: "New supplementary materials have been added to Week 4. Check them out to enhance your understanding.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "low",
    actionUrl: "/study",
    channel: "email",
  },
  {
    id: "6",
    type: "quiz",
    title: "Live Quiz Starting Soon",
    description: "Join the live quiz competition in 30 minutes! Code: LIVE123. Compete with your classmates.",
    date: new Date(Date.now() + 30 * 60 * 1000),
    time: "3:30 PM",
    isRead: false,
    priority: "high",
    actionUrl: "/quiz/live/LIVE123",
    channel: "sms",
  },
  {
    id: "7",
    type: "reminder",
    title: "Weekly Review Reminder",
    description: "It's time for your weekly review! Spend 30 minutes reviewing what you learned this week.",
    date: new Date(),
    isRead: true,
    priority: "medium",
    channel: "push",
  },
];

function NotificationsContent() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleAction = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification?.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.isRead;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  Stay updated with your course schedule and reminders
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {notifications.filter((n) => n.priority === "high").length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="exam">Exams</TabsTrigger>
            <TabsTrigger value="assignment">Assignments</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
            <TabsTrigger value="reminder">Reminders</TabsTrigger>
            <TabsTrigger value="announcement">News</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onAction={handleAction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === "unread"
                    ? "You're all caught up!"
                    : `No ${activeTab} notifications at the moment`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
