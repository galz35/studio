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
exports.RegistroPsicosocial = void 0;
var typeorm_1 = require("typeorm");
var paciente_entity_1 = require("./paciente.entity");
var medico_entity_1 = require("./medico.entity");
var RegistroPsicosocial = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('registros_psicosociales')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_registro_decorators;
    var _id_registro_initializers = [];
    var _id_registro_extraInitializers = [];
    var _paciente_decorators;
    var _paciente_initializers = [];
    var _paciente_extraInitializers = [];
    var _medico_decorators;
    var _medico_initializers = [];
    var _medico_extraInitializers = [];
    var _fecha_registro_decorators;
    var _fecha_registro_initializers = [];
    var _fecha_registro_extraInitializers = [];
    var _nivel_estres_decorators;
    var _nivel_estres_initializers = [];
    var _nivel_estres_extraInitializers = [];
    var _sintomas_referidos_decorators;
    var _sintomas_referidos_initializers = [];
    var _sintomas_referidos_extraInitializers = [];
    var _narrativa_paciente_decorators;
    var _narrativa_paciente_initializers = [];
    var _narrativa_paciente_extraInitializers = [];
    var _analisis_sentimiento_ia_decorators;
    var _analisis_sentimiento_ia_initializers = [];
    var _analisis_sentimiento_ia_extraInitializers = [];
    var _riesgo_suicida_decorators;
    var _riesgo_suicida_initializers = [];
    var _riesgo_suicida_extraInitializers = [];
    var _derivar_a_psicologia_decorators;
    var _derivar_a_psicologia_initializers = [];
    var _derivar_a_psicologia_extraInitializers = [];
    var _notas_profesional_decorators;
    var _notas_profesional_initializers = [];
    var _notas_profesional_extraInitializers = [];
    var RegistroPsicosocial = _classThis = /** @class */ (function () {
        function RegistroPsicosocial_1() {
            this.id_registro = __runInitializers(this, _id_registro_initializers, void 0);
            this.paciente = (__runInitializers(this, _id_registro_extraInitializers), __runInitializers(this, _paciente_initializers, void 0));
            this.medico = (__runInitializers(this, _paciente_extraInitializers), __runInitializers(this, _medico_initializers, void 0));
            this.fecha_registro = (__runInitializers(this, _medico_extraInitializers), __runInitializers(this, _fecha_registro_initializers, void 0));
            this.nivel_estres = (__runInitializers(this, _fecha_registro_extraInitializers), __runInitializers(this, _nivel_estres_initializers, void 0)); // Bajo, Medio, Alto
            this.sintomas_referidos = (__runInitializers(this, _nivel_estres_extraInitializers), __runInitializers(this, _sintomas_referidos_initializers, void 0));
            this.narrativa_paciente = (__runInitializers(this, _sintomas_referidos_extraInitializers), __runInitializers(this, _narrativa_paciente_initializers, void 0));
            this.analisis_sentimiento_ia = (__runInitializers(this, _narrativa_paciente_extraInitializers), __runInitializers(this, _analisis_sentimiento_ia_initializers, void 0));
            this.riesgo_suicida = (__runInitializers(this, _analisis_sentimiento_ia_extraInitializers), __runInitializers(this, _riesgo_suicida_initializers, void 0));
            this.derivar_a_psicologia = (__runInitializers(this, _riesgo_suicida_extraInitializers), __runInitializers(this, _derivar_a_psicologia_initializers, void 0));
            this.notas_profesional = (__runInitializers(this, _derivar_a_psicologia_extraInitializers), __runInitializers(this, _notas_profesional_initializers, void 0));
            __runInitializers(this, _notas_profesional_extraInitializers);
        }
        return RegistroPsicosocial_1;
    }());
    __setFunctionName(_classThis, "RegistroPsicosocial");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_registro_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _paciente_decorators = [(0, typeorm_1.ManyToOne)(function () { return paciente_entity_1.Paciente; }), (0, typeorm_1.JoinColumn)({ name: 'id_paciente' })];
        _medico_decorators = [(0, typeorm_1.ManyToOne)(function () { return medico_entity_1.Medico; }), (0, typeorm_1.JoinColumn)({ name: 'id_medico' })];
        _fecha_registro_decorators = [(0, typeorm_1.Column)({ type: 'timestamptz', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _nivel_estres_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true })];
        _sintomas_referidos_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true, comment: 'Almacena un array de síntomas como ["Ansiedad", "Insomnio"]' })];
        _narrativa_paciente_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Narrativa del paciente sobre su estado de ánimo.' })];
        _analisis_sentimiento_ia_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, comment: 'Resultado del análisis de sentimiento por IA: Positivo, Negativo, Neutro' })];
        _riesgo_suicida_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'Bandera de alerta para riesgo suicida.' })];
        _derivar_a_psicologia_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'Recomendación de derivar a psicología.' })];
        _notas_profesional_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Notas confidenciales del profesional de la salud.' })];
        __esDecorate(null, null, _id_registro_decorators, { kind: "field", name: "id_registro", static: false, private: false, access: { has: function (obj) { return "id_registro" in obj; }, get: function (obj) { return obj.id_registro; }, set: function (obj, value) { obj.id_registro = value; } }, metadata: _metadata }, _id_registro_initializers, _id_registro_extraInitializers);
        __esDecorate(null, null, _paciente_decorators, { kind: "field", name: "paciente", static: false, private: false, access: { has: function (obj) { return "paciente" in obj; }, get: function (obj) { return obj.paciente; }, set: function (obj, value) { obj.paciente = value; } }, metadata: _metadata }, _paciente_initializers, _paciente_extraInitializers);
        __esDecorate(null, null, _medico_decorators, { kind: "field", name: "medico", static: false, private: false, access: { has: function (obj) { return "medico" in obj; }, get: function (obj) { return obj.medico; }, set: function (obj, value) { obj.medico = value; } }, metadata: _metadata }, _medico_initializers, _medico_extraInitializers);
        __esDecorate(null, null, _fecha_registro_decorators, { kind: "field", name: "fecha_registro", static: false, private: false, access: { has: function (obj) { return "fecha_registro" in obj; }, get: function (obj) { return obj.fecha_registro; }, set: function (obj, value) { obj.fecha_registro = value; } }, metadata: _metadata }, _fecha_registro_initializers, _fecha_registro_extraInitializers);
        __esDecorate(null, null, _nivel_estres_decorators, { kind: "field", name: "nivel_estres", static: false, private: false, access: { has: function (obj) { return "nivel_estres" in obj; }, get: function (obj) { return obj.nivel_estres; }, set: function (obj, value) { obj.nivel_estres = value; } }, metadata: _metadata }, _nivel_estres_initializers, _nivel_estres_extraInitializers);
        __esDecorate(null, null, _sintomas_referidos_decorators, { kind: "field", name: "sintomas_referidos", static: false, private: false, access: { has: function (obj) { return "sintomas_referidos" in obj; }, get: function (obj) { return obj.sintomas_referidos; }, set: function (obj, value) { obj.sintomas_referidos = value; } }, metadata: _metadata }, _sintomas_referidos_initializers, _sintomas_referidos_extraInitializers);
        __esDecorate(null, null, _narrativa_paciente_decorators, { kind: "field", name: "narrativa_paciente", static: false, private: false, access: { has: function (obj) { return "narrativa_paciente" in obj; }, get: function (obj) { return obj.narrativa_paciente; }, set: function (obj, value) { obj.narrativa_paciente = value; } }, metadata: _metadata }, _narrativa_paciente_initializers, _narrativa_paciente_extraInitializers);
        __esDecorate(null, null, _analisis_sentimiento_ia_decorators, { kind: "field", name: "analisis_sentimiento_ia", static: false, private: false, access: { has: function (obj) { return "analisis_sentimiento_ia" in obj; }, get: function (obj) { return obj.analisis_sentimiento_ia; }, set: function (obj, value) { obj.analisis_sentimiento_ia = value; } }, metadata: _metadata }, _analisis_sentimiento_ia_initializers, _analisis_sentimiento_ia_extraInitializers);
        __esDecorate(null, null, _riesgo_suicida_decorators, { kind: "field", name: "riesgo_suicida", static: false, private: false, access: { has: function (obj) { return "riesgo_suicida" in obj; }, get: function (obj) { return obj.riesgo_suicida; }, set: function (obj, value) { obj.riesgo_suicida = value; } }, metadata: _metadata }, _riesgo_suicida_initializers, _riesgo_suicida_extraInitializers);
        __esDecorate(null, null, _derivar_a_psicologia_decorators, { kind: "field", name: "derivar_a_psicologia", static: false, private: false, access: { has: function (obj) { return "derivar_a_psicologia" in obj; }, get: function (obj) { return obj.derivar_a_psicologia; }, set: function (obj, value) { obj.derivar_a_psicologia = value; } }, metadata: _metadata }, _derivar_a_psicologia_initializers, _derivar_a_psicologia_extraInitializers);
        __esDecorate(null, null, _notas_profesional_decorators, { kind: "field", name: "notas_profesional", static: false, private: false, access: { has: function (obj) { return "notas_profesional" in obj; }, get: function (obj) { return obj.notas_profesional; }, set: function (obj, value) { obj.notas_profesional = value; } }, metadata: _metadata }, _notas_profesional_initializers, _notas_profesional_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegistroPsicosocial = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegistroPsicosocial = _classThis;
}();
exports.RegistroPsicosocial = RegistroPsicosocial;
