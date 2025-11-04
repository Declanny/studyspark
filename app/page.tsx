"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Trophy,
  Bell,
  BarChart3,
  Sparkles,
  Users,
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">StudySpark</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Study Assistant for University Students
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Study Smarter,
            <br />
            <span className="text-primary">Not Harder</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered study companion helping working-class students excel
            with personalized learning, gamified quizzes, and smart reminders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 h-14">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            ✨ No credit card required • Free forever for students
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed for working-class university students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Study Assistant</h3>
            <p className="text-muted-foreground">
              Chat with AI about your course materials. Get explanations,
              summaries, and flashcards instantly.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gamified Quizzes</h3>
            <p className="text-muted-foreground">
              Practice with CBT-style quizzes. Compete live with classmates and
              climb the leaderboard.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
            <p className="text-muted-foreground">
              Never miss deadlines. Get notifications via email, SMS, WhatsApp,
              or push.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Reports</h3>
            <p className="text-muted-foreground">
              Track your progress with detailed analytics and AI-powered
              recommendations.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-4xl font-bold mb-1">1,000+</p>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-4xl font-bold mb-1">50,000+</p>
              <p className="text-muted-foreground">Quizzes Taken</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-4xl font-bold mb-1">100,000+</p>
              <p className="text-muted-foreground">Study Hours</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-4xl font-bold mb-1">95%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How StudySpark Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes, excel in weeks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your free account in seconds. Add your courses and start
              learning.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Study & Practice</h3>
            <p className="text-muted-foreground">
              Chat with AI, take quizzes, and track your progress with detailed
              analytics.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Excel in Exams</h3>
            <p className="text-muted-foreground">
              Stay prepared with smart reminders and ace your exams with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Why Students Love StudySpark
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Get instant answers from AI tutor",
                "Practice with unlimited quizzes",
                "Track your progress over time",
                "Never miss assignment deadlines",
                "Compete with classmates",
                "Study at your own pace",
                "Access on any device",
                "100% free for students",
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already excelling with
            StudySpark. Start your journey today!
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8 h-14">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">StudySpark</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 StudySpark. Built with ❤️ for working-class students.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
