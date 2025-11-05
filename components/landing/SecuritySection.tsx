"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Lock, CheckCircle2, Eye } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "Your study materials and personal data are encrypted with industry-standard AES-256 encryption.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "We never sell your data. Your information stays private and is only used to enhance your learning experience.",
  },
  {
    icon: Eye,
    title: "Transparent AI",
    description: "Our AI provides sources and explanations for all recommendations, ensuring trustworthy and verifiable learning.",
  },
];

export default function SecuritySection() {
  return (
    <section className="container mx-auto px-4 py-20 max-w-[1216px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Card
          className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10"
          style={{ borderRadius: '34px' }}
        >
          <div className="grid md:grid-cols-2 gap-12 p-8 md:p-16 lg:p-20">
            {/* Left Column - Text */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="w-4 h-4" />
                Secure & Private
              </div>

              <h2
                className="font-bold text-foreground"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.3125rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                Your Data is Safe With Us
              </h2>

              <p
                className="text-muted-foreground leading-relaxed"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                  lineHeight: '1.6',
                }}
              >
                We take security and privacy seriously. StudySpark is built with enterprise-grade security measures to protect your academic data and personal information.
              </p>

              <div className="space-y-6 pt-4">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {point.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative w-full max-w-[400px] h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-3xl opacity-50" />
                <div className="relative h-full flex items-center justify-center">
                  <Shield className="w-64 h-64 text-primary/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-32 h-32 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
