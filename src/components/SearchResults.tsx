import { useState } from 'react'
import { useMiLista, catalogTipo } from '../context/MiListaContext'
import { MiListaError } from '../types/miLista'
import type { CatalogSearchItem } from '../types/tmdb'

interface SearchResultsProps {
  items: CatalogSearchItem[]
}

function mediaTypeLabel(mediaType: CatalogSearchItem['mediaType']): string {
  return mediaType === 'movie' ? 'Película' : 'Serie'
}

export function SearchResults({ items }: SearchResultsProps) {
  const { addFromSearch, isSaved } = useMiLista()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ key: string; message: string; isError: boolean } | null>(
    null
  )

  if (items.length === 0) {
    return null
  }

  async function handleAdd(item: CatalogSearchItem): Promise<void> {
    const key = `${item.mediaType}-${item.id}`
    setPendingId(key)
    setFeedback(null)

    try {
      await addFromSearch(item)
      setFeedback({ key, message: 'Agregado a tu lista.', isError: false })
    } catch (error: unknown) {
      const message =
        error instanceof MiListaError || error instanceof Error
          ? error.message
          : 'No se pudo agregar el título.'
      setFeedback({ key, message, isError: true })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <ul className="results-grid">
      {items.map((item) => {
        const key = `${item.mediaType}-${item.id}`
        const alreadySaved = isSaved(item.id, catalogTipo(item.mediaType))
        const isPending = pendingId === key
        const itemFeedback = feedback?.key === key ? feedback : null

        return (
          <li key={key} className="result-card">
            <div className="result-poster">
              {item.posterUrl !== null ? (
                <img src={item.posterUrl} alt={`Póster de ${item.title}`} loading="lazy" />
              ) : (
                <div className="poster-fallback" aria-hidden="true">
                  Sin póster
                </div>
              )}
            </div>
            <div className="result-meta">
              <h2>{item.title}</h2>
              <p>
                <span className="result-type">{mediaTypeLabel(item.mediaType)}</span>
                <span>{item.year ?? 'Año no disponible'}</span>
              </p>
              <button
                type="button"
                className="btn btn-primary btn-compact"
                disabled={alreadySaved || isPending}
                onClick={() => void handleAdd(item)}
              >
                {alreadySaved ? 'En mi lista' : isPending ? 'Agregando…' : 'Agregar a mi lista'}
              </button>
              {itemFeedback !== null && (
                <p className={itemFeedback.isError ? 'form-error' : 'form-info'} role="status">
                  {itemFeedback.message}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
