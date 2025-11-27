import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { Seguimiento } from './seguimiento.entity';
export declare class Usuario {
    id_usuario: number;
    carnet: string;
    password_hash: string;
    nombre_completo: string;
    correo: string;
    rol: string;
    pais: string;
    estado: string;
    ultimo_acceso: Date;
    paciente: Paciente;
    medico: Medico;
    seguimientos: Seguimiento[];
}
