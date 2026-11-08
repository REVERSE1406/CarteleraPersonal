import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMiLista } from '../context/MiListaContext'
import { calcularSesion, evaluarAgregar, PAUSA_MINUTOS, validarTiempoDisponible } from '../dominio/nocheDePelicula'
import { fetchTmdbMovieRuntime } from '../services/tmdb'
import type { MiListaItem } from '../types/miLista'
import type { DuracionPelicula } from '../types/nocheDePelicula'

const TAMANO_LOTE = 4

type EstadoConsulta = 'idle' | 'loading' | 'ready'

function formatearDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const sobrantes = minutos % 60
  return horas > 0 ? `${horas} h ${sobrantes.toString().padStart(2, '0')} min` : `${minutos} min`
}

function ordenarPorDuracion(a: MiListaItem, b: MiListaItem, resultados: Record<string, DuracionPelicula>): number {
  const aMinutos = resultados[a.id]?.duracionMinutos ?? Number.POSITIVE_INFINITY
  const bMinutos = resultados[b.id]?.duracionMinutos ?? Number.POSITIVE_INFINITY
  return aMinutos - bMinutos || a.titulo.localeCompare(b.titulo, 'es')
}

export function NocheDePeliculaPage() {
  const { items, isLoading: cargandoLista, errorMessage: errorLista } = useMiLista()
  const [minutosTexto, setMinutosTexto] = useState('120')
  const [nombre, setNombre] = useState('Noche de película')
  const [seleccionIds, setSeleccionIds] = useState<string[]>([])
  const [duraciones, setDuraciones] = useState<Record<string, DuracionPelicula>>({})
  const [estadoConsulta, setEstadoConsulta] = useState<EstadoConsulta>('idle')
  const [fallosConsulta, setFallosConsulta] = useState(0)
  const [reintentos, setReintentos] = useState(0)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const tiempo = validarTiempoDisponible(minutosTexto)
  const peliculasPorVer = useMemo(
    () => items.filter((item) => item.tipo_contenido === 'pelicula' && item.estado === 'por_ver'),
    [items]
  )

  useEffect(() => {
    // El usuario puede editar su lista desde otra página: al volver se revalida la selección.
    setSeleccionIds((actual) => {
      const filtrada = actual.filter((id) => peliculasPorVer.some((item) => item.id === id))
      return filtrada.length === actual.length ? actual : filtrada
    })
  }, [peliculasPorVer])

  useEffect(() => {
    if (cargandoLista || errorLista !== null) return
    const controller = new AbortController()
    let cancelado = false
    setDuraciones({})
    setFallosConsulta(0)
    setEstadoConsulta(peliculasPorVer.length ? 'loading' : 'ready')

    async function consultarDuraciones() {
      let fallos = 0
      for (let inicio = 0; inicio < peliculasPorVer.length; inicio += TAMANO_LOTE) {
        if (cancelado) return
        const lote = peliculasPorVer.slice(inicio, inicio + TAMANO_LOTE)
        const obtenidos = await Promise.all(lote.map(async (pelicula): Promise<DuracionPelicula> => {
          try {
            const duracionMinutos = await fetchTmdbMovieRuntime(pelicula.tmdb_id, controller.signal)
            return { listaId: pelicula.id, duracionMinutos, error: null }
          } catch (error: unknown) {
            const detalle = error instanceof Error ? error.message : 'Fallo al consultar TMDB.'
            return { listaId: pelicula.id, duracionMinutos: null, error: detalle }
          }
        }))
        if (cancelado) return
        fallos += obtenidos.filter((resultado) => resultado.error !== null).length
        setDuraciones((anterior) => {
          const siguiente = { ...anterior }
          for (const resultado of obtenidos) siguiente[resultado.listaId] = resultado
          return siguiente
        })
      }
      if (!cancelado) {
        setFallosConsulta(fallos)
        setEstadoConsulta('ready')
      }
    }

    void consultarDuraciones()
    return () => {
      cancelado = true
      controller.abort()
    }
  }, [peliculasPorVer, cargandoLista, errorLista, reintentos])

  const seleccion = seleccionIds
    .map((id) => peliculasPorVer.find((pelicula) => pelicula.id === id))
    .filter((pelicula): pelicula is MiListaItem => pelicula !== undefined)
  const duracionesElegidas = seleccion.map((pelicula) => duraciones[pelicula.id]?.duracionMinutos ?? null)
  const calculo = calcularSesion(duracionesElegidas)
  const total = calculo.valida ? calculo.totalMinutos : 0
  const restante = tiempo.minutos !== null && calculo.valida ? tiempo.minutos - total : null
  const excedida = restante !== null && restante < 0
  const nombreValido = nombre.trim().length >= 1 && nombre.trim().length <= 80

  const candidatas = peliculasPorVer
    .filter((pelicula) => {
      const runtime = duraciones[pelicula.id]?.duracionMinutos
      return runtime !== null && runtime !== undefined && tiempo.minutos !== null && runtime <= tiempo.minutos
    })
    .sort((a, b) => ordenarPorDuracion(a, b, duraciones))
  const noDisponibles = peliculasPorVer
    .filter((pelicula) => {
      const consulta = duraciones[pelicula.id]
      return consulta !== undefined && (consulta.duracionMinutos === null ||
        (tiempo.minutos !== null && consulta.duracionMinutos > tiempo.minutos))
    })
    .sort((a, b) => ordenarPorDuracion(a, b, duraciones))

  function agregarPelicula(pelicula: MiListaItem) {
    if (seleccionIds.includes(pelicula.id)) return
    const runtime = duraciones[pelicula.id]?.duracionMinutos ?? null
    if (tiempo.minutos === null) {
      setMensaje('Primero ingresa un tiempo válido entre 30 y 600 minutos.')
      return
    }
    const resultado = evaluarAgregar(duracionesElegidas, runtime, tiempo.minutos)
    if (!resultado.cabe) {
      setMensaje(resultado.motivo)
      return
    }
    setSeleccionIds((actual) => [...actual, pelicula.id])
    setMensaje(null)
  }

  function quitarPelicula(id: string) {
    setSeleccionIds((actual) => actual.filter((seleccionado) => seleccionado !== id))
    setMensaje(null)
  }

  return (
    <section className="catalog-page noche-page container-fluid px-0">
      <header className="noche-hero">
        <div>
          <p className="eyebrow">Tu cine · Tu tiempo</p>
          <h1>Noche de película <span aria-hidden="true">✦</span></h1>
          <p>Elige cuánto tiempo tienes y prepara una sesión que puedas terminar.</p>
        </div>
        <span className="noche-hero-icon" aria-hidden="true">◉</span>
      </header>

      <div className="row g-4 noche-content">
        <div className="col-12 col-lg-4">
          <section className="noche-panel noche-plan" aria-labelledby="titulo-plan">
            <p className="eyebrow">01 / Planifica</p>
            <h2 id="titulo-plan">Tu tiempo disponible</h2>
            <label htmlFor="minutos-noche" className="noche-label">¿Cuántos minutos tienes hoy?</label>
            <div className="noche-input-row">
              <input id="minutos-noche" type="number" min="30" max="600" step="1"
                value={minutosTexto} onChange={(event) => { setMinutosTexto(event.target.value); setMensaje(null) }}
                aria-invalid={!tiempo.valido} aria-describedby="ayuda-tiempo" />
              <span>minutos</span>
            </div>
            <p id="ayuda-tiempo" className={tiempo.valido ? 'noche-help' : 'form-error'}>
              {tiempo.mensaje ?? 'Desde 30 hasta 600 minutos, sin decimales.'}
            </p>
            <p className="noche-pausa">Cada cambio de película incluye una pausa de <strong>{PAUSA_MINUTOS} min</strong>.</p>
            <div className="noche-separator" />
            <p className="eyebrow">02 / Tu selección</p>
            <h2>Sesión en preparación</h2>
            {seleccion.length === 0 ? (
              <p className="noche-muted">Todavía no has añadido películas. Elige una opción de la cartelera.</p>
            ) : (
              <ol className="noche-seleccion">
                {seleccion.map((pelicula) => (
                  <li key={pelicula.id}>
                    <div><strong>{pelicula.titulo}</strong><small>{duraciones[pelicula.id]?.duracionMinutos == null ? 'Duración pendiente' : formatearDuracion(duraciones[pelicula.id].duracionMinutos!)}</small></div>
                    <button type="button" className="btn btn-ghost noche-quitar" onClick={() => quitarPelicula(pelicula.id)} aria-label={`Quitar ${pelicula.titulo}`}>Quitar</button>
                  </li>
                ))}
              </ol>
            )}
            <div className="noche-resumen" aria-live="polite">
              <div><span>Películas</span><strong>{seleccion.length}</strong></div>
              <div><span>Pausas</span><strong>{calculo.valida ? formatearDuracion(calculo.pausasMinutos) : '—'}</strong></div>
              <div><span>Duración total</span><strong>{calculo.valida ? formatearDuracion(total) : '—'}</strong></div>
              <div className={excedida ? 'noche-warning' : 'noche-restante'}><span>Tiempo restante</span><strong>{restante !== null ? `${restante} min` : '—'}</strong></div>
            </div>
            {excedida && <p className="form-error" role="alert">Tu selección excede el tiempo por {-restante!} minutos. Quita películas o aumenta el tiempo.</p>}
            {!calculo.valida && seleccion.length > 0 && <p className="form-error" role="alert">{calculo.mensaje}</p>}
            {mensaje !== null && <p className="form-error" role="alert">{mensaje}</p>}
            <label className="noche-label" htmlFor="nombre-sesion">Nombre de tu sesión</label>
            <input id="nombre-sesion" type="text" maxLength={80} value={nombre}
              onChange={(event) => setNombre(event.target.value)} aria-invalid={!nombreValido} />
            {!nombreValido && <p className="form-error">Escribe un nombre de 1 a 80 caracteres.</p>}
            <p className="noche-muted noche-pequeno">Las películas no pasarán a «vista» al guardar.</p>
            <div className="noche-guardar-pendiente">Consulta y guardado de sesiones disponibles en el siguiente bloque.</div>
          </section>
        </div>

        <div className="col-12 col-lg-8">
          <section className="noche-panel" aria-labelledby="titulo-candidatas">
            <div className="noche-section-heading">
              <div><p className="eyebrow">03 / Descubre</p><h2 id="titulo-candidatas">Películas que caben</h2></div>
              <span className="badge noche-badge">{candidatas.length} disponibles</span>
            </div>
            {cargandoLista && <p className="search-status" role="status"><span className="spinner" aria-hidden="true" /> Cargando tu lista…</p>}
            {errorLista !== null && <p className="form-error" role="alert">{errorLista}</p>}
            {!cargandoLista && !errorLista && peliculasPorVer.length === 0 && (
              <div className="noche-vacio"><p>No tienes películas «por ver» todavía.</p><Link to="/">Buscar películas en el catálogo</Link></div>
            )}
            {estadoConsulta === 'loading' && <p className="search-status" role="status"><span className="spinner" aria-hidden="true" /> Consultando la duración de tus películas en TMDB…</p>}
            {estadoConsulta === 'ready' && fallosConsulta > 0 && (
              <div className="noche-error-externo" role="alert">
                <span>No se pudo consultar la duración de {fallosConsulta} película(s).</span>
                <button className="btn btn-ghost" type="button" onClick={() => setReintentos((actual) => actual + 1)}>Reintentar consulta</button>
              </div>
            )}
            {tiempo.valido && estadoConsulta === 'ready' && peliculasPorVer.length > 0 && candidatas.length === 0 && (
              <p className="noche-muted">Ninguna película conocida cabe en {tiempo.minutos} minutos. Prueba otro tiempo.</p>
            )}
            {!tiempo.valido && <p className="noche-muted">Escribe un tiempo válido para mostrar las películas que caben.</p>}

            <div className="noche-grid">
              {candidatas.map((pelicula) => {
                const runtime = duraciones[pelicula.id]?.duracionMinutos ?? null
                const elegida = seleccionIds.includes(pelicula.id)
                const evaluacion = tiempo.minutos !== null
                  ? evaluarAgregar(duracionesElegidas, runtime, tiempo.minutos)
                  : null
                const puedeAgregar = !elegida && evaluacion?.cabe === true
                return (
                  <article className="noche-pelicula" key={pelicula.id}>
                    <div className="noche-poster">{pelicula.poster_url ? <img loading="lazy" src={pelicula.poster_url} alt={`Póster de ${pelicula.titulo}`} /> : <div className="poster-fallback">Sin póster</div>}</div>
                    <div className="noche-pelicula-texto"><h3>{pelicula.titulo}</h3><p>{runtime !== null && formatearDuracion(runtime)}</p>
                      {elegida ? (
                        <button type="button" className="btn btn-ghost noche-btn-pelicula" onClick={() => quitarPelicula(pelicula.id)}>✓ Añadida · Quitar</button>
                      ) : (
                        <button type="button" className="btn btn-primary noche-btn-pelicula" disabled={!puedeAgregar} onClick={() => agregarPelicula(pelicula)}>{puedeAgregar ? '+ Añadir a la sesión' : 'No alcanza el tiempo'}</button>
                      )}
                      {!elegida && !puedeAgregar && evaluacion?.motivo && <small className="noche-aviso">{evaluacion.motivo}</small>}
                    </div>
                  </article>
                )
              })}
            </div>

            {noDisponibles.length > 0 && (
              <div className="noche-indisponibles"><h3>No disponibles para esta noche</h3>
                <ul>{noDisponibles.map((pelicula) => {
                  const consulta = duraciones[pelicula.id]
                  const motivo = consulta?.error ?? (consulta?.duracionMinutos === null
                    ? 'Sin duración conocida en TMDB'
                    : `No cabe en ${tiempo.minutos} min (dura ${consulta?.duracionMinutos} min)`)
                  return <li key={pelicula.id}><span>{pelicula.titulo}</span><small>{motivo}</small></li>
                })}</ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
