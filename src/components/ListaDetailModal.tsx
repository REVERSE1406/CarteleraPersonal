import { useEffect } from 'react'
import { ListaItemControls } from './ListaItemControls'
import type { MiListaItem } from '../types/miLista'

interface ListaDetailModalProps {
  item: MiListaItem
  onClose: () => void
}

function tipoLabel(tipo: MiListaItem['tipo_contenido']): string {
  return tipo === 'pelicula' ? 'Película' : 'Serie'
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

export function ListaDetailModal({ item, onClose }: ListaDetailModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detalle-titulo-${item.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn btn-ghost modal-close" onClick={onClose}>
          Cerrar
        </button>

        <div className="modal-body">
          <div className="result-poster modal-poster">
            {item.poster_url !== null ? (
              <img src={item.poster_url} alt={`Póster de ${item.titulo}`} />
            ) : (
              <div className="poster-fallback">Sin póster</div>
            )}
          </div>

          <div>
            <p className="eyebrow">{tipoLabel(item.tipo_contenido)}</p>
            <h2 id={`detalle-titulo-${item.id}`}>{item.titulo}</h2>
            <p className="search-hint">Agregada el {formatFecha(item.fecha_agregada)}</p>
            {item.calificacion_personal !== null && (
              <p className="result-type">Tu nota: {item.calificacion_personal}/5</p>
            )}
            {item.comentario !== null && item.comentario.length > 0 && (
              <p className="detalle-comentario">{item.comentario}</p>
            )}
            <ListaItemControls item={item} />
          </div>
        </div>
      </div>
    </div>
  )
}
