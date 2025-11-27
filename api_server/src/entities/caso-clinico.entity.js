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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasoClinico = void 0;
var typeorm_1 = require("typeorm");
var paciente_entity_1 = require("./paciente.entity");
var cita_medica_entity_1 = require("./cita-medica.entity");
var CasoClinico = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('casos_clinicos'), (0, typeorm_1.Index)(['codigo_caso'], { unique: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_caso_decorators;
    var _id_caso_initializers = [];
    var _id_caso_extraInitializers = [];
    var _codigo_caso_decorators;
    var _codigo_caso_initializers = [];
    var _codigo_caso_extraInitializers = [];
    var _paciente_decorators;
    var _paciente_initializers = [];
    var _paciente_extraInitializers = [];
    var _fecha_creacion_decorators;
    var _fecha_creacion_initializers = [];
    var _fecha_creacion_extraInitializers = [];
    var _estado_caso_decorators;
    var _estado_caso_initializers = [];
    var _estado_caso_extraInitializers = [];
    var _nivel_semaforo_decorators;
    var _nivel_semaforo_initializers = [];
    var _nivel_semaforo_extraInitializers = [];
    var _motivo_consulta_decorators;
    var _motivo_consulta_initializers = [];
    var _motivo_consulta_extraInitializers = [];
    var _resumen_clinico_usuario_decorators;
    var _resumen_clinico_usuario_initializers = [];
    var _resumen_clinico_usuario_extraInitializers = [];
    var _cita_principal_decorators;
    var _cita_principal_initializers = [];
    var _cita_principal_extraInitializers = [];
    var CasoClinico = _classThis = /** @class */ (function () {
        function CasoClinico_1() {
            this.id_caso = __runInitializers(this, _id_caso_initializers, void 0);
            this.codigo_caso = (__runInitializers(this, _id_caso_extraInitializers), __runInitializers(this, _codigo_caso_initializers, void 0)); // Autogenerado: CC-YYYY-#####
            this.paciente = (__runInitializers(this, _codigo_caso_extraInitializers), __runInitializers(this, _paciente_initializers, void 0));
            this.fecha_creacion = (__runInitializers(this, _paciente_extraInitializers), __runInitializers(this, _fecha_creacion_initializers, void 0));
            this.estado_caso = (__runInitializers(this, _fecha_creacion_extraInitializers), __runInitializers(this, _estado_caso_initializers, void 0)); // 'Abierto', 'Agendado', 'Cerrado', 'Cancelado'
            this.nivel_semaforo = (__runInitializers(this, _estado_caso_extraInitializers), __runInitializers(this, _nivel_semaforo_initializers, void 0)); // V, A, R
            this.motivo_consulta = (__runInitializers(this, _nivel_semaforo_extraInitializers), __runInitializers(this, _motivo_consulta_initializers, void 0));
            this.resumen_clinico_usuario = (__runInitializers(this, _motivo_consulta_extraInitializers), __runInitializers(this, _resumen_clinico_usuario_initializers, void 0));
            // Relaciones
            this.cita_principal = (__runInitializers(this, _resumen_clinico_usuario_extraInitializers), __runInitializers(this, _cita_principal_initializers, void 0));
            __runInitializers(this, _cita_principal_extraInitializers);
        }
        return CasoClinico_1;
    }());
    __setFunctionName(_classThis, "CasoClinico");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_caso_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _codigo_caso_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true })];
        _paciente_decorators = [(0, typeorm_1.ManyToOne)(function () { return paciente_entity_1.Paciente; }, function (paciente) { return paciente.casos_clinicos; }), (0, typeorm_1.JoinColumn)({ name: 'id_paciente' })];
        _fecha_creacion_decorators = [(0, typeorm_1.Column)({ type: 'timestamptz', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _estado_caso_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50 })];
        _nivel_semaforo_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1 })];
        _motivo_consulta_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _resumen_clinico_usuario_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _cita_principal_decorators = [(0, typeorm_1.OneToOne)(function () { return cita_medica_entity_1.CitaMedica; }, function (cita) { return cita.caso_clinico; }, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'id_cita_principal' })];
        __esDecorate(null, null, _id_caso_decorators, { kind: "field", name: "id_caso", static: false, private: false, access: { has: function (obj) { return "id_caso" in obj; }, get: function (obj) { return obj.id_caso; }, set: function (obj, value) { obj.id_caso = value; } }, metadata: _metadata }, _id_caso_initializers, _id_caso_extraInitializers);
        __esDecorate(null, null, _codigo_caso_decorators, { kind: "field", name: "codigo_caso", static: false, private: false, access: { has: function (obj) { return "codigo_caso" in obj; }, get: function (obj) { return obj.codigo_caso; }, set: function (obj, value) { obj.codigo_caso = value; } }, metadata: _metadata }, _codigo_caso_initializers, _codigo_caso_extraInitializers);
        __esDecorate(null, null, _paciente_decorators, { kind: "field", name: "paciente", static: false, private: false, access: { has: function (obj) { return "paciente" in obj; }, get: function (obj) { return obj.paciente; }, set: function (obj, value) { obj.paciente = value; } }, metadata: _metadata }, _paciente_initializers, _paciente_extraInitializers);
        __esDecorate(null, null, _fecha_creacion_decorators, { kind: "field", name: "fecha_creacion", static: false, private: false, access: { has: function (obj) { return "fecha_creacion" in obj; }, get: function (obj) { return obj.fecha_creacion; }, set: function (obj, value) { obj.fecha_creacion = value; } }, metadata: _metadata }, _fecha_creacion_initializers, _fecha_creacion_extraInitializers);
        __esDecorate(null, null, _estado_caso_decorators, { kind: "field", name: "estado_caso", static: false, private: false, access: { has: function (obj) { return "estado_caso" in obj; }, get: function (obj) { return obj.estado_caso; }, set: function (obj, value) { obj.estado_caso = value; } }, metadata: _metadata }, _estado_caso_initializers, _estado_caso_extraInitializers);
        __esDecorate(null, null, _nivel_semaforo_decorators, { kind: "field", name: "nivel_semaforo", static: false, private: false, access: { has: function (obj) { return "nivel_semaforo" in obj; }, get: function (obj) { return obj.nivel_semaforo; }, set: function (obj, value) { obj.nivel_semaforo = value; } }, metadata: _metadata }, _nivel_semaforo_initializers, _nivel_semaforo_extraInitializers);
        __esDecorate(null, null, _motivo_consulta_decorators, { kind: "field", name: "motivo_consulta", static: false, private: false, access: { has: function (obj) { return "motivo_consulta" in obj; }, get: function (obj) { return obj.motivo_consulta; }, set: function (obj, value) { obj.motivo_consulta = value; } }, metadata: _metadata }, _motivo_consulta_initializers, _motivo_consulta_extraInitializers);
        __esDecorate(null, null, _resumen_clinico_usuario_decorators, { kind: "field", name: "resumen_clinico_usuario", static: false, private: false, access: { has: function (obj) { return "resumen_clinico_usuario" in obj; }, get: function (obj) { return obj.resumen_clinico_usuario; }, set: function (obj, value) { obj.resumen_clinico_usuario = value; } }, metadata: _metadata }, _resumen_clinico_usuario_initializers, _resumen_clinico_usuario_extraInitializers);
        __esDecorate(null, null, _cita_principal_decorators, { kind: "field", name: "cita_principal", static: false, private: false, access: { has: function (obj) { return "cita_principal" in obj; }, get: function (obj) { return obj.cita_principal; }, set: function (obj, value) { obj.cita_principal = value; } }, metadata: _metadata }, _cita_principal_initializers, _cita_principal_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CasoClinico = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CasoClinico = _classThis;
}();
exports.CasoClinico = CasoClinico;
