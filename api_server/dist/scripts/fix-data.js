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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../src/entities/usuario.entity");
const paciente_entity_1 = require("../src/entities/paciente.entity");
const medico_entity_1 = require("../src/entities/medico.entity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('--- Starting Data Fix Script ---');
    const usuariosRepo = dataSource.getRepository(usuario_entity_1.Usuario);
    const pacientesRepo = dataSource.getRepository(paciente_entity_1.Paciente);
    const medicosRepo = dataSource.getRepository(medico_entity_1.Medico);
    const pacienteCarnet = '500708';
    console.log(`Checking Patient: ${pacienteCarnet}`);
    const usuarioPaciente = await usuariosRepo.findOne({ where: { carnet: pacienteCarnet }, relations: ['paciente'] });
    if (usuarioPaciente) {
        console.log(`User found: ${usuarioPaciente.nombre_completo}`);
        if (!usuarioPaciente.paciente) {
            console.log('User has NO patient linked. Searching for patient profile...');
            const paciente = await pacientesRepo.findOne({ where: { carnet: pacienteCarnet } });
            if (paciente) {
                console.log(`Patient profile found (ID: ${paciente.id_paciente}). Linking...`);
                usuarioPaciente.paciente = paciente;
                await usuariosRepo.save(usuarioPaciente);
                console.log('SUCCESS: Patient linked!');
            }
            else {
                console.error('ERROR: Patient profile NOT found in patients table.');
            }
        }
        else {
            console.log('User already has a patient linked. All good.');
        }
    }
    else {
        console.error('ERROR: User 500708 not found.');
    }
    const medicoCarnet = '000772';
    console.log(`\nChecking Doctor: ${medicoCarnet}`);
    const usuarioMedico = await usuariosRepo.findOne({ where: { carnet: medicoCarnet }, relations: ['medico'] });
    if (usuarioMedico) {
        console.log(`User found: ${usuarioMedico.nombre_completo}`);
        if (!usuarioMedico.medico) {
            console.log('User has NO doctor linked. Searching for doctor profile...');
            const medico = await medicosRepo.findOne({ where: { carnet: medicoCarnet } });
            if (medico) {
                console.log(`Doctor profile found (ID: ${medico.id_medico}). Linking...`);
                usuarioMedico.medico = medico;
                await usuariosRepo.save(usuarioMedico);
                console.log('SUCCESS: Doctor linked!');
            }
            else {
                console.error('ERROR: Doctor profile NOT found in medicos table.');
            }
        }
        else {
            console.log('User already has a doctor linked. All good.');
        }
    }
    else {
        console.error('ERROR: User 000772 not found.');
    }
    console.log('\n--- Fix Script Completed ---');
    await app.close();
}
bootstrap();
//# sourceMappingURL=fix-data.js.map