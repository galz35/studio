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

import { analyzePsychosocial } from '@/actions/analyze-psychosocial';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, BrainCircuit } from 'lucide-react';

export default function PacientePsicosocialPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const [aiResult, setAiResult] = React.useState<any>(null);

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
    if (!userProfile?.idPaciente) {
      toast({
        title: "Error de perfil",
        description: "No se encontró un perfil de paciente asociado. Por favor, contacta al soporte o intenta iniciar sesión nuevamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Call AI Analysis
      const aiResponse = await analyzePsychosocial(data);
      let aiData = null;

      if (aiResponse.success) {
        aiData = aiResponse.data;
        setAiResult(aiData);
      }

      // 2. Save to Database
      await PacienteService.crearChequeo({
        idPaciente: userProfile.idPaciente,
        nivelEstres: data.nivelEstres,
        estadoAnimo: data.estadoAnimo,
        calidadSueno: data.calidadSueno,
        consumoAgua: data.consumoAgua,
        modalidadTrabajo: data.modalidadTrabajo,
        comentarioGeneral: data.comentarioGeneral,
        ruta: "Psicosocial",
        nivelSemaforo: aiData ? (aiData.nivelRiesgo === 'Alto' ? 'R' : aiData.nivelRiesgo === 'Medio' ? 'A' : 'V') : (data.nivelEstres === 'Alto' ? 'A' : 'V'),
        estadoChequeo: 'Completado',
        datos_completos: aiData || {}, // Save AI result in JSONB
      });

      toast({
        title: "Registro Enviado",
        description: "Gracias por compartir cómo te sientes.",
      });
      // Don't reset form immediately so user can see AI result
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo guardar tu registro. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (aiResult) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Resultados de tu Análisis</h1>

        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">¡Registro Completado!</AlertTitle>
          <AlertDescription className="text-green-700">
            Hemos analizado tus respuestas con nuestra IA. Aquí tienes un resumen personalizado.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Análisis de Bienestar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="italic text-lg text-center">"{aiResult.mensajePaciente}"</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Análisis Detallado:</h3>
              <p className="text-muted-foreground">{aiResult.analisis}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recomendaciones para ti:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {aiResult.recomendaciones.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => { setAiResult(null); form.reset(); }} className="w-full">
              Realizar otro chequeo
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienestar Psicosocial</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Auto-Chequeo Emocional</CardTitle>
          <CardDescription>Este es un espacio confidencial para que registres cómo te sientes. Nuestra IA analizará tus respuestas para brindarte apoyo inmediato.</CardDescription>
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
                {form.formState.isSubmitting ? 'Analizando con IA...' : 'Enviar y Analizar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
