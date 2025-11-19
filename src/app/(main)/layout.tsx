"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setSidebarOpen(false);
    } else {
      setSidebarCollapsed(false);
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if(isMobile) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setSidebarCollapsed(!isSidebarCollapsed);
    }
  };
  
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {isMobile && isSidebarOpen && (
         <div className="fixed inset-0 z-30 bg-black/60" onClick={toggleSidebar} />
      )}
      <div className={cn(
          "fixed top-0 left-0 h-full z-40 bg-primary text-primary-foreground flex-col border-r border-primary-foreground/10 transition-transform duration-300 ease-in-out md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isCollapsed={false} toggleSidebar={toggleSidebar} />
      </div>

      <div className="hidden md:flex">
         <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 flex-col">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out", 
          isMobile ? '' : (isSidebarCollapsed ? "md:ml-20" : "md:ml-64")
        )}>
           {children}
        </main>
      </div>
    </div>
  );
}
