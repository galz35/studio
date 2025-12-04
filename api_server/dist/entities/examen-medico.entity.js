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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamenMedico = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const caso_clinico_entity_1 = require("./caso-clinico.entity");
const atencion_medica_entity_1 = require("./atencion-medica.entity");
let ExamenMedico = class ExamenMedico {
};
exports.ExamenMedico = ExamenMedico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExamenMedico.prototype, "id_examen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.examenes),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], ExamenMedico.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => caso_clinico_entity_1.CasoClinico, caso => caso.examenes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_caso' }),
    __metadata("design:type", caso_clinico_entity_1.CasoClinico)
], ExamenMedico.prototype, "caso_clinico", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => atencion_medica_entity_1.AtencionMedica, atencion => atencion.examenes, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_atencion' }),
    __metadata("design:type", atencion_medica_entity_1.AtencionMedica)
], ExamenMedico.prototype, "atencion_medica", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExamenMedico.prototype, "tipo_examen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ExamenMedico.prototype, "fecha_solicitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ExamenMedico.prototype, "fecha_resultado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExamenMedico.prototype, "laboratorio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ExamenMedico.prototype, "resultado_resumen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PENDIENTE' }),
    __metadata("design:type", String)
], ExamenMedico.prototype, "estado_examen", void 0);
exports.ExamenMedico = ExamenMedico = __decorate([
    (0, typeorm_1.Entity)('examenes_medicos')
], ExamenMedico);
//# sourceMappingURL=examen-medico.entity.js.map