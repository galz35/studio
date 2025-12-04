"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import { AdminService } from '@/lib/services/admin.service';
import { Medico, EmpleadoEmp2024 } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pencil, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


const medicoSchema = z.object({
  userType: z.enum(['interno', 'externo']),
  empleadoCarnet: z.string().optional(),
  nombreCompleto: z.string().optional(),
  especialidad: z.string().min(1, 'La especialidad es requerida.'),
  correo: z.string().email('Correo inválido.').optional(),
  telefono: z.string().optional(),
  carnet: z.string().optional(),
}).refine(data => {
  if (data.userType === 'interno') return !!data.empleadoCarnet;
  return true;
}, { message: "Debe seleccionar un empleado.", path: ["empleadoCarnet"] })
  .refine(data => {
    if (data.userType === 'externo') return !!data.nombreCompleto;
    return true;
  }, { message: "El nombre es requerido para médicos externos.", path: ["nombreCompleto"] });


type MedicoFormValues = z.infer<typeof medicoSchema>;

export default function GestionMedicosPage() {
  const { pais } = useUserProfile();
  const { toast } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [empleados, setEmpleados] = useState<EmpleadoEmp2024[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!pais) return;
    setIsLoading(true);
    try {
      const [medicosData, empleadosData] = await Promise.all([
        AdminService.getMedicos(),
        AdminService.getEmpleados()
      ]);
      setMedicos(medicosData);
      setEmpleados(empleadosData);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pais]);

  const medicosDelPais = useMemo(() => {
    if (!medicos || !empleados || !pais) return [];

    // Get all external doctors
    const medicosExternos = medicos.filter(m => m.tipoMedico === 'EXTERNO');

    // Get internal doctors from the selected country
    const empleadosDelPaisCarnets = new Set(empleados.filter(e => e.pais === pais).map(e => e.carnet));
    const medicosInternosDelPais = medicos.filter(m => {
      return m.tipoMedico === 'INTERNO' && m.carnet && empleadosDelPaisCarnets.has(m.carnet);
    });

    return [...medicosInternosDelPais, ...medicosExternos];
  }, [medicos, empleados, pais]);


  const empleadosDisponibles = useMemo(() => {
    if (!empleados || !medicos || !pais) return [];
    const medicoCarnets = new Set(medicos.map(m => m.carnet));
    return empleados.filter(e => e.pais === pais && !medicoCarnets.has(e.carnet));
  }, [empleados, medicos, pais]);


  const form = useForm<MedicoFormValues>({
    resolver: zodResolver(medicoSchema),
    defaultValues: {
      userType: 'interno',
    }
  });

  const userType = form.watch('userType');

  const onSubmit = async (data: MedicoFormValues) => {
    setIsSubmitting(true);

    let newMedicoData: Omit<Medico, 'idMedico' | 'id'>;

    if (data.userType === 'interno') {
      const empleado = empleados?.find(e => e.carnet === data.empleadoCarnet)!;
      newMedicoData = {
        carnet: empleado.carnet,
        nombreCompleto: empleado.nombreCompleto,
        especialidad: data.especialidad,
        tipoMedico: 'INTERNO',
        correo: empleado.correo,
        telefono: empleado.telefono,
        estadoMedico: 'A',
      };
    } else { // Externo
      newMedicoData = {
        nombreCompleto: data.nombreCompleto!,
        carnet: data.carnet,
        especialidad: data.especialidad,
        tipoMedico: 'EXTERNO',
        correo: data.correo,
        telefono: data.telefono,
        estadoMedico: 'A',
      };
    }

    try {
      await AdminService.crearMedico(newMedicoData);
      toast({ title: "Médico Creado", description: `El Dr./Dra. ${newMedicoData.nombreCompleto} ha sido añadido al sistema.` });
      setDialogOpen(false);
      form.reset({ userType: 'interno' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error creating medico:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo crear el médico.' })
    } finally {
      setIsSubmitting(false);
    }
  };


  const columns = [
    { accessor: 'nombreCompleto', header: 'Nombre' },
    { accessor: 'especialidad', header: 'Especialidad' },
    { accessor: 'tipoMedico', header: 'Tipo' },
    { accessor: 'correo', header: 'Correo' },
    { accessor: 'telefono', header: 'Teléfono' },
    {
      accessor: 'estadoMedico',
      header: 'Estado',
      cell: (row: Medico) => (
        <Badge variant={row.estadoMedico === 'A' ? 'default' : 'destructive'} className={row.estadoMedico === 'A' ? 'bg-accent text-accent-foreground' : ''}>
          {row.estadoMedico === 'A' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: () => (
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      ),
    },
  ];

  if (isLoading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-52" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Médicos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><PlusCircle /> Nuevo Médico</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader><DialogTitle>Crear Nuevo Médico</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="userType" render={({ field }) => (
                  <FormItem className="space-y-3"><FormLabel>Tipo de Médico</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="interno" /></FormControl><FormLabel className="font-normal">Interno (Empleado)</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="externo" /></FormControl><FormLabel className="font-normal">Externo</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl><FormMessage />
                  </FormItem>)}
                />

                {userType === 'interno' ? (
                  <FormField control={form.control} name="empleadoCarnet" render={({ field }) => (
                    <FormItem><FormLabel>Empleado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un empleado" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {empleadosDisponibles.length > 0 ? (
                            empleadosDisponibles.map(e => <SelectItem key={e.carnet} value={e.carnet}>{e.nombreCompleto} ({e.carnet})</SelectItem>)
                          ) : (
                            <SelectItem value="none" disabled>No hay empleados disponibles</SelectItem>
                          )}
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>)} />
                ) : (
                  <div className='grid grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20'>
                    <FormField control={form.control} name="nombreCompleto" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Nombre del médico" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="correo" render={({ field }) => (
                      <FormItem><FormLabel>Correo</FormLabel><FormControl><Input placeholder="correo@externo.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="telefono" render={({ field }) => (
                      <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input placeholder="8888-8888" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="carnet" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Carnet / ID (Opcional)</FormLabel><FormControl><Input placeholder="Identificador único" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}

                <FormField control={form.control} name="especialidad" render={({ field }) => (
                  <FormItem><FormLabel>Especialidad</FormLabel>
                    <FormControl><Input placeholder="Ej: Medicina General, Cardiología..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>)} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Médico
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Listado de Médicos ({pais})</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={medicosDelPais} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre..." />
        </CardContent>
      </Card>
    </div>
  );
}
