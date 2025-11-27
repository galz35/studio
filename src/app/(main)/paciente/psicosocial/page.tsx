
"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import * as api from '@/lib/services/api.mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const psicosocialSchema = z.object({
  estadoAnimo: z.string().min(1, 'Requerido'),
  nivelEstres: z.string().min(1, 'Requerido'),
  comentarioGeneral: z.string().optional(),
});

type PsicosocialFormValues = z.infer<typeof psicosocialSchema>;

export default function PacientePsicosocialPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();

  const form = useForm<PsicosocialFormValues>({
    resolver: zodResolver(psicosocialSchema),
    defaultValues: {
      estadoAnimo: '',
      nivelEstres: '',
      comentarioGeneral: '',
    },
  });

  const onSubmit: SubmitHandler<PsicosocialFormValues> = async (data) => {
    if (!userProfile?.id) return;
    
    try {
      await api.crearChequeo({
        idPaciente: userProfile.id,
        estadoAnimo: data.estadoAnimo,
        // Mocking other required fields for ChequeoBienestar
        ruta: "Psicosocial",
        modalidadTrabajo: "N/A",
        calidadSueno: "N/A",
        consumoAgua: "N/A",
        nivelSemaforo: data.nivelEstres === 'Alto' ? 'A' : 'V',
        estadoChequeo: 'Completado',
        comentarioGeneral: data.comentarioGeneral,
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
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Auto-Chequeo Emocional</CardTitle>
          <CardDescription>Este es un espacio confidencial para que registres cómo te sientes. Esta información ayuda al equipo de salud a apoyarte mejor.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
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
              <FormField control={form.control} name="comentarioGeneral" render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Hay algo más que quieras compartir? (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Puedes hablar sobre lo que te preocupa, lo que te ha hecho sentir bien, o cualquier otra cosa que consideres importante."
                      rows={5}
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
