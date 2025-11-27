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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
const medico_entity_1 = require("./medico.entity");
const seguimiento_entity_1 = require("./seguimiento.entity");
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, comment: 'Carnet del empleado o identificador único.' }),
    __metadata("design:type", String)
], Usuario.prototype, "carnet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', comment: 'Hash de la contraseña generado con bcrypt.' }),
    __metadata("design:type", String)
], Usuario.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, comment: 'Roles: PACIENTE, MEDICO, ADMIN' }),
    __metadata("design:type", String)
], Usuario.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2, comment: 'País del usuario: NI, CR, HN' }),
    __metadata("design:type", String)
], Usuario.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A', comment: 'Estado: A (Activo), I (Inactivo)' }),
    __metadata("design:type", String)
], Usuario.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, comment: 'Fecha y hora del último inicio de sesión.' }),
    __metadata("design:type", Date)
], Usuario.prototype, "ultimo_acceso", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => paciente_entity_1.Paciente, paciente => paciente.usuario, { nullable: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], Usuario.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => medico_entity_1.Medico, medico => medico.usuario, { nullable: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_medico' }),
    __metadata("design:type", medico_entity_1.Medico)
], Usuario.prototype, "medico", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seguimiento_entity_1.Seguimiento, seguimiento => seguimiento.usuario_responsable),
    __metadata("design:type", Array)
], Usuario.prototype, "seguimientos", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], Usuario);
//# sourceMappingURL=usuario.entity.js.map