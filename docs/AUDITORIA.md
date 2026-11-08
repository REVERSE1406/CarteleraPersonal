# Auditoría final de especificación E2

**Semántica:** «cumple» = comprobado en código o tests locales con evidencia indicada; «sin verificar» = pendiente de navegador, Supabase o ejecución de tests remota; «no cumple» = falta conocida. No equiparar «implementado» con «probado en producción». Fecha: 2026-11-08.

## Harness, documentación y calidad

| Requisito | Estado | Evidencia / observación |
| --- | --- | --- |
| Harness AGENTS <=40 líneas, reglas de claves y spec | **cumple** | `AGENTS.md`, 19 líneas |
| CLAUDE.md importa reglas | **cumple** | `CLAUDE.md` importa `@AGENTS.md` |
| Skill `/commit` sin invocación automática | **cumple** (estático) | `.claude/skills/commit/SKILL.md` |
| Hook PostToolUse con Prettier | **cumple** (configuración) | `.claude/settings.json`, `format-prettier.mjs` ; ejecución real en Claude Code **sin verificar** |
| ESTADO-INICIAL preciso y deuda | **cumple** (revisión estática) | `docs/ESTADO-INICIAL.md`; plan mode personal **sin verificar** |
| PRD E1+E2 y cinco decisiones | **cumple** | `docs/prd/PRD.md` |
| 3 historias, criterios D/C/E e INVEST | **cumple** | `docs/backlog/HISTORIAS.md` |
| Poke-holes aceptados/rechazados justificados | **cumple** | `docs/backlog/REFINAMIENTO.md` |
| Tickets con tipo/DoD/dependencias | **cumple** | `docs/backlog/TICKETS.md` |
| Spec datos/RLS/dominio/servicios/criterios/trazabilidad | **cumple** | `docs/specs/NOCHE-DE-PELICULA.md` |
| DESIGN.md, brand board, UI verificable | **cumple** (estático) | `DESIGN.md`, `docs/diseno/brand-board.html` |
| Reglas puras, sin `any` explícitos | **cumple** | `src/dominio/nocheDePelicula.ts`; TypeScript strict PASS |
| Tests Vitest escritos y todos los bordes | **cumple** (cobertura escrita) | `src/dominio/nocheDePelicula.test.ts` ; ejecución Vitest **sin verificar** |
| 21 pruebas de dominio ejecutadas | **cumple** | `npm run test:offline`: PASS 21 |
| Proyecto 3 preservado | **cumple** (código original conservado) | Mismas rutas E1 / migración E1; regresión manual **sin verificar** |
| Historial docs antes de E2 y ticket por commit | **cumple** localmente | `git log --oneline`; subir a GitHub **sin verificar** |
| README y guías de ejecución | **cumple** | `README.md`, `docs/PRUEBA-RLS.md` |

## Auditoría criterio por criterio

| Criterio | Estado | Evidencia de implementación / pendiente |
| --- | --- | --- |
| E2-01 | **sin verificar** | `App.tsx`, `ProtectedRoute.tsx`; prueba ruta pendiente |
| E2-02 | **cumple** (dominio) | `validarTiempoDisponible`, 21 checks; prueba UI pendiente |
| E2-03 | **sin verificar** | `NocheDePeliculaPage.tsx` filtro, servidor SQL estado; datos reales pendientes |
| E2-04 | **sin verificar** | `fetchTmdbMovieRuntime`, `.sort`, duración visible; TMDB real pendiente |
| E2-05 | **sin verificar** | runtime `null`, no disponible, botón inactivo; TMDB real pendiente |
| E2-06 | **sin verificar** | estados loading/error/retry JSX; DevTools pendiente |
| E2-07 | **cumple** (dominio) | `calcularSesion`, prueba [60,60] = 130; UI pendiente |
| E2-08 | **cumple** (dominio) | `evaluarAgregar`, 10 min excedente; UI pendiente |
| E2-09 | **cumple** (dominio) | prueba igualdad 130 y 120; UI pendiente |
| E2-10 | **cumple** (dominio) | prueba sola película; recálculo de UI pendiente |
| E2-11 | **sin verificar** | `guardar_noche` SQL, `guardarSesionNoche` servicio; INSERT real pendiente |
| E2-12 | **sin verificar** | `peliculas` snapshot, historial `details`; Supabase real pendiente |
| E2-13 | **sin verificar** | RLS y permisos SQL escritos; demo con dos cuentas obligatoria |
| E2-14 | **sin verificar** | guard SQL bloquea duplicado, UI selección única; prueba real pendiente |
| E2-15 | **sin verificar** | `try/catch` del guardado + reintento manual; simular error pendiente |
| UI-01 | **cumple** (código) | secciones 01–04 presentes |
| UI-02 | **sin verificar** | Bootstrap 5 y @media; probar 320–1440 px |
| UI-03 | **sin verificar** | `src/noche.css` tema heredado; comparación visual pendiente |
| UI-04 | **cumple** (código) | mensajes de estado, error, éxito, vacíos |
| UI-05 | **cumple** (código) | razón textual sin runtime/tiempo, controles bloqueados |
| UI-06 | **sin verificar** | controles HTML accesibles y `:focus-visible`; teclado pendiente |

## Riesgos/bloqueos de máxima calificación

1. **Supabase remoto:** no se pudo aplicar `002` desde este entorno. La app E2 no puede guardar/cargar de verdad hasta que se aplique.
2. **RLS con dos cuentas:** políticas escritas y lectura protegida, pero no se ha probado con A/B; prueba imprescindible según rúbrica.
3. **Instalación de dependencias:** ZIP inicial incluía paquetes macOS, este entorno Linux no puede ejecutarlos y no hubo DNS hacia npm. `tsc` pasó con dependencias JS extraídas, **Vite build y Vitest requieren `npm install` limpio** en equipo con internet.
4. **Historial remoto / checkpoints D2L:** commits locales listos; subir a GitHub, capturar links y notas corresponde al estudiante.
5. **Plan mode y verificación personal:** documentación inicial revisada asistidamente; no atribuir falsamente ejecución de Claude Code ni resultados personales del estudiante.
6. **Validación runtime manipulable:** RPC verifica tiempos a partir del runtime enviado, pero no puede contrastar TMDB desde SQL. No alcanza opcional de verificación del runtime en servidor de forma independiente.

**Conclusión:** documentación, código E2 y checks de dominio preparados y trazados. **No afirmar 100% funcional/auditado** hasta resolver las comprobaciones de navegador, RLS y build listadas.
