"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Trophy, Users, BarChart3 } from "lucide-react";

const sections = [
  {
    title: "Upload Your Materials",
    description:
      "Simply upload your PDF, Word documents, or PowerPoint presentations. Our AI instantly processes and indexes your study materials for intelligent assistance.",
    Icon: BookOpen,
    layout: "left",
    image: "/Frame 84.png",
  },
  {
    title: "Chat with AI",
    description:
      "Ask questions about your course content. Get instant explanations, summaries, and personalized flashcards generated from your materials.",
    Icon: Brain,
    layout: "right",
    image: "/Frame 85.png",
  },
  {
    title: "Practice with Quizzes",
    description:
      "Generate unlimited practice quizzes from your materials. Take CBT-style tests and track your progress over time with detailed analytics.",
    Icon: Trophy,
    layout: "left-double",
    images: ["/Frame 84 (1).png", "/quizhero.png"],
  },
  {
    title: "Compete Live",
    description:
      "Create or join live quiz sessions with classmates. Compete on real-time leaderboards and make learning fun and engaging.",
    Icon: Users,
    layout: "right-single",
    image: "/Frame 84.png",
  },
  {
    title: "Track Your Progress",
    description:
      "View comprehensive analytics on your performance. Identify weak areas and get AI-powered recommendations to improve your learning.",
    Icon: BarChart3,
    layout: "right-double",
    images: ["/Frame 85.png", "/Frame 84 (1).png"],
  },
];

export default function StickyScrollSection() {
  return (
    <section className="py-20">
      {/* Header */}
      <motion.div
        className="container mx-auto px-4 max-w-[1200px] text-center mb-16"
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
          How StudySpark Works
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.6',
          }}
        >
          From uploading materials to acing your exams in five simple steps
        </p>
      </motion.div>

      {/* Sticky Scroll Items */}
      <div className="space-y-16">
        {sections.map((section, index) => {
          const Icon = section.Icon;
          const isLeft = section.layout.includes("left");
          const isDouble = section.layout.includes("double");

          return (
            <div
              key={index}
              className="relative min-h-[600px] flex items-center justify-center py-12"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/20 dark:from-primary/10 dark:via-accent/10" />

              <div className="container mx-auto px-4 max-w-[1200px] relative z-10">
                <motion.div
                  className={`grid ${
                    section.layout === "left" || section.layout === "right-single"
                      ? "md:grid-cols-1"
                      : "md:grid-cols-2"
                  } gap-12 items-center`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Text Content */}
                  <motion.div
                    className={`space-y-6 ${
                      !isLeft && (section.layout === "right" || section.layout === "right-double")
                        ? "md:order-1"
                        : ""
                    } ${
                      section.layout === "right-single" ? "text-right ml-auto max-w-2xl" : ""
                    }`}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">Step {index + 1}</span>
                    </div>

                    <h3
                      className="font-bold text-foreground"
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        letterSpacing: '-0.48px',
                        fontWeight: 590,
                        lineHeight: '1.3',
                      }}
                    >
                      {section.title}
                    </h3>

                    <p
                      className="text-muted-foreground leading-relaxed"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                      }}
                    >
                      {section.description}
                    </p>
                  </motion.div>

                  {/* Image(s) */}
                  {isDouble ? (
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {section.images?.map((img, imgIndex) => (
                        <Card
                          key={imgIndex}
                          className="overflow-hidden shadow-xl border-0"
                          style={{ borderRadius: '16px' }}
                        >
                          <img
                            src={img}
                            alt={`${section.title} ${imgIndex + 1}`}
                            className="w-full h-auto object-contain"
                          />
                        </Card>
                      ))}
                    </motion.div>
                  ) : (
                    section.image && (
                      <motion.div
                        className={`${
                          section.layout === "right-single" ? "max-w-[400px]" : ""
                        }`}
                        initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <Card
                          className="overflow-hidden shadow-xl border-0"
                          style={{ borderRadius: '16px' }}
                        >
                          <img
                            src={section.image}
                            alt={section.title}
                            className="w-full h-auto object-contain"
                          />
                        </Card>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
