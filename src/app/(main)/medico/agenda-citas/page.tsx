"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { CitaMedica, Paciente } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import Link from 'next/link';

type CitaConPaciente = CitaMedica & { paciente: Paciente };

export default function AgendaCitasPage() {
  const { usuarioActual, pais } = useAuth();
  const [citas, setCitas] = useState<CitaConPaciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioActual?.idMedico) {
      api.getCitasPorMedico(usuarioActual.idMedico, { pais }).then(res => {
        setCitas(res);
        setLoading(false);
      });
    }
  }, [usuarioActual, pais]);

  const columns = [
    {
      accessor: (row: CitaConPaciente) => `${row.fechaCita} ${row.horaCita}`,
      header: 'Fecha y Hora',
    },
    {
      accessor: (row: CitaConPaciente) => row.paciente.nombreCompleto,
      header: 'Paciente',
    },
    {
        accessor: (row: CitaConPaciente) => row.paciente.nivelSemaforo,
        header: 'Semáforo',
        cell: (row: CitaConPaciente) => <SemaforoBadge nivel={row.paciente.nivelSemaforo!} />
    },
    { accessor: 'estadoCita', header: 'Estado' },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CitaConPaciente) => (
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="icon" disabled={!row.idCaso}>
            <Link href={`/medico/casos/${row.idCaso}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando agenda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agenda de Citas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Todas las Citas</CardTitle>
          {/* Filters can be added here */}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={citas} filterColumn="estadoCita" filterPlaceholder="Filtrar por estado..." />
        </CardContent>
      </Card>
    </div>
  );
}
