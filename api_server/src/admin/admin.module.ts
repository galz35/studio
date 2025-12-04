import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';
import { CitaMedica } from '../entities/cita-medica.entity';
import { Empleado } from '../entities/empleado.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Medico, Paciente, CitaMedica, Empleado, AtencionMedica]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
