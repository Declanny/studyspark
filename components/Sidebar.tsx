"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  BookOpen,
  Trophy,
  Shield,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["student", "admin"],
  },
  {
    label: "AI Study",
    href: "/study",
    icon: BookOpen,
    roles: ["student", "admin"],
  },
  {
    label: "Quizzes",
    href: "/quiz",
    icon: Trophy,
    roles: ["student", "admin"],
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["admin"],
  },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role || "student")
  );

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" onClick={onNavigate}>
          <h2 className="text-2xl font-bold text-primary">StudySpark</h2>
          <p className="text-xs text-muted-foreground mt-1">
            AI-Powered Study Assistant
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive ? "" : "hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.course}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Sidebar
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex w-64 border-r bg-background flex-col fixed left-0 top-0 h-screen z-30">
      <SidebarContent />
    </aside>
  );
}

// Mobile Sidebar
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// Sidebar wrapper that includes both desktop and mobile
export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
