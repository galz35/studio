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
exports.AgendarCitaDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var AgendarCitaDto = function () {
    var _a;
    var _idCaso_decorators;
    var _idCaso_initializers = [];
    var _idCaso_extraInitializers = [];
    var _idMedico_decorators;
    var _idMedico_initializers = [];
    var _idMedico_extraInitializers = [];
    var _fechaCita_decorators;
    var _fechaCita_initializers = [];
    var _fechaCita_extraInitializers = [];
    var _horaCita_decorators;
    var _horaCita_initializers = [];
    var _horaCita_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AgendarCitaDto() {
                this.idCaso = __runInitializers(this, _idCaso_initializers, void 0);
                this.idMedico = (__runInitializers(this, _idCaso_extraInitializers), __runInitializers(this, _idMedico_initializers, void 0));
                this.fechaCita = (__runInitializers(this, _idMedico_extraInitializers), __runInitializers(this, _fechaCita_initializers, void 0));
                this.horaCita = (__runInitializers(this, _fechaCita_extraInitializers), __runInitializers(this, _horaCita_initializers, void 0));
                __runInitializers(this, _horaCita_extraInitializers);
            }
            return AgendarCitaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _idCaso_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _idMedico_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _fechaCita_decorators = [(0, swagger_1.ApiProperty)({ example: '2024-12-01' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsNotEmpty)()];
            _horaCita_decorators = [(0, swagger_1.ApiProperty)({ example: '10:00' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _idCaso_decorators, { kind: "field", name: "idCaso", static: false, private: false, access: { has: function (obj) { return "idCaso" in obj; }, get: function (obj) { return obj.idCaso; }, set: function (obj, value) { obj.idCaso = value; } }, metadata: _metadata }, _idCaso_initializers, _idCaso_extraInitializers);
            __esDecorate(null, null, _idMedico_decorators, { kind: "field", name: "idMedico", static: false, private: false, access: { has: function (obj) { return "idMedico" in obj; }, get: function (obj) { return obj.idMedico; }, set: function (obj, value) { obj.idMedico = value; } }, metadata: _metadata }, _idMedico_initializers, _idMedico_extraInitializers);
            __esDecorate(null, null, _fechaCita_decorators, { kind: "field", name: "fechaCita", static: false, private: false, access: { has: function (obj) { return "fechaCita" in obj; }, get: function (obj) { return obj.fechaCita; }, set: function (obj, value) { obj.fechaCita = value; } }, metadata: _metadata }, _fechaCita_initializers, _fechaCita_extraInitializers);
            __esDecorate(null, null, _horaCita_decorators, { kind: "field", name: "horaCita", static: false, private: false, access: { has: function (obj) { return "horaCita" in obj; }, get: function (obj) { return obj.horaCita; }, set: function (obj, value) { obj.horaCita = value; } }, metadata: _metadata }, _horaCita_initializers, _horaCita_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AgendarCitaDto = AgendarCitaDto;
