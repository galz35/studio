import type { CitaMedica } from "@/lib/types/domain";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);


const formatDate = (date: Date) => date.toISOString().split('T')[0];

const d = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

export const citas: CitaMedica[] = [
  {
    idCita: 1,
    idCaso: 1,
    idPaciente: 2,
    idMedico: 1,
    fechaCita: formatDate(today),
    horaCita: "14:00",
    canalOrigen: "CHEQUEO",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Paciente reporta migraña severa. Prioridad alta.",
    nivelSemaforoPaciente: 'R',
  },
  {
    idCita: 2,
    idCaso: 2,
    idPaciente: 3,
    idMedico: 2,
    fechaCita: formatDate(today),
    horaCita: "15:30",
    canalOrigen: "CHEQUEO",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Seguimiento por fatiga.",
    nivelSemaforoPaciente: 'A',
  },
  {
    idCita: 3,
    idPaciente: 1,
    idMedico: 1,
    fechaCita: formatDate(tomorrow),
    horaCita: "10:00",
    canalOrigen: "RRHH",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Control anual.",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 4,
    idCaso: 3,
    idPaciente: 1,
    idMedico: 2,
    fechaCita: formatDate(yesterday),
    horaCita: "11:00",
    canalOrigen: "RRHH",
    estadoCita: "FINALIZADA",
    motivoResumen: "Atención por alergia.",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 5,
    idPaciente: 2,
    idMedico: 1,
    fechaCita: "2024-07-25",
    horaCita: "16:00",
    canalOrigen: "OTRO",
    estadoCita: "CANCELADA",
    motivoResumen: "Paciente canceló por imprevisto laboral.",
    nivelSemaforoPaciente: 'A',
  },
  {
    idCita: 6,
    idPaciente: 3,
    idMedico: 1,
    fechaCita: formatDate(nextWeek),
    horaCita: "09:00",
    canalOrigen: "SOLICITUD",
    estadoCita: "CONFIRMADA",
    motivoResumen: "Revisión de lunar.",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 7,
    idPaciente: 1,
    idMedico: 1,
    fechaCita: formatDate(today),
    horaCita: "08:30",
    canalOrigen: "SOLICITUD",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Dolor de espalda bajo",
    nivelSemaforoPaciente: 'A',
  },
  // Added data for calendar
  {
    idCita: 8,
    idPaciente: 2,
    idMedico: 1,
    fechaCita: d(-5),
    horaCita: "11:00",
    canalOrigen: "SOLICITUD",
    estadoCita: "FINALIZADA",
    motivoResumen: "Control post-gripal",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 9,
    idPaciente: 3,
    idMedico: 2,
    fechaCita: d(-4),
    horaCita: "14:30",
    canalOrigen: "CHEQUEO",
    estadoCita: "FINALIZADA",
    motivoResumen: "Revisión de resultados de laboratorio",
    nivelSemaforoPaciente: 'A',
  },
  {
    idCita: 10,
    idPaciente: 1,
    idMedico: 1,
    fechaCita: d(3),
    horaCita: "16:00",
    canalOrigen: "RRHH",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Certificado médico",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 11,
    idPaciente: 2,
    idMedico: 2,
    fechaCita: d(5),
    horaCita: "09:30",
    canalOrigen: "SOLICITUD",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Evaluación ergonómica",
    nivelSemaforoPaciente: 'V',
  },
  {
    idCita: 12,
    idPaciente: 3,
    idMedico: 1,
    fechaCita: d(9),
    horaCita: "11:30",
    canalOrigen: "CHEQUEO",
    estadoCita: "PROGRAMADA",
    motivoResumen: "Malestar estomacal recurrente",
    nivelSemaforoPaciente: 'A',
  }
];
