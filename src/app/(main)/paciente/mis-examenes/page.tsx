"use client";

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { PacienteService } from '@/lib/services/paciente.service';
import { ExamenMedico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MisExamenesPage() {
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const [examenes, setExamenes] = useState<ExamenMedico[]>([]);
  const [selectedExamen, setSelectedExamen] = useState<ExamenMedico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.idPaciente) {
      PacienteService.getMisExamenes()
        .then(data => {
          setExamenes(data);
        }).catch(() => {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el historial de exámenes.' });
        }).finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userProfile, toast]);

  const columns = [
    { accessor: 'fechaSolicitud', header: 'F. Solicitud' },
    { accessor: 'tipoExamen', header: 'Tipo de Examen' },
    {
      accessor: 'estadoExamen',
      header: 'Estado',
      cell: (row: ExamenMedico) => (
        <Badge variant={row.estadoExamen === 'ENTREGADO' ? 'default' : 'secondary'} className={row.estadoExamen === 'ENTREGADO' ? "bg-accent text-accent-foreground" : ""}>
          {row.estadoExamen}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: ExamenMedico) => (
        <Button variant="ghost" size="icon" disabled={row.estadoExamen !== 'ENTREGADO'} onClick={() => setSelectedExamen(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) return <div>Cargando historial de exámenes...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Exámenes Médicos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Exámenes Solicitados</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={examenes} filterColumn="tipoExamen" filterPlaceholder="Filtrar por tipo de examen..." />
        </CardContent>
      </Card>

      {selectedExamen && (
        <Dialog open={!!selectedExamen} onOpenChange={(open) => !open && setSelectedExamen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resultado del Examen</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4 text-sm">
              <p><strong>Tipo de Examen:</strong> {selectedExamen.tipoExamen}</p>
              <p><strong>Fecha de Resultado:</strong> {selectedExamen.fechaResultado}</p>
              <p><strong>Laboratorio:</strong> {selectedExamen.laboratorio}</p>
              <div>
                <p className="font-medium">Resumen del Resultado:</p>
                <blockquote className="mt-2 pl-4 border-l-2 text-muted-foreground italic">
                  {selectedExamen.resultadoResumen || 'No hay resumen disponible.'}
                </blockquote>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button>Cerrar</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
