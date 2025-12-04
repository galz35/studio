"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, Stethoscope } from 'lucide-react';
import { CasosService } from '@/lib/services/casos.service';
import { CasoClinico, Paciente } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


type CasoConPaciente = CasoClinico & { paciente: Paciente };

export default function PacientesCasosPage() {
  const [casos, setCasos] = useState<CasoConPaciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CasosService.getCasosClinicos()
      .then(data => {
        setCasos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading cases", err);
        setLoading(false);
      });
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.idCita && (
              <DropdownMenuItem asChild>
                <Link href={`/medico/atencion/${row.idCita}`}>
                  <Stethoscope className="mr-2 h-4 w-4" /> Iniciar Atención / Nota
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/medico/casos/${row.id}`}>
                <Eye className="mr-2 h-4 w-4" /> Ver Detalle del Caso
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            filterColumn="paciente.nombreCompleto"
            filterPlaceholder="Filtrar por paciente..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
