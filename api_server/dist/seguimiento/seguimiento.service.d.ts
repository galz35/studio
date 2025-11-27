import { Repository } from 'typeorm';
import { Seguimiento } from '../entities/seguimiento.entity';
export declare class SeguimientoService {
    private seguimientoRepository;
    constructor(seguimientoRepository: Repository<Seguimiento>);
    create(createSeguimientoDto: any): Promise<Seguimiento[]>;
    findAll(): Promise<Seguimiento[]>;
    findOne(id: number): Promise<Seguimiento | null>;
    update(id: number, updateSeguimientoDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
