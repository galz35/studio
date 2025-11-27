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
exports.Paciente = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const caso_clinico_entity_1 = require("./caso-clinico.entity");
const seguimiento_entity_1 = require("./seguimiento.entity");
let Paciente = class Paciente {
};
exports.Paciente = Paciente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Paciente.prototype, "id_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Paciente.prototype, "carnet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Paciente.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Paciente.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "sexo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "gerencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Paciente.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A' }),
    __metadata("design:type", String)
], Paciente.prototype, "estado_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1, nullable: true, comment: 'Nivel de semáforo: V, A, R' }),
    __metadata("design:type", String)
], Paciente.prototype, "nivel_semaforo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usuario_entity_1.Usuario, usuario => usuario.paciente),
    __metadata("design:type", usuario_entity_1.Usuario)
], Paciente.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => caso_clinico_entity_1.CasoClinico, caso => caso.paciente),
    __metadata("design:type", Array)
], Paciente.prototype, "casos_clinicos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_entity_1.Seguimiento, seguimiento => seguimiento.paciente),
    __metadata("design:type", Array)
], Paciente.prototype, "seguimientos", void 0);
exports.Paciente = Paciente = __decorate([
    (0, typeorm_1.Entity)('pacientes')
], Paciente);
//# sourceMappingURL=paciente.entity.js.map