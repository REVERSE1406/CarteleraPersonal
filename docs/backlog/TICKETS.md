# Backlog y tickets · E2

**DoD global de cada ticket:** implementación alineada con docs ya aprobados, TypeScript sin `any`, revisión de diff, ausencia de secretos en Git, commit con ID, tests/build si corresponden, criterio trazado en spec. Los tickets se construyen en orden, sin modificar E1 excepto navegación y compatibilidad de estilos.

| Ticket | Tipo | Dependencias | Alcance / criterios | Definition of Done específica |
| --- | --- | --- | --- | --- |
| **E2-01** | feat(domain), test | PRD, DESIGN, spec | E2-02,07–10,14 | Funciones puras `validarTiempo`, `calcularSesion`, `evaluarAgregar`; tests de límites, sin duración, pausa e igualdad; Vitest configurado y ejecutado. |
| **E2-02** | feat(db), security | E2-01 | E2-11–14 | Migración no destructiva con RLS, función segura de guardado que valida identidad, lista, estado y duración. Documentar ejecución real pendiente si no hay acceso a Supabase. |
| **E2-03** | feat(services) | E2-01, E2-02 | E2-03–06,11–13,15 | Servicio TMDB de runtime, servicio persistencia y tipos sin `any`; UI no hace llamadas externas directas. |
| **E2-04** | feat(ui) | E2-01, E2-03, DESIGN | E2-01–10, UI-01–06 | Ruta protegida, listado ordenado, errores/cargas, selector, total y restante, accesibilidad y Bootstrap. |
| **E2-05** | feat(ui) | E2-02–04 | E2-11–15, UI-01–06 | Guardar, mensajes, reintento y consultar detalle de planes; no cambia estados de E1. |
| **E2-06** | docs(verify) | E2-01–05 | todos | README y documentos de verificación/auditoría con resultado obtenido explícito o «sin verificar»; guion de prueba con cuentas A/B. |

**Secuencia recomendada de commits:** harness → estado inicial → diseño → PRD → historias/refinamiento/tickets → spec → E2-01 → E2-02 → E2-03 → E2-04 → E2-05 → E2-06. Los checkpoints 1–3 pueden identificarse con esos hashes; publicar los hashes en D2L corresponde al estudiante.
