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
exports.PacienteController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var swagger_1 = require("@nestjs/swagger");
var PacienteController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('paciente'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('PACIENTE'), (0, common_1.Controller)('paciente')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var _solicitarCita_decorators;
    var _getMisCitas_decorators;
    var PacienteController = _classThis = /** @class */ (function () {
        function PacienteController_1(pacienteService) {
            this.pacienteService = (__runInitializers(this, _instanceExtraInitializers), pacienteService);
        }
        PacienteController_1.prototype.getDashboard = function (req) {
            return this.pacienteService.getDashboardStats(req.user.idPaciente);
        };
        PacienteController_1.prototype.solicitarCita = function (req, solicitudDto) {
            return this.pacienteService.solicitarCita(req.user.idPaciente, solicitudDto);
        };
        PacienteController_1.prototype.getMisCitas = function (req) {
            return this.pacienteService.getMisCitas(req.user.idPaciente);
        };
        return PacienteController_1;
    }());
    __setFunctionName(_classThis, "PacienteController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({ summary: 'Obtener KPIs del dashboard de paciente' })];
        _solicitarCita_decorators = [(0, common_1.Post)('solicitar-cita'), (0, swagger_1.ApiOperation)({ summary: 'Solicitar una cita (Wizard)' })];
        _getMisCitas_decorators = [(0, common_1.Get)('mis-citas'), (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de citas' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _solicitarCita_decorators, { kind: "method", name: "solicitarCita", static: false, private: false, access: { has: function (obj) { return "solicitarCita" in obj; }, get: function (obj) { return obj.solicitarCita; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMisCitas_decorators, { kind: "method", name: "getMisCitas", static: false, private: false, access: { has: function (obj) { return "getMisCitas" in obj; }, get: function (obj) { return obj.getMisCitas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PacienteController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PacienteController = _classThis;
}();
exports.PacienteController = PacienteController;
