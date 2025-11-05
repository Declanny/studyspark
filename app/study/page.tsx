"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ChatWindow } from "@/components/study/ChatWindow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowRight, Lightbulb } from "lucide-react";
import { useStudyStore } from "@/store/useStudyStore";

function StudyContent() {
  const [topicInput, setTopicInput] = useState("");
  const { selectedTopic, setSelectedTopic } = useStudyStore();

  const handleStartChat = () => {
    if (topicInput.trim()) {
      setSelectedTopic(topicInput.trim());
      setTopicInput("");
    }
  };

  const handleChangeTopic = () => {
    setSelectedTopic("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-[1216px]">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            AI Study Assistant
          </h1>
          <p className="text-muted-foreground text-lg">
            Ask questions, get AI-powered answers with YouTube video recommendations
          </p>
        </div>

        {selectedTopic ? (
          <div className="space-y-6">
            {/* Current Topic Header */}
            <Card className="p-6 border-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Topic</p>
                    <p className="font-semibold text-xl text-foreground">{selectedTopic}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleChangeTopic}
                  className="hover:bg-accent transition-all duration-200 hover:scale-105 border-2"
                >
                  Change Topic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Chat Window */}
            <ChatWindow />
          </div>
        ) : (
          <Card className="p-12 text-center border-2 shadow-xl">
            <div className="max-w-lg mx-auto space-y-8">
              {/* Animated Icon */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative text-7xl">🧠</div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  What would you like to learn about?
                </h2>
                <p className="text-muted-foreground text-base">
                  Enter a topic to start chatting with your AI study assistant
                </p>
              </div>

              {/* Topic Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Lightbulb className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && topicInput.trim()) {
                        handleStartChat();
                      }
                    }}
                    placeholder="e.g., Data Structures, Machine Learning, Algorithms..."
                    className="w-full pl-12 pr-4 py-6 text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                  />
                </div>
                <Button
                  onClick={handleStartChat}
                  disabled={!topicInput.trim()}
                  className="w-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-2"
                  size="lg"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Topic Suggestions */}
              <div className="pt-6 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-4">Quick suggestions:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["Data Structures", "Algorithms", "Machine Learning", "Web Development", "Databases"].map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTopicInput(topic);
                        setSelectedTopic(topic);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border-2"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
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

