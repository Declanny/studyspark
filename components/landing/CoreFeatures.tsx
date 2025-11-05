"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Trophy,
  Bell,
  BarChart3,
  BookOpen,
  Users,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "AI Study Assistant",
    description: "Chat with AI about your course materials. Get instant explanations, summaries, and personalized learning recommendations.",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Trophy,
    title: "Gamified Quizzes",
    description: "Practice with CBT-style quizzes. Compete live with classmates and climb the leaderboard to master your subjects.",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: BookOpen,
    title: "Smart Material Library",
    description: "Upload and organize your course materials with AI-powered RAG technology for contextual learning assistance.",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics, identify weak areas, and get AI-powered study recommendations.",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Users,
    title: "Live Collaboration",
    description: "Create and join live quiz sessions with classmates. Study together and learn from each other in real-time.",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss deadlines with intelligent notifications via email, SMS, WhatsApp, or push notifications.",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
  },
];

export default function CoreFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="container mx-auto px-4 py-20 max-w-[1216px]">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-bold text-foreground mb-4"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.3125rem)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
          }}
        >
          Everything You Need to Excel
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.6',
          }}
        >
          Powerful features designed for working-class university students
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="w-full max-w-[430px]"
            >
              <Card
                className={`p-6 h-[280px] flex flex-col border-0 shadow-md hover:shadow-xl transition-all duration-300 ${feature.bgColor}`}
                style={{ borderRadius: '10px' }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
