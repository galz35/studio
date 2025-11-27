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
exports.CitaMedica = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const medico_entity_1 = require("./medico.entity");
const caso_clinico_entity_1 = require("./caso-clinico.entity");
const atencion_medica_entity_1 = require("./atencion-medica.entity");
let CitaMedica = class CitaMedica {
};
exports.CitaMedica = CitaMedica;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CitaMedica.prototype, "id_cita", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], CitaMedica.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico, medico => medico.citas_medicas),
    (0, typeorm_1.JoinColumn)({ name: 'id_medico' }),
    __metadata("design:type", medico_entity_1.Medico)
], CitaMedica.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => caso_clinico_entity_1.CasoClinico, caso => caso.cita_principal, { nullable: true }),
    __metadata("design:type", caso_clinico_entity_1.CasoClinico)
], CitaMedica.prototype, "caso_clinico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CitaMedica.prototype, "fecha_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], CitaMedica.prototype, "hora_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CitaMedica.prototype, "canal_origen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CitaMedica.prototype, "estado_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CitaMedica.prototype, "motivo_resumen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1 }),
    __metadata("design:type", String)
], CitaMedica.prototype, "nivel_semaforo_paciente", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => atencion_medica_entity_1.AtencionMedica, atencion => atencion.cita),
    __metadata("design:type", atencion_medica_entity_1.AtencionMedica)
], CitaMedica.prototype, "atencion_medica", void 0);
exports.CitaMedica = CitaMedica = __decorate([
    (0, typeorm_1.Entity)('citas_medicas')
], CitaMedica);
//# sourceMappingURL=cita-medica.entity.js.map