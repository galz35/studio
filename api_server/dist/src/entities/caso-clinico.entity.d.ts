import { Paciente } from './paciente.entity';
import { CitaMedica } from './cita-medica.entity';
import { Seguimiento } from './seguimiento.entity';
import { ExamenMedico } from './examen-medico.entity';
export declare class CasoClinico {
    id_caso: number;
    codigo_caso: string;
    paciente: Paciente;
    fecha_creacion: Date;
    estado_caso: string;
    nivel_semaforo: string;
    motivo_consulta: string;
    resumen_clinico_usuario: string;
    diagnostico_usuario: string;
    datos_extra: any;
    cita_principal: CitaMedica;
    seguimientos: Seguimiento[];
    examenes: ExamenMedico[];
}
