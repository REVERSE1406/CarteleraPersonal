import { useMemo, useState } from 'react'
import { ListaGrid } from '../components/ListaGrid'
import { ListaStats } from '../components/ListaStats'
import { ListaToolbar, type EstadoFiltro, type OrdenLista } from '../components/ListaToolbar'
import { useMiLista } from '../context/MiListaContext'
import type { MiListaItem } from '../types/miLista'

function sortItems(items: MiListaItem[], orden: OrdenLista): MiListaItem[] {
  const copy = [...items]
  copy.sort((a, b) => {
    if (orden === 'fecha_asc' || orden === 'fecha_desc') {
      const delta = new Date(a.fecha_agregada).getTime() - new Date(b.fecha_agregada).getTime()
      return orden === 'fecha_asc' ? delta : -delta
    }

    const ratingA = a.calificacion_personal ?? -1
    const ratingB = b.calificacion_personal ?? -1
    return orden === 'calificacion_asc' ? ratingA - ratingB : ratingB - ratingA
  })
  return copy
}

export function MyListPage() {
  const { items, isLoading, errorMessage } = useMiLista()
  const [estado, setEstado] = useState<EstadoFiltro>('todos')
  const [orden, setOrden] = useState<OrdenLista>('fecha_desc')

  const visibleItems = useMemo(() => {
    const filtered = estado === 'todos' ? items : items.filter((item) => item.estado === estado)
    return sortItems(filtered, orden)
  }, [items, estado, orden])

  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1>Mi lista</h1>
        <p>Los títulos que guardaste en tu cartelera personal. Haz clic en un póster o título para ver el detalle.</p>
      </header>

      {isLoading && (
        <div className="search-status" role="status">
          <span className="spinner" aria-hidden="true" />
          <p>Cargando tu lista…</p>
        </div>
      )}

      {errorMessage !== null && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      {!isLoading && errorMessage === null && items.length === 0 && (
        <p className="search-empty">Aún no tienes títulos guardados. Búscalos en el catálogo.</p>
      )}

      {!isLoading && items.length > 0 && (
        <>
          <ListaStats items={items} />
          <ListaToolbar
            estado={estado}
            orden={orden}
            onEstadoChange={setEstado}
            onOrdenChange={setOrden}
          />
          {visibleItems.length === 0 ? (
            <p className="search-empty">No hay títulos con ese estado.</p>
          ) : (
            <ListaGrid items={visibleItems} />
          )}
        </>
      )}
    </section>
  )
}
