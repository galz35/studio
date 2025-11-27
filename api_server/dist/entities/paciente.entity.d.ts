import { Usuario } from './usuario.entity';
import { CasoClinico } from './caso-clinico.entity';
import { Seguimiento } from './seguimiento.entity';
export declare class Paciente {
    id_paciente: number;
    carnet: string;
    nombre_completo: string;
    fecha_nacimiento: Date;
    sexo: string;
    telefono: string;
    correo: string;
    gerencia: string;
    area: string;
    estado_paciente: string;
    nivel_semaforo: string;
    usuario: Usuario;
    casos_clinicos: CasoClinico[];
    seguimientos: Seguimiento[];
}
