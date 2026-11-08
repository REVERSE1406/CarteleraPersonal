import { supabase } from '../supabaseClient'
import {
  NocheDePeliculaError,
  type GuardarSesionNoche,
  type SesionNoche,
  type SesionPelicula,
} from '../types/nocheDePelicula'

function registro(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new NocheDePeliculaError('Los datos de la sesión tienen un formato incorrecto.')
  }
  return value as Record<string, unknown>
}

function texto(value: unknown): string {
  if (typeof value !== 'string') {
    throw new NocheDePeliculaError('La sesión contiene un campo de texto inválido.')
  }
  return value
}

function numero(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new NocheDePeliculaError('La sesión contiene un número inválido.')
  }
  return value
}

function leerPelicula(value: unknown): SesionPelicula {
  const raw = registro(value)
  return {
    lista_id: texto(raw.lista_id),
    tmdb_id: numero(raw.tmdb_id),
    titulo: texto(raw.titulo),
    poster_url: raw.poster_url === null ? null : texto(raw.poster_url),
    duracion_minutos: numero(raw.duracion_minutos),
  }
}

function leerSesion(value: unknown): SesionNoche {
  const raw = registro(value)
  if (!Array.isArray(raw.peliculas)) {
    throw new NocheDePeliculaError('La sesión no tiene una lista de películas válida.')
  }
  return {
    id: texto(raw.id),
    user_id: texto(raw.user_id),
    nombre: texto(raw.nombre),
    tiempo_disponible: numero(raw.tiempo_disponible),
    pausa_minutos: numero(raw.pausa_minutos),
    duracion_total: numero(raw.duracion_total),
    creada_en: texto(raw.creada_en),
    peliculas: raw.peliculas.map(leerPelicula),
  }
}

/** La condición de usuario mejora claridad; la protección real es RLS en la base. */
export async function fetchSesionesNoche(userId: string): Promise<SesionNoche[]> {
  const { data, error } = await supabase
    .from('sesiones_noche')
    .select('id, user_id, nombre, tiempo_disponible, pausa_minutos, duracion_total, creada_en, peliculas')
    .eq('user_id', userId)
    .order('creada_en', { ascending: false })

  if (error) {
    throw new NocheDePeliculaError(`No se pudieron consultar las sesiones: ${error.message}`)
  }
  if (!Array.isArray(data)) return []
  return data.map(leerSesion)
}

/** La función SQL valida propiedad/estado y guarda la sesión entera atómicamente. */
export async function guardarSesionNoche(entrada: GuardarSesionNoche): Promise<SesionNoche> {
  const { data, error } = await supabase.rpc('guardar_noche', {
    p_nombre: entrada.nombre,
    p_tiempo_disponible: entrada.tiempoDisponible,
    p_lista_ids: entrada.peliculas.map((pelicula) => pelicula.listaId),
    p_duraciones: entrada.peliculas.map((pelicula) => pelicula.duracionMinutos),
  })
  if (error) {
    throw new NocheDePeliculaError(`No se pudo guardar la noche: ${error.message}`)
  }
  return leerSesion(data)
}
