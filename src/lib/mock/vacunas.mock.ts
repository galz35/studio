import type { VacunaAplicada } from "@/lib/types/domain";

export const vacunasAplicadas: VacunaAplicada[] = [
    {
        id: "vac-001",
        idVacunaRegistro: 1,
        idPaciente: "paciente-001",
        idMedico: "medico-002",
        tipoVacuna: "Influenza",
        dosis: "Anual 2023",
        fechaAplicacion: "2023-10-15",
        observaciones: "Campaña de vacunación empresarial 2023."
    },
    {
        id: "vac-002",
        idVacunaRegistro: 2,
        idPaciente: "paciente-001",
        idMedico: "medico-001",
        tipoVacuna: "COVID-19",
        dosis: "Refuerzo 2",
        fechaAplicacion: "2023-12-01",
        observaciones: "Pfizer - Lote A123"
    },
    {
        id: "vac-003",
        idVacunaRegistro: 3,
        idPaciente: "paciente-002",
        idMedico: "medico-002",
        tipoVacuna: "Tétanos",
        dosis: "Refuerzo 10 años",
        fechaAplicacion: "2024-03-20",
        observaciones: ""
    },
    {
        id: "vac-004",
        idVacunaRegistro: 4,
        idPaciente: "paciente-001",
        idMedico: "medico-002",
        tipoVacuna: "Influenza",
        dosis: "Anual 2024",
        fechaAplicacion: "2024-06-10",
        idAtencion: "1",
        observaciones: "Aplicada durante consulta por alergia."
    }
];
