# 🧠 Gestión de Estado (Context API)

Este documento explica cómo manejamos la información global, como el usuario logueado.

## El Problema: "Prop Drilling"
Imagina que tienes un componente `Abuelo` -> `Padre` -> `Hijo`.
Si el `Hijo` necesita saber quién es el usuario, tendrías que pasar la información por todos los niveles (`props`). Eso es sucio y difícil de mantener.

## La Solución: Context API
El Contexto es como una "Nube" de datos que flota sobre toda la aplicación. Cualquier componente puede "conectarse" a esa nube y pedir datos, sin importar dónde esté.

### AuthContext (`src/lib/context/AuthContext.tsx`)
Este es nuestro contexto principal.
*   **Qué guarda:**
    *   `user`: El objeto del usuario actual (nombre, rol, id).
    *   `loading`: Si estamos cargando datos.
    *   `login()`: Función para iniciar sesión.
    *   `logout()`: Función para cerrar sesión.

### ¿Cómo funciona?
1.  **Provider (Proveedor):** Envolvemos toda la app en `src/app/layout.tsx` con `<AuthProvider>`. Esto crea la "nube".
2.  **Consumer (Consumidor):** Usamos el hook `useAuth()` en cualquier componente para acceder a los datos.

```tsx
// En cualquier componente:
const { user, logout } = useAuth();

if (user) {
  return <button onClick={logout}>Salir</button>;
}
```

## Estado Local vs Global
*   **Estado Local (`useState`):** Datos que solo le importan a UN componente (ej: si un menú está abierto o cerrado).
*   **Estado Global (`Context`):** Datos que le importan a TODA la app (ej: usuario logueado, tema oscuro/claro, idioma).
