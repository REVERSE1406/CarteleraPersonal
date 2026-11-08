# Checkpoints del Entregable 4

Los hashes son commits **locales existentes en este ZIP**, conservando el historial original del Proyecto 3. Para entregar en D2L, subir el repositorio a GitHub y pegar el enlace al commit correspondiente y una nota breve. **No afirmar que los checkpoints ya fueron enviados.**

## Checkpoint 1 · Harness, estado inicial, diseño

**Commit:** `5d56fa1` — `docs: definir sistema de diseño y brand board de E2`

**Nota propuesta:** Se preparó el harness con reglas/skill/hook, documenté lo que ya existía en Proyecto 3, la deuda técnica y las diferencias con Bootstrap. Dejé DESIGN.md y brand board. Pendiente: validar el hook en Claude Code y hacer revisión personal en plan mode.

## Checkpoint 2 · Especificación

**Commit:** `4285b78` — `docs(spec): especificar contratos, datos, RLS y trazabilidad E2`

**Nota propuesta:** PRD de E1/E2 y decisiones justificadas; 3 historias, criterios de aceptación, poke-holes, tickets y spec completa con datos, servicios, dominio, RLS y verificación. No se ha añadido código E2 hasta ese commit.

## Checkpoint 3 · Implementación

**Commit:** `5c2fb58` — `feat(E2-05): guardar sesiones, consultar historial y errores`

**Nota propuesta:** Se añadieron reglas puras y pruebas, SQL/RLS y RPC, servicios de TMDB/Supabase y la pantalla con formulario, selección, guardado e historial. Pendiente: ejecutar la migración en la cuenta Supabase, comprobar RLS con dos usuarios y verificar en navegador.

## Entrega final

**Commit:** consultar `git log -1 --oneline` después de todos los commits de documentación/auditoría. Fecha límite de la consigna: **11 de noviembre de 2026, 23:59**. Revisar D2L para formato de los enlaces.
