"use client";

import { DesktopSidebar, MobileSidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showNavbar?: boolean;
}

export function AppLayout({
  children,
  showSidebar = true,
  showNavbar = true,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <DesktopSidebar />}

      {/* Main content area */}
      <div className={showSidebar ? "lg:pl-64" : ""}>
        {showNavbar && (
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center h-16 px-4">
              {showSidebar && <MobileSidebar />}
              <div className="flex-1">
                <Navbar />
              </div>
            </div>
          </header>
        )}

        <main className={showNavbar ? "" : ""}>
          {children}
        </main>
      </div>
    </div>
  );
}
