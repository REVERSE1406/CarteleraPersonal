import { MediaSearch } from '../components/MediaSearch'

export function CatalogPage() {
  return (
    <section className="catalog-page">
      <header className="catalog-header">
        <h1>Catálogo</h1>
        <p>Busca películas y series para armar tu cartelera personal.</p>
      </header>
      <MediaSearch />
    </section>
  )
}
