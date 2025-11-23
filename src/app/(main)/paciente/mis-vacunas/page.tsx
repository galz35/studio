"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VacunaAplicada } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function MisVacunasPage() {
  const { usuarioActual } = useAuth();
  const { toast } = useToast();
  const [vacunas, setVacunas] = useState<VacunaAplicada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioActual?.idPaciente) {
      fetch(`/api/pacientes/${usuarioActual.idPaciente}/vacunas`)
        .then(res => res.json())
        .then(data => {
          setVacunas(data);
        }).catch(() => {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el historial de vacunación.' });
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [usuarioActual, toast]);

  const columns = [
    { accessor: 'fechaAplicacion', header: 'Fecha Aplicación' },
    { accessor: 'tipoVacuna', header: 'Tipo de Vacuna' },
    { accessor: 'dosis', header: 'Dosis' },
    {
      accessor: (row: VacunaAplicada) => row.medico?.nombreCompleto || 'Sistema',
      header: 'Registrado por'
    },
    { accessor: 'observaciones', header: 'Observaciones' },
  ];

  if (loading) return <div>Cargando historial de vacunas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Historial de Vacunación</h1>
      <Card>
        <CardHeader>
          <CardTitle>Vacunas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={vacunas} filterColumn="tipoVacuna" filterPlaceholder="Filtrar por vacuna..." />
        </CardContent>
      </Card>
    </div>
  );
}
