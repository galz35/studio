import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { AtencionMedica } from './atencion-medica.entity';
export declare class VacunaAplicada {
    id_vacuna_registro: number;
    paciente: Paciente;
    medico: Medico;
    atencion_medica: AtencionMedica;
    tipo_vacuna: string;
    dosis: string;
    fecha_aplicacion: Date;
    observaciones: string;
}
