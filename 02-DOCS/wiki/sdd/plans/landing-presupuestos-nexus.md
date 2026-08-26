---
type: plan
title: Plan — Landing y estimador de presupuesto de Nexus
description: Plan técnico a nivel de estructura — componentes, contratos, flujo de datos, estrategia de pruebas y riesgos de la landing con estimador.
tags: [sdd, plan, landing, estimacion, nextjs]
timestamp: 2026-08-26T16:00:00Z
topic: sdd
slug: landing-presupuestos-nexus
status: draft
---

# Plan — Landing y estimador de presupuesto de Nexus

> Spec: [../specs/landing-presupuestos-nexus.md](../specs/landing-presupuestos-nexus.md) · Constitution: [../constitution.md](../constitution.md) · Status: draft
> Last updated: 2026-08-26

## 0. Global Constraints

Valores exactos que **toda** tarea honra, aunque su enunciado no los repita. Un implementador aislado
no ve nada más que esto y su propia tarea.

- **Stack:** Next.js App Router + TypeScript estricto. Gestor: `npm`, un único `package-lock.json`.
  Node: LTS activa, fijada en `engines`. *(constitution §1)*
- **Ningún `any` en `src/core/`** y **cobertura ≥ 95 % de línea en `src/core/`.** TDD: prueba que
  falla antes que código. *(constitution 13, 14)* — **endurecimiento deliberado**: la constitución
  exige ese listón sólo en los dos motores; este plan lo extiende a todo `src/core/`
  (`ServiceResolver`, `OutcomeMapper`, `ProposalComposer` incluidos) porque son igual de puros e
  igual de baratos de probar, y una frontera de cobertura a mitad de carpeta se erosiona sola.
  Decidido en respuesta a F-6 de la puerta analyze, no descubierto al fallar la puerta.
- **Rangos oficiales 2026, en euros, sin decimales:**
  `AI Opportunity Assessment` 18000–35000 · `AI Transformation Program` 90000–350000 ·
  `AI Executive Advisory` 6000–15000 **/mes** · `Cyber Resilience Assessment` 20000–60000 ·
  `ESG Strategy & Compliance` 25000–80000 · `Custom AI Solutions` desde 40000 (**sin techo**).
- **Factores multiplicativos** (como mucho uno por bloque):
  tamaño `<50` ×0.80 · `50-249` ×0.90 · `250-999` ×1.05 · `>=1000` ×1.25;
  madurez `inicial` ×1.15 · `en_desarrollo` ×1.00 · `avanzada` ×0.90;
  plazo `<3m` ×1.15 · `3-6m` ×1.00 · `>6m` ×0.95.
- **Tabla de puntos:** sponsor `si` +3 / `en_proceso` +1 / `no` 0 · presupuesto `asignado` +3 /
  `previsto` +2 / `sin` 0 · plazo `3-6m` +2 / `>6m` +1 / `<3m` **−1** · madurez
  `en_desarrollo|avanzada` +1 · tamaño `>=250` +1. Máximo 10.
- **Umbral de cualificación: 6.** En **un único** punto de configuración. *(constitution 9, CA-13)*
- **Caducidad de rangos y factores: 2026-12-31.** Configuración con fecha, no constantes. *(constitution 10)*
- **Margen del rango entregado: ±12 %**, ambos extremos redondeados **al millar más cercano**.
- **Anclaje al rango oficial DOS veces:** tras aplicar factores y sobre el rango final. *(constitution 7, CA-02)*
- **Nada de lo anterior cruza al navegador**: ni factores, ni tabla de puntos, ni umbral, ni
  puntuación. *(constitution 8, 11 · CA-06, CA-14)*
- **Buzón interno:** `oportunidades@nexus-st.com`.
- **Idioma:** español, único. **Moneda:** EUR.
- **Copy:** sin promesas de resultado, urgencia fabricada, descuentos, precios cerrados ni plazos de
  entrega. El correo al cliente **no lleva secciones etiquetadas**. *(constitution 27, CA-19, CA-20)*
- **Sin git.** No hay ramas, no hay revertir. Copia previa antes de cambio estructural. *(constitution 18, 19)*

## 1. Context & constraints

- **Criterios que dan forma al diseño:** `spec §Acceptance CA-01…CA-06` (cálculo y secreto de los
  factores), `CA-07…CA-09` (ramificación del servicio), `CA-10…CA-14` (tres salidas y umbral),
  `CA-15…CA-18` (correos, registro, idempotencia), `CA-19…CA-24` (tono, bordes, llamada).
- **Barras no funcionales:** WCAG 2.2 AA **sólo** en el recorrido del formulario *(constitution 24)*;
  **sin** presupuesto de rendimiento *(constitution 26)*; **sin** requisito de residencia de datos
  *(constitution 22)*. Volumen esperado: decenas de envíos al mes *(spec C-08)*.
- **Reglas de constitución en juego:** §1 canon de stack, 8 (cálculo en servidor), 9 (umbral en un
  punto), 13-17 (listón de pruebas), 18-19 (sin git), 21 (secretos), 23 (privacidad bloquea publicar).
- **Fuera de alcance que el diseño NO debe invadir:** panel interno, CRM, histórico consultable,
  segundo idioma, pago o firma en línea, blog o casos de éxito, **cualquier anti-spam** *(spec
  Non-goals + C-04)*, **cualquier garantía de durabilidad** *(C-01)*, aviso de privacidad *(S-0004,
  requisito de publicación, no de construcción)*.

## 2. Architecture

```text
                    NAVEGADOR (no confiable)
  [ LandingPage ] --CTA--> [ FormWizard (client) ]
                                   |
                                   | submit(Answers + submissionId)   ← server action
                                   v
  ================= FRONTERA DE CONFIANZA =================
                          [ SubmitAction ]
                                   |
        +----------+---------------+---------------+
        v          v               v               v
 [ServiceResolver] [PricingEngine] [ScoringEngine] [OutcomeMapper]
        |                |               |               |
        +--------- lee ---+------- lee ---+               |
                         v                                v
                  [ CatalogConfig ]                [ RedactedOutcome ]
                   (server-only)                          |
                                                          | + LeadRecord
                                   +----------------------+---------+
                                   v                                v
                        [ ProposalComposer ]                 [ Dispatcher ]
                                   |                          /        \
                                   +------------------------>/          \
                                                     [EmailPort]   [RegistryPort]
                                                          |               |
                                                    (Resend, EXT)  (Google Sheets, EXT)

  RedactedOutcome ---> vuelve al navegador ---> [ ResultScreen ] --(si cualifica)--> [CalendarEmbed (EXT)]
```

- **LandingPage** (interno) — presenta a Nexus y sus cuatro líneas; una sola CTA. Estático.
- **FormWizard** (interno, cliente) — una pregunta por pantalla, avance/retroceso sin perder
  respuestas, progreso visible, validación de contacto en pantalla. **Sólo conoce etiquetas, nunca pesos.**
- **SubmitAction** (interno, servidor) — único punto de entrada de un envío; orquesta y nunca lanza
  hacia el cliente.
- **CatalogConfig** (interno, `server-only`) — la única fuente de rangos, factores, tabla de puntos,
  umbral y fecha de caducidad. *(constitution 9, 10)*
- **ServiceResolver** (interno, puro) — reto + necesidad → servicio catalogado o `UNCATALOGUED`.
- **PricingEngine** (interno, puro) — los cuatro pasos con doble anclaje.
- **ScoringEngine** (interno, puro) — puntuación sobre 10 **con desglose señal a señal**.
- **OutcomeMapper** (interno, puro) — decide cuál de las tres salidas y **redacta** lo que puede ver
  el lead. Es el guardián del principio 8.
- **ProposalComposer** (interno, puro) — texto de la propuesta con la estructura de la casa, sin
  etiquetar las secciones.
- **Dispatcher** (interno) — dos correos + registro, *best-effort*, jamás propaga error.
- **EmailPort / RegistryPort** (interno, interfaz) → adaptadores **externos**: Resend y Google Sheets.
- **CalendarEmbed** (externo) — página de citas compartida de Google, incrustada.

**Decisión arquitectónica principal — el servidor devuelve una *vista redactada*, no el resultado.**

`SubmitAction` no devuelve el objeto de cálculo con campos ocultos por la interfaz: construye un
`RedactedOutcome` que **sólo contiene lo que el lead puede ver** (las cadenas del rango ya
formateadas, el texto de la salida, un booleano `showCalendar`). La puntuación, el desglose, el
servicio interno, los factores y el umbral **no existen en esa estructura**, así que no pueden
filtrarse aunque alguien abra la pestaña de red.

*Alternativa considerada:* devolver el resultado completo y ocultar en la interfaz lo interno. **Se
descarta**: es exactamente el fallo que `CA-06` prohíbe — invisible en pantalla, visible en dos clics.
La redacción en origen convierte el principio 8 en una propiedad estructural en vez de una disciplina
que alguien tiene que recordar. Coste aceptado: el mapeo a texto ocurre en servidor, así que cambiar
el formato de una cifra es un cambio de servidor, no de plantilla.

## 3. Interfaces & contracts

```text
ServiceResolver.resolve(challenge: Challenge, need: Need | null) -> ServiceRef | Uncatalogued
  - total: toda combinación válida resuelve; no lanza
  - need sólo se consulta si challenge == 'ia'; en el resto se ignora aunque venga informado
  - challenge == 'estrategia_operaciones' -> Uncatalogued, siempre

PricingEngine.price(service: ServiceRef, size: Size, maturity: Maturity, timing: Timing) -> PriceRange
  - invariante DURA: low >= service.officialMin  Y  (service.openEnded  O  high <= service.officialMax)
  - invariante: low <= high
  - determinista y puro: mismas entradas -> mismo resultado, sin reloj ni azar
  - openEnded (Custom AI Solutions) -> high = null  (se rotula «a confirmar en llamada de alcance»)
  - monthly (AI Executive Advisory) -> unit = 'month'
  - orden fijo: midpoint -> factores -> ANCLA -> ±12 % + redondeo al millar -> ANCLA

ScoringEngine.score(answers: BusinessAnswers) -> Score
  - Score = { total: 0..10, breakdown: SignalContribution[] }
  - breakdown NUNCA vacío: una línea por señal evaluada, incluida la que aporta 0 y la que resta
  - total == suma de breakdown[].points, acotado a [0, 10]

OutcomeMapper.map(service, price | null, score, threshold) -> RedactedOutcome
  - RedactedOutcome = { kind: 'qualified' | 'not_qualified' | 'uncatalogued',
                        rangeText: string | null, disclaimer: string, bodyText: string,
                        showCalendar: boolean }
  - invariante DURA: la estructura devuelta no contiene score, umbral, factores ni ServiceRef
  - kind == 'uncatalogued' -> rangeText == null (CA-09)
  - showCalendar == (score.total >= threshold), también en 'uncatalogued' (CA-12, S-0002)

ProposalComposer.compose(contact, service, price | null, outcomeKind) -> ProposalText
  - sin encabezados de sección; texto continuo (CA-20)
  - si price == null, explica por qué no hay cifra en lugar de omitirla

Dispatcher.dispatch(lead: LeadRecord) -> DispatchReport
  - NUNCA lanza: toda excepción se captura y se refleja en DispatchReport
  - best-effort: intenta correo al cliente, correo interno y registro de forma independiente;
    el fallo de uno no cancela los otros (C-01)
  - DispatchReport = { clientEmail: 'ok'|'failed', internalEmail: 'ok'|'failed', registry: 'ok'|'failed' }

SubmitAction.submit(answers: Answers, submissionId: string) -> RedactedOutcome
  - idempotente sobre submissionId dentro de la ventana de deduplicación (CA-18)
  - NUNCA lanza hacia el cliente: un fallo de dispatch devuelve igualmente el RedactedOutcome (CA-17)
  - valida contacto antes de calcular; contacto inválido -> ValidationError con campo señalado

EmailPort.send(message: EmailMessage) -> void | throws
RegistryPort.append(row: LeadRecord) -> void | throws
  - ambos puertos son sustituibles por un adaptador de prueba sin tocar nada aguas arriba
  - SELECCION DEL ADAPTADOR (corrige F-1 de la puerta analyze):
      produccion  + credencial presente -> adaptador real
      produccion  + credencial AUSENTE  -> adaptador que SIEMPRE falla, y el arranque lo grita
      no-produccion (o USE_FAKE_ADAPTERS=1) -> adaptador falso
  - PROHIBIDO replegarse al falso en produccion: un falso silencioso haria que DispatchReport
    dijese 'ok' mientras cada lead desaparece. Es el fallo invisible que CA-17 existe para impedir
```

## 4. Data model & flow

**Entidades** (todas transitorias — no hay base de datos, *constitution* §Non-goals)

- **Answers** — `challenge`, `need?`, `size`, `maturity`, `timing`, `sponsor`, `budget`, `contact{name,email,company}`.
- **ServiceRef** — `id`, `label`, `officialMin`, `officialMax | null`, `unit: 'total'|'month'`, `openEnded`.
- **PriceRange** — `low`, `high | null`, `unit`.
- **Score** — `total`, `breakdown: [{ signal, answer, points }]`. **Nunca sale del servidor.**
- **RedactedOutcome** — lo único que cruza al navegador (contrato en §3).
- **LeadRecord** — contacto + respuestas completas + servicio + rango + `Score` completo. Es lo que
  viaja al correo interno y a la hoja de cálculo; **nunca** al cliente.

**Flujo principal** (`lead cualificado, servicio catalogado`)

1. `FormWizard` reúne `Answers` y un `submissionId` acuñado al montar el formulario →
2. `SubmitAction` valida el contacto; si falla, devuelve `ValidationError` sin calcular nada →
3. consulta la caché de deduplicación por `submissionId`; si hay resultado previo, lo devuelve **sin
   volver a despachar** (CA-18) →
4. `ServiceResolver` resuelve el servicio → `PricingEngine` produce `PriceRange` →
   `ScoringEngine` produce `Score` (ambos leen `CatalogConfig`) →
5. `OutcomeMapper` compone `RedactedOutcome` y decide `showCalendar` contra el umbral →
6. `ProposalComposer` redacta la propuesta; se arma `LeadRecord` →
7. `Dispatcher` intenta, de forma independiente, correo al cliente, correo interno y fila en el
   registro; captura cualquier fallo en `DispatchReport` y lo registra en el log del servidor →
8. `SubmitAction` guarda el resultado en la caché de deduplicación y **devuelve `RedactedOutcome`
   pase lo que pase en el paso 7** (CA-17) →
9. `ResultScreen` pinta la salida; si `showCalendar`, incrusta la página de citas.

- **Fronteras de consistencia:** ninguna transacción. Los tres efectos del paso 7 son independientes
  y pueden quedar en cualquier combinación de éxito y fallo. Es la consecuencia aceptada de C-01 y
  está declarada, no descubierta.
- **Deduplicación:** caché en memoria del proceso, `submissionId → RedactedOutcome`, TTL 10 minutos.
  Cubre doble clic y recarga, que es literalmente lo que `CA-18` enuncia. **No** cubre dos instancias
  del servidor ni un arranque en frío entre ambos envíos — ver §7 riesgo R-2.
- **Impacto de migración:** ninguno — no hay esquema, ni tabla, ni backfill. Proyecto nuevo.

## 5. Testing strategy

**Niveles usados:** *unit* (funciones puras del núcleo), *integración* (`SubmitAction` con puertos
falsos) y *componente* (interfaz React sobre un DOM simulado, con la acción de servidor falseada —
corrige F-4 de la puerta analyze). La línea e2e está **por debajo del navegador**: no hay navegador
automatizado — con `constitution 17` (sin suelo fuera del
núcleo) y sin presupuesto de rendimiento, un e2e real no paga su coste de mantenimiento aquí. Lo que
**no** se falsea nunca: `CatalogConfig`. Un test que mockea el catálogo no prueba nada, porque el
catálogo *es* la regla de negocio.

| Criterio | Nivel | Qué afirma | Qué falsea |
| --- | --- | --- | --- |
| CA-01 | unit | Caso de referencia → exactamente 28000–35000 | nada |
| CA-02 | unit **exhaustivo** | Recorre **todas** las combinaciones de preguntas 1-5 y verifica ambos extremos dentro del rango oficial | nada |
| CA-03 | unit | Custom AI Solutions → `high == null` | nada |
| CA-04 | unit | AI Executive Advisory → `unit == 'month'` | nada |
| CA-05 | unit | Toda salida con cifra lleva `disclaimer` no vacío | nada |
| CA-06 | unit **estructural** | Serializa `RedactedOutcome` y afirma que la cadena resultante **no contiene** ningún factor, punto ni el umbral | nada |
| CA-07, CA-08 | unit | Pregunta 2 visible si y sólo si reto == IA | nada |
| CA-09 | unit | Rama sin catalogar → `rangeText == null` y el texto no contiene `€` | nada |
| CA-10, CA-11 | unit | Puntuación y `showCalendar` para los dos perfiles del spec | nada |
| CA-12 | unit | Sin catalogar + supera umbral → `showCalendar` y sin cifra | nada |
| CA-13 | unit | Cambiar **sólo** el valor del umbral cambia la rama; ningún otro fichero se toca | nada |
| CA-14 | unit | `RedactedOutcome` no expone puntuación ni umbral (comparte aserción con CA-06) | nada |
| CA-15 | integración | Un envío completo produce exactamente 2 mensajes en el puerto de correo | EmailPort, RegistryPort |
| CA-16 | integración | El mensaje interno contiene contacto, respuestas, servicio, rango, total **y una línea por señal** | EmailPort |
| CA-17 | integración | Con `EmailPort` lanzando siempre, `submit` **devuelve** el outcome y `DispatchReport` marca el fallo | EmailPort (falla), RegistryPort |
| CA-18 | integración | Dos `submit` con el mismo `submissionId` → un solo despacho, dos outcomes iguales | EmailPort, RegistryPort |
| CA-19 | **revisión humana** | Lista de comprobación de tono, con acta *(constitution 28)* | — |
| CA-20 | unit | El texto de la propuesta no contiene ninguno de los rótulos de sección | nada |
| CA-21, CA-22 | unit | 250 empleados → ×1.05/+1 · 6 meses → ×1.00/+2 | nada |
| CA-23 | unit | Las opciones de las preguntas 3, 5 y 6 no se solapan (recorre los tramos y verifica particiones) | nada |
| CA-24 | unit | El texto de la rama sin catalogar nombra los 30 minutos y no promete análisis | nada |

- **Accesibilidad** *(constitution 24)*: pruebas del recorrido del formulario — foco visible tras
  avanzar, error de validación asociado a su campo, navegación completa con teclado.

## 6. Sequencing & dependencies

1. **Andamiaje del proyecto** (Next.js + TS estricto + linter + runner) — depende de: nada — serial
2. **`CatalogConfig`** con rangos, factores, tabla, umbral y caducidad — depende de: #1 — serial
3. **`ServiceResolver`** + pruebas (CA-07, CA-08, CA-09) — depende de: #2 — **paralelizable**
4. **`PricingEngine`** + pruebas TDD (CA-01…CA-05, CA-21, CA-22) — depende de: #2 — **paralelizable**
5. **`ScoringEngine`** + pruebas TDD (CA-10, CA-11, CA-16-desglose) — depende de: #2 — **paralelizable**
6. **Prueba exhaustiva de combinaciones** (CA-02, CA-23) — depende de: #3, #4 — serial
7. **`OutcomeMapper`** + redacción + pruebas (CA-06, CA-12, CA-13, CA-14) — depende de: #4, #5 — serial
8. **`ProposalComposer`** + pruebas (CA-20, CA-24) — depende de: #2 — **paralelizable**
9. **`EmailPort` + adaptador Resend + falso** — depende de: #1 — **paralelizable**
10. **`RegistryPort` + adaptador Sheets + falso** — depende de: #1 — **paralelizable**
11. **`SubmitAction`** + deduplicación + pruebas de integración (CA-15…CA-18) — depende de: #7, #8, #9, #10 — serial
12. **`FormWizard`** — 8 pantallas, avance/retroceso, progreso, validación — depende de: #1 — **paralelizable**
13. **`ResultScreen`** con las tres salidas + incrustación del calendario — depende de: #11, #12 — serial
14. **`LandingPage`** + copy — depende de: #1 — **paralelizable**
15. **Pasada de accesibilidad** del recorrido del formulario — depende de: #12, #13 — serial
16. **Lista de tono con acta** (CA-19) — depende de: #13, #14 — serial, **última**

- **Candidatos a paralelo** (ámbitos disjuntos, sin estado compartido): #3/#4/#5/#8 (núcleo puro),
  #9/#10 (adaptadores), #12/#14 (interfaz). Los tres grupos no se tocan entre sí.
- **Órdenes duras y por qué:** #2 antes que todo el núcleo (es la fuente de verdad); #7 después de
  #4 y #5 porque redacta lo que ellos producen; #11 después de los cuatro puertos y motores porque
  es quien los orquesta; #16 el último porque revisa texto que antes no existe.

## 7. Risks & open decisions

| # | Riesgo | Disparador | Impacto | Mitigación / spike |
| --- | --- | --- | --- | --- |
| R-1 | **Ninguna integración externa se puede verificar**: no hay clave de Resend, ni cuenta de servicio de Google, ni URL de calendario | Al llegar a #9, #10, #13 | Alto sobre «terminado»: el producto queda construido pero no comprobado contra el mundo real | Puertos con adaptador falso desde el día uno; la app arranca y pasa todas las pruebas sin credenciales. Un chequeo de configuración avisa al arrancar de qué falta. Retira el riesgo: el usuario aporta las tres credenciales |
| R-2 | **La deduplicación no sobrevive a más de una instancia** ni a un arranque en frío | Despliegue sin servidor con varias instancias, o dos envíos separados por minutos | Medio: el lead recibe dos correos idénticos, justo lo que CA-18 prohíbe | Aceptado por C-01 (no hay almacén). Se documenta el límite. Si el despliegue acaba siendo multi-instancia, revisar antes de publicar |
| R-3 | **La página de citas de Google puede rechazar ser incrustada** | Al montar #13 con una URL real | Medio-alto: rompe la salida de máximo valor, la del lead cualificado | Plan B escrito de antemano: abrir en pestaña nueva con aviso. Verificable sólo con la URL real (bloqueado por R-1) |
| R-4 | **El redondeo al millar es tosco en la cuota mensual** de AI Executive Advisory: 1.000 € sobre una cuota de 6.000 € es un salto del 16 % | Cualquier estimación de ese servicio | Bajo-medio, pero visible para el lead | **No se corrige**: el método lo dice literalmente y no es decisión de esta fase. Queda anotado para el comité comercial |
| R-5 | **Sin git, un error de implementación no se revierte** | Cualquier cambio estructural | Medio | Copia previa obligatoria *(constitution 19)*; construir en el orden de §6, verificando cada paso antes del siguiente |
| R-6 | **El tono no lo puede firmar un agente** | CA-19 al final | Bajo para construir, **bloquea publicar** | Se redacta el texto y **se deja preparada la lista**; el acta la firma una persona |

**Decisiones abiertas**

- **Dominio de envío del correo** — cierra cuando el usuario diga desde qué dominio sale. Sin él,
  Resend sólo puede enviar a la dirección propia del titular de la cuenta.
- **ID de la hoja de cálculo y cuenta de servicio de Google** — cierra con las credenciales.
- **URL de la página de citas compartida** — cierra con el calendario del equipo montado.
- **Dónde se publica** — no es de esta fase; la resuelve `deployment` *(y la bloquea `constitution 23`,
  el aviso de privacidad)*.

**Decisión tomada en esta fase y registrada:** proveedor de correo → **Resend** (`S-0012`).

---

## Tasks
<!-- generated by tasks on 2026-08-26; IDs are stable, do not renumber -->

Raíz del subproyecto: **`03-APP/`** (sigue la convención numerada del workspace, junto a `01-TOOLS/`
y `02-DOCS/`). Todos los caminos de esta tabla son relativos a esa raíz. Runner de pruebas: Vitest.
Comandos canónicos: `npm run lint` · `npm run typecheck` · `npm test` · `npm run test:coverage`.

| ID | [P] | Task | Done-check | Depends-on | Trace |
| --- | --- | --- | --- | --- | --- |
| T001 |  | Andamiar Next.js App Router + TypeScript estricto + Vitest + linter | `npm run lint && npm run typecheck && npm test` sale 0 con una prueba de humo | — | constitution §1, 12, 13 |
| T002 |  | Escribir `sdd-init` config tras el andamiaje | `02-DOCS/wiki/sdd/config.yaml` existe y sus `testing.commands` ejecutan | T001 | constitution 14 |
| T003 |  | Implementar `CatalogConfig` server-only: 6 servicios, factores, tabla de puntos, umbral 6, caducidad 2026-12-31 | `npm test -- catalog` verde: los 6 rangos oficiales, `threshold === 6`, `expiresOn === '2026-12-31'` | T001 | plan §0, constitution 9, 10 |
| T004 | [P] | Escribir pruebas que fallan de `ServiceResolver` | `npm test -- service-resolver` **falla**: módulo inexistente | T003 | CA-07, CA-08, CA-09 |
| T005 |  | Implementar `ServiceResolver` | T004 verde: IA ramifica por necesidad, las otras 3 líneas resuelven a servicio único, `estrategia_operaciones` → `Uncatalogued` | T004 | CA-07, CA-08, CA-09 |
| T006 | [P] | Escribir pruebas que fallan de `PricingEngine`: caso de referencia, rango abierto, cuota mensual, bordes 250 y 6 meses | `npm test -- pricing` **falla** | T003 | CA-01, CA-03, CA-04, CA-21, CA-22 |
| T007 |  | Implementar `PricingEngine`: punto medio → factores → ancla → ±12 % y millar → ancla | T006 verde. En particular el caso de referencia da **exactamente 28000–35000** | T006 | CA-01…CA-05, CA-21, CA-22 |
| T008 | [P] | Escribir pruebas que fallan de `ScoringEngine`: los dos perfiles del spec y desglose no vacío | `npm test -- scoring` **falla** | T003 | CA-10, CA-11, CA-16 |
| T009 |  | Implementar `ScoringEngine` con desglose señal a señal | T008 verde: perfil alto → 8; perfil bajo → −1 acotado a 0; `breakdown.length >= 5` | T008 | CA-10, CA-11, CA-16 |
| T010 |  | Añadir la prueba **exhaustiva** de combinaciones y hacerla pasar | `npm test -- exhaustive` verde recorriendo **todas** las combinaciones de preguntas 1-5; ningún extremo fuera del rango oficial | T005, T007 | CA-02, constitution 15 |
| T011 |  | Añadir la prueba de partición de tramos (ningún valor en dos opciones) | `npm test -- partitions` verde para tamaño, plazo y sponsor | T003 | CA-23 |
| T012 | [P] | Escribir pruebas que fallan de `OutcomeMapper`: redacción, tres salidas, umbral en un punto | `npm test -- outcome` **falla** | T007, T009 | CA-06, CA-09, CA-12, CA-13, CA-14 |
| T013 |  | Implementar `OutcomeMapper` que devuelve `RedactedOutcome` | T012 verde. Aserción estructural: `JSON.stringify(outcome)` **no contiene** ningún factor, punto ni el umbral | T012 | CA-06, CA-12, CA-13, CA-14 |
| T014 | [P] | Escribir pruebas que fallan de `ProposalComposer` | `npm test -- proposal` **falla** | T003 | CA-05, CA-20, CA-24 |
| T015 |  | Implementar `ProposalComposer` con la estructura de la casa sin rotular | T014 verde: el texto no contiene ninguno de los rótulos de sección; la rama sin catalogar nombra los 30 minutos | T014 | CA-05, CA-20, CA-24 |
| T016 | [P] | Definir `EmailPort` + adaptador falso que registra mensajes | `npm test -- email-port` verde: el falso captura asunto, destino y cuerpo | T001 | plan §3 |
| T017 | [P] | Implementar adaptador Resend tras `EmailPort` + chequeo de configuración al arrancar | `npm run typecheck` limpio; sin `RESEND_API_KEY` el arranque avisa y cae al falso sin romper | T016 | plan §3, S-0012 |
| T018 | [P] | Definir `RegistryPort` + adaptador falso en memoria | `npm test -- registry-port` verde | T001 | spec §Registro de respaldo |
| T019 | [P] | Implementar adaptador Google Sheets tras `RegistryPort` + chequeo de configuración | `npm run typecheck` limpio; sin credenciales avisa y cae al falso | T018 | spec §Registro de respaldo |
| T020 |  | Escribir pruebas de integración que fallan de `SubmitAction` | `npm test -- submit` **falla** | T013, T015, T016, T018 | CA-15, CA-16, CA-17, CA-18 |
| T021 |  | Implementar `SubmitAction` + caché de deduplicación (TTL 10 min) | T020 verde: 2 mensajes por envío; el interno lleva una línea por señal; con `EmailPort` lanzando, `submit` **devuelve** el outcome; mismo `submissionId` → un solo despacho | T020 | CA-15…CA-18 |
| T022 | [P] | Construir `FormWizard`: 8 pantallas, avance/retroceso sin pérdida, progreso, pregunta 2 condicional | `npm test -- form-wizard` verde: retroceder conserva respuestas; cambiar reto de IA a otra línea oculta la pregunta 2 y descarta su respuesta | T001 | CA-07, CA-08, spec §El formulario |
| T023 |  | Añadir validación de contacto en pantalla sin perder respuestas | `npm test -- contact-validation` verde: email inválido señala el campo y conserva el resto | T022 | spec §Caminos de error |
| T024 |  | Construir `ResultScreen` con las tres salidas + incrustación de calendario con plan B en pestaña | `npm test -- result-screen` verde: sin catalogar no renderiza `€`; `showCalendar` false no monta el iframe; **toda salida con cifra muestra la advertencia de orientativo** | T021, T022 | CA-05, CA-09, CA-11, CA-12, CA-24 |
| T025 | [P] | Construir `LandingPage` con posicionamiento, cuatro líneas y una sola CTA | `npm test -- landing` verde: exactamente una CTA primaria | T001 | spec §La landing |
| T026 |  | Cablear formulario → `SubmitAction` → pantalla de resultado | `npm test` completo verde; y el recorrido manual de los tres perfiles ejecutado contra la lista escrita de T036, no de memoria | T021, T024, T036 | spec §Behaviour |
| T027 |  | Pasada de accesibilidad del recorrido del formulario | `npm test -- a11y` verde: foco visible al avanzar, error asociado a su campo, recorrido completo con teclado | T023, T024 | constitution 24 |
| T028 |  | Fijar la puerta de cobertura ≥ 95 % en `src/core/` | `npm run test:coverage` sale 0 con el umbral configurado; cobertura de `src/core/` ≥ 95 % | T010, T013, T015 | constitution 14 |
| T029 |  | Escribir `scripts/verify.sh` (lint + typecheck + test + coverage) | `bash scripts/verify.sh` sale 0 | T028 | constitution §Definition of Done |
| T030 |  | Preparar la lista de comprobación de tono y dejarla lista para firma humana | `02-DOCS/wiki/sdd/tone-checklist.md` existe con una fila por superficie y hueco de acta | T024, T025 | CA-19, constitution 28 |
| T032 |  | Crear `01-TOOLS/RESEND/` con `.env`, `CREDENTIALS.md` y `test_connection.sh` | `bash 01-TOOLS/RESEND/test_connection.sh` responde (o falla con un mensaje claro si falta la clave) | T017 | constitution 21, `CLAUDE.md` §Tooling |
| T033 |  | Crear `01-TOOLS/GOOGLE/` con `.env`, `CREDENTIALS.md` y `test_connection.sh` | `bash 01-TOOLS/GOOGLE/test_connection.sh` responde (o falla con un mensaje claro si faltan credenciales) | T019 | constitution 21, `CLAUDE.md` §Tooling |
| T036 | [P] | Escribir la lista del recorrido manual de los tres perfiles | `02-DOCS/wiki/sdd/manual-walkthrough.md` existe con una fila por perfil y su resultado esperado | T024 | spec §Behaviour |
| T034 |  | Añadir prueba de que abandonar a media pregunta no despacha nada | `npm test -- abandon` verde: desmontar el formulario sin llegar al final no invoca `EmailPort` ni `RegistryPort` | T026 | spec §Caminos de error |
| T035 |  | Escribir `scripts/snapshot.sh` que copia `03-APP/` con marca de tiempo | `bash scripts/snapshot.sh` crea una copia fechada y sale 0 | T001 | constitution 19 |
| T031 |  | Todos los done-check pasan + `verify.sh` verde | cada fila anterior comprobada; `bash scripts/verify.sh` sale 0 | all | spec §Acceptance |

### Interfaces por tarea

**T005 — Interfaces**
- Consumes: `CatalogConfig.services: ServiceRef[]` (de T003), donde `ServiceRef = { id: string, label: string, officialMin: number, officialMax: number | null, unit: 'total' | 'month', openEnded: boolean }`
- Produces: `resolve(challenge: Challenge, need: Need | null) -> ServiceRef | { kind: 'uncatalogued' }` con `Challenge = 'ia' | 'ciberseguridad' | 'esg' | 'estrategia_operaciones'` y `Need = 'diagnostico' | 'implantacion' | 'acompanamiento' | 'desarrollo'`

**T007 — Interfaces**
- Consumes: `ServiceRef` (T005); `CatalogConfig.factors` (T003) con las claves `size: '<50'|'50-249'|'250-999'|'>=1000'`, `maturity: 'inicial'|'en_desarrollo'|'avanzada'`, `timing: '<3m'|'3-6m'|'>6m'`
- Produces: `price(service: ServiceRef, size, maturity, timing) -> { low: number, high: number | null, unit: 'total'|'month' }`

**T009 — Interfaces**
- Consumes: `CatalogConfig.scoring` (T003)
- Produces: `score(answers) -> { total: number, breakdown: Array<{ signal: string, answer: string, points: number }> }`

**T013 — Interfaces**
- Consumes: `PriceRange` (T007); `Score` (T009); `CatalogConfig.threshold: number` (T003)
- Produces: `map(...) -> { kind: 'qualified'|'not_qualified'|'uncatalogued', rangeText: string | null, disclaimer: string, bodyText: string, showCalendar: boolean }` — **y nada más**; ningún otro campo puede existir en el objeto devuelto

**T021 — Interfaces**
- Consumes: `OutcomeMapper.map` (T013); `ProposalComposer.compose` (T015); `EmailPort.send(message: { to: string, subject: string, body: string }) -> void` (T016); `RegistryPort.append(row: LeadRecord) -> void` (T018)
- Produces: `submit(answers: Answers, submissionId: string) -> RedactedOutcome | { kind: 'validation_error', field: string }` — nunca lanza hacia el cliente

**T015 — Interfaces**
- Consumes: `Contact = { name: string, email: string, company: string }`; `ServiceRef` (T005); `PriceRange | null` (T007); `outcomeKind: 'qualified'|'not_qualified'|'uncatalogued'`
- Produces: `compose(contact, service, price, outcomeKind) -> string` — texto continuo, **sin** los rótulos `Tesis`, `Problema`, `Enfoque`, `Diferenciación`, `Resultado esperado`, `Siguiente paso`

**T017 — Interfaces**
- Consumes: `EmailPort` (definido en T016) = `{ send(message: { to: string, subject: string, body: string }): Promise<void> }`; variable de entorno `RESEND_API_KEY`
- Produces: un adaptador que cumple `EmailPort`; **en producción sin clave** devuelve un adaptador que siempre lanza, nunca el falso (ver §3, selección del adaptador)

**T019 — Interfaces**
- Consumes: `RegistryPort` (definido en T018) = `{ append(row: LeadRecord): Promise<void> }`; variables `GOOGLE_SERVICE_ACCOUNT_JSON` y `GOOGLE_SHEET_ID`
- Produces: un adaptador que cumple `RegistryPort`; misma regla de producción que T017

**T023 — Interfaces**
- Consumes: `Contact = { name: string, email: string, company: string }`; el estado de respuestas del `FormWizard` (T022)
- Produces: validación en pantalla que devuelve `{ field: 'name'|'email'|'company', message: string } | null` y **nunca** limpia las respuestas ya dadas

**T024 — Interfaces**
- Consumes: `RedactedOutcome` (T013, vía T021). Es **lo único** que la pantalla recibe: no hay puntuación ni umbral que ocultar porque no llegan
- Produces: tres ramas de render; `showCalendar === true` monta el iframe de la página de citas, con enlace en pestaña nueva como plan B

## Review Workload Forecast

| Dimension | Forecast | Why |
| --- | --- | --- |
| Líneas cambiadas estimadas | 2.500 – 3.500 | 31 tareas; ~14 de núcleo con sus pruebas, ~8 de interfaz, ~6 de infraestructura |
| Ficheros / áreas | ~45 ficheros en 5 áreas: `src/core/` (motores puros), `src/ports/` + adaptadores, `src/app/` (rutas y acción), `src/components/` (formulario, resultado, landing), `tests/` | separación dictada por la frontera de confianza del plan §2 |
| Riesgo de revisión | **medio-alto** | el núcleo es aritmética con reglas comerciales donde un error cuesta dinero; la frontera de confianza es una propiedad de seguridad; 3 integraciones externas sin credenciales |
| Estrategia de entrega | **exception** (continuo, sin PR) | `constitution 18`: no hay git, así que no hay rama ni PR que dividir. La revisión ocurre sobre el árbol de trabajo, tarea a tarea, con `verify.sh` como puerta |

La ausencia de git convierte el presupuesto de revisión en un problema distinto: no se puede trocear
en PRs, así que la mitigación es el **orden** de §6 y que cada tarea traiga su done-check ejecutable.
Una tarea que no pasa su comprobación no avanza a la siguiente.
