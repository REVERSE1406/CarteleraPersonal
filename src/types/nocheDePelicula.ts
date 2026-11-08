export interface DuracionPelicula {
  listaId: string
  duracionMinutos: number | null
  error: string | null
}

export interface SesionPelicula {
  lista_id: string
  tmdb_id: number
  titulo: string
  poster_url: string | null
  duracion_minutos: number
}

export interface SesionNoche {
  id: string
  user_id: string
  nombre: string
  tiempo_disponible: number
  pausa_minutos: number
  duracion_total: number
  creada_en: string
  peliculas: SesionPelicula[]
}

export interface GuardarSesionNoche {
  nombre: string
  tiempoDisponible: number
  peliculas: Array<{ listaId: string; duracionMinutos: number }>
}

export class NocheDePeliculaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NocheDePeliculaError'
  }
}
