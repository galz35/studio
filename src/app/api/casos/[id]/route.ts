import { NextResponse } from 'next/server';
import type { CasoClinico, Paciente, AtencionMedica, ExamenMedico, SeguimientoPaciente, Medico } from '@/lib/types/domain';

// --- Hardcoded Mock Data for this specific API endpoint ---
const pacientes: Paciente[] = [
  { id: "paciente-001", idPaciente: 1, carnet: "P001", nombreCompleto: "Ana Sofía Pérez", gerencia: "Marketing", area: "Digital", telefono: "8888-1111", correo: "ana.perez@corp.com", estadoPaciente: "A", nivelSemaforo: "V", pais: "NI" },
  { id: "paciente-002", idPaciente: 2, carnet: "P002", nombreCompleto: "Luis Fernando García", gerencia: "Tecnología", area: "Desarrollo", telefono: "8888-2222", correo: "luis.garcia@corp.com", estadoPaciente: "A", nivelSemaforo: "R", pais: "CR" },
];

const casosClinicos: CasoClinico[] = [
  { id: "caso-001", idCaso: 1, codigoCaso: "CC-2024-001", idPaciente: "paciente-001", idCita: "cita-001", fechaCreacion: "2024-07-29", estadoCaso: "Cerrado", nivelSemaforo: "V", motivoConsulta: "Revisión general anual", pais: "NI" },
  { id: "caso-002", idCaso: 2, codigoCaso: "CC-2024-002", idPaciente: "paciente-002", idCita: "cita-002", fechaCreacion: "2024-07-30", estadoCaso: "Abierto", nivelSemaforo: "R", motivoConsulta: "Migraña severa", pais: "CR" },
];

const atenciones: AtencionMedica[] = [
    { idAtencion: 1, id: "atencion-001", idCita: "cita-001", idCaso: "caso-001", idMedico: "medico-001", fechaAtencion: "2024-07-29T10:00:00Z", diagnosticoPrincipal: "Condición saludable", requiereSeguimiento: false, estadoClinico: "BIEN" },
];

const examenes: ExamenMedico[] = [
    { idExamen: 1, id: "examen-001", idCaso: "caso-001", idPaciente: "paciente-001", tipoExamen: "Hemograma Completo", fechaSolicitud: "2024-07-29", estadoExamen: "ENTREGADO", laboratorio: "LabCorp", fechaResultado: "2024-07-30", resultadoResumen: "Valores normales." },
];

const seguimientos: SeguimientoPaciente[] = [];
// --- End of Mock Data ---


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: 'ID de caso no proporcionado.' }, { status: 400 });
  }

  // Simulating fetching from mock data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const caso = casosClinicos.find(c => c.id === id);

  if (!caso) {
    return NextResponse.json({ message: 'Caso clínico no encontrado.' }, { status: 404 });
  }

  const paciente = pacientes.find(p => p.id === caso.idPaciente);
  if (!paciente) {
    return NextResponse.json({ message: `Paciente con ID ${caso.idPaciente} no encontrado para este caso.` }, { status: 404 });
  }

  const response = {
    ...caso,
    paciente: paciente,
    atenciones: atenciones.filter(a => a.idCaso === caso.id),
    examenes: examenes.filter(e => e.idCaso === caso.id),
    seguimientos: seguimientos.filter(s => s.idCaso === caso.id),
  };

  return NextResponse.json(response);
}
