import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoController } from './medico.controller';
import { MedicoService } from './medico.service';
import { CitaMedica } from '../entities/cita-medica.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CitaMedica, CasoClinico, AtencionMedica, Paciente, Medico]),
    ],
    controllers: [MedicoController],
    providers: [MedicoService],
})
export class MedicoModule { }
