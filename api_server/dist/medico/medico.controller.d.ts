import { MedicoService } from './medico.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
export declare class MedicoController {
    private readonly medicoService;
    constructor(medicoService: MedicoService);
    getDashboard(req: any): Promise<{
        citasHoy: number;
        pacientesEnRojo: number;
    }>;
    getAgendaCitas(req: any): Promise<import("../entities/caso-clinico.entity").CasoClinico[]>;
    agendarCita(agendarCitaDto: AgendarCitaDto): Promise<import("../entities/cita-medica.entity").CitaMedica>;
    crearAtencion(crearAtencionDto: CrearAtencionDto): Promise<import("../entities/atencion-medica.entity").AtencionMedica>;
}
