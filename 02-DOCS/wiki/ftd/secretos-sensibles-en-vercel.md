# Secretos sensibles en Vercel y clave de Resend nueva

## Intent

Vercel avisó de que `RESEND_API_KEY` «parece un secreto pero su valor es visible para cualquiera con
acceso». Al revisarlo apareció algo peor: **esa clave ya no existe en Resend** (`401 API key is
invalid`). Se borró, con toda probabilidad el 2026-09-29 al crear `presupuestos nexus jose`, que
sólo se llevó a `01-TOOLS/RESEND/.env`. Desde entonces la web no puede enviar ni la estimación al
cliente ni el aviso interno.

Se arregla dándole a producción una clave propia, **sólo de envío y limitada a `executivelab.ai`**,
guardada como `sensitive` (nadie puede leerla después de guardarla). De paso pasan a `sensitive` los
otros tres secretos del proyecto, que estaban igual de visibles.

## Scope

Dentro:
- Clave nueva de Resend para la web, en Vercel y en `03-APP/.env.local`.
- `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_CATALOG_READ_KEY` y `RATE_LIMIT_SALT`
  como `sensitive`, sólo en `production` y `preview` (Vercel no admite `sensitive` en
  `development`, y el desarrollo local usa `03-APP/.env.local`).
- Publicación de producción con las variables nuevas.
- README de `01-TOOLS/VERCEL` y `01-TOOLS/RESEND`, y log.

Fuera:
- Rotar las claves de Supabase y la sal: han estado visibles en el panel, pero sólo para quien tiene
  acceso al equipo de Vercel. Rotar la `service_role` obliga a tocar la base; se decide aparte.
- La clave de herramientas (`presupuestos nexus jose`, acceso total): nunca ha estado en Vercel.
- La rama de la agenda y su pila de PR (#2 → #3 → #4).

## Checklist

- [x] Clave nueva sólo-envío creada — *prueba:* un envío vacío con ella responde 422 (datos), no 401 (clave).
- [x] `03-APP/.env.local` lleva la clave nueva — *prueba:* la huella coincide con la creada.
- [x] `RESEND_API_KEY` en Vercel es `sensitive` con la clave nueva — *prueba:* el listado de Vercel dice `sensitive`.
- [x] Los otros tres secretos son `sensitive` con el mismo valor — *prueba:* huella del valor leído = huella del enviado; listado dice `sensitive`.
- [x] Producción publicada con las variables nuevas — *prueba:* despliegue READY del commit y dominio 200.
- [x] Documentación al día — *prueba:* el diff de los README, el índice y el log.
- [ ] Envío real de extremo a extremo — *prueba:* un envío del formulario llega. **Pendiente de Jose**: crea un lead en la base y manda correo.

## Evidence

- **Diagnóstico.** La clave que tenía Vercel era la misma que la de `03-APP/.env.local` (huella
  `1902552f3d`). Un envío vacío con ella dio `401 «API key is invalid»`: no existía. La de
  `01-TOOLS/RESEND/.env` (huella `f1436bcf4a`) es otra, `presupuestos nexus jose`, con acceso total.
  Se identificó por su `last_used_at`, que se movía con cada llamada hecha con ella.
- **Impacto.** `GET /rest/v1/leads?created_at=gte.2026-09-28` → `[]`. Como `core/submit.ts:353`
  guarda el lead antes de intentar los correos, un lead con el correo fallido seguiría en la base.
  Conclusión: nadie envió el formulario en ese intervalo y no se perdió ningún lead.
- **Clave nueva** (huella `80b627db5e`). `POST /emails {}` → `422 «Missing \`to\` field»`: autentica.
  `GET /domains` → `401 «restricted_api_key»`: confirma que sólo puede enviar. La huella en
  `03-APP/.env.local` es `80b627db5e`.
- **Vercel.** `PATCH /v9/projects/…/env/<id>` con `type: sensitive`, `target: [production, preview]`
  → HTTP 200 en los cuatro. Huellas del valor leído y del enviado: `3588ec2a40` (service role),
  `1fb9bd0278` (catálogo) y `1ccba07aa6` (sal), iguales. El listado final da los cuatro `sensitive`,
  sólo en `production,preview`, y las otras cinco `plain` sin tocar.
- **Publicación.** El commit `10a79c0` publicó en producción: despliegue READY a las 11:46 UTC.
  `presupuestos.barcovalencia.com` y `/presupuesto` responden 200. La compilación pasa por el
  `prebuild`, que lee `SUPABASE_CATALOG_READ_KEY`, así que el tipo `sensitive` también funciona al
  compilar.
- **Por error** se mostró en el registro de la sesión el valor de la clave vieja. No tiene efecto:
  ya estaba revocada en Resend.

## Next

Sólo queda la prueba de extremo a extremo: un envío real del formulario, que Jose decide si se
hace. Crea un lead en la base y manda la estimación y el aviso interno.
