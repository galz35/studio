"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("../entities/usuario.entity");
const medico_entity_1 = require("../entities/medico.entity");
const paciente_entity_1 = require("../entities/paciente.entity");
const cita_medica_entity_1 = require("../entities/cita-medica.entity");
const crear_usuario_dto_1 = require("./dto/crear-usuario.dto");
let AdminService = class AdminService {
    constructor(usuariosRepository, medicosRepository, pacientesRepository, citasRepository, dataSource) {
        this.usuariosRepository = usuariosRepository;
        this.medicosRepository = medicosRepository;
        this.pacientesRepository = pacientesRepository;
        this.citasRepository = citasRepository;
        this.dataSource = dataSource;
    }
    async getDashboardStats(pais) {
        const totalUsuarios = await this.usuariosRepository.count({ where: { pais, estado: 'A' } });
        const medicosActivos = await this.medicosRepository.createQueryBuilder('medico')
            .innerJoin('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .andWhere('medico.estado_medico = :estado', { estado: 'A' })
            .getCount();
    }
    async crearUsuario(crearUsuarioDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { password, ...userData } = crearUsuarioDto;
            const salt = await bcrypt.genSalt();
            const password_hash = await bcrypt.hash(password, salt);
            const nuevoUsuario = queryRunner.manager.create(usuario_entity_1.Usuario, {
                ...userData,
                password_hash,
            });
            await queryRunner.manager.save(nuevoUsuario);
            if (crearUsuarioDto.rol === crear_usuario_dto_1.Rol.PACIENTE) {
                const nuevoPaciente = queryRunner.manager.create(paciente_entity_1.Paciente, {
                    carnet: userData.carnet,
                    nombre_completo: userData.nombreCompleto,
                    correo: userData.correo,
                    estado_paciente: 'A',
                    nivel_semaforo: 'V',
                });
                await queryRunner.manager.save(nuevoPaciente);
                nuevoUsuario.paciente = nuevoPaciente;
                await queryRunner.manager.save(nuevoUsuario);
            }
            else if (crearUsuarioDto.rol === crear_usuario_dto_1.Rol.MEDICO) {
                const nuevoMedico = queryRunner.manager.create(medico_entity_1.Medico, {
                    carnet: userData.carnet,
                    nombre_completo: userData.nombreCompleto,
                    correo: userData.correo,
                    tipo_medico: 'INTERNO',
                    estado_medico: 'A',
                });
                await queryRunner.manager.save(nuevoMedico);
                nuevoUsuario.medico = nuevoMedico;
                await queryRunner.manager.save(nuevoUsuario);
            }
            await queryRunner.commitTransaction();
            const { password_hash: _, ...result } = nuevoUsuario;
            return result;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            if (err.code === '23505') {
                throw new common_1.ConflictException('El carnet o correo ya existe');
            }
            throw new common_1.InternalServerErrorException('Error al crear usuario');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getUsuarios(pais) {
        return this.usuariosRepository.find({ where: { pais } });
    }
    async getMedicos(pais) {
        return this.medicosRepository.createQueryBuilder('medico')
            .innerJoinAndSelect('medico.usuario', 'usuario')
            .where('usuario.pais = :pais', { pais })
            .getMany();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(medico_entity_1.Medico)),
    __param(2, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __param(3, (0, typeorm_1.InjectRepository)(cita_medica_entity_1.CitaMedica)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map