"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
}

export function WidgetCard({
  title,
  description,
  icon: Icon,
  href,
  bgColor,
  iconBg,
  iconColor,
}: WidgetCardProps) {
  return (
    <Link href={href}>
      <Card className={cn(
        "hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border rounded-2xl",
        "bg-white border-[#EFE6FD]"
      )}>
        <div className="p-5 h-[95px] flex items-center gap-4">
          <div className={cn(
            "w-[77px] h-[70px] rounded-lg flex items-center justify-center shrink-0",
            iconBg
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-semibold text-base mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

