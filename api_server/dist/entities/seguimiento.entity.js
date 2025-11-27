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
exports.Seguimiento = void 0;
const typeorm_1 = require("typeorm");
const caso_clinico_entity_1 = require("./caso-clinico.entity");
const paciente_entity_1 = require("./paciente.entity");
const atencion_medica_entity_1 = require("./atencion-medica.entity");
const usuario_entity_1 = require("./usuario.entity");
let Seguimiento = class Seguimiento {
};
exports.Seguimiento = Seguimiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Seguimiento.prototype, "id_seguimiento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => caso_clinico_entity_1.CasoClinico, caso => caso.seguimientos),
    (0, typeorm_1.JoinColumn)({ name: 'id_caso' }),
    __metadata("design:type", caso_clinico_entity_1.CasoClinico)
], Seguimiento.prototype, "caso_clinico", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente, paciente => paciente.seguimientos),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Seguimiento.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => atencion_medica_entity_1.AtencionMedica, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_atencion_origen' }),
    __metadata("design:type", atencion_medica_entity_1.AtencionMedica)
], Seguimiento.prototype, "atencion_origen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, usuario => usuario.seguimientos),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_responsable' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Seguimiento.prototype, "usuario_responsable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Seguimiento.prototype, "fecha_programada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Seguimiento.prototype, "fecha_real", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Seguimiento.prototype, "tipo_seguimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'PENDIENTE' }),
    __metadata("design:type", String)
], Seguimiento.prototype, "estado_seguimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1 }),
    __metadata("design:type", String)
], Seguimiento.prototype, "nivel_semaforo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Seguimiento.prototype, "notas_seguimiento", void 0);
exports.Seguimiento = Seguimiento = __decorate([
    (0, typeorm_1.Entity)('seguimientos')
], Seguimiento);
//# sourceMappingURL=seguimiento.entity.js.map