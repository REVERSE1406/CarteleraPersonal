import type { CatalogSearchItem } from '../types/tmdb'

interface SearchResultsProps {
  items: CatalogSearchItem[]
}

function mediaTypeLabel(mediaType: CatalogSearchItem['mediaType']): string {
  return mediaType === 'movie' ? 'Película' : 'Serie'
}

export function SearchResults({ items }: SearchResultsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <ul className="results-grid">
      {items.map((item) => (
        <li key={`${item.mediaType}-${item.id}`} className="result-card">
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
          </div>
        </li>
      ))}
    </ul>
  )
}
