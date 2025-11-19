import type { CasoClinico } from "@/lib/types/domain";

export const casosClinicos: CasoClinico[] = [
  {
    idCaso: 1,
    codigoCaso: "CC-2024-001",
    idPaciente: 2,
    idCita: 1,
    fechaCreacion: "2024-07-29",
    estadoCaso: "Abierto",
    nivelSemaforo: "R",
    motivoConsulta: "Migrañas recurrentes y problemas de sueño.",
    resumenClinicoUsuario: "El paciente reporta dolores de cabeza intensos 3-4 veces por semana, dificultad para conciliar el sueño y cansancio extremo durante el día.",
    diagnosticoUsuario: "Posible migraña crónica o cefalea tensional.",
  },
  {
    idCaso: 2,
    codigoCaso: "CC-2024-002",
    idPaciente: 3,
    idCita: 2,
    fechaCreacion: "2024-07-30",
    estadoCaso: "Abierto",
    nivelSemaforo: "A",
    motivoConsulta: "Revisión general por cansancio.",
    resumenClinicoUsuario: "Reporta sentirse más cansada de lo habitual en las últimas dos semanas.",
    diagnosticoUsuario: "Fatiga.",
  },
  {
    idCaso: 3,
    codigoCaso: "CC-2024-003",
    idPaciente: 1,
    fechaCreacion: "2024-06-10",
    estadoCaso: "Cerrado",
    nivelSemaforo: "V",
    motivoConsulta: "Alergia estacional leve.",
    resumenClinicoUsuario: "Congestión nasal y estornudos por la mañana.",
    diagnosticoUsuario: "Rinitis alérgica.",
  },
];
