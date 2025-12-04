"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/use-user-profile';
import { AdminService } from '@/lib/services/admin.service';
import { UsuarioAplicacion, EmpleadoEmp2024, Rol } from '@/lib/types/domain';
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
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const userSchema = z.object({
  userType: z.enum(['interno', 'externo']),
  empleadoCarnet: z.string().optional(),
  nombreCompleto: z.string().optional(),
  carnet: z.string().optional(),
  correo: z.string().email({ message: "Correo inválido." }).optional(),
  rol: z.enum(["PACIENTE", "MEDICO", "ADMIN"], { required_error: "El rol es requerido." }),
}).refine(data => {
  if (data.userType === 'interno') return !!data.empleadoCarnet;
  return true;
}, { message: "Debe seleccionar un empleado.", path: ["empleadoCarnet"] })
  .refine(data => {
    if (data.userType === 'externo') return !!data.nombreCompleto && !!data.carnet;
    return true;
  }, { message: "Nombre y Carnet son requeridos para usuarios externos.", path: ["nombreCompleto", "carnet"] });


type UserFormValues = z.infer<typeof userSchema>;

const editUserSchema = z.object({
  rol: z.enum(["PACIENTE", "MEDICO", "ADMIN"]),
  estado: z.enum(["A", "I"]),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;


export default function GestionUsuariosPage() {
  const { pais } = useUserProfile();
  const { toast } = useToast();

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioAplicacion | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usuarios, setUsuarios] = useState<UsuarioAplicacion[]>([]);
  const [empleados, setEmpleados] = useState<EmpleadoEmp2024[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!pais) return;
    setIsLoading(true);
    try {
      const [usuariosData, empleadosData] = await Promise.all([
        AdminService.getUsuarios(),
        AdminService.getEmpleados()
      ]);

      setUsuarios(usuariosData);
      setEmpleados(empleadosData);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos iniciales.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pais]);

  const usuariosDelPais = useMemo(() => {
    if (!usuarios || !pais) return [];
    return usuarios.filter(u => u.pais === pais);
  }, [usuarios, pais]);

  const empleadosDisponibles = useMemo(() => {
    if (!empleados || !usuarios || !pais) return [];
    const userCarnets = new Set(usuarios.map(u => u.carnet));
    return empleados.filter(e => e.pais === pais && !userCarnets.has(e.carnet));
  }, [empleados, usuarios, pais]);

  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userType: 'interno',
    }
  });

  const editForm = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  const userType = createForm.watch('userType');

  const handleEditClick = (user: UsuarioAplicacion) => {
    setSelectedUser(user);
    editForm.reset({
      rol: user.rol,
      estado: user.estado,
    });
    setEditDialogOpen(true);
  };


  const handleCreateSubmit = async (data: UserFormValues) => {
    if (!pais) return;
    setIsSubmitting(true);

    let newUserData: Omit<UsuarioAplicacion, 'id' | 'idUsuario'>;

    if (data.userType === 'interno') {
      const empleado = empleados?.find(e => e.carnet === data.empleadoCarnet)!;
      newUserData = {
        carnet: empleado.carnet,
        rol: data.rol,
        estado: 'A',
        nombreCompleto: empleado.nombreCompleto,
        correo: empleado.correo,
        pais: pais,
        ultimoAcceso: new Date().toISOString(),
      };
    } else { // Externo
      newUserData = {
        carnet: data.carnet!,
        rol: data.rol,
        estado: 'A',
        nombreCompleto: data.nombreCompleto!,
        correo: data.correo,
        pais: pais,
        ultimoAcceso: new Date().toISOString(),
      };
    }

    try {
      await AdminService.crearUsuario(newUserData);
      toast({ title: "Usuario Creado", description: `El usuario ${newUserData.nombreCompleto} ha sido añadido al sistema.` });
      setCreateDialogOpen(false);
      createForm.reset({ userType: 'interno', rol: undefined });
      fetchData(); // Refresh data
    } catch (e: any) {
      console.error("Error creating user:", e);
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'No se pudo crear el usuario.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: EditUserFormValues) => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await AdminService.updateUsuario(selectedUser.id!, data);
      toast({ title: "Usuario Actualizado", description: `Los datos de ${selectedUser.nombreCompleto} se han actualizado.` });
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchData(); // Refresh data
    } catch (e: any) {
      console.error("Error updating user:", e);
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'No se pudo actualizar el usuario.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { accessor: 'carnet', header: 'Carnet' },
    { accessor: 'nombreCompleto', header: 'Nombre' },
    { accessor: 'correo', header: 'Correo' },
    { accessor: 'rol', header: 'Rol' },
    {
      accessor: 'estado',
      header: 'Estado',
      cell: (row: UsuarioAplicacion) => (
        <Badge variant={row.estado === 'A' ? 'default' : 'destructive'} className={cn(row.estado === 'A' ? 'bg-accent text-accent-foreground' : '')}>
          {row.estado === 'A' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    { accessor: 'ultimoAcceso', header: 'Último Acceso', cell: (row: UsuarioAplicacion) => row.ultimoAcceso ? new Date(row.ultimoAcceso).toLocaleString('es-ES') : 'N/A' },
    {
      accessor: 'actions',
      header: 'Acciones',
      cell: (row: UsuarioAplicacion) => (
        <Button variant="ghost" size="icon" onClick={() => handleEditClick(row)}><Pencil className="h-4 w-4" /></Button>
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
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><PlusCircle /> Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader><DialogTitle>Crear Nuevo Usuario</DialogTitle></DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-6">
                <FormField control={createForm.control} name="userType" render={({ field }) => (
                  <FormItem className="space-y-3"><FormLabel>Tipo de Usuario</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="interno" /></FormControl><FormLabel className="font-normal">Interno (Empleado)</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="externo" /></FormControl><FormLabel className="font-normal">Externo</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl><FormMessage />
                  </FormItem>)}
                />

                {userType === 'interno' ? (
                  <FormField control={createForm.control} name="empleadoCarnet" render={({ field }) => (
                    <FormItem><FormLabel>Empleado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un empleado" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {empleadosDisponibles.length > 0 ? (
                            empleadosDisponibles.map(e => <SelectItem key={e.carnet} value={e.carnet}>{e.nombreCompleto} ({e.carnet})</SelectItem>)
                          ) : (
                            <SelectItem value="none" disabled>No hay empleados para crear usuarios</SelectItem>
                          )}
                        </SelectContent>
                      </Select><FormMessage />
                    </FormItem>)} />
                ) : (
                  <div className='grid grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20'>
                    <FormField control={createForm.control} name="nombreCompleto" render={({ field }) => (
                      <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Nombre del usuario" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={createForm.control} name="carnet" render={({ field }) => (
                      <FormItem><FormLabel>Carnet / ID</FormLabel><FormControl><Input placeholder="Identificador único" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={createForm.control} name="correo" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Correo</FormLabel><FormControl><Input placeholder="correo@externo.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}

                <FormField control={createForm.control} name="rol" render={({ field }) => (
                  <FormItem><FormLabel>Asignar Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un rol" /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="PACIENTE">Paciente</SelectItem><SelectItem value="MEDICO">Médico</SelectItem><SelectItem value="ADMIN">Administrador</SelectItem></SelectContent>
                    </Select><FormMessage />
                  </FormItem>)} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Usuario
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario: {selectedUser?.nombreCompleto}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol del Usuario</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PACIENTE">Paciente</SelectItem>
                        <SelectItem value="MEDICO">Médico</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Activo</SelectItem>
                        <SelectItem value="I">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>Listado de Usuarios del Sistema ({pais})</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={usuariosDelPais} filterColumn="nombreCompleto" filterPlaceholder="Filtrar por nombre..." />
        </CardContent>
      </Card>
    </div>
  );
}
