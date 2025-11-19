import type { AtencionMedica } from "@/lib/types/domain";

export const atenciones: AtencionMedica[] = [
  {
    idAtencion: 1,
    idCita: 4,
    idCaso: 3,
    idMedico: 2,
    fechaAtencion: "2024-07-28T11:30:00Z",
    pesoKg: 65,
    alturaM: 1.65,
    presionArterial: "110/70",
    frecuenciaCardiaca: 70,
    temperaturaC: 36.5,
    diagnosticoPrincipal: "Rinitis alérgica estacional.",
    codDiagnostico: "J30.1",
    planTratamiento: "Loratadina 10mg una vez al día por 15 días.",
    recomendaciones: "Evitar exposición a alérgenos conocidos. Mantener ventanas cerradas.",
    estadoClinico: "BIEN",
    requiereSeguimiento: false,
  },
];
