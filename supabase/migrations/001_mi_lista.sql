create table if not exists public.mi_lista (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tmdb_id integer not null,
  titulo text not null,
  poster_url text,
  tipo_contenido text not null check (tipo_contenido in ('pelicula', 'serie')),
  estado text not null default 'por_ver' check (estado in ('por_ver', 'viendo', 'vista')),
  calificacion_personal integer check (
    calificacion_personal is null
    or (calificacion_personal >= 1 and calificacion_personal <= 5)
  ),
  comentario text,
  fecha_agregada timestamptz not null default now(),
  unique (user_id, tmdb_id, tipo_contenido)
);

alter table public.mi_lista enable row level security;

create policy "Leer propia lista"
  on public.mi_lista
  for select
  using (auth.uid() = user_id);

create policy "Insertar en propia lista"
  on public.mi_lista
  for insert
  with check (auth.uid() = user_id);

create policy "Actualizar propia lista"
  on public.mi_lista
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Eliminar de propia lista"
  on public.mi_lista
  for delete
  using (auth.uid() = user_id);
