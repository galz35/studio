import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ChequeoBienestar } from '@/lib/types/domain';

// GET: /api/pacientes/[id]/chequeos
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: idPaciente } = params;
  if (!idPaciente) {
    return NextResponse.json({ message: 'ID de paciente no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();
  try {
    const chequeosQuery = query(
      collection(firestore, 'chequeosBienestar'),
      where('idPaciente', '==', idPaciente),
      orderBy('fechaRegistro', 'desc')
    );
    const snapshot = await getDocs(chequeosQuery);
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const chequeos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChequeoBienestar));
    
    return NextResponse.json(chequeos);
  } catch (error) {
    console.error(`Error al obtener chequeos para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener los chequeos.', error: errorMessage }, { status: 500 });
  }
}
