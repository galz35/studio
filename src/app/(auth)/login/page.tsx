"use client";

import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import type { Rol } from "@/lib/types/domain";

const loginSchema = z.object({
  carnet: z.string().min(1, { message: "El carnet es requerido." }),
  rol: z.enum(["PACIENTE", "MEDICO", "ADMIN"], {
    required_error: "Debe seleccionar un rol.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { loginFake } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      carnet: "",
      rol: "PACIENTE",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginFake(data.carnet, data.rol as Rol);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingrese su carnet y seleccione su rol para acceder al sistema.
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
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol de Acceso</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PACIENTE">Paciente</SelectItem>
                      <SelectItem value="MEDICO">Médico</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Iniciar Sesión
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
    </Card>
  );
}
