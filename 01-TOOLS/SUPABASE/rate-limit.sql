-- Límite de frecuencia del formulario — spec `limite-de-frecuencia`.
--
-- EJECUTAR DESPUÉS de schema.sql, en Supabase → SQL Editor → New query → Run.
--
-- Esta tabla NO tiene ni una columna identificativa: sin nombre, sin correo, sin identificador de
-- envío. Es deliberado — no se puede cruzar con `leads`. Si se pudiera, la huella dejaría de ser una
-- medida técnica y pasaría a ser un rastro de comportamiento asociado a una persona.

begin;

create table if not exists public.submission_attempts (
  id           bigint generated always as identity primary key,
  -- HMAC-SHA256(secreto, dirección) truncado. Ni la dirección ni nada que lleve a ella.
  fingerprint  text        not null,
  attempted_at timestamptz not null default now()
);

create index if not exists submission_attempts_lookup
  on public.submission_attempts (fingerprint, attempted_at desc);

-- Mismo cierre que `leads`: nadie entra salvo el servidor con su clave.
alter table public.submission_attempts enable row level security;
revoke all on public.submission_attempts from anon, authenticated;
revoke all on public.submission_attempts from public;

commit;

-- Limpieza a las 48 horas. 48 y no 24 para que la ventana diaria del tope tenga margen por delante.
select cron.unschedule('nexus-limpieza-intentos')
 where exists (select 1 from cron.job where jobname = 'nexus-limpieza-intentos');

select cron.schedule(
  'nexus-limpieza-intentos',
  '33 4 * * *',
  $$ delete from public.submission_attempts where attempted_at < now() - interval '48 hours' $$
);

-- COMPROBACIÓN
--   select jobname, schedule, active from cron.job where jobname = 'nexus-limpieza-intentos';
--   select count(*) from public.submission_attempts;
