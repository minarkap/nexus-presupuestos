# RESEND

Proveedor de correo transaccional de la landing. Elegido en `S-0012`: con decenas de envíos al mes
(C-08) el plan gratuito cubre el caso entero y su API es la que menos adaptador exige.

La app consume estas mismas variables en `03-APP/`. Aquí viven para operar a mano y para probar la
conexión sin arrancar la aplicación.

## Uso

```bash
cp .env.example .env && chmod 600 .env   # rellena RESEND_API_KEY y RESEND_FROM
bash test_connection.sh
```

## Qué clave vive dónde

Hay **dos claves** del proyecto, a propósito, y no son intercambiables:

| Clave en Resend | Permiso | Dónde vive | Para qué |
|-----------------|---------|------------|----------|
| `presupuestos nexus jose` | acceso total | `01-TOOLS/RESEND/.env` | Operar a mano: `test_connection.sh` (lee `/domains`), crear o revocar claves. **Nunca va a Vercel.** |
| `nexus-presupuestos · web (Vercel)` | sólo envío, limitada a `executivelab.ai` | Vercel (`sensitive`) y `03-APP/.env.local` | Lo único que hace la web: `POST /emails`. Si se filtra, sólo sirve para enviar desde ese dominio. |

Si pruebas la clave de la web con `test_connection.sh` verás un 401 «restricted_api_key»: es lo
esperado, porque esa clave no puede leer dominios. Para comprobar que funciona sin enviar nada, basta
un envío vacío: 422 «Missing `to` field» significa que la clave vale. 401 «API key is invalid»
significa que no existe.

> **Incidente del 2026-09-29 → 30.** La clave que tenía Vercel se borró en Resend, con toda
> probabilidad al crear `presupuestos nexus jose`, que sólo se llevó a esta carpeta. Durante ese
> intervalo la web no pudo enviar ni la estimación ni el aviso interno. Nadie lo vio, porque el
> fallo sólo aparece cuando llega un lead. **Al rotar una clave, cambia todos sus consumidores antes
> de revocar la vieja.** Detalle en `02-DOCS/wiki/ftd/secretos-sensibles-en-vercel.md`.

## Antes de publicar

- El dominio de envío **debe estar verificado en Resend**. Sin verificar, sólo llegan correos a la
  dirección del titular de la cuenta y todos los leads reales se quedan sin propuesta.
- Recuerda el riesgo aceptado en `S-0007`: sin anti-spam, los bots disparan correos a direcciones
  inventadas y eso degrada la reputación del dominio. Vigila el panel de Resend.
