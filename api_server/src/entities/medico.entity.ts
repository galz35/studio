import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CitaMedica } from './cita-medica.entity';
import { VacunaAplicada } from './vacuna-aplicada.entity';

@Entity('medicos')
export class Medico {
    @PrimaryGeneratedColumn()
    id_medico: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    carnet: string; // Opcional para médicos externos

    @Column({ type: 'varchar', length: 255 })
    nombre_completo: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    especialidad: string;

    @Column({ type: 'enum', enum: ['INTERNO', 'EXTERNO'] })
    tipo_medico: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'char', length: 1, default: 'A' })
    estado_medico: string; // A: Activo, I: Inactivo

    // Relaciones
    @OneToOne(() => Usuario, usuario => usuario.medico)
    usuario: Usuario;

    @OneToMany(() => CitaMedica, cita => cita.medico)
    citas_medicas: CitaMedica[];

    @OneToMany(() => VacunaAplicada, vacuna => vacuna.medico)
    vacunas_aplicadas: VacunaAplicada[];
}
