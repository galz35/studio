import type { ExamenMedico } from "@/lib/types/domain";

export const examenes: ExamenMedico[] = [
  {
    idExamen: 1,
    idCaso: 1,
    idAtencion: 1,
    idPaciente: 2,
    tipoExamen: "Hemograma completo",
    fechaSolicitud: "2024-07-30",
    laboratorio: "Laboratorio Central",
    estadoExamen: "PENDIENTE",
  },
  {
    idExamen: 2,
    idCaso: 1,
    idAtencion: 1,
    idPaciente: 2,
    tipoExamen: "Perfil lipídico",
    fechaSolicitud: "2024-07-30",
    laboratorio: "Laboratorio Central",
    estadoExamen: "PENDIENTE",
  },
  {
    idExamen: 3,
    idCaso: 3,
    idPaciente: 1,
    tipoExamen: "Prueba de alergias (panel respiratorio)",
    fechaSolicitud: "2024-06-10",
    fechaResultado: "2024-06-15",
    laboratorio: "InmunoLab",
    resultadoResumen: "Positivo a ácaros del polvo.",
    estadoExamen: "ENTREGADO",
  },
];
