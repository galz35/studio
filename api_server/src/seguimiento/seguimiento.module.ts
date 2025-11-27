import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeguimientoController } from 'src/seguimiento/seguimiento.controller';
import { SeguimientoService } from 'src/seguimiento/seguimiento.service';
import { Seguimiento } from '../entities/seguimiento.entity';
import { CasoClinico } from '../entities/caso-clinico.entity';
import { Paciente } from '../entities/paciente.entity';
import { AtencionMedica } from '../entities/atencion-medica.entity';
import { Usuario } from '../entities/usuario.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Seguimiento, CasoClinico, Paciente, AtencionMedica, Usuario]),
    ],
    controllers: [SeguimientoController],
    providers: [SeguimientoService],
})
export class SeguimientoModule { }
