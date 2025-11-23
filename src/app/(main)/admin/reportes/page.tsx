"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { AtencionMedica, EmpleadoEmp2024, Paciente, Medico, CasoClinico } from '@/lib/types/domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DataTable } from '@/components/shared/DataTable';
import { KpiCard } from '@/components/shared/KpiCard';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const reportFilterSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  gerencia: z.string().optional(),
  sexo: z.string().optional(),
  edadFrom: z.coerce.number().optional(),
  edadTo: z.coerce.number().optional(),
});

type FilterValues = z.infer<typeof reportFilterSchema>;
type AtencionCompleta = AtencionMedica & { paciente: Paciente, medico: Medico, caso: CasoClinico, empleado: EmpleadoEmp2024 };

export default function ReportesAdminPage() {
  const { pais } = useAuth();
  const { toast } = useToast();
  const [atenciones, setAtenciones] = useState<AtencionCompleta[]>([]);
  const [filteredAtenciones, setFilteredAtenciones] = useState<AtencionCompleta[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FilterValues>({
    resolver: zodResolver(reportFilterSchema),
    defaultValues: {
      dateRange: {
        from: subDays(new Date(), 30),
        to: new Date(),
      },
      gerencia: 'all',
      sexo: 'all',
    },
  });

  useEffect(() => {
    fetch('/api/atenciones?pais=' + pais)
        .then(res => res.json())
        .then(data => {
            setAtenciones(data);
            setLoading(false);
        });
  }, [pais]);
  
  const gerencias = useMemo(() => {
      const g = new Set(atenciones.map(a => a.empleado.gerencia));
      return Array.from(g);
  }, [atenciones]);

  useEffect(() => {
    // Initial filtering on load
    if (atenciones.length > 0) {
      const initialValues = form.getValues();
      onSubmit(initialValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atenciones]);


  const onSubmit = (values: FilterValues) => {
    const filtered = atenciones.filter(a => {
        const atencionDate = new Date(a.fechaAtencion);
        const fromDate = values.dateRange.from;
        const toDate = values.dateRange.to;
        fromDate.setHours(0,0,0,0);
        toDate.setHours(23,59,59,999);

        if (atencionDate < fromDate || atencionDate > toDate) return false;
        if (values.gerencia && values.gerencia !== 'all' && a.empleado.gerencia !== values.gerencia) return false;
        if (values.sexo && values.sexo !== 'all' && a.paciente.sexo !== values.sexo) return false;

        if (values.edadFrom || values.edadTo) {
            const birthDate = new Date(a.paciente.fechaNacimiento!);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            if (values.edadFrom && age < values.edadFrom) return false;
            if (values.edadTo && age > values.edadTo) return false;
        }
        
        return true;
    });
    setFilteredAtenciones(filtered);
  };
  
  const exportToExcel = () => {
      toast({ title: "Exportando...", description: `Se están generando ${filteredAtenciones.length} registros.` });
      // In a real app, you would use a library like xlsx to generate the file
      console.log("Exporting data:", filteredAtenciones);
  }

  const kpis = useMemo(() => {
    const total = filteredAtenciones.length;
    const totalAge = filteredAtenciones.reduce((sum, a) => {
        const age = new Date().getFullYear() - new Date(a.paciente.fechaNacimiento!).getFullYear();
        return sum + age;
    }, 0);
    return {
        totalAtenciones: total,
        edadPromedio: total > 0 ? Math.round(totalAge / total) : 0,
        diagnosticosUnicos: new Set(filteredAtenciones.map(a => a.diagnosticoPrincipal)).size,
    };
  }, [filteredAtenciones]);

  const columns = [
    { accessor: (row: AtencionCompleta) => new Date(row.fechaAtencion).toLocaleDateString(), header: 'Fecha' },
    { accessor: (row: AtencionCompleta) => row.paciente.nombreCompleto, header: 'Paciente' },
    { accessor: (row: AtencionCompleta) => row.empleado.gerencia, header: 'Gerencia' },
    { accessor: 'diagnosticoPrincipal', header: 'Diagnóstico' },
    { accessor: (row: AtencionCompleta) => row.medico.nombreCompleto, header: 'Médico' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reporte de Atenciones</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Usa los filtros para refinar los datos del reporte.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Rango de Fechas</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                           <Button
                            variant={"outline"}
                            className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Seleccione un rango</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="gerencia" render={({ field }) => (
                  <FormItem><FormLabel>Gerencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="all">Todas</SelectItem>{gerencias.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>)}
                />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                  <FormItem><FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="F">Femenino</SelectItem><SelectItem value="M">Masculino</SelectItem></SelectContent>
                    </Select>
                  </FormItem>)}
                />
                 <div className="flex items-end gap-2">
                    <FormField control={form.control} name="edadFrom" render={({ field }) => (<FormItem><FormLabel>Edad (desde)</FormLabel><FormControl><Input type="number" placeholder="Ej: 20" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="edadTo" render={({ field }) => (<FormItem><FormLabel>(hasta)</FormLabel><FormControl><Input type="number" placeholder="Ej: 50" {...field} /></FormControl></FormItem>)} />
                </div>
              </div>
              <Button type="submit">Generar Reporte</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="Total de Atenciones" value={kpis.totalAtenciones} />
          <KpiCard title="Edad Promedio" value={kpis.edadPromedio} />
          <KpiCard title="Diagnósticos Únicos" value={kpis.diagnosticosUnicos} />
      </div>

      <Card>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle>Resultados del Reporte</CardTitle>
          <Button variant="outline" onClick={exportToExcel}><Download className="mr-2 h-4 w-4"/> Exportar a Excel</Button>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando datos...</p> : <DataTable columns={columns} data={filteredAtenciones} />}
        </CardContent>
      </Card>

    </div>
  );
}
