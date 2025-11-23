"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VacunaAplicada, Medico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MisVacunasPage() {
  const { usuarioActual } = useAuth();
  const [vacunas, setVacunas] = useState<VacunaAplicada[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    if (usuarioActual?.id) {
      Promise.all([
        fetch(`/api/pacientes/${usuarioActual.id}/vacunas`),
        fetch('/api/medicos')
      ]).then(async ([vacunasRes, medicosRes]) => {
        const vacunasData = await vacunasRes.json();
        const medicosData = await medicosRes.json();
        setVacunas(vacunasData);
        setMedicos(medicosData);
        setLoading(false);
      });
    }
  }, [usuarioActual]);

  const columns = [
    { accessor: 'fechaAplicacion', header: 'Fecha Aplicación' },
    { accessor: 'tipoVacuna', header: 'Tipo de Vacuna' },
    { accessor: 'dosis', header: 'Dosis' },
    {
      accessor: 'idMedico',
      header: 'Registrado por',
      cell: (row: VacunaAplicada) => medicos.find(m => m.id === row.idMedico)?.nombreCompleto || 'Sistema'
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
