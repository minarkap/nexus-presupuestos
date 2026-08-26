---
type: spec
title: Spec — Landing y estimador de presupuesto de Nexus
description: WHAT y WHY de la landing pública con formulario de 7 preguntas que entrega un rango orientativo, cualifica el lead y dispara dos emails.
tags: [sdd, spec, landing, formulario, estimacion, cualificacion]
timestamp: 2026-08-26T12:30:16Z
topic: sdd
slug: landing-presupuestos-nexus
status: clarified
---

# Spec — Landing y estimador de presupuesto de Nexus

> Slug: `landing-presupuestos-nexus` · Status: clarified · Created: 2026-08-26 · Clarified: 2026-08-26
> Inherits: **no hay constitución todavía** — este spec no hereda principios de proyecto.
> Las restricciones que normalmente vendrían de ahí se han tomado de
> [Voz de Nexus por Escrito](../../firma/Voz%20de%20Nexus%20por%20Escrito.md),
> [Método de Estimación Económica](../../comercial/Metodo%20de%20Estimacion%20Economica.md) y
> [Cualificación de Oportunidades](../../comercial/Cualificacion%20de%20Oportunidades.md),
> y quedan anotadas abajo.

---

## Problem & why

A Nexus le llegan muchas más peticiones por email de las que puede atender bien, y cualificarlas
consume tiempo del equipo comercial antes de saber si la oportunidad merece ese tiempo. Buena parte
de esas peticiones no encaja: no hay sponsor en dirección, no hay presupuesto asignado, o lo que el
cliente busca no está en el catálogo de la firma. Hoy eso se descubre **durante** la primera llamada,
que es el recurso más caro del embudo.

El coste de no resolverlo no es sólo tiempo perdido: es que las oportunidades buenas esperan detrás
de las malas. Y hay un coste de marca — el criterio declarado de la firma es no dar cifras antes de
entender el problema, pero hoy la primera conversación empieza sin ninguna información estructurada.

Lo que falta es un filtro **antes** de la primera llamada: un sitio donde el posible cliente se
explique, reciba algo de valor a cambio, y deje al equipo una ficha ya cualificada.

## Goals

- Un posible cliente entra, entiende en menos de un minuto quién es Nexus y qué hace, y sale con un
  **rango orientativo** de inversión para su caso, calculado desde el catálogo oficial 2026.
- El equipo comercial recibe, por cada envío, una ficha con contacto, respuestas completas, servicio
  aplicable, rango estimado, puntuación sobre 10 **y el desglose de esa puntuación**.
- Las oportunidades que superan el umbral de cualificación pueden agendar llamada con un socio en el
  mismo momento, sin esperar a que alguien les conteste.
- Las que no lo superan reciben igualmente su propuesta y su rango, con un camino abierto para
  responder. **A nadie se le rechaza**; lo que cambia es cómo se le atiende.
- El lead **siempre ve su resultado en pantalla**, aunque falle todo lo demás. El registro de
  respaldo es un segundo intento *best-effort*, no una garantía: si fallan a la vez el correo y el
  registro, ese envío se pierde, y es un **riesgo aceptado por decisión expresa** (C-01).
- Ninguna cifra entregada queda fuera del rango oficial de su servicio, en ninguna combinación de
  respuestas.
- Los multiplicadores, la tabla de puntos y el umbral **no son visibles ni deducibles** desde el
  navegador del visitante.

## Non-goals / out of scope

- **Aviso de privacidad y consentimiento.** Decisión explícita del usuario: fuera de esta primera
  versión, se añade **antes de publicar**. Ver *Points to clarify* — es un bloqueo de publicación, no
  un olvido, y mientras no exista el formulario no puede estar accesible en abierto.
- **Panel interno, CRM o histórico consultable.** El destino del lead son dos emails más un registro
  de respaldo. No hay pantalla de administración.
- **Segunda versión en otro idioma.** Sólo español.
- **Descuentos, precios cerrados, promesas de plazo de entrega.** Prohibidos por el método de
  estimación; no existen ni como caso límite.
- **Estimar servicios fuera del catálogo 2026, o aproximar uno por semejanza a otro.** La línea de
  Estrategia y operaciones no recibe cifra, y no se le calcula ninguna "parecida".
- **Mostrar al lead su puntuación**, el umbral, o cualquier señal de que ha sido puntuado. Es
  información interna.
- **Pago, contratación o firma en línea.** El siguiente paso es siempre una conversación humana.
- **Blog, casos de éxito, área de cliente, buscador.** La landing es una sola página de captación.

- **Cualquier garantía de durabilidad del lead** — cola de reintentos, almacén propio, alerta por
  doble fallo. Decidido en clarify (C-01): se asume la pérdida.

- **Cualquier protección anti-spam.** Ni visible ni invisible. Decidido en clarify (C-04): entra
  todo y el equipo lo separa a mano.

- **Cualquier restricción sobre dónde viven los datos personales.** Decidido en clarify (C-02): los
  proveedores se eligen por comodidad, sin requisito de residencia en la UE.

## Users & context

**El posible cliente.** Alguien con responsabilidad en una organización —dirección general, dirección
de transformación, TI, sostenibilidad o seguridad— que tiene un reto concreto y quiere saber, antes
de exponerse a una llamada comercial, dos cosas: si Nexus es la firma adecuada y en qué orden de
magnitud se mueve la inversión. Llega probablemente desde una recomendación, un contacto o una
búsqueda. No quiere rellenar un formulario largo y desconfía por defecto de las webs que prometen
resultados. Puede estar explorando sin presupuesto todavía, y eso también es información útil.

**El equipo comercial de Nexus.** Recibe hoy peticiones sin estructura y las cualifica a mano. Lo que
necesita es que, al abrir un aviso, pueda decidir en treinta segundos si esa oportunidad merece una
llamada de dirección — y poder **discutir** esa decisión, que es la razón de que el desglose de la
puntuación sea obligatorio y no un extra.

**El socio que atiende la llamada.** Sólo aparece al final, y sólo para los leads cualificados. Su
tiempo es el recurso que todo este sistema protege.

## Behaviour

### La landing

- Presenta quién es Nexus, su posicionamiento y sus cuatro líneas de servicio, con la voz de la firma:
  directa, ejecutiva, sin relleno corporativo.
- El gancho es **demostrar que se entiende el problema**, nunca una promesa de resultado. No hay
  titulares del tipo "multiplica tu ROI", ni urgencia fabricada, ni descuentos, ni plazos prometidos.
- Una única llamada a la acción principal, que abre el formulario.
- El diseño visual **se propone de cero** (decisión del usuario), sin heredar la identidad de los
  documentos internos de la firma. Las reglas de tono del copy sí son vinculantes.

### El formulario

- **Una pregunta por pantalla**, con avance y retroceso. El lead puede volver atrás y cambiar una
  respuesta sin perder lo ya respondido.
- Se ve en todo momento por dónde va y cuánto queda.
- Ninguna pregunta de negocio es opcional: cada una alimenta al menos uno de los dos cálculos.
- Secuencia:

  | # | Pregunta | Para qué |
  |---|----------|----------|
  | 1 | Reto declarado — IA y transformación digital · Ciberseguridad · Sostenibilidad y ESG · Estrategia y operaciones | Elige la línea |
  | 2 | Qué necesita — diagnóstico · implantación · acompañamiento continuo · desarrollo a medida | Elige el servicio. **Sólo se muestra si el reto es IA**; en las otras líneas se salta |
  | 3 | Tamaño de la organización | Estimación **y** puntuación |
  | 4 | Madurez en datos e IA | Estimación **y** puntuación |
  | 5 | Plazo de arranque | Estimación **y** puntuación |
  | 6 | Sponsor en dirección | Puntuación |
  | 7 | Presupuesto | Puntuación |
  | 8 | Contacto — nombre, email y empresa | Los dos emails |

- Son **siete preguntas de negocio más el contacto** en la línea de IA, y seis más el contacto en las
  otras tres.

- El contacto va **al final, antes de ver el resultado**. Es lo único que hace posible enviar la
  propuesta, y evita que la estimación se consuma sin dejar rastro.

#### Redacción de las opciones (cerrada en clarify)

Los tramos heredados del catálogo se solapaban —250 empleados caía a la vez en «50 – 250» y en
«250 – 1.000», y 6 meses en «3 – 6» y en «más de 6»—, así que el mismo lead podía puntuar distinto
según quién implementara. Las opciones que ve el lead se redactan **sin solape posible** (C-03).
Los factores y puntos de la derecha son internos y no viajan al navegador (CA-06, CA-14):

| Pregunta | Opción que ve el lead | Factor | Puntos |
|---|---|---|---|
| 3 · Tamaño | Menos de 50 | × 0,80 | 0 |
| | De 50 a 249 | × 0,90 | 0 |
| | De 250 a 999 | × 1,05 | +1 |
| | 1.000 o más | × 1,25 | +1 |
| 5 · Plazo de arranque | Menos de 3 meses | × 1,15 | **−1** |
| | De 3 a 6 meses | × 1,00 | +2 |
| | Más de 6 meses | × 0,95 | +1 |
| 6 · Sponsor en dirección | Sí: hay una persona del comité de dirección que ya conoce este proyecto y lo respalda | — | +3 |
| | En proceso: hay interés interno, pero todavía nadie de dirección lo ha hecho suyo | — | +1 |
| | Todavía no: no se ha hablado de esto con dirección | — | 0 |

La redacción del sponsor (C-05) convierte el escalón de +3 a +1 en un **hecho comprobable** —¿hay
alguien concreto?— en lugar de una impresión. Era el motor más pesado del sistema, 3 de 10 puntos,
midiendo algo distinto en cada envío.

Las opciones de la pregunta 4 (madurez: *inicial · en desarrollo · avanzada*) ya venían sin solape
del método de estimación y no se tocan.

### El cálculo

Dos motores independientes leen las mismas respuestas. Ambos se ejecutan **fuera del alcance del
navegador del visitante**: los factores, la tabla de puntos y el umbral son información comercial
interna y no pueden viajar al cliente en ninguna forma.

**Motor 1 — el rango.** Cuatro pasos deterministas, sin juicio humano:
1. Punto de partida: el punto medio del rango oficial del servicio. En rango abierto, el mínimo.
2. Factores acumulativos por tamaño, madurez y plazo — como mucho uno de cada bloque.
3. Anclaje: si la cifra se sale del rango oficial, se corrige al límite más cercano.
4. Margen de ±12 %, ambos extremos al millar más cercano, y **se vuelve a anclar** al rango oficial.

El anclaje ocurre **dos veces**. Un rango entregado que se salga del oficial es un fallo, no una
tolerancia.

**Motor 2 — la puntuación.** Suma sobre 10 a partir de sponsor, presupuesto, plazo, madurez y tamaño.
La urgencia (arranque en menos de 3 meses) **resta** un punto, a propósito: encarece la estimación y
baja la puntuación a la vez. Es deliberado y no se "arregla".

**El umbral vive en un único punto de configuración.** Su dueño ha avisado por escrito de que va a
cambiarlo. Cambiarlo debe ser tocar un valor, no buscar por el sistema. Los rangos y los factores
viven igual, y llevan **fecha de caducidad: 31-12-2026**.

### Las tres salidas

| Caso | Pantalla final | Email al cliente |
|------|----------------|------------------|
| **Cualificado** (≥ umbral) y servicio catalogado | Rango orientativo + advertencia de que es orientativo y sujeto a alcance + calendario de citas para agendar con un socio | Propuesta, rango y confirmación de la cita |
| **No cualificado** (< umbral) y servicio catalogado | Rango orientativo + advertencia + aviso de que le enviamos la propuesta. **Sin calendario** | Propuesta y rango, con invitación a responder si quiere avanzar |
| **Estrategia y operaciones** (sin catalogar) | **Sin cifra.** Explicación honesta de por qué no damos número antes de entender el alcance. Si además supera el umbral, **ve el calendario igualmente** | Explicación de por qué no hay número aún, e invitación a la llamada de alcance |

La tercera rama se puntúa como cualquier otra: un lead con sponsor y presupuesto sigue siendo un lead
excelente aunque su línea no tenga tarifa. Lo que no tiene es cifra.

**La llamada de alcance, definida (C-06).** Treinta minutos, sin coste, con el objetivo de ver si hay
**encaje mutuo** — no de entregar análisis. El lead no sale con un informe ni con una cifra: sale
sabiendo si Nexus es la firma adecuada para su reto y qué haría falta para acotarlo. Es el destino de
la rama sin catalogar y también el techo de los rangos abiertos («a confirmar en llamada de alcance»).
La landing y los correos pueden por tanto nombrarla con duración y propósito concretos, en lugar de
ofrecer «una conversación» sin forma.

**El calendario es una página de citas compartida del equipo (C-07)**, no la agenda de un socio
concreto: el lead cualificado coge el primer hueco libre de quien esté disponible. Se evita que una
agenda llena corte la conversión justo en el punto de máxima intención, a cambio de que el lead no
sepa de antemano con quién hablará.

Particularidades que la pantalla debe respetar:
- **AI Executive Advisory** se expresa siempre como cuota **mensual**, no como importe total.
- **Custom AI Solutions** tiene rango abierto por arriba: se muestra el extremo inferior y el superior
  se sustituye por «a confirmar en llamada de alcance».

### Los dos emails

- **Al cliente**, con su propuesta. Escrita con la estructura de la casa —tesis, problema, enfoque,
  diferenciación, resultado esperado, siguiente paso— **sin etiquetar las secciones**: debe leerse
  como un texto natural y bien escrito, no como una plantilla rellenada.
- **A oportunidades@nexus-st.com**, con contacto, respuestas completas, servicio aplicable, rango
  estimado, puntuación **y el desglose de dónde sale cada punto**. Un aviso que sólo diga "5 puntos"
  es inservible.

### Registro de respaldo

Cada envío queda registrado en un sitio que el equipo pueda consultar sin ser técnico, además de los
emails. Es un **segundo intento, no una red de seguridad**: si falla el correo, lo normal es que el
lead siga existiendo aquí; si fallan los dos a la vez, se pierde (C-01).

### Caminos de error y borde

- **El envío de email falla.** El lead **ve igualmente su resultado en pantalla** — su experiencia no
  depende de que el correo salga. El registro de respaldo guarda el lead, y el fallo se hace visible
  para el equipo en lugar de morir en silencio.
- **El lead abandona a media pregunta.** No se envía nada. Sin contacto no hay lead.
- **El lead vuelve atrás y cambia el reto declarado** de IA a otra línea: la pregunta 2 desaparece y
  su respuesta anterior deja de contar. Si vuelve a IA, se le vuelve a preguntar.
- **Envío repetido del mismo formulario** (doble clic, recarga): el lead recibe un resultado, no dos
  correos idénticos.
- **Formulario público = bots y spam.** El sistema **no filtra nada** (C-04): todo envío llega a
  oportunidades@nexus-st.com y el equipo lo separa a mano. Coherente con el volumen bajo esperado
  (C-08). **Riesgo aceptado y escrito:** cada envío de bot dispara también un correo a la dirección
  que haya declarado, que puede no existir; mandar correo a direcciones inventadas es la vía más
  rápida a que el dominio de envío de Nexus quede marcado como spam, y entonces dejan de llegar
  también los correos legítimos. Si el volumen sube de decenas a cientos al mes, esta decisión debe
  revisarse **antes** de que el daño de reputación sea visible.
- **Contacto mal formado o email inválido**: se avisa en el momento, en la misma pantalla, sin perder
  las respuestas ya dadas.
- **El lead nunca ve**: su puntuación, el umbral, los multiplicadores, ni ninguna pista de que existe
  una clasificación detrás.

## Acceptance criteria

**Del cálculo del rango**

- **CA-01** — Dado el caso de referencia del catálogo (600 empleados, madurez inicial, arranque en 4 meses,
  diagnóstico de IA), cuando se completa el formulario, entonces el rango mostrado es exactamente
  **28.000 – 35.000 €**.
- **CA-02** — Dada cualquier combinación posible de las respuestas 1 a 5, cuando se calcula el rango, entonces
  ambos extremos quedan **dentro del rango oficial** del servicio aplicable.
- **CA-03** — Dado un servicio de rango abierto (Custom AI Solutions), cuando se muestra el resultado, entonces
  se muestra el extremo inferior y el superior aparece como «a confirmar en llamada de alcance», y
  **no** como una cifra.
- **CA-04** — Dado el servicio AI Executive Advisory, cuando se muestra el resultado, entonces la cifra se
  presenta como cuota **mensual**.
- **CA-05** — Dado cualquier resultado con cifra, cuando se muestra en pantalla y en el email, entonces aparece
  la advertencia de que es **orientativo y sujeto a alcance**.
- **CA-06** — Dado cualquier resultado, cuando se inspecciona lo que el navegador ha recibido, entonces **no
  aparece** ningún multiplicador, ninguna tabla de puntos ni el umbral.

**De la elección de servicio**

- **CA-07** — Dado el reto «IA y transformación digital», cuando se responde la pregunta 1, entonces se muestra la
  pregunta 2 (qué necesita).
- **CA-08** — Dado cualquier otro reto, cuando se responde la pregunta 1, entonces la pregunta 2 **no** se
  muestra.
- **CA-09** — Dado el reto «Estrategia y operaciones», cuando se completa el formulario, entonces la pantalla
  final **no contiene ninguna cifra en euros**.

**De la cualificación y las tres salidas**

- **CA-10** — Dado un lead con sponsor identificado y comprometido (+3), presupuesto asignado (+3) y arranque
  entre 3 y 6 meses (+2), cuando se completa el formulario, entonces la puntuación es 8 y la pantalla
  final incluye el calendario de citas.
- **CA-11** — Dado un lead sin sponsor (0), sin presupuesto (0) y con arranque en menos de 3 meses (−1), cuando se
  completa el formulario, entonces la pantalla final **no** incluye calendario y sí incluye el aviso
  de que se le envía la propuesta.
- **CA-12** — Dado un lead de Estrategia y operaciones que supera el umbral, cuando se completa el formulario,
  entonces ve el calendario **y** ninguna cifra.
- **CA-13** — Dado que se cambia el valor del umbral en su punto de configuración, cuando un lead con esa
  puntuación completa el formulario, entonces la rama que ve cambia en consecuencia, **sin tocar
  ninguna otra parte del sistema**.
- **CA-14** — Dado cualquier lead, cuando ve su pantalla final, entonces **no** aparece su puntuación ni el
  umbral.

**De los emails y el registro**

- **CA-15** — Dado un envío completado, cuando el sistema termina, entonces se han emitido **dos** correos: uno a
  la dirección del lead y otro a oportunidades@nexus-st.com.
- **CA-16** — Dado el aviso interno, cuando se abre, entonces contiene contacto, las respuestas completas, el
  servicio aplicable, el rango estimado, la puntuación total y **una línea por cada señal que aporta
  o resta puntos**.
- **CA-17** — Dado un fallo en el envío de correo, cuando el lead ha completado el formulario, entonces el lead
  **ve igualmente su pantalla final** y el sistema intenta igualmente escribir en el registro de
  respaldo. El registro es *best-effort*: **no** se exige que el lead sobreviva a un fallo simultáneo
  de correo y registro (C-01).
- **CA-18** — Dado el mismo formulario enviado dos veces seguidas por recarga o doble clic, cuando se procesa,
  entonces el lead **no** recibe dos correos idénticos.

**Del tono**

- **CA-19** — Dado cualquier texto de la landing, del formulario o de los dos correos, cuando se revisa contra
  una **lista de comprobación de tono escrita, antes de publicar**, entonces **no** contiene promesas
  de resultado, urgencia fabricada, descuentos, precios cerrados ni plazos de entrega concretos. Es
  una revisión humana con acta —quién la pasó y cuándo—, no una prueba automática: sin ese registro
  el criterio no está verificado. *(Añadido en clarify: antes era un criterio que nadie podía
  ejecutar.)*
- **CA-20** — Dado el correo de propuesta al cliente, cuando se lee, entonces **no lleva las secciones
  etiquetadas** y se lee como un texto continuo.

**De los bordes de los tramos** *(añadidos en clarify — C-03)*

- **CA-21** — Dada una organización de **exactamente 250 empleados**, cuando se calcula, entonces cae en el
  tramo «De 250 a 999»: factor × 1,05 y +1 punto. No existe ninguna otra lectura posible.
- **CA-22** — Dado un arranque a **exactamente 6 meses**, cuando se calcula, entonces cae en el tramo «De 3 a 6
  meses»: factor × 1,00 y +2 puntos.
- **CA-23** — Dadas las opciones que se le muestran al lead en las preguntas 3, 5 y 6, cuando se leen, entonces
  ningún valor pertenece a dos opciones a la vez.

**De la llamada de alcance** *(añadido en clarify — C-06)*

- **CA-24** — Dada la pantalla final de la rama sin catalogar, o el extremo superior de un rango abierto, cuando
  se lee, entonces la llamada se nombra con su **duración y su propósito** (30 minutos, ver si hay
  encaje), y **no** se promete análisis, informe ni cifra en ella.

## Points to clarify

> Pasada de `clarify` del 2026-08-26. **Cada punto del handoff anterior tiene aquí su desenlace
> declarado** — preguntado, validado, dejado en diferido o superado. Ninguno se ha dejado caer en
> silencio. Las decisiones nuevas viven abajo, en [Clarifications](#clarifications).

### Desenlace de los puntos heredados

| Punto original | Tipo | Desenlace |
|---|---|---|
| Aviso de privacidad y consentimiento | decisión diferida | **Sigue diferida.** No se reabre. Ver nota abajo: C-02 la encarece. |
| Calendario de citas de Google incrustado | suposición tomada | **Validada y afilada** → C-07 (página compartida del equipo). |
| Registro de respaldo en hoja de cálculo Google | suposición tomada | **Se mantiene.** C-02 retira la única objeción posible; C-01 le baja el estatus a *best-effort*. |
| Contacto al final del formulario | suposición tomada | **Se mantiene**, sin objeción del usuario en esta pasada. |
| Diseño visual de cero | suposición tomada | **Se mantiene.** Resuelta internamente: decisión informada ya registrada en `S-0003`, no se re-pregunta. |
| Anti-spam sin prueba visual | suposición tomada | **Superada** por C-04: ya no hay anti-spam de ningún tipo. |
| ¿Qué cuenta como sponsor comprometido? | pregunta abierta | **Resuelta** → C-05. |
| ¿En qué consiste la llamada de alcance? | pregunta abierta | **Resuelta** → C-06. |
| ¿Qué volumen se espera? | pregunta abierta | **Resuelta** → C-08. |
| Lead que vuelve tras haber hablado con comercial | área no formulable | **Sigue sin formular.** Ver abajo. |
| Cómo envejece el catálogo tras el 31-12-2026 | área no formulable | **Sigue sin formular.** Ver abajo. |

### Lo que sigue abierto tras esta pasada

- **decisión diferida** — **Aviso de privacidad y consentimiento.** Sin cambios en su estatus: sigue
  siendo **requisito previo a publicar**, no a construir. Lo que sí cambia es su coste: al elegir
  C-02 (residencia indiferente), los datos personales pueden acabar en proveedores fuera de la UE, y
  entonces el aviso tendrá que declarar esas transferencias y apoyarlas en garantías. Es más papel
  del que habría hecho falta con la opción europea. Sigue sin bloquear el desarrollo.

- **decisión diferida** — **Cuánto tiempo se guardan los leads en el registro de respaldo.** Abierta
  en esta pasada. No la invento: va atada a la decisión de privacidad de arriba y se cierra con ella.
  Mientras tanto, nada se borra.

- **suposición tomada** — **La cita que reserva el lead cualificado dura también 30 minutos.**
  *Base:* C-06 fija la llamada de alcance en 30 minutos y C-07 hace que todas las reservas salgan de
  una única página compartida; dos duraciones distintas obligarían a dos tipos de cita y a decidir
  cuál ve cada rama. *Riesgo:* si el equipo considera que un lead cualificado de servicio catalogado
  merece más tiempo que un encaje de 30 minutos, esto se separa en dos tipos de cita — cambia la
  configuración del calendario, no el comportamiento del producto.

- **pregunta abierta** — **Quién pasa la lista de comprobación de tono (CA-19) y en qué momento.**
  Nueva en esta pasada: al hacer el criterio verificable apareció que no tiene dueño. No bloquea
  planificar ni construir; sí bloquea publicar, porque sin acta el criterio no está cumplido.

- **pendiente de `constitution`** — **Accesibilidad, rendimiento y estándares de calidad.** El spec
  no dice nada de ellos y **no es su sitio**: son principios de proyecto, no comportamiento de esta
  funcionalidad. Este spec se escribió sin constitución y por eso quedaron huérfanos. Su casa es la
  fase `constitution`, que todavía no se ha ejecutado.

- **área no formulable** — **Qué pasa con un lead cuando el equipo ya ha hablado con él.** Sin
  cambios: no hay histórico ni estado, y el mismo contacto volviendo dentro de un mes se trata como
  nuevo. C-01 la aleja aún más — sin almacén duradero no hay memoria posible del embudo. Se sigue
  intuyendo una pregunta ahí y sigue sin poder enunciarse con precisión.

- **área no formulable** — **Cómo envejece el catálogo.** Sin cambios: los rangos caducan el
  31-12-2026 y nadie ha dicho qué debe pasar el 1 de enero.

## Clarifications

> Log de la pasada de `clarify`. Cada entrada: qué se preguntó, qué se decidió y **por qué**, para que
> el razonamiento sobreviva y no sólo el resultado.

**C-01 — Un lead puede perderse, y se acepta.** *Pregunta:* si fallan a la vez el correo y el
registro, ese lead desaparece; ¿cuánto vale evitarlo? *Opciones:* cero pérdida con almacén propio ·
dos vías independientes con aviso · asumir el riesgo. *Decisión:* **asumir el riesgo**, elección del
usuario sobre la recomendación contraria. *Por qué:* con volumen bajo (C-08) el coste esperado de un
lead perdido es menor que la complejidad de garantizar que no ocurra. *Consecuencia:* se elimina el
objetivo «ningún lead se pierde por un fallo técnico», CA-17 se relaja a *best-effort* y la
durabilidad entra en *Non-goals*.

**C-02 — Sin restricción de residencia de los datos.** *Pregunta:* ¿dónde pueden vivir los datos
personales de los leads? *Opciones:* todo en la UE · UE preferente con garantías · indiferente.
*Decisión:* **indiferente**, contra la recomendación de exigir UE. *Por qué:* elección del usuario;
prioriza comodidad y velocidad de montaje. *Consecuencias:* se mantienen las suposiciones de Google
Calendar y hoja de cálculo Google sin objeción; el proveedor de email queda libre para la fase de
plan; y el aviso de privacidad diferido tendrá que cubrir transferencias internacionales. *Riesgo
declarado, no re-litigado:* Nexus vende cumplimiento NIS2 y DORA, y su propio formulario no aplicará
el criterio que vende.

**C-03 — Los tramos del formulario se reescriben sin solape.** *Pregunta:* «50 – 250» y «250 – 1.000»
contienen ambos el 250; «3 – 6» y «más de 6» contienen ambos el 6. *Decisión:* **reescribir las
opciones que ve el lead** («De 50 a 249», «De 250 a 999», «1.000 o más»; «Menos de 3 meses», «De 3 a
6 meses», «Más de 6 meses»). *Por qué:* elimina la ambigüedad en los dos extremos a la vez —para el
lead que no sabe qué marcar y para quien implemente— sin tocar ni un multiplicador ni un punto. El
caso de referencia del catálogo (600 empleados, 4 meses) sigue dando 28.000 – 35.000 €, así que CA-01
no se mueve. *Consecuencia:* nuevos CA-21, CA-22 y CA-23 que fijan los bordes.

**C-04 — No hay anti-spam.** *Pregunta:* ¿qué pasa cuando el sistema sospecha que un envío es un bot?
*Opciones:* marcar sin bloquear · descartar en silencio · no filtrar. *Decisión:* **no filtrar**;
todo llega a oportunidades@nexus-st.com y el equipo separa a mano. *Por qué:* elección del usuario;
cero falsos positivos y cero trabajo de construcción, sostenible con volumen bajo. *Consecuencia:* se
elimina el comportamiento anti-spam del spec. *Riesgo aceptado, surgido después de decidir y
registrado igualmente:* cada envío de bot dispara un correo a una dirección posiblemente inventada,
lo que degrada la reputación del dominio de envío y puede acabar bloqueando también el correo
legítimo. **Condición de revisión:** si el volumen pasa de decenas a cientos al mes, esta decisión se
reabre.

**C-05 — Redacción del sponsor.** *Pregunta:* ¿qué distingue «identificado y comprometido» (+3) de
«en proceso de identificar» (+1)? *Decisión:* la redacción propuesta —«Sí: hay una persona del comité
de dirección que ya conoce este proyecto y lo respalda» / «En proceso: hay interés interno, pero
todavía nadie de dirección lo ha hecho suyo» / «Todavía no: no se ha hablado de esto con dirección».
*Por qué:* convierte el escalón más pesado del sistema (3 de 10 puntos) en un hecho comprobable en
vez de una autoevaluación de intensidad. Sin esto, el motor de puntuación medía algo distinto en cada
envío.

**C-06 — La llamada de alcance son 30 minutos de encaje.** *Pregunta:* ¿en qué consiste la llamada
que se ofrece a la rama sin catalogar y como techo de los rangos abiertos? *Opciones:* 45 min con
socio y entrega de encuadre · 30 min de encaje · no concretarla. *Decisión:* **30 minutos, sin coste,
para ver si hay encaje mutuo; no se entrega análisis, informe ni cifra.** *Por qué:* protege el
recurso que todo el sistema existe para proteger —el tiempo del socio— y evita prometer en la landing
un entregable que después habría que producir gratis. *Consecuencia:* nuevo CA-24; la landing y los
correos pueden nombrarla con forma concreta.

**C-07 — Calendario compartido del equipo.** *Pregunta:* ¿de quién es la agenda que ve el lead
cualificado? *Decisión:* **página de citas compartida**, no la de un socio concreto. *Por qué:* una
agenda individual llena corta la conversión justo en el punto de máxima intención. *Coste aceptado:*
el lead no sabe de antemano con quién hablará.

**C-08 — Volumen esperado: bajo.** *Decisión:* del orden de **decenas de envíos al mes**. *Por qué:*
coherente con una firma de consultoría de dirección. *Consecuencia:* es la premisa que sostiene C-01
y C-04. Si se rompe, esas dos decisiones se reabren — no son independientes de ella.

## Revisions

- **2026-08-26** — Versión inicial. Escrita a partir del dossier de la firma ya ingerido en
  `02-DOCS/wiki/` (identidad, criterio, voz, catálogo 2026, método de estimación, cualificación) más
  dos rondas de preguntas al usuario que cerraron: calendario (Google Calendar), tratamiento de la
  rama sin catalogar (se puntúa y puede ver calendario), identidad visual (de cero), respaldo del lead
  (email + registro), idioma (sólo español), datos de contacto (nombre, email, empresa) y privacidad
  (diferida a antes de publicar).

- **2026-08-26** — Pasada de `clarify`. Ocho decisiones (C-01…C-08) bajadas al cuerpo del spec. Tres
  de ellas cambian el alcance, no sólo lo precisan: se elimina la garantía de que ningún lead se
  pierda (C-01), se elimina la protección anti-spam (C-04) y se retira toda restricción sobre dónde
  viven los datos personales (C-02) — las tres por elección expresa del usuario y contra la
  recomendación en los tres casos, con sus riesgos escritos. Además: opciones de formulario
  reescritas sin solape (C-03), redacción del sponsor cerrada (C-05), llamada de alcance definida
  (C-06), calendario compartido (C-07) y volumen fijado en decenas al mes (C-08), premisa de la que
  dependen C-01 y C-04. Nuevos CA-21 a CA-24; CA-17 y CA-19 reescritos. Status: `draft` → `clarified`.
