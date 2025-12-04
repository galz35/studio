import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
        private jwtService: JwtService,
    ) { }

    async validateUser(carnet: string, pass: string): Promise<any> {
        const user = await this.usuariosRepository.findOne({
            where: { carnet },
            relations: ['paciente', 'medico']
        });

        if (user && user.estado === 'A' && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.carnet, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Update last access
        await this.usuariosRepository.update(user.id_usuario, { ultimo_acceso: new Date() });

        const payload = {
            sub: user.id_usuario,
            carnet: user.carnet,
            rol: user.rol,
            pais: user.pais,
            idPaciente: user.paciente?.id_paciente,
            idMedico: user.medico?.id_medico
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: user, // Optional: return user info alongside token
        };
    } L
    async createInitialAdmin() {
        const count = await this.usuariosRepository.count();
        if (count > 0) {
            return { message: 'Ya existen usuarios en la base de datos.' };
        }

        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash('admin123', salt);

        const admin = this.usuariosRepository.create({
            carnet: 'ADMIN001',
            password_hash: password_hash,
            nombre_completo: 'Administrador del Sistema',
            correo: 'gustavoadolfolira@gmail.com',
            rol: 'ADMIN',
            pais: 'NI',
            estado: 'A',
            ultimo_acceso: new Date(),
        });

        await this.usuariosRepository.save(admin);
        return { message: 'Usuario ADMIN001 creado exitosamente. Contraseña: admin123' };
    }
    async getProfile(userId: number) {
        const user = await this.usuariosRepository.findOne({
            where: { id_usuario: userId },
            relations: ['paciente', 'medico']
        });
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado o inactivo');
        }
        const { password_hash, ...result } = user;
        return result;
    }
}
