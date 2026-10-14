import { supabase } from '../supabaseClient'
import type { CatalogSearchItem } from '../types/tmdb'
import {
  MiListaError,
  type CalificacionPersonal,
  type EstadoLista,
  type MiListaInsert,
  type MiListaItem,
  type MiListaUpdate,
  type TipoContenido,
} from '../types/miLista'

const TABLE = 'mi_lista'
const TIPOS_VALIDOS: readonly TipoContenido[] = ['pelicula', 'serie']
const ESTADOS_VALIDOS: readonly EstadoLista[] = ['por_ver', 'viendo', 'vista']

function mapCatalogTipo(mediaType: CatalogSearchItem['mediaType']): TipoContenido {
  return mediaType === 'movie' ? 'pelicula' : 'serie'
}

function asText(value: unknown): string | null {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return null
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function parseTipoContenido(value: unknown): TipoContenido | null {
  if (value === 'movie' || value === 'película') {
    return 'pelicula'
  }
  if (value === 'tv') {
    return 'serie'
  }
  if (typeof value === 'string' && (TIPOS_VALIDOS as readonly string[]).includes(value)) {
    return value as TipoContenido
  }
  return null
}

function parseEstado(value: unknown): EstadoLista | null {
  if (typeof value === 'string' && (ESTADOS_VALIDOS as readonly string[]).includes(value)) {
    return value as EstadoLista
  }
  return null
}

function parseCalificacion(value: unknown): CalificacionPersonal | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const parsed = asNumber(value)
  if (parsed === 1 || parsed === 2 || parsed === 3 || parsed === 4 || parsed === 5) {
    return parsed
  }
  return null
}

/**
 * Normaliza una fila de Supabase: PostgREST puede devolver uuid/enteros como string
 * y deja calificacion_personal/comentario en null cuando aún no se han definido.
 */
function parseMiListaItem(value: unknown): MiListaItem {
  if (value === null || typeof value !== 'object') {
    throw new MiListaError('Supabase devolvió un registro de mi_lista con formato inválido.')
  }

  const row = value as Record<string, unknown>
  const id = asText(row.id)
  const userId = asText(row.user_id)
  const tmdbId = asNumber(row.tmdb_id)
  const titulo = typeof row.titulo === 'string' ? row.titulo : null
  const tipoContenido = parseTipoContenido(row.tipo_contenido)
  const estado = parseEstado(row.estado ?? 'por_ver')
  const posterUrl =
    row.poster_url === null || row.poster_url === undefined ? null : asText(row.poster_url)
  const comentario =
    row.comentario === null || row.comentario === undefined || row.comentario === ''
      ? null
      : typeof row.comentario === 'string'
        ? row.comentario
        : null
  const fechaAgregada = asText(row.fecha_agregada) ?? new Date().toISOString()

  if (
    id === null ||
    userId === null ||
    tmdbId === null ||
    titulo === null ||
    tipoContenido === null ||
    estado === null
  ) {
    throw new MiListaError('Supabase devolvió un registro de mi_lista con formato inválido.')
  }

  return {
    id,
    user_id: userId,
    tmdb_id: tmdbId,
    titulo,
    poster_url: posterUrl,
    tipo_contenido: tipoContenido,
    estado,
    calificacion_personal: parseCalificacion(row.calificacion_personal),
    comentario,
    fecha_agregada: fechaAgregada,
  }
}

export function catalogItemToInsert(userId: string, item: CatalogSearchItem): MiListaInsert {
  return {
    user_id: userId,
    tmdb_id: item.id,
    titulo: item.title,
    poster_url: item.posterUrl,
    tipo_contenido: mapCatalogTipo(item.mediaType),
    estado: 'por_ver',
  }
}

export async function fetchMiLista(userId: string): Promise<MiListaItem[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, user_id, tmdb_id, titulo, poster_url, tipo_contenido, estado, calificacion_personal, comentario, fecha_agregada'
    )
    .eq('user_id', userId)
    .order('fecha_agregada', { ascending: false })

  if (error) {
    throw new MiListaError(error.message)
  }

  return (data ?? []).map(parseMiListaItem)
}

export async function findDuplicate(
  userId: string,
  tmdbId: number,
  tipoContenido: TipoContenido
): Promise<MiListaItem | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, user_id, tmdb_id, titulo, poster_url, tipo_contenido, estado, calificacion_personal, comentario, fecha_agregada'
    )
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('tipo_contenido', tipoContenido)
    .maybeSingle()

  if (error) {
    throw new MiListaError(error.message)
  }

  return data === null ? null : parseMiListaItem(data)
}

export async function addFromTmdb(userId: string, item: CatalogSearchItem): Promise<MiListaItem> {
  const payload = catalogItemToInsert(userId, item)
  const existing = await findDuplicate(userId, payload.tmdb_id, payload.tipo_contenido)

  if (existing !== null) {
    throw new MiListaError('Este título ya está en tu lista.')
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single()

  if (error) {
    if (error.code === '23505') {
      throw new MiListaError('Este título ya está en tu lista.')
    }
    throw new MiListaError(error.message)
  }

  return parseMiListaItem(data)
}

export async function updateMiListaItem(id: string, changes: MiListaUpdate): Promise<MiListaItem> {
  const { data, error } = await supabase.from(TABLE).update(changes).eq('id', id).select().single()

  if (error) {
    throw new MiListaError(error.message)
  }

  return parseMiListaItem(data)
}

export async function deleteMiListaItem(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) {
    throw new MiListaError(error.message)
  }
}
