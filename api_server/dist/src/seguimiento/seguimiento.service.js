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
exports.SeguimientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const seguimiento_entity_1 = require("../entities/seguimiento.entity");
let SeguimientoService = class SeguimientoService {
    constructor(seguimientoRepository) {
        this.seguimientoRepository = seguimientoRepository;
    }
    async create(createSeguimientoDto) {
        const nuevoSeguimiento = this.seguimientoRepository.create({
            caso_clinico: { id_caso: createSeguimientoDto.idCaso },
            paciente: { id_paciente: createSeguimientoDto.idPaciente },
            usuario_responsable: { id_usuario: createSeguimientoDto.idUsuarioResponsable },
            atencion_origen: createSeguimientoDto.idAtencionOrigen ? { id_atencion: createSeguimientoDto.idAtencionOrigen } : undefined,
            fecha_programada: new Date(createSeguimientoDto.fechaProgramada),
            tipo_seguimiento: createSeguimientoDto.tipoSeguimiento,
            notas_seguimiento: createSeguimientoDto.notasObjetivo,
            estado_seguimiento: createSeguimientoDto.estadoSeguimiento || 'PENDIENTE',
        });
        return this.seguimientoRepository.save(nuevoSeguimiento);
    }
    findAll() {
        return this.seguimientoRepository.find({
            relations: ['caso_clinico', 'paciente', 'usuario_responsable', 'atencion_origen'],
        });
    }
    findOne(id) {
        return this.seguimientoRepository.findOne({
            where: { id_seguimiento: id },
            relations: ['caso_clinico', 'paciente', 'usuario_responsable', 'atencion_origen'],
        });
    }
    update(id, updateSeguimientoDto) {
        return this.seguimientoRepository.update(id, updateSeguimientoDto);
    }
    remove(id) {
        return this.seguimientoRepository.delete(id);
    }
};
exports.SeguimientoService = SeguimientoService;
exports.SeguimientoService = SeguimientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seguimiento_entity_1.Seguimiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeguimientoService);
//# sourceMappingURL=seguimiento.service.js.map