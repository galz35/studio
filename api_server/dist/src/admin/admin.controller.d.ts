import { AdminService } from './admin.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { DebugSetPasswordDto } from './dto/debug-set-password.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(req: any): Promise<{
        totalUsuarios: number;
        medicosActivos: number;
        pacientesActivos: number;
        ultimosUsuarios: import("../entities/usuario.entity").Usuario[];
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
        paciente: import("../entities/paciente.entity").Paciente;
        medico: import("../entities/medico.entity").Medico;
        seguimientos: import("../entities/seguimiento.entity").Seguimiento[];
        fecha_creacion: Date;
    }>;
    getUsuarios(req: any): Promise<import("../entities/usuario.entity").Usuario[]>;
    updateUsuario(id: string, data: any): Promise<import("../entities/usuario.entity").Usuario>;
    getMedicos(req: any): Promise<import("../entities/medico.entity").Medico[]>;
    crearMedico(data: any): Promise<import("../entities/medico.entity").Medico>;
    getEmpleados(req: any, carnet?: string): Promise<import("../entities/empleado.entity").Empleado[]>;
    getReportesAtenciones(req: any, filters: any): Promise<import("../entities/atencion-medica.entity").AtencionMedica[]>;
    debugSetPassword(body: DebugSetPasswordDto): Promise<{
        message: string;
    }>;
}
