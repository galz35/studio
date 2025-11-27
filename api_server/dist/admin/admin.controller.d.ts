import { AdminService } from './admin.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(req: any): Promise<void>;
    crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<{
        id_usuario: number;
        carnet: string;
        nombre_completo: string;
        correo: string;
        rol: string;
        pais: string;
        estado: string;
        ultimo_acceso: Date;
        paciente: import("../entities/paciente.entity").Paciente;
        medico: import("../entities/medico.entity").Medico;
        seguimientos: import("../entities/seguimiento.entity").Seguimiento[];
    }>;
    getUsuarios(req: any): Promise<import("../entities/usuario.entity").Usuario[]>;
    getMedicos(req: any): Promise<import("../entities/medico.entity").Medico[]>;
}
