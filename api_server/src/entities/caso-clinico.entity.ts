import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Paciente } from './paciente.entity';
import { CitaMedica } from './cita-medica.entity';
import { Seguimiento } from './seguimiento.entity';

@Entity('casos_clinicos')
@Index(['codigo_caso'], { unique: true })
export class CasoClinico {
    @PrimaryGeneratedColumn()
    id_caso: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    codigo_caso: string; // Autogenerado: CC-YYYY-#####

    @ManyToOne(() => Paciente, paciente => paciente.casos_clinicos)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;

    @Column({ type: 'varchar', length: 50 })
    estado_caso: string; // 'Abierto', 'Agendado', 'Cerrado', 'Cancelado'

    @Column({ type: 'char', length: 1 })
    nivel_semaforo: string; // V, A, R

    @Column({ type: 'text' })
    motivo_consulta: string;

    @Column({ type: 'text', nullable: true })
    resumen_clinico_usuario: string;

    // Relaciones
    @OneToOne(() => CitaMedica, cita => cita.caso_clinico, { nullable: true })
    @JoinColumn({ name: 'id_cita_principal' })
    cita_principal: CitaMedica;

    @OneToMany(() => Seguimiento, seguimiento => seguimiento.caso_clinico)
    seguimientos: Seguimiento[];
}
