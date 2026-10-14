export const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export type TmdbMediaType = 'movie' | 'tv' | 'person'

export interface TmdbSearchResponse {
  page: number
  results: TmdbSearchResult[]
  total_pages: number
  total_results: number
}

export type TmdbSearchResult = TmdbMovieResult | TmdbTvResult | TmdbPersonResult

interface TmdbResultBase {
  id: number
  adult: boolean
  popularity: number
  backdrop_path: string | null
  poster_path: string | null
  original_language: string
  overview: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
}

export interface TmdbMovieResult extends TmdbResultBase {
  media_type: 'movie'
  title: string
  original_title: string
  release_date?: string
  video: boolean
}

export interface TmdbTvResult extends TmdbResultBase {
  media_type: 'tv'
  name: string
  original_name: string
  first_air_date?: string
  origin_country: string[]
}

export interface TmdbPersonResult {
  media_type: 'person'
  id: number
  name: string
  original_name?: string
  adult: boolean
  popularity: number
  gender: number
  known_for_department?: string
  profile_path: string | null
  known_for?: Array<TmdbMovieResult | TmdbTvResult>
}

export type CatalogMediaType = 'movie' | 'tv'

export interface CatalogSearchItem {
  id: number
  mediaType: CatalogMediaType
  title: string
  year: string | null
  posterPath: string | null
  posterUrl: string | null
  overview: string
}

export interface TmdbTitleDetails {
  overview: string
  year: string | null
  voteAverage: number | null
}

export class TmdbError extends Error {
  readonly statusCode: number | null

  constructor(message: string, statusCode: number | null = null) {
    super(message)
    this.name = 'TmdbError'
    this.statusCode = statusCode
  }
}
