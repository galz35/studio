import { NextResponse } from 'next/server';
import type { UsuarioAplicacion } from '@/lib/types/domain';
import { usuarios as mockUsuarios } from '@/lib/mock/usuarios.mock';

// En un escenario real, esta variable `usuarios` estaría conectada
// a una base de datos real (PostgreSQL, MongoDB, etc.) usando un ORM como Prisma.
// Por ahora, usamos un array en memoria para simular la base de datos.
let usuarios: UsuarioAplicacion[] = [...mockUsuarios];

export async function GET(request: Request) {
  // Simula un retraso de red.
  await new Promise(resolve => setTimeout(resolve, 500));

  // Devuelve la lista actual de usuarios.
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  try {
    const newUserRequest = await request.json();

    // Simulación de creación en base de datos.
    const newUser: UsuarioAplicacion = {
      ...newUserRequest,
      idUsuario: usuarios.length + 1, // Simula un ID autoincremental.
      id: String(usuarios.length + 1), // Simula un ID de documento.
    };

    usuarios.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error al crear el usuario" }, { status: 500 });
  }
}
