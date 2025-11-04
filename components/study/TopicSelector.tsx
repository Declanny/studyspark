"use client";

import { useStudyStore } from "@/store/useStudyStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2 } from "lucide-react";

const TOPICS = [
  { id: "week1", name: "Week 1: Introduction", completed: true },
  { id: "week2", name: "Week 2: Fundamentals", completed: true },
  { id: "week3", name: "Week 3: Advanced Concepts", completed: false },
  { id: "week4", name: "Week 4: Practical Applications", completed: false },
  { id: "week5", name: "Week 5: Case Studies", completed: false },
  { id: "week6", name: "Week 6: Review", completed: false },
];

export function TopicSelector() {
  const { selectedTopic, setSelectedTopic, clearMessages } = useStudyStore();

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    clearMessages();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5" />
        <h2 className="font-semibold">Course Topics</h2>
      </div>

      <div className="space-y-2">
        {TOPICS.map((topic) => (
          <Button
            key={topic.id}
            variant={selectedTopic === topic.id ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => handleTopicSelect(topic.id)}
          >
            <div className="flex items-start gap-2 w-full">
              <div className="flex-1">
                <p className="text-sm font-medium">{topic.name}</p>
              </div>
              {topic.completed && (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Select a topic to start chatting with AI about
          that specific material
        </p>
      </div>
    </Card>
  );
}
