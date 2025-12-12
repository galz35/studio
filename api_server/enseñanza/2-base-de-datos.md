# 🗄️ Base de Datos con TypeORM

Este documento explica cómo tu backend interactúa con la base de datos PostgreSQL usando **TypeORM**.

## ¿Qué es TypeORM?
Es un ORM (Object-Relational Mapper). Permite trabajar con la base de datos usando **Clases y Objetos** de TypeScript en lugar de escribir SQL puro.

## Entidades (`*.entity.ts`)
Una Entidad es una clase que representa una **Tabla** en la base de datos.
*   **Ubicación:** `src/entities/`
*   **Ejemplo:** `src/entities/usuario.entity.ts`

### Anatomía de una Entidad
```typescript
@Entity('usuarios') // Nombre de la tabla en BD
export class Usuario {
    @PrimaryGeneratedColumn() // ID autoincremental
    id_usuario: number;

    @Column({ type: 'varchar', length: 50, unique: true }) // Columna normal
    carnet: string;

    // Relación Uno a Uno con Paciente
    @OneToOne(() => Paciente, paciente => paciente.usuario)
    @JoinColumn({ name: 'id_paciente' }) // Esta tabla tiene la llave foránea
    paciente: Paciente;
}
```

## Relaciones
TypeORM maneja las relaciones entre tablas automáticamente si las defines bien.

1.  **OneToOne (Uno a Uno):**
    *   Ejemplo: Un `Usuario` tiene un solo `Paciente`.
    *   Se usa `@OneToOne` y `@JoinColumn` en uno de los lados (el que guarda el ID).

2.  **OneToMany / ManyToOne (Uno a Muchos):**
    *   Ejemplo: Un `Medico` tiene muchas `Citas`.
    *   En Medico: `@OneToMany(() => Cita, cita => cita.medico)`
    *   En Cita: `@ManyToOne(() => Medico, medico => medico.citas)`

## Repositorios
Para hacer consultas (SELECT, INSERT, UPDATE), usamos **Repositorios**. No necesitas crearlos, TypeORM te los da.

### Operaciones Comunes
En tus servicios (`*.service.ts`), inyectas el repositorio y usas estos métodos:

*   **Buscar todos:**
    ```typescript
    this.repo.find();
    ```
*   **Buscar uno por ID o condición:**
    ```typescript
    this.repo.findOne({ where: { carnet: '123' } });
    ```
*   **Buscar con Relaciones (JOIN):**
    ```typescript
    this.repo.findOne({
        where: { id: 1 },
        relations: ['paciente'] // ¡Importante para traer datos relacionados!
    });
    ```
*   **Guardar (Crear o Actualizar):**
    ```typescript
    const nuevo = this.repo.create({ nombre: 'Juan' });
    await this.repo.save(nuevo);
    ```

## Migraciones vs Sincronización
En tu proyecto (desarrollo), usamos `synchronize: true` en `database.module.ts`.
*   **Efecto:** Si cambias una Entidad (ej: agregas una columna), TypeORM actualiza la tabla en la BD automáticamente al iniciar.
*   **Nota:** En producción, esto suele desactivarse para usar Migraciones manuales (más seguro).
