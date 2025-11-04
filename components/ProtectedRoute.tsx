"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loading } from "./Loading";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated && !token) {
    return <Loading />;
  }

  return <>{children}</>;
}
