import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
export declare class RegistroPsicosocial {
    id_registro: number;
    paciente: Paciente;
    medico: Medico;
    fecha_registro: Date;
    nivel_estres: string;
    sintomas_referidos: object;
    narrativa_paciente: string;
    analisis_sentimiento_ia: string;
    riesgo_suicida: boolean;
    derivar_a_psicologia: boolean;
    notas_profesional: string;
    resumen_ia: string;
}
