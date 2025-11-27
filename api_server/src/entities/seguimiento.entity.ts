import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { CasoClinico } from './caso-clinico.entity';
import { Paciente } from './paciente.entity';
import { AtencionMedica } from './atencion-medica.entity';
import { Usuario } from './usuario.entity';

@Entity('seguimientos')
export class Seguimiento {
    @PrimaryGeneratedColumn()
    id_seguimiento: number;

    @ManyToOne(() => CasoClinico, caso => caso.seguimientos)
    @JoinColumn({ name: 'id_caso' })
    caso_clinico: CasoClinico;

    @ManyToOne(() => Paciente, paciente => paciente.seguimientos)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @OneToOne(() => AtencionMedica, { nullable: true })
    @JoinColumn({ name: 'id_atencion_origen' })
    atencion_origen: AtencionMedica;

    @ManyToOne(() => Usuario, usuario => usuario.seguimientos)
    @JoinColumn({ name: 'id_usuario_responsable' })
    usuario_responsable: Usuario;

    @Column({ type: 'date' })
    fecha_programada: Date;

    @Column({ type: 'date', nullable: true })
    fecha_real: Date | null;

    @Column({ type: 'varchar', length: 20 })
    tipo_seguimiento: string; // 'LLAMADA', 'TEAMS', 'PRESENCIAL'

    @Column({ type: 'varchar', length: 20, default: 'PENDIENTE' })
    estado_seguimiento: string; // 'PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'CANCELADO'

    @Column({ type: 'char', length: 1 })
    nivel_semaforo: string; // 'R', 'A', 'V'

    @Column({ type: 'text' })
    notas_seguimiento: string;
}
