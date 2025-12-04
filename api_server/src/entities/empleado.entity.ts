import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empleados')
export class Empleado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    carnet: string;

    @Column({ type: 'varchar', length: 255 })
    nombre_completo: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    cargo: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    gerencia: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    area: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    correo: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    pais: string;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVO' })
    estado: string;
}
