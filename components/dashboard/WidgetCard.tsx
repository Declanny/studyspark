"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export function WidgetCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: WidgetCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className={cn("p-3 rounded-xl", color)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

