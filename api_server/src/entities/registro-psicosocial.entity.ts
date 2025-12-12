import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';

@Entity('registros_psicosociales')
export class RegistroPsicosocial {
    @PrimaryGeneratedColumn()
    id_registro: number;

    @ManyToOne(() => Paciente)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;

    @Column({ type: 'varchar', length: 20, nullable: true })
    nivel_estres: string; // Bajo, Medio, Alto

    @Column({ type: 'jsonb', nullable: true, comment: 'Almacena un array de síntomas como ["Ansiedad", "Insomnio"]' })
    sintomas_referidos: object;

    @Column({ type: 'text', nullable: true, comment: 'Narrativa del paciente sobre su estado de ánimo.' })
    narrativa_paciente: string;

    @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Resultado del análisis de sentimiento por IA: Positivo, Negativo, Neutro' })
    analisis_sentimiento_ia: string;

    @Column({ type: 'boolean', default: false, comment: 'Bandera de alerta para riesgo suicida.' })
    riesgo_suicida: boolean;

    @Column({ type: 'boolean', default: false, comment: 'Recomendación de derivar a psicología.' })
    derivar_a_psicologia: boolean;

    @Column({ type: 'text', nullable: true, comment: 'Notas confidenciales del profesional de la salud.' })
    notas_profesional: string;

    @Column({ type: 'text', nullable: true, comment: 'Resumen y recomendaciones generadas por Gemini AI.' })
    resumen_ia: string;
}
