import { CasoClinico } from './caso-clinico.entity';
import { Paciente } from './paciente.entity';
import { AtencionMedica } from './atencion-medica.entity';
import { Usuario } from './usuario.entity';
export declare class Seguimiento {
    id_seguimiento: number;
    caso_clinico: CasoClinico;
    paciente: Paciente;
    atencion_origen: AtencionMedica;
    usuario_responsable: Usuario;
    fecha_programada: Date;
    fecha_real: Date | null;
    tipo_seguimiento: string;
    estado_seguimiento: string;
    nivel_semaforo: string;
    notas_seguimiento: string;
}
