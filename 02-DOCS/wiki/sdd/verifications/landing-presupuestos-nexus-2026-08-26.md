---
type: verification
title: Verification — landing-presupuestos-nexus — 2026-08-26
description: Veredicto con evidencia. Puerta de stack verde, 36/36 done-checks, 23 de 24 criterios probados. Un criterio abierto que exige firma humana.
tags: [sdd, verification]
timestamp: 2026-08-26T18:00:00Z
topic: sdd
slug: landing-presupuestos-nexus
source_state: "sin git (constitution 18) — copia fechada .rsc/backups/03-APP-20260826-155613-implement-completo"
---

# Verification — landing-presupuestos-nexus — 2026-08-26

> Todas las cifras vienen de **una única ejecución fresca posterior a la última edición**.
> `source_state` no es un SHA porque este proyecto no usa git (`D-0012`): la referencia es la copia
> fechada. Es una pérdida real de trazabilidad y queda escrita como tal.

## Puerta de stack

`03-APP/scripts/verify.sh` → **PASS** (exit 0)

| Capa | Resultado |
|---|---|
| Linter (eslint + next) | PASS — **0 errores, 0 avisos** |
| Comprobador de tipos (`tsc --noEmit`) | PASS |
| Pruebas (Vitest) | PASS — **144 pruebas, 15 ficheros** |
| Cobertura de `src/core/` | PASS — **100 % sentencias (137/137), 100 % ramas (79/79), 100 % funciones (25/25), 100 % líneas (122/122)**; suelo exigido 95 % |
| Compilación de producción (Next 16.3.3) | PASS |

### El guardián se probó en las dos direcciones

`verify.sh` es de fabricación propia, así que su verde no vale hasta demostrar que sabe ponerse rojo.

| Capa | Control negativo (entrada mala) | Control positivo |
|---|---|---|
| Pruebas | prueba con `expect(1).toBe(2)` → **ROJO, exit 1** | verde, exit 0 |
| Tipos | `const roto: number = 'texto'` → **exit 2, 1 error TS** | verde |
| Lint | `function conAny(x: any)` → **exit 1**, `@typescript-eslint/no-explicit-any` | verde |
| Build | error real observado durante T029 (`TS2493` en un mock) → **falló la compilación** | verde |

**Hallazgo:** el linter hace cumplir **automáticamente** el principio 13 de la constitución
(«ningún `any` en `src/core/`»). Esa regla tiene ejecutor real, no depende de que alguien se acuerde.

**Límite de este control, dicho donde se dice el aprobado:** haber visto fallar cada capa una vez
prueba que *ese* caso malo alcanza su camino de fallo. **No** prueba que la puerta reconozca toda
violación posible de la regla que dice vigilar.

## Task done-checks — 36 / 36

Todas las tareas T001–T036 con su done-check satisfecho. Evidencia por bloque:

- **T001–T003, T035** (andamiaje, config, catálogo, snapshot) — `verify.sh` verde; `config.yaml` con
  comandos reales; `snapshot.sh` produjo copias fechadas verificables en `.rsc/backups/`.
- **T004–T015** (núcleo puro) — 144 pruebas verdes, cobertura 100 %.
- **T016–T019** (puertos) — `ports.test.ts` verde, incluida la regla de selección de adaptador.
- **T020–T021** (orquestación) — `submit.test.ts` verde, 4 escenarios de fallo independientes.
- **T022–T027, T034** (interfaz y accesibilidad) — pruebas de componente verdes.
- **T028–T029** — cobertura exit 0; `verify.sh` VERDE.
- **T030, T036** — `tone-checklist.md` y `manual-walkthrough.md` existen con su estructura.
- **T032, T033** — ambos `test_connection.sh` fallan **con mensaje claro** al faltar `.env`, que es
  el comportamiento correcto sin credenciales.

## Criterios de aceptación — 23 probados, 1 abierto

| CA | Estado | Evidencia |
|---|---|---|
| CA-01 caso de referencia = 28.000–35.000 | ✅ | `pricing.test.ts` — aserción exacta |
| CA-02 toda combinación dentro de rango | ✅ | `exhaustive.test.ts` — **504 combinaciones, 0 violaciones** |
| CA-03 rango abierto sin techo | ✅ | `pricing.test.ts`, `outcome.test.ts` |
| CA-04 cuota mensual | ✅ | `pricing.test.ts`, `outcome.test.ts`, `proposal.test.ts` |
| CA-05 advertencia con toda cifra | ✅ | `outcome.test.ts`, `result-screen.test.tsx`, `proposal.test.ts` |
| CA-06 nada interno al navegador | ✅ | `outcome.test.ts` — prueba **estructural** sobre el serializado + «exactamente 5 claves». Más fuerte que mirar la pestaña de red |
| CA-07 / CA-08 pregunta 2 condicional | ✅ | `service-resolver.test.ts`, `form-wizard.test.tsx` |
| CA-09 sin catalogar sin euros | ✅ | `outcome.test.ts`, `result-screen.test.tsx` (`container.textContent` sin `€`) |
| CA-10 / CA-11 dos perfiles | ✅ | `scoring.test.ts`, `outcome.test.ts` |
| CA-12 sin catalogar + umbral → calendario | ✅ | `outcome.test.ts`, `result-screen.test.tsx` |
| CA-13 umbral en un único punto | ✅ | `outcome.test.ts` — la rama cambia sólo con el valor configurado |
| CA-14 el lead no ve su nota | ✅ | `outcome.test.ts`, `result-screen.test.tsx` |
| CA-15 dos correos | ✅ | `submit.test.ts` |
| CA-16 aviso interno con desglose | ✅ | `submit.test.ts` — 5 líneas de señal verificadas |
| CA-17 fallo de correo → el lead ve su pantalla | ✅ | `submit.test.ts` — 4 escenarios de fallo |
| CA-18 doble envío | ✅ | `submit.test.ts` — un despacho, dos resultados iguales, TTL probado |
| **CA-19 tono verificado con acta** | ❌ **NO VERIFICADO** | La lista existe (`tone-checklist.md`), **el acta está sin firmar**. Las pruebas automáticas cubren los anti-patrones literales; lo que exige el criterio es una revisión humana registrada |
| CA-20 propuesta sin rótulos | ✅ | `proposal.test.ts` |
| CA-21 / CA-22 bordes 250 y 6 meses | ✅ | `partitions.test.ts` |
| CA-23 opciones sin solape | ✅ | `partitions.test.ts` — partición sobre 0–5.000 empleados y 0–36 meses |
| CA-24 llamada con duración y propósito | ✅ | `outcome.test.ts`, `proposal.test.ts` |

## Capas no ejecutadas

- **SUSTITUIDA** — *integraciones externas*: `EmailPort` y `RegistryPort` se ejercen con adaptadores
  falsos. **No detecta** que la API real de Resend o de Google Sheets responda distinto a lo asumido,
  ni un fallo de autenticación, ni un formato de fila rechazado. El camino real está **sin ejecutar
  ni una vez** (riesgo R-1: no hay credenciales). Los contratos están probados; la realidad no.
- **SUSTITUIDA** — *incrustación del calendario*: se prueba que el `iframe` se monta y que existe el
  enlace de plan B. **No detecta** que la página de citas de Google rechace ser incrustada
  (riesgo R-3), porque eso sólo se ve con la URL real.
- **SUSTITUIDA** — *cobertura como puerta*: hay umbral (95 %) y se alcanza el 100 %, pero **no hay
  pruebas de mutación**. La cobertura demuestra qué líneas se ejecutan, no que las aserciones
  detectarían una regresión. **No detecta** una prueba que pase por accidente.
- **HERRAMIENTA-AUSENTE** — *auditoría de dependencias*: `verify.sh` no ejecuta `npm audit`. La
  instalación reportó 0 vulnerabilidades, pero **eso fue en la instalación, no en esta pasada**.
- **NO-APLICA** — *migraciones y capa de datos*: no hay base de datos, por decisión de alcance.
- **NO-APLICA** — *presupuesto de rendimiento*: ausencia decidida (constitution 26). `verify` **no
  debe** comprobar Core Web Vitals aquí.
- **NO-APLICA** — *accesibilidad fuera del formulario*: sin suelo declarado (constitution 25).

## Hallazgos descartados

- *«El repliegue a adaptador falso puede tragarse leads en producción»* — **descartado con
  evidencia**: `ports.test.ts` prueba que en producción sin credencial se devuelve
  `MisconfiguredEmailPort`, que lanza, y que `USE_FAKE_ADAPTERS=1` **no** puede forzar el falso en
  producción. Era el finding F-1 de `analyze`; está cerrado y probado.
- *«El contador de progreso salta de 7 a 8 y parece un fallo»* — descartado: es la ramificación real
  del formulario y está fijado por prueba en `form-wizard.test.tsx`.
- *«La cobertura del 100 % puede ser relleno»* — parcialmente descartado: las dos últimas ramas se
  cubrieron con comportamiento real (cuota mensual, nombre de una palabra) y una tercera se eliminó
  por ser código inalcanzable. Sigue sin haber prueba de mutación, así que se registra arriba como
  SUSTITUIDA en vez de darse por cerrado.

## Segunda pasada — tras la lectura adversaria de `review`

La revisión posterior a esta acta encontró un defecto que la puerta no podía ver, se corrigió, y la
puerta se volvió a ejecutar **entera y fresca**. Las cifras de arriba son de la primera pasada; estas
son las vigentes:

| | Primera pasada | Tras corregir |
|---|---|---|
| Pruebas | 144 | **156** |
| Sentencias | 100 % (137/137) | **100 % (148/148)** |
| Ramas | 100 % (79/79) | **100 % (89/89)** |
| Funciones | 100 % (25/25) | **100 % (26/26)** |
| `verify.sh` | VERDE | **VERDE** |

**El defecto:** llamar a la acción de servidor con un tramo de tamaño inventado producía
`«NaN – NaN €»` en pantalla **y un correo con el membrete de Nexus con esa cifra dentro**. Ninguna de
las 144 pruebas lo veía porque todas usaban valores válidos del enum. Causa: una acción de servidor
es un endpoint HTTP público y se validaba el contacto pero no las respuestas. Cerrado en `S-0013`,
con 12 pruebas nuevas.

**Lo que esto dice de la propia puerta:** una cobertura del 100 % con 144 pruebas verdes no vio un
fallo que sale por correo firmado. Es la mejor ilustración posible de por qué el registro de arriba
marca *cobertura* como `SUSTITUIDA` y no como prueba de corrección.

## Verdict: FAIL — 1 punto abierto (CA-19)

Todo lo mecánico está verde: 4 capas de la puerta, 36/36 done-checks, 23/24 criterios con evidencia
observable. **El único punto abierto es CA-19**, y no es un defecto del código: es un criterio que
exige por diseño la firma de una persona (`constitution 28`), y ningún agente puede aportarla.

La regla es que un solo criterio sin evidencia tumba la puerta entera, y se aplica: **el veredicto es
FAIL**. Lo que eso significa en la práctica es concreto y acotado — **no bloquea revisar el código;
bloquea publicar**, exactamente igual que el aviso de privacidad diferido (`S-0004`,
`constitution 23`).
