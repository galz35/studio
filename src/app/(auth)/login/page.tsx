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
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  carnet: z.string().min(1, { message: "El carnet es requerido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      carnet: "",
      password: "",
    },
  });

  useEffect(() => {
    // If user is authenticated, redirect them to the main layout
    // The main layout will handle role-based redirection
    if (user) {
      router.push("/paciente/dashboard"); // Default redirect
    }
  }, [user, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await login(data.carnet, data.password);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingrese su carnet y contraseña para acceder al sistema.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="carnet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carnet de Empleado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: P001, M001, A001" {...field} />
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
                    <Input type="password" {...field} />
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
            <div className="text-center text-sm">
              <Link
                href="/primer-acceso"
                className="text-muted-foreground underline"
              >
                Primer acceso
              </Link>
              {" | "}
              <Link
                href="/recuperar-contrasena"
                className="text-muted-foreground underline"
              >
                Olvidé mi contraseña
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
      <Card className="mt-4 border-dashed">
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Usuarios de Prueba</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
            <p><strong>Paciente:</strong> carnet `P001`</p>
            <p><strong>Médico:</strong> carnet `M001`</p>
            <p><strong>Admin:</strong> carnet `A001`</p>
            <p className="font-semibold">Contraseña para todos: <code className="bg-muted px-2 py-1 rounded">12345</code></p>
        </CardContent>
      </Card>
    </Card>
  );
}
