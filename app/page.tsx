"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Hero from "@/components/landing/Hero";
import CoreFeatures from "@/components/landing/CoreFeatures";
import SecuritySection from "@/components/landing/SecuritySection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1216px]">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/s.png" alt="StudySpark" className="h-8 w-8" />
              <span className="text-2xl font-bold">
                Study<span className="text-primary">Spark</span>
              </span>
            </Link>
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Study Platform
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-muted transition-colors cursor-pointer">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90 transition-colors cursor-pointer">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Core Features */}
      <CoreFeatures />

      {/* Security/Trust Section */}
      <SecuritySection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
