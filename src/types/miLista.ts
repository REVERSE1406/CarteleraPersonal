export type TipoContenido = 'pelicula' | 'serie'
export type EstadoLista = 'por_ver' | 'viendo' | 'vista'
export type CalificacionPersonal = 1 | 2 | 3 | 4 | 5

export interface MiListaItem {
  id: string
  user_id: string
  tmdb_id: number
  titulo: string
  poster_url: string | null
  tipo_contenido: TipoContenido
  estado: EstadoLista
  calificacion_personal: CalificacionPersonal | null
  comentario: string | null
  fecha_agregada: string
}

export interface MiListaInsert {
  user_id: string
  tmdb_id: number
  titulo: string
  poster_url: string | null
  tipo_contenido: TipoContenido
  estado?: EstadoLista
  calificacion_personal?: CalificacionPersonal | null
  comentario?: string | null
}

export interface MiListaUpdate {
  estado?: EstadoLista
  calificacion_personal?: CalificacionPersonal | null
  comentario?: string | null
}

export class MiListaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MiListaError'
  }
}
