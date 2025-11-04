import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StudyState {
  selectedCourse: string | null;
  selectedTopic: string | null;
  selectedWeek: number | null;
  messages: Message[];
  isLoading: boolean;
  setSelectedCourse: (course: string) => void;
  setSelectedTopic: (topic: string) => void;
  setSelectedWeek: (week: number) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  selectedCourse: null,
  selectedTopic: null,
  selectedWeek: null,
  messages: [],
  isLoading: false,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

