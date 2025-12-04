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
exports.Medico = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const cita_medica_entity_1 = require("./cita-medica.entity");
const vacuna_aplicada_entity_1 = require("./vacuna-aplicada.entity");
let Medico = class Medico {
};
exports.Medico = Medico;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Medico.prototype, "id_medico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, nullable: true }),
    __metadata("design:type", String)
], Medico.prototype, "carnet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Medico.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Medico.prototype, "especialidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['INTERNO', 'EXTERNO'] }),
    __metadata("design:type", String)
], Medico.prototype, "tipo_medico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Medico.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Medico.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A' }),
    __metadata("design:type", String)
], Medico.prototype, "estado_medico", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usuario_entity_1.Usuario, usuario => usuario.medico),
    __metadata("design:type", usuario_entity_1.Usuario)
], Medico.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cita_medica_entity_1.CitaMedica, cita => cita.medico),
    __metadata("design:type", Array)
], Medico.prototype, "citas_medicas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vacuna_aplicada_entity_1.VacunaAplicada, vacuna => vacuna.medico),
    __metadata("design:type", Array)
], Medico.prototype, "vacunas_aplicadas", void 0);
exports.Medico = Medico = __decorate([
    (0, typeorm_1.Entity)('medicos')
], Medico);
//# sourceMappingURL=medico.entity.js.map