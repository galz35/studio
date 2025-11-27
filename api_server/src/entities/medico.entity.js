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
exports.Medico = void 0;
var typeorm_1 = require("typeorm");
var usuario_entity_1 = require("./usuario.entity");
var cita_medica_entity_1 = require("./cita-medica.entity");
var Medico = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('medicos')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_medico_decorators;
    var _id_medico_initializers = [];
    var _id_medico_extraInitializers = [];
    var _carnet_decorators;
    var _carnet_initializers = [];
    var _carnet_extraInitializers = [];
    var _nombre_completo_decorators;
    var _nombre_completo_initializers = [];
    var _nombre_completo_extraInitializers = [];
    var _especialidad_decorators;
    var _especialidad_initializers = [];
    var _especialidad_extraInitializers = [];
    var _tipo_medico_decorators;
    var _tipo_medico_initializers = [];
    var _tipo_medico_extraInitializers = [];
    var _correo_decorators;
    var _correo_initializers = [];
    var _correo_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _estado_medico_decorators;
    var _estado_medico_initializers = [];
    var _estado_medico_extraInitializers = [];
    var _usuario_decorators;
    var _usuario_initializers = [];
    var _usuario_extraInitializers = [];
    var _citas_medicas_decorators;
    var _citas_medicas_initializers = [];
    var _citas_medicas_extraInitializers = [];
    var Medico = _classThis = /** @class */ (function () {
        function Medico_1() {
            this.id_medico = __runInitializers(this, _id_medico_initializers, void 0);
            this.carnet = (__runInitializers(this, _id_medico_extraInitializers), __runInitializers(this, _carnet_initializers, void 0)); // Opcional para médicos externos
            this.nombre_completo = (__runInitializers(this, _carnet_extraInitializers), __runInitializers(this, _nombre_completo_initializers, void 0));
            this.especialidad = (__runInitializers(this, _nombre_completo_extraInitializers), __runInitializers(this, _especialidad_initializers, void 0));
            this.tipo_medico = (__runInitializers(this, _especialidad_extraInitializers), __runInitializers(this, _tipo_medico_initializers, void 0));
            this.correo = (__runInitializers(this, _tipo_medico_extraInitializers), __runInitializers(this, _correo_initializers, void 0));
            this.telefono = (__runInitializers(this, _correo_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
            this.estado_medico = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _estado_medico_initializers, void 0)); // A: Activo, I: Inactivo
            // Relaciones
            this.usuario = (__runInitializers(this, _estado_medico_extraInitializers), __runInitializers(this, _usuario_initializers, void 0));
            this.citas_medicas = (__runInitializers(this, _usuario_extraInitializers), __runInitializers(this, _citas_medicas_initializers, void 0));
            __runInitializers(this, _citas_medicas_extraInitializers);
        }
        return Medico_1;
    }());
    __setFunctionName(_classThis, "Medico");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_medico_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _carnet_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, nullable: true })];
        _nombre_completo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _especialidad_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _tipo_medico_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['INTERNO', 'EXTERNO'] })];
        _correo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _telefono_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true })];
        _estado_medico_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A' })];
        _usuario_decorators = [(0, typeorm_1.OneToOne)(function () { return usuario_entity_1.Usuario; }, function (usuario) { return usuario.medico; })];
        _citas_medicas_decorators = [(0, typeorm_1.OneToMany)(function () { return cita_medica_entity_1.CitaMedica; }, function (cita) { return cita.medico; })];
        __esDecorate(null, null, _id_medico_decorators, { kind: "field", name: "id_medico", static: false, private: false, access: { has: function (obj) { return "id_medico" in obj; }, get: function (obj) { return obj.id_medico; }, set: function (obj, value) { obj.id_medico = value; } }, metadata: _metadata }, _id_medico_initializers, _id_medico_extraInitializers);
        __esDecorate(null, null, _carnet_decorators, { kind: "field", name: "carnet", static: false, private: false, access: { has: function (obj) { return "carnet" in obj; }, get: function (obj) { return obj.carnet; }, set: function (obj, value) { obj.carnet = value; } }, metadata: _metadata }, _carnet_initializers, _carnet_extraInitializers);
        __esDecorate(null, null, _nombre_completo_decorators, { kind: "field", name: "nombre_completo", static: false, private: false, access: { has: function (obj) { return "nombre_completo" in obj; }, get: function (obj) { return obj.nombre_completo; }, set: function (obj, value) { obj.nombre_completo = value; } }, metadata: _metadata }, _nombre_completo_initializers, _nombre_completo_extraInitializers);
        __esDecorate(null, null, _especialidad_decorators, { kind: "field", name: "especialidad", static: false, private: false, access: { has: function (obj) { return "especialidad" in obj; }, get: function (obj) { return obj.especialidad; }, set: function (obj, value) { obj.especialidad = value; } }, metadata: _metadata }, _especialidad_initializers, _especialidad_extraInitializers);
        __esDecorate(null, null, _tipo_medico_decorators, { kind: "field", name: "tipo_medico", static: false, private: false, access: { has: function (obj) { return "tipo_medico" in obj; }, get: function (obj) { return obj.tipo_medico; }, set: function (obj, value) { obj.tipo_medico = value; } }, metadata: _metadata }, _tipo_medico_initializers, _tipo_medico_extraInitializers);
        __esDecorate(null, null, _correo_decorators, { kind: "field", name: "correo", static: false, private: false, access: { has: function (obj) { return "correo" in obj; }, get: function (obj) { return obj.correo; }, set: function (obj, value) { obj.correo = value; } }, metadata: _metadata }, _correo_initializers, _correo_extraInitializers);
        __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
        __esDecorate(null, null, _estado_medico_decorators, { kind: "field", name: "estado_medico", static: false, private: false, access: { has: function (obj) { return "estado_medico" in obj; }, get: function (obj) { return obj.estado_medico; }, set: function (obj, value) { obj.estado_medico = value; } }, metadata: _metadata }, _estado_medico_initializers, _estado_medico_extraInitializers);
        __esDecorate(null, null, _usuario_decorators, { kind: "field", name: "usuario", static: false, private: false, access: { has: function (obj) { return "usuario" in obj; }, get: function (obj) { return obj.usuario; }, set: function (obj, value) { obj.usuario = value; } }, metadata: _metadata }, _usuario_initializers, _usuario_extraInitializers);
        __esDecorate(null, null, _citas_medicas_decorators, { kind: "field", name: "citas_medicas", static: false, private: false, access: { has: function (obj) { return "citas_medicas" in obj; }, get: function (obj) { return obj.citas_medicas; }, set: function (obj, value) { obj.citas_medicas = value; } }, metadata: _metadata }, _citas_medicas_initializers, _citas_medicas_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Medico = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Medico = _classThis;
}();
exports.Medico = Medico;
