"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { EmpleadoEmp2024 } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


export default function GestionEmpleadosPage() {
  const { pais } = useUserProfile();
  const { toast } = useToast();
  const [empleadosData, setEmpleadosData] = useState<EmpleadoEmp2024[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/empleados');
        if (!response.ok) {
          throw new Error('Failed to fetch empleados');
        }
        const data: EmpleadoEmp2024[] = await response.json();
        setEmpleadosData(data);
      } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron cargar los datos de los empleados.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, [toast]);

  const empleadosDelPais = useMemo(() => {
    if (!empleadosData || !pais) return [];
    return empleadosData.filter(e => e.pais === pais);
  }, [empleadosData, pais]);
  

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

  if (isLoading) return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-4 w-80 mt-2" />
            </div>
            <Skeleton className="h-10 w-full md:w-48" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
  );

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
          <DataTable columns={columns} data={empleadosDelPais} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre, carnet, etc..." />
        </CardContent>
      </Card>
    </div>
  );
}
