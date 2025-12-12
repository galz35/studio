import { CitaMedica } from './cita-medica.entity';
import { Medico } from './medico.entity';
import { ExamenMedico } from './examen-medico.entity';
import { VacunaAplicada } from './vacuna-aplicada.entity';
export declare class AtencionMedica {
    id_atencion: number;
    cita: CitaMedica;
    medico: Medico;
    fecha_atencion: Date;
    diagnostico_principal: string;
    plan_tratamiento: string | null;
    recomendaciones: string | null;
    requiere_seguimiento: boolean;
    fecha_siguiente_cita: Date | null;
    peso_kg: number | null;
    altura_m: number | null;
    presion_arterial: string | null;
    tipo_siguiente_cita: string | null;
    notas_seguimiento_medico: string | null;
    examenes: ExamenMedico[];
    vacunas: VacunaAplicada[];
}
