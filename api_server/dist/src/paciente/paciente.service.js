"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paciente_entity_1 = require("../entities/paciente.entity");
const cita_medica_entity_1 = require("../entities/cita-medica.entity");
const chequeo_bienestar_entity_1 = require("../entities/chequeo-bienestar.entity");
const caso_clinico_entity_1 = require("../entities/caso-clinico.entity");
const seguimiento_entity_1 = require("../entities/seguimiento.entity");
const atencion_medica_entity_1 = require("../entities/atencion-medica.entity");
const examen_medico_entity_1 = require("../entities/examen-medico.entity");
const vacuna_aplicada_entity_1 = require("../entities/vacuna-aplicada.entity");
let PacienteService = class PacienteService {
    constructor(pacientesRepository, citasRepository, chequeosRepository, casosRepository, seguimientosRepository, atencionesRepository, examenesRepository, vacunasRepository, dataSource) {
        this.pacientesRepository = pacientesRepository;
        this.citasRepository = citasRepository;
        this.chequeosRepository = chequeosRepository;
        this.casosRepository = casosRepository;
        this.seguimientosRepository = seguimientosRepository;
        this.atencionesRepository = atencionesRepository;
        this.examenesRepository = examenesRepository;
        this.vacunasRepository = vacunasRepository;
        this.dataSource = dataSource;
    }
    async getMisChequeos(idPaciente) {
        return this.chequeosRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });
    }
    async getMisExamenes(idPaciente) {
        return this.examenesRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_solicitud: 'DESC' }
        });
    }
    async getMisVacunas(idPaciente) {
        return this.vacunasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_aplicacion: 'DESC' }
        });
    }
    async getDashboardStats(idPaciente) {
        const paciente = await this.pacientesRepository.findOne({ where: { id_paciente: idPaciente } });
        const proximaCita = await this.citasRepository.findOne({
            where: {
                paciente: { id_paciente: idPaciente },
                estado_cita: 'PROGRAMADA'
            },
            order: { fecha_cita: 'ASC', hora_cita: 'ASC' },
            relations: ['medico']
        });
        const ultimoChequeo = await this.chequeosRepository.findOne({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' }
        });
        const seguimientosActivos = await this.seguimientosRepository.count({
            where: [
                { paciente: { id_paciente: idPaciente }, estado_seguimiento: 'PENDIENTE' },
                { paciente: { id_paciente: idPaciente }, estado_seguimiento: 'EN_PROCESO' }
            ]
        });
        const recentChequeos = await this.chequeosRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_registro: 'DESC' },
            take: 3
        });
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
    async solicitarCita(idPaciente, solicitudDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const paciente = await queryRunner.manager.findOne(paciente_entity_1.Paciente, { where: { id_paciente: idPaciente } });
            if (!paciente)
                throw new Error('Paciente no encontrado');
            const nuevoChequeo = queryRunner.manager.create(chequeo_bienestar_entity_1.ChequeoBienestar, {
                paciente: paciente,
                nivel_semaforo: paciente.nivel_semaforo || 'V',
                datos_completos: solicitudDto.datosCompletos,
            });
            await queryRunner.manager.save(nuevoChequeo);
            if (solicitudDto.ruta === 'consulta') {
                const count = await queryRunner.manager.count(caso_clinico_entity_1.CasoClinico);
                const codigo = `CC-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
                const nuevoCaso = queryRunner.manager.create(caso_clinico_entity_1.CasoClinico, {
                    codigo_caso: codigo,
                    paciente: paciente,
                    estado_caso: 'Abierto',
                    nivel_semaforo: paciente.nivel_semaforo || 'V',
                    motivo_consulta: solicitudDto.comentarioGeneral || 'Solicitud de consulta',
                });
                await queryRunner.manager.save(nuevoCaso);
            }
            await queryRunner.commitTransaction();
            return { message: 'Solicitud procesada con éxito' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error al procesar solicitud');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getMisCitas(idPaciente) {
        return this.citasRepository.find({
            where: { paciente: { id_paciente: idPaciente } },
            order: { fecha_cita: 'DESC' },
            relations: ['medico']
        });
    }
    async crearChequeo(idPaciente, data) {
        const paciente = await this.pacientesRepository.findOne({ where: { id_paciente: idPaciente } });
        if (!paciente)
            throw new Error('Paciente no encontrado');
        const nuevoChequeo = this.chequeosRepository.create({
            paciente: paciente,
            nivel_semaforo: data.nivelRiesgo === 'Alto' ? 'R' : data.nivelRiesgo === 'Medio' ? 'A' : 'V',
            datos_completos: data,
        });
        return this.chequeosRepository.save(nuevoChequeo);
    }
};
exports.PacienteService = PacienteService;
exports.PacienteService = PacienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __param(1, (0, typeorm_1.InjectRepository)(cita_medica_entity_1.CitaMedica)),
    __param(2, (0, typeorm_1.InjectRepository)(chequeo_bienestar_entity_1.ChequeoBienestar)),
    __param(3, (0, typeorm_1.InjectRepository)(caso_clinico_entity_1.CasoClinico)),
    __param(4, (0, typeorm_1.InjectRepository)(seguimiento_entity_1.Seguimiento)),
    __param(5, (0, typeorm_1.InjectRepository)(atencion_medica_entity_1.AtencionMedica)),
    __param(6, (0, typeorm_1.InjectRepository)(examen_medico_entity_1.ExamenMedico)),
    __param(7, (0, typeorm_1.InjectRepository)(vacuna_aplicada_entity_1.VacunaAplicada)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PacienteService);
//# sourceMappingURL=paciente.service.js.map