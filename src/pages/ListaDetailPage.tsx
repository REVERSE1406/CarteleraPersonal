import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ListaItemControls } from '../components/ListaItemControls'
import { useMiLista } from '../context/MiListaContext'
import { fetchTmdbTitleDetails } from '../services/tmdb'
import { TmdbError, type TmdbTitleDetails } from '../types/tmdb'

function tipoLabel(tipo: 'pelicula' | 'serie'): string {
  return tipo === 'pelicula' ? 'Película' : 'Serie'
}

function estadoLabel(estado: 'por_ver' | 'viendo' | 'vista'): string {
  if (estado === 'por_ver') return 'Por ver'
  if (estado === 'viendo') return 'Viendo'
  return 'Vista'
}

function formatFecha(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ListaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { items, isLoading } = useMiLista()
  const item = items.find((entry) => entry.id === id) ?? null
  const [details, setDetails] = useState<TmdbTitleDetails | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    if (item === null) return

    const controller = new AbortController()
    const mediaType = item.tipo_contenido === 'pelicula' ? 'movie' : 'tv'

    void fetchTmdbTitleDetails(mediaType, item.tmdb_id, controller.signal)
      .then((payload) => {
        setDetails(payload)
        setDetailsError(null)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setDetailsError(error instanceof TmdbError ? error.message : 'No se pudo cargar TMDB.')
      })

    return () => controller.abort()
  }, [item])

  if (isLoading) {
    return (
      <div className="search-status" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Cargando detalle…</p>
      </div>
    )
  }

  if (item === null) {
    return (
      <section className="catalog-page">
        <p className="search-empty">No encontramos ese título en tu lista.</p>
        <Link to="/mi-lista">Volver a mi lista</Link>
      </section>
    )
  }

  return (
    <section className="catalog-page detail-page">
      <p>
        <Link to="/mi-lista">← Volver a mi lista</Link>
      </p>

      <article className="detalle-layout">
        <div className="result-poster modal-poster">
          {item.poster_url !== null ? (
            <img src={item.poster_url} alt={`Póster de ${item.titulo}`} />
          ) : (
            <div className="poster-fallback">Sin póster</div>
          )}
        </div>

        <div>
          <p className="eyebrow">{tipoLabel(item.tipo_contenido)}</p>
          <h1>{item.titulo}</h1>
          <p className="search-hint">
            {estadoLabel(item.estado)} · Agregada el {formatFecha(item.fecha_agregada)}
            {details?.year !== null && details?.year !== undefined ? ` · ${details.year}` : ''}
          </p>
          {item.calificacion_personal !== null && (
            <p className="result-type">Tu nota: {item.calificacion_personal}/5</p>
          )}
          {details?.voteAverage !== null && details?.voteAverage !== undefined && (
            <p className="search-hint">TMDB: {details.voteAverage.toFixed(1)}/10</p>
          )}
          {item.comentario !== null && item.comentario.length > 0 && (
            <p className="detalle-comentario">{item.comentario}</p>
          )}
          {detailsError !== null && <p className="form-error">{detailsError}</p>}
          {details?.overview ? <p className="detalle-sinopsis">{details.overview}</p> : null}

          <ListaItemControls item={item} />
        </div>
      </article>
    </section>
  )
}
