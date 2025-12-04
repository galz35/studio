import { MedicoService } from './medico.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
export declare class MedicoController {
    private readonly medicoService;
    constructor(medicoService: MedicoService);
    getDashboard(req: any): Promise<{
        citasHoyCount: number;
        citasHoy: import("../entities/cita-medica.entity").CitaMedica[];
        pacientesEnRojoCount: number;
        pacientesEnRojo: import("../entities/paciente.entity").Paciente[];
        casosAbiertos: number;
    }>;
    getAgendaCitas(req: any): Promise<import("../entities/caso-clinico.entity").CasoClinico[]>;
    agendarCita(agendarCitaDto: AgendarCitaDto): Promise<import("../entities/cita-medica.entity").CitaMedica>;
    crearAtencion(crearAtencionDto: CrearAtencionDto): Promise<import("../entities/atencion-medica.entity").AtencionMedica>;
    getPacientes(req: any): Promise<import("../entities/paciente.entity").Paciente[]>;
    getChequeosPorPaciente(id: string): Promise<import("../entities/chequeo-bienestar.entity").ChequeoBienestar[]>;
    getCitasPorPaciente(id: string): Promise<import("../entities/cita-medica.entity").CitaMedica[]>;
    getExamenesPorPaciente(id: string): Promise<import("../entities/examen-medico.entity").ExamenMedico[]>;
    getVacunasPorPaciente(id: string): Promise<import("../entities/vacuna-aplicada.entity").VacunaAplicada[]>;
    getCasosClinicos(req: any, estado?: string): Promise<import("../entities/caso-clinico.entity").CasoClinico[]>;
    getCasoById(id: string): Promise<import("../entities/caso-clinico.entity").CasoClinico | null>;
    updateCaso(id: string, data: any): Promise<import("../entities/caso-clinico.entity").CasoClinico | null>;
    getCitaById(id: string): Promise<import("../entities/cita-medica.entity").CitaMedica | null>;
    getExamenes(req: any): Promise<import("../entities/examen-medico.entity").ExamenMedico[]>;
    getSeguimientos(req: any): Promise<import("../entities/seguimiento.entity").Seguimiento[]>;
    updateSeguimiento(id: string, data: any): Promise<import("../entities/seguimiento.entity").Seguimiento | null>;
    getCitasPorMedico(req: any): Promise<import("../entities/cita-medica.entity").CitaMedica[]>;
    registrarVacuna(data: any): Promise<import("../entities/vacuna-aplicada.entity").VacunaAplicada>;
}
