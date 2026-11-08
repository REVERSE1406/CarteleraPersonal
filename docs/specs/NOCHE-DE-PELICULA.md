# Especificación verificable · E2 Noche de película

**Base:** `docs/prd/PRD.md`, `docs/backlog/HISTORIAS.md` y **`DESIGN.md`**. Esta spec fue registrada antes de los archivos E2 que implementan sus tickets. **No duplicar valores visuales del diseño:** ver `DESIGN.md` y brand board.

## Modelo de datos y seguridad

**Migración:** `supabase/migrations/002_noche_pelicula.sql` (no modifica E1).

Tabla `public.sesiones_noche`:

| Campo | Tipo | Contrato |
| --- | --- | --- |
| id | uuid PK | generado por servidor |
| user_id | uuid FK auth.users | dueño, no nulo |
| nombre | text | 1–80 caracteres, por defecto nombre propuesto |
| tiempo_disponible | integer | 30–600 minutos |
| pausa_minutos | integer | **10** exactos |
| duracion_total | integer | duración de todas más pausas, menor o igual al disponible |
| peliculas | jsonb array | snapshot ordenado de `{lista_id,tmdb_id,titulo,poster_url,duracion_minutos}` |
| creada_en | timestamptz | servidor; orden descendente |

RLS habilitado: SELECT solo si `auth.uid() = user_id`. **Sin políticas INSERT/UPDATE/DELETE para usuarios**; la tabla es de solo lectura desde el cliente. Persistencia mediante función SQL **`guardar_noche`** con ejecución autorizada a `authenticated`, `SECURITY DEFINER`, `search_path` cerrado, y verificaciones explícitas de `auth.uid()`, propiedad, `tipo_contenido='pelicula'`, `estado='por_ver'`, duración positiva, unicidad de IDs y límite con pausas. El servidor construye los snapshots usando los títulos de `mi_lista`, no títulos enviados por cliente. No existe función para editar/borrar sesiones. Una película eliminada más tarde sigue representada en el snapshot guardado. Esto facilita verificación de lectura aislada con dos cuentas. **Límite técnico aceptado:** una duración mal declarada por un cliente manipulado podría ser distinta de TMDB; el servidor solo puede validar tiempo a partir de duraciones recibidas, puesto que no consulta TMDB. Esto deja fuera la verificación independiente del runtime con infraestructura externa.

## Funciones puras de dominio

`src/dominio/nocheDePelicula.ts`:

- `validarTiempoDisponible(entrada: string | number): {valido:boolean; minutos:number|null; mensaje:string|null}`; exige enteros de 30–600.
- `calcularSesion(duraciones: readonly (number|null)[], pausa=10): {valida:boolean; totalMinutos:number; pausasMinutos:number; mensaje:string|null}`; estricta, no red ni DB, `total = sum(runtimes) + pausa * max(0,n-1)`; desconocido o no entero positivo invalida.
- `evaluarAgregar(actual: readonly (number|null)[], candidata: number|null, disponible: number, pausa=10): {cabe:boolean; totalPropuesto:number; faltanMinutos:number; motivo:string|null}`; exacto aceptado.

Vitest incluye: igualdad, una sola sin pausa, desconocida, `0`, límite 29/30/600/601, decimales, pausas en múltiples títulos, excedente, vacío y duplicidad controlada en UI/servidor.

## Servicios y contratos

- `src/services/tmdb.ts`: añadir `fetchTmdbMovieRuntime(tmdbId,signal)` sobre detalle `/movie/{id}`; duración `runtime` positiva entera o `null`; abortar respetando `AbortSignal`; errores como `TmdbError`.
- `src/services/nocheDePelicula.ts`: `fetchSesionesNoche()` select propio por RLS + parse validado de respuesta; `guardarSesionNoche()` RPC con IDs y duraciones en orden. No hay clave privada.
- `src/types/nocheDePelicula.ts`: candidatos, snapshot, sesión, petición y tipos de error, sin `any`.
- `MiListaContext` provee títulos E1 sin cambiar su funcionalidad. El estado de la UI es local a E2.

## Componentes / navegación

- `src/App.tsx`: ruta `/noche-de-pelicula` dentro de `ProtectedRoute` y `Layout` existentes.
- `src/components/Layout.tsx`: nuevo enlace «Noche de película».
- `src/pages/NocheDePeliculaPage.tsx`: orquesta estado local, consulta duración por servicio en lotes, lista por tiempo, selector, indicadores carga/error, guardado y sesiones. React no importa `supabaseClient` ni usa `fetch` a TMDB directamente.
- `src/noche.css`: presentación responsive Bootstrap 5 y personalización que respeta `DESIGN.md`; `src/main.tsx` importa Bootstrap antes de los estilos locales.

## Requisitos DEBE / NO DEBE

- **DEBE** bloquear usuarios anónimos, minutos inválidos, series, películas vistas, películas sin runtime y sesión vacía.
- **DEBE** computar pausa de 10 solamente entre películas y permitir límite exacto.
- **DEBE** guardar nombre/fecha/títulos/duraciones en orden, conservar selección en error y mostrar evidencia de guardado solo si servidor confirma.
- **DEBE** revalidar propiedad y estado en base de datos, aun si se llama al RPC manualmente.
- **NO DEBE** alterar `mi_lista` al guardar, permitir insertar directamente una sesión ajena, usar claves privadas en el frontend, inventar runtime, ni ofrecer series o recomendaciones nuevas.
- **NO DEBE** repetir una película dentro de la sesión, editar sesión guardada ni borrar la sesión por borrar un título de E1.

## Trazabilidad criterio → verificación

| Criterio | Verificación |
| --- | --- |
| E2-01 | V01 abrir ruta con/sin login |
| E2-02 | V02 ingreso `29`, `30`, `600`, `601`, `30.5`, vacío |
| E2-03 | V03 mezcla series/películas y estados, usuario A/B |
| E2-04 | V04 runtime y orden ascendente en lista |
| E2-05 | V05 película TMDB sin runtime |
| E2-06 | V06 red lenta / desconectada, reintentar |
| E2-07 | V07 dos películas y suma con 10 min |
| E2-08 | V08 superar tiempo y mensaje |
| E2-09 | V09 igualdad exacta en Vitest y UI |
| E2-10 | V10 película única, cambiar minutos/estado |
| E2-11 | V11 guardar y consultar estados en E1 |
| E2-12 | V12 cargar historial, eliminar película de lista |
| E2-13 | V13 SELECT y RPC entre cuentas A/B; revocación de direct write |
| E2-14 | V14 sesión nueva con título ya usado; duplicar dentro de sesión |
| E2-15 | V15 provocar error en guardado y reintentar |
| UI-01 | V16 revisar secciones de pantalla |
| UI-02 | V17 tamaños 320, 768, 1440 px sin desbordar |
| UI-03 | V18 comparar visualmente con E1 |
| UI-04 | V19 estados de carga/error/vacío/éxito |
| UI-05 | V20 inactivos con motivo textual |
| UI-06 | V21 navegación Tab/Enter/Espacio, enfoque visible |

## Trazabilidad ticket → archivos

| Ticket | Archivos principales |
| --- | --- |
| E2-01 | `src/dominio/nocheDePelicula.ts`, `src/dominio/nocheDePelicula.test.ts`, `package.json`, `package-lock.json`, `vite.config.ts` |
| E2-02 | `supabase/migrations/002_noche_pelicula.sql`, `docs/PRUEBA-RLS.md` |
| E2-03 | `src/types/nocheDePelicula.ts`, `src/services/nocheDePelicula.ts`, `src/services/tmdb.ts` |
| E2-04 | `src/pages/NocheDePeliculaPage.tsx`, `src/App.tsx`, `src/components/Layout.tsx`, `src/main.tsx`, `src/noche.css` |
| E2-05 | `src/pages/NocheDePeliculaPage.tsx` (guardar, historial, detalles) |
| E2-06 | `docs/VERIFICACION.md`, `docs/AUDITORIA.md`, `README.md` |
