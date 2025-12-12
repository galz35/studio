# 🔐 Autenticación y Seguridad

Este documento explica cómo protegemos la API para que solo usuarios autorizados puedan usarla.

## JWT (JSON Web Tokens)
Usamos **JWT** para manejar las sesiones.
1.  **Login:** El usuario envía usuario/contraseña.
2.  **Validación:** El backend verifica las credenciales.
3.  **Token:** Si son correctas, el backend genera un "Token" (una cadena larga de letras y números) y se lo da al usuario.
4.  **Uso:** Para cualquier petición futura (ej: ver pacientes), el usuario debe enviar ese Token.

## Passport y Estrategias
NestJS usa una librería llamada **Passport**.
*   **LocalStrategy:** Se usa solo en el Login. Verifica usuario y contraseña en la BD.
*   **JwtStrategy:** Se usa en todas las demás rutas. Verifica que el Token enviado sea válido y no haya expirado.

## Guards (Guardias)
Los Guards son los "porteros" de las rutas. Deciden si una petición pasa o no.

### 1. JwtAuthGuard
*   **Función:** Verifica que la petición tenga un Token válido.
*   **Uso:**
    ```typescript
    @UseGuards(JwtAuthGuard)
    @Get('perfil')
    getPerfil() { ... }
    ```
    Si no envías token, responde `401 Unauthorized`.

### 2. RolesGuard
*   **Función:** Verifica que el usuario tenga el **Rol** necesario (ej: solo MEDICO).
*   **Uso:**
    ```typescript
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('MEDICO') // Decorador personalizado
    @Get('pacientes')
    getPacientes() { ... }
    ```
    Si eres PACIENTE e intentas entrar aquí, responde `403 Forbidden`.

## Decoradores Personalizados
Creamos decoradores para hacer el código más limpio.

*   `@Roles('ADMIN', 'MEDICO')`: Define qué roles pueden entrar.
*   `@CurrentUser()`: Nos da el usuario que está haciendo la petición (extraído del Token).

## Hashing de Contraseñas
Nunca guardamos contraseñas en texto plano. Usamos **bcrypt**.
*   **Registro:** `bcrypt.hash(password, salt)` -> Convierte "hola123" en "$2b$10$..."
*   **Login:** `bcrypt.compare(password, hash)` -> Compara si coinciden sin descifrar el hash.
