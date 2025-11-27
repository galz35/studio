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
exports.CrearMedicoDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CrearMedicoDto = function () {
    var _a;
    var _nombreCompleto_decorators;
    var _nombreCompleto_initializers = [];
    var _nombreCompleto_extraInitializers = [];
    var _especialidad_decorators;
    var _especialidad_initializers = [];
    var _especialidad_extraInitializers = [];
    var _tipoMedico_decorators;
    var _tipoMedico_initializers = [];
    var _tipoMedico_extraInitializers = [];
    var _correo_decorators;
    var _correo_initializers = [];
    var _correo_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _carnet_decorators;
    var _carnet_initializers = [];
    var _carnet_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearMedicoDto() {
                this.nombreCompleto = __runInitializers(this, _nombreCompleto_initializers, void 0);
                this.especialidad = (__runInitializers(this, _nombreCompleto_extraInitializers), __runInitializers(this, _especialidad_initializers, void 0));
                this.tipoMedico = (__runInitializers(this, _especialidad_extraInitializers), __runInitializers(this, _tipoMedico_initializers, void 0));
                this.correo = (__runInitializers(this, _tipoMedico_extraInitializers), __runInitializers(this, _correo_initializers, void 0));
                this.telefono = (__runInitializers(this, _correo_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
                this.carnet = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _carnet_initializers, void 0));
                __runInitializers(this, _carnet_extraInitializers);
            }
            return CrearMedicoDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nombreCompleto_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _especialidad_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tipoMedico_decorators = [(0, swagger_1.ApiProperty)({ enum: ['INTERNO', 'EXTERNO'] }), (0, class_validator_1.IsEnum)(['INTERNO', 'EXTERNO'])];
            _correo_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsOptional)()];
            _telefono_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _carnet_decorators = [(0, swagger_1.ApiProperty)({ description: 'Carnet del usuario asociado (solo para médicos internos)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _nombreCompleto_decorators, { kind: "field", name: "nombreCompleto", static: false, private: false, access: { has: function (obj) { return "nombreCompleto" in obj; }, get: function (obj) { return obj.nombreCompleto; }, set: function (obj, value) { obj.nombreCompleto = value; } }, metadata: _metadata }, _nombreCompleto_initializers, _nombreCompleto_extraInitializers);
            __esDecorate(null, null, _especialidad_decorators, { kind: "field", name: "especialidad", static: false, private: false, access: { has: function (obj) { return "especialidad" in obj; }, get: function (obj) { return obj.especialidad; }, set: function (obj, value) { obj.especialidad = value; } }, metadata: _metadata }, _especialidad_initializers, _especialidad_extraInitializers);
            __esDecorate(null, null, _tipoMedico_decorators, { kind: "field", name: "tipoMedico", static: false, private: false, access: { has: function (obj) { return "tipoMedico" in obj; }, get: function (obj) { return obj.tipoMedico; }, set: function (obj, value) { obj.tipoMedico = value; } }, metadata: _metadata }, _tipoMedico_initializers, _tipoMedico_extraInitializers);
            __esDecorate(null, null, _correo_decorators, { kind: "field", name: "correo", static: false, private: false, access: { has: function (obj) { return "correo" in obj; }, get: function (obj) { return obj.correo; }, set: function (obj, value) { obj.correo = value; } }, metadata: _metadata }, _correo_initializers, _correo_extraInitializers);
            __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
            __esDecorate(null, null, _carnet_decorators, { kind: "field", name: "carnet", static: false, private: false, access: { has: function (obj) { return "carnet" in obj; }, get: function (obj) { return obj.carnet; }, set: function (obj, value) { obj.carnet = value; } }, metadata: _metadata }, _carnet_initializers, _carnet_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearMedicoDto = CrearMedicoDto;
