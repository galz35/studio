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
exports.Paciente = void 0;
var typeorm_1 = require("typeorm");
var usuario_entity_1 = require("./usuario.entity");
var caso_clinico_entity_1 = require("./caso-clinico.entity");
var Paciente = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('pacientes')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_paciente_decorators;
    var _id_paciente_initializers = [];
    var _id_paciente_extraInitializers = [];
    var _carnet_decorators;
    var _carnet_initializers = [];
    var _carnet_extraInitializers = [];
    var _nombre_completo_decorators;
    var _nombre_completo_initializers = [];
    var _nombre_completo_extraInitializers = [];
    var _fecha_nacimiento_decorators;
    var _fecha_nacimiento_initializers = [];
    var _fecha_nacimiento_extraInitializers = [];
    var _sexo_decorators;
    var _sexo_initializers = [];
    var _sexo_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _correo_decorators;
    var _correo_initializers = [];
    var _correo_extraInitializers = [];
    var _gerencia_decorators;
    var _gerencia_initializers = [];
    var _gerencia_extraInitializers = [];
    var _area_decorators;
    var _area_initializers = [];
    var _area_extraInitializers = [];
    var _estado_paciente_decorators;
    var _estado_paciente_initializers = [];
    var _estado_paciente_extraInitializers = [];
    var _nivel_semaforo_decorators;
    var _nivel_semaforo_initializers = [];
    var _nivel_semaforo_extraInitializers = [];
    var _usuario_decorators;
    var _usuario_initializers = [];
    var _usuario_extraInitializers = [];
    var _casos_clinicos_decorators;
    var _casos_clinicos_initializers = [];
    var _casos_clinicos_extraInitializers = [];
    var Paciente = _classThis = /** @class */ (function () {
        function Paciente_1() {
            this.id_paciente = __runInitializers(this, _id_paciente_initializers, void 0);
            this.carnet = (__runInitializers(this, _id_paciente_extraInitializers), __runInitializers(this, _carnet_initializers, void 0));
            this.nombre_completo = (__runInitializers(this, _carnet_extraInitializers), __runInitializers(this, _nombre_completo_initializers, void 0));
            this.fecha_nacimiento = (__runInitializers(this, _nombre_completo_extraInitializers), __runInitializers(this, _fecha_nacimiento_initializers, void 0));
            this.sexo = (__runInitializers(this, _fecha_nacimiento_extraInitializers), __runInitializers(this, _sexo_initializers, void 0));
            this.telefono = (__runInitializers(this, _sexo_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
            this.correo = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _correo_initializers, void 0));
            this.gerencia = (__runInitializers(this, _correo_extraInitializers), __runInitializers(this, _gerencia_initializers, void 0));
            this.area = (__runInitializers(this, _gerencia_extraInitializers), __runInitializers(this, _area_initializers, void 0));
            this.estado_paciente = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _estado_paciente_initializers, void 0)); // A: Activo, I: Inactivo
            this.nivel_semaforo = (__runInitializers(this, _estado_paciente_extraInitializers), __runInitializers(this, _nivel_semaforo_initializers, void 0));
            // Relaciones
            this.usuario = (__runInitializers(this, _nivel_semaforo_extraInitializers), __runInitializers(this, _usuario_initializers, void 0));
            this.casos_clinicos = (__runInitializers(this, _usuario_extraInitializers), __runInitializers(this, _casos_clinicos_initializers, void 0));
            __runInitializers(this, _casos_clinicos_extraInitializers);
        }
        return Paciente_1;
    }());
    __setFunctionName(_classThis, "Paciente");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_paciente_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _carnet_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true })];
        _nombre_completo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _fecha_nacimiento_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _sexo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true })];
        _telefono_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true })];
        _correo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _gerencia_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _area_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _estado_paciente_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A' })];
        _nivel_semaforo_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1, nullable: true, comment: 'Nivel de semáforo: V, A, R' })];
        _usuario_decorators = [(0, typeorm_1.OneToOne)(function () { return usuario_entity_1.Usuario; }, function (usuario) { return usuario.paciente; })];
        _casos_clinicos_decorators = [(0, typeorm_1.OneToMany)(function () { return caso_clinico_entity_1.CasoClinico; }, function (caso) { return caso.paciente; })];
        __esDecorate(null, null, _id_paciente_decorators, { kind: "field", name: "id_paciente", static: false, private: false, access: { has: function (obj) { return "id_paciente" in obj; }, get: function (obj) { return obj.id_paciente; }, set: function (obj, value) { obj.id_paciente = value; } }, metadata: _metadata }, _id_paciente_initializers, _id_paciente_extraInitializers);
        __esDecorate(null, null, _carnet_decorators, { kind: "field", name: "carnet", static: false, private: false, access: { has: function (obj) { return "carnet" in obj; }, get: function (obj) { return obj.carnet; }, set: function (obj, value) { obj.carnet = value; } }, metadata: _metadata }, _carnet_initializers, _carnet_extraInitializers);
        __esDecorate(null, null, _nombre_completo_decorators, { kind: "field", name: "nombre_completo", static: false, private: false, access: { has: function (obj) { return "nombre_completo" in obj; }, get: function (obj) { return obj.nombre_completo; }, set: function (obj, value) { obj.nombre_completo = value; } }, metadata: _metadata }, _nombre_completo_initializers, _nombre_completo_extraInitializers);
        __esDecorate(null, null, _fecha_nacimiento_decorators, { kind: "field", name: "fecha_nacimiento", static: false, private: false, access: { has: function (obj) { return "fecha_nacimiento" in obj; }, get: function (obj) { return obj.fecha_nacimiento; }, set: function (obj, value) { obj.fecha_nacimiento = value; } }, metadata: _metadata }, _fecha_nacimiento_initializers, _fecha_nacimiento_extraInitializers);
        __esDecorate(null, null, _sexo_decorators, { kind: "field", name: "sexo", static: false, private: false, access: { has: function (obj) { return "sexo" in obj; }, get: function (obj) { return obj.sexo; }, set: function (obj, value) { obj.sexo = value; } }, metadata: _metadata }, _sexo_initializers, _sexo_extraInitializers);
        __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
        __esDecorate(null, null, _correo_decorators, { kind: "field", name: "correo", static: false, private: false, access: { has: function (obj) { return "correo" in obj; }, get: function (obj) { return obj.correo; }, set: function (obj, value) { obj.correo = value; } }, metadata: _metadata }, _correo_initializers, _correo_extraInitializers);
        __esDecorate(null, null, _gerencia_decorators, { kind: "field", name: "gerencia", static: false, private: false, access: { has: function (obj) { return "gerencia" in obj; }, get: function (obj) { return obj.gerencia; }, set: function (obj, value) { obj.gerencia = value; } }, metadata: _metadata }, _gerencia_initializers, _gerencia_extraInitializers);
        __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: function (obj) { return "area" in obj; }, get: function (obj) { return obj.area; }, set: function (obj, value) { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
        __esDecorate(null, null, _estado_paciente_decorators, { kind: "field", name: "estado_paciente", static: false, private: false, access: { has: function (obj) { return "estado_paciente" in obj; }, get: function (obj) { return obj.estado_paciente; }, set: function (obj, value) { obj.estado_paciente = value; } }, metadata: _metadata }, _estado_paciente_initializers, _estado_paciente_extraInitializers);
        __esDecorate(null, null, _nivel_semaforo_decorators, { kind: "field", name: "nivel_semaforo", static: false, private: false, access: { has: function (obj) { return "nivel_semaforo" in obj; }, get: function (obj) { return obj.nivel_semaforo; }, set: function (obj, value) { obj.nivel_semaforo = value; } }, metadata: _metadata }, _nivel_semaforo_initializers, _nivel_semaforo_extraInitializers);
        __esDecorate(null, null, _usuario_decorators, { kind: "field", name: "usuario", static: false, private: false, access: { has: function (obj) { return "usuario" in obj; }, get: function (obj) { return obj.usuario; }, set: function (obj, value) { obj.usuario = value; } }, metadata: _metadata }, _usuario_initializers, _usuario_extraInitializers);
        __esDecorate(null, null, _casos_clinicos_decorators, { kind: "field", name: "casos_clinicos", static: false, private: false, access: { has: function (obj) { return "casos_clinicos" in obj; }, get: function (obj) { return obj.casos_clinicos; }, set: function (obj, value) { obj.casos_clinicos = value; } }, metadata: _metadata }, _casos_clinicos_initializers, _casos_clinicos_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Paciente = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Paciente = _classThis;
}();
exports.Paciente = Paciente;
