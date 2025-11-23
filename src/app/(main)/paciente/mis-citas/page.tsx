"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { CitaMedica, Medico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const getStatusClass = (status: CitaMedica['estadoCita']) => {
  switch (status) {
    case 'PROGRAMADA': return 'bg-blue-100 text-blue-800';
    case 'CONFIRMADA': return 'bg-yellow-100 text-yellow-800';
    case 'FINALIZADA': return 'bg-green-100 text-green-800';
    case 'CANCELADA': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function MisCitasPage() {
  const { usuarioActual } = useAuth();
  const { toast } = useToast();
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioActual?.idPaciente) {
      fetch(`/api/pacientes/${usuarioActual.idPaciente}/citas`)
        .then(res => res.json())
        .then(data => {
          setCitas(data);
        }).catch(() => {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el historial de citas.' });
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [usuarioActual, toast]);

  const proximaCita = citas.filter(c => ['PROGRAMADA', 'CONFIRMADA'].includes(c.estadoCita) && new Date(c.fechaCita) >= new Date()).sort((a,b) => new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime())[0];

  const columns = [
    { accessor: 'fechaCita', header: 'Fecha' },
    { accessor: 'horaCita', header: 'Hora' },
    { 
      accessor: (row: CitaMedica) => row.medico?.nombreCompleto || 'N/A', 
      header: 'Médico',
    },
    { 
      accessor: 'estadoCita',
      header: 'Estado',
      cell: (row: CitaMedica) => <Badge className={cn("border-transparent", getStatusClass(row.estadoCita))}>{row.estadoCita}</Badge>
    },
    { accessor: 'canalOrigen', header: 'Canal' },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CitaMedica) => (
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) return <div>Cargando citas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Citas</h1>
      
      <Card>
        <CardHeader><CardTitle>Próxima Cita</CardTitle></CardHeader>
        <CardContent>
          {proximaCita ? (
            <div className='space-y-1'>
              <p className='text-lg'><strong>Fecha:</strong> {proximaCita.fechaCita} a las {proximaCita.horaCita}</p>
              <p><strong>Médico:</strong> {proximaCita.medico?.nombreCompleto}</p>
              <div className="flex items-center gap-2">
                <strong>Estado:</strong> <Badge className={cn("border-transparent", getStatusClass(proximaCita.estadoCita))}>{proximaCita.estadoCita}</Badge>
              </div>
            </div>
          ) : (
            <p className='text-muted-foreground'>No tiene citas próximas agendadas.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial de Citas</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={citas} />
        </CardContent>
      </Card>
    </div>
  );
}
