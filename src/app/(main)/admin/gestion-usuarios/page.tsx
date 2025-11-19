"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import * as api from '@/lib/services/api.mock';
import { UsuarioAplicacion, EmpleadoEmp2024, Rol } from '@/lib/types/domain';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pencil } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const userSchema = z.object({
  carnet: z.string().min(1, "Debe seleccionar un empleado."),
  rol: z.enum(["PACIENTE", "MEDICO", "ADMIN"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function GestionUsuariosPage() {
  const { pais } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioAplicacion[]>([]);
  const [empleados, setEmpleados] = useState<EmpleadoEmp2024[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    Promise.all([
      api.getUsuarios({ pais }),
      api.getEmpleados()
    ]).then(([usersRes, employeesRes]) => {
      setUsuarios(usersRes);
      setEmpleados(employeesRes);
      setLoading(false);
    });
  }, [pais]);

  const onSubmit = (data: UserFormValues) => {
    // Mock user creation
    const empleado = empleados.find(e => e.carnet === data.carnet)!;
    const newUser: UsuarioAplicacion = {
      idUsuario: usuarios.length + 1,
      carnet: data.carnet,
      rol: data.rol,
      estado: 'A',
      nombreCompleto: empleado.nombreCompleto,
      pais: empleado.pais,
      ultimoAcceso: new Date().toISOString(),
    };
    setUsuarios(prev => [...prev, newUser]);
    setDialogOpen(false);
    form.reset();
  };

  const columns = [
    { accessor: 'carnet', header: 'Carnet' },
    { accessor: 'nombreCompleto', header: 'Nombre' },
    { accessor: 'rol', header: 'Rol' },
    {
      accessor: 'estado',
      header: 'Estado',
      cell: (row: UsuarioAplicacion) => (
        <Badge variant={row.estado === 'A' ? 'default' : 'destructive'} className={row.estado === 'A' ? 'bg-accent text-accent-foreground' : ''}>
          {row.estado === 'A' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    { accessor: (row: UsuarioAplicacion) => row.idPaciente ? 'Sí' : 'No', header: '¿Es Paciente?' },
    { accessor: (row: UsuarioAplicacion) => row.idMedico ? 'Sí' : 'No', header: '¿Es Médico?' },
    { accessor: 'ultimoAcceso', header: 'Último Acceso', cell: (row: UsuarioAplicacion) => row.ultimoAcceso ? new Date(row.ultimoAcceso).toLocaleString('es-ES') : 'N/A' },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: () => (
        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
      ),
    },
  ];

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><PlusCircle /> Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crear Nuevo Usuario</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="carnet" render={({ field }) => (
                  <FormItem><FormLabel>Empleado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un empleado" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {empleados.filter(e => e.pais === pais).map(e => <SelectItem key={e.carnet} value={e.carnet}>{e.nombreCompleto} ({e.carnet})</SelectItem>)}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>)} />
                <FormField control={form.control} name="rol" render={({ field }) => (
                  <FormItem><FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un rol" /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="PACIENTE">Paciente</SelectItem><SelectItem value="MEDICO">Médico</SelectItem><SelectItem value="ADMIN">Administrador</SelectItem></SelectContent>
                    </Select><FormMessage />
                  </FormItem>)} />
                <Button type="submit">Crear Usuario</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Listado de Usuarios del Sistema</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={usuarios} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre..." />
        </CardContent>
      </Card>
    </div>
  );
}
