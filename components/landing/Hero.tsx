"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 pt-4 pb-12 max-w-[1216px]">
      <div className="w-full relative overflow-hidden" style={{ height: '800px', borderRadius: '32px' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Frame 106.png"
            alt="StudySpark Platform"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content - Bottom Left */}
        <div className="relative h-full flex items-end p-8 md:pl-8 md:pr-12 pb-20 md:pb-28">
          <motion.div
            className="space-y-4 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="font-bold text-foreground leading-tight"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              }}
            >
              Study <span className="text-primary">Smarter</span>, Not Harder
            </h1>

            <p
              className="text-foreground leading-relaxed max-w-xl"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                lineHeight: '1.6',
              }}
            >
              Your AI-powered study companion helping students excel with personalized learning, gamified quizzes, and smart insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
