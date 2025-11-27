import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { CasoClinico } from './caso-clinico.entity';
import { AtencionMedica } from './atencion-medica.entity';

@Entity('citas_medicas')
export class CitaMedica {
    @PrimaryGeneratedColumn()
    id_cita: number;

    @ManyToOne(() => Paciente)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Medico, medico => medico.citas_medicas)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @OneToOne(() => CasoClinico, caso => caso.cita_principal, { nullable: true })
    caso_clinico: CasoClinico;

    @Column({ type: 'date' })
    fecha_cita: Date;

    @Column({ type: 'time' })
    hora_cita: string;

    @Column({ type: 'varchar', length: 100 })
    canal_origen: string; // 'CHEQUEO', 'RRHH', 'SOLICITUD_DIRECTA'

    @Column({ type: 'varchar', length: 50 })
    estado_cita: string; // 'PROGRAMADA', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA'

    @Column({ type: 'text' })
    motivo_resumen: string;

    @Column({ type: 'char', length: 1 })
    nivel_semaforo_paciente: string; // V, A, R - El semáforo al momento de la cita

    // Relaciones
    @OneToOne(() => AtencionMedica, atencion => atencion.cita)
    atencion_medica: AtencionMedica;
}
