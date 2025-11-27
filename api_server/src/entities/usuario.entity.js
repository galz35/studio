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
exports.Usuario = void 0;
var typeorm_1 = require("typeorm");
var paciente_entity_1 = require("./paciente.entity");
var medico_entity_1 = require("./medico.entity");
var Usuario = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('usuarios')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_usuario_decorators;
    var _id_usuario_initializers = [];
    var _id_usuario_extraInitializers = [];
    var _carnet_decorators;
    var _carnet_initializers = [];
    var _carnet_extraInitializers = [];
    var _password_hash_decorators;
    var _password_hash_initializers = [];
    var _password_hash_extraInitializers = [];
    var _nombre_completo_decorators;
    var _nombre_completo_initializers = [];
    var _nombre_completo_extraInitializers = [];
    var _correo_decorators;
    var _correo_initializers = [];
    var _correo_extraInitializers = [];
    var _rol_decorators;
    var _rol_initializers = [];
    var _rol_extraInitializers = [];
    var _pais_decorators;
    var _pais_initializers = [];
    var _pais_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _ultimo_acceso_decorators;
    var _ultimo_acceso_initializers = [];
    var _ultimo_acceso_extraInitializers = [];
    var _paciente_decorators;
    var _paciente_initializers = [];
    var _paciente_extraInitializers = [];
    var _medico_decorators;
    var _medico_initializers = [];
    var _medico_extraInitializers = [];
    var Usuario = _classThis = /** @class */ (function () {
        function Usuario_1() {
            this.id_usuario = __runInitializers(this, _id_usuario_initializers, void 0);
            this.carnet = (__runInitializers(this, _id_usuario_extraInitializers), __runInitializers(this, _carnet_initializers, void 0));
            this.password_hash = (__runInitializers(this, _carnet_extraInitializers), __runInitializers(this, _password_hash_initializers, void 0));
            this.nombre_completo = (__runInitializers(this, _password_hash_extraInitializers), __runInitializers(this, _nombre_completo_initializers, void 0));
            this.correo = (__runInitializers(this, _nombre_completo_extraInitializers), __runInitializers(this, _correo_initializers, void 0));
            this.rol = (__runInitializers(this, _correo_extraInitializers), __runInitializers(this, _rol_initializers, void 0));
            this.pais = (__runInitializers(this, _rol_extraInitializers), __runInitializers(this, _pais_initializers, void 0));
            this.estado = (__runInitializers(this, _pais_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
            this.ultimo_acceso = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _ultimo_acceso_initializers, void 0));
            // Relaciones
            this.paciente = (__runInitializers(this, _ultimo_acceso_extraInitializers), __runInitializers(this, _paciente_initializers, void 0));
            this.medico = (__runInitializers(this, _paciente_extraInitializers), __runInitializers(this, _medico_initializers, void 0));
            __runInitializers(this, _medico_extraInitializers);
        }
        return Usuario_1;
    }());
    __setFunctionName(_classThis, "Usuario");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_usuario_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _carnet_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true, comment: 'Carnet del empleado o identificador único.' })];
        _password_hash_decorators = [(0, typeorm_1.Column)({ type: 'varchar', comment: 'Hash de la contraseña generado con bcrypt.' })];
        _nombre_completo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
        _correo_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
        _rol_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, comment: 'Roles: PACIENTE, MEDICO, ADMIN' })];
        _pais_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 2, comment: 'País del usuario: NI, CR, HN' })];
        _estado_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1, default: 'A', comment: 'Estado: A (Activo), I (Inactivo)' })];
        _ultimo_acceso_decorators = [(0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, comment: 'Fecha y hora del último inicio de sesión.' })];
        _paciente_decorators = [(0, typeorm_1.OneToOne)(function () { return paciente_entity_1.Paciente; }, function (paciente) { return paciente.usuario; }, { nullable: true, cascade: true }), (0, typeorm_1.JoinColumn)({ name: 'id_paciente' })];
        _medico_decorators = [(0, typeorm_1.OneToOne)(function () { return medico_entity_1.Medico; }, function (medico) { return medico.usuario; }, { nullable: true, cascade: true }), (0, typeorm_1.JoinColumn)({ name: 'id_medico' })];
        __esDecorate(null, null, _id_usuario_decorators, { kind: "field", name: "id_usuario", static: false, private: false, access: { has: function (obj) { return "id_usuario" in obj; }, get: function (obj) { return obj.id_usuario; }, set: function (obj, value) { obj.id_usuario = value; } }, metadata: _metadata }, _id_usuario_initializers, _id_usuario_extraInitializers);
        __esDecorate(null, null, _carnet_decorators, { kind: "field", name: "carnet", static: false, private: false, access: { has: function (obj) { return "carnet" in obj; }, get: function (obj) { return obj.carnet; }, set: function (obj, value) { obj.carnet = value; } }, metadata: _metadata }, _carnet_initializers, _carnet_extraInitializers);
        __esDecorate(null, null, _password_hash_decorators, { kind: "field", name: "password_hash", static: false, private: false, access: { has: function (obj) { return "password_hash" in obj; }, get: function (obj) { return obj.password_hash; }, set: function (obj, value) { obj.password_hash = value; } }, metadata: _metadata }, _password_hash_initializers, _password_hash_extraInitializers);
        __esDecorate(null, null, _nombre_completo_decorators, { kind: "field", name: "nombre_completo", static: false, private: false, access: { has: function (obj) { return "nombre_completo" in obj; }, get: function (obj) { return obj.nombre_completo; }, set: function (obj, value) { obj.nombre_completo = value; } }, metadata: _metadata }, _nombre_completo_initializers, _nombre_completo_extraInitializers);
        __esDecorate(null, null, _correo_decorators, { kind: "field", name: "correo", static: false, private: false, access: { has: function (obj) { return "correo" in obj; }, get: function (obj) { return obj.correo; }, set: function (obj, value) { obj.correo = value; } }, metadata: _metadata }, _correo_initializers, _correo_extraInitializers);
        __esDecorate(null, null, _rol_decorators, { kind: "field", name: "rol", static: false, private: false, access: { has: function (obj) { return "rol" in obj; }, get: function (obj) { return obj.rol; }, set: function (obj, value) { obj.rol = value; } }, metadata: _metadata }, _rol_initializers, _rol_extraInitializers);
        __esDecorate(null, null, _pais_decorators, { kind: "field", name: "pais", static: false, private: false, access: { has: function (obj) { return "pais" in obj; }, get: function (obj) { return obj.pais; }, set: function (obj, value) { obj.pais = value; } }, metadata: _metadata }, _pais_initializers, _pais_extraInitializers);
        __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
        __esDecorate(null, null, _ultimo_acceso_decorators, { kind: "field", name: "ultimo_acceso", static: false, private: false, access: { has: function (obj) { return "ultimo_acceso" in obj; }, get: function (obj) { return obj.ultimo_acceso; }, set: function (obj, value) { obj.ultimo_acceso = value; } }, metadata: _metadata }, _ultimo_acceso_initializers, _ultimo_acceso_extraInitializers);
        __esDecorate(null, null, _paciente_decorators, { kind: "field", name: "paciente", static: false, private: false, access: { has: function (obj) { return "paciente" in obj; }, get: function (obj) { return obj.paciente; }, set: function (obj, value) { obj.paciente = value; } }, metadata: _metadata }, _paciente_initializers, _paciente_extraInitializers);
        __esDecorate(null, null, _medico_decorators, { kind: "field", name: "medico", static: false, private: false, access: { has: function (obj) { return "medico" in obj; }, get: function (obj) { return obj.medico; }, set: function (obj, value) { obj.medico = value; } }, metadata: _metadata }, _medico_initializers, _medico_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Usuario = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Usuario = _classThis;
}();
exports.Usuario = Usuario;
