---
type: decision
title: SDD Decisions Log
description: Registro append-only de las decisiones de alcance y diseño tomadas dentro del chain SDD.
tags: [sdd, decisiones, append-only]
timestamp: 2026-08-26T12:30:16Z
topic: sdd
status: stable
---

# SDD Decisions Log (append-only)

> Log canónico del chain SDD, compartido por `constitution`, `specify` y `plan`.
> Distinto del log del arnés en [harness/decisions.md](../harness/decisions.md).

---
## S-0001 — Alcance del primer spec: una sola pieza, no tres
- date: 2026-08-26
- fase: specify
- context: La petición contenía landing + formulario + estimador + cualificación + dos emails. Había
  que decidir si eso son varios specs independientes o uno.
- decision: **un único spec** — `landing-presupuestos-nexus`.
- why: no son subsistemas independientes; comparten un mismo recorrido de usuario y el formulario no
  tiene sentido sin la landing ni los emails sin el cálculo. Trocearlo habría creado tres contratos
  que sólo se pueden verificar juntos.
- supersedes: none

---
## S-0002 — La rama sin catalogar también se puntúa y puede ver calendario
- date: 2026-08-26
- fase: specify
- context: El dossier define la rama de «Estrategia y operaciones» como *sin cifra, llamada de
  alcance*, pero no dice si esos leads se puntúan ni si ven calendario. Era el único hueco funcional
  con consecuencias comerciales reales.
- options considered:
  1. Se puntúa igual; si supera el umbral, ve calendario (sin cifra).
  2. Nunca calendario en esa rama.
  3. Sin calendario, pero comercial recibe la puntuación y decide a mano.
- decision: opción 1.
- why: elección del usuario sobre recomendación. El dossier dice que no se da un número sin entender
  el problema — no dice que no se dé una llamada. Un lead con sponsor y presupuesto es exactamente el
  cliente ideal descrito en `Criterio de Decisión de la Firma`, tenga tarifa su línea o no.
- supersedes: none

---
## S-0003 — La landing no hereda la identidad visual de los documentos de la firma
- date: 2026-08-26
- fase: specify
- context: Al abrir `Estimacion-Economica.pdf` se confirmó que la firma sí tiene identidad visual
  (titulares en serif, azul marino profundo, filete cobre, mucho blanco), lo que contradecía el
  supuesto de partida «no hay marca que respetar» del user-profile. Se le presentó al usuario.
- options considered:
  1. Heredarla entera — coherencia con lo que el lead recibirá después.
  2. Heredar colores con tipografía más moderna.
  3. Diseño de cero, propuesta libre.
- decision: opción 3, diseño de cero.
- why: decisión explícita del usuario, mantenida **después** de conocer la identidad existente. No es
  desconocimiento: es una elección informada.
- consecuencia asumida: un lead verá una estética en la landing y otra distinta en el PDF de
  propuesta. Las reglas de tono siguen siendo vinculantes en ambas superficies.
- supersedes: none

---
## S-0004 — Privacidad diferida a antes de publicar
- date: 2026-08-26
- fase: specify
- context: El formulario recoge datos personales de posibles clientes. Se ofreció redactar el aviso de
  privacidad y la casilla de consentimiento dentro de esta primera versión.
- decision: **fuera de esta versión**, requisito previo a publicar.
- why: decisión explícita del usuario tras exponerle el riesgo.
- consecuencia asumida: la landing no puede estar accesible en abierto mientras no exista el aviso.
  Registrado como `decisión diferida` en el spec, con su condición de salida escrita, para que
  `clarify` no lo trate como pregunta ni `implement` lo dé por resuelto.
- supersedes: none

---
## S-0005 — El contacto se pide antes de mostrar el resultado
- date: 2026-08-26
- fase: specify
- context: El orden entre «pedir contacto» y «mostrar el rango» decide si un lead puede consumir la
  estimación sin dejar rastro. El dossier no lo dice; exige los dos emails, que lo implican.
- decision: contacto como última pregunta, resultado después.
- why: es la única secuencia compatible con enviar propuesta al cliente y aviso interno. Registrado
  como suposición tomada en el spec, con el riesgo de abandono anotado.
- supersedes: none

---
## S-0006 — Se acepta perder leads: sin garantía de durabilidad
- date: 2026-08-26
- fase: clarify
- context: El spec sostenía a la vez el objetivo «ningún lead se pierde por un fallo técnico» y el
  no-objetivo «sin base de datos». Si fallan el correo y el registro de respaldo a la vez, no hay
  ningún sitio donde ese envío haya quedado escrito. Los dos no podían convivir.
- options considered:
  1. Cero pérdida: registro propio duradero, se escribe antes de nada y se reintenta desde ahí.
  2. Dos vías independientes más aviso al equipo si ambas fallan.
  3. Asumir el riesgo y eliminar el objetivo.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Con volumen bajo (C-08 del spec) el coste
  esperado de un lead perdido se considera menor que la complejidad de garantizar que no ocurra.
- consecuencia asumida: se elimina un objetivo del spec, CA-17 baja a *best-effort* y el registro de
  respaldo deja de ser una red de seguridad. Sin almacén duradero tampoco hay memoria posible del
  embudo, lo que aleja aún más el área no formulable del lead que repite.
- supersedes: none

---
## S-0007 — No hay anti-spam, y el buzón se limpia a mano
- date: 2026-08-26
- fase: clarify
- context: El spec describía una defensa anti-bot invisible pero no le había asignado ningún criterio
  de aceptación, y no decía qué pasa con un envío sospechoso.
- options considered:
  1. Marcar sin bloquear: se procesa, el aviso interno llega marcado, no sale correo al cliente.
  2. Descartar en silencio.
  3. No filtrar: entra todo y el equipo separa a mano.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Cero falsos positivos y cero trabajo
  de construcción, sostenible mientras el volumen sea de decenas al mes.
- consecuencia asumida: cada envío de bot dispara también un correo a la dirección declarada, que
  puede no existir. Mandar correo a direcciones inventadas degrada la reputación del dominio de
  envío de Nexus y puede acabar bloqueando el correo legítimo. **Condición de revisión escrita:** si
  el volumen pasa a cientos al mes, la decisión se reabre antes de que el daño sea visible.
- supersedes: la suposición del spec «protección anti-spam sin prueba visual».

---
## S-0008 — Sin restricción de residencia de los datos personales
- date: 2026-08-26
- fase: clarify
- context: Se recogen nombre, email y empresa de directivos. Nadie había fijado si esos datos pueden
  salir de la UE, y de ello dependían el proveedor de email y el destino del registro de respaldo.
- options considered:
  1. Todo en la UE como requisito duro.
  2. UE preferente, se aceptan proveedores US con garantías (SCC / Data Privacy Framework).
  3. Indiferente: se elige por comodidad.
- decision: opción 3.
- why: elección del usuario, contra la recomendación (opción 1). Prioriza velocidad de montaje.
- consecuencia asumida: se mantienen sin objeción Google Calendar y la hoja de cálculo de Google; el
  proveedor de email queda libre para la fase de plan; y el aviso de privacidad diferido tendrá que
  declarar transferencias internacionales y apoyarlas en garantías — más papel del que habría hecho
  falta con la opción europea. Queda escrito que Nexus vende cumplimiento NIS2 y DORA y que su propio
  formulario no aplicará ese criterio.
- supersedes: none

---
## S-0009 — Listón de pruebas: duro en el cálculo, normal en el resto
- date: 2026-08-26
- fase: constitution
- context: Había que fijar qué hace que una tarea esté terminada, porque es exactamente lo que la fase
  `verify` ejecutará. Sin esto, `verify` no tiene nada contra qué medir.
- options considered:
  1. Pruebas duras en los dos motores (TDD, cobertura alta, prueba exhaustiva de combinaciones) y
     pruebas normales en el resto.
  2. Pruebas sólo de los motores; formulario, correos y salidas a mano.
  3. Sin pruebas automáticas.
- decision: opción 1.
- why: elección del usuario, coincidente con la recomendación. El motor de precios es determinista y
  ya trae un caso de referencia con resultado exacto (28.000 – 35.000 €), así que es barato de probar
  y caro de equivocar: una cifra mal calculada sale por correo con el membrete de Nexus.
- consecuencia: principios 14 a 17 de la constitución. La prueba exhaustiva del principio 15 es
  posible porque el espacio de combinaciones de las respuestas 1 a 5 es finito y pequeño.
- supersedes: none

---
## S-0010 — Accesibilidad AA sólo en el recorrido del formulario
- date: 2026-08-26
- fase: constitution
- options considered:
  1. WCAG 2.2 AA en toda la landing (recomendada).
  2. AA sólo en el formulario; el resto sin suelo declarado.
  3. Sin suelo declarado en ninguna parte.
- decision: opción 2.
- why: elección del usuario. Cubre el recorrido donde de verdad se pierde gente —las ocho pantallas—
  con menos trabajo de revisión que auditar la página entera.
- consecuencia asumida: la parte de presentación de la landing puede no cumplir AA. Para una firma que
  vende cumplimiento normativo, si un cliente pregunta por accesibilidad la respuesta cubre el
  formulario y no la página. Principios 24 y 25.
- supersedes: none

---
## S-0011 — Sin presupuesto de rendimiento
- date: 2026-08-26
- fase: constitution
- options considered:
  1. Objetivos medibles de Core Web Vitals (recomendada).
  2. "Que vaya rápida", sin cifras.
  3. No es una prioridad.
- decision: opción 3.
- why: elección del usuario, contra la recomendación. Con volumen bajo (C-08) y visitas que llegan por
  recomendación, se prefiere invertir el esfuerzo en texto y diseño.
- consecuencia: principio 26, escrito **en positivo** para que ninguna fase posterior invente un
  objetivo: `verify` no debe comprobar Core Web Vitals. Es una ausencia decidida, no un olvido.
- supersedes: none

---
## S-0012 — Proveedor de correo transaccional: Resend
- date: 2026-08-26
- fase: plan
- context: Los dos correos son el embudo entero. Estaba pendiente desde `init` y la fase de plan es
  donde deja de poder aplazarse, porque define un puerto y su adaptador.
- options considered:
  1. **Resend** — API mínima, plantillas en React, plan gratuito de 3.000 correos/mes.
  2. **Postmark** — la mejor reputación de entrega del mercado en correo transaccional; más caro y sin
     plan gratuito real.
  3. **SendGrid** — el más veterano y el de configuración más pesada; su reputación compartida es peor.
- decision: Resend.
- why: con decenas de envíos al mes (C-08) el plan gratuito cubre el caso entero, y su API es la que
  menos código de adaptador exige en un proyecto Next.js. `S-0008` retiró la única restricción que
  habría cambiado la elección (residencia de datos). Postmark sería la elección correcta si la
  entregabilidad fuera crítica — y `S-0007` la ha vuelto frágil por otro camino, así que la ventaja
  de Postmark quedaría anulada de todos modos por enviar a direcciones de bots.
- consecuencia: se define `EmailPort` como interfaz y Resend queda detrás de un adaptador. Cambiar de
  proveedor es escribir otro adaptador, no tocar el flujo.
- supersedes: none

---
## S-0013 — Las respuestas de negocio se validan en servidor
- date: 2026-08-26
- fase: review
- context: La lectura adversaria posterior a `verify` probó a llamar a la acción de servidor con un
  tramo de tamaño inventado. Resultado: el multiplicador salía `undefined`, la aritmética daba `NaN`
  y el sistema devolvía **«NaN – NaN €»** en pantalla y enviaba un correo con el membrete de Nexus
  con esa cifra dentro. Las 144 pruebas existentes no lo veían porque todas usaban valores válidos
  del enum.
- por qué era posible: una acción de servidor de Next.js es un **endpoint HTTP público**. El
  formulario nunca produciría esa entrada, pero el formulario no es la única vía de entrada. Se
  estaba validando el contacto y no las respuestas.
- decision: `validateAnswers` comprueba las siete respuestas de negocio contra sus valores
  admisibles **antes de calcular nada**. Entrada no reconocida → error de validación, sin cálculo,
  sin correo y sin fila en el registro.
- why: el catálogo cerrado existe precisamente como «el mecanismo que impide que una cifra
  improvisada salga de la firma» (constitution 4, 5 · CA-02). Una cifra `NaN` es el caso extremo de
  cifra improvisada, y salía por correo firmado.
- consecuencia: 12 pruebas nuevas (`validation.test.ts`), incluida una que afirma que **ninguna**
  entrada inventada produce `NaN` en la respuesta. Total 156 pruebas, cobertura de `src/core/` sigue
  al 100 %.
- supersedes: none
