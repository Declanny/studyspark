"use client";

import { useState, useRef, useEffect } from "react";
import { useStudyStore } from "@/store/useStudyStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Send, Sparkles, FileText, Lightbulb, BookOpen, X, Play, Eye, Calendar, Clock } from "lucide-react";
import MaterialSelector from "@/components/materials/MaterialSelector";
import ContextDisplay from "@/components/chat/ContextDisplay";
import { chatWithContext } from "@/lib/materialApi";
import { createStudyChat, YouTubeVideo, formatDuration, formatViewCount, formatPublishedDate } from "@/lib/studyChatApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: any;
  youtubeRecommendations?: YouTubeVideo[];
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
      let youtubeRecommendations: YouTubeVideo[] | undefined;

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
        // Use Study Chat API with YouTube recommendations
        const response = await createStudyChat({
          topic: selectedTopic || "General Study",
          message: userMessage.content,
        });

        aiResponse = response.aiResponse;
        youtubeRecommendations = response.youtubeRecommendations;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
        context,
        youtubeRecommendations,
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

      <Card className="flex flex-col h-[calc(100vh-16rem)] border-2 shadow-xl bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        {/* Material Context Controls */}
        <div className="p-5 border-b bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useRAG}
                  onChange={(e) => setUseRAG(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-2 border-input focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Use course materials
                </span>
              </label>
              {useRAG && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMaterialSelectorOpen(true)}
                  className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
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
                className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
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
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Summarize Topic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("flashcards")}
              disabled={isLoading}
              className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Flashcards
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("explain")}
              disabled={isLoading}
              className="hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Explain Like I&apos;m 5
            </Button>
          </div>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background/50 to-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 animate-in fade-in duration-500">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="relative text-7xl">💬</div>
            </div>
            <p className="text-xl font-semibold mb-2">Start a conversation</p>
            <p className="text-sm">
              Ask questions about {selectedTopic} or use quick actions above
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === "assistant" ? "w-full" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-4 shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                      : "bg-muted/80 backdrop-blur-sm border border-border/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === "user" ? "opacity-80" : "opacity-60"
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "assistant" && message.context && (
                  <div className="mt-3">
                    <ContextDisplay chunksUsed={message.context} />
                  </div>
                )}
                {message.role === "assistant" && message.youtubeRecommendations && message.youtubeRecommendations.length > 0 && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Play className="h-4 w-4 text-primary" />
                      Recommended Videos
                    </h4>
                    {message.youtubeRecommendations.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex space-x-3 p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200 group hover:scale-[1.02]"
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-muted shadow-md group-hover:shadow-xl transition-all">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                          </div>
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md font-medium backdrop-blur-sm">
                            {formatDuration(video.duration)}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {video.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mb-2">{video.channelTitle}</p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {formatViewCount(video.viewCount)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatPublishedDate(video.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-muted/80 backdrop-blur-sm rounded-2xl px-5 py-4 border border-border/50 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="flex gap-3">
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
            className="min-h-[70px] resize-none border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[70px] w-[70px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <span className="text-xs">💡</span>
          Press Enter to send, Shift+Enter for new line
        </p>
        </div>
      </Card>
    </>
  );
}
