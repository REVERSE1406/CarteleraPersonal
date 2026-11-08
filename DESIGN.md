# Sistema de diseño · Mi Cartelera Personal

Se respeta el lenguaje visual real de E1: interfaz de cine nocturno, fondos carbón,
acentos dorados, tarjetas discretas y textos claros. **E1 tenía CSS propio, no
Bootstrap instalado.** En E2 se añade Bootstrap 5.3 para la rejilla y clases
utilitarias; `src/index.css` conserva los estilos existentes y
`src/noche.css` adapta el módulo nuevo sin sustituir las pantallas E1.

## Identidad y componentes

- Fondo `#121014`, panel `#181416`, borde `rgba(240,194,122,.2)`.
- Acento oro `#f0c27a`; marfil `#f4efe6`; secundario `#c9c0b4`.
- Mensajes de fallo coral `#f08a8a`; confirmaciones verde suave `#9fd4a8`.
- Fuente original: Inter cuando esté disponible, luego tipografía del sistema.
- Bootstrap: `.container-fluid`, `.row`, `.col-lg-*`, `.card`, `.badge`, `.d-flex`, `.gap-*`, `.alert`, `.progress`; mantener `.btn`, `.btn-primary`, `.btn-ghost` del proyecto y usar `.noche-*` para personalización acotada.
- Tarjetas radio 14–18 px, botones tipo píldora, poster 2:3, ancho de contenido max 1180 px.
- Layout E2: encabezado con resumen, panel lateral para tiempo/selección y área con catálogo de candidatas y sesiones guardadas. En móvil se apila sin scroll horizontal.

## Estados y accesibilidad

- Los inputs tienen etiquetas legibles, límites y errores vinculados `role=alert`.
- Los botones deshabilitados explican la razón en el texto cercano.
- Carga y guardado con `role=status`; fallos y reintento visibles sin borrar selección.
- Estado no depende solo del color: etiquetas «Cabe», «Sin duración», «No alcanza».
- Foco visible, navegación por teclado y botones con nombres accesibles.

## Prohibido

No introducir estilos inline de colores ni hardcodear el mismo token en componentes;
no usar bibliotecas visuales adicionales ni reemplazar el CSS E1; no renderizar
un poster como botón que oculte controles; no usar el rojo como único indicador
de error; no alterar los estados de la lista al guardar una sesión.

## Criterios comprobables de diseño

- **UI-01**: E2 tiene cabecera, formulario de minutos, candidatas, selección y sesiones guardadas.
- **UI-02**: usa grilla Bootstrap; entre 320 y 1440 px no hay desbordamiento horizontal.
- **UI-03**: mismas tipografías/colores/tarjetas que E1, botones con foco visible.
- **UI-04**: carga, error, vacío y éxito se expresan por texto además de estilo.
- **UI-05**: películas sin runtime y rechazadas muestran motivo y botón inactivo.
- **UI-06**: controles principales y estado del plan se pueden utilizar con teclado.

Ver `docs/diseno/brand-board.html` para muestras; la spec `docs/specs/NOCHE-DE-PELICULA.md`
referencia este documento, sin duplicar valores visuales.
