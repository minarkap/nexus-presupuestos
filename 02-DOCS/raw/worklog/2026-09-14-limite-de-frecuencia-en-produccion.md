---
fecha: 2026-09-14
tipo: worklog
rama: feat/limite-de-frecuencia → main
---

# El tope de envíos llega a producción

## Qué hicimos

Se publicó el límite de frecuencia por origen, que llevaba cuatro commits parados en su rama
esperando una puerta humana. Al abrirla apareció que la puerta no tenía a nadie detrás.

1. **Se abrió la puerta del aviso de privacidad.** El ledger exigía «revisión legal» de los tres
   párrafos nuevos sobre la huella técnica. Jose preguntó *«¿qué revisión legal?»*: no existe tal
   asesoría en este proyecto. Los aprueba él y la cabecera del fichero lo deja escrito, incluido
   que no han pasado por un jurista (`S-0031`).
2. **`RATE_LIMIT_SALT` en Vercel**, production y preview, cifrada. Es **distinta** de la local a
   propósito: una huella de desarrollo no debe coincidir con una de producción.
3. **Dos puertas que no podían fallar, arregladas** (`S-0032`): la puerta de secretos no vigilaba la
   sal, y `npm run lint` se llamaba «cero avisos» tolerando avisos. Las dos, probadas en rojo y en
   verde antes de darlas por buenas.
4. Fusión a `main`, despliegue `600f0df` en estado `READY`.

## Por qué

El tope protege contra coste, no contra fuga: una inundación del formulario gasta envíos de Resend
y llena la bandeja comercial. Pero la rama parada tenía un coste peor — el formulario llevaba
semanas en producción **sin ningún tope**, porque la maquinaria de base de datos se había adelantado
al código (probar la concurrencia exigía SQL contra la base real).

Una puerta que nadie puede cruzar no protege, paraliza. Lo que sí se conserva es que el fichero diga
la verdad sobre el respaldo que tiene su texto.

## Ficheros tocados

- `03-APP/src/content/privacidad.ts` — cabecera: de «BORRADOR PENDIENTE» a «APROBADO POR JOSE, sin
  asesoría jurídica externa».
- `03-APP/scripts/secret-gate.mjs` — `RATE_LIMIT_SALT` en valores y cadenas prohibidas.
- `03-APP/package.json` — `lint` con `--max-warnings=0`.
- `03-APP/src/core/validation.test.ts` — fuera el `eslint-disable` muerto.
- `02-DOCS/wiki/sdd/progress/limite-de-frecuencia.md` — `awaiting-human-review` → `complete`.

## Resultado

- `verify.sh` **VERDE**: 315 pruebas, 26 ficheros, cero avisos de linter.
- `/privacidad` sirve los tres párrafos nuevos en producción.
- Prueba de humo de Supabase: cinco verdes, incluidas `submission_attempts` y `registrar_intento`
  cerradas al público (`401`).
- Línea base limpia: `submission_attempts` con 0 filas, `leads` con la única real.

## Siguiente

- **Sin probar de extremo a extremo**: nadie ha enviado todavía un formulario contra el despliegue
  nuevo, así que falta ver una fila aparecer en `submission_attempts`. Un solo envío basta.
- Firma de la superficie nueva del acta de tono (el mensaje de bloqueo), junto a S1–S12 desde el
  2026-09-02.
- `NEXT_PUBLIC_CALENDAR_URL` sigue sin definir (riesgo R-3).
