import React from "react";
import Image from "next/image";
import { HeartPulse } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-3">
         <HeartPulse className="h-8 w-8 text-primary"/>
        <h1 className="text-3xl font-bold text-foreground">
          Claro <span className="text-primary">Bienestar</span>
        </h1>
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
