import type { Medico } from "@/lib/types/domain";

export const medicos: Medico[] = [
  {
    id: "medico-001",
    idMedico: 1,
    carnet: "M001",
    nombreCompleto: "Dr. Carlos Herrera",
    especialidad: "Medicina General",
    tipoMedico: "INTERNO",
    correo: "carlos.herrera@corp.med",
    telefono: "7777-1111",
    estadoMedico: "A",
  },
  {
    id: "medico-002",
    idMedico: 2,
    carnet: "M002",
    nombreCompleto: "Dra. Isabel Castillo",
    especialidad: "Salud Ocupacional",
    tipoMedico: "INTERNO",
    correo: "isabel.castillo@corp.med",
    telefono: "7777-2222",
    estadoMedico: "A",
  },
  {
    id: "medico-003",
    idMedico: 3,
    nombreCompleto: "Dr. Fernando Morales",
    especialidad: "Cardiología",
    tipoMedico: "EXTERNO",
    correo: "fernando.morales@clinica.com",
    telefono: "5555-4444",
    estadoMedico: "A",
  },
];
