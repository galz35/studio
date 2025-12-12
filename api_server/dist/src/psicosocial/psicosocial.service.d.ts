import { Repository, DataSource } from 'typeorm';
import { RegistroPsicosocial } from '../entities/registro-psicosocial.entity';
import { Paciente } from '../entities/paciente.entity';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
export declare class PsicosocialService {
    private repo;
    private pacienteRepo;
    private dataSource;
    private readonly logger;
    private genAI;
    constructor(repo: Repository<RegistroPsicosocial>, pacienteRepo: Repository<Paciente>, dataSource: DataSource);
    registrarEvaluacion(dto: CreateEvaluacionDto): Promise<RegistroPsicosocial>;
    private analyzeWithGemini;
    getPorPaciente(idPaciente: number): Promise<RegistroPsicosocial[]>;
}
