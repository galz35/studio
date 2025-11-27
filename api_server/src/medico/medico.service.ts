import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { CrearAtencionDto } from './dto/crear-atencion.dto';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(CitaMedica)
        private citasRepository: Repository<CitaMedica>,
        @InjectRepository(CasoClinico)
        private casosRepository: Repository<CasoClinico>,
        @InjectRepository(AtencionMedica)
        private atencionesRepository: Repository<AtencionMedica>,
        @InjectRepository(Paciente)
        private pacientesRepository: Repository<Paciente>,
        @InjectRepository(Medico)
        private medicosRepository: Repository<Medico>,
        private dataSource: DataSource,
    ) { }

    async getDashboardStats(idMedico: number, pais: string) {
        const citasHoy = await this.citasRepository.count({
            where: {
                medico: { id_medico: idMedico },
                fecha_cita: new Date(), // This might need date formatting depending on DB timezone
                estado_cita: 'PROGRAMADA'
            }
        });

        const pacientesEnRojo = await this.pacientesRepository.count({
            where: {
                nivel_semaforo: 'R',
                usuario: { pais }
            },
            relations: ['usuario']
        });

        return {
            citasHoy,
            pacientesEnRojo,
        };
    }

    async getAgendaCitas(pais: string) {
        return this.casosRepository.find({
            where: {
                estado_caso: 'Abierto',
                paciente: { usuario: { pais } }
            },
            relations: ['paciente', 'paciente.usuario']
        });
    }

    async agendarCita(agendarCitaDto: AgendarCitaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const caso = await queryRunner.manager.findOne(CasoClinico, {
                where: { id_caso: agendarCitaDto.idCaso },
                relations: ['paciente']
            });

            if (!caso) throw new NotFoundException('Caso clínico no encontrado');

            const medico = await queryRunner.manager.findOne(Medico, { where: { id_medico: agendarCitaDto.idMedico } });
            if (!medico) throw new NotFoundException('Médico no encontrado');

            const nuevaCita = this.citasRepository.create({
                paciente: caso.paciente,
                medico: medico,
                caso_clinico: caso,
                fecha_cita: new Date(agendarCitaDto.fechaCita),
                hora_cita: agendarCitaDto.horaCita,
                canal_origen: 'AGENDADA_POR_MEDICO',
                estado_cita: 'PROGRAMADA',
                motivo_resumen: caso.motivo_consulta,
                nivel_semaforo_paciente: caso.nivel_semaforo,
            });

            await queryRunner.manager.save(nuevaCita);

            caso.estado_caso = 'Agendado';
            caso.cita_principal = nuevaCita;
            await queryRunner.manager.save(caso);

            await queryRunner.commitTransaction();
            return nuevaCita;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async crearAtencion(crearAtencionDto: CrearAtencionDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cita = await queryRunner.manager.findOne(CitaMedica, {
                where: { id_cita: crearAtencionDto.idCita },
                relations: ['caso_clinico']
            });

            if (!cita) throw new NotFoundException('Cita no encontrada');

            const medico = await queryRunner.manager.findOne(Medico, { where: { id_medico: crearAtencionDto.idMedico } });
            if (!medico) throw new NotFoundException('Médico no encontrado');

            // Create instance directly to avoid DeepPartial issues with relations
            const nuevaAtencion = new AtencionMedica();
            nuevaAtencion.cita = cita;
            nuevaAtencion.medico = medico;
            nuevaAtencion.diagnostico_principal = crearAtencionDto.diagnosticoPrincipal;
            nuevaAtencion.plan_tratamiento = crearAtencionDto.planTratamiento || null;
            nuevaAtencion.recomendaciones = crearAtencionDto.recomendaciones || null;
            nuevaAtencion.requiere_seguimiento = crearAtencionDto.requiereSeguimiento ?? false;
            nuevaAtencion.fecha_siguiente_cita = crearAtencionDto.fechaSiguienteCita ? new Date(crearAtencionDto.fechaSiguienteCita) : null;

            await queryRunner.manager.save(nuevaAtencion);

            cita.estado_cita = 'FINALIZADA';
            await queryRunner.manager.save(cita);

            if (cita.caso_clinico) {
                cita.caso_clinico.estado_caso = 'Cerrado';
                await queryRunner.manager.save(cita.caso_clinico);
            }

            await queryRunner.commitTransaction();
            return nuevaAtencion;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
