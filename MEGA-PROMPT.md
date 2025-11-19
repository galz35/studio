
# Mega Prompt: Construcción del Backend para "Claro Mi Salud"

## 1. Resumen del Proyecto

**"Claro Mi Salud"** es un sistema de gestión de salud corporativo diseñado para conectar a los empleados (Pacientes) con el equipo médico de la empresa (Médicos) y ser gestionado por un rol de Administrador. La aplicación facilita el seguimiento del bienestar diario, la solicitud y gestión de citas médicas, la atención clínica digital y la administración general del sistema.

El objetivo es crear un backend robusto y escalable utilizando **NestJS**, **TypeORM** y **SQL Server**. La API debe ser RESTful y estar asegurada con **JWT** para la autenticación y autorización basada en roles. Además, debe incluir documentación automática a través de **Swagger**.

---

## 2. Arquitectura y Tecnologías del Backend

- **Framework:** NestJS
- **ORM:** TypeORM
- **Base de Datos:** SQL Server
- **Autenticación:** JWT (JSON Web Tokens)
- **Documentación API:** Swagger (OpenAPI)
- **Lenguaje:** TypeScript

---

## 3. Roles de Usuario y Autenticación

El sistema tiene tres roles principales: **PACIENTE**, **MEDICO** y **ADMIN**.

### Flujo de Autenticación (JWT):
1.  Un endpoint `POST /auth/login` recibirá el `carnet` del usuario.
2.  El sistema buscará en la tabla de `Usuarios` el `carnet` proporcionado.
3.  Si se encuentra, el backend generará un token JWT que contendrá `idUsuario`, `carnet`, `rol` y `pais`.
4.  Este token se enviará al cliente y se usará en el header `Authorization: Bearer <token>` para todas las peticiones subsecuentes a endpoints protegidos.
5.  Se debe implementar un `AuthGuard` en NestJS para proteger las rutas y verificar el rol del usuario para el acceso a funcionalidades específicas.

---

## 4. Modelos de Datos (Entidades TypeORM)

A continuación, se describen las entidades principales que deben ser creadas con TypeORM. Usar el `carnet` como identificador principal donde sea relevante.

- **`Usuario`**:
  - `idUsuario` (PK, autoincremental)
  - `carnet` (string, unique)
  - `nombreCompleto` (string)
  - `correo` (string, opcional)
  - `rol` (`PACIENTE`, `MEDICO`, `ADMIN`)
  - `pais` (`NI`, `CR`, `HN`)
  - `estado` (`A` para Activo, `I` para Inactivo)
  - `ultimoAcceso` (datetime, opcional)
  - `idPaciente` (FK a `Paciente`, opcional, nullable)
  - `idMedico` (FK a `Medico`, opcional, nullable)

- **`Paciente`**:
  - `idPaciente` (PK, autoincremental)
  - `carnet` (string, unique, FK a `Usuario`)
  - `nombreCompleto` (string)
  - `fechaNacimiento` (date, opcional)
  - `sexo` (string, opcional)
  - `telefono` (string, opcional)
  - `correo` (string, opcional)
  - `gerencia` (string, opcional)
  - `area` (string, opcional)
  - `estadoPaciente` (`A`, `I`)
  - `nivelSemaforo` (`V`, `A`, `R`, opcional)

- **`Medico`**:
  - `idMedico` (PK, autoincremental)
  - `carnet` (string, opcional, unique)
  - `nombreCompleto` (string)
  - `especialidad` (string, opcional)
  - `tipoMedico` (`INTERNO`, `EXTERNO`)
  - `correo` (string, opcional)
  - `telefono` (string, opcional)
  - `estadoMedico` (`A`, `I`)

- **`CasoClinico`**:
  - `idCaso` (PK, autoincremental)
  - `codigoCaso` (string, unique)
  - `idPaciente` (FK a `Paciente`)
  - `fechaCreacion` (datetime)
  - `estadoCaso` (string, ej: 'Abierto', 'Agendado', 'Cerrado')
  - `nivelSemaforo` (`V`, `A`, `R`)
  - `motivoConsulta` (string)
  - `resumenClinicoUsuario` (text, opcional)
  - `diagnosticoUsuario` (text, opcional)
  - `idCita` (FK a `CitaMedica`, opcional, nullable)

- **`CitaMedica`**:
  - `idCita` (PK, autoincremental)
  - `idCaso` (FK a `CasoClinico`, opcional)
  - `idPaciente` (FK a `Paciente`)
  - `idMedico` (FK a `Medico`)
  - `fechaCita` (date)
  - `horaCita` (string)
  - `canalOrigen` (string)
  - `estadoCita` (`PROGRAMADA`, `CONFIRMADA`, `FINALIZADA`, `CANCELADA`)
  - `motivoResumen` (text)
  - `nivelSemaforoPaciente` (`V`, `A`, `R`)

- **`AtencionMedica`**:
  - `idAtencion` (PK, autoincremental)
  - `idCita` (FK a `CitaMedica`)
  - `idMedico` (FK a `Medico`)
  - `fechaAtencion` (datetime)
  - `diagnosticoPrincipal` (text)
  - `planTratamiento` (text, opcional)
  - `recomendaciones` (text, opcional)
  - `requiereSeguimiento` (boolean)
  - `fechaSiguienteCita` (date, opcional)
  - (Y otros campos del formulario como `pesoKg`, `alturaM`, `presionArterial`, etc.)

- **`ExamenMedico`**:
  - `idExamen` (PK, autoincremental)
  - `idCaso` (FK a `CasoClinico`, opcional)
  - `idPaciente` (FK a `Paciente`)
  - `tipoExamen` (string)
  - `fechaSolicitud` (date)
  - `fechaResultado` (date, opcional)
  - `laboratorio` (string, opcional)
  - `resultadoResumen` (text, opcional)
  - `estadoExamen` (`PENDIENTE`, `ENTREGADO`, `CANCELADO`)

- **`SeguimientoPaciente`**:
  - `idSeguimiento` (PK, autoincremental)
  - `idCaso` (FK a `CasoClinico`)
  - `idPaciente` (FK a `Paciente`)
  - `fechaProgramada` (date)
  - `tipoSeguimiento` (`LLAMADA`, `TEAMS`, `PRESENCIAL`)
  - `estadoSeguimiento` (`PENDIENTE`, `EN_PROCESO`, `RESUELTO`)
  - `idUsuarioResponsable` (FK a `Usuario` - Médico)
  - `notasSeguimiento` (text)

- **`ChequeoBienestar`**:
  - `idChequeo` (PK, autoincremental)
  - `idPaciente` (FK a `Paciente`)
  - `fechaRegistro` (datetime)
  - `nivelSemaforo` (`V`, `A`, `R`)
  - (Y todos los demás campos del formulario de chequeo: `estadoAnimo`, `calidadSueno`, etc.)

---

## 5. Endpoints de la API (CRUD y Lógica de Negocio)

Se deben crear controladores y servicios en NestJS para cada una de las siguientes funcionalidades, protegidos por el `AuthGuard` y con validación de roles. El país del usuario (obtenido del JWT) debe usarse para filtrar todos los datos y asegurar que cada rol solo vea la información de su respectivo país.

### Módulo de Administración (`/admin/*`) - Rol: ADMIN
- `GET /admin/dashboard`: Devuelve KPIs agregados por país (total usuarios, médicos activos, etc.).
- `GET /admin/usuarios`: Devuelve una lista de usuarios, con filtros por rol, estado y país.
- `POST /admin/usuarios`: Crea un nuevo usuario. La lógica debe diferenciar entre 'interno' (busca en `emp2024`) y 'externo' (datos manuales).
- `PUT /admin/usuarios/:id`: Actualiza un usuario.
- `GET /admin/medicos`: Devuelve la lista de médicos por país.
- `POST /admin/medicos`: Crea un nuevo médico (interno o externo).
- `PUT /admin/medicos/:id`: Actualiza un médico.
- `GET /admin/configuracion`: Devuelve los parámetros actuales del sistema.
- `POST /admin/configuracion`: Actualiza los parámetros del sistema.

### Módulo de Médicos (`/medico/*`) - Rol: MEDICO
- `GET /medico/dashboard`: Devuelve KPIs para el médico logueado (citas de hoy, pacientes en rojo, etc.).
- `GET /medico/agenda-citas`: Devuelve casos clínicos con estado "Abierto" para triaje.
- `POST /medico/agenda-citas/agendar`: Recibe `idCaso`, `idMedico`, `fecha`, `hora` y crea una `CitaMedica`, actualizando el `CasoClinico`.
- `POST /medico/agenda-citas/cancelar`: Cancela una solicitud de cita (actualiza el estado del `CasoClinico`).
- `GET /medico/agenda-calendario`: Devuelve `CitaMedica` y `SeguimientoPaciente` para un rango de fechas para el médico logueado.
- `GET /medico/casos/:id`: Devuelve el detalle completo de un caso clínico (paciente, atenciones, exámenes, seguimientos).
- `GET /medico/atencion/:idCita`: Devuelve los datos necesarios para iniciar una atención médica.
- `POST /medico/atencion`: Guarda un registro completo de `AtencionMedica`.
- `GET /medico/examenes`: Devuelve una lista de exámenes, filtrable por estado y país.
- `POST /medico/examenes/resultado`: Registra el resultado de un examen.
- `POST /medico/examenes/carga-masiva`: Endpoint para recibir un archivo Excel/CSV y procesar resultados en lote.
- `GET /medico/seguimientos`: Devuelve la lista de seguimientos asignados al médico.
- `POST /medico/seguimientos/:id/nota`: Agrega una nota a un seguimiento y actualiza su estado.

### Módulo de Pacientes (`/paciente/*`) - Rol: PACIENTE
- `GET /paciente/dashboard`: Devuelve KPIs para el paciente logueado (estado semáforo, próxima cita, etc.).
- `POST /paciente/solicitar-cita`: Recibe el payload del wizard de solicitud, crea un `CasoClinico` y un `ChequeoBienestar`.
- `GET /paciente/mis-citas`: Devuelve el historial de citas del paciente.
- `GET /paciente/historial-chequeos`: Devuelve el historial de chequeos del paciente.

---

Este documento debería proporcionar una base sólida para comenzar a construir el backend. ¡Mucho éxito en el desarrollo!
