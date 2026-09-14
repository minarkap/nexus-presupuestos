-- Tabla de leads de nexus-presupuestos.
-- Pegar entero en Supabase → SQL Editor → New query → Run.
--
-- Se ejecuta de una vez a propósito: la tabla y su cierre de acceso van en el mismo bloque, para que
-- no exista jamás un instante en el que la tabla esté creada y abierta (riesgo R-S4 del plan).

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  submission_id    text        not null unique,
  submitted_at     timestamptz not null,
  contact_name     text        not null,
  contact_email    text        not null,
  contact_company  text        not null,
  consent          boolean     not null,
  challenge        text        not null,
  need             text,
  size             text        not null,
  maturity         text        not null,
  timing           text        not null,
  sponsor          text        not null,
  budget           text        not null,
  blockers         text[]      not null default '{}',
  service_label    text,
  range_text       text,
  score_total      integer     not null,
  score_breakdown  jsonb       not null,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CIERRE DE ACCESO. Esto es lo que impide que la base de datos quede expuesta.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Seguridad a nivel de fila activada y SIN NINGUNA POLICY.
--    Sin policy, nadie pasa: ni un visitante anónimo ni un usuario autenticado pueden leer,
--    insertar, modificar ni borrar una sola fila. No es que esté restringido: es que está cerrado.
alter table public.leads enable row level security;

-- 2. Retirada explícita de permisos a los roles que la API pública expone.
--    Redundante con el punto 1 a propósito: si alguien añadiera mañana una policy sin pensarlo,
--    esto sigue negando el acceso. Dos cerraduras distintas, no la misma dos veces.
revoke all on public.leads from anon, authenticated;
revoke all on public.leads from public;

-- 3. La única puerta es la clave `service_role`, que usa el servidor de la aplicación y que se
--    salta la seguridad de fila por diseño. Esa clave no sale nunca del servidor: lo comprueban
--    `src/ports/registry-security.test.ts` y `scripts/secret-gate.mjs` en cada verificación.

-- Comprobación rápida de que quedó cerrado (debe devolver rowsecurity = true):
--   select relname, relrowsecurity from pg_class where relname = 'leads';
-- Y que no hay ninguna policy (debe devolver 0 filas):
--   select * from pg_policies where tablename = 'leads';
