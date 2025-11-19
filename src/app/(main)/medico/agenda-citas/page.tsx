"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { CitaMedica, Paciente } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { useRouter } from 'next/navigation';
import { Calendar, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format } from 'date-fns';

type CitaConPaciente = CitaMedica & { paciente: Paciente };

export default function AgendaCitasPage() {
  const { usuarioActual, pais } = useAuth();
  const router = useRouter();
  const [citas, setCitas] = useState<CitaConPaciente[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [estadoFiltro, setEstadoFiltro] = useState<string>('PROGRAMADA');
  const [semaforoFiltro, setSemaforoFiltro] = useState<string>('');

  useEffect(() => {
    if (usuarioActual?.idMedico) {
      api.getCitasPorMedico(usuarioActual.idMedico, { pais }).then(res => {
        setCitas(res);
        setLoading(false);
      });
    }
  }, [usuarioActual, pais]);

  const filteredData = useMemo(() => {
     return citas.filter(cita => {
        const fechaCita = new Date(cita.fechaCita);
        const from = date?.from;
        const to = date?.to;
        const enRango = from && to ? fechaCita >= from && fechaCita <= to : true;
        const porEstado = estadoFiltro ? cita.estadoCita === estadoFiltro : true;
        const porSemaforo = semaforoFiltro ? cita.nivelSemaforoPaciente === semaforoFiltro : true;
        return enRango && porEstado && porSemaforo;
     });
  }, [citas, date, estadoFiltro, semaforoFiltro]);

  const columns = [
    {
      accessor: (row: CitaConPaciente) => `${row.fechaCita} ${row.horaCita}`,
      header: 'Fecha y Hora',
    },
    {
      accessor: (row: CitaConPaciente) => row.paciente.nombreCompleto,
      header: 'Paciente',
    },
    {
        accessor: (row: CitaConPaciente) => row.paciente.nivelSemaforo,
        header: 'Semáforo',
        cell: (row: CitaConPaciente) => <SemaforoBadge nivel={row.nivelSemaforoPaciente!} />
    },
    { accessor: 'estadoCita', header: 'Estado' },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: CitaConPaciente) => (
        <div className="flex gap-2">
            <Button size="sm" onClick={() => router.push(`/medico/atencion/${row.idCita}`)}>
                Atender
            </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Cargando agenda...</div>;

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold">Agenda de Citas</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className='flex items-center gap-2'>
                <Filter className='w-5 h-5'/>
                Filtros
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className="w-[300px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Seleccione un rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

             <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado Cita" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="PROGRAMADA">Programada</SelectItem>
                    <SelectItem value="EN_ATENCION">En Atención</SelectItem>
                    <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
            </Select>

            <Select value={semaforoFiltro} onValueChange={setSemaforoFiltro}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semáforo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="V">Verde</SelectItem>
                    <SelectItem value="A">Amarillo</SelectItem>
                    <SelectItem value="R">Rojo</SelectItem>
                </SelectContent>
            </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredData} filterColumn="paciente.nombreCompleto" filterPlaceholder='Filtrar por paciente...' />
        </CardContent>
      </Card>
    </div>
  );
}
