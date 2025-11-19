"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { CitaMedica, Paciente, SeguimientoPaciente, CasoClinico } from '@/lib/types/domain';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';

type CalendarEventType = 'cita' | 'atencion' | 'seguimiento';

interface CalendarEvent {
  id: string;
  date: Date;
  type: CalendarEventType;
  title: string;
  description: string;
  data: CitaMedica | SeguimientoPaciente;
}

export default function AgendaCalendarioPage() {
  const { usuarioActual, pais } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (usuarioActual?.idMedico) {
      Promise.all([
        api.getCitasPorMedico(usuarioActual.idMedico, { pais }),
        api.getSeguimientos({ pais }) // Assuming getSeguimientos can be filtered by doctor implicitly or needs a filter
      ]).then(([citasRes, seguimientosRes]) => {
        
        const citasEvents = citasRes.map((cita): CalendarEvent => ({
          id: `cita-${cita.idCita}`,
          date: new Date(cita.fechaCita + 'T00:00:00Z'), // Use UTC to avoid timezone issues
          type: cita.estadoCita === 'FINALIZADA' ? 'atencion' : 'cita',
          title: `${cita.horaCita} - ${cita.paciente.nombreCompleto}`,
          description: cita.motivoResumen,
          data: cita
        }));

        const seguimientosEvents = seguimientosRes
          .filter(s => s.estadoSeguimiento === 'PENDIENTE')
          .map((seg): CalendarEvent => ({
            id: `seg-${seg.idSeguimiento}`,
            date: new Date(seg.fechaProgramada + 'T00:00:00Z'), // Use UTC
            type: 'seguimiento',
            title: `Seguimiento: ${seg.paciente.nombreCompleto}`,
            description: seg.notasSeguimiento,
            data: seg
        }));

        setEvents([...citasEvents, ...seguimientosEvents]);
        setLoading(false);
      });
    }
  }, [usuarioActual, pais]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const dateKey = event.date.toISOString().split('T')[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  const EventBadge = ({ event }: { event: CalendarEvent }) => {
    const typeClasses: Record<CalendarEventType, string> = {
      cita: 'bg-blue-100 text-blue-800 border-blue-200',
      seguimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      atencion: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return <Badge className={cn("block truncate text-xs p-1", typeClasses[event.type])}>{event.title}</Badge>;
  };
  
  function DayWithEvents(props: { date: Date } & React.HTMLAttributes<HTMLDivElement>) {
    const dateKey = props.date.toISOString().split('T')[0];
    const eventsDelDia = eventsByDay.get(dateKey) || [];

    if (eventsDelDia.length === 0) {
        return <div className="p-1 h-24">{props.date.getDate()}</div>;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
            <div className="p-1 h-24 cursor-pointer hover:bg-muted/50 rounded-md flex flex-col">
                <span className='font-semibold'>{props.date.getDate()}</span>
                <div className="mt-1 space-y-1 overflow-hidden">
                    {eventsDelDia.slice(0, 2).map(event => (
                        <EventBadge key={event.id} event={event} />
                    ))}
                    {eventsDelDia.length > 2 && <Badge variant="outline" className="text-xs">+{eventsDelDia.length - 2} más</Badge>}
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 z-10">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Eventos para {props.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
                <ul className='space-y-2 text-sm max-h-60 overflow-y-auto'>
                    {eventsDelDia.map(e => (
                        <li key={e.id} className='p-2 bg-muted/50 rounded-md'>
                           <EventBadge event={e} />
                           <p className="text-xs text-muted-foreground mt-1">{e.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (loading) return <div>Cargando agenda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agenda del Médico</h1>
        <div className="flex gap-4 items-center text-sm">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-100 border border-blue-200"></span>Cita</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-100 border border-yellow-200"></span>Seguimiento</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gray-100 border border-gray-200"></span>Atención</div>
        </div>
      </div>
      <Card>
        <CardContent className="p-1 md:p-2">
          <DayPicker
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            components={{
              Day: DayWithEvents,
            }}
             classNames={{
              day_outside: "text-muted-foreground/50",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
