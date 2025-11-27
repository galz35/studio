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
exports.ChequeoBienestar = void 0;
var typeorm_1 = require("typeorm");
var paciente_entity_1 = require("./paciente.entity");
var ChequeoBienestar = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('chequeos_bienestar')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_chequeo_decorators;
    var _id_chequeo_initializers = [];
    var _id_chequeo_extraInitializers = [];
    var _paciente_decorators;
    var _paciente_initializers = [];
    var _paciente_extraInitializers = [];
    var _fecha_registro_decorators;
    var _fecha_registro_initializers = [];
    var _fecha_registro_extraInitializers = [];
    var _nivel_semaforo_decorators;
    var _nivel_semaforo_initializers = [];
    var _nivel_semaforo_extraInitializers = [];
    var _datos_completos_decorators;
    var _datos_completos_initializers = [];
    var _datos_completos_extraInitializers = [];
    var ChequeoBienestar = _classThis = /** @class */ (function () {
        function ChequeoBienestar_1() {
            this.id_chequeo = __runInitializers(this, _id_chequeo_initializers, void 0);
            this.paciente = (__runInitializers(this, _id_chequeo_extraInitializers), __runInitializers(this, _paciente_initializers, void 0));
            this.fecha_registro = (__runInitializers(this, _paciente_extraInitializers), __runInitializers(this, _fecha_registro_initializers, void 0));
            this.nivel_semaforo = (__runInitializers(this, _fecha_registro_extraInitializers), __runInitializers(this, _nivel_semaforo_initializers, void 0)); // V, A, R
            // JSONB para almacenar toda la data del wizard (flexible)
            this.datos_completos = (__runInitializers(this, _nivel_semaforo_extraInitializers), __runInitializers(this, _datos_completos_initializers, void 0));
            __runInitializers(this, _datos_completos_extraInitializers);
        }
        return ChequeoBienestar_1;
    }());
    __setFunctionName(_classThis, "ChequeoBienestar");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_chequeo_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _paciente_decorators = [(0, typeorm_1.ManyToOne)(function () { return paciente_entity_1.Paciente; }), (0, typeorm_1.JoinColumn)({ name: 'id_paciente' })];
        _fecha_registro_decorators = [(0, typeorm_1.Column)({ type: 'timestamptz', default: function () { return 'CURRENT_TIMESTAMP'; } })];
        _nivel_semaforo_decorators = [(0, typeorm_1.Column)({ type: 'char', length: 1 })];
        _datos_completos_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        __esDecorate(null, null, _id_chequeo_decorators, { kind: "field", name: "id_chequeo", static: false, private: false, access: { has: function (obj) { return "id_chequeo" in obj; }, get: function (obj) { return obj.id_chequeo; }, set: function (obj, value) { obj.id_chequeo = value; } }, metadata: _metadata }, _id_chequeo_initializers, _id_chequeo_extraInitializers);
        __esDecorate(null, null, _paciente_decorators, { kind: "field", name: "paciente", static: false, private: false, access: { has: function (obj) { return "paciente" in obj; }, get: function (obj) { return obj.paciente; }, set: function (obj, value) { obj.paciente = value; } }, metadata: _metadata }, _paciente_initializers, _paciente_extraInitializers);
        __esDecorate(null, null, _fecha_registro_decorators, { kind: "field", name: "fecha_registro", static: false, private: false, access: { has: function (obj) { return "fecha_registro" in obj; }, get: function (obj) { return obj.fecha_registro; }, set: function (obj, value) { obj.fecha_registro = value; } }, metadata: _metadata }, _fecha_registro_initializers, _fecha_registro_extraInitializers);
        __esDecorate(null, null, _nivel_semaforo_decorators, { kind: "field", name: "nivel_semaforo", static: false, private: false, access: { has: function (obj) { return "nivel_semaforo" in obj; }, get: function (obj) { return obj.nivel_semaforo; }, set: function (obj, value) { obj.nivel_semaforo = value; } }, metadata: _metadata }, _nivel_semaforo_initializers, _nivel_semaforo_extraInitializers);
        __esDecorate(null, null, _datos_completos_decorators, { kind: "field", name: "datos_completos", static: false, private: false, access: { has: function (obj) { return "datos_completos" in obj; }, get: function (obj) { return obj.datos_completos; }, set: function (obj, value) { obj.datos_completos = value; } }, metadata: _metadata }, _datos_completos_initializers, _datos_completos_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChequeoBienestar = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChequeoBienestar = _classThis;
}();
exports.ChequeoBienestar = ChequeoBienestar;
