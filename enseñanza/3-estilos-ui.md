# 🎨 Estilos y UI (Tailwind + Shadcn)

Este documento explica cómo hacemos que la aplicación se vea bien.

## Tailwind CSS
En lugar de escribir archivos `.css` separados, usamos clases directamente en el HTML (JSX).

### Ejemplo Comparativo
**CSS Tradicional:**
```css
.boton {
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
```

**Tailwind CSS:**
```tsx
<button className="bg-blue-500 text-white p-2 rounded">Click</button>
```

### Ventajas
*   **Rapidez:** No tienes que inventar nombres de clases.
*   **Consistencia:** Usas una paleta de colores y espaciados predefinidos.
*   **Responsivo:** Es fácil hacer cambios para móvil.
    *   `w-full`: Ancho completo siempre.
    *   `md:w-1/2`: Ancho mitad solo en pantallas medianas (Desktop) en adelante.

## Shadcn/ui
No construimos todos los componentes desde cero. Usamos una librería llamada **Shadcn/ui**.
*   **Ubicación:** `src/components/ui/`
*   **Filosofía:** Te da el código fuente del componente (ej: `button.tsx`, `card.tsx`) para que lo tengas en tu proyecto y lo puedas modificar si quieres.

### Componentes Clave que Usamos
1.  **Card:** Para agrupar información (Dashboard).
2.  **Button:** Botones con estilos consistentes.
3.  **Input / Form:** Campos de texto y validación.
4.  **Dialog:** Ventanas modales (Popups).
5.  **Toast:** Notificaciones flotantes.

### Iconos (Lucide React)
Usamos la librería `lucide-react` para los iconos.
```tsx
import { HeartPulse } from 'lucide-react';
<HeartPulse className="h-6 w-6 text-red-500" />
```
