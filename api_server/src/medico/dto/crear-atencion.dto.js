"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearAtencionDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CrearAtencionDto = function () {
    var _a;
    var _idCita_decorators;
    var _idCita_initializers = [];
    var _idCita_extraInitializers = [];
    var _idMedico_decorators;
    var _idMedico_initializers = [];
    var _idMedico_extraInitializers = [];
    var _diagnosticoPrincipal_decorators;
    var _diagnosticoPrincipal_initializers = [];
    var _diagnosticoPrincipal_extraInitializers = [];
    var _planTratamiento_decorators;
    var _planTratamiento_initializers = [];
    var _planTratamiento_extraInitializers = [];
    var _recomendaciones_decorators;
    var _recomendaciones_initializers = [];
    var _recomendaciones_extraInitializers = [];
    var _requiereSeguimiento_decorators;
    var _requiereSeguimiento_initializers = [];
    var _requiereSeguimiento_extraInitializers = [];
    var _fechaSiguienteCita_decorators;
    var _fechaSiguienteCita_initializers = [];
    var _fechaSiguienteCita_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearAtencionDto() {
                this.idCita = __runInitializers(this, _idCita_initializers, void 0);
                this.idMedico = (__runInitializers(this, _idCita_extraInitializers), __runInitializers(this, _idMedico_initializers, void 0));
                this.diagnosticoPrincipal = (__runInitializers(this, _idMedico_extraInitializers), __runInitializers(this, _diagnosticoPrincipal_initializers, void 0));
                this.planTratamiento = (__runInitializers(this, _diagnosticoPrincipal_extraInitializers), __runInitializers(this, _planTratamiento_initializers, void 0));
                this.recomendaciones = (__runInitializers(this, _planTratamiento_extraInitializers), __runInitializers(this, _recomendaciones_initializers, void 0));
                this.requiereSeguimiento = (__runInitializers(this, _recomendaciones_extraInitializers), __runInitializers(this, _requiereSeguimiento_initializers, void 0));
                this.fechaSiguienteCita = (__runInitializers(this, _requiereSeguimiento_extraInitializers), __runInitializers(this, _fechaSiguienteCita_initializers, void 0));
                __runInitializers(this, _fechaSiguienteCita_extraInitializers);
            }
            return CrearAtencionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _idCita_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _idMedico_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _diagnosticoPrincipal_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _planTratamiento_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _recomendaciones_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _requiereSeguimiento_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _fechaSiguienteCita_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _idCita_decorators, { kind: "field", name: "idCita", static: false, private: false, access: { has: function (obj) { return "idCita" in obj; }, get: function (obj) { return obj.idCita; }, set: function (obj, value) { obj.idCita = value; } }, metadata: _metadata }, _idCita_initializers, _idCita_extraInitializers);
            __esDecorate(null, null, _idMedico_decorators, { kind: "field", name: "idMedico", static: false, private: false, access: { has: function (obj) { return "idMedico" in obj; }, get: function (obj) { return obj.idMedico; }, set: function (obj, value) { obj.idMedico = value; } }, metadata: _metadata }, _idMedico_initializers, _idMedico_extraInitializers);
            __esDecorate(null, null, _diagnosticoPrincipal_decorators, { kind: "field", name: "diagnosticoPrincipal", static: false, private: false, access: { has: function (obj) { return "diagnosticoPrincipal" in obj; }, get: function (obj) { return obj.diagnosticoPrincipal; }, set: function (obj, value) { obj.diagnosticoPrincipal = value; } }, metadata: _metadata }, _diagnosticoPrincipal_initializers, _diagnosticoPrincipal_extraInitializers);
            __esDecorate(null, null, _planTratamiento_decorators, { kind: "field", name: "planTratamiento", static: false, private: false, access: { has: function (obj) { return "planTratamiento" in obj; }, get: function (obj) { return obj.planTratamiento; }, set: function (obj, value) { obj.planTratamiento = value; } }, metadata: _metadata }, _planTratamiento_initializers, _planTratamiento_extraInitializers);
            __esDecorate(null, null, _recomendaciones_decorators, { kind: "field", name: "recomendaciones", static: false, private: false, access: { has: function (obj) { return "recomendaciones" in obj; }, get: function (obj) { return obj.recomendaciones; }, set: function (obj, value) { obj.recomendaciones = value; } }, metadata: _metadata }, _recomendaciones_initializers, _recomendaciones_extraInitializers);
            __esDecorate(null, null, _requiereSeguimiento_decorators, { kind: "field", name: "requiereSeguimiento", static: false, private: false, access: { has: function (obj) { return "requiereSeguimiento" in obj; }, get: function (obj) { return obj.requiereSeguimiento; }, set: function (obj, value) { obj.requiereSeguimiento = value; } }, metadata: _metadata }, _requiereSeguimiento_initializers, _requiereSeguimiento_extraInitializers);
            __esDecorate(null, null, _fechaSiguienteCita_decorators, { kind: "field", name: "fechaSiguienteCita", static: false, private: false, access: { has: function (obj) { return "fechaSiguienteCita" in obj; }, get: function (obj) { return obj.fechaSiguienteCita; }, set: function (obj, value) { obj.fechaSiguienteCita = value; } }, metadata: _metadata }, _fechaSiguienteCita_initializers, _fechaSiguienteCita_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearAtencionDto = CrearAtencionDto;
