import { PacienteService } from './paciente.service';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteController {
    private readonly pacienteService;
    constructor(pacienteService: PacienteService);
    getDashboard(req: any): Promise<{
        kpis: {
            estadoActual: string;
            ultimoChequeo: Date | null;
            proximaCita: string | null;
            seguimientosActivos: number;
        };
        ultimoChequeoData: import("../entities/chequeo-bienestar.entity").ChequeoBienestar | null;
        timeline: {
            title: string;
            date: Date;
        }[];
    }>;
    solicitarCita(req: any, solicitudDto: SolicitudCitaDto): Promise<{
        message: string;
    }>;
    getMisCitas(req: any): Promise<import("../entities/cita-medica.entity").CitaMedica[]>;
    getMisChequeos(req: any): Promise<import("../entities/chequeo-bienestar.entity").ChequeoBienestar[]>;
    getMisExamenes(req: any): Promise<import("../entities/examen-medico.entity").ExamenMedico[]>;
    getMisVacunas(req: any): Promise<import("../entities/vacuna-aplicada.entity").VacunaAplicada[]>;
    crearChequeo(req: any, data: any): Promise<import("../entities/chequeo-bienestar.entity").ChequeoBienestar>;
}
