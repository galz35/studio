import type { CitaMedica } from "@/lib/types/domain";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const citas: CitaMedica[] = [
  {
    idCita: 1,
    idCaso: 1,
    idPaciente: 2,
    idMedico: 1,
    idChequeo: 2,
    fechaCita: formatDate(today),
    horaCita: "14:00",
    canalOrigen: "CHEQUEO",
    estadoCita: "CONFIRMADA",
    notasCita: "Paciente reporta migraña severa. Prioridad alta.",
  },
  {
    idCita: 2,
    idCaso: 2,
    idPaciente: 3,
    idMedico: 2,
    idChequeo: 3,
    fechaCita: formatDate(today),
    horaCita: "15:30",
    canalOrigen: "CHEQUEO",
    estadoCita: "PROGRAMADA",
    notasCita: "Seguimiento por fatiga.",
  },
  {
    idCita: 3,
    idPaciente: 1,
    idMedico: 1,
    fechaCita: formatDate(tomorrow),
    horaCita: "10:00",
    canalOrigen: "DIRECTO",
    estadoCita: "PROGRAMADA",
    notasCita: "Control anual.",
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
    notasCita: "Atención por alergia.",
  },
  {
    idCita: 5,
    idPaciente: 2,
    idMedico: 1,
    fechaCita: "2024-07-25",
    horaCita: "16:00",
    canalOrigen: "DIRECTO",
    estadoCita: "CANCELADA",
    notasCita: "Paciente canceló por imprevisto laboral.",
  },
];
