# Estado inicial — Proyecto 3 (E1)

**Base inspeccionada:** ZIP `Entregable3_MartinBastidas.zip`, código y migración incluidos. Este registro se construyó **antes del código de E2** mediante inspección asistida; la revisión personal del estudiante en Claude Code *plan mode* sigue siendo una validación de proceso pendiente, no una actividad que se afirme ejecutada.

## Qué hace

- Autenticación con correo/contraseña Supabase (`AuthContext`, login, registro, logout); rutas protegidas.
- Catálogo: búsqueda TMDB de películas y series, espera de 400 ms, carga y errores, póster y detalles.
- Lista propia en Supabase: agregar, eliminar, ver detalle, editar estado (por ver / viendo / vista), nota 1–5 y comentario.
- Filtros y orden en «Mi lista»; resumen por estado.
- Rutas: `/`, `/login`, `/registro`, `/mi-lista`, `/mi-lista/:id`.

## Stack y arquitectura realmente observados

React 18 + TypeScript estricto + Vite 5 + React Router 6 + `@supabase/supabase-js` 2. TMDB v3 por `fetch` en `src/services/tmdb.ts`. `src/services/miLista.ts` separa la persistencia. Contextos Auth / MiLista administran estado. `src/index.css` define un **tema oscuro CSS propio** (marfil, dorado, carbón). Hay clases `.btn` y `.btn-primary`, pero **no está instalada ni importada la librería Bootstrap en E1**. El enunciado E4 presupone Bootstrap; se incorporará de forma progresiva para E2 manteniendo la apariencia de E1.

## Base de datos actual

`supabase/migrations/001_mi_lista.sql`: tabla `public.mi_lista` con `user_id`, `tmdb_id`, tipo, estado, calificación, comentario, fecha; `unique(user_id,tmdb_id,tipo_contenido)`; RLS SELECT/INSERT/UPDATE/DELETE con `auth.uid() = user_id`.

## Inconsistencias y riesgos detectados

1. El proyecto original no usa Bootstrap a pesar de la premisa de E4 (decisión: incorporarlo sin rehacer E1).
2. El `.git` de origen llegó con archivos `.vite/deps` versionados, que son caché; excluirlos desde el harness.
3. No había harness de Claude, PRD, tickets, spec de E2, tests unitarios ni documentación de diseño.
4. El servicio TMDB obtiene detalles pero **no extrae `runtime`** de películas; no sirve aún para E2.
5. `AuthContext` depende de la respuesta de `getSession` sin un `catch` explícito: riesgo de estado indefinido cuando falla la inicialización (deuda heredada; no modificar E1 sin ticket).
6. `ListaDetailPage` no muestra indicador de carga para la petición TMDB (deuda heredada).
7. Borrados/ediciones de E1 dependen de RLS; el cliente no muestra una comprobación de filas afectadas para delete (deuda heredada).
8. `.env` estaba presente en el ZIP local: debe **excluirse** de toda entrega y nunca subirse a Git.
9. No había evidencia de pruebas E2 con dos usuarios ni de una migración aplicada remotamente.

## Backlog de deuda heredada (no abordar en E2)

- [ ] Manejar fallo de `getSession` y estado de autenticación.
- [ ] Estados de carga de detalles TMDB E1.
- [ ] Confirmar filas afectadas al borrar/editar E1.
- [ ] Revisar compatibilidad responsive/capturas después de importar Bootstrap.
- [ ] Agregar tests E1 en entrega posterior (se conserva funcionalidad y archivos).

## Invariantes de no regresión

Login, registro, logout, consulta del catálogo, CRUD de lista, filtros, notas/comentarios y detalle deben seguir operativos con la misma base `mi_lista` y las mismas rutas. E2 se implementa como ruta + servicios + dominio + migración nueva, sin modificar la tabla E1.
