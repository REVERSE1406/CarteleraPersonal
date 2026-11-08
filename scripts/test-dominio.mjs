import assert from 'node:assert/strict'
import { calcularSesion, evaluarAgregar, validarTiempoDisponible } from '../src/dominio/nocheDePelicula.ts'

let verificaciones = 0
function comprueba(actual, esperado, descripcion) {
  assert.deepEqual(actual, esperado, descripcion)
  verificaciones++
}
for (const minutos of [30, 120, 600]) comprueba(validarTiempoDisponible(minutos).valido, true, `válido ${minutos}`)
for (const valor of [29, 601, -1, 30.5, '', 'hola', NaN]) comprueba(validarTiempoDisponible(valor).valido, false, `inválido ${valor}`)
comprueba(calcularSesion([120]).pausasMinutos, 0, 'una sola película sin pausa')
comprueba(calcularSesion([60, 60]), { valida:true, totalMinutos:130, pausasMinutos:10, mensaje:null }, 'exactitud')
comprueba(calcularSesion([60, 60, 60]).pausasMinutos, 20, 'dos pausas')
comprueba(calcularSesion([null]).valida, false, 'duración desconocida')
comprueba(calcularSesion([0]).valida, false, 'duración cero')
comprueba(calcularSesion([-1]).valida, false, 'duración negativa')
comprueba(evaluarAgregar([60],60,130).cabe, true, 'sesión exacta')
comprueba(evaluarAgregar([60],60,120).faltanMinutos, 10, 'sesión excedida')
comprueba(evaluarAgregar([],null,120).cabe, false, 'desconocida no agrega')
comprueba(evaluarAgregar([],120,120).cabe, true, 'una película exacta')
comprueba(evaluarAgregar([],10,29).cabe, false, 'tiempo fuera del rango')
console.log(`PASS ${verificaciones} comprobaciones de dominio sin red`)
