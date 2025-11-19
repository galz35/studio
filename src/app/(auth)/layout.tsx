import React from "react";
import Image from "next/image";
import { HeartPulse } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 flex items-center gap-3">
         <HeartPulse className="h-8 w-8 text-primary"/>
        <h1 className="text-3xl font-bold text-gray-800">
          Médica <span className="font-light text-primary">Corporativo</span>
        </h1>
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
