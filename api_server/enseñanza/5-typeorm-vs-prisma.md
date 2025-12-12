# 🦄 TypeORM vs Prisma: ¿Qué estamos usando?

Para responder a tu pregunta: **NO estamos usando Prisma. Estamos usando TypeORM.**

## ¿Por qué TypeORM?
TypeORM es el ORM "oficial" (o el más tradicional) para NestJS. Se integra perfectamente porque ambos usan **Clases y Decoradores** (`@Entity`, `@Column`).

*   **Prisma:** Defines tu DB en un archivo `schema.prisma` y él genera los tipos.
*   **TypeORM:** Defines tu DB en clases de TypeScript (`usuario.entity.ts`) y él genera las tablas.

## 🚀 Cómo usar TypeORM Eficientemente

Aquí tienes trucos para que tu backend vuele y no se ponga lento.

### 1. Selecciona SOLO lo que necesitas (`select`)
Por defecto, `.find()` trae TODAS las columnas. Si la tabla tiene 50 columnas y solo quieres el nombre, es un desperdicio.

**Mal (Lento):**
```typescript
const users = await this.repo.find(); // Trae password, fechas, logs... todo.
```

**Bien (Rápido):**
```typescript
const users = await this.repo.find({
    select: ['id_usuario', 'nombre_completo'] // Solo trae estas 2 columnas
});
```

### 2. Cuidado con las Relaciones (`relations`)
Traer relaciones es costoso (hace JOINs en SQL). No las pidas si no las vas a usar.

**Mal (Si solo quieres el usuario):**
```typescript
const user = await this.repo.findOne({
    where: { id: 1 },
    relations: ['paciente', 'medico', 'seguimientos', 'citas'] // ¡Demasiada carga!
});
```

**Bien:**
```typescript
const user = await this.repo.findOne({
    where: { id: 1 },
    relations: ['paciente'] // Solo lo necesario
});
```

### 3. Usa `QueryBuilder` para Consultas Complejas
Los métodos estándar (`find`, `findOne`) son fáciles, pero para reportes o filtros avanzados, el `QueryBuilder` es más potente y eficiente.

```typescript
const usuariosActivos = await this.repo.createQueryBuilder("usuario")
    .where("usuario.estado = :estado", { estado: 'A' })
    .andWhere("usuario.pais = :pais", { pais: 'NI' })
    .orderBy("usuario.nombre_completo", "ASC")
    .getMany();
```
*Es como escribir SQL pero en TypeScript.*

### 4. Índices en la Base de Datos
Esto no es código TypeScript, pero es vital. Si buscas mucho por `carnet`, asegúrate de que esa columna tenga un índice en la base de datos (TypeORM lo hace si pones `@Column({ unique: true })` o `@Index`).

## Resumen
*   Estamos en **TypeORM**.
*   Usa `select` para traer pocos datos.
*   Usa `relations` con precaución.
*   Usa `QueryBuilder` cuando `find()` se quede corto.
