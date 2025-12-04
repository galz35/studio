import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { CasoClinico } from './caso-clinico.entity';
import { AtencionMedica } from './atencion-medica.entity';

@Entity('examenes_medicos')
export class ExamenMedico {
    @PrimaryGeneratedColumn()
    id_examen: number;

    @ManyToOne(() => Paciente, paciente => paciente.examenes)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => CasoClinico, caso => caso.examenes, { nullable: true })
    @JoinColumn({ name: 'id_caso' })
    caso_clinico: CasoClinico;

    @ManyToOne(() => AtencionMedica, atencion => atencion.examenes, { nullable: true })
    @JoinColumn({ name: 'id_atencion' })
    atencion_medica: AtencionMedica;

    @Column()
    tipo_examen: string;

    @Column({ type: 'date' })
    fecha_solicitud: Date;

    @Column({ type: 'date', nullable: true })
    fecha_resultado: Date;

    @Column()
    laboratorio: string;

    @Column({ type: 'text', nullable: true })
    resultado_resumen: string;

    @Column({ default: 'PENDIENTE' })
    estado_examen: string;
}
