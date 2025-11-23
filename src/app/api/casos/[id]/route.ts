import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { CasoClinico, Paciente, AtencionMedica, ExamenMedico, SeguimientoPaciente } from '@/lib/types/domain';
import { casosClinicos } from '@/lib/mock/casosClinicos.mock';
import { pacientes } from '@/lib/mock/pacientes.mock';
import { atenciones } from '@/lib/mock/atenciones.mock';
import { examenes } from '@/lib/mock/examenes.mock';
import { seguimientos } from '@/lib/mock/seguimientos.mock';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID de caso no proporcionado.' }, { status: 400 });
  }

  // Simulating fetching from mock data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const caso = casosClinicos.find(c => c.id === id);

  if (!caso) {
    return NextResponse.json({ message: 'Caso clínico no encontrado.' }, { status: 404 });
  }

  const paciente = pacientes.find(p => p.id === caso.idPaciente);
  if (!paciente) {
    // This case should ideally not happen if data is consistent
    return NextResponse.json({ message: `Paciente con ID ${caso.idPaciente} no encontrado para este caso.` }, { status: 404 });
  }

  const response = {
    ...caso,
    paciente: paciente,
    atenciones: atenciones.filter(a => a.idCaso === caso.id),
    examenes: examenes.filter(e => e.idCaso === caso.id),
    seguimientos: seguimientos.filter(s => s.idCaso === caso.id),
  };

  return NextResponse.json(response);
}
