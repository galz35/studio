import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seguimiento } from '../entities/seguimiento.entity';

@Injectable()
export class SeguimientoService {
    constructor(
        @InjectRepository(Seguimiento)
        private seguimientoRepository: Repository<Seguimiento>,
    ) { }

    create(createSeguimientoDto: any) {
        // TODO: Implement proper DTO and validation
        const seguimiento = this.seguimientoRepository.create(createSeguimientoDto);
        return this.seguimientoRepository.save(seguimiento);
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
