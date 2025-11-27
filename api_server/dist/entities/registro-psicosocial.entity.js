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
exports.RegistroPsicosocial = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const medico_entity_1 = require("./medico.entity");
let RegistroPsicosocial = class RegistroPsicosocial {
};
exports.RegistroPsicosocial = RegistroPsicosocial;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RegistroPsicosocial.prototype, "id_registro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], RegistroPsicosocial.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico),
    (0, typeorm_1.JoinColumn)({ name: 'id_medico' }),
    __metadata("design:type", medico_entity_1.Medico)
], RegistroPsicosocial.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RegistroPsicosocial.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], RegistroPsicosocial.prototype, "nivel_estres", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, comment: 'Almacena un array de síntomas como ["Ansiedad", "Insomnio"]' }),
    __metadata("design:type", Object)
], RegistroPsicosocial.prototype, "sintomas_referidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Narrativa del paciente sobre su estado de ánimo.' }),
    __metadata("design:type", String)
], RegistroPsicosocial.prototype, "narrativa_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, comment: 'Resultado del análisis de sentimiento por IA: Positivo, Negativo, Neutro' }),
    __metadata("design:type", String)
], RegistroPsicosocial.prototype, "analisis_sentimiento_ia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'Bandera de alerta para riesgo suicida.' }),
    __metadata("design:type", Boolean)
], RegistroPsicosocial.prototype, "riesgo_suicida", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'Recomendación de derivar a psicología.' }),
    __metadata("design:type", Boolean)
], RegistroPsicosocial.prototype, "derivar_a_psicologia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Notas confidenciales del profesional de la salud.' }),
    __metadata("design:type", String)
], RegistroPsicosocial.prototype, "notas_profesional", void 0);
exports.RegistroPsicosocial = RegistroPsicosocial = __decorate([
    (0, typeorm_1.Entity)('registros_psicosociales')
], RegistroPsicosocial);
//# sourceMappingURL=registro-psicosocial.entity.js.map