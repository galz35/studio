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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteService = void 0;
var common_1 = require("@nestjs/common");
var paciente_entity_1 = require("../entities/paciente.entity");
var chequeo_bienestar_entity_1 = require("../entities/chequeo-bienestar.entity");
var caso_clinico_entity_1 = require("../entities/caso-clinico.entity");
var PacienteService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PacienteService = _classThis = /** @class */ (function () {
        function PacienteService_1(pacientesRepository, citasRepository, chequeosRepository, casosRepository, dataSource) {
            this.pacientesRepository = pacientesRepository;
            this.citasRepository = citasRepository;
            this.chequeosRepository = chequeosRepository;
            this.casosRepository = casosRepository;
            this.dataSource = dataSource;
        }
        PacienteService_1.prototype.getDashboardStats = function (idPaciente) {
            return __awaiter(this, void 0, void 0, function () {
                var paciente, proximaCita;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.pacientesRepository.findOne({ where: { id_paciente: idPaciente } })];
                        case 1:
                            paciente = _a.sent();
                            return [4 /*yield*/, this.citasRepository.findOne({
                                    where: {
                                        paciente: { id_paciente: idPaciente },
                                        estado_cita: 'PROGRAMADA' // or 'CONFIRMADA'
                                    },
                                    order: { fecha_cita: 'ASC', hora_cita: 'ASC' },
                                    relations: ['medico']
                                })];
                        case 2:
                            proximaCita = _a.sent();
                            return [2 /*return*/, {
                                    nivelSemaforo: paciente === null || paciente === void 0 ? void 0 : paciente.nivel_semaforo,
                                    proximaCita: proximaCita,
                                }];
                    }
                });
            });
        };
        PacienteService_1.prototype.solicitarCita = function (idPaciente, solicitudDto) {
            return __awaiter(this, void 0, void 0, function () {
                var queryRunner, paciente, nuevoChequeo, count, codigo, nuevoCaso, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            queryRunner = this.dataSource.createQueryRunner();
                            return [4 /*yield*/, queryRunner.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, queryRunner.startTransaction()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 10, 12, 14]);
                            return [4 /*yield*/, queryRunner.manager.findOne(paciente_entity_1.Paciente, { where: { id_paciente: idPaciente } })];
                        case 4:
                            paciente = _a.sent();
                            if (!paciente)
                                throw new Error('Paciente no encontrado');
                            nuevoChequeo = queryRunner.manager.create(chequeo_bienestar_entity_1.ChequeoBienestar, {
                                paciente: paciente,
                                nivel_semaforo: paciente.nivel_semaforo || 'V', // Default or calculated
                                datos_completos: solicitudDto.datosCompletos,
                            });
                            return [4 /*yield*/, queryRunner.manager.save(nuevoChequeo)];
                        case 5:
                            _a.sent();
                            if (!(solicitudDto.ruta === 'consulta')) return [3 /*break*/, 8];
                            return [4 /*yield*/, queryRunner.manager.count(caso_clinico_entity_1.CasoClinico)];
                        case 6:
                            count = _a.sent();
                            codigo = "CC-".concat(new Date().getFullYear(), "-").concat((count + 1).toString().padStart(5, '0'));
                            nuevoCaso = queryRunner.manager.create(caso_clinico_entity_1.CasoClinico, {
                                codigo_caso: codigo,
                                paciente: paciente,
                                estado_caso: 'Abierto',
                                nivel_semaforo: paciente.nivel_semaforo || 'V', // Should be calculated based on symptoms
                                motivo_consulta: solicitudDto.comentarioGeneral || 'Solicitud de consulta',
                            });
                            return [4 /*yield*/, queryRunner.manager.save(nuevoCaso)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, { message: 'Solicitud procesada con éxito' }];
                        case 10:
                            err_1 = _a.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 11:
                            _a.sent();
                            throw new common_1.InternalServerErrorException('Error al procesar solicitud');
                        case 12: return [4 /*yield*/, queryRunner.release()];
                        case 13:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        PacienteService_1.prototype.getMisCitas = function (idPaciente) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.citasRepository.find({
                            where: { paciente: { id_paciente: idPaciente } },
                            order: { fecha_cita: 'DESC' },
                            relations: ['medico']
                        })];
                });
            });
        };
        return PacienteService_1;
    }());
    __setFunctionName(_classThis, "PacienteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PacienteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PacienteService = _classThis;
}();
exports.PacienteService = PacienteService;
