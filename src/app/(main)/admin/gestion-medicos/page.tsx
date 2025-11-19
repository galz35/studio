"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { Medico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function GestionMedicosPage() {
  const { pais } = useAuth();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMedicos({ pais }).then(res => {
      setMedicos(res);
      setLoading(false);
    });
  }, [pais]);

  const columns = [
    { accessor: 'nombreCompleto', header: 'Nombre' },
    { accessor: 'especialidad', header: 'Especialidad' },
    { accessor: 'tipoMedico', header: 'Tipo' },
    { accessor: 'correo', header: 'Correo' },
    { accessor: 'telefono', header: 'Teléfono' },
    {
      accessor: 'estadoMedico',
      header: 'Estado',
      cell: (row: Medico) => (
        <Badge variant={row.estadoMedico === 'A' ? 'default' : 'destructive'} className={row.estadoMedico === 'A' ? 'bg-accent text-accent-foreground' : ''}>
          {row.estadoMedico === 'A' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: () => (
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      ),
    },
  ];

  if (loading) return <div>Cargando médicos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Médicos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2"><PlusCircle /> Nuevo Médico</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crear/Editar Médico</DialogTitle></DialogHeader>
            <p className='text-muted-foreground'>Formulario de creación/edición de médicos en construcción.</p>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Listado de Médicos</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={medicos} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre..." />
        </CardContent>
      </Card>
    </div>
  );
}
