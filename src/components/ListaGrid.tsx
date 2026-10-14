import { ListaItemControls } from './ListaItemControls'
import type { MiListaItem } from '../types/miLista'

interface ListaGridProps {
  items: MiListaItem[]
  onSelectItem: (item: MiListaItem) => void
}

function tipoLabel(tipo: MiListaItem['tipo_contenido']): string {
  return tipo === 'pelicula' ? 'Película' : 'Serie'
}

function estadoLabel(estado: MiListaItem['estado']): string {
  if (estado === 'por_ver') return 'Por ver'
  if (estado === 'viendo') return 'Viendo'
  return 'Vista'
}

export function ListaGrid({ items, onSelectItem }: ListaGridProps) {
  return (
    <ul className="results-grid">
      {items.map((item) => (
        <li key={item.id} className="result-card lista-card">
          <button
            type="button"
            className="lista-card-hit"
            onClick={() => onSelectItem(item)}
            aria-label={`Ver detalle de ${item.titulo}`}
          >
            <div className="result-poster">
              {item.poster_url !== null ? (
                <img src={item.poster_url} alt="" loading="lazy" />
              ) : (
                <div className="poster-fallback" aria-hidden="true">
                  Sin póster
                </div>
              )}
            </div>
            <div className="result-meta">
              <h2>{item.titulo}</h2>
              <p>
                <span className="result-type">{tipoLabel(item.tipo_contenido)}</span>
                <span className="estado-chip">{estadoLabel(item.estado)}</span>
              </p>
            </div>
          </button>
          <ListaItemControls item={item} />
        </li>
      ))}
    </ul>
  )
}
