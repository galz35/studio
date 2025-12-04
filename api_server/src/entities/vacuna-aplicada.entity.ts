import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { AtencionMedica } from './atencion-medica.entity';

@Entity('vacunas_aplicadas')
export class VacunaAplicada {
    @PrimaryGeneratedColumn()
    id_vacuna_registro: number;

    @ManyToOne(() => Paciente, paciente => paciente.vacunas)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Medico, medico => medico.vacunas_aplicadas, { nullable: true })
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @ManyToOne(() => AtencionMedica, atencion => atencion.vacunas, { nullable: true })
    @JoinColumn({ name: 'id_atencion' })
    atencion_medica: AtencionMedica;

    @Column()
    tipo_vacuna: string;

    @Column()
    dosis: string;

    @Column({ type: 'date' })
    fecha_aplicacion: Date;

    @Column({ type: 'text', nullable: true })
    observaciones: string;
}
