import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CitaMedica } from './cita-medica.entity';
import { Medico } from './medico.entity';
import { ExamenMedico } from './examen-medico.entity';
import { VacunaAplicada } from './vacuna-aplicada.entity';

@Entity('atenciones_medicas')
export class AtencionMedica {
    @PrimaryGeneratedColumn()
    id_atencion: number;

    @OneToOne(() => CitaMedica, cita => cita.atencion_medica)
    @JoinColumn({ name: 'id_cita' })
    cita: CitaMedica;

    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha_atencion: Date;

    @Column({ type: 'text' })
    diagnostico_principal: string;

    @Column({ type: 'text', nullable: true })
    plan_tratamiento: string | null;

    @Column({ type: 'text', nullable: true })
    recomendaciones: string | null;

    @Column({ type: 'boolean', default: false })
    requiere_seguimiento: boolean;

    @Column({ type: 'date', nullable: true })
    fecha_siguiente_cita: Date | null;

    // Otros campos del formulario...
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    peso_kg: number | null;

    @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
    altura_m: number | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    presion_arterial: string | null; // "120/80"

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipo_siguiente_cita: string | null; // 'CONTROL', 'RESULTADO_EXAMEN', 'OTRO'

    @Column({ type: 'text', nullable: true })
    notas_seguimiento_medico: string | null;

    @OneToMany(() => ExamenMedico, examen => examen.atencion_medica)
    examenes: ExamenMedico[];

    @OneToMany(() => VacunaAplicada, vacuna => vacuna.atencion_medica)
    vacunas: VacunaAplicada[];
}
