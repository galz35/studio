import { PacienteService } from './paciente.service';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteController {
    private readonly pacienteService;
    constructor(pacienteService: PacienteService);
    getDashboard(req: any): Promise<{
        nivelSemaforo: string | undefined;
        proximaCita: import("../entities/cita-medica.entity").CitaMedica | null;
    }>;
    solicitarCita(req: any, solicitudDto: SolicitudCitaDto): Promise<{
        message: string;
    }>;
    getMisCitas(req: any): Promise<import("../entities/cita-medica.entity").CitaMedica[]>;
}
