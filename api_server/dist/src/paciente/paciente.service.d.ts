import { Repository, DataSource } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { ExamenMedico } from '../entities/examen-medico.entity';
import { VacunaAplicada } from '../entities/vacuna-aplicada.entity';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';
export declare class PacienteService {
    private pacientesRepository;
    private citasRepository;
    private chequeosRepository;
    private casosRepository;
    private seguimientosRepository;
    private atencionesRepository;
    private examenesRepository;
    private vacunasRepository;
    private dataSource;
    constructor(pacientesRepository: Repository<Paciente>, citasRepository: Repository<CitaMedica>, chequeosRepository: Repository<ChequeoBienestar>, casosRepository: Repository<CasoClinico>, seguimientosRepository: Repository<Seguimiento>, atencionesRepository: Repository<AtencionMedica>, examenesRepository: Repository<ExamenMedico>, vacunasRepository: Repository<VacunaAplicada>, dataSource: DataSource);
    getMisChequeos(idPaciente: number): Promise<ChequeoBienestar[]>;
    getMisExamenes(idPaciente: number): Promise<ExamenMedico[]>;
    getMisVacunas(idPaciente: number): Promise<VacunaAplicada[]>;
    getDashboardStats(idPaciente: number): Promise<{
        kpis: {
            estadoActual: string;
            ultimoChequeo: Date | null;
            proximaCita: string | null;
            seguimientosActivos: number;
        };
        ultimoChequeoData: ChequeoBienestar | null;
        timeline: {
            title: string;
            date: Date;
        }[];
    }>;
    solicitarCita(idPaciente: number, solicitudDto: SolicitudCitaDto): Promise<{
        message: string;
    }>;
    getMisCitas(idPaciente: number): Promise<CitaMedica[]>;
    crearChequeo(idPaciente: number, data: any): Promise<ChequeoBienestar>;
}
