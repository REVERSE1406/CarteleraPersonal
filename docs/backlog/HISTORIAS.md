# Historias de usuario · E2

Cada historia tiene valor independiente, puede estimarse y probarse sin detalles de implementación (INVEST). Los criterios se vinculan a la spec.

## HU-E2-01 · Encontrar películas que caben (E2-01–E2-06)

**Como** persona con películas pendientes, **quiero** introducir cuánto tiempo tengo y ver qué películas caben, **para** elegir una que pueda terminar.

- **E2-01** DADO que tengo sesión iniciada CUANDO abro «Noche de película» ENTONCES puedo acceder; DADO que no la tengo CUANDO intento entrar ENTONCES necesito iniciar sesión.
- **E2-02** DADO que escribo un número entero entre 30 y 600 CUANDO lo confirmo ENTONCES ese tiempo es válido; DADO otro valor CUANDO intento planificar ENTONCES veo qué corregir y no puedo guardar.
- **E2-03** DADO que tengo películas y series en diferentes estados CUANDO consulto candidatas ENTONCES solo considero películas «por ver» de mi propia lista.
- **E2-04** DADO que una película tiene duración conocida y no supera mi tiempo CUANDO aparecen las opciones ENTONCES la veo con duración; se ordenan por duración ascendente y título.
- **E2-05** DADO que una película no tiene duración conocida CUANDO se evalúa ENTONCES aparece no disponible con motivo y no puedo agregarla.
- **E2-06** DADO que la consulta de duración tarda o falla CUANDO abro la pantalla ENTONCES veo «Cargando…» o el error y puedo reintentar.

## HU-E2-02 · Armar una noche que termine a tiempo (E2-07–E2-10)

**Como** persona que tiene un rato libre, **quiero** añadir y quitar películas viendo pausas y restante, **para** no empezar una sesión imposible.

- **E2-07** DADO que mi selección tiene N películas CUANDO agrego o quito una ENTONCES veo la suma de sus duraciones más 10 minutos entre pares y el tiempo restante.
- **E2-08** DADO que intento añadir una película que excede el restante contando su pausa CUANDO la selecciono ENTONCES no se agrega y me explican cuánto falta.
- **E2-09** DADO que la sesión ocupa exactamente el tiempo disponible CUANDO la planifico ENTONCES puedo continuar.
- **E2-10** DADO que la sesión tiene una sola película CUANDO calculo la sesión ENTONCES no hay pausa antes o después; DADO que cambia el tiempo o elegibilidad ENTONCES no se guarda un plan inválido.

## HU-E2-03 · Guardar y consultar mis planes (E2-11–E2-15)

**Como** titular de una cuenta, **quiero** guardar mi plan con nombre y volver a consultar sus títulos y tiempos, **para** organizar mi noche posteriormente.

- **E2-11** DADO que mi sesión tiene al menos una película válida CUANDO escribo un nombre y guardo ENTONCES el plan queda asociado a mí sin alterar el estado de los títulos.
- **E2-12** DADO que he guardado planes CUANDO consulto mis sesiones ENTONCES veo nombre, fecha, tiempo y detalle de títulos en orden, incluso si un título salió de mi lista.
- **E2-13** DADO que uso una cuenta diferente CUANDO intento leer o manipular sesiones ajenas ENTONCES no tengo acceso a ellas.
- **E2-14** DADO que la misma película está en una sesión anterior CUANDO hago un plan nuevo ENTONCES puedo seleccionarla de nuevo, pero no duplicarla dentro del mismo plan.
- **E2-15** DADO que guardar falla CUANDO se informa el error ENTONCES el plan sigue editable y puedo reintentar sin confirmación falsa.

## Criterios UI

**UI-01–UI-06:** criterios de apariencia, estados y accesibilidad enumerados en `DESIGN.md`. Se verifican junto a las historias anteriores.
