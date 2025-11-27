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
exports.MedicoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cita_medica_entity_1 = require("../entities/cita-medica.entity");
const caso_clinico_entity_1 = require("../entities/caso-clinico.entity");
const atencion_medica_entity_1 = require("../entities/atencion-medica.entity");
const paciente_entity_1 = require("../entities/paciente.entity");
const medico_entity_1 = require("../entities/medico.entity");
let MedicoService = class MedicoService {
    constructor(citasRepository, casosRepository, atencionesRepository, pacientesRepository, medicosRepository, dataSource) {
        this.citasRepository = citasRepository;
        this.casosRepository = casosRepository;
        this.atencionesRepository = atencionesRepository;
        this.pacientesRepository = pacientesRepository;
        this.medicosRepository = medicosRepository;
        this.dataSource = dataSource;
    }
    async getDashboardStats(idMedico, pais) {
        const citasHoy = await this.citasRepository.count({
            where: {
                medico: { id_medico: idMedico },
                fecha_cita: new Date(),
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
    async getAgendaCitas(pais) {
        return this.casosRepository.find({
            where: {
                estado_caso: 'Abierto',
                paciente: { usuario: { pais } }
            },
            relations: ['paciente', 'paciente.usuario']
        });
    }
    async agendarCita(agendarCitaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const caso = await queryRunner.manager.findOne(caso_clinico_entity_1.CasoClinico, {
                where: { id_caso: agendarCitaDto.idCaso },
                relations: ['paciente']
            });
            if (!caso)
                throw new common_1.NotFoundException('Caso clínico no encontrado');
            const medico = await queryRunner.manager.findOne(medico_entity_1.Medico, { where: { id_medico: agendarCitaDto.idMedico } });
            if (!medico)
                throw new common_1.NotFoundException('Médico no encontrado');
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
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async crearAtencion(crearAtencionDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cita = await queryRunner.manager.findOne(cita_medica_entity_1.CitaMedica, {
                where: { id_cita: crearAtencionDto.idCita },
                relations: ['caso_clinico']
            });
            if (!cita)
                throw new common_1.NotFoundException('Cita no encontrada');
            const medico = await queryRunner.manager.findOne(medico_entity_1.Medico, { where: { id_medico: crearAtencionDto.idMedico } });
            if (!medico)
                throw new common_1.NotFoundException('Médico no encontrado');
            const nuevaAtencion = new atencion_medica_entity_1.AtencionMedica();
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
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.MedicoService = MedicoService;
exports.MedicoService = MedicoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cita_medica_entity_1.CitaMedica)),
    __param(1, (0, typeorm_1.InjectRepository)(caso_clinico_entity_1.CasoClinico)),
    __param(2, (0, typeorm_1.InjectRepository)(atencion_medica_entity_1.AtencionMedica)),
    __param(3, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __param(4, (0, typeorm_1.InjectRepository)(medico_entity_1.Medico)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], MedicoService);
//# sourceMappingURL=medico.service.js.map