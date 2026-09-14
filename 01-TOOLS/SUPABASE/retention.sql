-- Conservación de doce meses — spec `retencion-doce-meses`.
--
-- El aviso de privacidad publicado dice, literalmente:
--   «Conservamos los datos de tu solicitud durante doce meses desde que la envías, salvo que antes
--    retires tu consentimiento o solicites su supresión. Si tu solicitud da lugar a una relación
--    comercial, los datos pasan a regirse por el contrato correspondiente.»
--
-- Este fichero convierte esa frase en algo que ocurre sin que nadie se acuerde.
--
-- EJECUTAR DESPUÉS de schema.sql, en Supabase → SQL Editor → New query → Run.
--
-- POR QUÉ AQUÍ Y NO EN LA APLICACIÓN: la alternativa era una tarea programada de Vercel llamando a
-- una ruta del sitio. Eso sería un endpoint público capaz de BORRAR datos, con su propio secreto que
-- proteger y rotar. El borrado es una operación interna de la base de datos y se queda dentro: no se
-- abre ninguna puerta nueva a Internet (CA-R6).

begin;

-- 1. La excepción del aviso: una solicitud que dio lugar a relación comercial no se borra.
--    Por defecto false — sin intervención, el comportamiento es borrar.
alter table public.leads add column if not exists retention_hold boolean not null default false;

-- 2. Extensión de tareas programadas.
create extension if not exists pg_cron;

commit;

-- 3. La tarea. Diaria, de madrugada: el plazo se cumple con un día de desfase como mucho —en vez de
--    con hasta treinta si fuera mensual— y borra lotes pequeños en vez de un tajo grande al mes.
--    `unschedule` primero para que volver a ejecutar este fichero no cree una tarea duplicada.
select cron.unschedule('nexus-retencion-leads')
 where exists (select 1 from cron.job where jobname = 'nexus-retencion-leads');

select cron.schedule(
  'nexus-retencion-leads',
  '17 3 * * *',
  $$
    delete from public.leads
     where submitted_at < now() - interval '12 months'
       and retention_hold = false
  $$
);

-- ─────────────────────────────────────────────────────────────────────────────
-- COMPROBACIÓN (CA-R5). Ejecutar aquí mismo, no desde fuera: la tabla de tareas
-- programadas no está expuesta en la API REST, y no debe estarlo.
-- ─────────────────────────────────────────────────────────────────────────────

-- ¿Está programada y activa? Debe devolver una fila con active = true.
--   select jobname, schedule, active from cron.job where jobname = 'nexus-retencion-leads';

-- ¿Ha corrido, y cómo fue?
--   select status, start_time, end_time from cron.job_run_details
--    where jobid = (select jobid from cron.job where jobname = 'nexus-retencion-leads')
--    order by start_time desc limit 5;

-- ─────────────────────────────────────────────────────────────────────────────
-- LAS OTRAS DOS OPERACIONES DEL AVISO DE PRIVACIDAD
-- ─────────────────────────────────────────────────────────────────────────────

-- A) Marcar un lead que se convirtió en cliente, para que NO se borre:
--   update public.leads set retention_hold = true where contact_email = 'persona@empresa.ad';

-- B) Supresión anticipada, cuando alguien retira el consentimiento o pide que se borren sus datos:
--   delete from public.leads where contact_email = 'persona@empresa.ad';
--
--    No se automatiza a propósito: automatizar un borrado identificado por correo electrónico sería
--    darle a cualquiera una vía para borrar los datos de otro.
