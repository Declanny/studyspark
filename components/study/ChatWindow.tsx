"use client";

import { useState, useRef, useEffect } from "react";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Send, Sparkles, FileText, Lightbulb, BookOpen, X } from "lucide-react";
import MaterialSelector from "@/components/materials/MaterialSelector";
import ContextDisplay from "@/components/chat/ContextDisplay";
import { chatWithContext } from "@/lib/materialApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: any;
}

export function ChatWindow() {
  const { messages: storeMessages, selectedTopic, addMessage } = useStudyStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [isMaterialSelectorOpen, setIsMaterialSelectorOpen] = useState(false);
  const [useRAG, setUseRAG] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(storeMessages as Message[]);
  }, [storeMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      let aiResponse;
      let context;

      if (useRAG && selectedMaterialIds.length > 0) {
        // Use RAG endpoint with material context
        const response = await chatWithContext({
          message: userMessage.content,
          materialIds: selectedMaterialIds,
          topic: selectedTopic || undefined,
        });

        aiResponse = response.data.aiResponse;
        context = response.data.chunksUsed;
      } else {
        // Use regular chat endpoint
        const response = await api.post("/study/query", {
          topic: selectedTopic,
          message: userMessage.content,
        });

        aiResponse = response.data.response;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
        context,
      };

      addMessage(aiMessage);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: error.response?.data?.error || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    const prompts: Record<string, string> = {
      summarize: `Provide a concise summary of ${selectedTopic}`,
      flashcards: `Generate flashcards for ${selectedTopic}`,
      explain: `Explain ${selectedTopic} like I'm 5 years old`,
    };

    setInput(prompts[action]);
    await handleSend();
  };

  return (
    <>
      <MaterialSelector
        selectedIds={selectedMaterialIds}
        onSelectionChange={setSelectedMaterialIds}
        isOpen={isMaterialSelectorOpen}
        onClose={() => setIsMaterialSelectorOpen(false)}
      />

      <Card className="flex flex-col h-[calc(100vh-16rem)]">
        {/* Material Context Controls */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRAG}
                  onChange={(e) => setUseRAG(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Use course materials
                </span>
              </label>
              {useRAG && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMaterialSelectorOpen(true)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {selectedMaterialIds.length > 0
                    ? `${selectedMaterialIds.length} selected`
                    : 'Select Materials'}
                </Button>
              )}
            </div>

            {selectedMaterialIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMaterialIds([])}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("summarize")}
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Summarize Topic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("flashcards")}
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Flashcards
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("explain")}
              disabled={isLoading}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Explain Like I&apos;m 5
            </Button>
          </div>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm mt-2">
              Ask questions about {selectedTopic} or use quick actions above
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === "assistant" ? "w-full" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "assistant" && message.context && (
                  <ContextDisplay chunksUsed={message.context} />
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question about your course material..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
        </div>
      </Card>
    </>
  );
}
