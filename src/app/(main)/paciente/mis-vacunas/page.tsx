"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { VacunaAplicada, Medico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { medicos as mockMedicos } from '@/lib/mock/medicos.mock';

export default function MisVacunasPage() {
  const { usuarioActual } = useAuth();
  const [vacunas, setVacunas] = useState<VacunaAplicada[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    if (usuarioActual?.idPaciente) {
      Promise.all([
        api.getVacunasPorPaciente(usuarioActual.idPaciente),
        api.getMedicos()
      ]).then(([vacunasRes, medicosRes]) => {
        setVacunas(vacunasRes);
        setMedicos(medicosRes);
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
      cell: (row: VacunaAplicada) => medicos.find(m => m.idMedico === row.idMedico)?.nombreCompleto || 'Sistema'
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