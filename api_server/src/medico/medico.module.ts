import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoController } from './medico.controller';
import { MedicoService } from './medico.service';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { ExamenMedico } from '../entities/examen-medico.entity';
import { VacunaAplicada } from '../entities/vacuna-aplicada.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { Seguimiento } from '../entities/seguimiento.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CitaMedica, CasoClinico, AtencionMedica, Paciente, Medico, ExamenMedico, VacunaAplicada, ChequeoBienestar, Seguimiento]),
    ],
    controllers: [MedicoController],
    providers: [MedicoService],
})
export class MedicoModule { }
