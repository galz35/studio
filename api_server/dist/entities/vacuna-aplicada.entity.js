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
exports.VacunaAplicada = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const medico_entity_1 = require("./medico.entity");
const atencion_medica_entity_1 = require("./atencion-medica.entity");
let VacunaAplicada = class VacunaAplicada {
};
exports.VacunaAplicada = VacunaAplicada;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VacunaAplicada.prototype, "id_vacuna_registro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.vacunas),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], VacunaAplicada.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medico_entity_1.Medico, medico => medico.vacunas_aplicadas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_medico' }),
    __metadata("design:type", medico_entity_1.Medico)
], VacunaAplicada.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => atencion_medica_entity_1.AtencionMedica, atencion => atencion.vacunas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_atencion' }),
    __metadata("design:type", atencion_medica_entity_1.AtencionMedica)
], VacunaAplicada.prototype, "atencion_medica", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VacunaAplicada.prototype, "tipo_vacuna", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VacunaAplicada.prototype, "dosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], VacunaAplicada.prototype, "fecha_aplicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VacunaAplicada.prototype, "observaciones", void 0);
exports.VacunaAplicada = VacunaAplicada = __decorate([
    (0, typeorm_1.Entity)('vacunas_aplicadas')
], VacunaAplicada);
//# sourceMappingURL=vacuna-aplicada.entity.js.map