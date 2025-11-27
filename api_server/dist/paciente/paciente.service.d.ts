import { Repository, DataSource } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteService {
    private pacientesRepository;
    private citasRepository;
    private chequeosRepository;
    private casosRepository;
    private dataSource;
    constructor(pacientesRepository: Repository<Paciente>, citasRepository: Repository<CitaMedica>, chequeosRepository: Repository<ChequeoBienestar>, casosRepository: Repository<CasoClinico>, dataSource: DataSource);
    getDashboardStats(idPaciente: number): Promise<{
        nivelSemaforo: string | undefined;
        proximaCita: CitaMedica | null;
    }>;
    solicitarCita(idPaciente: number, solicitudDto: SolicitudCitaDto): Promise<{
        message: string;
    }>;
    getMisCitas(idPaciente: number): Promise<CitaMedica[]>;
}
