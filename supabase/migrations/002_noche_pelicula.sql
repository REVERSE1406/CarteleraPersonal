-- E2 · Planes personales inmutables; aplicar DESPUÉS de 001_mi_lista.sql.
-- Se guarda una instantánea de las películas para que sobreviva a su borrado de mi_lista.
create table if not exists public.sesiones_noche (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 80),
  tiempo_disponible integer not null check (tiempo_disponible between 30 and 600),
  pausa_minutos integer not null default 10 check (pausa_minutos = 10),
  duracion_total integer not null check (duracion_total > 0 and duracion_total <= tiempo_disponible),
  peliculas jsonb not null check (jsonb_typeof(peliculas) = 'array' and jsonb_array_length(peliculas) > 0),
  creada_en timestamptz not null default now()
);

create index if not exists sesiones_noche_usuario_fecha_idx
  on public.sesiones_noche (user_id, creada_en desc);

alter table public.sesiones_noche enable row level security;

create policy "Leer solo sesiones propias" on public.sesiones_noche
  for select to authenticated using ((select auth.uid()) = user_id);

-- No hay permisos de escritura directa para el cliente; solo RPC validada.
revoke all on table public.sesiones_noche from anon, authenticated;
grant select on table public.sesiones_noche to authenticated;

create or replace function public.guardar_noche(
  p_nombre text,
  p_tiempo_disponible integer,
  p_lista_ids uuid[],
  p_duraciones integer[]
)
returns public.sesiones_noche
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario uuid := auth.uid();
  v_nombre text := coalesce(nullif(btrim(p_nombre), ''), 'Noche de película');
  v_cantidad integer := coalesce(cardinality(p_lista_ids), 0);
  v_cantidad_encontrada integer;
  v_cantidad_unica integer;
  v_suma integer;
  v_total integer;
  v_snapshot jsonb;
  v_fila public.sesiones_noche%rowtype;
begin
  if v_usuario is null then
    raise exception 'Debes iniciar sesión para guardar una noche.' using errcode = '28000';
  end if;

  if p_tiempo_disponible is null or p_tiempo_disponible not between 30 and 600 then
    raise exception 'El tiempo debe estar entre 30 y 600 minutos.' using errcode = '22023';
  end if;
  if char_length(v_nombre) not between 1 and 80 then
    raise exception 'El nombre debe tener entre 1 y 80 caracteres.' using errcode = '22023';
  end if;
  if v_cantidad < 1 or v_cantidad <> coalesce(cardinality(p_duraciones), 0) then
    raise exception 'Elige al menos una película y proporciona sus duraciones.' using errcode = '22023';
  end if;

  select count(distinct entrada.lista_id)
    into v_cantidad_unica
    from unnest(p_lista_ids) as entrada(lista_id);
  if v_cantidad_unica <> v_cantidad then
    raise exception 'No puedes repetir una película en la misma sesión.' using errcode = '22023';
  end if;

  -- Las fichas se leen de la lista real del usuario, no del título enviado por el navegador.
  with entrada as (
    select p_lista_ids[indice] as lista_id, p_duraciones[indice] as runtime, indice as orden
    from generate_subscripts(p_lista_ids, 1) as indice
  ), permitidas as (
    select e.orden, e.runtime, l.id, l.tmdb_id, l.titulo, l.poster_url
    from entrada e
    inner join public.mi_lista l on l.id = e.lista_id
    where l.user_id = v_usuario and l.tipo_contenido = 'pelicula'
      and l.estado = 'por_ver' and e.runtime between 1 and 600
  )
  select count(*)::integer, coalesce(sum(runtime), 0)::integer,
    jsonb_agg(jsonb_build_object(
      'lista_id', id,
      'tmdb_id', tmdb_id,
      'titulo', titulo,
      'poster_url', poster_url,
      'duracion_minutos', runtime
    ) order by orden)
  into v_cantidad_encontrada, v_suma, v_snapshot
  from permitidas;

  if v_cantidad_encontrada <> v_cantidad then
    raise exception 'Solo puedes guardar películas propias, por ver, con duración válida.' using errcode = '23514';
  end if;

  v_total := v_suma + 10 * (v_cantidad - 1);
  if v_total > p_tiempo_disponible then
    raise exception 'La sesión supera el tiempo disponible al sumar las pausas.' using errcode = '23514';
  end if;

  insert into public.sesiones_noche (
    user_id, nombre, tiempo_disponible, pausa_minutos, duracion_total, peliculas
  ) values (
    v_usuario, v_nombre, p_tiempo_disponible, 10, v_total, v_snapshot
  ) returning * into v_fila;

  return v_fila;
end;
$$;

revoke all on function public.guardar_noche(text, integer, uuid[], integer[]) from public, anon;
grant execute on function public.guardar_noche(text, integer, uuid[], integer[]) to authenticated;
