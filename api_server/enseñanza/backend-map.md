# Mapa del Backend (API Server)

Este documento describe la estructura actual del servidor backend NestJS.

## 📂 Estructura General
Ruta base: `src/`

### 🏗️ Core & Configuración
- **main.ts**: Punto de entrada. Configura la aplicación, CORS y el puerto de escucha.
- **app.module.ts**: Módulo raíz. Importa y orquesta todos los demás módulos (Database, Auth, Admin, Medico, etc.).
- **app.controller.ts / app.service.ts**: Endpoints base de salud/bienvenida.

### 🗄️ Database (`src/database`)
- **database.module.ts**: Configura la conexión a PostgreSQL usando TypeORM y variables de entorno. Carga entidades dinámicamente.

### 🔐 Auth (`src/auth`)
Módulo encargado de la autenticación y autorización.
- **auth.controller.ts**: Endpoints de login (`POST /auth/login`).
- **auth.service.ts**: Lógica de validación de usuarios y generación de JWT.
- **jwt.strategy.ts**: Estrategia de Passport para validar tokens JWT en requests entrantes.
- **jwt-auth.guard.ts**: Guard global/local para proteger rutas que requieren token.
- **roles.guard.ts / roles.decorator.ts**: Sistema de autorización basado en roles (ADMIN, MEDICO, PACIENTE).

### 👥 Usuarios & Roles
#### 🏢 Admin (`src/admin`)
- **admin.controller.ts**: Endpoints exclusivos para administradores.
- **admin.service.ts**: Lógica administrativa (crear usuarios, gestionar sistema).

#### ⚕️ Médico (`src/medico`)
- **medico.controller.ts**: Endpoints para gestión de médicos.
- **medico.service.ts**: Lógica de negocio relacionada con médicos.

#### 🤒 Paciente (`src/paciente`)
- **paciente.controller.ts**: Endpoints para gestión de pacientes.
- **paciente.service.ts**: Lógica de negocio para pacientes (historial, datos personales).

#### 📊 Seguimiento (`src/seguimiento`)
- **seguimiento.controller.ts**: Endpoints para control de seguimientos médicos.
- **seguimiento.service.ts**: Lógica para crear y consultar seguimientos.

### 📦 Entidades (`src/entities`)
Modelos ORM que mapean a tablas en PostgreSQL:
- `usuario.entity.ts`: Tabla base de credenciales y roles.
- `paciente.entity.ts`: Perfil de paciente.
- `medico.entity.ts`: Perfil de médico.
- `cita-medica.entity.ts`, `caso-clinico.entity.ts`, `seguimiento.entity.ts`: Tablas transaccionales.
- Otros: `empleado.entity.ts`, `examen-medico.entity.ts`, `vacuna-aplicada.entity.ts`, etc.

---

## ⚠️ Componentes Faltantes / Recomendaciones

Basado en el análisis de la estructura actual:

1.  **Seeders (Semillas de Datos)**
    - *Estado:* No se encontraron scripts de "seeds" para poblar datos iniciales (roles, usuarios admin por defecto).
    - *Impacto:* Requiere inserción manual de datos en una DB limpia.

2.  **Manejo de Errores Global (Filters)**
    - *Estado:* Aunque hay `ValidationPipe`, no se observa un `http-exception.filter.ts` personalizado para estandarizar todas las respuestas de error.
    - *Impacto:* Los errores pueden llegar con formatos inconsistentes.

3.  **Tests**
    - *Estado:* Existen archivos `.spec.ts` básicos, pero sería ideal confirmar la cobertura de tests de integración para los flujos críticos (Login -> Cita).

*Nota: Swagger y ValidationPipe Globales SÍ están configurados en `main.ts`.*

