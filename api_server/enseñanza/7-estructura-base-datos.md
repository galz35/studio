# 🗂️ Estructura de la Base de Datos

Este documento explica las tablas principales del sistema y cómo se conectan entre sí.

## 1. Usuarios y Seguridad (`usuarios`)
Es la tabla central para el Login.
*   **Propósito:** Guardar credenciales y roles.
*   **Columnas Clave:** `carnet` (Usuario), `password_hash`, `rol` (ADMIN, MEDICO, PACIENTE).
*   **Conexiones:**
    *   Se conecta a `pacientes` (si el rol es PACIENTE).
    *   Se conecta a `medicos` (si el rol es MEDICO).

## 2. Perfiles Principales

### `pacientes`
Contiene la información médica y personal del empleado/paciente.
*   **Datos:** Nombre, fecha nacimiento, teléfono, área, gerencia.
*   **Estado:** `nivel_semaforo` (Verde, Amarillo, Rojo) para indicar su riesgo de salud.

### `medicos`
Contiene la información de los doctores.
*   **Datos:** Especialidad, número de licencia, horario de trabajo.

## 3. Flujo de Atención Médica

### `casos_clinicos`
Es la "carpeta" que agrupa todo lo que pasa con un paciente en un episodio de enfermedad.
*   **Ejemplo:** "Gripe Severa - Diciembre 2023".
*   **Estado:** `Abierto` (en tratamiento) o `Cerrado` (dado de alta).
*   **Conexiones:** Pertenece a un `paciente`.

### `citas_medicas`
Son los eventos agendados dentro de un caso.
*   **Datos:** Fecha, hora, motivo, modalidad (Presencial/Virtual).
*   **Conexiones:** Une a un `paciente` con un `medico`.

### `atenciones_medicas`
Es el registro de lo que pasó en la consulta.
*   **Datos:** Diagnóstico, receta, notas del doctor.
*   **Conexiones:** Vinculada a una `cita_medica`.

## 4. Módulos Especiales

### `chequeos_bienestar`
Son los reportes diarios que envían los pacientes desde el Wizard.
*   **Datos:** Síntomas, nivel de dolor, calidad de sueño.
*   **Función:** El sistema usa esto para calcular el `nivel_semaforo` automáticamente.

### `registros_psicosociales`
Evaluaciones de salud mental y estrés laboral.
*   **Datos:** Respuestas a preguntas sobre carga de trabajo, ansiedad, etc.
*   **IA:** Ahora incluye un campo `analisis_ia` con el resumen generado por Gemini.

### `examenes_medicos` y `vacunas_aplicadas`
Tablas de soporte para guardar el historial clínico histórico del paciente.

---

## 🔗 Diagrama Mental de Relaciones

*   **Un Usuario** TIENE UN **Paciente** (o Médico).
*   **Un Paciente** TIENE MUCHOS **Casos Clínicos**.
*   **Un Caso Clínico** TIENE MUCHAS **Citas**.
*   **Una Cita** TIENE UNA **Atención Médica**.
