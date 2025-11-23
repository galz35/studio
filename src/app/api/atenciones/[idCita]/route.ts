import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CitaMedica, Paciente, CasoClinico, EmpleadoEmp2024 } from '@/lib/types/domain';

// GET: /api/atenciones/[idCita]
// Obtiene todos los datos necesarios para la página de atención médica.
export async function GET(request: Request, { params }: { params: { idCita: string } }) {
  const { idCita } = params;
  if (!idCita) {
    return NextResponse.json({ message: 'ID de cita no proporcionado.' }, { status: 400 });
  }

  const { firestore } = initializeFirebase();

  try {
    // 1. Obtener la Cita
    const citaRef = doc(firestore, 'citasMedicas', idCita);
    const citaSnap = await getDoc(citaRef);
    if (!citaSnap.exists()) {
      return NextResponse.json({ message: 'Cita no encontrada.' }, { status: 404 });
    }
    const cita = { id: citaSnap.id, ...citaSnap.data() } as CitaMedica;

    // 2. Obtener el Paciente
    const pacienteRef = doc(firestore, 'pacientes', cita.idPaciente);
    const pacienteSnap = await getDoc(pacienteRef);
    if (!pacienteSnap.exists()) {
      throw new Error('Paciente asociado a la cita no encontrado.');
    }
    const paciente = { id: pacienteSnap.id, ...pacienteSnap.data() } as Paciente;

    // 3. Obtener el Caso Clínico
    if (!cita.idCaso) {
        throw new Error('La cita no tiene un caso clínico asociado.');
    }
    const casoRef = doc(firestore, 'casosClinicos', cita.idCaso);
    const casoSnap = await getDoc(casoRef);
    if (!casoSnap.exists()) {
      throw new Error('Caso clínico asociado a la cita no encontrado.');
    }
    const caso = { id: casoSnap.id, ...casoSnap.data() } as CasoClinico;

    // 4. Obtener los datos del Empleado (desde el carnet del paciente)
    const empleadoRef = doc(firestore, 'empleadosEmp2024', paciente.carnet);
    const empleadoSnap = await getDoc(empleadoRef);
    if (!empleadoSnap.exists()) {
        throw new Error('Datos de empleado no encontrados para este paciente.');
    }
    const empleado = { id: empleadoSnap.id, ...empleadoSnap.data() } as EmpleadoEmp2024;
    
    // Devolvemos el paquete de datos completo
    const responsePayload = {
      cita,
      paciente,
      empleado,
      caso
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error(`Error al obtener datos para la atención ${idCita}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener los datos de la atención.', error: errorMessage }, { status: 500 });
  }
}
