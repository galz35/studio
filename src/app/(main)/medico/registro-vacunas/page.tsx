"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import * as api from '@/lib/services/api.mock';
import type { Paciente } from '@/lib/types/domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const vacunaSchema = z.object({
    idPaciente: z.string().min(1, "Debe seleccionar un paciente."),
    tipoVacuna: z.string().min(1, "El tipo de vacuna es requerido."),
    dosis: z.string().min(1, "La dosis es requerida."),
    fechaAplicacion: z.date({ required_error: "La fecha de aplicación es requerida." }),
    observaciones: z.string().optional(),
});

type VacunaFormValues = z.infer<typeof vacunaSchema>;

export default function RegistroVacunasPage() {
    const { pais, userProfile } = useUserProfile();
    const { toast } = useToast();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<VacunaFormValues>({
        resolver: zodResolver(vacunaSchema),
        defaultValues: {
            fechaAplicacion: new Date(),
        }
    });

    useEffect(() => {
        if (pais) {
            api.getPacientes({ pais })
                .then(data => {
                    setPacientes(data);
                    setLoading(false);
                });
        }
    }, [pais]);

    const onSubmit = async (data: VacunaFormValues) => {
        if (!userProfile?.idMedico) return;
        
        try {
            // await api.registrarVacuna({
            //     ...data,
            //     idMedico: userProfile.idMedico,
            //     fechaAplicacion: data.fechaAplicacion.toISOString().split('T')[0],
            // });

            const paciente = pacientes.find(p => p.id === data.idPaciente);
            toast({
                title: "Vacuna Registrada",
                description: `Se ha registrado la vacuna a ${paciente?.nombreCompleto}.`
            });
            form.reset({ fechaAplicacion: new Date() });

        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo registrar la vacuna.",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Registro de Vacunas</h1>
            <Card className='max-w-2xl mx-auto'>
                <CardHeader>
                    <CardTitle>Registrar Nueva Vacuna Aplicada</CardTitle>
                    <CardDescription>Seleccione el paciente y complete los datos de la vacuna.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="idPaciente"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paciente</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un paciente..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {loading ? <SelectItem value="loading" disabled>Cargando...</SelectItem> : 
                                                pacientes.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombreCompleto}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoVacuna"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Vacuna</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Influenza">Influenza</SelectItem>
                                                    <SelectItem value="COVID-19">COVID-19</SelectItem>
                                                    <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                                                    <SelectItem value="Tétanos">Tétanos</SelectItem>
                                                    <SelectItem value="Otra">Otra</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dosis"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dosis</FormLabel>
                                            <FormControl><Input placeholder="Ej: Anual 2024, Refuerzo 2, Única" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="fechaAplicacion"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Aplicación</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Seleccione fecha</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observaciones (Opcional)</FormLabel>
                                        <FormControl><Textarea placeholder="Lote, centro de vacunación, etc." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Registrar Vacuna
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
