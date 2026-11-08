# Reglas del agente — Mi Cartelera Personal

1. **Ninguna funcionalidad sin spec**: revisar `docs/specs/` antes de editar `src/` o SQL.
2. Leer `docs/ESTADO-INICIAL.md`, `docs/prd/` y `DESIGN.md` antes de proponer cambios.
3. Mantener E1 (búsqueda, autenticación, lista, edición, detalle); no reescribir el Proyecto 3.
4. Cada cambio de E2 debe corresponder a un ticket de `docs/backlog/TICKETS.md`.
5. Crear/ajustar primero el documento y después el código; un commit por ticket.
6. La regla «cabe» es pura y vive en `src/dominio/`; probar bordes con Vitest.
7. Los componentes React no importan `supabaseClient` ni llaman a TMDB directamente.
8. Separar presentación, dominio, servicios y contratos de datos. No utilizar `any`.
9. Supabase: RLS real y comprobación explícita de `auth.uid()`; nunca confiar solo en filtros UI.
10. Claves: `.env` local ignorado; `.env.example` contiene SOLO valores ficticios.
11. NO guardar `service_role`, tokens privados, contraseñas ni secretos en Git, docs o logs.
12. Las `VITE_*` del cliente son públicas: usar solamente key publicable/anon de Supabase.
13. La película sin `runtime` de TMDB no se selecciona; pausas de 10 min entre títulos.
14. Seguir `DESIGN.md` para Bootstrap, estilos y accesibilidad.
15. Ejecutar `npm run test`, `npm run build` y registrar resultados reales en `docs/VERIFICACION.md`.
16. Si depende de Supabase remoto, no afirmar pruebas que no se hayan ejecutado.
17. Usar la skill `/commit` para verificar el ticket antes de registrar cambios.
