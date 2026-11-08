# Verificación de E2 · Resultados reales

**Fecha de verificación local:** 8 de noviembre de 2026. **Resultado obtenido** significa evidencia observada, no un resultado supuesto. El navegador con sesión real, consulta TMDB, escritura en Supabase y pruebas entre usuarios **NO** se ejecutaron en este entorno.

## Comprobaciones técnicas ejecutadas

| Comando / actividad | Resultado obtenido | Evidencia |
| --- | --- | --- |
| `tsc --noEmit -p tsconfig.json` | **PASS** (salida vacía, exit code 0) | TypeScript E1+E2 sin errores; tests Vitest se excluyen del build de app |
| `node --experimental-strip-types scripts/test-dominio.mjs` | **PASS: 21 comprobaciones** | Contiene límites 29/30/600/601, pausa, igualdad, nula, excedente |
| `npm run test` | **SIN EJECUTAR**: Vitest no pudo instalarse desde npm en este entorno sin conexión DNS | Ejecutarlo tras `npm install` en máquina con red |
| `npm run build` (Vite) | **NO COMPLETADO**: módulo nativo Linux de Rollup ausente en dependencias extraídas de ZIP de macOS | Ejecutar `npm install && npm run build` en Mac |
| Migración `002_noche_pelicula.sql` en Supabase | **SIN VERIFICAR**: no acceso a dashboard remoto desde este proyecto ZIP | Ejecutar SQL Editor y capturar resultado |
| Prueba dos cuentas y navegador | **SIN VERIFICAR**: requiere credenciales y sesión real | Ver `docs/PRUEBA-RLS.md` |
| Comparación de rutas E1 | **Revisión estática PASS**, funcional pendiente | E1 no fue reescrito; rutas existentes siguen configuradas |

## Verificación manual V01–V21

| ID / criterio | Pasos en navegador o DB | Resultado obtenido |
| --- | --- | --- |
| V01 / E2-01 | Logout, abrir `/noche-de-pelicula` y luego login | **SIN VERIFICAR**; guard `ProtectedRoute` presente en código |
| V02 / E2-02 | Probar minutos `29`, `30`, `600`, `601`, decimal y vacío | **DOMINIO PASS**; interacción visual sin verificar |
| V03 / E2-03 | Mezclar series y películas vistas/por ver; repetir con B | **SIN VERIFICAR**; filtro en pantalla y RPC SQL |
| V04 / E2-04 | Revisar orden de 3 títulos y sus runtime TMDB | **SIN VERIFICAR**; sort escrito |
| V05 / E2-05 | Consultar película sin runtime, comprobar motivo y botón | **SIN VERIFICAR**; ruta de código escrita |
| V06 / E2-06 | DevTools offline/throttling, observar carga/error/reintento | **SIN VERIFICAR**; estados y botón implementados |
| V07 / E2-07 | Elegir 60+60 y 130 libres, comprobar pausa 10 | **DOMINIO PASS**; interacción visual sin verificar |
| V08 / E2-08 | Elegir 60+60 con solo 120 disponibles | **DOMINIO PASS**; interacción visual sin verificar |
| V09 / E2-09 | Elegir total exactamente igual a 130 | **DOMINIO PASS**; interacción visual sin verificar |
| V10 / E2-10 | Solo 120 min; cambiar 130 a 120 con dos títulos | **DOMINIO PASS** para pausa; interacción sin verificar |
| V11 / E2-11 | Guardar, volver a «Mi lista», observar estado | **SIN VERIFICAR**; RPC solo inserta sesiones |
| V12 / E2-12 | Guardar, borrar título de lista, abrir sesión antigua | **SIN VERIFICAR**; snapshot JSON SQL presente |
| V13 / E2-13 | A/B SELECT, RPC ajeno, INSERT directo | **SIN VERIFICAR**; leer `docs/PRUEBA-RLS.md` |
| V14 / E2-14 | Repetir película entre sesiones / no duplicar en una | **SIN VERIFICAR**; selección y validación SQL presentes |
| V15 / E2-15 | Fallar red al guardar, observar error, reintentar | **SIN VERIFICAR**; catch y estado preservado en código |
| V16 / UI-01 | Ver encabezado, tiempo, opciones, selección, guardadas | **Revisión estática PASS**; navegador sin verificar |
| V17 / UI-02 | Revisar 320/768/1440 px, scroll horizontal | **SIN VERIFICAR**; media query en CSS |
| V18 / UI-03 | Comparar colores/tipografía con E1 | **Revisión estática PASS**; visual sin verificar |
| V19 / UI-04 | Simular carga/error/vacío/éxito en UI | **SIN VERIFICAR**; estados en JSX |
| V20 / UI-05 | Revisar bloqueo y motivo de película sin tiempo | **Revisión estática PASS**; navegador sin verificar |
| V21 / UI-06 | Tab/Enter/Espacio por formulario/botones | **SIN VERIFICAR**; foco CSS y HTML semántico presentes |

## Campos para completar desde el navegador (obligatorios para máxima nota)

- **Navegador y sistema:** ____________________
- **Usuario A / B (identificadores NO secretos):** ____________________
- **Capturas del flujo E2 / URLs de evidencia:** ____________________
- **Resultado de `npm run test`:** ____________________
- **Resultado de `npm run build`:** ____________________
- **Resultado de aplicar migración 002:** ____________________
- **Evidencias V01–V21 corregidas y confirmadas:** ____________________

No marcar pruebas remotas como aprobadas hasta obtener evidencias reales.
