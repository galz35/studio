import type { ExamenMedico } from "@/lib/types/domain";

export const examenes: ExamenMedico[] = [
  {
    idExamen: 1,
    idCaso: 1,
    idAtencion: 2,
    idPaciente: 2,
    tipoExamen: "Hemograma completo",
    fechaSolicitud: "2024-07-29",
    laboratorio: "Laboratorio Central",
    estadoExamen: "PENDIENTE",
  },
  {
    idExamen: 2,
    idCaso: 1,
    idAtencion: 2,
    idPaciente: 2,
    tipoExamen: "Perfil lipídico",
    fechaSolicitud: "2024-07-29",
    laboratorio: "Laboratorio Central",
    estadoExamen: "PENDIENTE",
  },
  {
    idExamen: 3,
    idCaso: 3,
    idAtencion: 1,
    idPaciente: 1,
    tipoExamen: "Prueba de alergias (panel respiratorio)",
    fechaSolicitud: "2024-06-10",
    fechaResultado: "2024-06-15",
    laboratorio: "InmunoLab",
    resultadoResumen: "Positivo a ácaros del polvo.",
    estadoExamen: "ENTREGADO",
  },
  {
    idExamen: 4,
    idCaso: 2,
    idAtencion: undefined,
    idPaciente: 3,
    tipoExamen: "Perfil tiroideo (TSH, T4 libre)",
    fechaSolicitud: "2024-08-01",
    laboratorio: "Laboratorio Su Salud",
    estadoExamen: "PENDIENTE",
  },
  {
    idExamen: 5,
    idAtencion: undefined,
    idPaciente: 1,
    tipoExamen: "Papanicolau",
    fechaSolicitud: "2024-07-15",
    fechaResultado: "2024-07-22",
    laboratorio: "Laboratorio Central",
    estadoExamen: "ENTREGADO",
    resultadoResumen: "Resultados dentro de los límites normales."
  }
];
