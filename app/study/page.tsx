"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useStudyStore } from "@/store/useStudyStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ChatWindow } from "@/components/study/ChatWindow";
import { TopicSelector } from "@/components/study/TopicSelector";
import { Card } from "@/components/ui/card";

function StudyContent() {
  const user = useAuthStore((state) => state.user);
  const { selectedCourse, selectedTopic, setSelectedCourse } = useStudyStore();

  useEffect(() => {
    if (user?.course && !selectedCourse) {
      setSelectedCourse(user.course);
    }
  }, [user, selectedCourse, setSelectedCourse]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Study Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Ask questions, get summaries, and understand your course materials better
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Topic Selector Sidebar */}
          <div className="lg:col-span-1">
            <TopicSelector />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedTopic ? (
              <ChatWindow />
            ) : (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl">🧠</div>
                  <h2 className="text-2xl font-bold">Select a Topic to Begin</h2>
                  <p className="text-muted-foreground">
                    Choose a topic or week from the sidebar to start chatting with your AI study assistant
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StudyPage() {
  return (
    <ProtectedRoute>
      <StudyContent />
    </ProtectedRoute>
  );
}

