-- Agenda y preparación de la llamada — spec y plan `agenda-y-preparacion-de-llamadas`.
--
-- EJECUTAR DESPUÉS de schema.sql, catalogo.sql y retention.sql, en Supabase → SQL Editor → Run.
-- Dos bloques, cada uno en su propia transacción. Se pueden ejecutar por separado y volver a
-- ejecutar sin romper nada:
--
--   BLOQUE A (fase A) — cuatro columnas nuevas en `leads`. Hay que aplicarlo ANTES de publicar la
--     versión de la web que las escribe: si la web escribe una columna que no existe, el guardado
--     falla (el lead no se pierde, el correo interno lo avisa, pero no se guarda).
--   BLOQUE B (fase B) — la investigación: dos tablas, el disparador de borrados externos, la vista
--     mínima y el rol con el que entra n8n. Se puede aplicar en cualquier momento; no activa nada.
--
-- NADA DE ESTE FICHERO LLEVA SECRETOS. La contraseña del rol `n8n_agenda` se pone aparte (ver el
-- final del bloque B) y no se guarda en ningún fichero.


-- ═════════════════════════════════════════════════════════════════════════════════════════════════
-- BLOQUE A — lo que la web guarda con cada lead
-- ═════════════════════════════════════════════════════════════════════════════════════════════════

begin;

alter table public.leads
  -- El desenlace que decidió la web: 'qualified' | 'not_qualified' | 'uncatalogued'.
  add column if not exists outcome_kind     text,
  -- Si se le ofreció reservar (= `showCalendar`). Es la «marca de cualificado» que lee n8n: n8n NUNCA
  -- vuelve a comparar la puntuación con el umbral (constitution 9, S-0041).
  add column if not exists booking_offered  boolean,
  -- La versión del aviso de privacidad vigente cuando envió el formulario (CA-25).
  add column if not exists privacy_version  text,
  -- Si ese aviso ya contaba la investigación. Por defecto NO: sin un aviso que lo cuente no se
  -- investiga a nadie (CA-21, CA-23, principio 23).
  add column if not exists research_allowed boolean not null default false;

-- Relleno de las filas que ya existían, UNA vez. Usa el umbral vigente del catálogo, el mismo con el
-- que la web decide hoy. Filas previas sin servicio → 'uncatalogued', igual que en la web.
update public.leads l
   set outcome_kind    = case when l.service_label is null then 'uncatalogued'
                              when l.score_total >= a.threshold then 'qualified'
                              else 'not_qualified' end,
       booking_offered = l.score_total >= a.threshold
  from public.catalogo_ajustes a
 where l.outcome_kind is null;

-- El aviso vigente para todas las filas anteriores a este cambio es el del 2026-09-02.
update public.leads set privacy_version = '2026-09-02' where privacy_version is null;

-- Si el relleno no pudo ocurrir (p. ej. sin fila en catalogo_ajustes), esto FALLA y la transacción
-- entera se deshace: mejor un error visible que columnas a medias.
alter table public.leads
  alter column outcome_kind    set not null,
  alter column booking_offered set not null,
  alter column privacy_version set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_outcome_kind_valido') then
    alter table public.leads add constraint leads_outcome_kind_valido
      check (outcome_kind in ('qualified', 'not_qualified', 'uncatalogued'));
  end if;
end $$;

-- Para W2: buscar el lead más reciente de un correo (regla de asociación de la spec, CA-18c).
create index if not exists leads_correo_reciente on public.leads (lower(contact_email), submitted_at desc);

commit;


-- ═════════════════════════════════════════════════════════════════════════════════════════════════
-- BLOQUE B — la preparación de la llamada (no activa nada por sí solo)
-- ═════════════════════════════════════════════════════════════════════════════════════════════════

begin;

-- La investigación de una reserva. Se borra EN CASCADA con su lead: cuando la retención borra el
-- lead a los doce meses, esto desaparece con él (CA-22).
create table if not exists public.lead_research (
  id                uuid        primary key default gen_random_uuid(),
  submission_id     text        not null references public.leads (submission_id) on delete cascade,
  -- Id del evento de la reserva en Google Calendar. ÚNICO: un reintento de W2 o un cambio de hora
  -- no pueden crear una segunda investigación (CA-19).
  booking_event_id  text        not null unique,
  booking_starts_at timestamptz not null,
  -- Afirmaciones con su fuente, tal y como salen del filtro de W2 (CA-17a).
  report            jsonb       not null,
  summary           text        not null,
  drive_file_id     text,
  prep_event_id     text,
  created_at        timestamptz not null default now()
);

-- Lo que hay que borrar FUERA de la base cuando una investigación desaparece: el documento de Drive
-- y la entrada interna de la agenda. Lo llena el disparador de abajo; lo vacía W4 cada madrugada.
create table if not exists public.external_deletions (
  id          bigint      generated always as identity primary key,
  kind        text        not null check (kind in ('drive_file', 'calendar_event')),
  external_id text        not null,
  queued_at   timestamptz not null default now(),
  unique (kind, external_id)
);

-- Mismo cierre que `leads`: seguridad de fila activada y los roles públicos fuera.
alter table public.lead_research      enable row level security;
alter table public.external_deletions enable row level security;
revoke all on public.lead_research, public.external_deletions from anon, authenticated, public;

-- El «cuándo» del borrado sigue viviendo en Postgres (la retención de las 03:17); este disparador
-- solo apunta qué queda por borrar fuera. `security definer` porque quien borra puede no tener
-- permiso de escritura sobre la cola (la retención borra en cascada desde `leads`).
create or replace function public.encolar_borrados_externos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.drive_file_id is not null then
    insert into public.external_deletions (kind, external_id) values ('drive_file', old.drive_file_id)
    on conflict do nothing;
  end if;
  if old.prep_event_id is not null then
    insert into public.external_deletions (kind, external_id) values ('calendar_event', old.prep_event_id)
    on conflict do nothing;
  end if;
  return old;
end $$;
revoke all on function public.encolar_borrados_externos() from public, anon, authenticated;

drop trigger if exists lead_research_encola_borrados on public.lead_research;
create trigger lead_research_encola_borrados
  after delete on public.lead_research
  for each row execute function public.encolar_borrados_externos();

-- La ÚNICA ventana de n8n a los leads: lo que W2 necesita para asociar una reserva, y nada más.
-- Ni respuestas, ni puntuación, ni desglose. Solo los últimos 60 días (regla de asociación).
create or replace view public.leads_para_agenda as
  select submission_id, contact_name, lower(contact_email) as contact_email, contact_company,
         service_label, booking_offered, research_allowed, submitted_at
    from public.leads
   where submitted_at > now() - interval '60 days';
revoke all on public.leads_para_agenda from anon, authenticated, public;

-- El rol de n8n. Mínimo privilegio: ve la vista, escribe investigaciones, vacía la cola. No puede
-- leer `leads` directamente, ni el catálogo, ni los intentos del formulario (S-0041, en la línea de
-- S-0037: la garantía vive en los permisos de la base, no en la llave).
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'n8n_agenda') then
    create role n8n_agenda nologin noinherit;
  end if;
end $$;

grant usage on schema public to n8n_agenda;
grant select on public.leads_para_agenda to n8n_agenda;
grant select, insert on public.lead_research to n8n_agenda;
grant update (booking_starts_at) on public.lead_research to n8n_agenda;  -- W3, cambio de hora
grant select, delete on public.external_deletions to n8n_agenda;

-- Con la seguridad de fila activada, el rol necesita policies propias. Son SOLO para él.
drop policy if exists n8n_agenda_lee        on public.lead_research;
drop policy if exists n8n_agenda_anota      on public.lead_research;
drop policy if exists n8n_agenda_mueve      on public.lead_research;
drop policy if exists n8n_agenda_lee_cola   on public.external_deletions;
drop policy if exists n8n_agenda_vacia_cola on public.external_deletions;
create policy n8n_agenda_lee        on public.lead_research      for select to n8n_agenda using (true);
create policy n8n_agenda_anota      on public.lead_research      for insert to n8n_agenda with check (true);
create policy n8n_agenda_mueve      on public.lead_research      for update to n8n_agenda using (true) with check (true);
create policy n8n_agenda_lee_cola   on public.external_deletions for select to n8n_agenda using (true);
create policy n8n_agenda_vacia_cola on public.external_deletions for delete to n8n_agenda using (true);

commit;

-- ─────────────────────────────────────────────────────────────────────────────────────────────────
-- CONTRASEÑA DEL ROL — una sola vez, a mano, cuando se construya W2 (B3/B5). NO la guardes aquí.
--
--   alter role n8n_agenda with login password '<genera una con: openssl rand -base64 32>';
--
-- n8n se conecta con el nodo Postgres al «Connection pooler» de Supabase (modo sesión): usuario
-- `n8n_agenda.<project_ref>`, esa contraseña, base `postgres`, SSL obligatorio.
-- ─────────────────────────────────────────────────────────────────────────────────────────────────

-- COMPROBACIONES (ejecutar aquí mismo):
--   select column_name from information_schema.columns
--    where table_name = 'leads' and column_name in ('outcome_kind','booking_offered','privacy_version','research_allowed');
--   select count(*) from public.leads where research_allowed;              -- 0 hasta publicar el aviso B
--   set role n8n_agenda; select count(*) from public.leads;                -- debe FALLAR: permission denied
--   set role n8n_agenda; select count(*) from public.leads_para_agenda;    -- debe funcionar
--   reset role;
