import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  course: string;
  level: string;
  school?: string;
  role: "student" | "admin";
}

interface AuthState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  login: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      isAuthenticated: false,
      login: (data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
        set({
          user: null,
          accessToken: "",
          refreshToken: "",
          isAuthenticated: false,
        });
      },
      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({ accessToken, refreshToken });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);

