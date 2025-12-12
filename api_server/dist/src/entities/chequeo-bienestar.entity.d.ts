import { Paciente } from './paciente.entity';
export declare class ChequeoBienestar {
    id_chequeo: number;
    paciente: Paciente;
    fecha_registro: Date;
    nivel_semaforo: string;
    datos_completos: object;
}
