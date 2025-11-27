import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { ChequeoBienestar } from '../entities/chequeo-bienestar.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Paciente, CitaMedica, ChequeoBienestar, CasoClinico]),
    ],
    controllers: [PacienteController],
    providers: [PacienteService],
})
export class PacienteModule { }
