# 📘 Introducción a NestJS y la Arquitectura del Backend

Este documento explica cómo está construido el backend de tu proyecto (`api_server`) utilizando **NestJS**.

## ¿Qué es NestJS?
NestJS es un framework para construir aplicaciones de servidor eficientes y escalables con Node.js. Utiliza TypeScript por defecto y está fuertemente inspirado en Angular.

## Piezas Clave de la Arquitectura

Tu proyecto se organiza en **Módulos**. Cada módulo agrupa código relacionado (ej: `AuthModule`, `MedicoModule`).

### 1. Módulos (`*.module.ts`)
Son los contenedores principales.
*   **Función:** Agrupan controladores y servicios.
*   **Ejemplo:** `src/medico/medico.module.ts`
*   **Sintaxis:**
    ```typescript
    @Module({
      imports: [TypeOrmModule.forFeature([Medico])], // Importa tablas de BD
      controllers: [MedicoController], // Define quién recibe las peticiones
      providers: [MedicoService], // Define la lógica de negocio
    })
    export class MedicoModule {}
    ```

### 2. Controladores (`*.controller.ts`)
Son la "puerta de entrada". Reciben las peticiones HTTP (GET, POST, PUT, DELETE) del frontend.
*   **Función:** Recibir datos, validarlos y llamar al servicio. **No deben tener lógica compleja.**
*   **Ejemplo:** `src/medico/medico.controller.ts`
*   **Sintaxis:**
    ```typescript
    @Controller('medico') // Ruta base: /medico
    export class MedicoController {
      constructor(private readonly medicoService: MedicoService) {}

      @Get('pacientes') // Ruta final: GET /medico/pacientes
      getPacientes() {
        return this.medicoService.findAll();
      }
    }
    ```

### 3. Servicios (`*.service.ts`)
Aquí vive la **Lógica de Negocio**. Es el "cerebro" de la aplicación.
*   **Función:** Procesar datos, hacer cálculos y hablar con la base de datos.
*   **Ejemplo:** `src/medico/medico.service.ts`
*   **Sintaxis:**
    ```typescript
    @Injectable()
    export class MedicoService {
      constructor(
        @InjectRepository(Medico) // Inyectamos la tabla Medico
        private medicoRepo: Repository<Medico>
      ) {}

      async findAll() {
        return this.medicoRepo.find(); // Consulta a la BD
      }
    }
    ```

## Resumen del Flujo
1.  **Frontend** envía una petición a `GET /medico/pacientes`.
2.  **Controlador** (`MedicoController`) recibe la petición.
3.  **Controlador** llama al **Servicio** (`MedicoService.findAll()`).
4.  **Servicio** consulta a la **Base de Datos** (vía TypeORM).
5.  **Base de Datos** devuelve los datos.
6.  **Servicio** devuelve los datos al Controlador.
7.  **Controlador** responde al Frontend con un JSON.

## 🧸 Conceptos Clave: Explicación para Niños

A veces estos nombres suenan complicados, así que aquí tienes una analogía sencilla:

### `@Injectable()` = "La Etiqueta de la Caja de Herramientas"
Imagina que tienes una **Caja de Herramientas Compartida** para toda la casa.
*   Si compras un martillo nuevo y quieres que todos puedan usarlo, le pones una etiqueta que dice **"Disponible"** (`@Injectable`).
*   Si no le pones esa etiqueta, el martillo se queda escondido en tu cuarto y nadie más puede pedirlo prestado.
*   **En código:** Le decimos a NestJS: *"Oye, esta clase (Servicio) es útil, guárdala en la caja para que otros la usen"*.

### `@InjectRepository()` = "Pedir la Caja de Legos Específica"
Imagina que vas a construir un castillo. No necesitas todas las piezas del mundo, solo las del castillo.
*   Vas donde el "Guardián de los Juguetes" (NestJS) y le dices: *"Por favor, dame la caja de **Legos de Castillos**"* (`@InjectRepository(Castillo)`).
*   El guardián busca esa caja específica y te la da. No te da la de naves espaciales ni la de granjas.
*   **En código:** Le decimos a NestJS: *"Necesito conectarme a la tabla de **Médicos**, dame la herramienta para manejar esa tabla específica"*.
