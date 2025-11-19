"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import type { ExamenMedico, Paciente } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FilePenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type ExamenConPaciente = ExamenMedico & { paciente: Paciente };

export default function ExamenesMedicosPage() {
  const { pais } = useAuth();
  const [examenes, setExamenes] = useState<ExamenConPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamen, setSelectedExamen] = useState<ExamenConPaciente | null>(null);

  useEffect(() => {
    api.getExamenesMedicos({ pais }).then(res => {
      setExamenes(res);
      setLoading(false);
    });
  }, [pais]);
  
  const handleRegisterResult = (idExamen: number, resultado: string) => {
    // Mock update
    setExamenes(prev => prev.map(ex => ex.idExamen === idExamen ? { ...ex, estadoExamen: 'ENTREGADO', resultadoResumen: resultado, fechaResultado: new Date().toISOString().split('T')[0] } : ex));
    setSelectedExamen(null);
  };

  const columns = [
    { accessor: 'fechaSolicitud', header: 'F. Solicitud' },
    { accessor: (row: ExamenConPaciente) => row.paciente.nombreCompleto, header: 'Paciente' },
    { accessor: 'tipoExamen', header: 'Tipo' },
    { accessor: 'laboratorio', header: 'Laboratorio' },
    {
      accessor: 'estadoExamen',
      header: 'Estado',
      cell: (row: ExamenConPaciente) => (
        <Badge variant={row.estadoExamen === 'ENTREGADO' ? 'default' : 'secondary'} className={cn(row.estadoExamen === 'ENTREGADO' && "bg-accent text-accent-foreground")}>
          {row.estadoExamen}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: ExamenConPaciente) => (
        <div className="flex gap-2">
            <Dialog onOpenChange={(open) => !open && setSelectedExamen(null)}>
                <DialogTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={() => setSelectedExamen(row)}>
                        {row.estadoExamen === 'PENDIENTE' ? <FilePenLine className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </DialogTrigger>
            </Dialog>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando exámenes...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Exámenes Médicos</h1>
      <Card>
        <CardHeader><CardTitle>Listado de Exámenes</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={examenes} filterColumn="tipoExamen" filterPlaceholder="Filtrar por tipo..." />
        </CardContent>
      </Card>
      
      {selectedExamen && (
        <Dialog open={!!selectedExamen} onOpenChange={(open) => !open && setSelectedExamen(null)}>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedExamen.estadoExamen === 'PENDIENTE' ? 'Registrar Resultado' : 'Ver Resultado'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p><strong>Paciente:</strong> {selectedExamen.paciente.nombreCompleto}</p>
                    <p><strong>Tipo de Examen:</strong> {selectedExamen.tipoExamen}</p>
                    <p><strong>Fecha Solicitud:</strong> {selectedExamen.fechaSolicitud}</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const resultado = formData.get('resultado') as string;
                        handleRegisterResult(selectedExamen.idExamen, resultado);
                    }}>
                        <Textarea 
                            name="resultado"
                            rows={5}
                            placeholder="Ingrese el resumen del resultado..."
                            defaultValue={selectedExamen.resultadoResumen}
                            readOnly={selectedExamen.estadoExamen === 'ENTREGADO'}
                        />
                        {selectedExamen.estadoExamen === 'PENDIENTE' && (
                            <Button type="submit" className="mt-4">Guardar Resultado</Button>
                        )}
                    </form>
                </div>
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
