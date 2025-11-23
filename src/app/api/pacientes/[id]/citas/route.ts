import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { CitaMedica, Medico } from '@/lib/types/domain';

async function getMedico(idMedico: string) {
    const { firestore } = initializeFirebase();
    const medicoRef = doc(firestore, 'medicos', idMedico);
    const medicoSnap = await getDoc(medicoRef);
    return medicoSnap.exists() ? { id: medicoSnap.id, ...medicoSnap.data() } as Medico : null;
}

// GET: /api/pacientes/[id]/citas
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: idPaciente } = params;
  if (!idPaciente) {
    return NextResponse.json({ message: 'ID de paciente no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  try {
    const citasQuery = query(
      collection(firestore, 'citasMedicas'),
      where('idPaciente', '==', idPaciente),
      orderBy('fechaCita', 'desc')
    );
    const snapshot = await getDocs(citasQuery);
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const citasPromises = snapshot.docs.map(async (docData) => {
      const cita = { id: docData.id, ...docData.data() } as CitaMedica;
      if (cita.idMedico) {
          cita.medico = await getMedico(cita.idMedico);
      }
      return cita;
    });

    const citas = await Promise.all(citasPromises);

    return NextResponse.json(citas);
  } catch (error) {
    console.error(`Error al obtener citas para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener las citas.', error: errorMessage }, { status: 500 });
  }
}
