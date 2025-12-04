import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { Seguimiento } from '../entities/seguimiento.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { ExamenMedico } from '../entities/examen-medico.entity';
import { VacunaAplicada } from '../entities/vacuna-aplicada.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Paciente,
            CitaMedica,
            ChequeoBienestar,
            CasoClinico,
            Seguimiento,
            AtencionMedica,
            ExamenMedico,
            VacunaAplicada
        ]),
    ],
    controllers: [PacienteController],
    providers: [PacienteService],
})
export class PacienteModule { }
