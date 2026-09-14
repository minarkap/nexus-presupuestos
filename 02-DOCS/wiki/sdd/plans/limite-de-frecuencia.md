---
type: plan
title: Plan — Límite de frecuencia del formulario
description: Plan técnico del tope — huella HMAC calculada en la frontera, decisión pura en el núcleo, conteo en una segunda tabla cerrada, y el fallo abriendo en vez de cerrando.
tags: [sdd, plan, seguridad, privacidad, supabase]
timestamp: 2026-09-14T13:30:00Z
topic: sdd
slug: limite-de-frecuencia
status: approved
---

# Plan — Límite de frecuencia del formulario

> Spec: [../specs/limite-de-frecuencia.md](../specs/limite-de-frecuencia.md) · Status: **approved** (autopilot, 2026-09-14)

## 0. Global Constraints

- Stack canon sin cambios. **Sin dependencias nuevas**: `node:crypto` para la huella, `fetch` para la
  tabla, igual que el registro.
- TDD estricto. Cobertura ≥95 % en `src/core/**`.
- Rama `feat/limite-de-frecuencia`, nunca sobre `main`. Commits con gitmoji y autoría humana.
- **`src/core` no puede importar nada de Next.** La huella se calcula en la frontera y entra al
  núcleo como un dato más; si no, el núcleo deja de ser probable sin servidor.

## 1. Dónde vive cada pieza

```
actions.ts  ('use server')  ← ÚNICO sitio con acceso a headers()
   │  1. lee x-forwarded-for  →  calcula la huella HMAC
   │  2. la pasa como dependencia, igual que el buzón interno
   ▼
submitLead  (src/core/submit.ts)
   │  validar → ¿envío ya despachado? → ¿POR ENCIMA DEL TOPE? → guardar → correos
   ▼
RateLimitPort  (src/ports/rate-limit.ts)   ← segunda tabla
```

La decisión —«¿esto pasa del tope?»— es **una función pura** en `src/core/rate-limit.ts`: recibe las
marcas de tiempo de los intentos previos y el instante actual, y devuelve sí o no. Así se prueban las
fronteras (justo en el tope, uno por encima, la ventana que caduca) sin red y sin reloj real.

El puerto sólo hace dos cosas de entrada/salida: **leer** los intentos recientes de una huella y
**anotar** uno nuevo.

## 2. La huella

`HMAC-SHA256(RATE_LIMIT_SALT, ip)`, en hexadecimal, **truncado a 32 caracteres**.

Tres decisiones, cada una con su motivo:

- **HMAC y no un hash a secas.** Sin secreto, una huella de una dirección es reversible en minutos:
  el espacio IPv4 entero son 4.300 millones de valores y un portátil los recorre. Con un secreto que
  el atacante no tiene, deja de poder hacerlo. Es la diferencia entre seudonimizar y proteger.
- **Truncado.** No hace falta más para distinguir orígenes, y cuanto menos se guarde, mejor.
- **`RATE_LIMIT_SALT` es una variable propia**, no reutilizada de otro servicio. Reutilizar la clave
  de Supabase para esto ataría dos cosas que deben poder rotarse por separado.

**La dirección en claro no se guarda, no se registra en ningún log y no sale de la función que la
convierte en huella** (`CA-L5`).

### Orden de cabeceras

`x-forwarded-for` (primera entrada de la lista, que es el cliente) y, si no está, `x-real-ip`. Si no
hay ninguna de las dos, **no hay huella y no se aplica el tope**: es el caso de `CA-L6` — se abre, no
se cierra.

## 3. La segunda tabla

```sql
create table public.submission_attempts (
  id           bigint generated always as identity primary key,
  fingerprint  text        not null,
  attempted_at timestamptz not null default now()
);

create index on public.submission_attempts (fingerprint, attempted_at desc);

alter table public.submission_attempts enable row level security;
revoke all on public.submission_attempts from anon, authenticated;
revoke all on public.submission_attempts from public;
```

- **Ni una columna identificativa.** Sin nombre, sin correo, sin identificador de envío: esta tabla
  **no se puede cruzar con `leads`**. Es deliberado — si se pudiera, la huella dejaría de ser una
  medida técnica y pasaría a ser un rastro de comportamiento asociado a una persona.
- **Mismo cierre que `leads`**: seguridad de fila sin policies más `revoke` explícito. Y la misma
  comprobación con la clave pública en la prueba de humo.
- **Se vacía sola a las 48 horas** con una tarea de `pg_cron`, igual que la retención. 48 y no 24
  para que la ventana diaria tenga margen por delante.

## 4. El conteo, en una sola petición

Se piden las marcas de tiempo de esa huella **en las últimas 24 horas** y se cuentan las dos ventanas
en memoria. Son como mucho quince filas: no se paga nada por traerlas y se ahorra un viaje.

```
GET /rest/v1/submission_attempts
    ?fingerprint=eq.<huella>&attempted_at=gte.<hace 24h>&select=attempted_at
```

## 5. El resultado nuevo

`SubmitResult` gana una tercera variante. **Esto es lo más delicado del plan** y conviene entender
por qué: el cliente hoy distingue con `'field' in result`, no por el `kind`. Una variante nueva sin
`field` se colaría por el `else` y acabaría en `onDone()`, que espera un resultado de cálculo.

No hay que confiar en acordarse: **el comprobador de tipos lo caza solo**. Al añadir la variante,
`onDone(result)` deja de compilar hasta que se trate el caso. Es el mismo criterio de `S-0024` — lo
sostiene el sistema de tipos, no la disciplina.

El mensaje que ve quien cruza el tope va **fuera de los campos**, como bloque propio, porque no es el
error de un campo: no ha escrito nada mal.

## 6. Orden dentro de `submitLead`

```
1. validar respuestas y contacto        (barato, y nada que guardar si está mal)
2. ¿este envío ya se despachó?          (doble clic NO consume tope)
3. ¿por encima del tope?     ← NUEVO    → si sí: fuera, sin fila y sin correos
4. anotar el intento         ← NUEVO
5. guardar el lead
6. los dos correos
```

El paso 2 va antes del 3 a propósito: un doble clic es el mismo envío, y gastarle cupo a alguien por
tener el ratón nervioso sería castigarle por nuestra cuenta.

## 7. Estrategia de pruebas

| Qué | Cómo |
|---|---|
| La decisión del tope | función pura: reloj inyectado, casos justo en el tope, uno por encima, ventana caducada, las dos ventanas a la vez |
| La huella | misma entrada → misma salida; entradas distintas → salidas distintas; **la salida no contiene la dirección**; sin secreto → no hay huella |
| El puerto | `fetch` espiado: URL, filtro de fecha, cabeceras; el error del servidor **no lanza**, devuelve «no sé» y se abre |
| El orden | puertos testigo: el bloqueo ocurre **antes** de guardar y antes de cualquier correo |
| `CA-L6` | puerto que lanza → el envío se procesa igual |
| `CA-L3` | el resultado bloqueado lleva mensaje **y** vía alternativa |
| El cliente | el resultado bloqueado se pinta como bloque, no como error de campo |

## 8. El aviso de privacidad

Hay que tocarlo, y **hay una frase que pasa a ser falsa**: «no recoge datos de navegación». Se
reescribe con precisión en vez de borrarla, y se añade la finalidad, la base legal y el plazo.

**Queda como borrador pendiente de revisión legal humana** (spec §Puerta humana). Ningún despliegue
de esto puede salir sin esa revisión: no es una formalidad, es texto que compromete a la empresa.

## 9. Riesgos

- **R-L1 — Una oficina grande comparte salida y se bloquea entre compañeros.** Mitigación: el tope es
  holgado y el mensaje da vía alternativa. No tiene solución técnica limpia.
- **R-L2 — `RATE_LIMIT_SALT` sin definir en producción y nadie se entera.** Es exactamente el fallo
  que ya nos mordió con el registro. Mitigación: sin secreto **no hay tope**, y eso se registra a
  gritos en el log de servidor; además la prueba de humo de la tool lo comprueba.
- **R-L3 — Un abuso distribuido desde muchas direcciones.** No lo cubre este plan; declarado en la
  spec como área no formulable. La respuesta está en el borde, no aquí.
- **R-L4 — La tabla de intentos se convierte en el cuello de botella.** Cada envío añade dos viajes.
  Aceptable: el volumen es una landing.

## 10. Secuencia

1. `src/core/rate-limit.ts` — constante única del tope + decisión pura + pruebas.
2. Huella HMAC + pruebas.
3. `src/ports/rate-limit.ts` — puerto, adaptadores, selección + pruebas.
4. Conectar en `submitLead` en el orden de §6 + pruebas.
5. Variante nueva de resultado y su pintado en el cliente + pruebas.
6. SQL de la tabla y su limpieza; tooling y variable de entorno.
7. Borrador del aviso de privacidad **marcado como pendiente de revisión legal**.
8. `verify.sh` verde. **No se publica** hasta la revisión humana.
