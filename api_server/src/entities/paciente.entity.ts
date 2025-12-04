import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CasoClinico } from './caso-clinico.entity';
import { Seguimiento } from './seguimiento.entity';
import { ExamenMedico } from './examen-medico.entity';
import { VacunaAplicada } from './vacuna-aplicada.entity';

@Entity('pacientes')
export class Paciente {
    @PrimaryGeneratedColumn()
    id_paciente: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    carnet: string;

    @Column({ type: 'varchar', length: 255 })
    nombre_completo: string;

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    sexo: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    gerencia: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    area: string;

    @Column({ type: 'char', length: 1, default: 'A' })
    estado_paciente: string; // A: Activo, I: Inactivo

    @Column({ type: 'char', length: 1, nullable: true, comment: 'Nivel de semáforo: V, A, R' })
    nivel_semaforo: string;

    // Relaciones
    @OneToOne(() => Usuario, usuario => usuario.paciente)
    usuario: Usuario;

    @OneToMany(() => CasoClinico, caso => caso.paciente)
    casos_clinicos: CasoClinico[];

    @OneToMany(() => Seguimiento, seguimiento => seguimiento.paciente)
    seguimientos: Seguimiento[];

    @OneToMany(() => ExamenMedico, examen => examen.paciente)
    examenes: ExamenMedico[];

    @OneToMany(() => VacunaAplicada, vacuna => vacuna.paciente)
    vacunas: VacunaAplicada[];
}
