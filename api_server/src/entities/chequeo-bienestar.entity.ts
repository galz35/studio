import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';

@Entity('chequeos_bienestar')
export class ChequeoBienestar {
    @PrimaryGeneratedColumn()
    id_chequeo: number;

    @ManyToOne(() => Paciente)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;

    @Column({ type: 'char', length: 1 })
    nivel_semaforo: string; // V, A, R

    // JSONB para almacenar toda la data del wizard (flexible)
    @Column({ type: 'jsonb' })
    datos_completos: object;
}
