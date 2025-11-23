"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { KpiCard } from '@/components/shared/KpiCard';
import { Users, Stethoscope, ClipboardList, CalendarCheck, Clock, AreaChart, PieChart, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CasoClinico, AtencionMedica } from '@/lib/types/domain';


type DashboardData = {
    casos: CasoClinico[];
    atenciones: (AtencionMedica & { caso?: CasoClinico })[];
};

export default function DashboardAdminPage() {
  const { pais } = useAuth();
  const [data, setData] = useState<DashboardData>({ casos: [], atenciones: [] });
  const [loading, setLoading] = useState(true);

  // State for filters
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [gerencia, setGerencia] = useState('all');

  useEffect(() => {
    // This is a simplified fetch. In a real scenario, you'd fetch based on filters.
    // For this mock, we fetch all and then filter on the client.
    Promise.all([
      api.getCasos(),
      api.getAllAtenciones(pais),
    ]).then(([casosRes, atencionesRes]) => {
      
      const atencionesConCaso = atencionesRes.map(a => ({
        ...a,
        caso: casosRes.find(c => c.idCaso === a.idCaso)
      }))

      setData({
          casos: casosRes,
          atenciones: atencionesConCaso,
      });

      setLoading(false);
    });
  }, [pais]);


  const filteredData = useMemo(() => {
    if (!data.casos.length || !data.atenciones.length) return { casos: [], atenciones: [] };

    let filteredCasos = data.casos.filter(caso => {
        const casoDate = new Date(caso.fechaCreacion);
        const fromDate = date?.from ? new Date(date.from) : new Date('1970-01-01');
        const toDate = date?.to ? new Date(date.to) : new Date();
        
        fromDate.setHours(0,0,0,0);
        toDate.setHours(23,59,59,999);

        return casoDate >= fromDate && casoDate <= toDate;
    });

    let filteredAtenciones = data.atenciones.filter(atencion => {
        const atencionDate = new Date(atencion.fechaAtencion);
        const fromDate = date?.from ? new Date(date.from) : new Date('1970-01-01');
        const toDate = date?.to ? new Date(date.to) : new Date();
        
        fromDate.setHours(0,0,0,0);
        toDate.setHours(23,59,59,999);

        return atencionDate >= fromDate && atencionDate <= toDate;
    });
    
    if (gerencia !== 'all') {
        const empleadosGerencia = ["P001", "P002"]; // Mock: empleados de una gerencia
        filteredCasos = filteredCasos.filter(c => c.paciente && empleadosGerencia.includes(c.paciente.carnet));
        filteredAtenciones = filteredAtenciones.filter(a => a.paciente && empleadosGerencia.includes(a.paciente.carnet));
    }

    return { casos: filteredCasos, atenciones: filteredAtenciones };

  }, [data, date, gerencia]);
  
  const gerenciasUnicas = useMemo(() => {
     if (!data.atenciones) return [];
     const gerencias = data.atenciones.map(a => a.empleado?.gerencia).filter(Boolean);
     return ['all', ...Array.from(new Set(gerencias))];
  }, [data.atenciones]);

  const kpis = useMemo(() => {
    const totalCasos = filteredData.casos.length;
    const casosCerrados = filteredData.casos.filter(c => c.estadoCaso === 'Cerrado' || c.estadoCaso === 'FINALIZADA').length;
    
    const tiemposDeCierre = filteredData.casos
        .filter(c => (c.estadoCaso === 'Cerrado' || c.estadoCaso === 'FINALIZADA') && c.atenciones?.length > 0)
        .map(c => {
            const fechaFin = new Date(c.atenciones![c.atenciones!.length -1].fechaAtencion);
            const fechaInicio = new Date(c.fechaCreacion);
            return differenceInDays(fechaFin, fechaInicio);
        })
        .filter(d => d >= 0);

    const promedioCierre = tiemposDeCierre.length > 0 ? Math.round(tiemposDeCierre.reduce((a,b) => a+b, 0) / tiemposDeCierre.length) : 0;
    
    const casosNoApto = filteredData.casos.filter(c => c.datosExtra?.AptoLaboral === false).length;
    const tasaAusentismo = totalCasos > 0 ? Math.round((casosNoApto / totalCasos) * 100) : 0;

    return {
        atencionesRealizadas: filteredData.atenciones.length,
        casosAbiertos: totalCasos - casosCerrados,
        casosCerrados: casosCerrados,
        tiempoPromedioCierre: promedioCierre,
        tasaAusentismo: tasaAusentismo,
    }
  }, [filteredData]);
  
  const atencionesPorGerencia = useMemo(() => {
    return filteredData.atenciones.reduce((acc, atencion) => {
      const gerencia = atencion.empleado?.gerencia || 'Desconocida';
      const found = acc.find(item => item.name === gerencia);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ name: gerencia, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);
  }, [filteredData.atenciones]);
  
  const topDiagnosticos = useMemo(() => {
      const allDiagnosticos = filteredData.atenciones.map(a => a.diagnosticoPrincipal).filter(Boolean);
      const counts = allDiagnosticos.reduce((acc, value) => {
          acc[value] = (acc[value] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      return Object.entries(counts)
        .sort(([,a],[,b]) => b-a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

  }, [filteredData.atenciones]);

  if (loading) return <div>Cargando dashboard...</div>;
  
  return (
    <div className="space-y-6">
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <h1 className="text-3xl font-bold">Dashboard Gerencial</h1>
        <div className='flex gap-2 w-full md:w-auto'>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-full md:w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Seleccione un rango</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            <Select value={gerencia} onValueChange={setGerencia}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Gerencia" />
                </SelectTrigger>
                <SelectContent>
                    {gerenciasUnicas.map(g => <SelectItem key={g} value={g}>{g === 'all' ? 'Todas las Gerencias' : g}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Atenciones Realizadas" value={kpis.atencionesRealizadas} icon={Stethoscope} description="Consultas completadas en el periodo." />
        <KpiCard title="Casos Abiertos / Cerrados" value={`${kpis.casosAbiertos} / ${kpis.casosCerrados}`} icon={ClipboardList} description="Flujo de casos en el periodo." />
        <KpiCard title="Tiempo Prom. de Cierre" value={`${kpis.tiempoPromedioCierre} días`} icon={Clock} description="Desde apertura hasta atención final." />
        <KpiCard title="Tasa de Ausentismo" value={`${kpis.tasaAusentismo}%`} icon={TrendingDown} description="% de casos reportados como 'No Apto'." color="text-destructive" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Atenciones por Gerencia</CardTitle>
            <CardDescription>Volumen de consultas médicas por cada gerencia.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={atencionesPorGerencia} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" name="Atenciones" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Top 5 Diagnósticos Comunes</CardTitle>
            <CardDescription>Diagnósticos más frecuentes en el periodo.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDiagnosticos} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--accent))" name="Cantidad" radius={[0, 4, 4, 0]}>
                         {topDiagnosticos.map((entry, index) => (
                            <Bar key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--accent))" : "hsl(var(--accent) / 0.8)"} />
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
