"use client";

import React, { useEffect, useState } from 'react';
import { AdminService, AdminDashboardData } from '@/lib/services/admin.service';
import { useUserProfile } from '@/hooks/use-user-profile';
import { KpiCard } from '@/components/shared/KpiCard';
import { Users, Stethoscope, ClipboardList, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export default function DashboardAdminPage() {
  const { pais } = useUserProfile();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we have a country (though admin usually sees all or specific)
    // Assuming admin is tied to a country or 'Global'
    setLoading(true);
    AdminService.getDashboard()
      .then(dashboardData => {
        setData(dashboardData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!data) return <EmptyState title="Sin datos" message="No se pudo cargar el dashboard administrativo." />;

  const { totalUsuarios, medicosActivos, pacientesActivos, ultimosUsuarios } = data;

  return (
    <div className="space-y-6">
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Usuarios" value={totalUsuarios} icon={Users} description="Usuarios registrados activos." />
        <KpiCard title="Médicos Activos" value={medicosActivos} icon={Stethoscope} description="Personal médico disponible." />
        <KpiCard title="Pacientes Activos" value={pacientesActivos} icon={Activity} description="Pacientes registrados en plataforma." />
        {/* Placeholder for future KPI */}
        <KpiCard title="Reportes Generados" value={0} icon={ClipboardList} description="En el último mes." />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Usuarios Registrados</CardTitle>
            <CardDescription>Actividad reciente de registro en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosUsuarios.length > 0 ? ultimosUsuarios.map((usuario: any) => (
                  <TableRow key={usuario.id_usuario}>
                    <TableCell>{usuario.nombre_completo}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                    <TableCell>{usuario.pais}</TableCell>
                    <TableCell>{new Date(usuario.fecha_creacion).toLocaleDateString()}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} className="text-center">No hay usuarios recientes.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
