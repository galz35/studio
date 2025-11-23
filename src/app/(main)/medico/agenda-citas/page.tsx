"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { CasoClinico, Paciente, Medico, TriajeIA } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarPlus, Ban, Loader2, Sparkles } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type CasoConPaciente = CasoClinico & { paciente?: Paciente };

export default function GestionCitasPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm();

  const [casos, setCasos] = useState<CasoConPaciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCaso, setSelectedCaso] = useState<CasoConPaciente | null>(null);
  const [isAgendarOpen, setAgendarOpen] = useState(false);
  const [isAnalisisOpen, setAnalisisOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const [casosRes, medicosRes] = await Promise.all([
            fetch(`/api/casos?pais=${pais}&estado=abierto`),
            fetch(`/api/medicos`)
        ]);

        if (!casosRes.ok || !medicosRes.ok) {
            throw new Error('No se pudieron cargar los datos necesarios.');
        }

        const casosData = await casosRes.json();
        const medicosData = await medicosRes.json();

        setCasos(casosData);
        setMedicos(medicosData);

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error de Carga', description: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pais]);
  

  const handleAgendar = async (formData: any) => {
    if (!selectedCaso) return;
    setIsSubmitting(true);

    const body = {
        idCaso: selectedCaso.id!,
        idPaciente: selectedCaso.idPaciente,
        idMedico: formData.idMedico,
        fechaCita: formData.fechaCita,
        horaCita: formData.horaCita,
        pais: pais,
    };
    
    try {
        const response = await fetch('/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        toast({ title: 'Cita Agendada', description: `Se ha agendado una cita para ${selectedCaso.paciente?.nombreCompleto}.` });
        setAgendarOpen(false);
        setSelectedCaso(null);
        fetchData(); // Refresh data
    } catch(e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: e.message || 'No se pudo agendar la cita.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleCancelar = async (caso: CasoConPaciente) => {
     const isConfirmed = await confirm({
        title: '¿Confirmar Cancelación?',
        description: `Esta acción marcará la solicitud de ${caso.paciente?.nombreCompleto} como cancelada. No se puede deshacer.`
     });

     if (isConfirmed) {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/casos/${caso.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoCaso: 'Cancelado', notasCancelacion: 'Cancelado por médico durante triaje.' })
            });
            if (!response.ok) throw new Error('No se pudo cancelar la solicitud.');

            toast({ title: 'Solicitud Cancelada', description: `Se ha cancelado la solicitud de ${caso.paciente?.nombreCompleto}.`, variant: 'destructive'});
            fetchData(); // Refresh data
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
     }
  }

  const getUrgenciaClass = (nivel?: "Baja" | "Moderada" | "Alta" | "Emergencia") => {
    switch (nivel) {
        case "Baja": return "bg-green-100 text-green-800";
        case "Moderada": return "bg-yellow-100 text-yellow-800";
        case "Alta": return "bg-orange-100 text-orange-800";
        case "Emergencia": return "bg-red-100 text-red-800 font-bold";
        default: return "bg-gray-100";
    }
  }

  const columns = [
    {
      accessor: (row: CasoConPaciente) => new Date(row.fechaCreacion).toLocaleDateString('es-ES'),
      header: 'F. Solicitud',
    },
    {
      accessor: (row: CasoConPaciente) => row.paciente?.nombreCompleto || 'Cargando...',
      header: 'Paciente',
    },
    { accessor: 'motivoConsulta', header: 'Motivo' },
    {
      accessor: 'nivelSemaforo',
      header: 'Semáforo',
      cell: (row: CasoConPaciente) => <SemaforoBadge nivel={row.nivelSemaforo} />,
    },
    {
        accessor: 'triajeIA',
        header: 'Análisis IA',
        cell: (row: CasoConPaciente) => {
            if (row.triajeIA) {
                return <Button variant="outline" size="sm" className="gap-2" onClick={() => { setSelectedCaso(row); setAnalisisOpen(true); }}><Sparkles className='h-4 w-4 text-primary' /> Ver Análisis</Button>
            }
            if (row.estadoCaso === 'Abierto') {
                 return <Badge variant="secondary">Pendiente...</Badge>
            }
            return <Badge variant="secondary">{row.estadoCaso}</Badge>
        }
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CasoConPaciente) => (
        <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => { setSelectedCaso(row); setAgendarOpen(true); }}>
              <CalendarPlus className="h-4 w-4"/> <span>Agendar</span>
            </Button>
            <Button size="sm" variant="destructive" className="gap-2" onClick={() => handleCancelar(row)}>
                <Ban className="h-4 w-4"/> <span>Cancelar</span>
            </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold">Gestión de Citas (Triaje)</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>Casos abiertos y casos con análisis de IA pendientes de ser agendados.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={casos} filterColumn="motivoConsulta" filterPlaceholder='Filtrar por motivo...' />
        </CardContent>
      </Card>
      
      {/* Agendar Modal */}
      <Dialog open={isAgendarOpen} onOpenChange={(open) => { if(!open) setSelectedCaso(null); setAgendarOpen(open); }}>
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Agendar Cita para {selectedCaso?.paciente?.nombreCompleto}</DialogTitle>
            </DialogHeader>
            <form id="agendar-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                handleAgendar(data);
            }}>
                <div className="space-y-4 py-4">
                    <p><strong>Motivo:</strong> {selectedCaso?.motivoConsulta}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fecha-cita">Fecha</Label>
                            <Input id="fecha-cita" name="fechaCita" type="date" required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hora-cita">Hora</Label>
                            <Input id="hora-cita" name="horaCita" type="time" required/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="medico-cita">Asignar Médico</Label>
                        <Select name="idMedico" required>
                            <SelectTrigger id="medico-cita"><SelectValue placeholder="Seleccione un médico" /></SelectTrigger>
                            <SelectContent>
                                {medicos?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nombreCompleto}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cerrar</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Cita
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* Analisis IA Modal */}
      <Dialog open={isAnalisisOpen} onOpenChange={(open) => { if(!open) setSelectedCaso(null); setAnalisisOpen(open); }}>
         <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>Análisis de Triaje por IA</DialogTitle>
                <DialogDescription>Paciente: {selectedCaso?.paciente?.nombreCompleto}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-sm">
                <div>
                    <Label className="text-muted-foreground">Síntomas Reportados</Label>
                    <p className="font-semibold">{selectedCaso?.motivoConsulta}</p>
                </div>
                 <div className="space-y-2 rounded-lg bg-muted p-4">
                    <h4 className="font-bold">Análisis de la IA</h4>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Nivel de Urgencia</span>
                        <Badge className={cn(getUrgenciaClass(selectedCaso?.triajeIA?.nivel_urgencia))}>{selectedCaso?.triajeIA?.nivel_urgencia}</Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Especialidad Sugerida</span>
                        <span className="font-semibold">{selectedCaso?.triajeIA?.especialidad_sugerida}</span>
                    </div>
                     <div className="space-y-1">
                        <span className="text-muted-foreground">Resumen para el Médico</span>
                        <p className="font-semibold italic">"{selectedCaso?.triajeIA?.resumen_medico}"</p>
                    </div>
                     <div className="space-y-1">
                        <span className="text-muted-foreground">Acción Recomendada</span>
                        <p className="font-semibold text-primary">{selectedCaso?.triajeIA?.accion_recomendada}</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cerrar</Button></DialogClose>
                 <Button onClick={() => { setAnalisisOpen(false); setAgendarOpen(true); }}><CalendarPlus className="mr-2 h-4 w-4" /> Proceder a Agendar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
