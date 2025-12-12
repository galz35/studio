
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Usuario } from '../src/entities/usuario.entity';
import { Paciente } from '../src/entities/paciente.entity';
import { Medico } from '../src/entities/medico.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('--- Starting Data Fix Script ---');

    const usuariosRepo = dataSource.getRepository(Usuario);
    const pacientesRepo = dataSource.getRepository(Paciente);
    const medicosRepo = dataSource.getRepository(Medico);

    // 1. Fix Patient 500708
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
            } else {
                console.error('ERROR: Patient profile NOT found in patients table.');
            }
        } else {
            console.log('User already has a patient linked. All good.');
        }
    } else {
        console.error('ERROR: User 500708 not found.');
    }

    // 2. Fix Doctor 000772
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
            } else {
                console.error('ERROR: Doctor profile NOT found in medicos table.');
            }
        } else {
            console.log('User already has a doctor linked. All good.');
        }
    } else {
        console.error('ERROR: User 000772 not found.');
    }

    console.log('\n--- Fix Script Completed ---');
    await app.close();
}

bootstrap();
