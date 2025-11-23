import { NextResponse } from 'next/server';
import type { Medico } from '@/lib/types/domain';
import { medicos as mockMedicos } from '@/lib/mock/medicos.mock';

// En un escenario real, esta variable `medicos` estaría conectada
// a una base de datos real (PostgreSQL, MongoDB, etc.) usando un ORM como Prisma.
// Por ahora, usamos un array en memoria para simular la base de datos.
let medicos: Medico[] = [...mockMedicos];

export async function GET(request: Request) {
  // Simula un retraso de red.
  await new Promise(resolve => setTimeout(resolve, 500));

  // Devuelve la lista actual de médicos.
  return NextResponse.json(medicos);
}

export async function POST(request: Request) {
  try {
    const newMedicoData = await request.json();

    // Simulación de creación en base de datos.
    const newMedico: Medico = {
      ...newMedicoData,
      idMedico: medicos.length + 1, // Simula un ID autoincremental.
      id: String(medicos.length + 1), // Simula un ID de documento.
    };

    medicos.push(newMedico);

    return NextResponse.json(newMedico, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error al crear el médico" }, { status: 500 });
  }
}
