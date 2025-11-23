"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarPlus, Ban, Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { collection, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useConfirm } from '@/hooks/use-confirm';

type CasoConPaciente = CasoClinico & { paciente?: Paciente, id?: string };

export default function GestionCitasPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const [ConfirmDialog, confirm] = useConfirm();

  const [selectedCaso, setSelectedCaso] = useState<CasoConPaciente | null>(null);
  const [isAgendarOpen, setAgendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  // Firestore Data
  const casosQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'casosClinicos'), where('estadoCaso', '==', 'Abierto'), where('pais', '==', pais)) : null, [firestore, pais]);
  const { data: casosData, isLoading: isLoadingCasos } = useCollection<CasoClinico>(casosQuery);

  const pacientesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'pacientes') : null, [firestore]);
  const { data: pacientesData, isLoading: isLoadingPacientes } = useCollection<Paciente>(pacientesQuery);

  const medicosQuery = useMemoFirebase(() => firestore ? collection(firestore, 'medicos') : null, [firestore]);
  const { data: medicosData, isLoading: isLoadingMedicos } = useCollection<Medico>(medicosQuery);

  const casosConPaciente = useMemo<CasoConPaciente[]>(() => {
    if (!casosData || !pacientesData) return [];
    return casosData.map(caso => ({
      ...caso,
      paciente: pacientesData.find(p => p.id === caso.idPaciente),
    }));
  }, [casosData, pacientesData]);

  const handleAgendar = async (formData: any) => {
    if (!selectedCaso || !firestore) return;
    setIsSubmitting(true);

    const nuevaCita: Omit<CitaMedica, 'idCita'> = {
        idCaso: selectedCaso.id!,
        idPaciente: selectedCaso.idPaciente,
        idMedico: formData.idMedico,
        fechaCita: formData.fechaCita,
        horaCita: formData.horaCita,
        canalOrigen: 'AGENDADA_POR_MEDICO',
        estadoCita: 'PROGRAMADA',
        motivoResumen: selectedCaso.motivoConsulta,
        nivelSemaforoPaciente: selectedCaso.nivelSemaforo,
        pais: pais,
    };
    
    try {
        const citaRef = await addDoc(collection(firestore, 'citasMedicas'), nuevaCita);
        const casoDocRef = doc(firestore, 'casosClinicos', selectedCaso.id!);
        await updateDoc(casoDocRef, {
            estadoCaso: 'AGENDADO',
            idCita: citaRef.id,
        });

        toast({ title: 'Cita Agendada', description: `Se ha agendado una cita para ${selectedCaso.paciente?.nombreCompleto}.` });
        setAgendarOpen(false);
        setSelectedCaso(null);
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo agendar la cita.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleCancelar = async () => {
     if (!selectedCaso || !firestore) return;
     if (!motivoCancelacion) {
        toast({ title: 'Error', description: 'Debe especificar un motivo para la cancelación.', variant: 'destructive'});
        return;
     }

     const isConfirmed = await confirm({
        title: '¿Confirmar Cancelación?',
        description: `Esta acción marcará la solicitud de ${selectedCaso.paciente?.nombreCompleto} como cancelada. No se puede deshacer.`
     });

     if (isConfirmed) {
        setIsSubmitting(true);
        try {
            const casoDocRef = doc(firestore, 'casosClinicos', selectedCaso.id!);
            await updateDoc(casoDocRef, {
                estadoCaso: 'CANCELADO',
                notasCancelacion: motivoCancelacion, // Add cancellation note
            });
            toast({ title: 'Solicitud Cancelada', description: `Se ha cancelado la solicitud de ${selectedCaso.paciente?.nombreCompleto}.`, variant: 'destructive'});
            setMotivoCancelacion("");
            setSelectedCaso(null);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cancelar la solicitud.' });
        } finally {
            setIsSubmitting(false);
        }
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
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CasoConPaciente) => (
        <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => { setSelectedCaso(row); setAgendarOpen(true); }}>
              <CalendarPlus className="h-4 w-4"/> <span>Agendar</span>
            </Button>
            <Button size="sm" variant="destructive" className="gap-2" onClick={() => { setSelectedCaso(row); }}>
                <Ban className="h-4 w-4"/> <span>Cancelar</span>
            </Button>
        </div>
      ),
    },
  ];

  if (isLoadingCasos || isLoadingPacientes || isLoadingMedicos) return <div>Cargando solicitudes...</div>;

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold">Gestión de Citas (Triaje)</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes de Agendar</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={casosConPaciente} filterColumn="motivoConsulta" filterPlaceholder='Filtrar por motivo...' />
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
                                {medicosData?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nombreCompleto}</SelectItem>)}
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

    </div>
  );
}
