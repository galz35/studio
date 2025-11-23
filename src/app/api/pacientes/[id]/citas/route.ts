import { NextResponse } from 'next/server';
import type { CitaMedica, Medico } from '@/lib/types/domain';

// --- Hardcoded Mock Data for this specific API endpoint ---
const medicos: Medico[] = [
    { id: "medico-001", idMedico: 1, nombreCompleto: "Dr. Carlos Herrera", especialidad: "Medicina General", tipoMedico: "INTERNO", estadoMedico: "A" },
    { id: "medico-002", idMedico: 2, nombreCompleto: "Dra. Isabel Castillo", especialidad: "Salud Ocupacional", tipoMedico: "INTERNO", estadoMedico: "A" },
];

const citas: CitaMedica[] = [
    { idCita: 1, id: "cita-001", idPaciente: "paciente-001", idMedico: "medico-001", fechaCita: "2024-08-05", horaCita: "10:00", estadoCita: "PROGRAMADA", canalOrigen: "CHEQUEO", motivoResumen: "Control Anual", nivelSemaforoPaciente: "V", pais: "NI" },
    { idCita: 2, id: "cita-002", idPaciente: "paciente-001", idMedico: "medico-002", fechaCita: "2024-07-20", horaCita: "14:00", estadoCita: "FINALIZADA", canalOrigen: "CHEQUEO", motivoResumen: "Revisión de gripe", nivelSemaforoPaciente: "A", pais: "NI" },
    { idCita: 3, id: "cita-003", idPaciente: "paciente-002", idMedico: "medico-001", fechaCita: "2024-08-06", horaCita: "09:00", estadoCita: "PROGRAMADA", canalOrigen: "SOLICITUD", motivoResumen: "Migraña", nivelSemaforoPaciente: "R", pais: "CR" },
];
// --- End of Mock Data ---

// GET: /api/pacientes/[id]/citas
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: idPaciente } = params;
  if (!idPaciente) {
    return NextResponse.json({ message: 'ID de paciente no proporcionado.' }, { status: 400 });
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const citasPaciente = citas.filter(c => c.idPaciente === idPaciente);

    const citasConMedico = citasPaciente.map(cita => {
        const medico = medicos.find(m => m.id === cita.idMedico);
        return { ...cita, medico };
    });
    
    return NextResponse.json(citasConMedico);
  } catch (error) {
    console.error(`Error al obtener citas para el paciente ${idPaciente}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ message: 'Error al obtener las citas.', error: errorMessage }, { status: 500 });
  }
}
