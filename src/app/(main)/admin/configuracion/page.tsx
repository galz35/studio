
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const generalSchema = z.object({
  limiteCitas: z.coerce.number().min(1),
  horarioInicio: z.string(),
  horarioFin: z.string(),
});

const plantillasSchema = z.object({
  msgConfirmacion: z.string().min(10),
});

const semaforoSchema = z.object({
    semaVerde: z.string().min(10),
    semaAmarillo: z.string().min(10),
    semaRojo: z.string().min(10),
});

export default function ConfiguracionGeneralPage() {
    const { toast } = useToast();

    const generalForm = useForm<z.infer<typeof generalSchema>>({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            limiteCitas: 50,
            horarioInicio: "08:00",
            horarioFin: "17:00",
        }
    });
    
    const plantillasForm = useForm<z.infer<typeof plantillasSchema>>({
        resolver: zodResolver(plantillasSchema),
        defaultValues: {
            msgConfirmacion: "Su cita ha sido confirmada para el día [FECHA] a las [HORA].",
        }
    });
    
    const semaforoForm = useForm<z.infer<typeof semaforoSchema>>({
        resolver: zodResolver(semaforoSchema),
        defaultValues: {
            semaVerde: "Indica un buen estado de salud general, sin síntomas de riesgo.",
            semaAmarillo: "Indica la presencia de síntomas leves o malestares que requieren atención, pero no son una emergencia.",
            semaRojo: "Indica síntomas o condiciones que requieren atención médica prioritaria.",
        }
    });

    const onGeneralSubmit = (data: z.infer<typeof generalSchema>) => {
        console.log("Guardando parámetros generales:", data);
        toast({ title: "Éxito", description: "Los parámetros generales se han guardado." });
    };
    
    const onPlantillasSubmit = (data: z.infer<typeof plantillasSchema>) => {
        console.log("Guardando plantillas:", data);
        toast({ title: "Éxito", description: "Las plantillas de mensajes se han actualizado." });
    };

    const onSemaforoSubmit = (data: z.infer<typeof semaforoSchema>) => {
        console.log("Guardando configuración del semáforo:", data);
        toast({ title: "Éxito", description: "Las descripciones del semáforo se han guardado." });
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración General</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Parámetros Generales</CardTitle>
                <CardDescription>Ajustes globales del sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={generalForm.control}
                  name="limiteCitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite de citas por día</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="space-y-2">
                  <Label>Horarios de Atención (NI, CR, HN)</Label>
                  <div className='flex gap-2 items-start'>
                     <FormField
                        control={generalForm.control}
                        name="horarioInicio"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                     <span>-</span>
                     <FormField
                        control={generalForm.control}
                        name="horarioFin"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input type="time" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        <Form {...plantillasForm}>
          <form onSubmit={plantillasForm.handleSubmit(onPlantillasSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Mensajes</CardTitle>
                <CardDescription>Mensajes automáticos para notificaciones.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={plantillasForm.control}
                  name="msgConfirmacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje de Confirmación de Cita</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
               <CardFooter>
                <Button type="submit">Guardar Plantillas</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        <Form {...semaforoForm}>
            <form onSubmit={semaforoForm.handleSubmit(onSemaforoSubmit)} className="md:col-span-2">
                <Card>
                <CardHeader>
                    <CardTitle>Parámetros del Semáforo</CardTitle>
                    <CardDescription>Explicación de cada nivel para los usuarios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={semaforoForm.control}
                        name="semaVerde"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nivel Verde (Bienestar)</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={semaforoForm.control}
                        name="semaAmarillo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nivel Amarillo (Precaución)</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={semaforoForm.control}
                        name="semaRojo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nivel Rojo (Alerta)</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
                <CardFooter>
                    <Button type="submit">Guardar Descripciones</Button>
                </CardFooter>
                </Card>
            </form>
        </Form>
      </div>
    </div>
  );
}
