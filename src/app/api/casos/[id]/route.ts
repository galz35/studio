import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { CasoClinico, Paciente, AtencionMedica, ExamenMedico, SeguimientoPaciente } from '@/lib/types/domain';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID de caso no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  
  try {
    const casoRef = doc(firestore, 'casosClinicos', id);
    const casoSnap = await getDoc(casoRef);

    if (!casoSnap.exists()) {
      return NextResponse.json({ message: 'Caso clínico no encontrado.' }, { status: 404 });
    }

    const caso = { id: casoSnap.id, ...casoSnap.data() } as CasoClinico;

    // Obtener datos relacionados
    const pacienteRef = doc(firestore, 'pacientes', caso.idPaciente);
    const pacienteSnap = await getDoc(pacienteRef);

    if (!pacienteSnap.exists()) {
        return NextResponse.json({ message: `Paciente con ID ${caso.idPaciente} no encontrado para este caso.` }, { status: 404 });
    }
    const paciente = { id: pacienteSnap.id, ...pacienteSnap.data() } as Paciente;

    const atencionesQuery = query(collection(firestore, 'atencionesMedicas'), where('idCaso', '==', id));
    const examenesQuery = query(collection(firestore, 'examenesMedicos'), where('idCaso', '==', id));
    const seguimientosQuery = query(collection(firestore, 'seguimientosPacientes'), where('idCaso', '==', id));

    const [atencionesSnap, examenesSnap, seguimientosSnap] = await Promise.all([
        getDocs(atencionesQuery),
        getDocs(examenesQuery),
        getDocs(seguimientosQuery),
    ]);

    const atenciones = atencionesSnap.docs.map(d => ({ id: d.id, ...d.data() } as AtencionMedica));
    const examenes = examenesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ExamenMedico));
    const seguimientos = seguimientosSnap.docs.map(d => ({ id: d.id, ...d.data() } as SeguimientoPaciente));

    const response = {
      ...caso,
      paciente,
      atenciones,
      examenes,
      seguimientos,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error(`Error fetching case details for ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener el detalle del caso.', error: errorMessage }, { status: 500 });
  }
}
