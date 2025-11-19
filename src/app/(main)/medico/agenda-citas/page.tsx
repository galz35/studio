"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { CasoClinico, Paciente, Medico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarPlus, Ban } from 'lucide-react';

type CasoConPaciente = CasoClinico & { paciente: Paciente };

export default function GestionCitasPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const [casos, setCasos] = useState<CasoConPaciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaso, setSelectedCaso] = useState<CasoConPaciente | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCasosClinicos({ estado: 'Abierto', pais }),
      api.getMedicos({ pais })
    ]).then(([casosRes, medicosRes]) => {
      const casosConPaciente = casosRes.map(caso => ({
        ...caso,
        paciente: api.mockPacientes.find(p => p.idPaciente === caso.idPaciente)!,
      }));
      setCasos(casosConPaciente);
      setMedicos(medicosRes);
      setLoading(false);
    });
  }, [pais]);

  const handleAgendar = (formData: any) => {
    if (!selectedCaso) return;

    api.agendarCitaDesdeCaso(
      selectedCaso.idCaso,
      formData.idMedico,
      formData.fechaCita,
      formData.horaCita,
      'AGENDADA_POR_MEDICO'
    );
    toast({ title: 'Cita Agendada', description: `Se ha agendado una cita para ${selectedCaso.paciente.nombreCompleto}.` });
    // Remove from list
    setCasos(prev => prev.filter(c => c.idCaso !== selectedCaso.idCaso));
    setSelectedCaso(null);
  };
  
  const handleCancelar = (motivo: string) => {
     if (!selectedCaso) return;
     console.log(`Caso ${selectedCaso.idCaso} cancelado por: ${motivo}`);
     toast({ title: 'Solicitud Cancelada', description: `Se ha cancelado la solicitud de ${selectedCaso.paciente.nombreCompleto}.`, variant: 'destructive'});
     setCasos(prev => prev.filter(c => c.idCaso !== selectedCaso.idCaso));
     setSelectedCaso(null);
  }


  const columns = [
    {
      accessor: (row: CasoConPaciente) => new Date(row.fechaCreacion).toLocaleDateString('es-ES'),
      header: 'F. Solicitud',
    },
    {
      accessor: (row: CasoConPaciente) => row.paciente.nombreCompleto,
      header: 'Paciente',
    },
    { accessor: 'motivoConsulta', header: 'Motivo Resumido' },
    {
      accessor: 'nivelSemaforo',
      header: 'Semáforo',
      cell: (row: CasoConPaciente) => <SemaforoBadge nivel={row.nivelSemaforo} />,
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CasoConPaciente) => (
        <div className="flex gap-2">
            <Dialog onOpenChange={(open) => !open && setSelectedCaso(null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setSelectedCaso(row)}>
                  <CalendarPlus className="h-4 w-4"/> Agendar
                </Button>
              </DialogTrigger>
            </Dialog>
            <Dialog onOpenChange={(open) => !open && setSelectedCaso(null)}>
                 <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="gap-2" onClick={() => setSelectedCaso(row)}>
                        <Ban className="h-4 w-4"/> Cancelar
                    </Button>
                </DialogTrigger>
            </Dialog>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando solicitudes...</div>;

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold">Gestión de Citas (Triaje)</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes de Agendar</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={casos} filterColumn="motivoConsulta" filterPlaceholder='Filtrar por motivo...' />
        </CardContent>
      </Card>
      
      {/* Agendar Modal */}
      <Dialog open={!!(selectedCaso && !selectedCaso.idCita)} onOpenChange={(open) => !open && setSelectedCaso(null)}>
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Agendar Cita para {selectedCaso?.paciente.nombreCompleto}</DialogTitle>
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
                            <Input id="fecha-cita" name="fechaCita" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hora-cita">Hora</Label>
                            <Input id="hora-cita" name="horaCita" type="time" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="medico-cita">Asignar Médico</Label>
                        <Select name="idMedico">
                            <SelectTrigger id="medico-cita"><SelectValue placeholder="Seleccione un médico" /></SelectTrigger>
                            <SelectContent>
                                {medicos.map(m => <SelectItem key={m.idMedico} value={String(m.idMedico)}>{m.nombreCompleto}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cerrar</Button></DialogClose>
                    <Button type="submit">Confirmar Cita</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* Cancelar Modal */}
      <Dialog open={!!selectedCaso} onOpenChange={(open) => !open && setSelectedCaso(null)}>
        <DialogContent>
             <DialogHeader>
                <DialogTitle>Cancelar Solicitud de {selectedCaso?.paciente.nombreCompleto}</DialogTitle>
             </DialogHeader>
             <form id="cancelar-form" onSubmit={(e) => {
                 e.preventDefault();
                 const motivo = (e.currentTarget.elements.namedItem('motivo-cancelacion') as HTMLTextAreaElement).value;
                 handleCancelar(motivo);
             }}>
                <div className="space-y-4 py-4">
                     <Label htmlFor="motivo-cancelacion">Motivo de la cancelación</Label>
                     <Textarea id="motivo-cancelacion" name="motivo-cancelacion" placeholder="Especifique por qué se cancela la solicitud (ej: datos insuficientes, contactado por otro medio, etc.)"/>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cerrar</Button></DialogClose>
                    <Button type="submit" variant="destructive">Confirmar Cancelación</Button>
                </DialogFooter>
             </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
