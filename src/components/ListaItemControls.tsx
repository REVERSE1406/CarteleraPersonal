import { useEffect, useState } from 'react'
import { useMiLista } from '../context/MiListaContext'
import type { CalificacionPersonal, EstadoLista, MiListaItem } from '../types/miLista'

interface ListaItemControlsProps {
  item: MiListaItem
}

const ESTADOS: Array<{ value: EstadoLista; label: string }> = [
  { value: 'por_ver', label: 'Por ver' },
  { value: 'viendo', label: 'Viendo' },
  { value: 'vista', label: 'Vista' },
]

const CALIFICACIONES: CalificacionPersonal[] = [1, 2, 3, 4, 5]

export function ListaItemControls({ item }: ListaItemControlsProps) {
  const { updateItem, removeItem } = useMiLista()
  const [comentario, setComentario] = useState(item.comentario ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setComentario(item.comentario ?? '')
  }, [item.comentario])

  async function persist(changes: Parameters<typeof updateItem>[1]): Promise<void> {
    setIsSaving(true)
    setErrorMessage(null)
    try {
      await updateItem(item.id, changes)
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar el cambio.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(`¿Eliminar “${item.titulo}” de tu lista?`)
    if (!confirmed) return

    setIsSaving(true)
    setErrorMessage(null)
    try {
      await removeItem(item.id)
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo eliminar el título.')
      setIsSaving(false)
    }
  }

  return (
    <div
      className="lista-controls"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <label className="sr-only" htmlFor={`estado-${item.id}`}>
        Estado
      </label>
      <select
        id={`estado-${item.id}`}
        value={item.estado}
        disabled={isSaving}
        onChange={(event) => void persist({ estado: event.target.value as EstadoLista })}
      >
        {ESTADOS.map((estado) => (
          <option key={estado.value} value={estado.value}>
            {estado.label}
          </option>
        ))}
      </select>

      <div className="rating-row" role="group" aria-label="Calificación personal">
        {CALIFICACIONES.map((value) => {
          const isActive = (item.calificacion_personal ?? 0) >= value
          return (
            <button
              key={value}
              type="button"
              className={isActive ? 'star star-active' : 'star'}
              disabled={isSaving}
              onClick={() =>
                void persist({
                  calificacion_personal: item.calificacion_personal === value ? null : value,
                })
              }
              aria-label={`${value} de 5`}
            >
              ★
            </button>
          )
        })}
      </div>

      <label className="sr-only" htmlFor={`comentario-${item.id}`}>
        Comentario
      </label>
      <textarea
        id={`comentario-${item.id}`}
        value={comentario}
        disabled={isSaving}
        placeholder="Escribe un comentario"
        rows={2}
        onChange={(event) => setComentario(event.target.value)}
        onBlur={() => {
          const next = comentario.trim()
          const current = item.comentario ?? ''
          if (next === current) return
          void persist({ comentario: next.length === 0 ? null : next })
        }}
      />

      <button
        type="button"
        className="btn btn-ghost btn-compact"
        disabled={isSaving}
        onClick={() => void handleDelete()}
      >
        Eliminar
      </button>

      {errorMessage !== null && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
