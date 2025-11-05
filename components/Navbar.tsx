"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LogOut,
  Menu,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Study", href: "/study" },
    { name: "Quiz", href: "/quiz" },
    { name: "History", href: "/careers" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background w-full">
      <div className="container mx-auto px-4 pt-8 max-w-[1216px]">
        {/* Full-width navigation container with logo, links, and profile inside */}
        <div className="hidden md:flex items-center justify-between w-full h-[65px] rounded-full border border-[#EFE6FD] bg-white px-4">
          {/* Logo - Left side */}
          <Link href="/dashboard" className="flex items-center space-x-2 pl-2">
            <img src="/s.png" alt="StudySpark" className="h-8 w-8" />
            <span className="font-bold text-xl">
              Study<span className="text-primary">Spark</span>
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="flex items-center gap-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button
                  className={`px-4 h-[49px] rounded-[64px] text-sm font-medium transition-all whitespace-nowrap ${
                    pathname === item.href
                      ? "bg-[#221E28] text-white shadow-sm"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            ))}
          </div>

          {/* User Menu - Right side */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-12 w-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer border border-[#FDA7BF]">
                <div className="h-full w-full rounded-full bg-[#FC6075] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? getInitials(user.name) : "U"}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile View - Separate layout */}
        <div className="flex md:hidden items-center justify-between h-[65px]">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img src="/s.png" alt="StudySpark" className="h-8 w-8" />
            <span className="font-bold text-xl">
              Study<span className="text-primary">Spark</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-12 w-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer border border-[#FDA7BF]">
                  <div className="h-full w-full rounded-full bg-[#FC6075] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={pathname === item.href ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
