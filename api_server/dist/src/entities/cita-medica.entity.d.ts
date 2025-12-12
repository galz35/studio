import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { CasoClinico } from './caso-clinico.entity';
import { AtencionMedica } from './atencion-medica.entity';
export declare class CitaMedica {
    id_cita: number;
    paciente: Paciente;
    medico: Medico;
    caso_clinico: CasoClinico;
    fecha_cita: Date;
    hora_cita: string;
    canal_origen: string;
    estado_cita: string;
    motivo_resumen: string;
    nivel_semaforo_paciente: string;
    atencion_medica: AtencionMedica;
}
