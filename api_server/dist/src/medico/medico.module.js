"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const medico_controller_1 = require("./medico.controller");
const medico_service_1 = require("./medico.service");
const cita_medica_entity_1 = require("../entities/cita-medica.entity");
const caso_clinico_entity_1 = require("../entities/caso-clinico.entity");
const atencion_medica_entity_1 = require("../entities/atencion-medica.entity");
const paciente_entity_1 = require("../entities/paciente.entity");
const medico_entity_1 = require("../entities/medico.entity");
const examen_medico_entity_1 = require("../entities/examen-medico.entity");
const vacuna_aplicada_entity_1 = require("../entities/vacuna-aplicada.entity");
const chequeo_bienestar_entity_1 = require("../entities/chequeo-bienestar.entity");
const seguimiento_entity_1 = require("../entities/seguimiento.entity");
let MedicoModule = class MedicoModule {
};
exports.MedicoModule = MedicoModule;
exports.MedicoModule = MedicoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cita_medica_entity_1.CitaMedica, caso_clinico_entity_1.CasoClinico, atencion_medica_entity_1.AtencionMedica, paciente_entity_1.Paciente, medico_entity_1.Medico, examen_medico_entity_1.ExamenMedico, vacuna_aplicada_entity_1.VacunaAplicada, chequeo_bienestar_entity_1.ChequeoBienestar, seguimiento_entity_1.Seguimiento]),
        ],
        controllers: [medico_controller_1.MedicoController],
        providers: [medico_service_1.MedicoService],
    })
], MedicoModule);
//# sourceMappingURL=medico.module.js.map