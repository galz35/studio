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
exports.CitaMedica = void 0;
var typeorm_1 = require("typeorm");
var paciente_entity_1 = require("./paciente.entity");
var medico_entity_1 = require("./medico.entity");
var caso_clinico_entity_1 = require("./caso-clinico.entity");
var atencion_medica_entity_1 = require("./atencion-medica.entity");
var CitaMedica = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('citas_medicas')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_cita_decorators;
    var _id_cita_initializers = [];
    var _id_cita_extraInitializers = [];
    var _paciente_decorators;
    var _paciente_initializers = [];
    var _paciente_extraInitializers = [];
    var _medico_decorators;
    var _medico_initializers = [];
    var _medico_extraInitializers = [];
    var _caso_clinico_decorators;
    var _caso_clinico_initializers = [];
    var _caso_clinico_extraInitializers = [];
    var _fecha_cita_decorators;
    var _fecha_cita_initializers = [];
    var _fecha_cita_extraInitializers = [];
    var _hora_cita_decorators;
    var _hora_cita_initializers = [];
    var _hora_cita_extraInitializers = [];
    var _canal_origen_decorators;
    var _canal_origen_initializers = [];
    var _canal_origen_extraInitializers = [];
    var _estado_cita_decorators;
    var _estado_cita_initializers = [];
    var _estado_cita_extraInitializers = [];
    var _motivo_resumen_decorators;
    var _motivo_resumen_initializers = [];
    var _motivo_resumen_extraInitializers = [];
    var _nivel_semaforo_paciente_decorators;
    var _nivel_semaforo_paciente_initializers = [];
    var _nivel_semaforo_paciente_extraInitializers = [];
    var _atencion_medica_decorators;
    var _atencion_medica_initializers = [];
    var _atencion_medica_extraInitializers = [];
    var CitaMedica = _classThis = /** @class */ (function () {
        function CitaMedica_1() {
            this.id_cita = __runInitializers(this, _id_cita_initializers, void 0);
            this.paciente = (__runInitializers(this, _id_cita_extraInitializers), __runInitializers(this, _paciente_initializers, void 0));
            this.medico = (__runInitializers(this, _paciente_extraInitializers), __runInitializers(this, _medico_initializers, void 0));
            this.caso_clinico = (__runInitializers(this, _medico_extraInitializers), __runInitializers(this, _caso_clinico_initializers, void 0));
            this.fecha_cita = (__runInitializers(this, _caso_clinico_extraInitializers), __runInitializers(this, _fecha_cita_initializers, void 0));
            this.hora_cita = (__runInitializers(this, _fecha_cita_extraInitializers), __runInitializers(this, _hora_cita_initializers, void 0));
            this.canal_origen = (__runInitializers(this, _hora_cita_extraInitializers), __runInitializers(this, _canal_origen_initializers, void 0)); // 'CHEQUEO', 'RRHH', 'SOLICITUD_DIRECTA'
            this.estado_cita = (__runInitializers(this, _canal_origen_extraInitializers), __runInitializers(this, _estado_cita_initializers, void 0)); // 'PROGRAMADA', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'
            this.motivo_resumen = (__runInitializers(this, _estado_cita_extraInitializers), __runInitializers(this, _motivo_resumen_initializers, void 0));
            this.nivel_semaforo_paciente = (__runInitializers(this, _motivo_resumen_extraInitializers), __runInitializers(this, _nivel_semaforo_paciente_initializers, void 0)); // V, A, R - El semáforo al momento de la cita
            // Relaciones
            this.atencion_medica = (__runInitializers(this, _nivel_semaforo_paciente_extraInitializers), __runInitializers(this, _atencion_medica_initializers, void 0));
            __runInitializers(this, _atencion_medica_extraInitializers);
        }
        return CitaMedica_1;
    }());
    __setFunctionName(_classThis, "CitaMedica");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_cita_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _paciente_decorators = [(0, typeorm_1.ManyToOne)(function () { return paciente_entity_1.Paciente; }), (0, typeorm_1.JoinColumn)({ name: 'id_paciente' })];
        _medico_decorators = [(0, typeorm_1.ManyToOne)(function () { return medico_entity_1.Medico; }, function (medico) { return medico.citas_medicas; }), (0, typeorm_1.JoinColumn)({ name: 'id_medico' })];
        _caso_clinico_decorators = [(0, typeorm_1.OneToOne)(function () { return caso_clinico_entity_1.CasoClinico; }, function (caso) { return caso.cita_principal; }, { nullable: true })];
        _fecha_cita_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _hora_cita_decorators = [(0, typeorm_1.Column)({ type: 'time' })];
        _canal_origen_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100 })];
        _estado_cita_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50 })];
        _motivo_resumen_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _nivel_semaforo_paciente_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1 })];
        _atencion_medica_decorators = [(0, typeorm_1.OneToOne)(function () { return atencion_medica_entity_1.AtencionMedica; }, function (atencion) { return atencion.cita; })];
        __esDecorate(null, null, _id_cita_decorators, { kind: "field", name: "id_cita", static: false, private: false, access: { has: function (obj) { return "id_cita" in obj; }, get: function (obj) { return obj.id_cita; }, set: function (obj, value) { obj.id_cita = value; } }, metadata: _metadata }, _id_cita_initializers, _id_cita_extraInitializers);
        __esDecorate(null, null, _paciente_decorators, { kind: "field", name: "paciente", static: false, private: false, access: { has: function (obj) { return "paciente" in obj; }, get: function (obj) { return obj.paciente; }, set: function (obj, value) { obj.paciente = value; } }, metadata: _metadata }, _paciente_initializers, _paciente_extraInitializers);
        __esDecorate(null, null, _medico_decorators, { kind: "field", name: "medico", static: false, private: false, access: { has: function (obj) { return "medico" in obj; }, get: function (obj) { return obj.medico; }, set: function (obj, value) { obj.medico = value; } }, metadata: _metadata }, _medico_initializers, _medico_extraInitializers);
        __esDecorate(null, null, _caso_clinico_decorators, { kind: "field", name: "caso_clinico", static: false, private: false, access: { has: function (obj) { return "caso_clinico" in obj; }, get: function (obj) { return obj.caso_clinico; }, set: function (obj, value) { obj.caso_clinico = value; } }, metadata: _metadata }, _caso_clinico_initializers, _caso_clinico_extraInitializers);
        __esDecorate(null, null, _fecha_cita_decorators, { kind: "field", name: "fecha_cita", static: false, private: false, access: { has: function (obj) { return "fecha_cita" in obj; }, get: function (obj) { return obj.fecha_cita; }, set: function (obj, value) { obj.fecha_cita = value; } }, metadata: _metadata }, _fecha_cita_initializers, _fecha_cita_extraInitializers);
        __esDecorate(null, null, _hora_cita_decorators, { kind: "field", name: "hora_cita", static: false, private: false, access: { has: function (obj) { return "hora_cita" in obj; }, get: function (obj) { return obj.hora_cita; }, set: function (obj, value) { obj.hora_cita = value; } }, metadata: _metadata }, _hora_cita_initializers, _hora_cita_extraInitializers);
        __esDecorate(null, null, _canal_origen_decorators, { kind: "field", name: "canal_origen", static: false, private: false, access: { has: function (obj) { return "canal_origen" in obj; }, get: function (obj) { return obj.canal_origen; }, set: function (obj, value) { obj.canal_origen = value; } }, metadata: _metadata }, _canal_origen_initializers, _canal_origen_extraInitializers);
        __esDecorate(null, null, _estado_cita_decorators, { kind: "field", name: "estado_cita", static: false, private: false, access: { has: function (obj) { return "estado_cita" in obj; }, get: function (obj) { return obj.estado_cita; }, set: function (obj, value) { obj.estado_cita = value; } }, metadata: _metadata }, _estado_cita_initializers, _estado_cita_extraInitializers);
        __esDecorate(null, null, _motivo_resumen_decorators, { kind: "field", name: "motivo_resumen", static: false, private: false, access: { has: function (obj) { return "motivo_resumen" in obj; }, get: function (obj) { return obj.motivo_resumen; }, set: function (obj, value) { obj.motivo_resumen = value; } }, metadata: _metadata }, _motivo_resumen_initializers, _motivo_resumen_extraInitializers);
        __esDecorate(null, null, _nivel_semaforo_paciente_decorators, { kind: "field", name: "nivel_semaforo_paciente", static: false, private: false, access: { has: function (obj) { return "nivel_semaforo_paciente" in obj; }, get: function (obj) { return obj.nivel_semaforo_paciente; }, set: function (obj, value) { obj.nivel_semaforo_paciente = value; } }, metadata: _metadata }, _nivel_semaforo_paciente_initializers, _nivel_semaforo_paciente_extraInitializers);
        __esDecorate(null, null, _atencion_medica_decorators, { kind: "field", name: "atencion_medica", static: false, private: false, access: { has: function (obj) { return "atencion_medica" in obj; }, get: function (obj) { return obj.atencion_medica; }, set: function (obj, value) { obj.atencion_medica = value; } }, metadata: _metadata }, _atencion_medica_initializers, _atencion_medica_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CitaMedica = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CitaMedica = _classThis;
}();
exports.CitaMedica = CitaMedica;
