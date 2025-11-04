"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loading } from "./Loading";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, accessToken, router]);

  if (!isAuthenticated && !accessToken) {
    return <Loading />;
  }

  return <>{children}</>;
}
