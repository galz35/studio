"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { EmpleadoEmp2024 } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GestionEmpleadosPage() {
  const { pais } = useAuth();
  const [empleados, setEmpleados] = useState<EmpleadoEmp2024[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getEmpleados().then(empleadosRes => {
      const empleadosDelPais = empleadosRes.filter(e => e.pais === pais);
      setEmpleados(empleadosDelPais);
      setLoading(false);
    });
  }, [pais]);

  const columns = [
    { accessor: 'carnet', header: 'Carnet' },
    { accessor: 'nombreCompleto', header: 'Nombre' },
    { accessor: 'cargo', header: 'Cargo' },
    { accessor: 'gerencia', header: 'Gerencia' },
    { accessor: 'area', header: 'Área' },
    { accessor: 'telefono', header: 'Teléfono' },
    { accessor: 'correo', header: 'Correo' },
    {
      accessor: 'estado',
      header: 'Estado',
      cell: (row: EmpleadoEmp2024) => (
        <Badge variant={row.estado === 'ACTIVO' ? 'default' : 'destructive'} className={cn(row.estado === 'ACTIVO' && 'bg-accent text-accent-foreground')}>
          {row.estado}
        </Badge>
      ),
    },
  ];

  if (loading) return <div>Cargando empleados...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
            <p className="text-muted-foreground">Base de datos central de colaboradores.</p>
        </div>
        <Button className="gap-2 w-full md:w-auto">
          <UploadCloud />
          Importar desde Excel
        </Button>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Listado de Empleados ({pais})</CardTitle>
            <CardDescription>
                Esta tabla muestra todos los empleados activos e inactivos de la base de datos.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={empleados} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre, carnet, etc..." />
        </CardContent>
      </Card>
    </div>
  );
}
