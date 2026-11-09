# Mi Cartelera Personal – Entregable 4

**Estudiante:** Martín Bastidas  
**Proyecto:** Mi Cartelera Personal  
**Nueva función:** Noche de película  
**Tecnologías:** React, TypeScript, Vite, Bootstrap, TMDB y Supabase

## 1. Descripción del proyecto

Mi Cartelera Personal es una aplicación web donde los usuarios pueden buscar películas y series, guardarlas en una lista personal y organizar lo que quieren ver.

Este proyecto empezó en el Entregable 3, donde desarrollé funciones como el registro de usuarios, inicio de sesión, búsqueda de películas, calificaciones, comentarios y estados de los títulos.

Para el Entregable 4 agregué una nueva función llamada **Noche de película**.

La idea es que el usuario pueda indicar cuánto tiempo tiene libre y organizar una sesión con películas de su lista que entren en ese tiempo.

## 2. Funciones del Proyecto 3 (E1)

Las funciones originales que se conservaron son:

- Registro e inicio de sesión con Supabase.
- Búsqueda de películas y series con TMDB.
- Lista personal de películas y series.
- Estados Por ver, Viendo y Vista.
- Calificaciones y comentarios.
- Filtros y organización de la lista.
- Consulta de detalles de películas.
- Eliminación de películas de la lista.
- Rutas protegidas para usuarios registrados.

La nueva función fue agregada sobre el proyecto anterior, sin reemplazarlo.

## 3. Nueva función: Noche de película (E2)

Noche de película permite organizar una sesión según el tiempo disponible del usuario.

### Cómo funciona

1. El usuario inicia sesión.
2. Entra a la sección Noche de película.
3. Ingresa cuántos minutos tiene disponibles.
4. La aplicación muestra las películas pendientes que pueden entrar en ese tiempo.
5. El usuario agrega una o varias películas.
6. La aplicación calcula la duración total y las pausas.
7. El usuario escribe un nombre y guarda la sesión.
8. La noche queda guardada en Supabase.
9. Después puede consultar el historial de sesiones.

### Reglas principales

- El tiempo disponible debe estar entre 30 y 600 minutos.
- Solo se pueden agregar películas propias en estado Por ver.
- Las series no están incluidas.
- La duración de las películas se consulta desde TMDB.
- Una película sin duración conocida no puede agregarse.
- Hay una pausa de 10 minutos entre películas.
- No existe pausa antes de la primera película ni después de la última.
- Una sesión puede ocupar exactamente el tiempo disponible.
- No se puede agregar una película que haga superar el límite.
- Guardar una noche no cambia el estado Por ver.
- Una película puede estar en varias noches diferentes.
- No se puede repetir una película dentro de la misma noche.
- Las sesiones guardadas no se editan.
- Si se elimina una película de Mi lista, la sesión guardada conserva su información.

## 4. Tecnologías utilizadas

| Tecnología   | Uso                                         |
| ------------ | ------------------------------------------- |
| React        | Crear las pantallas y componentes           |
| TypeScript   | Organizar el código y comprobar los tipos   |
| Vite         | Ejecutar y compilar el proyecto             |
| Bootstrap    | Ayudar con los estilos y el diseño          |
| TMDB         | Buscar películas y consultar sus duraciones |
| Supabase     | Autenticación y base de datos               |
| PostgreSQL   | Guardar las sesiones                        |
| RLS          | Proteger los datos de cada usuario          |
| Vitest       | Probar las reglas de tiempo y pausas        |
| Prettier     | Dar formato al código                       |
| Git y GitHub | Guardar el historial del proyecto           |

## 5. Instalación del proyecto

Para ejecutar el proyecto se necesita Node.js 22 o superior. Durante mis pruebas utilicé Node.js 24.22.2.

Primero se deben instalar las dependencias:

```bash
npm install
```

Después se debe crear un archivo `.env` en la raíz del proyecto, usando `.env.example` como referencia.

Las variables utilizadas son:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
VITE_TMDB_API_KEY=tu_clave_tmdb
```

Es necesario colocar las claves correspondientes al proyecto.

El archivo `.env` no se sube a GitHub.

Las variables VITE son accesibles desde el navegador. Por eso no se deben colocar contraseñas, claves `service_role` ni otros secretos privados.

## 6. Configuración de Supabase

Para que Noche de película funcione, se necesita la base de datos de Mi Cartelera Personal.

Los archivos SQL se encuentran en:

`supabase/migrations/`

Se utilizan estas migraciones:

- `001_mi_lista.sql`: configura la lista personal del Proyecto 3.
- `002_noche_pelicula.sql`: crea las sesiones de Noche de película y sus políticas RLS.
- `003_corregir_ids_mi_lista.sql`: corrige el guardado de películas con identificadores numéricos.

Para una instalación nueva se deben ejecutar las migraciones en ese orden desde el SQL Editor de Supabase.

Si las tablas ya existen y las migraciones ya fueron aplicadas, no es necesario volver a ejecutarlas.

Durante las pruebas tuve un error porque la función de guardado esperaba UUID, pero mi lista utilizaba IDs numéricos.

Lo solucioné modificando la función `guardar_noche` para que pudiera recibir los identificadores como texto.

Después comprobé que las sesiones se guardaban correctamente en Supabase.

## 7. Cómo ejecutar la aplicación

Para iniciar el servidor:

```bash
npm run dev
```

Vite mostrará una dirección local, normalmente:

`http://localhost:5173/`

Si ese puerto está ocupado, utilizará otro disponible.

Para comprobar que el proyecto compila:

```bash
npm run build
```

Para ejecutar las pruebas:

```bash
npm run test
```

Para ejecutar Vitest mientras se hacen cambios:

```bash
npm run test:watch
```

También existe una prueba del dominio sin Vitest:

```bash
npm run test:offline
```

Para dar formato al código:

```bash
npm run format
```

## 8. Resultados de las pruebas

Realicé las pruebas en mi Mac con Node.js 24.22.2.

### Pruebas automáticas

Ejecuté `npm run test` y obtuve:

| Grupo                                   | Resultado           |
| --------------------------------------- | ------------------- |
| Validación del tiempo                   | 12/12               |
| Cálculo de sesiones y pausas            | 7/7                 |
| Regla para comprobar si una sesión cabe | 5/5                 |
| **Total**                               | **24/24 aprobadas** |

También ejecuté `npm run build`.

El proyecto compiló correctamente y Vite transformó 106 módulos.

### Pruebas en la aplicación

Comprobé que:

- Se validan los tiempos de 29, 30, 600 y 601 minutos.
- Las pausas de 10 minutos se calculan correctamente.
- No se permite superar el tiempo disponible.
- Se pueden guardar sesiones en Supabase.
- Las sesiones aparecen en el historial.
- Las películas siguen en estado Por ver.
- El historial conserva películas eliminadas de Mi lista.
- La aplicación muestra errores de TMDB y permite reintentar.

### Pruebas de seguridad

Utilicé dos cuentas diferentes para comprobar que cada usuario solamente pudiera consultar sus propias sesiones.

También realicé consultas SQL para verificar las políticas RLS.

En una de las pruebas, el Usuario B obtuvo:

- Sesiones propias: 1.
- Sesiones ajenas: 0.

Comprobé además que el rol authenticated no tiene permisos directos para insertar, modificar ni eliminar sesiones.

Por último, intenté guardar una película del Usuario A utilizando la identidad del Usuario B. Supabase rechazó la operación.

Los resultados completos están registrados en:

- `docs/VERIFICACION.md`
- `docs/AUDITORIA.md`
- `docs/PRUEBA-RLS.md`

Las capturas están guardadas en `docs/evidencias/`.

## 9. Organización del código

La nueva función está separada en diferentes partes para que sea más fácil entenderla.

### Dominio

`src/dominio/nocheDePelicula.ts`

Contiene las reglas para validar el tiempo, sumar las duraciones y comprobar si una película cabe en una sesión.

Esta lógica no necesita conectarse con Supabase ni TMDB.

Las pruebas se encuentran en:

`src/dominio/nocheDePelicula.test.ts`

### Servicios

`src/services/tmdb.ts`

Se encarga de consultar las películas y sus duraciones.

`src/services/nocheDePelicula.ts`

Se encarga de consultar y guardar sesiones en Supabase.

### Interfaz

`src/pages/NocheDePeliculaPage.tsx`

Contiene la pantalla principal de Noche de película.

`src/noche.css`

Contiene los estilos de esta sección.

`src/App.tsx`

Incluye la ruta protegida de Noche de película.

### Base de datos

Las migraciones SQL están dentro de:

`supabase/migrations/`

## 10. Harness del proyecto

Para este entregable preparé una configuración para trabajar con Claude Code siguiendo las indicaciones de la tarea.

El harness contiene los archivos que ayudan al agente a conocer las reglas y la organización del proyecto.

### AGENTS.md

Contiene las reglas principales, como:

- No agregar funcionalidades sin una spec.
- Conservar las funciones del Proyecto 3.
- Separar componentes, servicios y lógica del dominio.
- No utilizar claves privadas dentro del código.
- Ejecutar pruebas antes de registrar los cambios.

### CLAUDE.md

Importa las reglas de `AGENTS.md` y señala los documentos importantes que debe consultar el agente.

### Skill /commit

Se encuentra en:

`.claude/skills/commit/SKILL.md`

Está preparada para ayudar a revisar cambios y crear commits.

### Hook de Prettier

Su configuración está en:

`.claude/settings.json`

Y el script está en:

`.claude/hooks/format-prettier.mjs`

El hook está preparado para formatear archivos modificados por Claude Code.

**Estado de verificación:** los archivos del harness están incluidos en el repositorio, pero no comprobé la ejecución completa de Claude Code porque no tenía una cuenta con acceso al servicio.

Por eso, la ejecución real de la skill y del hook está registrada como SIN VERIFICAR en la auditoría.

## 11. Documentación del proyecto

El repositorio contiene los siguientes documentos:

| Documento                         | Contenido                                 |
| --------------------------------- | ----------------------------------------- |
| `docs/ESTADO-INICIAL.md`          | Funcionamiento del Proyecto 3 antes de E2 |
| `docs/prd/PRD.md`                 | Requisitos y decisiones del proyecto      |
| `docs/backlog/HISTORIAS.md`       | Historias de usuario y criterios          |
| `docs/backlog/REFINAMIENTO.md`    | Casos especiales y decisiones             |
| `docs/backlog/TICKETS.md`         | Tareas de implementación                  |
| `docs/specs/NOCHE-DE-PELICULA.md` | Especificación técnica                    |
| `DESIGN.md`                       | Sistema de diseño                         |
| `docs/diseno/brand-board.html`    | Referencias visuales                      |
| `docs/VERIFICACION.md`            | Resultados de las pruebas                 |
| `docs/AUDITORIA.md`               | Revisión de requisitos y pendientes       |
| `docs/PRUEBA-RLS.md`              | Pruebas de seguridad                      |
| `docs/CHECKPOINTS.md`             | Referencias de los checkpoints            |

## 12. Problemas encontrados y pendientes

Durante el desarrollo encontré varios problemas que fui corrigiendo.

Los principales fueron:

- Actualización de Node.js para cumplir los requisitos de Supabase.
- Creación de la tabla sesiones_noche.
- Corrección de IDs numéricos en la función guardar_noche.
- Comprobación de los permisos y políticas RLS.
- Pruebas de errores de TMDB.

También quedaron pendientes algunas verificaciones:

- Revisar todas las funciones originales del Proyecto 3.
- Completar las pruebas de interfaz que aparecen como SIN VERIFICAR.
- Probar el diseño en diferentes tamaños de pantalla.
- Comprobar la navegación con teclado.
- Verificar la ejecución real del harness de Claude Code.
- Revisar las vulnerabilidades que todavía reporta npm.

Los criterios pendientes están explicados en `docs/AUDITORIA.md`, junto con las razones por las que todavía no se marcaron como cumplidos.

Durante las pruebas desactivé la confirmación de correo en Supabase. Antes de publicar la aplicación para uso real, debo revisar nuevamente esa configuración.

## 13. Historial Git y repositorio

El proyecto conserva el historial original del Proyecto 3.

Para el Entregable 4 se agregaron commits de manera ordenada para documentar:

- Configuración del harness.
- Estado inicial y sistema de diseño.
- PRD, historias y especificaciones.
- Implementación de Noche de película.
- Pruebas y correcciones de Supabase.
- Verificación, evidencias y auditoría.

El código y los commits se encuentran en GitHub:

https://github.com/REVERSE1406/CarteleraPersonal

## 14. Conclusión

Con este entregable pude agregar una nueva función a Mi Cartelera Personal sin tener que rehacer todo el proyecto.

Noche de película permite aprovechar mejor el tiempo disponible, organizar películas pendientes y guardar sesiones para consultarlas después.

Las pruebas principales funcionaron correctamente, incluyendo los cálculos de duración, las pausas, el guardado en Supabase y la seguridad entre usuarios.

También pude organizar mejor el trabajo mediante documentos, tickets, pruebas y commits de Git.
