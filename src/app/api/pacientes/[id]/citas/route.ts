import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import type { CitaMedica, Medico } from '@/lib/types/domain';


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
    const citasSnap = await getDocs(citasQuery);
    
    if (citasSnap.empty) {
        return NextResponse.json([]);
    }

    const citas = citasSnap.docs.map(d => ({ id: d.id, ...d.data() } as CitaMedica));

    const citasConMedico = await Promise.all(citas.map(async (cita) => {
        if (!cita.idMedico) return cita;
        
        const medicoRef = doc(firestore, 'medicos', cita.idMedico);
        const medicoSnap = await getDoc(medicoRef);
        const medico = medicoSnap.exists() ? { id: medicoSnap.id, ...medicoSnap.data() } as Medico : undefined;
        return { ...cita, medico };
    }));
    
    return NextResponse.json(citasConMedico);
  } catch (error) {
    console.error(`Error al obtener citas para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener las citas.', error: errorMessage }, { status: 500 });
  }
}
