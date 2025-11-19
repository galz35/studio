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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out", 
          isMobile ? 'ml-0' : (isSidebarCollapsed ? "ml-20" : "ml-64")
        )}>
           {children}
        </main>
      </div>
    </div>
  );
}
