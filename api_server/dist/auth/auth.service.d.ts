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
    createInitialAdmin(): Promise<{
        message: string;
    }>;
}
