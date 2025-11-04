"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export function ManageQuiz() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post("/admin/quiz/generate", {
        topic,
        course,
        difficulty,
        numQuestions,
      });

      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Generation failed:", error);
      // Fallback to mock data
      const mockQuestions: Question[] = Array.from(
        { length: numQuestions },
        (_, i) => ({
          id: `q${i + 1}`,
          text: `Sample question ${i + 1} about ${topic}?`,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
          ],
          correctAnswer: Math.floor(Math.random() * 4),
        })
      );
      setQuestions(mockQuestions);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateQuiz = async () => {
    setIsCreating(true);
    try {
      await api.post("/admin/quiz", {
        title,
        course,
        topic,
        difficulty,
        duration,
        questions,
      });

      setCreateSuccess(true);
      // Reset form
      setTitle("");
      setCourse("");
      setTopic("");
      setQuestions([]);

      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (error) {
      console.error("Create quiz failed:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number | string[]) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === optIndex ? value : opt)),
            }
          : q
      )
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Generate & Manage Quiz</h2>
      </div>

      {createSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>Quiz created successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Quiz Settings */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Week 5 Practice Quiz"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-course">Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs101">Computer Science 101</SelectItem>
                  <SelectItem value="math201">Mathematics 201</SelectItem>
                  <SelectItem value="eng301">Engineering 301</SelectItem>
                  <SelectItem value="bio101">Biology 101</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quiz-difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="quiz-topic">Topic</Label>
            <Input
              id="quiz-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Introduction to Data Structures"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                min="5"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="180"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateQuestions}
            disabled={!topic || !course || isGenerating}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating with AI..." : "Generate Questions with AI"}
          </Button>
        </div>

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Generated Questions ({questions.length})
              </h3>
              <Button
                onClick={handleCreateQuiz}
                disabled={isCreating}
                size="sm"
              >
                {isCreating ? "Creating..." : "Create Quiz"}
              </Button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {questions.map((question, qIndex) => (
                <Card key={question.id} className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Question {qIndex + 1}
                      </Label>
                      <Textarea
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(qIndex, "text", e.target.value)
                        }
                        rows={2}
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() =>
                              updateQuestion(qIndex, "correctAnswer", optIndex)
                            }
                            className="cursor-pointer"
                          />
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, optIndex, e.target.value)
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + optIndex
                            )}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
