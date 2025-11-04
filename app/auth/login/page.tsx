"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError("");

      // Call real backend API
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Save to auth store
      login({
        user,
        accessToken,
        refreshToken,
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Login failed. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Welcome to <span className="text-primary">StudySpark</span>
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            type="login"
            onSubmit={handleLogin}
            error={error}
            isLoading={isLoading}
          />

          {/* Test Accounts Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <p className="text-sm font-semibold mb-2">Test Accounts:</p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium">Student Account:</p>
                <p className="text-muted-foreground">student@studyspark.com / password123</p>
              </div>
              <div>
                <p className="font-medium">Admin Account:</p>
                <p className="text-muted-foreground">admin@studyspark.com / admin123</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
