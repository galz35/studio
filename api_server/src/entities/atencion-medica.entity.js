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
exports.AtencionMedica = void 0;
var typeorm_1 = require("typeorm");
var cita_medica_entity_1 = require("./cita-medica.entity");
var medico_entity_1 = require("./medico.entity");
var AtencionMedica = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('atenciones_medicas')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_atencion_decorators;
    var _id_atencion_initializers = [];
    var _id_atencion_extraInitializers = [];
    var _cita_decorators;
    var _cita_initializers = [];
    var _cita_extraInitializers = [];
    var _medico_decorators;
    var _medico_initializers = [];
    var _medico_extraInitializers = [];
    var _fecha_atencion_decorators;
    var _fecha_atencion_initializers = [];
    var _fecha_atencion_extraInitializers = [];
    var _diagnostico_principal_decorators;
    var _diagnostico_principal_initializers = [];
    var _diagnostico_principal_extraInitializers = [];
    var _plan_tratamiento_decorators;
    var _plan_tratamiento_initializers = [];
    var _plan_tratamiento_extraInitializers = [];
    var _recomendaciones_decorators;
    var _recomendaciones_initializers = [];
    var _recomendaciones_extraInitializers = [];
    var _requiere_seguimiento_decorators;
    var _requiere_seguimiento_initializers = [];
    var _requiere_seguimiento_extraInitializers = [];
    var _fecha_siguiente_cita_decorators;
    var _fecha_siguiente_cita_initializers = [];
    var _fecha_siguiente_cita_extraInitializers = [];
    var _peso_kg_decorators;
    var _peso_kg_initializers = [];
    var _peso_kg_extraInitializers = [];
    var _altura_m_decorators;
    var _altura_m_initializers = [];
    var _altura_m_extraInitializers = [];
    var _presion_arterial_decorators;
    var _presion_arterial_initializers = [];
    var _presion_arterial_extraInitializers = [];
    var AtencionMedica = _classThis = /** @class */ (function () {
        function AtencionMedica_1() {
            this.id_atencion = __runInitializers(this, _id_atencion_initializers, void 0);
            this.cita = (__runInitializers(this, _id_atencion_extraInitializers), __runInitializers(this, _cita_initializers, void 0));
            this.medico = (__runInitializers(this, _cita_extraInitializers), __runInitializers(this, _medico_initializers, void 0));
            this.fecha_atencion = (__runInitializers(this, _medico_extraInitializers), __runInitializers(this, _fecha_atencion_initializers, void 0));
            this.diagnostico_principal = (__runInitializers(this, _fecha_atencion_extraInitializers), __runInitializers(this, _diagnostico_principal_initializers, void 0));
            this.plan_tratamiento = (__runInitializers(this, _diagnostico_principal_extraInitializers), __runInitializers(this, _plan_tratamiento_initializers, void 0));
            this.recomendaciones = (__runInitializers(this, _plan_tratamiento_extraInitializers), __runInitializers(this, _recomendaciones_initializers, void 0));
            this.requiere_seguimiento = (__runInitializers(this, _recomendaciones_extraInitializers), __runInitializers(this, _requiere_seguimiento_initializers, void 0));
            this.fecha_siguiente_cita = (__runInitializers(this, _requiere_seguimiento_extraInitializers), __runInitializers(this, _fecha_siguiente_cita_initializers, void 0));
            // Otros campos del formulario...
            this.peso_kg = (__runInitializers(this, _fecha_siguiente_cita_extraInitializers), __runInitializers(this, _peso_kg_initializers, void 0));
            this.altura_m = (__runInitializers(this, _peso_kg_extraInitializers), __runInitializers(this, _altura_m_initializers, void 0));
            this.presion_arterial = (__runInitializers(this, _altura_m_extraInitializers), __runInitializers(this, _presion_arterial_initializers, void 0)); // "120/80"
            __runInitializers(this, _presion_arterial_extraInitializers);
        }
        return AtencionMedica_1;
    }());
    __setFunctionName(_classThis, "AtencionMedica");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_atencion_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _cita_decorators = [(0, typeorm_1.OneToOne)(function () { return cita_medica_entity_1.CitaMedica; }, function (cita) { return cita.atencion_medica; }), (0, typeorm_1.JoinColumn)({ name: 'id_cita' })];
        _medico_decorators = [(0, typeorm_1.ManyToOne)(function () { return medico_entity_1.Medico; }), (0, typeorm_1.JoinColumn)({ name: 'id_medico' })];
        _fecha_atencion_decorators = [(0, typeorm_1.Column)({ type: 'timestamptz', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _diagnostico_principal_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _plan_tratamiento_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _recomendaciones_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _requiere_seguimiento_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _fecha_siguiente_cita_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _peso_kg_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true })];
        _altura_m_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true })];
        _presion_arterial_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true })];
        __esDecorate(null, null, _id_atencion_decorators, { kind: "field", name: "id_atencion", static: false, private: false, access: { has: function (obj) { return "id_atencion" in obj; }, get: function (obj) { return obj.id_atencion; }, set: function (obj, value) { obj.id_atencion = value; } }, metadata: _metadata }, _id_atencion_initializers, _id_atencion_extraInitializers);
        __esDecorate(null, null, _cita_decorators, { kind: "field", name: "cita", static: false, private: false, access: { has: function (obj) { return "cita" in obj; }, get: function (obj) { return obj.cita; }, set: function (obj, value) { obj.cita = value; } }, metadata: _metadata }, _cita_initializers, _cita_extraInitializers);
        __esDecorate(null, null, _medico_decorators, { kind: "field", name: "medico", static: false, private: false, access: { has: function (obj) { return "medico" in obj; }, get: function (obj) { return obj.medico; }, set: function (obj, value) { obj.medico = value; } }, metadata: _metadata }, _medico_initializers, _medico_extraInitializers);
        __esDecorate(null, null, _fecha_atencion_decorators, { kind: "field", name: "fecha_atencion", static: false, private: false, access: { has: function (obj) { return "fecha_atencion" in obj; }, get: function (obj) { return obj.fecha_atencion; }, set: function (obj, value) { obj.fecha_atencion = value; } }, metadata: _metadata }, _fecha_atencion_initializers, _fecha_atencion_extraInitializers);
        __esDecorate(null, null, _diagnostico_principal_decorators, { kind: "field", name: "diagnostico_principal", static: false, private: false, access: { has: function (obj) { return "diagnostico_principal" in obj; }, get: function (obj) { return obj.diagnostico_principal; }, set: function (obj, value) { obj.diagnostico_principal = value; } }, metadata: _metadata }, _diagnostico_principal_initializers, _diagnostico_principal_extraInitializers);
        __esDecorate(null, null, _plan_tratamiento_decorators, { kind: "field", name: "plan_tratamiento", static: false, private: false, access: { has: function (obj) { return "plan_tratamiento" in obj; }, get: function (obj) { return obj.plan_tratamiento; }, set: function (obj, value) { obj.plan_tratamiento = value; } }, metadata: _metadata }, _plan_tratamiento_initializers, _plan_tratamiento_extraInitializers);
        __esDecorate(null, null, _recomendaciones_decorators, { kind: "field", name: "recomendaciones", static: false, private: false, access: { has: function (obj) { return "recomendaciones" in obj; }, get: function (obj) { return obj.recomendaciones; }, set: function (obj, value) { obj.recomendaciones = value; } }, metadata: _metadata }, _recomendaciones_initializers, _recomendaciones_extraInitializers);
        __esDecorate(null, null, _requiere_seguimiento_decorators, { kind: "field", name: "requiere_seguimiento", static: false, private: false, access: { has: function (obj) { return "requiere_seguimiento" in obj; }, get: function (obj) { return obj.requiere_seguimiento; }, set: function (obj, value) { obj.requiere_seguimiento = value; } }, metadata: _metadata }, _requiere_seguimiento_initializers, _requiere_seguimiento_extraInitializers);
        __esDecorate(null, null, _fecha_siguiente_cita_decorators, { kind: "field", name: "fecha_siguiente_cita", static: false, private: false, access: { has: function (obj) { return "fecha_siguiente_cita" in obj; }, get: function (obj) { return obj.fecha_siguiente_cita; }, set: function (obj, value) { obj.fecha_siguiente_cita = value; } }, metadata: _metadata }, _fecha_siguiente_cita_initializers, _fecha_siguiente_cita_extraInitializers);
        __esDecorate(null, null, _peso_kg_decorators, { kind: "field", name: "peso_kg", static: false, private: false, access: { has: function (obj) { return "peso_kg" in obj; }, get: function (obj) { return obj.peso_kg; }, set: function (obj, value) { obj.peso_kg = value; } }, metadata: _metadata }, _peso_kg_initializers, _peso_kg_extraInitializers);
        __esDecorate(null, null, _altura_m_decorators, { kind: "field", name: "altura_m", static: false, private: false, access: { has: function (obj) { return "altura_m" in obj; }, get: function (obj) { return obj.altura_m; }, set: function (obj, value) { obj.altura_m = value; } }, metadata: _metadata }, _altura_m_initializers, _altura_m_extraInitializers);
        __esDecorate(null, null, _presion_arterial_decorators, { kind: "field", name: "presion_arterial", static: false, private: false, access: { has: function (obj) { return "presion_arterial" in obj; }, get: function (obj) { return obj.presion_arterial; }, set: function (obj, value) { obj.presion_arterial = value; } }, metadata: _metadata }, _presion_arterial_initializers, _presion_arterial_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AtencionMedica = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AtencionMedica = _classThis;
}();
exports.AtencionMedica = AtencionMedica;
