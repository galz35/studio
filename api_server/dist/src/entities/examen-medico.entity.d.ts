import { Paciente } from './paciente.entity';
import { CasoClinico } from './caso-clinico.entity';
import { AtencionMedica } from './atencion-medica.entity';
export declare class ExamenMedico {
    id_examen: number;
    paciente: Paciente;
    caso_clinico: CasoClinico;
    atencion_medica: AtencionMedica;
    tipo_examen: string;
    fecha_solicitud: Date;
    fecha_resultado: Date;
    laboratorio: string;
    resultado_resumen: string;
    estado_examen: string;
}
