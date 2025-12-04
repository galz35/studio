"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import { PacienteService } from '@/lib/services/paciente.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const psicosocialSchema = z.object({
  nivelEstres: z.string().min(1, 'Requerido'),
  estadoAnimo: z.string().min(1, 'Requerido'),
  calidadSueno: z.string().min(1, 'Requerido'),
  consumoAgua: z.string().min(1, 'Requerido'),
  modalidadTrabajo: z.string().min(1, 'Requerido'),
  comentarioGeneral: z.string().optional(),
});

type PsicosocialFormValues = z.infer<typeof psicosocialSchema>;

export default function PacientePsicosocialPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();

  const form = useForm<PsicosocialFormValues>({
    resolver: zodResolver(psicosocialSchema),
    defaultValues: {
      nivelEstres: '',
      estadoAnimo: '',
      calidadSueno: '',
      consumoAgua: '',
      modalidadTrabajo: '',
      comentarioGeneral: '',
    },
  });

  const onSubmit: SubmitHandler<PsicosocialFormValues> = async (data) => {
    if (!userProfile?.idPaciente) return;

    try {
      await PacienteService.crearChequeo({
        idPaciente: userProfile.idPaciente,
        // New fields
        nivelEstres: data.nivelEstres,
        estadoAnimo: data.estadoAnimo,
        calidadSueno: data.calidadSueno,
        consumoAgua: data.consumoAgua,
        modalidadTrabajo: data.modalidadTrabajo,
        comentarioGeneral: data.comentarioGeneral,
        // Mocking other required fields for ChequeoBienestar
        ruta: "Psicosocial",
        nivelSemaforo: data.nivelEstres === 'Alto' || data.calidadSueno === 'Mala' ? 'A' : 'V',
        estadoChequeo: 'Completado',
      });
      toast({
        title: "Registro Enviado",
        description: "Gracias por compartir cómo te sientes. Tu bienestar es importante.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo guardar tu registro. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienestar Psicosocial</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Auto-Chequeo Emocional</CardTitle>
          <CardDescription>Este es un espacio confidencial para que registres cómo te sientes. Esta información ayuda al equipo de salud a apoyarte mejor.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="nivelEstres" render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cuál es tu nivel de estrés general últimamente?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Bajo">Bajo</SelectItem>
                        <SelectItem value="Medio">Medio</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="estadoAnimo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cómo describirías tu estado de ánimo general?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Bien">Bien</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Decaído">Decaído / Triste</SelectItem>
                        <SelectItem value="Ansioso">Ansioso / Nervioso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-semibold mb-4">Contexto y Hábitos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="calidadSueno" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calidad del sueño anoche</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Buena">Buena</SelectItem><SelectItem value="Regular">Regular</SelectItem><SelectItem value="Mala">Mala</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="consumoAgua" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumo de agua ayer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Más de 2 litros">Más de 2 litros</SelectItem><SelectItem value="Entre 1 y 2 litros">Entre 1 y 2 litros</SelectItem><SelectItem value="Menos de 1 litro">Menos de 1 litro</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="modalidadTrabajo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalidad de Trabajo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Presencial">Presencial</SelectItem><SelectItem value="Remoto">Remoto</SelectItem><SelectItem value="Híbrido">Híbrido</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="comentarioGeneral" render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Hay algo más que quieras compartir? (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Puedes hablar sobre lo que te preocupa, lo que te ha hecho sentir bien, o cualquier otra cosa que consideres importante."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Registro
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
