"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext"; // Import directly from context or update hook

const loginSchema = z.object({
  carnet: z.string().min(1, { message: "El carnet es requerido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading, user, error } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      carnet: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Redirect logic is handled in login, but if already logged in:
      // We might want to redirect based on role.
      // For now, let's assume the context handles it or we do it here.
      // Since context.login handles redirect, we might not need this if we trust the state.
      // But on refresh, we might want to redirect if on login page.
      if (user.rol === 'PACIENTE') router.push("/paciente/dashboard");
      else if (user.rol === 'MEDICO') router.push("/medico/dashboard");
      else if (user.rol === 'ADMIN') router.push("/admin/dashboard");
    }
  }, [user, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login(data.carnet, data.password);
    } catch (e) {
      // Error is handled in context and set in 'error' state, but we can also show toast here if we wanted
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingrese sus credenciales para acceder al sistema.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="carnet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carnet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: ADMIN001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
            {/* Links removed for clarity/MVP as they might not work yet */}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
