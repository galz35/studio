import type { SeguimientoPaciente } from "@/lib/types/domain";

export const seguimientos: SeguimientoPaciente[] = [
  {
    idSeguimiento: 1,
    idCaso: 1,
    idPaciente: 2,
    fechaProgramada: "2024-08-05",
    tipoSeguimiento: "LLAMADA",
    estadoSeguimiento: "PENDIENTE",
    nivelSemaforo: "R",
    usuarioResponsable: "Dr. Carlos Herrera",
    notasSeguimiento: "Verificar evolución de migrañas y efectividad del tratamiento inicial.",
  },
  {
    idSeguimiento: 2,
    idCaso: 2,
    idPaciente: 3,
    fechaProgramada: "2024-08-01",
    tipoSeguimiento: "TEAMS",
    estadoSeguimiento: "PENDIENTE",
    nivelSemaforo: "A",
    usuarioResponsable: "Dra. Isabel Castillo",
    notasSeguimiento: "Check-in sobre niveles de energía.",
  },
  {
    idSeguimiento: 3,
    idCaso: 3,
    idPaciente: 1,
    fechaProgramada: "2024-06-20",
    fechaReal: "2024-06-20",
    tipoSeguimiento: "LLAMADA",
    estadoSeguimiento: "RESUELTO",
    nivelSemaforo: "V",
    usuarioResponsable: "Dra. Isabel Castillo",
    notasSeguimiento: "Paciente reporta mejoría con el antihistamínico. Se cierra el seguimiento.",
  },
];
