# 🥊 SQL Puro / Stored Procedures vs TypeORM

Es una excelente pregunta. Muchos desarrolladores sienten que el ORM es "lento" comparado con SQL puro o Procedimientos Almacenados (Stored Procedures). Aquí te explico la realidad sin filtros.

## 1. ¿Por qué usamos ORM (TypeORM)?

La razón principal no es velocidad de ejecución, sino **Velocidad de Desarrollo y Mantenimiento**.

*   **Productividad:** Escribir `repo.save(usuario)` es mucho más rápido que escribir `INSERT INTO usuarios (...) VALUES (...)`.
*   **Seguridad:** El ORM te protege automáticamente de Inyección SQL.
*   **Tipado:** Si cambias el nombre de una columna en la Entidad, TypeScript te avisa de todos los errores antes de compilar. Con SQL puro, te enteras hasta que explota en producción.
*   **Mantenimiento:** Leer código TypeScript es más fácil para nuevos programadores que leer 500 líneas de PL/pgSQL.

## 2. ¿Por qué sientes que es lento? (La Verdad)

El ORM añade una pequeña capa de "sobrecarga" (convertir objetos a SQL y viceversa), pero **el 90% de la lentitud no es culpa del ORM, sino de cómo lo usamos**.

### Culpable A: El Problema N+1
Este es el asesino silencioso del rendimiento.
*   **Escenario:** Quieres listar 100 médicos y sus pacientes.
*   **Lo que haces:**
    ```typescript
    const medicos = await medicoRepo.find();
    for (const medico of medicos) {
        medico.pacientes = await pacienteRepo.find({ where: { medicoId: medico.id } });
    }
    ```
*   **Resultado:** Haces 1 consulta para médicos + 100 consultas para pacientes = **101 consultas a la BD**. ¡Lentísimo!
*   **Solución:** Usar `relations` o `QueryBuilder` para hacerlo en **1 sola consulta** (JOIN).

### Culpable B: "Hydration" (Hidratación)
Convertir los resultados de la BD (filas planas) a Objetos de JavaScript con clases y métodos cuesta CPU. Si traes 10,000 registros, Node.js sufrirá creando 10,000 objetos.

## 3. Stored Procedures (Procedimientos Almacenados)

Los SPs se ejecutan directamente en el motor de PostgreSQL.

*   **Ventajas:** Son rapidísimos para lógica compleja masiva (ej: calcular nómina de 50,000 empleados). Ahorran tráfico de red.
*   **Desventajas:**
    *   **Lógica oculta:** La lógica de negocio queda enterrada en la BD, no en tu código Git.
    *   **Difícil de testear:** No puedes hacer unit testing fácil.
    *   **Vendor Lock-in:** Si un día quieres cambiar a MySQL u Oracle, tienes que reescribir todo.

## 4. La Solución Híbrida (Lo mejor de los dos mundos)

No tienes que elegir uno. En sistemas grandes usamos ambos:

1.  **Para el 90% (CRUD):** Crear usuarios, editar perfiles, listar citas... usa **TypeORM**. Es rápido de programar y suficientemente rápido de ejecutar.
2.  **Para el 10% (Reportes Pesados / Dashboards):** Usa **SQL Puro** o **Stored Procedures** y llámalos desde TypeORM.

### Ejemplo: Llamar un SP desde TypeORM
Si tienes un reporte lento, crea un SP en Postgres y llámalo así:

```typescript
const resultado = await this.repo.query('SELECT * FROM reporte_complejo_sp($1)', [parametro]);
```

**Conclusión:** Si sientes el sistema lento, primero revisa si estás haciendo consultas N+1 o trayendo datos innecesarios. Si aun así es lento, mueve ESA consulta específica a SQL nativo, pero no tires el ORM para todo lo demás.
