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
exports.MedicoService = void 0;
var common_1 = require("@nestjs/common");
var cita_medica_entity_1 = require("../entities/cita-medica.entity");
var caso_clinico_entity_1 = require("../entities/caso-clinico.entity");
var atencion_medica_entity_1 = require("../entities/atencion-medica.entity");
var medico_entity_1 = require("../entities/medico.entity");
var MedicoService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MedicoService = _classThis = /** @class */ (function () {
        function MedicoService_1(citasRepository, casosRepository, atencionesRepository, pacientesRepository, medicosRepository, dataSource) {
            this.citasRepository = citasRepository;
            this.casosRepository = casosRepository;
            this.atencionesRepository = atencionesRepository;
            this.pacientesRepository = pacientesRepository;
            this.medicosRepository = medicosRepository;
            this.dataSource = dataSource;
        }
        MedicoService_1.prototype.getDashboardStats = function (idMedico, pais) {
            return __awaiter(this, void 0, void 0, function () {
                var citasHoy, pacientesEnRojo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.citasRepository.count({
                                where: {
                                    medico: { id_medico: idMedico },
                                    fecha_cita: new Date(), // This might need date formatting depending on DB timezone
                                    estado_cita: 'PROGRAMADA'
                                }
                            })];
                        case 1:
                            citasHoy = _a.sent();
                            return [4 /*yield*/, this.pacientesRepository.count({
                                    where: {
                                        nivel_semaforo: 'R',
                                        usuario: { pais: pais }
                                    },
                                    relations: ['usuario']
                                })];
                        case 2:
                            pacientesEnRojo = _a.sent();
                            return [2 /*return*/, {
                                    citasHoy: citasHoy,
                                    pacientesEnRojo: pacientesEnRojo,
                                }];
                    }
                });
            });
        };
        MedicoService_1.prototype.getAgendaCitas = function (pais) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.casosRepository.find({
                            where: {
                                estado_caso: 'Abierto',
                                paciente: { usuario: { pais: pais } }
                            },
                            relations: ['paciente', 'paciente.usuario']
                        })];
                });
            });
        };
        MedicoService_1.prototype.agendarCita = function (agendarCitaDto) {
            return __awaiter(this, void 0, void 0, function () {
                var queryRunner, caso, medico, nuevaCita, err_1;
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
                            _a.trys.push([3, 9, 11, 13]);
                            return [4 /*yield*/, queryRunner.manager.findOne(caso_clinico_entity_1.CasoClinico, {
                                    where: { id_caso: agendarCitaDto.idCaso },
                                    relations: ['paciente']
                                })];
                        case 4:
                            caso = _a.sent();
                            if (!caso)
                                throw new common_1.NotFoundException('Caso clínico no encontrado');
                            return [4 /*yield*/, queryRunner.manager.findOne(medico_entity_1.Medico, { where: { id_medico: agendarCitaDto.idMedico } })];
                        case 5:
                            medico = _a.sent();
                            if (!medico)
                                throw new common_1.NotFoundException('Médico no encontrado');
                            nuevaCita = this.citasRepository.create({
                                paciente: caso.paciente,
                                medico: medico,
                                caso_clinico: caso,
                                fecha_cita: new Date(agendarCitaDto.fechaCita),
                                hora_cita: agendarCitaDto.horaCita,
                                canal_origen: 'AGENDADA_POR_MEDICO',
                                estado_cita: 'PROGRAMADA',
                                motivo_resumen: caso.motivo_consulta,
                                nivel_semaforo_paciente: caso.nivel_semaforo,
                            });
                            return [4 /*yield*/, queryRunner.manager.save(nuevaCita)];
                        case 6:
                            _a.sent();
                            caso.estado_caso = 'Agendado';
                            caso.cita_principal = nuevaCita;
                            return [4 /*yield*/, queryRunner.manager.save(caso)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 8:
                            _a.sent();
                            return [2 /*return*/, nuevaCita];
                        case 9:
                            err_1 = _a.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 10:
                            _a.sent();
                            throw err_1;
                        case 11: return [4 /*yield*/, queryRunner.release()];
                        case 12:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        MedicoService_1.prototype.crearAtencion = function (crearAtencionDto) {
            return __awaiter(this, void 0, void 0, function () {
                var queryRunner, cita, medico, nuevaAtencion, err_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            queryRunner = this.dataSource.createQueryRunner();
                            return [4 /*yield*/, queryRunner.connect()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, queryRunner.startTransaction()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 11, 13, 15]);
                            return [4 /*yield*/, queryRunner.manager.findOne(cita_medica_entity_1.CitaMedica, {
                                    where: { id_cita: crearAtencionDto.idCita },
                                    relations: ['caso_clinico']
                                })];
                        case 4:
                            cita = _b.sent();
                            if (!cita)
                                throw new common_1.NotFoundException('Cita no encontrada');
                            return [4 /*yield*/, queryRunner.manager.findOne(medico_entity_1.Medico, { where: { id_medico: crearAtencionDto.idMedico } })];
                        case 5:
                            medico = _b.sent();
                            if (!medico)
                                throw new common_1.NotFoundException('Médico no encontrado');
                            nuevaAtencion = new atencion_medica_entity_1.AtencionMedica();
                            nuevaAtencion.cita = cita;
                            nuevaAtencion.medico = medico;
                            nuevaAtencion.diagnostico_principal = crearAtencionDto.diagnosticoPrincipal;
                            nuevaAtencion.plan_tratamiento = crearAtencionDto.planTratamiento || null;
                            nuevaAtencion.recomendaciones = crearAtencionDto.recomendaciones || null;
                            nuevaAtencion.requiere_seguimiento = (_a = crearAtencionDto.requiereSeguimiento) !== null && _a !== void 0 ? _a : false;
                            nuevaAtencion.fecha_siguiente_cita = crearAtencionDto.fechaSiguienteCita ? new Date(crearAtencionDto.fechaSiguienteCita) : null;
                            return [4 /*yield*/, queryRunner.manager.save(nuevaAtencion)];
                        case 6:
                            _b.sent();
                            cita.estado_cita = 'FINALIZADA';
                            return [4 /*yield*/, queryRunner.manager.save(cita)];
                        case 7:
                            _b.sent();
                            if (!cita.caso_clinico) return [3 /*break*/, 9];
                            cita.caso_clinico.estado_caso = 'Cerrado';
                            return [4 /*yield*/, queryRunner.manager.save(cita.caso_clinico)];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9: return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 10:
                            _b.sent();
                            return [2 /*return*/, nuevaAtencion];
                        case 11:
                            err_2 = _b.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 12:
                            _b.sent();
                            throw err_2;
                        case 13: return [4 /*yield*/, queryRunner.release()];
                        case 14:
                            _b.sent();
                            return [7 /*endfinally*/];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        return MedicoService_1;
    }());
    __setFunctionName(_classThis, "MedicoService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MedicoService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MedicoService = _classThis;
}();
exports.MedicoService = MedicoService;
