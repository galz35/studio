import { NextResponse } from 'next/server';
import type { EmpleadoEmp2024 } from '@/lib/types/domain';

// En un escenario real, estos datos vendrían de una base de datos PostgreSQL, SQL Server, etc.
// Usaríamos un ORM como Prisma para hacer: await prisma.empleado.findMany();
const empleados: EmpleadoEmp2024[] = [
    {
        carnet: 'CL-001',
        nombreCompleto: 'Juan Pérez',
        correo: 'juan.perez@claro.com.ni',
        cargo: 'Ejecutivo de Ventas',
        gerencia: 'Ventas Corporativas',
        subgerencia: 'Grandes Cuentas',
        area: 'Ventas Directas',
        telefono: '8888-1234',
        nomJefe: 'Sofía Castillo',
        correoJefe: 'sofia.castillo@claro.com.ni',
        carnetJefe: 'CL-J01',
        pais: 'NI',
        fechaNacimiento: '1990-05-15',
        fechaContratacion: '2018-02-01',
        estado: 'ACTIVO'
    },
    {
        carnet: 'CL-002',
        nombreCompleto: 'María Rodríguez',
        correo: 'maria.rodriguez@claro.com.cr',
        cargo: 'Analista de Soporte Técnico',
        gerencia: 'Tecnología',
        subgerencia: 'Operaciones IT',
        area: 'Soporte Nivel 2',
        telefono: '7777-5678',
        nomJefe: 'Roberto Fernández',
        correoJefe: 'roberto.fernandez@claro.com.cr',
        carnetJefe: 'CL-J02',
        pais: 'CR',
        fechaNacimiento: '1995-08-20',
        fechaContratacion: '2020-07-10',
        estado: 'ACTIVO'
    },
    {
        carnet: 'CL-003',
        nombreCompleto: 'Carlos López',
        correo: 'carlos.lopez@claro.com.hn',
        cargo: 'Coordinador de Proyectos',
        gerencia: 'Proyectos Estratégicos',
        subgerencia: 'PMO',
        area: 'Proyectos Internos',
        telefono: '9999-1122',
        nomJefe: 'Laura Martínez',
        correoJefe: 'laura.martinez@claro.com.hn',
        carnetJefe: 'CL-J03',
        pais: 'HN',
        fechaNacimiento: '1988-11-30',
        fechaContratacion: '2015-03-20',
        estado: 'ACTIVO'
    },
    {
        carnet: 'CL-004',
        nombreCompleto: 'Ana Martínez',
        correo: 'ana.martinez@claro.com.ni',
        cargo: 'Especialista de Mercadeo',
        gerencia: 'Mercadeo',
        subgerencia: 'Publicidad',
        area: 'Campañas',
        telefono: '8765-4321',
        nomJefe: 'Sofía Castillo',
        correoJefe: 'sofia.castillo@claro.com.ni',
        carnetJefe: 'CL-J01',
        pais: 'NI',
        fechaNacimiento: '1992-01-25',
        fechaContratacion: '2019-11-01',
        estado: 'ACTIVO'
    },
    {
        carnet: 'CL-005',
        nombreCompleto: 'Pedro Jiménez',
        correo: 'pedro.jimenez@claro.com.cr',
        cargo: 'Desarrollador Senior',
        gerencia: 'Tecnología',
        subgerencia: 'Desarrollo de Software',
        area: 'Desarrollo Core',
        telefono: '6543-2109',
        nomJefe: 'Roberto Fernández',
        correoJefe: 'roberto.fernandez@claro.com.cr',
        carnetJefe: 'CL-J02',
        pais: 'CR',
        fechaNacimiento: '1991-09-12',
        fechaContratacion: '2017-06-15',
        estado: 'INACTIVO'
    }
];

export async function GET(request: Request) {
  // En un escenario real, aquí iría la lógica para conectar a la DB
  // y devolver los datos. Por ahora, devolvemos los datos mock.
  
  // Simulamos un retraso de red para que los estados de carga sean visibles.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(empleados);
}
