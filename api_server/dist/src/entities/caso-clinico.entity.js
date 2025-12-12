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
exports.CasoClinico = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const cita_medica_entity_1 = require("./cita-medica.entity");
const seguimiento_entity_1 = require("./seguimiento.entity");
const examen_medico_entity_1 = require("./examen-medico.entity");
let CasoClinico = class CasoClinico {
};
exports.CasoClinico = CasoClinico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CasoClinico.prototype, "id_caso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], CasoClinico.prototype, "codigo_caso", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.casos_clinicos),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], CasoClinico.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CasoClinico.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CasoClinico.prototype, "estado_caso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1 }),
    __metadata("design:type", String)
], CasoClinico.prototype, "nivel_semaforo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CasoClinico.prototype, "motivo_consulta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CasoClinico.prototype, "resumen_clinico_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CasoClinico.prototype, "diagnostico_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], CasoClinico.prototype, "datos_extra", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cita_medica_entity_1.CitaMedica, cita => cita.caso_clinico, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_cita_principal' }),
    __metadata("design:type", cita_medica_entity_1.CitaMedica)
], CasoClinico.prototype, "cita_principal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_entity_1.Seguimiento, seguimiento => seguimiento.caso_clinico),
    __metadata("design:type", Array)
], CasoClinico.prototype, "seguimientos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => examen_medico_entity_1.ExamenMedico, examen => examen.caso_clinico),
    __metadata("design:type", Array)
], CasoClinico.prototype, "examenes", void 0);
exports.CasoClinico = CasoClinico = __decorate([
    (0, typeorm_1.Entity)('casos_clinicos'),
    (0, typeorm_1.Index)(['codigo_caso'], { unique: true })
], CasoClinico);
//# sourceMappingURL=caso-clinico.entity.js.map