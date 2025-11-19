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
      setSidebarOpen(true); // Ensure sidebar opens if it was collapsed
    }
  };
  
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
       {/* Mobile Sidebar */}
      <div 
        className={cn(
            "fixed inset-y-0 left-0 z-50 h-full w-64 bg-primary text-primary-foreground flex-col border-r border-primary-foreground/10 transition-transform duration-300 ease-in-out md:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar isCollapsed={false} toggleSidebar={toggleSidebar} />
      </div>
      
      {isMobile && isSidebarOpen && (
         <div className="fixed inset-0 z-40 bg-black/60" onClick={toggleSidebar} />
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
         <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        isMobile ? 'w-full' : (isSidebarCollapsed ? "md:ml-20" : "md:ml-64")
      )}>
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
