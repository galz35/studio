"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import * as api from '@/lib/services/api.mock';
import { CasoClinico, Paciente } from '@/lib/types/domain';
import { casosClinicos as mockCasos } from '@/lib/mock/casosClinicos.mock';
import { pacientes as mockPacientes } from '@/lib/mock/pacientes.mock';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CasoConPaciente = CasoClinico & { paciente: Paciente };

export default function PacientesCasosPage() {
  const [casos, setCasos] = useState<CasoConPaciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a filtered API call
    const casosConPaciente = mockCasos.map(caso => ({
      ...caso,
      paciente: mockPacientes.find(p => p.idPaciente === caso.idPaciente)!,
    }));
    setCasos(casosConPaciente);
    setLoading(false);
  }, []);

  const columns = [
    { accessor: 'codigoCaso', header: 'Código Caso' },
    {
      accessor: (row: CasoConPaciente) => row.paciente.nombreCompleto,
      header: 'Paciente',
    },
    {
      accessor: 'fechaCreacion',
      header: 'Fecha Creación',
      cell: (row: CasoConPaciente) => new Date(row.fechaCreacion).toLocaleDateString('es-ES'),
    },
    { accessor: 'estadoCaso', header: 'Estado' },
    {
      accessor: 'nivelSemaforo',
      header: 'Semáforo',
      cell: (row: CasoConPaciente) => <SemaforoBadge nivel={row.nivelSemaforo} />,
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CasoConPaciente) => (
        <Button asChild variant="ghost" size="icon">
          <Link href={`/medico/casos/${row.idCaso}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  if (loading) return <div>Cargando casos clínicos...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pacientes y Casos Clínicos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Casos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={casos}
            filterColumn="codigoCaso"
            filterPlaceholder="Filtrar por código o paciente..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
