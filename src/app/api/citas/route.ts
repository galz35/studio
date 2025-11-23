import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { CitaMedica, CasoClinico, Medico } from '@/lib/types/domain';

// POST: /api/citas
// Crea una nueva cita y actualiza el caso clínico correspondiente.
export async function POST(request: Request) {
  try {
    const { firestore } = initializeFirebase();
    const body = await request.json();

    const { idCaso, idPaciente, idMedico, fechaCita, horaCita, pais } = body;

    if (!idCaso || !idPaciente || !idMedico || !fechaCita || !horaCita || !pais) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const casoRef = doc(firestore, 'casosClinicos', idCaso);
    const casoSnap = await getDoc(casoRef);

    if (!casoSnap.exists()) {
        return NextResponse.json({ message: 'El caso clínico no existe.' }, { status: 404 });
    }

    const casoData = casoSnap.data() as CasoClinico;

    // 1. Crear la nueva CitaMedica
    const newCita: Omit<CitaMedica, 'id' | 'idCita'> = {
      idCaso: idCaso,
      idPaciente: idPaciente,
      idMedico: idMedico,
      fechaCita: fechaCita,
      horaCita: horaCita,
      canalOrigen: 'AGENDADA_POR_MEDICO',
      estadoCita: 'PROGRAMADA',
      motivoResumen: casoData.motivoConsulta,
      nivelSemaforoPaciente: casoData.nivelSemaforo,
      pais: pais,
    };

    const citaCollectionRef = collection(firestore, 'citasMedicas');
    const docRef = await addDoc(citaCollectionRef, newCita);

    // 2. Actualizar el CasoClinico
    await updateDoc(casoRef, {
      estadoCaso: 'Agendado',
      idCita: docRef.id,
    });

    return NextResponse.json({ id: docRef.id, ...newCita }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la cita:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al crear la cita', error: errorMessage }, { status: 500 });
  }
}
