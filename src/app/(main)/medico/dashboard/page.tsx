"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { KpiCard } from '@/components/shared/KpiCard';
import { CalendarCheck, UserX, Repeat, FlaskConical, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Button } from '@/components/ui/button';
import { CitaMedica, Paciente, CasoClinico } from '@/lib/types/domain';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type DashboardData = {
  kpis: {
    citasHoy: number;
    pacientesEnRojo: number;
    seguimientosPendientes: number;
    examenesSinResultado: number;
  };
  citasDelDia: (CitaMedica & { paciente: Paciente, caso: CasoClinico | null })[];
  alertas: { message: string, type: 'danger' | 'warning' }[];
};

export default function DashboardMedicoPage() {
  const { usuarioActual, pais } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (usuarioActual?.idMedico) {
      api.getDashboardMedico(usuarioActual.idMedico, pais).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [usuarioActual, pais]);

  if (loading) return <div>Cargando dashboard...</div>;
  if (!data) return <div>No se pudo cargar la información.</div>;
  
  const { kpis, citasDelDia, alertas } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard del Médico</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Citas de Hoy" value={kpis.citasHoy} icon={CalendarCheck} />
        <KpiCard title="Pacientes en Rojo" value={kpis.pacientesEnRojo} icon={UserX} color="text-red-500" />
        <KpiCard title="Seguimientos Pendientes" value={kpis.seguimientosPendientes} icon={Repeat} />
        <KpiCard title="Exámenes sin Resultado" value={kpis.examenesSinResultado} icon={FlaskConical} />
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
                {citasDelDia.length > 0 ? citasDelDia.map(cita => (
                  <TableRow key={cita.idCita}>
                    <TableCell>{cita.horaCita}</TableCell>
                    <TableCell>{cita.paciente.nombreCompleto}</TableCell>
                    <TableCell>{cita.motivoResumen || "N/A"}</TableCell>
                    <TableCell>{cita.estadoCita}</TableCell>
                    <TableCell><SemaforoBadge nivel={cita.paciente.nivelSemaforo!} /></TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => router.push(`/medico/atencion/${cita.idCita}`)}>
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
          <CardHeader><CardTitle>Alertas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {alertas.map((alerta, index) => (
              <Alert key={index} variant={alerta.type === 'danger' ? 'destructive' : 'default'} className={alerta.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alerta.type === 'danger' ? 'Alerta Crítica' : 'Advertencia'}</AlertTitle>
                <AlertDescription>{alerta.message}</AlertDescription>
              </Alert>
            ))}
            {alertas.length === 0 && <p className="text-sm text-muted-foreground text-center">No hay alertas.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
