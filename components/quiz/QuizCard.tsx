"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizCardProps {
  question: {
    id: string;
    text?: string;
    question?: string;
    options: string[];
    correctAnswer: number;
  };
  onAnswer: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  showResult?: boolean;
}

export function QuizCard({ question, onAnswer, showResult = false }: QuizCardProps) {
  const questionText = question.question || question.text || "";
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasAnswered) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setHasAnswered(true);
    onAnswer(question.id, selectedOption, isCorrect);
  };

  const getOptionStyle = (index: number) => {
    if (!hasAnswered && !showResult) {
      return selectedOption === index
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50";
    }

    if (index === question.correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-950";
    }

    if (selectedOption === index && index !== question.correctAnswer) {
      return "border-red-500 bg-red-50 dark:bg-red-950";
    }

    return "border-border";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{questionText}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered || showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionStyle(
                index
              )} ${
                hasAnswered || showResult
                  ? "cursor-default"
                  : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </span>
                {(hasAnswered || showResult) && (
                  <>
                    {index === question.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {selectedOption === index &&
                      index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!hasAnswered && !showResult && (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}
