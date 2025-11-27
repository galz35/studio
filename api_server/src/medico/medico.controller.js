"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicoController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var swagger_1 = require("@nestjs/swagger");
var MedicoController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('medico'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('MEDICO'), (0, common_1.Controller)('medico')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var _getAgendaCitas_decorators;
    var _agendarCita_decorators;
    var _crearAtencion_decorators;
    var MedicoController = _classThis = /** @class */ (function () {
        function MedicoController_1(medicoService) {
            this.medicoService = (__runInitializers(this, _instanceExtraInitializers), medicoService);
        }
        MedicoController_1.prototype.getDashboard = function (req) {
            return this.medicoService.getDashboardStats(req.user.idMedico, req.user.pais);
        };
        MedicoController_1.prototype.getAgendaCitas = function (req) {
            return this.medicoService.getAgendaCitas(req.user.pais);
        };
        MedicoController_1.prototype.agendarCita = function (agendarCitaDto) {
            return this.medicoService.agendarCita(agendarCitaDto);
        };
        MedicoController_1.prototype.crearAtencion = function (crearAtencionDto) {
            return this.medicoService.crearAtencion(crearAtencionDto);
        };
        return MedicoController_1;
    }());
    __setFunctionName(_classThis, "MedicoController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de médico' })];
        _getAgendaCitas_decorators = [(0, common_1.Get)('agenda-citas'), (0, swagger_1.ApiOperation)({ summary: 'Obtener casos abiertos para agendar' })];
        _agendarCita_decorators = [(0, common_1.Post)('agenda-citas/agendar'), (0, swagger_1.ApiOperation)({ summary: 'Agendar una cita para un caso clínico' })];
        _crearAtencion_decorators = [(0, common_1.Post)('atencion'), (0, swagger_1.ApiOperation)({ summary: 'Registrar atención médica' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAgendaCitas_decorators, { kind: "method", name: "getAgendaCitas", static: false, private: false, access: { has: function (obj) { return "getAgendaCitas" in obj; }, get: function (obj) { return obj.getAgendaCitas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _agendarCita_decorators, { kind: "method", name: "agendarCita", static: false, private: false, access: { has: function (obj) { return "agendarCita" in obj; }, get: function (obj) { return obj.agendarCita; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _crearAtencion_decorators, { kind: "method", name: "crearAtencion", static: false, private: false, access: { has: function (obj) { return "crearAtencion" in obj; }, get: function (obj) { return obj.crearAtencion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MedicoController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MedicoController = _classThis;
}();
exports.MedicoController = MedicoController;
