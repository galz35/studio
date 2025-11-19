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
      <div className="mb-8 flex items-baseline gap-1 text-3xl text-gray-800">
        <h1 className="font-normal">Clar</h1>
        <HeartPulse className="h-7 w-7 text-primary" />
        <h1 className="font-bold text-primary">Mi Salud</h1>
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
