"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
    course: string;
    level: string;
    school?: string;
  }) => {
    try {
      setIsLoading(true);
      setError("");

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create new user with mock data
      const newUser = {
        id: "user-" + Date.now(),
        email: data.email,
        name: data.name,
        course: data.course,
        level: data.level,
        school: data.school,
        role: "student" as const,
      };
      const mockToken = "mock-jwt-token-" + newUser.id;

      // Save to auth store
      login({ user: newUser, token: mockToken });
      localStorage.setItem("token", mockToken);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Join <span className="text-primary">StudySpark</span>
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            type="register"
            onSubmit={handleRegister}
            error={error}
            isLoading={isLoading}
          />

          {/* Info */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              ✨ Registration is free! Create an account or use test accounts on the login page.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
