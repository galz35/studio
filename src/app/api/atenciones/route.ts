import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';

// POST: /api/atenciones
// Guarda un registro de atención médica completo, incluyendo vacunas y seguimientos.
export async function POST(request: Request) {
  const { firestore } = initializeFirebase();
  
  try {
    const body = await request.json();
    const { atencion, vacunas, psico, seguimientos } = body;

    if (!atencion || !atencion.idCita || !atencion.idMedico) {
      return NextResponse.json({ message: 'Datos de atención incompletos.' }, { status: 400 });
    }

    const batch = writeBatch(firestore);

    // 1. Guardar la atención principal
    const atencionRef = doc(collection(firestore, 'atencionesMedicas'));
    batch.set(atencionRef, { ...atencion, id: atencionRef.id });

    // 2. Marcar la cita como FINALIZADA
    const citaRef = doc(firestore, 'citasMedicas', atencion.idCita);
    batch.update(citaRef, { estadoCita: 'FINALIZADA' });
    
    // 3. (Opcional) Marcar el caso como Cerrado si se indica
    if (atencion.idCaso) {
       const casoRef = doc(firestore, 'casosClinicos', atencion.idCaso);
       batch.update(casoRef, { estadoCaso: 'Cerrado' });
    }

    // 4. Guardar vacunas si existen
    if (vacunas && vacunas.length > 0) {
      const vacunasCollection = collection(firestore, 'vacunasAplicadas');
      vacunas.forEach((vacuna: any) => {
        const vacunaRef = doc(vacunasCollection);
        batch.set(vacunaRef, { ...vacuna, idAtencion: atencionRef.id, id: vacunaRef.id });
      });
    }
    
    // 5. Guardar registro psicosocial si existe
    if (psico) {
        const psicoRef = doc(collection(firestore, 'registrosPsicosociales'));
        batch.set(psicoRef, { ...psico, idAtencion: atencionRef.id, id: psicoRef.id });
    }

    // 6. Guardar nuevos seguimientos si existen
    if (seguimientos && seguimientos.length > 0) {
        const seguimientosCollection = collection(firestore, 'seguimientosPacientes');
        seguimientos.forEach((seguimiento: any) => {
            const seguimientoRef = doc(seguimientosCollection);
            batch.set(seguimientoRef, { ...seguimiento, idAtencion: atencionRef.id, id: seguimientoRef.id });
        });
    }

    await batch.commit();

    return NextResponse.json({ message: 'Atención guardada exitosamente', idAtencion: atencionRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error al guardar la atención:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al guardar la atención', error: errorMessage }, { status: 500 });
  }
}
