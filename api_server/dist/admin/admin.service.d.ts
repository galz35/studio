import { Repository, DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
export declare class AdminService {
    private usuariosRepository;
    private medicosRepository;
    private pacientesRepository;
    private citasRepository;
    private dataSource;
    constructor(usuariosRepository: Repository<Usuario>, medicosRepository: Repository<Medico>, pacientesRepository: Repository<Paciente>, citasRepository: Repository<CitaMedica>, dataSource: DataSource);
    getDashboardStats(pais: string): Promise<void>;
    crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<{
        id_usuario: number;
        carnet: string;
        nombre_completo: string;
        correo: string;
        rol: string;
        pais: string;
        estado: string;
        ultimo_acceso: Date;
        paciente: Paciente;
        medico: Medico;
        seguimientos: import("../entities/seguimiento.entity").Seguimiento[];
    }>;
    getUsuarios(pais: string): Promise<Usuario[]>;
    getMedicos(pais: string): Promise<Medico[]>;
}
