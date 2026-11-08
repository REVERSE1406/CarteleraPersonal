# Refinamiento/poke-holes asistido · E2

Registro de casos borde planteados en la revisión asistida de la ficha del cliente. La aceptación/rechazo corresponde a esta especificación del proyecto; **no afirmamos que se haya ejecutado un taller interactivo con Claude Code**. Para validación en clase, revisar estas decisiones con el docente y registrar cualquier cambio antes de código adicional.

| Caso propuesto | Decisión | Razón y criterio |
| --- | --- | --- |
| Tiempo `29`, `601`, vacío, letras, decimal, `NaN` | Aceptar | Solo enteros 30–600; E2-02 |
| Película 90 min con 90 min libres | Aceptar | Igualdad válida; E2-09 |
| Dos de 60 con 130 libres | Aceptar | 60+10+60=130; E2-07 |
| Dos de 60 con 120 libres | Aceptar bloqueo | Pausa obliga 130; E2-08 |
| Una sola película con pausa de 10 | Rechazar | Cliente dice 0 pausas con un título; E2-10 |
| TMDB informa `runtime=null` o `0` | Aceptar como no disponible | No asumir duración; E2-05 |
| Error parcial: 1 de 4 consultas falla | Aceptar | Permitir ver las otras e informar error/reintento; E2-06 |
| Repetir título dos veces en misma sesión | Rechazar | No es una sesión de varias copias de una película; E2-14 |
| Usar una película en sesiones diferentes | Aceptar | Sesiones son alternativas; E2-14 |
| Cambiar tiempo después de escoger películas | Aceptar control | No guardar excedente; E2-10 |
| Cambiar a «vista» o borrar película antes de guardar | Aceptar exclusión | No viola «por ver»; E2-03, E2-10 |
| Borrar película de lista tras guardar sesión | Aceptar snapshot | Preservar plan histórico; E2-12 |
| Guardar sesión vacía | Rechazar | No es una noche; E2-11 |
| Dos pestañas guardan mientras lista cambia | Aceptar revalidación | La persistencia debe comprobar elegibilidad al guardar; E2-11, E2-13 |
| Almacenar duración inventada si TMDB se cae | Rechazar | Reglas fuente y verificación; E2-05 |
| Sesiones editables después de guardar | Rechazar en E2 | Decisión de alcance: inmutables; E2-12 |
| Sin conexión, mostrar éxito local | Rechazar | No prometer persistencia sin confirmación; E2-15 |
| Notificar al empezar la sesión | Rechazar | Fuera de alcance del cliente |
| «Marcar como vista» al guardar | Rechazar | Contradice decisión explícita del cliente |
