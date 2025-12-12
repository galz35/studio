# 🧩 Componentes y Hooks en React

Este documento explica los bloques de construcción de tu interfaz.

## Componentes
Un componente es una pieza reutilizable de la interfaz (un botón, una tarjeta, un formulario).

### Sintaxis Básica
```tsx
// Definición del componente
export function MiBoton({ texto, onClick }: { texto: string, onClick: () => void }) {
  return (
    <button className="bg-blue-500 text-white p-2 rounded" onClick={onClick}>
      {texto}
    </button>
  );
}

// Uso del componente
<MiBoton texto="Guardar" onClick={() => console.log('Click!')} />
```

## Hooks de React
Los Hooks son funciones que permiten a los componentes tener "superpoderes" (estado, efectos).

### 1. `useState` (Estado Local)
Permite que el componente "recuerde" información.
```tsx
const [contador, setContador] = useState(0);
// contador: valor actual
// setContador: función para cambiarlo
```

### 2. `useEffect` (Efectos Secundarios)
Ejecuta código cuando algo cambia (ej: cargar datos al iniciar).
```tsx
useEffect(() => {
  console.log('El componente se montó o el contador cambió');
}, [contador]); // Array de dependencias
```

## Custom Hooks (Hooks Personalizados)
En tu proyecto, hemos creado hooks propios para reutilizar lógica compleja.

### `useAuth` (`src/hooks/use-auth.ts`)
*   **Función:** Nos da acceso al usuario logueado desde cualquier parte.
*   **Uso:**
    ```tsx
    const { user, login, logout } = useAuth();
    ```

### `useUserProfile` (`src/hooks/use-user-profile.ts`)
*   **Función:** Una capa extra sobre `useAuth` para facilitar el acceso a datos específicos como `idPaciente` o `idMedico`.
*   **Uso:**
    ```tsx
    const { idPaciente, nombreCompleto } = useUserProfile();
    ```

### `useToast` (`src/hooks/use-toast.ts`)
*   **Función:** Mostrar notificaciones emergentes.
*   **Uso:**
    ```tsx
    const { toast } = useToast();
    toast({ title: "Éxito", description: "Guardado correctamente" });
    ```
