import { SeguimientoService } from 'src/seguimiento/seguimiento.service';
import { Seguimiento } from '../entities/seguimiento.entity';
export declare class SeguimientoController {
    private readonly seguimientoService;
    constructor(seguimientoService: SeguimientoService);
    create(createSeguimientoDto: any): Promise<Seguimiento[]>;
    findAll(): Promise<Seguimiento[]>;
    findOne(id: string): Promise<Seguimiento | null>;
    update(id: string, updateSeguimientoDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
