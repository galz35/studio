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
let PacienteService = class PacienteService {
    constructor(pacientesRepository, citasRepository, chequeosRepository, casosRepository, dataSource) {
        this.pacientesRepository = pacientesRepository;
        this.citasRepository = citasRepository;
        this.chequeosRepository = chequeosRepository;
        this.casosRepository = casosRepository;
        this.dataSource = dataSource;
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
        return {
            nivelSemaforo: paciente?.nivel_semaforo,
            proximaCita,
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
};
exports.PacienteService = PacienteService;
exports.PacienteService = PacienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __param(1, (0, typeorm_1.InjectRepository)(cita_medica_entity_1.CitaMedica)),
    __param(2, (0, typeorm_1.InjectRepository)(chequeo_bienestar_entity_1.ChequeoBienestar)),
    __param(3, (0, typeorm_1.InjectRepository)(caso_clinico_entity_1.CasoClinico)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PacienteService);
//# sourceMappingURL=paciente.service.js.map