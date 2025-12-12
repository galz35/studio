import { SeguimientoService } from './seguimiento.service';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
export declare class SeguimientoController {
    private readonly seguimientoService;
    constructor(seguimientoService: SeguimientoService);
    create(createSeguimientoDto: CreateSeguimientoDto): Promise<import("../entities/seguimiento.entity").Seguimiento>;
    findAll(): Promise<import("../entities/seguimiento.entity").Seguimiento[]>;
    findOne(id: string): Promise<import("../entities/seguimiento.entity").Seguimiento | null>;
    update(id: string, updateSeguimientoDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
