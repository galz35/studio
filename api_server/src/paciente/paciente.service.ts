import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { ExamenMedico } from '../entities/examen-medico.entity';
import { VacunaAplicada } from '../entities/vacuna-aplicada.entity';
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
        @InjectRepository(Seguimiento)
        private seguimientosRepository: Repository<Seguimiento>,
        @InjectRepository(AtencionMedica)
        private atencionesRepository: Repository<AtencionMedica>,
        @InjectRepository(ExamenMedico)
        private examenesRepository: Repository<ExamenMedico>,
        @InjectRepository(VacunaAplicada)
        private vacunasRepository: Repository<VacunaAplicada>,
        private dataSource: DataSource,
    ) { }

    async getMisChequeos(idPaciente: number) {
        return this.chequeosRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });
    }

    async getMisExamenes(idPaciente: number) {
        return this.examenesRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_solicitud: 'DESC' }
        });
    }

    async getMisVacunas(idPaciente: number) {
        return this.vacunasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_aplicacion: 'DESC' }
        });
    }

    async getDashboardStats(idPaciente: number) {
        const paciente = await this.pacientesRepository.findOne({ where: { id_paciente: idPaciente } });

        // 1. Próxima Cita
        const proximaCita = await this.citasRepository.findOne({
            where: {
                paciente: { id_paciente: idPaciente },
                estado_cita: 'PROGRAMADA'
            },
            order: { fecha_cita: 'ASC', hora_cita: 'ASC' },
            relations: ['medico']
        });

        // 2. Último Chequeo
        const ultimoChequeo = await this.chequeosRepository.findOne({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });

        // 3. Seguimientos Activos
        const seguimientosActivos = await this.seguimientosRepository.count({
            where: [
                { paciente: { id_paciente: idPaciente }, estado_seguimiento: 'PENDIENTE' },
                { paciente: { id_paciente: idPaciente }, estado_seguimiento: 'EN_PROCESO' }
            ]
        });

        // 4. Timeline (Chequeos + Atenciones)
        // Fetch recent checkups
        const recentChequeos = await this.chequeosRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' },
            take: 3
        });

        // Fetch recent attentions (via Cita -> Paciente)
        // This is a bit complex with TypeORM relations, let's try a query builder or simple relation load
        const recentAtenciones = await this.atencionesRepository.find({
            where: {
                cita: {
                    paciente: { id_paciente: idPaciente }
                }
            },
            relations: ['cita', 'cita.paciente'],
            order: { fecha_atencion: 'DESC' },
            take: 3
        });

        const timeline = [
            ...recentChequeos.map(c => ({
                title: 'Chequeo de Bienestar',
                date: c.fecha_registro
            })),
            ...recentAtenciones.map(a => ({
                title: `Atención: ${a.diagnostico_principal}`,
                date: a.fecha_atencion
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


        return {
            kpis: {
                estadoActual: paciente?.nivel_semaforo || 'V',
                ultimoChequeo: ultimoChequeo ? ultimoChequeo.fecha_registro : null,
                proximaCita: proximaCita ? `${proximaCita.fecha_cita} ${proximaCita.hora_cita}` : null,
                seguimientosActivos
            },
            ultimoChequeoData: ultimoChequeo,
            timeline
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
