# VERCEL

Plataforma donde se publica la landing (`03-APP/`). Esta carpeta guarda el token de la cuenta y la
prueba de humo que confirma que la conexión sigue viva; **no despliega nada**. El despliegue lo
dispara Vercel solo, cada vez que llega un commit a `main` en
`Executive-Lab/nexus-presupuestos`.

## Uso

```bash
cp .env.example .env && chmod 600 .env   # pega el VERCEL_TOKEN del panel
bash test_connection.sh
```

## Scripts

| Script | Qué hace |
|--------|----------|
| `test_connection.sh` | Valida el token y, si `VERCEL_PROJECT` está relleno, comprueba que el proyecto existe y que su carpeta raíz es `03-APP`. Sólo lee. |

> **Dos tipos de token, una sola prueba.** El token personal pertenece a un usuario; el de equipo
> (empieza por `vcp_`) pertenece al equipo y **no tiene usuario**: pedirle `/v2/user` devuelve
> 404 «User not found» aunque funcione perfectamente. Por eso la prueba valida el token leyendo los
> proyectos de su ámbito, no preguntando quién es. Hasta el 2026-09-30 lo hacía al revés y daba por
> roto un token de equipo sano.
>
> Lo que responde Vercel, y lo que dice la prueba:
>
> | Respuesta | Significa |
> |-----------|-----------|
> | 403 con `invalidToken` | Token inválido, caducado o revocado. Hay que regenerarlo. |
> | 403 sin `invalidToken` | El token vale, pero `VERCEL_TEAM_ID` es de otro equipo. |
> | 404 en el proyecto | No existe con ese nombre en el ámbito, o falta `VERCEL_TEAM_ID` con un token personal. |

## Cómo queda conectado el proyecto

El repositorio contiene el workspace entero, y la app es sólo una carpeta dentro. De ahí las dos
opciones no negociables al crear el proyecto en Vercel:

| Ajuste | Valor | Por qué |
|--------|-------|---------|
| Repository | `Executive-Lab/nexus-presupuestos` | El repo privado de `D-0014`. |
| **Root Directory** | **`03-APP`** | Sin esto Vercel busca un `package.json` en la raíz, no lo encuentra y la compilación falla. |
| Framework Preset | Next.js | Autodetectado a partir de `03-APP/package.json`. |
| Node.js Version | 24.x | `package.json` declara `engines.node >= 24`. |
| Production Branch | `main` | Única rama del repositorio. |

## Variables de entorno del proyecto en Vercel

Casi las mismas que `03-APP/.env.local` — con dos salvedades: `USE_FAKE_ADAPTERS` se queda en local,
y `NEXT_PUBLIC_SITE_URL` sólo existe aquí (en local va comentada a propósito, porque vacía no es lo
mismo que ausente y rompe la compilación). Se cargan en el panel (Settings → Environment Variables),
no viajan en el repositorio.

| Variable | Obligatoria | Qué pasa si falta |
|----------|-------------|-------------------|
| `SUPABASE_URL` | sí | **La compilación se detiene.** El `prebuild` no puede tomar la foto del catálogo (CA-08). |
| `SUPABASE_CATALOG_READ_KEY` | sí | Igual que la anterior — las dos las lee `scripts/snapshot-catalog.ts`. |
| `SUPABASE_SERVICE_ROLE_KEY` | sí | El lead no se guarda: `RegistryPort` queda sin configurar y protesta. |
| `SUPABASE_LEADS_TABLE` | sí | Se escribe contra la tabla por defecto del código en vez de `leads`. |
| `RATE_LIMIT_SALT` | sí | El límite de frecuencia queda **desactivado** y el servidor lo avisa en el log. |
| `RESEND_API_KEY` | sí | El envío falla ruidosamente a propósito: ningún lead recibe su estimación. |
| `RESEND_FROM` | sí | Igual que la anterior — las dos van juntas. |
| `NEXUS_INTERNAL_MAILBOX` | recomendada | Cae en el defecto del código, `jose.sanchis@executivelab.ai`, que **sí** recibe correo. Ningún lead se pierde; sólo deja de poder redirigirse sin tocar código. |
| `NEXT_PUBLIC_SITE_URL` | sí | El sitio se anuncia como `https://nexus.ad`: `canonical` y `og:url` mienten. |
| `NEXT_PUBLIC_CALENDAR_URL` | no | Nada roto: la pantalla se repliega a «te escribimos con la disponibilidad». |

Las nueve primeras están cargadas. Los **cuatro secretos** —`RESEND_API_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_CATALOG_READ_KEY` y `RATE_LIMIT_SALT`— son de tipo
**`sensitive`** y sólo existen en `production` y `preview`. Las otras cinco son `plain` y están
también en `development`.

> **Por qué `sensitive` (2026-09-30).** El tipo `encrypted` está cifrado en reposo, pero cualquiera
> con acceso al equipo puede leer el valor en el panel. `sensitive` no: una vez guardado, nadie lo
> vuelve a ver, ni siquiera por la API. Dos consecuencias:
> - **No se puede comprobar leyendo.** Para saber si un secreto es correcto se prueba en su origen
>   (Resend, Supabase), no en Vercel.
> - **Vercel no admite `sensitive` en `development`.** No hace falta, porque el desarrollo local lee
>   `03-APP/.env.local`, no Vercel.
>
> Cambiar una variable de tipo sin borrarla se hace con `PATCH /v9/projects/<proyecto>/env/<id>`
> pasando `type`, `value` y `target`. Así no queda ni un instante sin ella.
>
> Cualquier cambio de variables **sólo surte efecto en la siguiente publicación**: los despliegues
> ya hechos conservan los valores con los que se construyeron.

`NEXT_PUBLIC_CALENDAR_URL` **nunca se ha llegado a poner**, y no pasa nada: el resultado trae
`showCalendar: true`, pero `ResultScreen` se repliega solo y muestra «Te escribimos con la
disponibilidad del equipo» en vez del calendario. No hay botón muerto. Ponerla es opcional.

> **Resuelto el 2026-09-15.** El valor por defecto de `NEXUS_INTERNAL_MAILBOX` en
> `src/app/actions.ts` apuntaba a `oportunidades@nexus.ad`, un dominio que no recibe correo: un
> despliegue que olvidara la variable perdía todos los leads **en silencio**, que es el único fallo de
> este sistema que nadie ve. El defecto pasa a ser `jose.sanchis@executivelab.ai`. La variable sigue
> puesta en el panel y sigue siendo lo recomendable —permite cambiar de buzón sin tocar código— pero
> olvidarla ya no cuesta leads.

**No van al panel:**

- `USE_FAKE_ADAPTERS` — sólo desarrollo. En producción se ignora, así que allí no pinta nada.
- `GOOGLE_SERVICE_ACCOUNT_JSON` y `GOOGLE_SHEET_ID` — el registro de respaldo en Google quedó
  desplazado por Supabase (`S-0025`). `src/ports/registry.ts` comprueba Supabase antes, así que
  aunque estuvieran nunca se usarían.
- `NEXUS_REQUIRE_LIVE_CATALOG` — innecesaria: Vercel ya define `VERCEL=1`, que activa lo mismo.

> **De dónde sale esta lista.** Del código, que es la única fuente que no envejece:
> ```bash
> cd 03-APP && grep -rnoE 'process\.env\.[A-Z0-9_]+' src/ scripts/ | sed -E 's/.*process\.env\.//' | sort -u
> ```
> Incluye `scripts/`: el `prebuild` lee variables y **detiene la publicación** si le faltan.

> **Regla de producto.** Sólo `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_CALENDAR_URL` pueden llevar el
> prefijo `NEXT_PUBLIC_`: son las únicas que pueden llegar al navegador. Los multiplicadores, la
> tabla de puntuación y el umbral de cualificación son internos y se calculan en servidor — ninguna
> variable que los toque lleva ese prefijo jamás.

## Antes de publicar

- **Dominio.** La landing se publica en **`presupuestos.barcovalencia.com`** (fijado el 2026-09-15).
  El proyecto tiene además `barcovalencia.com` → `www.barcovalencia.com` y el alias
  `nexus-presupuestos-sigma.vercel.app`. `NEXT_PUBLIC_SITE_URL` debe coincidir con el dominio real:
  se **incrusta en tiempo de compilación**, así que cambiarla en el panel no surte efecto hasta que
  hay una reconstrucción.
- **Protección de despliegue.** Vercel protege por defecto las URLs de previsualización. Si la
  landing debe verse sin iniciar sesión, revisa Settings → Deployment Protection.
- **Correo real.** El dominio de envío `executivelab.ai` ya está verificado en Resend (`D-0013`),
  así que el primer despliegue con las variables puestas ya manda correo de verdad.
- **Spam.** Riesgo aceptado en `S-0007`: el formulario es público y no hay anti-spam. En producción,
  con tráfico real, vigila el panel de Resend.

## Rotación del token

El token da control sobre el proyecto entero. Si se filtra: revócalo en
https://vercel.com/account/settings/tokens, genera otro y actualiza el `.env` de esta carpeta.
Detalle en `CREDENTIALS.md`.
