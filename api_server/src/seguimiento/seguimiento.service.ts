import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seguimiento } from '../entities/seguimiento.entity';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@Injectable()
export class SeguimientoService {
    constructor(
        @InjectRepository(Seguimiento)
        private seguimientoRepository: Repository<Seguimiento>,
    ) { }

    async create(createSeguimientoDto: CreateSeguimientoDto) {
        const nuevoSeguimiento = this.seguimientoRepository.create({
            caso_clinico: { id_caso: createSeguimientoDto.idCaso },
            paciente: { id_paciente: createSeguimientoDto.idPaciente },
            usuario_responsable: { id_usuario: createSeguimientoDto.idUsuarioResponsable },
            atencion_origen: createSeguimientoDto.idAtencionOrigen ? { id_atencion: createSeguimientoDto.idAtencionOrigen } : undefined,
            fecha_programada: new Date(createSeguimientoDto.fechaProgramada),
            tipo_seguimiento: createSeguimientoDto.tipoSeguimiento,
            notas_seguimiento: createSeguimientoDto.notasObjetivo,
            estado_seguimiento: createSeguimientoDto.estadoSeguimiento || 'PENDIENTE',
        });
        return this.seguimientoRepository.save(nuevoSeguimiento);
    }

    findAll() {
        return this.seguimientoRepository.find({
            relations: ['caso_clinico', 'paciente', 'usuario_responsable', 'atencion_origen'],
        });
    }

    findOne(id: number) {
        return this.seguimientoRepository.findOne({
            where: { id_seguimiento: id },
            relations: ['caso_clinico', 'paciente', 'usuario_responsable', 'atencion_origen'],
        });
    }

    update(id: number, updateSeguimientoDto: any) {
        return this.seguimientoRepository.update(id, updateSeguimientoDto);
    }

    remove(id: number) {
        return this.seguimientoRepository.delete(id);
    }
}
