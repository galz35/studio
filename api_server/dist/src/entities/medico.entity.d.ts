import { Usuario } from './usuario.entity';
import { CitaMedica } from './cita-medica.entity';
import { VacunaAplicada } from './vacuna-aplicada.entity';
export declare class Medico {
    id_medico: number;
    carnet: string;
    nombre_completo: string;
    especialidad: string;
    tipo_medico: string;
    correo: string;
    telefono: string;
    estado_medico: string;
    usuario: Usuario;
    citas_medicas: CitaMedica[];
    vacunas_aplicadas: VacunaAplicada[];
}
