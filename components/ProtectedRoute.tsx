"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loading } from "./Loading";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only redirect after hydration is complete
    if (isHydrated && !isAuthenticated && !accessToken) {
      router.push("/auth/login");
    }
  }, [isHydrated, isAuthenticated, accessToken, router]);

  // Show loading while hydrating or if not authenticated
  if (!isHydrated || (!isAuthenticated && !accessToken)) {
    return <Loading />;
  }

  return <>{children}</>;
}
