-- ═══════════════════════════════════════════════════════════════════════════════════════════════
-- EL CATÁLOGO COMERCIAL DE NEXUS, EN LA BASE DE DATOS
-- Spec: 02-DOCS/wiki/sdd/specs/catalogo-en-supabase.md · Plan §4 · Decisión S-0034
--
-- Pegar entero en Supabase → SQL Editor → New query → Run.
--
-- Por qué CUATRO tablas y no un documento JSON en una fila: cambiar un precio tiene que ser editar
-- UNA CELDA en el editor de tablas. Un blob de JSON habría regalado atomicidad, pero convertiría
-- «cambiar un precio sin publicar» en «editar JSON a mano», que es apenas mejor que editar el
-- fichero de código del que venimos. La atomicidad se recupera abajo, con `catalogo_vigente()`.
--
-- Todo va dentro de UNA transacción, igual que `schema.sql`: o queda creado Y cerrado, o no queda
-- nada. Nunca existe un instante con las tablas creadas y abiertas.
-- ═══════════════════════════════════════════════════════════════════════════════════════════════

begin;

-- ───────────────────────────────────────────────────────────────────────────────────────────────
-- 1. LAS CUATRO TABLAS
-- ───────────────────────────────────────────────────────────────────────────────────────────────

-- Los seis servicios del catálogo oficial 2026.
create table if not exists public.catalogo_servicios (
  id            text    primary key,
  label         text    not null check (length(trim(label)) > 0),
  official_min  integer not null check (official_min >= 0),
  official_max  integer          check (official_max >= 0),
  unit          text    not null check (unit in ('total', 'month')),
  open_ended    boolean not null default false,

  -- CA-03: un mínimo por encima de su máximo no es un precio agresivo, es un error de tecleo.
  constraint rango_coherente check (official_max is null or official_min <= official_max),

  -- CA-05, en las DOS direcciones, porque son dos errores distintos:
  --   · techo nulo sin rango abierto  → alguien borró el máximo sin querer
  --   · rango abierto CON techo       → contradice al catálogo comercial, que dice que ese techo
  --                                     «se cierra en llamada de alcance»
  constraint techo_solo_en_rango_abierto check (
    (open_ended and official_max is null) or (not open_ended and official_max is not null)
  )
);

-- Multiplicadores de tamaño, madurez y urgencia.
create table if not exists public.catalogo_factores (
  bloque text    not null check (bloque in ('size', 'maturity', 'timing')),
  clave  text    not null,
  valor  numeric not null,

  primary key (bloque, clave),

  -- C-2. Un multiplicador de 0 anularía el precio EN SILENCIO; uno de 50 lo dispararía. El techo
  -- está en 3 y no más cerca a propósito: los vigentes van de 0,8 a 1,25, así que cabe holgado un
  -- cambio comercial futuro. Una frontera apretada acabaría estorbando, y lo que estorba se quita.
  constraint multiplicador_posible check (valor > 0 and valor <= 3)
);

-- Tabla de puntos de cualificación.
create table if not exists public.catalogo_puntos (
  bloque text    not null check (bloque in ('sponsor', 'budget', 'timing', 'maturity', 'size')),
  clave  text    not null,
  puntos integer not null,

  primary key (bloque, clave),

  -- Negativo SÍ es válido: la urgencia resta un punto a propósito. Lo que no es válido es un 99.
  constraint puntuacion_posible check (puntos between -10 and 10)
);

-- Los cinco ajustes sueltos. Tabla de UNA sola fila: el truco del `check (id)` sobre un booleano
-- impide que existan dos, que es la forma en que estas tablas se estropean.
create table if not exists public.catalogo_ajustes (
  id            boolean primary key default true check (id),
  threshold     integer not null check (threshold >= 0),
  max_score     integer not null check (max_score > 0),
  margin        numeric not null check (margin >= 0 and margin < 1),
  rounding_step integer not null check (rounding_step > 0),
  expires_on    date    not null,

  -- Un umbral por encima de la puntuación máxima significa que NADIE cualifica jamás, y el sitio
  -- seguiría funcionando sin dar ninguna señal de que algo va mal. Es el fallo más silencioso
  -- posible en esta tabla.
  constraint umbral_alcanzable check (threshold <= max_score)
);

-- ───────────────────────────────────────────────────────────────────────────────────────────────
-- 2. LA GUARDA QUE NINGÚN `CHECK` PUEDE DAR: EL CATÁLOGO ESTÁ COMPLETO
--
-- Un `CHECK` mira una fila. Esto mira el conjunto: que estén los seis servicios, que cada bloque de
-- factores y de puntos tenga todas sus claves, y que no haya nada de más.
--
-- CA-12 / clarify C-5: retirar un servicio NO es un cambio de precio. El formulario ofrece unos
-- retos y cada reto apunta a un servicio; borrar uno dejaría un reto apuntando al vacío. Retirar un
-- servicio es un cambio de PRODUCTO, toca el código, y sigue requiriendo publicar el sitio.
-- ───────────────────────────────────────────────────────────────────────────────────────────────

create or replace function public.catalogo_completo() returns trigger
language plpgsql as $$
declare
  faltan text[];
  sobran text[];
begin
  -- Los seis servicios
  select array_agg(x) into faltan from unnest(array[
    'ai_opportunity_assessment', 'ai_transformation_program', 'ai_executive_advisory',
    'cyber_resilience_assessment', 'esg_strategy_compliance', 'custom_ai_solutions'
  ]) as x where x not in (select s.id from public.catalogo_servicios s);

  if faltan is not null then
    raise exception 'El catálogo quedaría SIN: %. Retirar un servicio no es un cambio de precio: es un cambio de producto, toca los retos del formulario y requiere publicar el sitio (CA-12).',
      array_to_string(faltan, ', ');
  end if;

  select array_agg(s.id) into sobran from public.catalogo_servicios s
  where s.id not in (
    'ai_opportunity_assessment', 'ai_transformation_program', 'ai_executive_advisory',
    'cyber_resilience_assessment', 'esg_strategy_compliance', 'custom_ai_solutions'
  );

  if sobran is not null then
    raise exception 'Servicios fuera del catálogo oficial 2026: %. Sólo se estima lo catalogado; lo demás deriva a llamada de alcance (constitution 4).',
      array_to_string(sobran, ', ');
  end if;

  -- Cada bloque de factores, con todas sus claves y ninguna de más
  select array_agg(b || '/' || k) into faltan from (
    values ('size','<50'),('size','50-249'),('size','250-999'),('size','>=1000'),
           ('maturity','inicial'),('maturity','en_desarrollo'),('maturity','avanzada'),
           ('timing','<3m'),('timing','3-6m'),('timing','>6m')
  ) as esperado(b, k)
  where not exists (select 1 from public.catalogo_factores f where f.bloque = b and f.clave = k);

  if faltan is not null then
    raise exception 'Faltan factores: %. Un catálogo con un bloque incompleto no es parcial, es inválido.',
      array_to_string(faltan, ', ');
  end if;

  -- Cada bloque de puntos
  select array_agg(b || '/' || k) into faltan from (
    values ('sponsor','si'),('sponsor','en_proceso'),('sponsor','no'),
           ('budget','asignado'),('budget','previsto'),('budget','sin'),
           ('timing','<3m'),('timing','3-6m'),('timing','>6m'),
           ('maturity','inicial'),('maturity','en_desarrollo'),('maturity','avanzada'),
           ('size','<50'),('size','50-249'),('size','250-999'),('size','>=1000')
  ) as esperado(b, k)
  where not exists (select 1 from public.catalogo_puntos p where p.bloque = b and p.clave = k);

  if faltan is not null then
    raise exception 'Faltan puntuaciones: %.', array_to_string(faltan, ', ');
  end if;

  if (select count(*) from public.catalogo_ajustes) <> 1 then
    raise exception 'catalogo_ajustes debe tener exactamente una fila.';
  end if;

  return null;
end $$;

-- DEFERRABLE INITIALLY DEFERRED: la comprobación ocurre al CERRAR la transacción, no fila a fila.
-- Sin esto, sembrar el catálogo sería imposible: al insertar el primer servicio faltarían cinco.
drop trigger if exists catalogo_servicios_completo on public.catalogo_servicios;
create constraint trigger catalogo_servicios_completo
  after insert or update or delete on public.catalogo_servicios
  deferrable initially deferred
  for each row execute function public.catalogo_completo();

drop trigger if exists catalogo_factores_completo on public.catalogo_factores;
create constraint trigger catalogo_factores_completo
  after insert or update or delete on public.catalogo_factores
  deferrable initially deferred
  for each row execute function public.catalogo_completo();

drop trigger if exists catalogo_puntos_completo on public.catalogo_puntos;
create constraint trigger catalogo_puntos_completo
  after insert or update or delete on public.catalogo_puntos
  deferrable initially deferred
  for each row execute function public.catalogo_completo();

-- ───────────────────────────────────────────────────────────────────────────────────────────────
-- 3. UN VIAJE, UNA INSTANTÁNEA
--
-- Lee las cuatro tablas en UNA sentencia, así que lo que sale es coherente por construcción: nunca
-- medio catálogo, nunca una mezcla de dos ediciones (CA-07). Pedir las cuatro tablas por separado
-- habrían sido cuatro viajes y cuatro instantáneas distintas — es la misma lección que dejó el
-- límite de frecuencia (`S-0030`): atomicidad y aislamiento no son lo mismo.
--
-- `security definer` es lo que permite que la llave de lectura NO tenga permiso sobre las tablas:
-- sólo puede EJECUTAR esto. No puede hacer `select` sobre `catalogo_servicios` ni aunque quiera.
-- ───────────────────────────────────────────────────────────────────────────────────────────────

create or replace function public.catalogo_vigente() returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'services', (
      select jsonb_object_agg(s.id, jsonb_build_object(
        'id',          s.id,
        'label',       s.label,
        'officialMin', s.official_min,
        'officialMax', s.official_max,
        'unit',        s.unit,
        'openEnded',   s.open_ended
      )) from public.catalogo_servicios s
    ),
    'sizeFactor',     (select jsonb_object_agg(clave, valor)  from public.catalogo_factores where bloque = 'size'),
    'maturityFactor', (select jsonb_object_agg(clave, valor)  from public.catalogo_factores where bloque = 'maturity'),
    'timingFactor',   (select jsonb_object_agg(clave, valor)  from public.catalogo_factores where bloque = 'timing'),
    'sponsorPoints',  (select jsonb_object_agg(clave, puntos) from public.catalogo_puntos   where bloque = 'sponsor'),
    'budgetPoints',   (select jsonb_object_agg(clave, puntos) from public.catalogo_puntos   where bloque = 'budget'),
    'timingPoints',   (select jsonb_object_agg(clave, puntos) from public.catalogo_puntos   where bloque = 'timing'),
    'maturityPoints', (select jsonb_object_agg(clave, puntos) from public.catalogo_puntos   where bloque = 'maturity'),
    'sizePoints',     (select jsonb_object_agg(clave, puntos) from public.catalogo_puntos   where bloque = 'size'),
    'threshold',      (select threshold     from public.catalogo_ajustes),
    'maxScore',       (select max_score     from public.catalogo_ajustes),
    'margin',         (select margin        from public.catalogo_ajustes),
    'roundingStep',   (select rounding_step from public.catalogo_ajustes),
    'expiresOn',      (select to_char(expires_on, 'YYYY-MM-DD') from public.catalogo_ajustes)
  );
$$;

-- ───────────────────────────────────────────────────────────────────────────────────────────────
-- 4. CIERRE DE ACCESO
--
-- Mismo patrón, probado, que `schema.sql`: seguridad de fila activada SIN NINGUNA policy, más
-- retirada explícita de permisos. Dos cerraduras distintas, no la misma dos veces.
-- ───────────────────────────────────────────────────────────────────────────────────────────────

alter table public.catalogo_servicios enable row level security;
alter table public.catalogo_factores  enable row level security;
alter table public.catalogo_puntos    enable row level security;
alter table public.catalogo_ajustes   enable row level security;

-- CA-18: la llave pública del sitio no puede leer el catálogo. Lleva multiplicadores, tabla de
-- puntos y umbral, y el principio 8 dice que eso no llega al navegador NUNCA.
revoke all on public.catalogo_servicios, public.catalogo_factores,
              public.catalogo_puntos,    public.catalogo_ajustes
  from anon, authenticated, public;

revoke all on function public.catalogo_vigente() from anon, authenticated, public;

-- ───────────────────────────────────────────────────────────────────────────────────────────────
-- 5. LA LLAVE QUE SÓLO PUEDE LEER  (CA-14)
--
-- El sitio publicado NUNCA escribe precios. La forma de que no pueda no es prometerlo: es no darle
-- con qué. Este rol puede ejecutar la función y NADA más — ni un `select` sobre las tablas, ni un
-- `insert`, ni un `update`. Que la función sea `security definer` es lo que lo hace posible.
--
-- Después de ejecutar esto: Supabase → Project Settings → API Keys → Create secret key,
-- y elegir el rol `catalogo_lector`. Esa clave va a SUPABASE_CATALOG_READ_KEY.
-- ───────────────────────────────────────────────────────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'catalogo_lector') then
    create role catalogo_lector nologin noinherit;
  end if;
end $$;

grant usage on schema public to catalogo_lector;
grant execute on function public.catalogo_vigente() to catalogo_lector;

-- Redundante a propósito, por si mañana alguien concede permisos amplios sin pensarlo.
revoke all on public.catalogo_servicios, public.catalogo_factores,
              public.catalogo_puntos,    public.catalogo_ajustes
  from catalogo_lector;

-- Supabase necesita que sus roles de API puedan asumir el rol personalizado.
grant catalogo_lector to authenticator;

commit;

-- ═══════════════════════════════════════════════════════════════════════════════════════════════
-- COMPROBACIONES. Ejecutar DESPUÉS de sembrar (npm run seed-catalog).
--
-- 1) Las cuatro tablas cerradas — las cuatro filas con rowsecurity = true:
--      select relname, relrowsecurity from pg_class
--       where relname like 'catalogo_%' and relkind = 'r';
--
-- 2) Cero policies — debe devolver 0 filas:
--      select * from pg_policies where tablename like 'catalogo_%';
--
-- 3) El catálogo entero de un viaje:
--      select jsonb_pretty(public.catalogo_vigente());
--
-- 4) CA-03 — debe FALLAR con «rango_coherente»:
--      update public.catalogo_servicios set official_min = 99000
--       where id = 'ai_opportunity_assessment';
--
-- 5) CA-12 — debe FALLAR diciendo que es un cambio de producto:
--      begin; delete from public.catalogo_servicios where id = 'esg_strategy_compliance'; commit;
--
-- 6) C-2 — debe FALLAR con «multiplicador_posible»:
--      update public.catalogo_factores set valor = 50 where bloque = 'size' and clave = '<50';
--
-- 7) CA-14 — con la llave de lectura, esto debe denegarse:
--      curl -s -X POST "$SUPABASE_URL/rest/v1/catalogo_servicios" \
--           -H "apikey: $SUPABASE_CATALOG_READ_KEY" -H "Authorization: Bearer $SUPABASE_CATALOG_READ_KEY" \
--           -H 'Content-Type: application/json' -d '{"id":"x","label":"x","official_min":1,"official_max":2,"unit":"total","open_ended":false}'
-- ═══════════════════════════════════════════════════════════════════════════════════════════════
