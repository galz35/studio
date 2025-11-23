"use client";

import React, { useEffect, useState } from 'react';
import { HeartPulse, Calendar, Repeat, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { KpiCard } from '@/components/shared/KpiCard';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChequeoBienestar } from '@/lib/types/domain';
import { EmptyState } from '@/components/shared/EmptyState';

type DashboardData = {
  kpis: {
    estadoActual: 'V' | 'A' | 'R';
    ultimoChequeo: string;
    proximaCita: string | null;
    seguimientosActivos: number;
  },
  ultimoChequeoData: ChequeoBienestar | null;
  timeline: { title: string; date: string }[];
};

export default function DashboardPacientePage() {
  const { usuarioActual } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuarioActual?.id) {
        fetch(`/api/pacientes/${usuarioActual.id}/dashboard`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }
  }, [usuarioActual]);

  if (loading) return <div>Cargando panel...</div>;
  if (!data) return <EmptyState title="No se pudo cargar el panel" />;

  const { kpis, ultimoChequeoData, timeline } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel del Paciente</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Estado Actual" value="" icon={HeartPulse}>
           <SemaforoBadge nivel={kpis.estadoActual} className="text-lg px-4 py-2 mt-2" />
        </KpiCard>
        <KpiCard title="Último Chequeo" value={kpis.ultimoChequeo} icon={Activity} />
        <KpiCard title="Próxima Cita" value={kpis.proximaCita || 'Ninguna'} icon={Calendar} />
        <KpiCard title="Seguimientos Activos" value={kpis.seguimientosActivos} icon={Repeat} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Último Chequeo</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimoChequeoData ? (
              <div className="space-y-2 text-sm">
                <p><strong>Fecha:</strong> {new Date(ultimoChequeoData.fechaRegistro).toLocaleString('es-ES')}</p>
                <p><strong>Estado de ánimo:</strong> {ultimoChequeoData.estadoAnimo}</p>
                <p><strong>Calidad del sueño:</strong> {ultimoChequeoData.calidadSueno}</p>
                <p><strong>Comentario:</strong> {ultimoChequeoData.comentarioGeneral || 'N/A'}</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">No hay chequeos registrados.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Línea de Tiempo Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {timeline.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary mt-1" />
                  <div className="ml-4">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('es-ES')}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
