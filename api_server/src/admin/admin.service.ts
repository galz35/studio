import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CrearUsuarioDto, Rol } from './dto/crear-usuario.dto';
import { CrearMedicoDto } from './dto/crear-medico.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
        @InjectRepository(Medico)
        private medicosRepository: Repository<Medico>,
        @InjectRepository(Paciente)
        private pacientesRepository: Repository<Paciente>,
        @InjectRepository(CitaMedica)
        private citasRepository: Repository<CitaMedica>,
        private dataSource: DataSource,
    ) { }

    async getDashboardStats(pais: string) {
        const totalUsuarios = await this.usuariosRepository.count({ where: { pais, estado: 'A' } });

        // Medicos activos (join via usuario for country check if needed, but medicos don't have country directly, only via user)
        // Assuming medicos are filtered by user country
        const medicosActivos = await this.medicosRepository.createQueryBuilder('medico')
            .innerJoin('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .andWhere('medico.estado_medico = :estado', { estado: 'A' })
            .getCount();

    }

    async crearUsuario(crearUsuarioDto: CrearUsuarioDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { password, ...userData } = crearUsuarioDto;
            const salt = await bcrypt.genSalt();
            const password_hash = await bcrypt.hash(password, salt);

            const nuevoUsuario = queryRunner.manager.create(Usuario, {
                ...userData,
                password_hash,
            });

            await queryRunner.manager.save(nuevoUsuario);

            if (crearUsuarioDto.rol === Rol.PACIENTE) {
                const nuevoPaciente = queryRunner.manager.create(Paciente, {
                    carnet: userData.carnet,
                    nombre_completo: userData.nombreCompleto,
                    correo: userData.correo,
                    estado_paciente: 'A',
                    nivel_semaforo: 'V', // Default
                    // Other fields null for now
                });
                await queryRunner.manager.save(nuevoPaciente);
                nuevoUsuario.paciente = nuevoPaciente;
                await queryRunner.manager.save(nuevoUsuario);
            } else if (crearUsuarioDto.rol === Rol.MEDICO) {
                const nuevoMedico = queryRunner.manager.create(Medico, {
                    carnet: userData.carnet,
                    nombre_completo: userData.nombreCompleto,
                    correo: userData.correo,
                    tipo_medico: 'INTERNO', // Default for user-created medicos
                    estado_medico: 'A',
                });
                await queryRunner.manager.save(nuevoMedico);
                nuevoUsuario.medico = nuevoMedico;
                await queryRunner.manager.save(nuevoUsuario);
            }

            await queryRunner.commitTransaction();
            const { password_hash: _, ...result } = nuevoUsuario;
            return result;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            if (err.code === '23505') { // Unique violation
                throw new ConflictException('El carnet o correo ya existe');
            }
            throw new InternalServerErrorException('Error al crear usuario');
        } finally {
            await queryRunner.release();
        }
    }

    async getUsuarios(pais: string) {
        return this.usuariosRepository.find({ where: { pais } });
    }

    async getMedicos(pais: string) {
        return this.medicosRepository.createQueryBuilder('medico')
            .innerJoinAndSelect('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .getMany();
    }
}
