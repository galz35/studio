import { PsicosocialService } from './psicosocial.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
export declare class PsicosocialController {
    private readonly service;
    constructor(service: PsicosocialService);
    create(dto: CreateEvaluacionDto): Promise<import("../entities/registro-psicosocial.entity").RegistroPsicosocial>;
    getByPaciente(id: string): Promise<import("../entities/registro-psicosocial.entity").RegistroPsicosocial[]>;
}
