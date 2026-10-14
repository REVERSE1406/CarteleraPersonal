import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { searchTmdbMedia } from '../services/tmdb'
import { TmdbError, type CatalogSearchItem } from '../types/tmdb'
import { SearchResults } from './SearchResults'

type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

export function MediaSearch() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [results, setResults] = useState<CatalogSearchItem[]>([])
  const debouncedQuery = useDebouncedValue(query, 400)

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim()

    if (trimmedQuery.length === 0) {
      setStatus('idle')
      setErrorMessage(null)
      setResults([])
      return
    }

    const controller = new AbortController()
    let cancelled = false

    setStatus('loading')
    setErrorMessage(null)

    void searchTmdbMedia(trimmedQuery, controller.signal)
      .then((items) => {
        if (cancelled) return
        setResults(items)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        const message =
          error instanceof TmdbError
            ? error.message
            : 'Ocurrió un error inesperado al buscar en TMDB.'

        setResults([])
        setStatus('error')
        setErrorMessage(message)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [debouncedQuery])

  return (
    <section className="search-panel">
      <label htmlFor="tmdb-search">Buscar películas o series</label>
      <input
        id="tmdb-search"
        type="search"
        placeholder="Escribe un título, por ejemplo Inception o Breaking Bad"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />

      {status === 'loading' && (
        <div className="search-status" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p>Buscando en TMDB…</p>
        </div>
      )}

      {status === 'error' && errorMessage !== null && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      {status === 'success' && results.length === 0 && (
        <p className="search-empty">No encontramos resultados para “{debouncedQuery.trim()}”.</p>
      )}

      {status === 'idle' && (
        <p className="search-hint">Empieza a escribir para buscar en The Movie Database.</p>
      )}

      {status === 'success' && <SearchResults items={results} />}
    </section>
  )
}
