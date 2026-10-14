import { supabase } from '../supabaseClient';
import type { CatalogSearchItem } from '../types/tmdb';
import {
  MiListaError,
  type MiListaInsert,
  type MiListaItem,
  type MiListaUpdate,
  type TipoContenido,
} from '../types/miLista';

const TABLE = 'mi_lista';

function mapCatalogTipo(mediaType: CatalogSearchItem['mediaType']): TipoContenido {
  return mediaType === 'movie' ? 'pelicula' : 'serie';
}

function assertItem(value: unknown): MiListaItem {
  const item = value as MiListaItem;

  if (
    typeof item.id !== 'string' ||
    typeof item.user_id !== 'string' ||
    typeof item.tmdb_id !== 'number' ||
    typeof item.titulo !== 'string'
  ) {
    throw new MiListaError('Supabase devolvió un registro de mi_lista con formato inválido.');
  }

  return item;
}

export function catalogItemToInsert(userId: string, item: CatalogSearchItem): MiListaInsert {
  return {
    user_id: userId,
    tmdb_id: item.id,
    titulo: item.title,
    poster_url: item.posterUrl,
    tipo_contenido: mapCatalogTipo(item.mediaType),
    estado: 'por_ver',
  };
}

export async function fetchMiLista(userId: string): Promise<MiListaItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, user_id, tmdb_id, titulo, poster_url, tipo_contenido, estado, calificacion_personal, comentario, fecha_agregada',
    )
    .eq('user_id', userId)
    .order('fecha_agregada', { ascending: false });

  if (error) {
    throw new MiListaError(error.message);
  }

  return (data ?? []).map(assertItem);
}

export async function findDuplicate(
  userId: string,
  tmdbId: number,
  tipoContenido: TipoContenido,
): Promise<MiListaItem | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, user_id, tmdb_id, titulo, poster_url, tipo_contenido, estado, calificacion_personal, comentario, fecha_agregada',
    )
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('tipo_contenido', tipoContenido)
    .maybeSingle();

  if (error) {
    throw new MiListaError(error.message);
  }

  return data === null ? null : assertItem(data);
}

export async function addFromTmdb(userId: string, item: CatalogSearchItem): Promise<MiListaItem> {
  const payload = catalogItemToInsert(userId, item);
  const existing = await findDuplicate(userId, payload.tmdb_id, payload.tipo_contenido);

  if (existing !== null) {
    throw new MiListaError('Este título ya está en tu lista.');
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();

  if (error) {
    if (error.code === '23505') {
      throw new MiListaError('Este título ya está en tu lista.');
    }
    throw new MiListaError(error.message);
  }

  return assertItem(data);
}

export async function updateMiListaItem(id: string, changes: MiListaUpdate): Promise<MiListaItem> {
  const { data, error } = await supabase.from(TABLE).update(changes).eq('id', id).select().single();

  if (error) {
    throw new MiListaError(error.message);
  }

  return assertItem(data);
}

export async function deleteMiListaItem(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new MiListaError(error.message);
  }
}
