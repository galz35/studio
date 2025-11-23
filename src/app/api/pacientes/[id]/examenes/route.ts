import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ExamenMedico } from '@/lib/types/domain';

// GET: /api/pacientes/[id]/examenes
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: idPaciente } = params;
  if (!idPaciente) {
    return NextResponse.json({ message: 'ID de paciente no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  try {
    const examenesQuery = query(
      collection(firestore, 'examenesMedicos'),
      where('idPaciente', '==', idPaciente),
      orderBy('fechaSolicitud', 'desc')
    );
    const snapshot = await getDocs(examenesQuery);
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const examenes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamenMedico));
    
    return NextResponse.json(examenes);
  } catch (error) {
    console.error(`Error al obtener exámenes para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener los exámenes.', error: errorMessage }, { status: 500 });
  }
}
