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

Las mismas que `03-APP/.env.local`. Se cargan en el panel (Settings → Environment Variables), no
viajan en el repositorio.

| Variable | Obligatoria | Qué pasa si falta |
|----------|-------------|-------------------|
| `RESEND_API_KEY` | sí | El envío falla ruidosamente a propósito: ningún lead recibe su estimación. |
| `RESEND_FROM` | sí | Igual que la anterior — las dos van juntas. |
| `NEXUS_INTERNAL_MAILBOX` | sí | El aviso interno cae en el buzón por defecto del código, que no consta activo. |
| `NEXT_PUBLIC_CALENDAR_URL` | sí | La pantalla de agendar llamada se queda sin destino. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | no | Sin registro de respaldo en la hoja de cálculo; el correo sigue saliendo. |
| `GOOGLE_SHEET_ID` | no | Idem — las dos de Google van juntas. |

> **Regla de producto.** Sólo `NEXT_PUBLIC_CALENDAR_URL` puede llevar el prefijo `NEXT_PUBLIC_`: es
> la única que puede llegar al navegador. Los multiplicadores, la tabla de puntuación y el umbral de
> cualificación son internos y se calculan en servidor — ninguna variable que los toque lleva ese
> prefijo jamás.

## Antes de publicar

- **Dominio.** Sin dominio propio, la landing queda en una URL `*.vercel.app`. Está sin decidir
  (pregunta abierta del perfil de usuario).
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
