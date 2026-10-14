import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  addFromTmdb,
  deleteMiListaItem,
  fetchMiLista,
  updateMiListaItem,
} from '../services/miLista'
import type { CatalogSearchItem } from '../types/tmdb'
import type { MiListaItem, MiListaUpdate, TipoContenido } from '../types/miLista'

interface MiListaContextValue {
  items: MiListaItem[]
  isLoading: boolean
  errorMessage: string | null
  addFromSearch: (item: CatalogSearchItem) => Promise<void>
  updateItem: (id: string, changes: MiListaUpdate) => Promise<void>
  removeItem: (id: string) => Promise<void>
  isSaved: (tmdbId: number, tipoContenido: TipoContenido) => boolean
}

const MiListaContext = createContext<MiListaContextValue | undefined>(undefined)

function catalogTipo(mediaType: CatalogSearchItem['mediaType']): TipoContenido {
  return mediaType === 'movie' ? 'pelicula' : 'serie'
}

export function MiListaProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth()
  const [items, setItems] = useState<MiListaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated' || user === null) {
      setItems([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setErrorMessage(null)

    void fetchMiLista(user.id)
      .then((list) => {
        if (cancelled) return
        setItems(list)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar tu lista.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [status, user])

  const addFromSearch = useCallback(
    async (item: CatalogSearchItem) => {
      if (user === null) {
        throw new Error('Debes iniciar sesión para guardar títulos.')
      }

      const created = await addFromTmdb(user.id, item)
      setItems((current) => [created, ...current.filter((entry) => entry.id !== created.id)])
    },
    [user]
  )

  const updateItem = useCallback(async (id: string, changes: MiListaUpdate) => {
    const updated = await updateMiListaItem(id, changes)
    setItems((current) => current.map((entry) => (entry.id === id ? updated : entry)))
  }, [])

  const removeItem = useCallback(async (id: string) => {
    await deleteMiListaItem(id)
    setItems((current) => current.filter((entry) => entry.id !== id))
  }, [])

  const isSaved = useCallback(
    (tmdbId: number, tipoContenido: TipoContenido) =>
      items.some((entry) => entry.tmdb_id === tmdbId && entry.tipo_contenido === tipoContenido),
    [items]
  )

  const value = useMemo<MiListaContextValue>(
    () => ({
      items,
      isLoading,
      errorMessage,
      addFromSearch,
      updateItem,
      removeItem,
      isSaved,
    }),
    [items, isLoading, errorMessage, addFromSearch, updateItem, removeItem, isSaved]
  )

  return <MiListaContext.Provider value={value}>{children}</MiListaContext.Provider>
}

export function useMiLista(): MiListaContextValue {
  const context = useContext(MiListaContext)
  if (context === undefined) {
    throw new Error('useMiLista debe usarse dentro de MiListaProvider')
  }
  return context
}

export { catalogTipo }
