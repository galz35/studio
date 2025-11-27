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
exports.CrearUsuarioDto = exports.Pais = exports.Rol = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var Rol;
(function (Rol) {
    Rol["PACIENTE"] = "PACIENTE";
    Rol["MEDICO"] = "MEDICO";
    Rol["ADMIN"] = "ADMIN";
})(Rol || (exports.Rol = Rol = {}));
var Pais;
(function (Pais) {
    Pais["NI"] = "NI";
    Pais["CR"] = "CR";
    Pais["HN"] = "HN";
})(Pais || (exports.Pais = Pais = {}));
var CrearUsuarioDto = function () {
    var _a;
    var _carnet_decorators;
    var _carnet_initializers = [];
    var _carnet_extraInitializers = [];
    var _nombreCompleto_decorators;
    var _nombreCompleto_initializers = [];
    var _nombreCompleto_extraInitializers = [];
    var _correo_decorators;
    var _correo_initializers = [];
    var _correo_extraInitializers = [];
    var _rol_decorators;
    var _rol_initializers = [];
    var _rol_extraInitializers = [];
    var _pais_decorators;
    var _pais_initializers = [];
    var _pais_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearUsuarioDto() {
                this.carnet = __runInitializers(this, _carnet_initializers, void 0);
                this.nombreCompleto = (__runInitializers(this, _carnet_extraInitializers), __runInitializers(this, _nombreCompleto_initializers, void 0));
                this.correo = (__runInitializers(this, _nombreCompleto_extraInitializers), __runInitializers(this, _correo_initializers, void 0));
                this.rol = (__runInitializers(this, _correo_extraInitializers), __runInitializers(this, _rol_initializers, void 0));
                this.pais = (__runInitializers(this, _rol_extraInitializers), __runInitializers(this, _pais_initializers, void 0));
                this.password = (__runInitializers(this, _pais_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                __runInitializers(this, _password_extraInitializers);
            }
            return CrearUsuarioDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _carnet_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _nombreCompleto_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _correo_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsOptional)()];
            _rol_decorators = [(0, swagger_1.ApiProperty)({ enum: Rol }), (0, class_validator_1.IsEnum)(Rol)];
            _pais_decorators = [(0, swagger_1.ApiProperty)({ enum: Pais }), (0, class_validator_1.IsEnum)(Pais)];
            _password_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _carnet_decorators, { kind: "field", name: "carnet", static: false, private: false, access: { has: function (obj) { return "carnet" in obj; }, get: function (obj) { return obj.carnet; }, set: function (obj, value) { obj.carnet = value; } }, metadata: _metadata }, _carnet_initializers, _carnet_extraInitializers);
            __esDecorate(null, null, _nombreCompleto_decorators, { kind: "field", name: "nombreCompleto", static: false, private: false, access: { has: function (obj) { return "nombreCompleto" in obj; }, get: function (obj) { return obj.nombreCompleto; }, set: function (obj, value) { obj.nombreCompleto = value; } }, metadata: _metadata }, _nombreCompleto_initializers, _nombreCompleto_extraInitializers);
            __esDecorate(null, null, _correo_decorators, { kind: "field", name: "correo", static: false, private: false, access: { has: function (obj) { return "correo" in obj; }, get: function (obj) { return obj.correo; }, set: function (obj, value) { obj.correo = value; } }, metadata: _metadata }, _correo_initializers, _correo_extraInitializers);
            __esDecorate(null, null, _rol_decorators, { kind: "field", name: "rol", static: false, private: false, access: { has: function (obj) { return "rol" in obj; }, get: function (obj) { return obj.rol; }, set: function (obj, value) { obj.rol = value; } }, metadata: _metadata }, _rol_initializers, _rol_extraInitializers);
            __esDecorate(null, null, _pais_decorators, { kind: "field", name: "pais", static: false, private: false, access: { has: function (obj) { return "pais" in obj; }, get: function (obj) { return obj.pais; }, set: function (obj, value) { obj.pais = value; } }, metadata: _metadata }, _pais_initializers, _pais_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearUsuarioDto = CrearUsuarioDto;
