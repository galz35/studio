import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { VacunaAplicada, Medico } from '@/lib/types/domain';

async function getMedico(idMedico: string) {
    const { firestore } = initializeFirebase();
    const medicoRef = doc(firestore, 'medicos', idMedico);
    const medicoSnap = await getDoc(medicoRef);
    return medicoSnap.exists() ? { id: medicoSnap.id, ...medicoSnap.data() } as Medico : null;
}

// GET: /api/pacientes/[id]/vacunas
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: idPaciente } = params;
  if (!idPaciente) {
    return NextResponse.json({ message: 'ID de paciente no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  try {
    const vacunasQuery = query(
      collection(firestore, 'vacunasAplicadas'),
      where('idPaciente', '==', idPaciente),
      orderBy('fechaAplicacion', 'desc')
    );
    const snapshot = await getDocs(vacunasQuery);
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const vacunasPromises = snapshot.docs.map(async (docData) => {
        const vacuna = { id: docData.id, ...docData.data() } as VacunaAplicada;
        if (vacuna.idMedico) {
            vacuna.medico = await getMedico(vacuna.idMedico);
        }
        return vacuna;
    });

    const vacunas = await Promise.all(vacunasPromises);
    
    return NextResponse.json(vacunas);
  } catch (error) {
    console.error(`Error al obtener vacunas para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener las vacunas.', error: errorMessage }, { status: 500 });
  }
}
