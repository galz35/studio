import type { VacunaAplicada } from "@/lib/types/domain";

export const vacunasAplicadas: VacunaAplicada[] = [
    {
        idVacunaRegistro: 1,
        idPaciente: 1,
        idMedico: 2,
        tipoVacuna: "Influenza",
        dosis: "Anual 2023",
        fechaAplicacion: "2023-10-15",
        observaciones: "Campaña de vacunación empresarial 2023."
    },
    {
        idVacunaRegistro: 2,
        idPaciente: 1,
        idMedico: 1,
        tipoVacuna: "COVID-19",
        dosis: "Refuerzo 2",
        fechaAplicacion: "2023-12-01",
        observaciones: "Pfizer - Lote A123"
    },
    {
        idVacunaRegistro: 3,
        idPaciente: 2,
        idMedico: 2,
        tipoVacuna: "Tétanos",
        dosis: "Refuerzo 10 años",
        fechaAplicacion: "2024-03-20",
        observaciones: ""
    },
    {
        idVacunaRegistro: 4,
        idPaciente: 1,
        idMedico: 2,
        tipoVacuna: "Influenza",
        dosis: "Anual 2024",
        fechaAplicacion: "2024-06-10",
        idAtencion: 1,
        observaciones: "Aplicada durante consulta por alergia."
    }
];
