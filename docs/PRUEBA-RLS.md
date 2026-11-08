# Protocolo RLS · Dos cuentas independientes

**Estado actual:** migración creada en repositorio, pero **no se ha ejecutado en Supabase remoto** desde este entorno. Debe aplicarse en SQL Editor y realizarse esta prueba con dos sesiones reales; no confundir scripts escritos con evidencia de ejecución.

## Preparación

1. En Supabase SQL Editor ejecutar **001** si la tabla `mi_lista` no existe; ejecutar **002**.
2. Crear dos usuarios A y B con emails distintos (sin escribir contraseñas en Git).
3. Con A: guardar una película `por_ver` con runtime conocido; desde UI generar una sesión.
4. Con B: abrir «Noche de película»: el listado de sesiones debe estar vacío si B no guardó ninguna.
5. Desde navegador de B, intentar leer la sesión de A mediante el cliente autenticado y filtro `id = A_ID`: deben devolverse **0 filas**.
6. Desde B, intentar RPC `guardar_noche` usando el `lista_id` de A: debe devolver error de pertenencia, aunque el frontend de B no muestre el ID.
7. Desde B, intentar INSERT/UPDATE/DELETE directos contra `sesiones_noche`: la API debe rechazar por permisos, no solo ocultarlo en UI.
8. Desde A: confirmar que su sesión aún existe y los títulos E1 aún están «por ver».

## Consultas administrativas de inspección (SQL Editor)

```sql
-- RLS encendido y políticas de lectura por dueño:
select relname, relrowsecurity from pg_class where oid = 'public.sesiones_noche'::regclass;
select policyname, cmd, roles, qual from pg_policies where schemaname = 'public' and tablename = 'sesiones_noche';

-- Grants (no INSERT / UPDATE / DELETE para authenticated):
select grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'sesiones_noche';
```

## Evidencia a insertar antes de entregar

- [ ] A: captura del plan guardado y resultado SELECT con cuenta A.
- [ ] B: captura o consola con SELECT ajeno devolviendo 0 filas.
- [ ] B: error del RPC con `lista_id` ajeno.
- [ ] B: error de INSERT directo.
- [ ] A: lista E1 mantiene «por ver».

**No usar SQL Editor con privilegios de administrador como prueba de aislamiento**, porque puede saltarse RLS. Usar tokens reales de los usuarios autenticados.
