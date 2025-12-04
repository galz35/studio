"use client";

import React, { useEffect, useState } from 'react';
import { MedicoService, MedicoDashboardData } from '@/lib/services/medico.service';
import { useUserProfile } from '@/hooks/use-user-profile';
import { KpiCard } from '@/components/shared/KpiCard';
import { CalendarCheck, UserX, Repeat, FlaskConical, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export default function DashboardMedicoPage() {
  const { userProfile, pais } = useUserProfile();
  const [data, setData] = useState<MedicoDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userProfile?.idMedico) {
      setLoading(true);
      MedicoService.getDashboard()
        .then(dashboardData => {
          setData(dashboardData);
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (!userProfile?.idMedico && !loading) {
      setLoading(false);
    }
  }, [userProfile?.idMedico]);

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-40 w-full" /></CardContent>
        </Card>
      </div>
    </div>
  );

  if (!userProfile?.idMedico) return <EmptyState title="No autorizado" message="Este perfil no es de médico." />;
  if (!data) return <EmptyState title="Sin información" message="No se pudo cargar el dashboard." />;

  const { citasHoyCount, citasHoy, pacientesEnRojoCount, pacientesEnRojo, casosAbiertos } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard del Médico</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Citas de Hoy" value={citasHoyCount} icon={CalendarCheck} />
        <KpiCard title="Pacientes en Rojo" value={pacientesEnRojoCount} icon={UserX} color="text-red-500" />
        <KpiCard title="Casos Abiertos" value={casosAbiertos} icon={Repeat} />
        {/* Placeholder for future KPI */}
        <KpiCard title="Exámenes Pendientes" value={0} icon={FlaskConical} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Citas del Día</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Semáforo</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citasHoy.length > 0 ? citasHoy.map((cita: any) => (
                  <TableRow key={cita.id_cita}>
                    <TableCell>{cita.hora_cita}</TableCell>
                    <TableCell>{cita.paciente?.nombre_completo || 'N/A'}</TableCell>
                    <TableCell>{cita.caso_clinico?.motivo_consulta || "Consulta General"}</TableCell>
                    <TableCell>{cita.estado_cita}</TableCell>
                    <TableCell><SemaforoBadge nivel={cita.paciente?.nivel_semaforo || 'V'} /></TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => router.push(`/medico/atencion/${cita.id_cita}`)}>
                        Atender
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="text-center">No hay citas para hoy.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pacientes en Alerta (Rojo)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pacientesEnRojo.length > 0 ? pacientesEnRojo.map((paciente: any, index: number) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atención Requerida</AlertTitle>
                <AlertDescription>
                  {paciente.nombre_completo} requiere seguimiento inmediato.
                </AlertDescription>
              </Alert>
            )) : (
              <p className="text-sm text-muted-foreground text-center">No hay pacientes en estado crítico.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
