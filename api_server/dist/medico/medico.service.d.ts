import { Repository, DataSource } from 'typeorm';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';
export declare class MedicoService {
    private citasRepository;
    private casosRepository;
    private atencionesRepository;
    private pacientesRepository;
    private medicosRepository;
    private dataSource;
    constructor(citasRepository: Repository<CitaMedica>, casosRepository: Repository<CasoClinico>, atencionesRepository: Repository<AtencionMedica>, pacientesRepository: Repository<Paciente>, medicosRepository: Repository<Medico>, dataSource: DataSource);
    getDashboardStats(idMedico: number, pais: string): Promise<{
        citasHoy: number;
        pacientesEnRojo: number;
    }>;
    getAgendaCitas(pais: string): Promise<CasoClinico[]>;
    agendarCita(agendarCitaDto: AgendarCitaDto): Promise<CitaMedica>;
    crearAtencion(crearAtencionDto: CrearAtencionDto): Promise<AtencionMedica>;
}
