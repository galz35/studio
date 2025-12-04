import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { ExamenMedico } from '../entities/examen-medico.entity';
import { VacunaAplicada } from '../entities/vacuna-aplicada.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
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
        @InjectRepository(ExamenMedico)
        private examenesRepository: Repository<ExamenMedico>,
        @InjectRepository(VacunaAplicada)
        private vacunasRepository: Repository<VacunaAplicada>,
        @InjectRepository(ChequeoBienestar)
        private chequeosRepository: Repository<ChequeoBienestar>,
        @InjectRepository(Seguimiento)
        private seguimientosRepository: Repository<Seguimiento>,
        private dataSource: DataSource,
    ) { }

    async getPacientes(pais: string) {
        return this.pacientesRepository.find({
            where: { usuario: { pais } },
            relations: ['usuario']
        });
    }

    async getChequeosPorPaciente(idPaciente: number) {
        return this.chequeosRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_chequeo: 'DESC' }
        });
    }

    async getCitasPorPaciente(idPaciente: number) {
        return this.citasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            relations: ['medico', 'caso_clinico'],
            order: { fecha_cita: 'DESC' }
        });
    }

    async getExamenesPorPaciente(idPaciente: number) {
        return this.examenesRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_solicitud: 'DESC' }
        });
    }

    async getVacunasPorPaciente(idPaciente: number) {
        return this.vacunasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            relations: ['medico'],
            order: { fecha_aplicacion: 'DESC' }
        });
    }

    async getDashboardStats(idMedico: number, pais: string) {
        // 1. Citas de Hoy
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const citasHoy = await this.citasRepository.find({
            where: {
                medico: { id_medico: idMedico },
                fecha_cita: Between(startOfDay, endOfDay),
                estado_cita: 'PROGRAMADA'
            },
            relations: ['paciente', 'caso_clinico'],
            order: { hora_cita: 'ASC' }
        });

        // 2. Pacientes en Rojo (Alertas)
        const pacientesEnRojo = await this.pacientesRepository.find({
            where: {
                nivel_semaforo: 'R',
                usuario: { pais }
            },
            relations: ['usuario'],
            take: 5 // Limit to 5 for dashboard
        });

        // 3. Casos Abiertos (Agenda pendiente)
        const casosAbiertos = await this.casosRepository.count({
            where: {
                estado_caso: 'Abierto',
                paciente: { usuario: { pais } }
            }
        });

        return {
            citasHoyCount: citasHoy.length,
            citasHoy,
            pacientesEnRojoCount: pacientesEnRojo.length,
            pacientesEnRojo,
            casosAbiertos
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

    async getCasosClinicos(pais: string, estado?: string) {
        const where: any = { paciente: { usuario: { pais } } };
        if (estado) {
            where.estado_caso = estado;
        }
        return this.casosRepository.find({
            where,
            relations: ['paciente', 'paciente.usuario'],
            order: { fecha_creacion: 'DESC' }
        });
    }

    async getCasoById(id: number) {
        return this.casosRepository.findOne({
            where: { id_caso: id },
            relations: ['paciente', 'paciente.usuario', 'cita_principal', 'examenes', 'seguimientos']
        });
    }

    async updateCaso(id: number, data: Partial<CasoClinico>) {
        await this.casosRepository.update(id, data);
        return this.getCasoById(id);
    }

    async getCitaById(id: number) {
        return this.citasRepository.findOne({
            where: { id_cita: id },
            relations: ['paciente', 'paciente.usuario', 'medico', 'caso_clinico', 'atencion_medica']
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

    async getExamenes(pais: string) {
        return this.examenesRepository.find({
            where: { paciente: { usuario: { pais } } },
            relations: ['paciente', 'paciente.usuario'],
            order: { fecha_solicitud: 'DESC' }
        });
    }

    async getSeguimientos(pais: string) {
        return this.seguimientosRepository.find({
            where: { paciente: { usuario: { pais } } },
            relations: ['paciente', 'paciente.usuario'],
            order: { fecha_programada: 'ASC' }
        });
    }

    async updateSeguimiento(id: number, data: any) {
        await this.seguimientosRepository.update(id, data);
        return this.seguimientosRepository.findOne({ where: { id_seguimiento: id } });
    }

    async getCitasPorMedico(idMedico: number, pais: string) {
        return this.citasRepository.find({
            where: {
                medico: { id_medico: idMedico },
                paciente: { usuario: { pais } }
            },
            relations: ['paciente', 'paciente.usuario'],
            order: { fecha_cita: 'ASC', hora_cita: 'ASC' }
        });
    }

    async registrarVacuna(data: any) {
        const vacuna = this.vacunasRepository.create({
            paciente: { id_paciente: +data.idPaciente },
            medico: { id_medico: +data.idMedico },
            tipo_vacuna: data.tipoVacuna,
            dosis: data.dosis,
            fecha_aplicacion: new Date(data.fechaAplicacion),
            observaciones: data.observaciones
        });
        return this.vacunasRepository.save(vacuna);
    }
}
