"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { usuarioActual, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // If auth has loaded and there's no user, redirect to login
    if (!authLoading && !usuarioActual) {
      router.push("/login");
    }
  }, [usuarioActual, authLoading, router]);

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
    if (isMobile) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setSidebarCollapsed(!isSidebarCollapsed);
      setSidebarOpen(true); // Ensure sidebar opens if it was collapsed
    }
  };
  
  const loading = authLoading || profileLoading;

  if (loading || !usuarioActual || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
         <div className="fixed inset-0 z-40 bg-black/60" onClick={toggleSidebar} />
      )}
      
      {/* Sidebar Container */}
      <div 
        className={cn(
            "fixed inset-y-0 left-0 z-50 h-full bg-primary text-primary-foreground flex-col border-r border-primary-foreground/10 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            // Mobile state
            isMobile && (isSidebarOpen ? "translate-x-0" : "-translate-x-full"),
            // Desktop state
            !isMobile && (isSidebarCollapsed ? "w-20" : "w-64")
        )}
      >
        <Sidebar isCollapsed={isMobile ? false : isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 flex-col">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
