import type { EstadoLista } from '../types/miLista'

export type EstadoFiltro = 'todos' | EstadoLista
export type OrdenLista = 'fecha_desc' | 'fecha_asc' | 'calificacion_desc' | 'calificacion_asc'

interface ListaToolbarProps {
  estado: EstadoFiltro
  orden: OrdenLista
  onEstadoChange: (estado: EstadoFiltro) => void
  onOrdenChange: (orden: OrdenLista) => void
}

const FILTROS: Array<{ value: EstadoFiltro; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'por_ver', label: 'Por ver' },
  { value: 'viendo', label: 'Viendo' },
  { value: 'vista', label: 'Vistas' },
]

export function ListaToolbar({ estado, orden, onEstadoChange, onOrdenChange }: ListaToolbarProps) {
  return (
    <div className="lista-toolbar">
      <fieldset className="filter-group">
        <legend>Filtrar por estado</legend>
        <div className="filter-chips">
          {FILTROS.map((filtro) => (
            <button
              key={filtro.value}
              type="button"
              className={estado === filtro.value ? 'chip chip-active' : 'chip'}
              onClick={() => onEstadoChange(filtro.value)}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="sort-label" htmlFor="lista-orden">
        Ordenar
        <select
          id="lista-orden"
          value={orden}
          onChange={(event) => onOrdenChange(event.target.value as OrdenLista)}
        >
          <option value="fecha_desc">Más recientes</option>
          <option value="fecha_asc">Más antiguos</option>
          <option value="calificacion_desc">Mayor calificación</option>
          <option value="calificacion_asc">Menor calificación</option>
        </select>
      </label>
    </div>
  )
}
