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
exports.ChequeoBienestar = void 0;
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("./paciente.entity");
let ChequeoBienestar = class ChequeoBienestar {
};
exports.ChequeoBienestar = ChequeoBienestar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChequeoBienestar.prototype, "id_chequeo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => paciente_entity_1.Paciente),
    (0, typeorm_1.JoinColumn)({ name: 'id_paciente' }),
    __metadata("design:type", paciente_entity_1.Paciente)
], ChequeoBienestar.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ChequeoBienestar.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1 }),
    __metadata("design:type", String)
], ChequeoBienestar.prototype, "nivel_semaforo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ChequeoBienestar.prototype, "datos_completos", void 0);
exports.ChequeoBienestar = ChequeoBienestar = __decorate([
    (0, typeorm_1.Entity)('chequeos_bienestar')
], ChequeoBienestar);
//# sourceMappingURL=chequeo-bienestar.entity.js.map