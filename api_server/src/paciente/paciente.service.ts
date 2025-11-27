import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { SolicitudCitaDto } from './dto/solicitud-cita.dto';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(Paciente)
        private pacientesRepository: Repository<Paciente>,
        @InjectRepository(CitaMedica)
        private citasRepository: Repository<CitaMedica>,
        @InjectRepository(ChequeoBienestar)
        private chequeosRepository: Repository<ChequeoBienestar>,
        @InjectRepository(CasoClinico)
        private casosRepository: Repository<CasoClinico>,
        private dataSource: DataSource,
    ) { }

    async getDashboardStats(idPaciente: number) {
        const paciente = await this.pacientesRepository.findOne({ where: { id_paciente: idPaciente } });

        const proximaCita = await this.citasRepository.findOne({
            where: {
                paciente: { id_paciente: idPaciente },
                estado_cita: 'PROGRAMADA' // or 'CONFIRMADA'
            },
            order: { fecha_cita: 'ASC', hora_cita: 'ASC' },
            relations: ['medico']
        });

        return {
            nivelSemaforo: paciente?.nivel_semaforo,
            proximaCita,
        };
    }

    async solicitarCita(idPaciente: number, solicitudDto: SolicitudCitaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const paciente = await queryRunner.manager.findOne(Paciente, { where: { id_paciente: idPaciente } });
            if (!paciente) throw new Error('Paciente no encontrado');

            // 1. Crear Chequeo
            const nuevoChequeo = queryRunner.manager.create(ChequeoBienestar, {
                paciente: paciente,
                nivel_semaforo: paciente.nivel_semaforo || 'V', // Default or calculated
                datos_completos: solicitudDto.datosCompletos,
            });
            await queryRunner.manager.save(nuevoChequeo);

            // 2. Si es consulta, crear Caso
            if (solicitudDto.ruta === 'consulta') {
                // Generate code logic (simplified)
                const count = await queryRunner.manager.count(CasoClinico);
                const codigo = `CC-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

                const nuevoCaso = queryRunner.manager.create(CasoClinico, {
                    codigo_caso: codigo,
                    paciente: paciente,
                    estado_caso: 'Abierto',
                    nivel_semaforo: paciente.nivel_semaforo || 'V', // Should be calculated based on symptoms
                    motivo_consulta: solicitudDto.comentarioGeneral || 'Solicitud de consulta',
                });
                await queryRunner.manager.save(nuevoCaso);
            }

            await queryRunner.commitTransaction();
            return { message: 'Solicitud procesada con éxito' };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error al procesar solicitud');
        } finally {
            await queryRunner.release();
        }
    }

    async getMisCitas(idPaciente: number) {
        return this.citasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_cita: 'DESC' },
            relations: ['medico']
        });
    }
}
