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
exports.AtencionMedica = void 0;
const typeorm_1 = require("typeorm");
const cita_medica_entity_1 = require("./cita-medica.entity");
const medico_entity_1 = require("./medico.entity");
let AtencionMedica = class AtencionMedica {
};
exports.AtencionMedica = AtencionMedica;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AtencionMedica.prototype, "id_atencion", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cita_medica_entity_1.CitaMedica, cita => cita.atencion_medica),
    (0, typeorm_1.JoinColumn)({ name: 'id_cita' }),
    __metadata("design:type", cita_medica_entity_1.CitaMedica)
], AtencionMedica.prototype, "cita", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico),
    (0, typeorm_1.JoinColumn)({ name: 'id_medico' }),
    __metadata("design:type", medico_entity_1.Medico)
], AtencionMedica.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AtencionMedica.prototype, "fecha_atencion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AtencionMedica.prototype, "diagnostico_principal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "plan_tratamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "recomendaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AtencionMedica.prototype, "requiere_seguimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "fecha_siguiente_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "peso_kg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "altura_m", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "presion_arterial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "tipo_siguiente_cita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AtencionMedica.prototype, "notas_seguimiento_medico", void 0);
exports.AtencionMedica = AtencionMedica = __decorate([
    (0, typeorm_1.Entity)('atenciones_medicas')
], AtencionMedica);
//# sourceMappingURL=atencion-medica.entity.js.map