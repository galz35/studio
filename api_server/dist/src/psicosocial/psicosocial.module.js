"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsicosocialModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const psicosocial_controller_1 = require("./psicosocial.controller");
const psicosocial_service_1 = require("./psicosocial.service");
const registro_psicosocial_entity_1 = require("../entities/registro-psicosocial.entity");
const paciente_entity_1 = require("../entities/paciente.entity");
let PsicosocialModule = class PsicosocialModule {
};
exports.PsicosocialModule = PsicosocialModule;
exports.PsicosocialModule = PsicosocialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([registro_psicosocial_entity_1.RegistroPsicosocial, paciente_entity_1.Paciente])
        ],
        controllers: [psicosocial_controller_1.PsicosocialController],
        providers: [psicosocial_service_1.PsicosocialService],
        exports: [psicosocial_service_1.PsicosocialService]
    })
], PsicosocialModule);
//# sourceMappingURL=psicosocial.module.js.map