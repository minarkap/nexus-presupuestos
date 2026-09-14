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

-- ─────────────────────────────────────────────────────────────────────────────
-- ANOTAR Y CONTAR EN UNA SOLA OPERACIÓN
--
-- Esto NO es una comodidad: es lo que hace que el tope funcione de verdad.
--
-- La primera versión leía el contador y luego anotaba, en dos viajes. La revisión adversarial del
-- 2026-09-14 demostró que eso se atraviesa entero: treinta peticiones a la vez —un `Promise.all` de
-- cinco líneas— leen todas el mismo contador antes de que ninguna haya anotado, todas se creen por
-- debajo del tope y todas pasan. En un entorno sin memoria compartida como Vercel, cada una corre en
-- una instancia distinta, así que no hay nada que las coordine salvo la propia base de datos.
--
-- Dentro de esta función, insertar y contar ocurren en la misma transacción: la segunda petición ve
-- lo que anotó la primera, sí o sí.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.registrar_intento(huella text)
returns table (en_hora bigint, en_dia bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.submission_attempts (fingerprint) values (huella);

  return query
  select
    count(*) filter (where a.attempted_at > now() - interval '1 hour'),
    count(*) filter (where a.attempted_at > now() - interval '24 hours')
  from public.submission_attempts a
  where a.fingerprint = huella
    and a.attempted_at > now() - interval '24 hours';
end;
$$;

-- La función se ejecuta con los permisos de quien la define, así que hay que cerrarla con la misma
-- disciplina que la tabla: sólo el servidor de la aplicación puede llamarla.
revoke all on function public.registrar_intento(text) from public;
revoke all on function public.registrar_intento(text) from anon, authenticated;

-- Limpieza. CADA HORA, no una vez al día: con una pasada diaria, una fila insertada justo después de
-- la limpieza sobrevivía hasta 72 horas —comprobado— y el aviso de privacidad prometía menos de 48.
-- Un plazo prometido que el mecanismo no cumple es una declaración falsa, no un detalle.
select cron.unschedule('nexus-limpieza-intentos')
 where exists (select 1 from cron.job where jobname = 'nexus-limpieza-intentos');

select cron.schedule(
  'nexus-limpieza-intentos',
  '17 * * * *',
  $$ delete from public.submission_attempts where attempted_at < now() - interval '48 hours' $$
);

-- COMPROBACIÓN
--   select jobname, schedule, active from cron.job where jobname = 'nexus-limpieza-intentos';
--   select count(*) from public.submission_attempts;
