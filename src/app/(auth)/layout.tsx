import React from "react";
import Image from "next/image";
import { HeartPulse } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex items-center gap-1 text-3xl text-gray-800">
         <h1 className="flex items-center">
            Clar<HeartPulse className="h-8 w-8 text-primary"/>
         </h1>
        <h1 className="">
          <span className="font-bold text-primary">Mi Salud</span>
        </h1>
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
