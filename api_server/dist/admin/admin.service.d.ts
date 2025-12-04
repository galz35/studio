import { Repository, DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { Empleado } from '../entities/empleado.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
export declare class AdminService {
    private usuariosRepository;
    private medicosRepository;
    private pacientesRepository;
    private citasRepository;
    private empleadosRepository;
    private atencionesRepository;
    private dataSource;
    constructor(usuariosRepository: Repository<Usuario>, medicosRepository: Repository<Medico>, pacientesRepository: Repository<Paciente>, citasRepository: Repository<CitaMedica>, empleadosRepository: Repository<Empleado>, atencionesRepository: Repository<AtencionMedica>, dataSource: DataSource);
    getDashboardStats(pais: string): Promise<{
        totalUsuarios: number;
        medicosActivos: number;
        pacientesActivos: number;
        ultimosUsuarios: Usuario[];
    }>;
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
        fecha_creacion: Date;
    }>;
    getUsuarios(pais: string): Promise<Usuario[]>;
    updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario>;
    getMedicos(pais: string): Promise<Medico[]>;
    crearMedico(data: any): Promise<Medico>;
    getEmpleados(pais?: string, carnet?: string): Promise<Empleado[]>;
    getReportesAtenciones(pais: string, filters?: any): Promise<AtencionMedica[]>;
    debugSetPassword(carnet: string, newPass: string): Promise<{
        message: string;
    }>;
}
