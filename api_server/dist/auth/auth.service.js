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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("../entities/usuario.entity");
let AuthService = class AuthService {
    constructor(usuariosRepository, jwtService) {
        this.usuariosRepository = usuariosRepository;
        this.jwtService = jwtService;
    }
    async validateUser(carnet, pass) {
        const user = await this.usuariosRepository.findOne({
            where: { carnet },
            relations: ['paciente', 'medico']
        });
        if (user && user.estado === 'A' && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.carnet, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        await this.usuariosRepository.update(user.id_usuario, { ultimo_acceso: new Date() });
        const payload = {
            sub: user.id_usuario,
            carnet: user.carnet,
            rol: user.rol,
            pais: user.pais,
            idPaciente: user.paciente?.id_paciente,
            idMedico: user.medico?.id_medico
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async createInitialAdmin() {
        const count = await this.usuariosRepository.count();
        if (count > 0) {
            return { message: 'Ya existen usuarios en la base de datos.' };
        }
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash('admin123', salt);
        const admin = this.usuariosRepository.create({
            carnet: 'ADMIN001',
            password_hash: password_hash,
            nombre_completo: 'Administrador del Sistema',
            correo: 'gustavoadolfolira@gmail.com',
            rol: 'ADMIN',
            pais: 'NI',
            estado: 'A',
            ultimo_acceso: new Date(),
        });
        await this.usuariosRepository.save(admin);
        return { message: 'Usuario ADMIN001 creado exitosamente. Contraseña: admin123' };
    }
    async getProfile(userId) {
        const user = await this.usuariosRepository.findOne({
            where: { id_usuario: userId },
            relations: ['paciente', 'medico']
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        const { password_hash, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map