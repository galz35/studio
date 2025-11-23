"use client";

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { ChequeoBienestar } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function HistorialChequeosPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const [chequeos, setChequeos] = useState<ChequeoBienestar[]>([]);
  const [selectedChequeo, setSelectedChequeo] = useState<ChequeoBienestar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      fetch(`/api/pacientes/${userProfile.id}/chequeos`)
        .then(res => res.json())
        .then(data => {
            setChequeos(data);
        }).catch(() => {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el historial de chequeos.' });
        }).finally(() => {
            setLoading(false);
        });
    }
  }, [userProfile, toast]);

  const columns = [
    {
      accessor: (row: ChequeoBienestar) => new Date(row.fechaRegistro).toLocaleString('es-ES'),
      header: 'Fecha',
    },
    { accessor: 'estadoAnimo', header: 'Estado de Ánimo' },
    { accessor: 'modalidadTrabajo', header: 'Modalidad' },
    {
      accessor: 'aptoLaboral',
      header: 'Apto Laboral',
      cell: (row: ChequeoBienestar) => (row.aptoLaboral ? 'Sí' : 'No'),
    },
    {
      accessor: 'nivelSemaforo',
      header: 'Semáforo',
      cell: (row: ChequeoBienestar) => <SemaforoBadge nivel={row.nivelSemaforo} />,
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: ChequeoBienestar) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedChequeo(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) return <div>Cargando historial...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Historial de Chequeos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mis Chequeos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={chequeos} filterColumn="estadoAnimo" filterPlaceholder="Filtrar por estado de ánimo..." />
        </CardContent>
      </Card>
      
      {selectedChequeo && (
        <Dialog open={!!selectedChequeo} onOpenChange={(open) => !open && setSelectedChequeo(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalle del Chequeo</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Fecha:</strong> {new Date(selectedChequeo.fechaRegistro).toLocaleString('es-ES')}</p>
                    <p><strong>Estado de Ánimo:</strong> {selectedChequeo.estadoAnimo}</p>
                    <p><strong>Modalidad:</strong> {selectedChequeo.modalidadTrabajo}</p>
                    <p><strong>Ruta/Sede:</strong> {selectedChequeo.ruta}</p>
                    <p><strong>Calidad Sueño:</strong> {selectedChequeo.calidadSueno}</p>
                    <p><strong>Consumo Agua:</strong> {selectedChequeo.consumoAgua}</p>
                    <p><strong>Alergias:</strong> {selectedChequeo.alergiasActivas ? selectedChequeo.alergiasDescripcion : 'No'}</p>
                    <p><strong>Comentario:</strong> {selectedChequeo.comentarioGeneral || 'N/A'}</p>
                    <p><strong>Semáforo:</strong> <SemaforoBadge nivel={selectedChequeo.nivelSemaforo} /></p>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
