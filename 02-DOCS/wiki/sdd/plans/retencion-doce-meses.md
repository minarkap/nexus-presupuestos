---
type: plan
title: Plan — La conservación de doce meses se ejecuta sola
description: Plan técnico de la supresión — tarea programada dentro de la propia base de datos, sin ninguna ruta nueva expuesta a Internet, y una marca para los leads que se convirtieron en cliente.
tags: [sdd, plan, privacidad, retencion, supabase]
timestamp: 2026-09-14T11:10:00Z
topic: sdd
slug: retencion-doce-meses
status: approved
---

# Plan — La conservación de doce meses se ejecuta sola

> Spec: [../specs/retencion-doce-meses.md](../specs/retencion-doce-meses.md) · Status: **approved** (autopilot, 2026-09-14)

## 0. La decisión que manda sobre las demás

**El borrado se programa DENTRO de la base de datos, no en la aplicación.**

La alternativa obvia era una tarea programada de Vercel que llamara a una ruta del sitio. Se descarta
por el requisito que Jose ha repetido dos veces en este ciclo: **no exponer nada nuevo**. Esa ruta
sería un endpoint HTTP público capaz de borrar datos, y habría que protegerlo con un secreto propio,
rotarlo, y confiar en que nadie lo filtre. La superficie de ataque que añade no se paga: el borrado
es una operación interna de la base de datos y puede quedarse dentro (`CA-R6`).

Consecuencia asumida: **este ciclo no toca ni una línea de la aplicación.** No hay adaptador, no hay
ruta, no hay puerto, no hay pruebas de Vitest — porque no hay código de aplicación que probar. El
artefacto es SQL, y sus criterios de aceptación se comprueban con SQL. Decirlo claro es parte del
plan: un ciclo cuya evidencia no es la batería de pruebas tiene que declarar dónde está su evidencia.

## 1. La marca de relación comercial

El aviso de privacidad tiene una excepción propia: *«Si tu solicitud da lugar a una relación
comercial, los datos pasan a regirse por el contrato correspondiente.»* Un borrado a secas la
incumpliría al revés — destruiría datos que debían conservarse.

```sql
alter table public.leads add column if not exists retention_hold boolean not null default false;
```

Por defecto `false`: el comportamiento sin intervención es **borrar**, que es lo que promete el
aviso. Conservar exige un acto explícito de una persona, porque este sistema no sabe —ni puede
saber— si un lead se convirtió en cliente: esa información vive fuera.

## 2. La tarea programada

`pg_cron`, la extensión de tareas programadas de Postgres que Supabase ofrece. Una ejecución diaria,
de madrugada:

```sql
delete from public.leads
 where submitted_at < now() - interval '12 months'
   and retention_hold = false;
```

Diaria y no mensual a propósito: el plazo se cumple con un día de desfase como mucho, en vez de con
hasta treinta. Y borra por lotes pequeños todos los días en vez de un tajo grande una vez al mes.

## 3. Supresión anticipada

El aviso también promete atender la retirada del consentimiento y la petición de supresión. Es una
operación manual —llega por correo, la ejecuta una persona— y se resuelve con una sentencia
documentada en el README de la tool, identificando por correo electrónico.

No se automatiza: automatizar un borrado por correo electrónico significaría exponer una vía para
que alguien borre datos de otro, y volvemos al problema de §0.

## 4. Comprobación (`CA-R5`)

Dos consultas documentadas que dicen si el mecanismo existe y está activo:

```sql
select jobname, schedule, active from cron.job where jobname = 'nexus-retencion-leads';
select status, start_time from cron.job_run_details
 where jobid = (select jobid from cron.job where jobname = 'nexus-retencion-leads')
 order by start_time desc limit 5;
```

**Se comprueban en el editor SQL, no desde el script de humo.** El script habla con la API REST, y la
tabla de tareas programadas no está —ni debe estar— expuesta ahí. Exponerla para poder comprobarla
sería deshacer el motivo de §0.

## 5. Riesgos

- **R-R1 — Nadie marca `retention_hold` y se borran leads de clientes reales al año.** Es el riesgo
  serio y es humano, no técnico. Mitigación: la marca existe, está documentada y el plazo es de un
  año, que da margen de sobra. No hay mitigación técnica posible: el sistema no sabe quién es
  cliente.
- **R-R2 — `pg_cron` no disponible o desactivado.** Mitigación: la comprobación de §4 lo detecta, y
  la spec ya deja escrito el plan B (borrado manual anual).
- **R-R3 — El borrado se ejecuta y nadie se entera de que se ejecutó.** Aceptado: el registro de
  auditoría es decisión diferida de la spec. `cron.job_run_details` da el histórico de ejecuciones,
  que no es lo mismo pero sirve para saber que corrió.

## 6. Secuencia

1. `retention.sql` escrito y documentado.
2. Columna `retention_hold` incorporada también a `schema.sql`, para instalaciones nuevas.
3. README de la tool con las tres operaciones: marcar, suprimir a petición, comprobar.
4. Paso humano: ejecutar `retention.sql` en Supabase después de `schema.sql`.
