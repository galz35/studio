# ⚛️ Introducción a Next.js y el Frontend

Este documento explica cómo está construido el frontend de tu proyecto (`studio`) utilizando **Next.js 14 (App Router)**.

## ¿Qué es Next.js?
Es un framework de React para producción. Nos da enrutamiento, optimización de imágenes y renderizado híbrido (Servidor + Cliente) "gratis".

## Estructura de Carpetas (`src/app`)
En Next.js App Router, **las carpetas son las rutas**.

*   `src/app/page.tsx` -> Es la página de inicio (`/`).
*   `src/app/login/page.tsx` -> Es la ruta `/login`.
*   `src/app/paciente/dashboard/page.tsx` -> Es la ruta `/paciente/dashboard`.

### Archivos Especiales
*   `page.tsx`: La interfaz visual de la ruta.
*   `layout.tsx`: El diseño compartido (barra de navegación, footer) que envuelve a las páginas.
*   `loading.tsx`: Se muestra automáticamente mientras la página carga.
*   `not-found.tsx`: Se muestra si la ruta no existe (Error 404).

## Server Components vs Client Components
Esta es la distinción más importante en Next.js moderno.

### 1. Server Components (Por defecto)
*   **Se renderizan en:** El Servidor.
*   **Ventaja:** Más rápidos, mejor SEO, acceso directo a BD (aunque aquí usamos API).
*   **Limitación:** No pueden usar `useState`, `useEffect` ni eventos como `onClick`.
*   **Uso:** Páginas estáticas, layouts, fetch de datos inicial.

### 2. Client Components (`"use client"`)
*   **Se renderizan en:** El Navegador (y pre-render en servidor).
*   **Ventaja:** Interactividad total (botones, formularios, hooks).
*   **Cómo usarlos:** Debes poner `"use client";` en la primera línea del archivo.
*   **Ejemplo:** `src/components/paciente/SolicitudCitaWizard.tsx` (necesita estado para el paso a paso).

## Grupos de Rutas `(folder)`
Verás carpetas con paréntesis, como `(main)` o `(auth)`.
*   **Función:** Organizar archivos sin afectar la URL.
*   `src/app/(auth)/login/page.tsx` -> La URL sigue siendo `/login`, no `/(auth)/login`.
*   Nos permite tener un `layout.tsx` diferente para el Login (sin barra lateral) y otro para el Dashboard (con barra lateral).
