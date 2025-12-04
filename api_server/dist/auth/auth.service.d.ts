import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usuariosRepository;
    private jwtService;
    constructor(usuariosRepository: Repository<Usuario>, jwtService: JwtService);
    validateUser(carnet: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    L: any;
    createInitialAdmin(): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<{
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
