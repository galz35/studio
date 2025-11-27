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
exports.SolicitudCitaDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var SolicitudCitaDto = function () {
    var _a;
    var _ruta_decorators;
    var _ruta_initializers = [];
    var _ruta_extraInitializers = [];
    var _datosCompletos_decorators;
    var _datosCompletos_initializers = [];
    var _datosCompletos_extraInitializers = [];
    var _comentarioGeneral_decorators;
    var _comentarioGeneral_initializers = [];
    var _comentarioGeneral_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SolicitudCitaDto() {
                this.ruta = __runInitializers(this, _ruta_initializers, void 0); // 'consulta', 'chequeo', etc.
                this.datosCompletos = (__runInitializers(this, _ruta_extraInitializers), __runInitializers(this, _datosCompletos_initializers, void 0)); // JSON del wizard
                this.comentarioGeneral = (__runInitializers(this, _datosCompletos_extraInitializers), __runInitializers(this, _comentarioGeneral_initializers, void 0));
                __runInitializers(this, _comentarioGeneral_extraInitializers);
            }
            return SolicitudCitaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruta_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _datosCompletos_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _comentarioGeneral_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _ruta_decorators, { kind: "field", name: "ruta", static: false, private: false, access: { has: function (obj) { return "ruta" in obj; }, get: function (obj) { return obj.ruta; }, set: function (obj, value) { obj.ruta = value; } }, metadata: _metadata }, _ruta_initializers, _ruta_extraInitializers);
            __esDecorate(null, null, _datosCompletos_decorators, { kind: "field", name: "datosCompletos", static: false, private: false, access: { has: function (obj) { return "datosCompletos" in obj; }, get: function (obj) { return obj.datosCompletos; }, set: function (obj, value) { obj.datosCompletos = value; } }, metadata: _metadata }, _datosCompletos_initializers, _datosCompletos_extraInitializers);
            __esDecorate(null, null, _comentarioGeneral_decorators, { kind: "field", name: "comentarioGeneral", static: false, private: false, access: { has: function (obj) { return "comentarioGeneral" in obj; }, get: function (obj) { return obj.comentarioGeneral; }, set: function (obj, value) { obj.comentarioGeneral = value; } }, metadata: _metadata }, _comentarioGeneral_initializers, _comentarioGeneral_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SolicitudCitaDto = SolicitudCitaDto;
