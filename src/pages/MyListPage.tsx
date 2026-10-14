import { ListaGrid } from '../components/ListaGrid'
import { useMiLista } from '../context/MiListaContext'

export function MyListPage() {
  const { items, isLoading, errorMessage } = useMiLista()

  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1>Mi lista</h1>
        <p>Los títulos que guardaste en tu cartelera personal.</p>
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

      {!isLoading && items.length > 0 && <ListaGrid items={items} />}
    </section>
  )
}
