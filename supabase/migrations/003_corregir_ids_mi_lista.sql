
-- Entregable 4 - Correccion del guardado de Noche de pelicula
-- Mi lista utiliza IDs numericos, pero la funcion anterior esperaba UUID.
-- Esta migracion permite trabajar con los IDs como texto.
-- No elimina peliculas ni sesiones guardadas.

DROP FUNCTION IF EXISTS public.guardar_noche(
  text, integer, uuid[], integer[]
);

CREATE OR REPLACE FUNCTION public.guardar_noche(
  p_nombre text,
  p_tiempo_disponible integer,
  p_lista_ids text[],
  p_duraciones integer[]
)
RETURNS public.sesiones_noche
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_usuario uuid := auth.uid();

  v_nombre text := coalesce(
    nullif(btrim(p_nombre), ''),
    'Noche de película'
  );

  v_cantidad integer := coalesce(
    cardinality(p_lista_ids), 0
  );

  v_cantidad_encontrada integer;
  v_cantidad_unica integer;
  v_suma integer;
  v_total integer;
  v_snapshot jsonb;
  v_fila public.sesiones_noche%rowtype;

BEGIN

  IF v_usuario IS NULL THEN
    RAISE EXCEPTION
      'Debes iniciar sesión para guardar una noche.'
      USING errcode = '28000';
  END IF;

  IF p_tiempo_disponible IS NULL
     OR p_tiempo_disponible NOT BETWEEN 30 AND 600 THEN
    RAISE EXCEPTION
      'El tiempo debe estar entre 30 y 600 minutos.'
      USING errcode = '22023';
  END IF;

  IF char_length(v_nombre) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION
      'El nombre debe tener entre 1 y 80 caracteres.'
      USING errcode = '22023';
  END IF;

  IF v_cantidad < 1
     OR v_cantidad <> coalesce(cardinality(p_duraciones), 0) THEN
    RAISE EXCEPTION
      'Elige al menos una película y proporciona sus duraciones.'
      USING errcode = '22023';
  END IF;

  SELECT count(DISTINCT entrada.lista_id)
  INTO v_cantidad_unica
  FROM unnest(p_lista_ids) AS entrada(lista_id);

  IF v_cantidad_unica <> v_cantidad THEN
    RAISE EXCEPTION
      'No puedes repetir una película en la misma sesión.'
      USING errcode = '22023';
  END IF;

  WITH entrada AS (
    SELECT
      p_lista_ids[indice] AS lista_id,
      p_duraciones[indice] AS runtime,
      indice AS orden
    FROM generate_subscripts(p_lista_ids, 1) AS indice
  ),
  permitidas AS (
    SELECT
      e.orden,
      e.runtime,
      l.id,
      l.tmdb_id,
      l.titulo,
      l.poster_url
    FROM entrada e
    INNER JOIN public.mi_lista l
      ON l.id::text = e.lista_id
    WHERE l.user_id = v_usuario
      AND l.tipo_contenido = 'pelicula'
      AND l.estado = 'por_ver'
      AND e.runtime BETWEEN 1 AND 600
  )
  SELECT
    count(*)::integer,
    coalesce(sum(runtime), 0)::integer,
    jsonb_agg(
      jsonb_build_object(
        'lista_id', id::text,
        'tmdb_id', tmdb_id,
        'titulo', titulo,
        'poster_url', poster_url,
        'duracion_minutos', runtime
      )
      ORDER BY orden
    )
  INTO
    v_cantidad_encontrada,
    v_suma,
    v_snapshot
  FROM permitidas;

  IF v_cantidad_encontrada <> v_cantidad THEN
    RAISE EXCEPTION
      'Solo puedes guardar películas propias, por ver, con duración válida.'
      USING errcode = '23514';
  END IF;

  v_total := v_suma + 10 * (v_cantidad - 1);

  IF v_total > p_tiempo_disponible THEN
    RAISE EXCEPTION
      'La sesión supera el tiempo disponible al sumar las pausas.'
      USING errcode = '23514';
  END IF;

  INSERT INTO public.sesiones_noche (
    user_id,
    nombre,
    tiempo_disponible,
    pausa_minutos,
    duracion_total,
    peliculas
  )
  VALUES (
    v_usuario,
    v_nombre,
    p_tiempo_disponible,
    10,
    v_total,
    v_snapshot
  )
  RETURNING * INTO v_fila;

  RETURN v_fila;
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_noche(
  text, integer, text[], integer[]
) FROM public, anon;

GRANT EXECUTE ON FUNCTION public.guardar_noche(
  text, integer, text[], integer[]
) TO authenticated;

NOTIFY pgrst, 'reload schema';
