"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { CitaMedica, Paciente } from '@/lib/types/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type CitaConPaciente = CitaMedica & { paciente: Paciente };

export default function AgendaCalendarioPage() {
  const { usuarioActual, pais } = useAuth();
  const [citas, setCitas] = useState<CitaConPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (usuarioActual?.idMedico) {
      api.getCitasPorMedico(usuarioActual.idMedico, { pais }).then(res => {
        setCitas(res);
        setLoading(false);
      });
    }
  }, [usuarioActual, pais]);

  const citasPorDia = useMemo(() => {
    const map = new Map<string, CitaConPaciente[]>();
    citas.forEach(cita => {
      const dateKey = cita.fechaCita;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(cita);
    });
    return map;
  }, [citas]);

  const DayWithCitas = ({ date, displayMonth }: { date: Date, displayMonth: Date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const citasDelDia = citasPorDia.get(dateKey) || [];

    if (citasDelDia.length === 0 || date.getMonth() !== displayMonth.getMonth()) {
        return <div className="p-1 h-24">{date.getDate()}</div>;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
            <div className="p-1 h-24 cursor-pointer hover:bg-muted/50 rounded-md">
                <span>{date.getDate()}</span>
                <div className="mt-1 space-y-1">
                    {citasDelDia.slice(0, 2).map(cita => (
                        <Badge key={cita.idCita} variant="secondary" className="block truncate text-xs p-1">{cita.horaCita} {cita.paciente.nombreCompleto}</Badge>
                    ))}
                    {citasDelDia.length > 2 && <Badge variant="outline" className="text-xs">+{citasDelDia.length - 2} más</Badge>}
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Citas para {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
                <ul className='space-y-2 text-sm'>
                    {citasDelDia.map(c => (
                        <li key={c.idCita} className='p-2 bg-muted/50 rounded-md'>
                            <strong>{c.horaCita}</strong> - {c.paciente.nombreCompleto} <br />
                            <span className="text-muted-foreground">{c.motivoResumen}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agenda de Citas (Calendario)</h1>
      <Card>
        <CardContent className="p-2 md:p-4">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            components={{
              Day: DayWithCitas,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
