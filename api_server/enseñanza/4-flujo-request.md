# 🔄 El Flujo de una Petición (Request Lifecycle)

Este documento detalla paso a paso qué sucede cuando alguien usa la API.

## El Viaje de los Datos

Imagina que un usuario hace clic en "Ver Mis Citas".

### Paso 1: La Petición (Request)
El navegador envía:
*   **Método:** `GET`
*   **URL:** `/paciente/citas`
*   **Headers:** `Authorization: Bearer eyJhbGci...` (El Token)

### Paso 2: Middleware y Guards (Seguridad)
Antes de llegar al código, NestJS verifica:
1.  **Middleware:** ¿La petición está bien formada?
2.  **Guards (`JwtAuthGuard`):** ¿El token es válido? ¿Quién es el usuario?
3.  **Guards (`RolesGuard`):** ¿El usuario tiene permiso para ver esto?

### Paso 3: Interceptors y Pipes (Validación)
1.  **Pipes (`ValidationPipe`):** Si enviamos datos (ej: en un formulario), aquí se validan. Si falta un campo obligatorio, se rechaza la petición automáticamente.

### Paso 4: El Controlador (Controller)
Si todo lo anterior pasa, llega al método del controlador:
```typescript
@Get('citas')
getMisCitas(@CurrentUser() user: Usuario) {
    return this.pacienteService.getCitas(user.id);
}
```

### Paso 5: El Servicio (Service)
El servicio recibe el ID y ejecuta la lógica:
```typescript
async getCitas(idPaciente: number) {
    // Llama al Repositorio
    return this.citasRepo.find({ where: { paciente: { id: idPaciente } } });
}
```

### Paso 6: La Base de Datos (Database)
TypeORM traduce ese código a SQL:
```sql
SELECT * FROM citas WHERE id_paciente = 5;
```
PostgreSQL devuelve las filas encontradas.

### Paso 7: La Respuesta (Response)
Los datos viajan de vuelta: BD -> Servicio -> Controlador -> **Usuario**.
NestJS convierte automáticamente los objetos a formato JSON.

## Diagrama Simplificado
`Usuario` ➡️ `Guard (Seguridad)` ➡️ `Controlador` ➡️ `Servicio` ➡️ `Base de Datos`
`Usuario` ⬅️ `Respuesta JSON` ⬅️ `Controlador` ⬅️ `Servicio` ⬅️ `Base de Datos`
