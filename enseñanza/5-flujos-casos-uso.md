# 🔄 Flujos de Trabajo (Casos de Uso)

Este documento describe paso a paso cómo funcionan las acciones principales del sistema usando flechas (`->`) para mostrar el camino de los datos.

---

## 🔐 1. Autenticación (Login)

**Actor:** Usuario (Paciente, Médico o Admin)

`Usuario ingresa credenciales` -> `Frontend (LoginForm)` -> `API (POST /auth/login)` -> `AuthService (validateUser)` -> `Base de Datos (Buscar Usuario + Hash Password)` -> `AuthService (Generar JWT)` -> `API Responde (Token + Datos Usuario)` -> `Frontend (Guardar en AuthContext)` -> `Redirección al Dashboard correspondiente`

---

## 👤 2. Perfil Paciente

### A. Ver Dashboard
`Paciente entra al Dashboard` -> `Frontend (useEffect)` -> `API (GET /paciente/dashboard)` -> `PacienteService (getDashboard)` -> `Base de Datos (Calcular KPIs + Último Chequeo)` -> `API Responde JSON` -> `Frontend (Renderizar KpiCards y Gráficos)`

### B. Solicitar Cita (Wizard)
1. **Inicio:** `Clic en "Solicitar Cita"` -> `Frontend (SolicitudCitaWizard)`
2. **Paso 1 (Estado):** `Selecciona "Me siento mal"` -> `Selecciona Modalidad` -> `Siguiente`
3. **Paso 2 (Síntomas):** `Selecciona Zona (ej: Pecho)` -> `Selecciona Síntoma (ej: Dolor)` -> `Siguiente`
4. **Paso 3 (Hábitos):** `Responde preguntas de sueño/agua` -> `Siguiente`
5. **Envío:** `Clic en "Enviar Chequeo"` -> `API (POST /paciente/solicitar-cita)` -> `PacienteService (Procesar)` -> `Base de Datos (Guardar Caso + Chequeo)` -> `API Responde OK` -> `Frontend (Mostrar Modal Éxito)`

---

## 👨‍⚕️ 3. Perfil Médico

### A. Ver Agenda (Triaje)
`Médico entra a "Gestión de Citas"` -> `Frontend (useEffect)` -> `API (GET /casos/abiertos)` -> `CasosService (Filtrar por País)` -> `Base de Datos (Buscar Casos)` -> `API Responde Lista` -> `Frontend (Mostrar Tabla)`

### B. Análisis con IA
`Médico clic en "Ver Análisis IA"` -> `Frontend (Modal)` -> `Mostrar datos pre-calculados por Gemini (Urgencia, Especialidad)` -> `Médico decide Agendar`

### C. Agendar Cita
`Médico clic en "Agendar"` -> `Selecciona Fecha/Hora` -> `Clic Confirmar` -> `API (POST /medico/agendar)` -> `MedicoService (Actualizar Caso)` -> `Base de Datos (Crear Cita)` -> `API Responde OK` -> `Frontend (Actualizar Tabla)`

### D. Atender Paciente (Consulta)
`Médico entra a "Atención Médica"` -> `Selecciona Paciente` -> `API (GET /medico/atencion/{id})` -> `Frontend (Mostrar Historial)` -> `Médico llena Diagnóstico y Receta` -> `Clic "Finalizar"` -> `API (POST /medico/finalizar-atencion)` -> `Base de Datos (Guardar Atención + Cerrar Caso)`

---

## 🛡️ 4. Perfil Administrador

### A. Crear Usuario
`Admin entra a "Gestión Usuarios"` -> `Clic "Nuevo Usuario"` -> `Llena Formulario (Rol, Carnet, etc.)` -> `Clic "Crear"` -> `API (POST /admin/usuarios)` -> `AdminService (Crear Usuario + Entidad Relacionada)` -> `Base de Datos (Insertar en tablas)` -> `API Responde OK` -> `Frontend (Actualizar Lista)`

### B. Ver Reportes
`Admin entra a "Reportes"` -> `Frontend` -> `API (GET /admin/reportes)` -> `AdminService (Agrupar datos)` -> `Base de Datos (Count/Sum)` -> `API Responde Estadísticas` -> `Frontend (Mostrar Gráficos)`
