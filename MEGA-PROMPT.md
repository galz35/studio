# Mega Prompt: Construcción del Backend para "Claro Mi Salud"

## 1. Resumen del Proyecto

**"Claro Mi Salud"** es un sistema de gestión de salud corporativo diseñado para conectar a los empleados (Pacientes) con el equipo médico de la empresa (Médicos) y ser gestionado por un rol de Administrador. La aplicación facilita el seguimiento del bienestar diario, la solicitud y gestión de citas médicas, la atención clínica digital y la administración general del sistema.

El objetivo es crear un backend robusto y escalable utilizando **NestJS**, **TypeORM** y **SQL Server**. La API debe ser RESTful y estar asegurada con **JWT** para la autenticación y autorización basada en roles. Además, debe incluir documentación automática a través de **Swagger**.

---

## 2. Arquitectura y Tecnologías del Backend

- **Framework:** NestJS
- **ORM:** TypeORM
- **Base de Datos:** SQL Server
- **Autenticación:** JWT (JSON Web Tokens) con Bcrypt para contraseñas.
- **Documentación API:** Swagger (OpenAPI)
- **Lenguaje:** TypeScript

---

## 3. Roles de Usuario y Autenticación

El sistema tiene tres roles principales: **PACIENTE**, **MEDICO** y **ADMIN**.

### Flujo de Autenticación (JWT con Contraseña):
1.  Un endpoint `POST /auth/login` recibirá el `carnet` y `password` del usuario.
2.  El sistema buscará en la tabla `Usuario` el `carnet` proporcionado.
3.  Si se encuentra el usuario, se comparará el `password` recibido con el hash almacenado en la base de datos usando `bcrypt`.
4.  Si las credenciales son válidas, el backend generará un token JWT que contendrá `idUsuario`, `carnet`, `rol` y `pais`.
5.  Este token se enviará al cliente y se usará en el header `Authorization: Bearer <token>` para todas las peticiones subsecuentes a endpoints protegidos.
6.  Se debe implementar un `AuthGuard` en NestJS para proteger las rutas y un `RolesGuard` para verificar el rol del usuario para el acceso a funcionalidades específicas.

---

## 4. Modelos de Datos (Entidades TypeORM)

A continuación, se describen las entidades principales que deben ser creadas con TypeORM. Usar el `carnet` como identificador principal donde sea relevante.

- **`Usuario`**:
  - `idUsuario` (PK, autoincremental, integer)
  - `carnet` (string, unique)
  - `password` (string, hash)
  - `nombreCompleto` (string)
  - `correo` (string, opcional)
  - `rol` (enum: `PACIENTE`, `MEDICO`, `ADMIN`)
  - `pais` (enum: `NI`, `CR`, `HN`)
  - `estado` (enum: `A` para Activo, `I` para Inactivo)
  - `ultimoAcceso` (datetime, opcional)
  - `idPaciente` (FK a `Paciente`, opcional, nullable, one-to-one)
  - `idMedico` (FK a `Medico`, opcional, nullable, one-to-one)

- **`Paciente`**:
  - `idPaciente` (PK, autoincremental, integer)
  - `carnet` (string, unique)
  - `nombreCompleto` (string)
  - `fechaNacimiento` (date, opcional)
  - `sexo` (string, opcional)
  - `telefono` (string, opcional)
  - `correo` (string, opcional)
  - `gerencia` (string, opcional)
  - `area` (string, opcional)
  - `estadoPaciente` (enum: `A`, `I`)
  - `nivelSemaforo` (enum: `V`, `A`, `R`, opcional)
  - **Relaciones:** `Usuario` (one-to-one), `CasoClinico` (one-to-many)

- **`Medico`**:
  - `idMedico` (PK, autoincremental, integer)
  - `carnet` (string, opcional, unique, nullable)
  - `nombreCompleto` (string)
  - `especialidad` (string, opcional)
  - `tipoMedico` (enum: `INTERNO`, `EXTERNO`)
  - `correo` (string, opcional)
  - `telefono` (string, opcional)
  - `estadoMedico` (enum: `A`, `I`)
  - **Relaciones:** `Usuario` (one-to-one), `CitaMedica` (one-to-many)

- **`CasoClinico`**:
  - `idCaso` (PK, autoincremental, integer)
  - `codigoCaso` (string, unique, autogenerado ej: CC-YYYY-#####)
  - `idPaciente` (FK a `Paciente`, many-to-one)
  - `fechaCreacion` (datetime)
  - `estadoCaso` (enum: 'Abierto', 'Agendado', 'Cerrado', 'Cancelado')
  - `nivelSemaforo` (enum: `V`, `A`, `R`)
  - `motivoConsulta` (string)
  - `resumenClinicoUsuario` (text, opcional)
  - `diagnosticoUsuario` (text, opcional)
  - `idCita` (FK a `CitaMedica`, opcional, nullable, one-to-one)
  - **Relaciones:** `Paciente` (many-to-one), `CitaMedica` (one-to-one)

- **`CitaMedica`**:
  - `idCita` (PK, autoincremental, integer)
  - `idCaso` (FK a `CasoClinico`, opcional, one-to-one)
  - `idPaciente` (FK a `Paciente`, many-to-one)
  - `idMedico` (FK a `Medico`, many-to-one)
  - `fechaCita` (date)
  - `horaCita` (string)
  - `canalOrigen` (string)
  - `estadoCita` (enum: `PROGRAMADA`, `CONFIRMADA`, `FINALIZADA`, `CANCELADA`)
  - `motivoResumen` (text)
  - `nivelSemaforoPaciente` (enum: `V`, `A`, `R`)
  - **Relaciones:** `CasoClinico` (one-to-one), `Paciente` (many-to-one), `Medico` (many-to-one), `AtencionMedica` (one-to-one)

- **`AtencionMedica`**:
  - `idAtencion` (PK, autoincremental, integer)
  - `idCita` (FK a `CitaMedica`, one-to-one)
  - `idMedico` (FK a `Medico`, many-to-one)
  - `fechaAtencion` (datetime)
  - `diagnosticoPrincipal` (text)
  - `planTratamiento` (text, opcional)
  - `recomendaciones` (text, opcional)
  - `requiereSeguimiento` (boolean)
  - `fechaSiguienteCita` (date, opcional)
  - (Y otros campos del formulario como `pesoKg`, `alturaM`, `presionArterial`, etc.)
  - **Relaciones:** `CitaMedica` (one-to-one), `Medico` (many-to-one)

- **`ExamenMedico`**:
  - `idExamen` (PK, autoincremental, integer)
  - `idCaso` (FK a `CasoClinico`, opcional, many-to-one)
  - `idPaciente` (FK a `Paciente`, many-to-one)
  - `tipoExamen` (string)
  - `fechaSolicitud` (date)
  - `fechaResultado` (date, opcional)
  - `laboratorio` (string, opcional)
  - `resultadoResumen` (text, opcional)
  - `estadoExamen` (enum: `PENDIENTE`, `ENTREGADO`, `CANCELADO`)
  - **Relaciones:** `CasoClinico` (many-to-one), `Paciente` (many-to-one)

- **`SeguimientoPaciente`**:
  - `idSeguimiento` (PK, autoincremental, integer)
  - `idCaso` (FK a `CasoClinico`, many-to-one)
  - `idPaciente` (FK a `Paciente`, many-to-one)
  - `fechaProgramada` (date)
  - `tipoSeguimiento` (enum: `LLAMADA`, `TEAMS`, `PRESENCIAL`)
  - `estadoSeguimiento` (enum: `PENDIENTE`, `EN_PROCESO`, `RESUELTO`)
  - `idUsuarioResponsable` (FK a `Usuario` - Médico)
  - `notasSeguimiento` (text)
  - **Relaciones:** `CasoClinico` (many-to-one), `Paciente` (many-to-one), `Usuario` (many-to-one)

- **`ChequeoBienestar`**:
  - `idChequeo` (PK, autoincremental, integer)
  - `idPaciente` (FK a `Paciente`, many-to-one)
  - `fechaRegistro` (datetime)
  - `nivelSemaforo` (enum: `V`, `A`, `R`)
  - (Y todos los demás campos del formulario de chequeo: `estadoAnimo`, `calidadSueno`, etc.)
  - **Relaciones:** `Paciente` (many-to-one)

---

## 5. Endpoints de la API (CRUD y Lógica de Negocio)

Se deben crear controladores y servicios en NestJS para cada una de las siguientes funcionalidades, protegidos por el `AuthGuard` y con validación de roles. El país del usuario (obtenido del JWT) debe usarse para filtrar todos los datos y asegurar que cada rol solo vea la información de su respectivo país.

### Módulo de Autenticación (`/auth`)
- `POST /auth/login`:
    - **Body:** `{ carnet: string, password: string }`
    - **Lógica:** Valida credenciales contra la tabla `Usuario`. Si son correctas, genera y devuelve un JWT con `idUsuario`, `carnet`, `rol` y `pais`. Actualiza `ultimoAcceso`.

### Módulo de Administración (`/admin/*`) - Rol: ADMIN
- `GET /admin/dashboard`: Devuelve KPIs agregados por país (total usuarios, médicos activos, citas hoy, etc.).
- `GET /admin/usuarios`: Devuelve una lista paginada de `Usuario`, con filtros por rol, estado y `pais`. El `pais` se toma del JWT del admin.
- `POST /admin/usuarios`:
    - **Body:** Datos del nuevo usuario.
    - **Lógica:** Crea un nuevo `Usuario`. La contraseña debe ser hasheada con `bcrypt`. Si el usuario es tipo `PACIENTE` o `MEDICO`, también crea la entidad `Paciente` o `Medico` correspondiente.
- `PUT /admin/usuarios/:id`: Actualiza un `Usuario` (ej: estado, rol). No debe permitir cambiar la contraseña directamente.
- `GET /admin/medicos`: Devuelve la lista de `Medico` filtrada por `pais`.
- `POST /admin/medicos`: Crea un nuevo `Medico`. Si es `INTERNO`, debe asociarse a un `Usuario` existente.
- `PUT /admin/medicos/:id`: Actualiza los datos de un `Medico`.
- `GET /admin/configuracion`: Devuelve los parámetros actuales del sistema.
- `POST /admin/configuracion`: Actualiza los parámetros del sistema.

### Módulo de Médicos (`/medico/*`) - Rol: MEDICO
- `GET /medico/dashboard`: Devuelve KPIs para el médico logueado (citas de hoy, seguimientos pendientes, pacientes en rojo de su país).
- `GET /medico/agenda-citas`: Devuelve `CasoClinico` con estado "Abierto" del `pais` del médico, para triaje.
- `POST /medico/agenda-citas/agendar`:
    - **Body:** `{ idCaso: number, idMedico: number, fechaCita: string, horaCita: string }`
    - **Lógica:** Crea una `CitaMedica` y actualiza el `estadoCaso` a "Agendado" y le asigna el `idCita` al `CasoClinico`.
- `POST /medico/agenda-citas/cancelar`:
    - **Body:** `{ idCaso: number, motivo: string }`
    - **Lógica:** Cambia el `estadoCaso` a "Cancelado" y registra el motivo.
- `GET /medico/agenda-calendario`: Devuelve `CitaMedica` y `SeguimientoPaciente` para un rango de fechas (`startDate`, `endDate`) asignadas al médico logueado.
- `GET /medico/casos/:id`: Devuelve el detalle completo de un `CasoClinico` (JOIN con Paciente, Atenciones, Exámenes, Seguimientos).
- `GET /medico/atencion/:idCita`: Devuelve los datos pre-atención (detalles de la cita, paciente y caso).
- `POST /medico/atencion`: Guarda un registro completo de `AtencionMedica`. Al guardar, debe actualizar el estado de la `CitaMedica` a `FINALIZADA` y, si corresponde, el del `CasoClinico` a `Cerrado`. Si se crea un seguimiento, se debe crear la entidad `SeguimientoPaciente`.
- `GET /medico/examenes`: Devuelve una lista de `ExamenMedico`, filtrable por estado y `pais` del médico.
- `POST /medico/examenes/:idExamen/resultado`:
    - **Body:** `{ resultadoResumen: string, fechaResultado: string }`
    - **Lógica:** Registra el resultado de un examen y cambia su `estadoExamen` a `ENTREGADO`.
- `GET /medico/seguimientos`: Devuelve la lista de `SeguimientoPaciente` asignados al médico logueado.
- `POST /medico/seguimientos/:id/nota`:
    - **Body:** `{ notasSeguimiento: string, estadoSeguimiento: string }`
    - **Lógica:** Agrega una nota a un seguimiento y actualiza su estado.

### Módulo de Pacientes (`/paciente/*`) - Rol: PACIENTE
- `GET /paciente/dashboard`: Devuelve KPIs para el paciente logueado (su nivel de semáforo, fecha de su próxima cita, seguimientos activos).
- `POST /paciente/solicitar-cita`:
    - **Body:** Payload del wizard de solicitud (síntomas, hábitos, etc.).
    - **Lógica:** Crea un registro en `ChequeoBienestar` y, si la ruta es `consulta`, también crea un `CasoClinico` con estado "Abierto".
- `GET /paciente/mis-citas`: Devuelve el historial de `CitaMedica` del paciente logueado (JOIN con Medico).
- `GET /paciente/historial-chequeos`: Devuelve el historial de `ChequeoBienestar` del paciente logueado.

---

Este documento debería proporcionar una base sólida y completa para comenzar a construir el backend. ¡Mucho éxito en el desarrollo!
