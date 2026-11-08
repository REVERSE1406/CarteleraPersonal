/** Reglas de la épica E2. Solo datos; sin red, React ni base de datos. */
export const PAUSA_MINUTOS = 10
export const MIN_MINUTOS = 30
export const MAX_MINUTOS = 600

export interface ValidacionTiempo {
  valido: boolean
  minutos: number | null
  mensaje: string | null
}

export interface CalculoSesion {
  valida: boolean
  totalMinutos: number
  pausasMinutos: number
  mensaje: string | null
}

export interface EvaluacionAgregar {
  cabe: boolean
  totalPropuesto: number
  faltanMinutos: number
  motivo: string | null
}

export function validarTiempoDisponible(entrada: string | number): ValidacionTiempo {
  const texto = String(entrada).trim()
  if (!/^\d+$/.test(texto)) {
    return { valido: false, minutos: null, mensaje: 'Ingresa un número entero de minutos.' }
  }
  const minutos = Number(texto)
  if (!Number.isSafeInteger(minutos) || minutos < MIN_MINUTOS || minutos > MAX_MINUTOS) {
    return {
      valido: false,
      minutos: null,
      mensaje: `El tiempo debe estar entre ${MIN_MINUTOS} y ${MAX_MINUTOS} minutos.`,
    }
  }
  return { valido: true, minutos, mensaje: null }
}

export function calcularSesion(
  duraciones: readonly (number | null)[],
  pausa = PAUSA_MINUTOS
): CalculoSesion {
  if (!Number.isSafeInteger(pausa) || pausa < 0) {
    return { valida: false, totalMinutos: 0, pausasMinutos: 0, mensaje: 'La pausa no es válida.' }
  }
  if (duraciones.some((valor) => valor === null || !Number.isSafeInteger(valor) || valor <= 0)) {
    return {
      valida: false,
      totalMinutos: 0,
      pausasMinutos: 0,
      mensaje: 'Una de las películas no tiene una duración válida en TMDB.',
    }
  }
  const pausasMinutos = Math.max(0, duraciones.length - 1) * pausa
  const totalMinutos = duraciones.reduce<number>((suma, valor) => suma + (valor ?? 0), 0) + pausasMinutos
  return { valida: true, totalMinutos, pausasMinutos, mensaje: null }
}

export function evaluarAgregar(
  actual: readonly (number | null)[],
  candidata: number | null,
  disponible: number,
  pausa = PAUSA_MINUTOS
): EvaluacionAgregar {
  if (!validarTiempoDisponible(disponible).valido) {
    return { cabe: false, totalPropuesto: 0, faltanMinutos: 0, motivo: 'Corrige el tiempo disponible.' }
  }
  const calculo = calcularSesion([...actual, candidata], pausa)
  if (!calculo.valida) {
    return {
      cabe: false,
      totalPropuesto: 0,
      faltanMinutos: 0,
      motivo: calculo.mensaje,
    }
  }
  const faltanMinutos = Math.max(0, calculo.totalMinutos - disponible)
  return {
    cabe: faltanMinutos === 0,
    totalPropuesto: calculo.totalMinutos,
    faltanMinutos,
    motivo: faltanMinutos > 0 ? `No cabe: faltan ${faltanMinutos} minutos (incluyendo pausas).` : null,
  }
}
