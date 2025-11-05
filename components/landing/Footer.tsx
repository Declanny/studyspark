"use client";

import { Sparkles, Mail, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16 max-w-[1328px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/s.png" alt="StudySpark" className="h-8 w-8" />
              <span className="text-2xl font-bold">
                Study<span className="text-primary">Spark</span>
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed max-w-xs">
              AI-powered study platform helping students excel with personalized learning and gamified practice.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Quick Links</h3>
            <ul className="space-y-3">
              {["Features", "Security", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Legal</h3>
            <ul className="space-y-3">
              {["Terms", "Privacy"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-background">Follow Us</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-background">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-primary"
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-background/50">
              Get updates on new features and study tips. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/70">
              © 2025 StudySpark. Built with ❤️ for working-class students.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/auth/register">
                <Button variant="outline" size="sm" className="border-background/20 text-background hover:bg-background/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Logo */}
        <div className="mt-12 flex justify-center opacity-20">
          <Sparkles className="w-24 h-24" />
        </div>
      </div>
    </footer>
  );
}
