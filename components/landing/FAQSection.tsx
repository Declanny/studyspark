"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is StudySpark really free for students?",
    answer:
      "Yes! StudySpark is 100% free for all students. We believe education should be accessible to everyone, especially working-class university students. No credit card required, no hidden fees.",
  },
  {
    question: "How does the AI study assistant work?",
    answer:
      "Our AI uses advanced natural language processing and RAG (Retrieval Augmented Generation) technology. When you upload your course materials, we create embeddings and index them. When you ask questions, the AI searches your materials for relevant context and provides accurate, sourced answers.",
  },
  {
    question: "Can I use StudySpark on my phone?",
    answer:
      "Absolutely! StudySpark is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can study on-the-go, take quizzes during your commute, and access all features from any device.",
  },
  {
    question: "How do live quizzes work?",
    answer:
      "Create a quiz and enable 'Live Mode' to generate a unique join code. Share this code with your classmates, and they can join your quiz session in real-time. Everyone takes the quiz simultaneously, and results are displayed on a live leaderboard for friendly competition.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes, absolutely. We use enterprise-grade AES-256 encryption for all data. Your study materials, quiz results, and personal information are kept strictly confidential. We never sell your data to third parties, and you have full control over your information at all times.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="container mx-auto px-4 py-20 max-w-[900px]">
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
          Frequently Asked Questions
        </h2>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            lineHeight: '1.6',
          }}
        >
          Everything you need to know about StudySpark
        </p>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card
              className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: '12px' }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors min-h-[70px]"
              >
                <span className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 bg-muted/30">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
