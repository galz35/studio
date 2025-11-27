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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoController = void 0;
const common_1 = require("@nestjs/common");
const medico_service_1 = require("./medico.service");
const agendar_cita_dto_1 = require("./dto/agendar-cita.dto");
const crear_atencion_dto_1 = require("./dto/crear-atencion.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let MedicoController = class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }
    getDashboard(req) {
        return this.medicoService.getDashboardStats(req.user.idMedico, req.user.pais);
    }
    getAgendaCitas(req) {
        return this.medicoService.getAgendaCitas(req.user.pais);
    }
    agendarCita(agendarCitaDto) {
        return this.medicoService.agendarCita(agendarCitaDto);
    }
    crearAtencion(crearAtencionDto) {
        return this.medicoService.crearAtencion(crearAtencionDto);
    }
};
exports.MedicoController = MedicoController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de médico' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('agenda-citas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener casos abiertos para agendar' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "getAgendaCitas", null);
__decorate([
    (0, common_1.Post)('agenda-citas/agendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Agendar una cita para un caso clínico' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agendar_cita_dto_1.AgendarCitaDto]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "agendarCita", null);
__decorate([
    (0, common_1.Post)('atencion'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar atención médica' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_atencion_dto_1.CrearAtencionDto]),
    __metadata("design:returntype", void 0)
], MedicoController.prototype, "crearAtencion", null);
exports.MedicoController = MedicoController = __decorate([
    (0, swagger_1.ApiTags)('medico'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('MEDICO'),
    (0, common_1.Controller)('medico'),
    __metadata("design:paramtypes", [medico_service_1.MedicoService])
], MedicoController);
//# sourceMappingURL=medico.controller.js.map