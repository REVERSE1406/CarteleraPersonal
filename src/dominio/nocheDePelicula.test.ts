import { describe, expect, it } from 'vitest'
import {
  calcularSesion,
  evaluarAgregar,
  validarTiempoDisponible,
} from './nocheDePelicula'

describe('tiempo disponible', () => {
  it.each([30, 120, 600])('acepta el entero %i', (minutos: number) => {
    expect(validarTiempoDisponible(minutos)).toEqual({ valido: true, minutos, mensaje: null })
  })
  it.each(['', 'hola', '-1', '30.5', '  ', 'Infinity', 29, 601, Number.NaN])(
    'rechaza tiempo inválido %s', (valor: string | number) => {
      expect(validarTiempoDisponible(valor)).toMatchObject({ valido: false, minutos: null })
    }
  )
})

describe('cálculo de sesión con pausas', () => {
  it('acepta una sola película sin pausa', () => {
    expect(calcularSesion([100])).toMatchObject({ valida: true, pausasMinutos: 0, totalMinutos: 100 })
  })
  it('suma exactamente diez minutos entre películas', () => {
    expect(calcularSesion([60, 60, 60])).toMatchObject({
      valida: true,
      pausasMinutos: 20,
      totalMinutos: 200,
    })
  })
  it('permite una selección vacía pero total 0 (guardado debe bloquearse)', () => {
    expect(calcularSesion([])).toMatchObject({ valida: true, pausasMinutos: 0, totalMinutos: 0 })
  })
  it.each([[null], [0], [-3], [1.5]])('rechaza duración ausente o incorrecta: %s', (valor: number | null) => {
    expect(calcularSesion([valor])).toMatchObject({ valida: false })
  })
})

describe('regla pura «cabe»', () => {
  it('acepta exactamente el límite: 60 + 10 + 60 = 130', () => {
    expect(evaluarAgregar([60], 60, 130)).toMatchObject({ cabe: true, totalPropuesto: 130, faltanMinutos: 0 })
  })
  it('rechaza el exceso contando la pausa', () => {
    expect(evaluarAgregar([60], 60, 120)).toMatchObject({ cabe: false, totalPropuesto: 130, faltanMinutos: 10 })
  })
  it('una película de 120 cabe en 120 minutos', () => {
    expect(evaluarAgregar([], 120, 120).cabe).toBe(true)
  })
  it('rechaza runtime desconocido', () => {
    expect(evaluarAgregar([], null, 120).cabe).toBe(false)
  })
  it('rechaza tiempo fuera de rango', () => {
    expect(evaluarAgregar([], 10, 29).cabe).toBe(false)
  })
})
