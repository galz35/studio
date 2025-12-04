import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    createInitialAdmin(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
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
}
