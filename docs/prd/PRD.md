# PRD · Mi Cartelera Personal

**Producto:** Mi Cartelera Personal · **E1:** Cartelera (existente) · **E2:** Noche de película (nuevo).
**Problema:** una persona guarda títulos para ver, pero desconoce cuáles puede terminar durante el tiempo libre que tiene; termina abandonando películas a medias.
**Usuario:** titular de una cuenta personal que ya tiene películas en su lista «por ver».
**Objetivo de éxito:** planificar una sesión completa dentro del tiempo disponible sin comenzar una película imposible de terminar.

## E1 — Cartelera personal (ya construida)

Registro y acceso personal; búsqueda de películas/series; guardar títulos; ver, editar y eliminar su lista; clasificar por estado; anotar calificación y comentarios; ordenar/filtrar; consultar ficha. No se reemplaza ni cambia su comportamiento por E2.

## E2 — Noche de película

El usuario indica el tiempo libre, ve películas pendientes que caben y sus duraciones, construye una secuencia, comprueba su duración y su tiempo restante, la guarda y consulta sesiones anteriores. Puede guardar sesiones diferentes para una misma película. **No se exige ver las películas en esta app.**

### Alcance

- Acceso solo para usuarios autenticados y usando exclusivamente su lista propia.
- Tiempo entero entre **30 y 600 minutos**, inclusive.
- Solo películas con estado **«por ver»**; las series quedan fuera.
- Duración tomada de la información disponible de cada película.
- Pausa de **10 minutos entre dos películas consecutivas**, ninguna al inicio o al final.
- Si la suma exacta coincide con el tiempo disponible, **sí cabe**.
- Mostrar duración de cada candidata; explicar «duración desconocida» o «no alcanza» cuando proceda.
- Ver duración total y restante mientras se selecciona; no permitir agregar si excedería el tiempo.
- Guardar y consultar sesiones asociadas a la cuenta con sus títulos y duraciones.
- Guardar una sesión **no** cambia el estado de ninguna película de la lista.

### Decisiones del cliente resueltas (cinco)

1. **¿Una película puede estar en dos sesiones guardadas? Sí.** Una sesión es un plan, no una reserva, por lo que el usuario puede organizar dos noches alternativas. Una misma película no se repite **dentro** de la misma sesión.
2. **Orden de candidatas: de menor a mayor duración** y empate alfabético. Es una regla simple, visible y útil para encontrar opciones que caben en un rato corto.
3. **¿Se modifica la sesión guardada? No.** Se guardan planes inmutables; crear otra sesión evita estados ambiguos cuando cambian tiempo o títulos. [SUPUESTO] Decisión de alcance para la versión inicial.
4. **¿Qué ocurre al eliminar una película de la lista?** La sesión guardada conserva la ficha de título y duración que tenía al guardarse, pero ya no permite agregarla a planes nuevos. [SUPUESTO] Conserva el historial personal sin bloquear el borrado de la lista.
5. **¿Tiene nombre o fecha?** Nombre editable previo al guardado, no vacío; si no escribe uno se propone «Noche de película». La fecha de guardado se registra automáticamente y se muestra en sesiones anteriores. [SUPUESTO] Ayuda a distinguir varias sesiones sin imponer agenda.

### Reglas adicionales y casos borde adoptados

- Tiempo vacío, decimal, negativo, fuera de rango o texto: mensaje y acciones de selección/guardado inhabilitadas.
- Duración desconocida o cero: película visible como no seleccionable, con explicación. Un error de conexión indica reintento; no se inventan duraciones.
- Una sesión sin películas no puede guardarse.
- Al añadir una segunda película se cuenta la pausa nueva; quitar un título elimina su pausa correspondiente.
- Si el tiempo disponible cambia y deja el plan fuera del límite: se conserva la selección para que el usuario la corrija, pero no se puede guardar ni añadir hasta ajustarla.
- Una película que cambió a «viendo»/«vista» o fue retirada de la lista antes de guardar deja de ser elegible; se quita de la selección. La persistencia valida de nuevo el estado actual.
- Cuando la consulta externa falla, se conserva la explicación y se ofrece reintentar.

### No-alcance explícito

Series, lista de amigos o sesiones compartidas, recordatorios, notificaciones, sincronización con servicios de streaming/calendarios, recomendaciones de fuera de la lista, reproducción de vídeos, modificar o borrar sesiones ya guardadas y marcar automáticamente películas como vistas.

### Supuestos y puntos abiertos

[SUPUESTO] Sesiones como planes históricos inmutables; la duración guardada corresponde a la consulta externa al momento de planificar, aunque después se actualice. [SUPUESTO] No se impone límite a la cantidad de sesiones guardadas por cuenta. **Abierto para decisión futura**: archivar o eliminar planes anteriores (fuera de E2). Las reglas anteriores no dependen de decisiones técnicas.
