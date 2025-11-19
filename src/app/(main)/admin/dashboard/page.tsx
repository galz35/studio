"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { KpiCard } from '@/components/shared/KpiCard';
import { Users, Stethoscope, ClipboardList, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type DashboardData = {
    kpis: {
        totalUsuarios: number;
        medicosActivos: number;
        chequeosEsteMes: number;
        citasEsteMes: number;
    };
    chequeosPorRuta: { name: string; value: number }[];
    citasPorEstado: { name: string; value: number; fill: string }[];
};

export default function DashboardAdminPage() {
  const { pais } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardAdmin(pais).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [pais]);

  if (loading) return <div>Cargando dashboard...</div>;
  if (!data) return <div>No se pudo cargar la información.</div>;

  const { kpis, chequeosPorRuta, citasPorEstado } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Usuarios" value={kpis.totalUsuarios} icon={Users} description={`En ${pais}`} />
        <KpiCard title="Médicos Activos" value={kpis.medicosActivos} icon={Stethoscope} description={`En ${pais}`} />
        <KpiCard title="Chequeos este Mes" value={kpis.chequeosEsteMes} icon={ClipboardList} description={`En ${pais}`} />
        <KpiCard title="Citas este Mes" value={kpis.citasEsteMes} icon={Calendar} description={`En ${pais}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Chequeos por Ruta (Últimos 30 días)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chequeosPorRuta}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" name="Chequeos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Citas por Estado (Últimos 30 días)</CardTitle></CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={citasPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Citas">
                    {citasPorEstado.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
