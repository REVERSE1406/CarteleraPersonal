import {
  TMDB_API_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  TmdbError,
  type CatalogSearchItem,
  type TmdbSearchResponse,
  type TmdbSearchResult,
} from '../types/tmdb'

function getTmdbApiKey(): string {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    throw new TmdbError(
      'Falta VITE_TMDB_API_KEY. Agrégala en el archivo .env y reinicia Vite.'
    )
  }

  return apiKey
}

export function getTmdbPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) {
    return null
  }

  return `${TMDB_IMAGE_BASE_URL}${posterPath}`
}

function extractYear(date: string | undefined): string | null {
  if (!date || date.length < 4) {
    return null
  }

  return date.slice(0, 4)
}

function isMovieOrTv(
  result: TmdbSearchResult
): result is Extract<TmdbSearchResult, { media_type: 'movie' | 'tv' }> {
  return result.media_type === 'movie' || result.media_type === 'tv'
}

function mapSearchResult(result: TmdbSearchResult): CatalogSearchItem | null {
  if (!isMovieOrTv(result)) {
    return null
  }

  if (result.media_type === 'movie') {
    return {
      id: result.id,
      mediaType: 'movie',
      title: result.title,
      year: extractYear(result.release_date),
      posterPath: result.poster_path,
      posterUrl: getTmdbPosterUrl(result.poster_path),
      overview: result.overview,
    }
  }

  return {
    id: result.id,
    mediaType: 'tv',
    title: result.name,
    year: extractYear(result.first_air_date),
    posterPath: result.poster_path,
    posterUrl: getTmdbPosterUrl(result.poster_path),
    overview: result.overview,
  }
}

export async function searchTmdbMedia(
  query: string,
  signal?: AbortSignal
): Promise<CatalogSearchItem[]> {
  const trimmedQuery = query.trim()

  if (trimmedQuery.length === 0) {
    return []
  }

  const params = new URLSearchParams({
    api_key: getTmdbApiKey(),
    query: trimmedQuery,
    include_adult: 'false',
    language: 'es-ES',
  })

  let response: Response

  try {
    response = await fetch(`${TMDB_API_BASE_URL}/search/multi?${params.toString()}`, {
      method: 'GET',
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new TmdbError('No se pudo conectar con TMDB. Revisa tu conexión e inténtalo de nuevo.')
  }

  if (!response.ok) {
    throw new TmdbError(
      `TMDB respondió con un error (${response.status}). Verifica tu API key.`,
      response.status
    )
  }

  const payload: unknown = await response.json()
  const data = payload as TmdbSearchResponse

  if (!Array.isArray(data.results)) {
    throw new TmdbError('La respuesta de TMDB no tiene el formato esperado.')
  }

  return data.results
    .map(mapSearchResult)
    .filter((item): item is CatalogSearchItem => item !== null)
}
