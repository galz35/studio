"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import * as api from '@/lib/services/api.mock';
import { EmpleadoEmp2024 } from '@/lib/types/domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const chequeoSchema = z.object({
  estadoAnimo: z.string().min(1, 'Requerido'),
  modalidadTrabajo: z.string().min(1, 'Requerido'),
  ruta: z.string().min(1, 'Requerido'),
  aptoLaboral: z.boolean().default(false),
  alergiasActivas: z.boolean().default(false),
  alergiasDescripcion: z.string().optional(),
  calidadSueno: z.string().min(1, 'Requerido'),
  consumoAgua: z.string().min(1, 'Requerido'),
  yaConsultoMedico: z.boolean().default(false),
  motivoNoAcudirMedico: z.string().optional(),
  comentarioGeneral: z.string().optional(),
}).refine(data => !data.alergiasActivas || (data.alergiasActivas && data.alergiasDescripcion), {
  message: 'Debe describir sus alergias.',
  path: ['alergiasDescripcion'],
});

type ChequeoFormValues = z.infer<typeof chequeoSchema>;

export default function ChequeoDiarioPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const [empleado, setEmpleado] = useState<EmpleadoEmp2024 | null>(null);

  const form = useForm<ChequeoFormValues>({
    resolver: zodResolver(chequeoSchema),
    defaultValues: {
      aptoLaboral: true,
      alergiasActivas: false,
      yaConsultoMedico: false,
      alergiasDescripcion: '',
      motivoNoAcudirMedico: '',
      comentarioGeneral: '',
      estadoAnimo: '',
      modalidadTrabajo: '',
      ruta: '',
      calidadSueno: '',
      consumoAgua: '',
    },
  });

  const alergiasActivas = form.watch('alergiasActivas');

  useEffect(() => {
    if (userProfile) {
      api.getEmpleados().then(empleados => {
        const info = empleados.find(e => e.carnet === userProfile.carnet);
        if (info) setEmpleado(info);
      });
    }
  }, [userProfile]);

  const onSubmit: SubmitHandler<ChequeoFormValues> = async (data) => {
    if (!userProfile?.id) return;
    
    try {
      await api.crearChequeo({
        ...data,
        idPaciente: userProfile.id,
        // Fake semaforo logic
        nivelSemaforo: data.calidadSueno === 'Mala' || data.estadoAnimo === 'Estresado(a)' ? 'A' : 'V',
        estadoChequeo: 'Completado',
      });
      toast({
        title: "Chequeo enviado con éxito",
        description: "Gracias por completar su chequeo de bienestar diario.",
        variant: 'default',
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo guardar su chequeo. Intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chequeo de Bienestar Diario</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Datos del Colaborador</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <p><strong className="font-medium">Carnet:</strong> {empleado?.carnet}</p>
              <p><strong className="font-medium">Nombre:</strong> {empleado?.nombreCompleto}</p>
              <p><strong className="font-medium">Gerencia:</strong> {empleado?.gerencia}</p>
              <p><strong className="font-medium">Área:</strong> {empleado?.area}</p>
              <p><strong className="font-medium">Jefe Inmediato:</strong> {empleado?.nomJefe}</p>
              <p><strong className="font-medium">Correo:</strong> {empleado?.correo}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Bienestar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField control={form.control} name="estadoAnimo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de ánimo hoy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Contento(a)">Contento(a)</SelectItem><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Estresado(a)">Estresado(a)</SelectItem><SelectItem value="Triste">Triste</SelectItem></SelectContent>
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
                <FormField control={form.control} name="ruta" render={({ field }) => (
                  <FormItem><FormLabel>Ruta / Sede</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
              </div>

              <div className="space-y-4">
                <FormField control={form.control} name="alergiasActivas" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none"><FormLabel>¿Presenta alergias activas?</FormLabel></div>
                  </FormItem>
                )} />
                {alergiasActivas && <FormField control={form.control} name="alergiasDescripcion" render={({ field }) => (
                  <FormItem><FormLabel>Descripción de alergias</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />}
              </div>
              
              <FormField control={form.control} name="comentarioGeneral" render={({ field }) => (
                <FormItem><FormLabel>Comentario General</FormLabel><FormControl><Textarea placeholder="Cualquier otro síntoma o comentario..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="aptoLaboral" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none"><FormLabel>¿Se siente apto(a) para laborar?</FormLabel></div>
                </FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Enviando..." : "Enviar Chequeo"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
