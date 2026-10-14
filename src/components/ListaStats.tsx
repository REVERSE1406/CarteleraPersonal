import type { MiListaItem } from '../types/miLista'

interface ListaStatsProps {
  items: MiListaItem[]
}

export function ListaStats({ items }: ListaStatsProps) {
  const pendientes = items.filter((item) => item.estado === 'por_ver').length
  const enProgreso = items.filter((item) => item.estado === 'viendo').length
  const vistas = items.filter((item) => item.estado === 'vista').length

  return (
    <p className="lista-stats" role="status">
      Tienes {pendientes} pendientes, {enProgreso} en progreso, {vistas} vistas.
    </p>
  )
}
