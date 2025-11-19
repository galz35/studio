"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import type { SeguimientoPaciente, Paciente, CasoClinico } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Check, Eye, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


type SeguimientoConDetalle = SeguimientoPaciente & { paciente: Paciente, caso: CasoClinico };

export default function SeguimientosPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const [seguimientos, setSeguimientos] = useState<SeguimientoConDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<number | null>(null);

  useEffect(() => {
    api.getSeguimientos({ pais }).then(res => {
      setSeguimientos(res);
      setLoading(false);
    });
  }, [pais]);

  const handleMarkResolved = (id: number) => {
    // Mock update
    setSeguimientos(prev => prev.map(s => s.idSeguimiento === id ? { ...s, estadoSeguimiento: 'RESUELTO', fechaReal: new Date().toISOString().split('T')[0] } : s));
    toast({ title: 'Seguimiento actualizado', description: 'El seguimiento se ha marcado como resuelto.' });
    setConfirming(null);
  };
  
  const getStatusClass = (status: SeguimientoPaciente['estadoSeguimiento']) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_PROCESO': return 'bg-blue-100 text-blue-800';
      case 'RESUELTO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const columns = [
    { accessor: 'fechaProgramada', header: 'F. Programada' },
    { accessor: (row: SeguimientoConDetalle) => row.paciente.nombreCompleto, header: 'Paciente' },
    {
      accessor: 'nivelSemaforo',
      header: 'Semáforo',
      cell: (row: SeguimientoConDetalle) => <SemaforoBadge nivel={row.nivelSemaforo} />
    },
    { accessor: 'tipoSeguimiento', header: 'Tipo' },
    {
      accessor: 'estadoSeguimiento',
      header: 'Estado',
      cell: (row: SeguimientoConDetalle) => <Badge className={cn("border-transparent", getStatusClass(row.estadoSeguimiento))}>{row.estadoSeguimiento.replace('_', ' ')}</Badge>
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: SeguimientoConDetalle) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                     <Link href={`/medico/casos/${row.idCaso}`}>
                        <Eye className="mr-2 h-4 w-4" /> Ver Caso Asociado
                    </Link>
                </DropdownMenuItem>
                {row.estadoSeguimiento === 'PENDIENTE' && (
                    <DropdownMenuItem onClick={() => setConfirming(row.idSeguimiento)}>
                        <Check className="mr-2 h-4 w-4" /> Marcar como Resuelto
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <div>Cargando seguimientos...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Seguimiento de Pacientes</h1>
      <Card>
        <CardHeader><CardTitle>Listado de Seguimientos</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={seguimientos} filterColumn="estadoSeguimiento" filterPlaceholder="Filtrar por estado..." />
        </CardContent>
      </Card>
      
      <ConfirmDialog
        open={!!confirming}
        onOpenChange={(open) => !open && setConfirming(null)}
        title="Confirmar Acción"
        description="¿Está seguro de que desea marcar este seguimiento como resuelto?"
        onConfirm={() => confirming && handleMarkResolved(confirming)}
      />
    </div>
  );
}
