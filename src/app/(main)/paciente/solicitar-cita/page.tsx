"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const solicitarCitaSchema = z.object({
  motivoConsulta: z.string().min(10, 'Describe brevemente el motivo principal de tu consulta.'),
  resumenSintomas: z.string().min(20, 'Por favor, detalla tus síntomas.'),
  diagnosticoPrevio: z.string().optional(),
});

type SolicitarCitaFormValues = z.infer<typeof solicitarCitaSchema>;

export default function SolicitarCitaPage() {
  const { usuarioActual } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<SolicitarCitaFormValues>({
    resolver: zodResolver(solicitarCitaSchema),
    defaultValues: {
      motivoConsulta: '',
      resumenSintomas: '',
      diagnosticoPrevio: '',
    }
  });

  const onSubmit: SubmitHandler<SolicitarCitaFormValues> = async (data) => {
    if (!usuarioActual?.idPaciente) {
        toast({ title: "Error", description: "No se pudo identificar al paciente.", variant: "destructive" });
        return;
    }
    
    try {
      await api.solicitarCita(usuarioActual.idPaciente, data.motivoConsulta, data.resumenSintomas, data.diagnosticoPrevio);
      toast({
        title: "Solicitud de Cita Enviada",
        description: "Tu solicitud ha sido enviada. El equipo médico se pondrá en contacto para programar la cita.",
      });
      router.push('/paciente/mis-citas');
    } catch (error) {
      toast({
        title: "Error al Enviar Solicitud",
        description: "No se pudo procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Solicitar Nueva Cita Médica</h1>
      <Card>
        <CardHeader>
          <CardTitle>Describe tu Malestar</CardTitle>
          <CardDescription>
            Completa la siguiente información para que el equipo médico pueda entender tu caso y agendar una cita.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="motivoConsulta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo Principal de la Consulta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: Dolor de cabeza intenso, fiebre, revisión de resultados, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resumenSintomas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalla tus Síntomas</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Describe cuándo empezaron los síntomas, qué los mejora o empeora, y cualquier otro detalle relevante." {...field} />
                    </FormControl>
                     <FormDescription>
                        Mientras más detalles proporciones, mejor podremos ayudarte.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="diagnosticoPrevio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Tienes alguna idea o diagnóstico previo de lo que podría ser? (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: Creo que es una migraña, sospecho que es gripe, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud de Cita"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
