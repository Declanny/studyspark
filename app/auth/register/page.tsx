"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

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

      // Call real backend API
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        name: data.name,
        course: data.course,
        level: data.level,
        school: data.school || "",
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
          ?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <Card className="w-full">
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
    </div>
  );
}
