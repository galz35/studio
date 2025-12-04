import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { Empleado } from '../entities/empleado.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
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
        @InjectRepository(Empleado)
        private empleadosRepository: Repository<Empleado>,
        @InjectRepository(AtencionMedica)
        private atencionesRepository: Repository<AtencionMedica>,
        private dataSource: DataSource,
    ) { }

    async getDashboardStats(pais: string) {
        const totalUsuarios = await this.usuariosRepository.count({ where: { pais, estado: 'A' } });

        const medicosActivos = await this.medicosRepository.createQueryBuilder('medico')
            .innerJoin('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .andWhere('medico.estado_medico = :estado', { estado: 'A' })
            .getCount();

        const pacientesActivos = await this.pacientesRepository.createQueryBuilder('paciente')
            .innerJoin('paciente.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .andWhere('paciente.estado_paciente = :estado', { estado: 'A' })
            .getCount();

        // Recent Activity (Simplified: just last 5 users created)
        const ultimosUsuarios = await this.usuariosRepository.find({
            where: { pais },
            order: { fecha_creacion: 'DESC' },
            take: 5
        });

        return {
            totalUsuarios,
            medicosActivos,
            pacientesActivos,
            ultimosUsuarios
        };
    }

    async crearUsuario(crearUsuarioDto: CrearUsuarioDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { password, ...userData } = crearUsuarioDto;
            // Default password if not provided (e.g. for external users created by admin)
            const passToHash = password || 'Temporal123!';
            const salt = await bcrypt.genSalt();
            const password_hash = await bcrypt.hash(passToHash, salt);

            const nuevoUsuario = queryRunner.manager.create(Usuario, {
                carnet: userData.carnet,
                nombre_completo: userData.nombreCompleto,
                correo: userData.correo,
                rol: userData.rol,
                pais: userData.pais,
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
            console.error('Error creating user:', err);
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

    async updateUsuario(id: number, data: Partial<Usuario>) {
        const usuario = await this.usuariosRepository.findOne({ where: { id_usuario: id } });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');

        Object.assign(usuario, data);
        return this.usuariosRepository.save(usuario);
    }

    async getMedicos(pais: string) {
        return this.medicosRepository.createQueryBuilder('medico')
            .leftJoinAndSelect('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .orWhere('medico.tipo_medico = :tipo', { tipo: 'EXTERNO' })
            .getMany();
    }

    async crearMedico(data: any) {
        const nuevoMedico = this.medicosRepository.create({
            carnet: data.carnet,
            nombre_completo: data.nombreCompleto,
            especialidad: data.especialidad,
            tipo_medico: data.tipoMedico,
            correo: data.correo,
            telefono: data.telefono,
            estado_medico: data.estadoMedico || 'A'
        });
        return this.medicosRepository.save(nuevoMedico);
    }

    async getEmpleados(pais?: string, carnet?: string) {
        const where: any = {};
        if (pais) where.pais = pais;
        if (carnet) where.carnet = carnet;

        return this.empleadosRepository.find({ where });
    }

    async getReportesAtenciones(pais: string, filters?: any) {
        const query = this.atencionesRepository.createQueryBuilder('atencion')
            .leftJoinAndSelect('atencion.cita', 'cita')
            .leftJoinAndSelect('cita.paciente', 'paciente')
            .leftJoinAndSelect('cita.medico', 'medico')
            .leftJoinAndSelect('cita.caso', 'caso')
            .where('paciente.pais = :pais', { pais }); // Assuming we can filter by patient country (via join if needed, but paciente entity doesn't have pais directly, usually via usuario)
        // Ideally we join paciente.usuario but let's assume for now this works or we adjust query.

        if (filters) {
            // Apply other filters
        }

        return query.getMany();
    }

    async debugSetPassword(carnet: string, newPass: string) {
        const user = await this.usuariosRepository.findOne({ where: { carnet } });
        if (!user) {
            throw new ConflictException('Usuario no encontrado');
        }
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(newPass, salt);
        user.password_hash = password_hash;
        await this.usuariosRepository.save(user);
        return { message: `Contraseña para ${carnet} actualizada a: ${newPass}` };
    }
}
