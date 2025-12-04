import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';
import { Seguimiento } from './seguimiento.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column({ type: 'varchar', length: 50, unique: true, comment: 'Carnet del empleado o identificador único.' })
    carnet: string;

    @Column({ type: 'varchar', comment: 'Hash de la contraseña generado con bcrypt.' })
    password_hash: string;

    @Column({ type: 'varchar', length: 255 })
    nombre_completo: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo: string;

    @Column({ type: 'varchar', length: 20, comment: 'Roles: PACIENTE, MEDICO, ADMIN' })
    rol: string;

    @Column({ type: 'varchar', length: 2, comment: 'País del usuario: NI, CR, HN' })
    pais: string;

    @Column({ type: 'char', length: 1, default: 'A', comment: 'Estado: A (Activo), I (Inactivo)' })
    estado: string;

    @Column({ type: 'timestamptz', nullable: true, comment: 'Fecha y hora del último inicio de sesión.' })
    ultimo_acceso: Date;

    // Relaciones
    @OneToOne(() => Paciente, paciente => paciente.usuario, { nullable: true, cascade: true })
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @OneToOne(() => Medico, medico => medico.usuario, { nullable: true, cascade: true })
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @OneToMany(() => Seguimiento, seguimiento => seguimiento.usuario_responsable)
    seguimientos: Seguimiento[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', comment: 'Fecha de creación del registro.' })
    fecha_creacion: Date;
}
