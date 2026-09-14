---
type: plan
title: Plan — El registro de leads pasa a Supabase
description: Plan técnico del cambio de registro — adaptador sobre la API REST de Supabase sin dependencias nuevas, inversión del orden de despacho, aviso de no-guardado en el correo interno, y la tabla con RLS cerrada.
tags: [sdd, plan, supabase, registro, leads]
timestamp: 2026-09-14T10:25:00Z
topic: sdd
slug: leads-en-supabase
status: approved
---

# Plan — El registro de leads pasa a Supabase

> Spec: [../specs/leads-en-supabase.md](../specs/leads-en-supabase.md) · Constitution: [../constitution.md](../constitution.md) v1.1.0 · Status: **approved** (autopilot, 2026-09-14)
> Decisión de alcance: `S-0025` · Decisión técnica de este plan: `S-0026`

## 0. Global Constraints

- **Stack canon:** Next.js 16.3.3 App Router · TypeScript `strict` · npm · Node ≥ 24 · Vitest 4 ·
  ESLint **cero avisos** (constitution 12). Cobertura ≥ 95 % en `src/core/**` (15).
- **Rama:** `feat/leads-en-supabase`. Nunca sobre `main` (18). Commits con gitmoji y **autoría
  humana**: sin `Co-Authored-By` de IA ni pie de "generado con" (20).
- **Sin dependencias nuevas.** El adaptador de hoja de cálculo ya habla HTTP a pelo con `fetch` y
  `node:crypto`, sin SDK. Supabase expone PostgREST sobre HTTP, así que el adaptador nuevo se
  escribe igual. Añadir `@supabase/supabase-js` metería un árbol de dependencias para hacer un
  `POST`. **Decisión: `fetch`, cero paquetes nuevos.**
- **Secretos:** `01-TOOLS/SUPABASE/.env` y `03-APP/.env.local`, ambos fuera del repositorio por el
  `.gitignore` raíz (21). Ningún valor real entra en la wiki ni en el código.

## 1. Arquitectura — dónde encaja

El cambio **no toca el núcleo**. `RegistryPort` ya es la costura correcta: una interfaz con un solo
método, `append(row)`. Supabase entra como una implementación más, al lado de la de hoja de cálculo.

```
FormWizard (cliente)
   └─ submitAction  ('use server')  ← frontera de confianza, no se mueve
        └─ submitLead  (src/core/submit.ts)
             ├─ 1. registryPort.append(lead)      ← AHORA VA PRIMERO
             ├─ 2. emailPort.send(→ visitante)
             └─ 3. emailPort.send(→ interno, con el resultado del paso 1)
```

**La única decisión estructural es la inversión del orden.** Hoy los correos salen antes que el
guardado, y por eso el aviso interno no puede decir si el lead quedó guardado: cuando se redacta,
todavía no se sabe. `CA-S3` exige que lo diga, así que el guardado pasa a ser el primer paso.

Sigue siendo best-effort por vía (`CA-S7`): que el guardado falle no cancela los correos, y ninguna
de las tres vías puede impedir que el visitante vea su rango.

## 2. Contratos

### 2.1 `LeadRecord` gana el identificador de envío

`submitLead` ya recibe `submissionId`; hoy lo usa sólo para la caché de deduplicación y no lo pasa a
`LeadRecord`. Pasa a formar parte del registro, porque es la clave que hace el guardado idempotente
en la base de datos.

### 2.2 `RegistryPort` no cambia de forma

`append(row: LeadRecord): Promise<void>`. Sigue lanzando en caso de fallo; quien decide qué hacer con
ese fallo es `submitLead`, no el adaptador.

### 2.3 `buildInternalNotice` recibe el resultado del guardado

Pasa de `buildInternalNotice(lead)` a `buildInternalNotice(lead, registry)`, donde `registry` es el
mismo `'ok' | 'failed'` que ya viaja en `DispatchReport`. Cuando es `'failed'`, el cuerpo abre con un
bloque de aviso **antes** de los datos del lead —no al final, donde se lee tarde— diciendo con todas
las letras que ese lead no está guardado y que ese correo es la única copia.

Cuando es `'ok'` el correo **no gana ninguna línea**: un aviso que aparece siempre deja de leerse.

## 3. La tabla

```sql
create table public.leads (
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

alter table public.leads enable row level security;
```

Tres decisiones con motivo:

- **`submission_id` es `unique`.** Es lo que hace `CA-S4` real: un reintento del mismo envío no
  puede producir una segunda fila, aunque la caché en memoria se haya perdido en un arranque en
  frío. El adaptador trata el conflicto como **éxito**, no como error — la fila existe, que es lo
  que se pedía. *(Ojo con lo que esto no arregla: tras un arranque en frío los correos sí se
  reenvían, porque la deduplicación de correos sigue en memoria. Está declarado como non-goal.)*
- **RLS activado y sin ninguna policy.** Ningún cliente anónimo ni autenticado puede leer ni
  escribir. La clave `service_role`, que es la que usa el servidor, se salta RLS por diseño. Es
  decir: la única puerta a esa tabla es el servidor de la aplicación. Si mañana se abre un panel,
  se abre con una policy explícita y revisada, no por olvido.
- **`score_breakdown` como `jsonb`.** El desglose es una lista de longitud variable; aplanarlo a
  texto como en la hoja pierde la posibilidad de preguntar por él.

## 4. El adaptador

`SupabaseRegistryPort` en `03-APP/src/ports/registry.ts`, al lado del de hoja de cálculo.

- `POST {SUPABASE_URL}/rest/v1/{tabla}` con cabeceras `apikey`, `Authorization: Bearer …`,
  `Content-Type: application/json` y `Prefer: return=minimal,resolution=ignore-duplicates`.
- Mapeo `LeadRecord` → fila en una función pura y exportada, `toLeadRow`, probable sin red.
- Respuesta `2xx` → éxito. Cualquier otra → lanza con el código y el cuerpo, **sin incluir la
  credencial** en el mensaje.

### 4.1 Selección de adaptador (`selectRegistryPort`)

Orden de preferencia, manteniendo la regla `F-1` intacta (`CA-S6`):

1. `USE_FAKE_ADAPTERS=1` **y no producción** → el falso.
2. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → **Supabase**.
3. Credenciales de Google legibles → hoja de cálculo *(queda dormido, ver abajo)*.
4. Producción sin nada → el que **siempre falla**, nunca el falso.
5. Fuera de producción sin nada → el falso.

**Respuesta a la pregunta abierta de la spec (`S-0026`): el adaptador de hoja de cálculo se deja
dormido, no se borra.** Borrarlo eliminaría código probado y en verde a cambio de nada, y es
exactamente el parche barato que la spec deja escrito por si este ciclo se retrasa. Queda por debajo
de Supabase en la precedencia, así que en cuanto Supabase esté configurado no se usa.

## 5. Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `SUPABASE_URL` | `03-APP/.env.local` + Vercel (production, preview) | URL del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | igual | Clave de servidor. **Nunca `NEXT_PUBLIC_`** |
| `SUPABASE_LEADS_TABLE` | opcional | Nombre de la tabla; por defecto `leads` |

El prefijo `NEXT_PUBLIC_` está **prohibido** para estas dos: haría que la clave viajara al navegador
y volaría `CA-S5` y el principio 8.

## 6. Estrategia de pruebas

TDD estricto (`config.yaml: strict_tdd`), prueba en rojo antes de cada trozo de código.

| Qué | Cómo se prueba sin red |
|---|---|
| `toLeadRow` | función pura: entrada `LeadRecord`, salida objeto. Incluye la rama sin catalogar y la lista de frenos vacía |
| `SupabaseRegistryPort` | `fetch` inyectado/espiado: se comprueban URL, cabeceras, cuerpo; `201` → ok; `409` → ok; `500` → lanza y el mensaje **no** contiene la clave |
| `selectRegistryPort` | matriz de entornos; los cinco casos de §4.1 |
| Orden de despacho | `submitLead` con puertos falsos que registran el instante: el `append` ocurre antes del primer `send` |
| Aviso de no-guardado | registro que lanza → el correo interno contiene el aviso; registro que funciona → **no** lo contiene |
| `CA-S7` | registro que lanza → `submitLead` devuelve el `RedactedOutcome` normal, sin error |

## 7. Riesgos

- **R-S1 — La clave `service_role` se filtra.** Mitigación: prohibido el prefijo `NEXT_PUBLIC_`;
  el adaptador nunca la incluye en un mensaje de error; `.env` fuera del repositorio. Comprobable
  con la prueba de `500`.
- **R-S2 — El aviso de no-guardado se vuelve ruido.** Mitigación: sólo aparece cuando falla, y
  arriba del todo.
- **R-S3 — La inversión del orden retrasa el correo del visitante.** Es un `POST` a una API; si se
  volviera un problema, la salida es despachar el correo en paralelo, no volver al orden viejo.
- **R-S4 — La tabla se crea sin RLS.** Mitigación: el `alter table … enable row level security` va
  en el mismo bloque SQL que el `create table`, no en un paso posterior que se pueda olvidar.

## 8. Secuencia

1. Tabla creada en Supabase (paso humano, con el SQL de §3).
2. `LeadRecord` gana `submissionId` + `toLeadRow` + pruebas.
3. `SupabaseRegistryPort` + pruebas.
4. `selectRegistryPort` con la precedencia de §4.1 + pruebas.
5. Inversión del orden en `submitLead` + `buildInternalNotice(lead, registry)` + pruebas.
6. Tooling `01-TOOLS/SUPABASE/` y variables de entorno.
7. `verify.sh` verde.
8. Variables en Vercel y despliegue.
