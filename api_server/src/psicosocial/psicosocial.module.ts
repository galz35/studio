import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsicosocialController } from './psicosocial.controller';
import { PsicosocialService } from './psicosocial.service';
import { RegistroPsicosocial } from '../entities/registro-psicosocial.entity';
import { Paciente } from '../entities/paciente.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RegistroPsicosocial, Paciente])
    ],
    controllers: [PsicosocialController],
    providers: [PsicosocialService],
    exports: [PsicosocialService]
})
export class PsicosocialModule { }
