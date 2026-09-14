---
type: spec
title: Spec — El catálogo comercial vive en la base de datos
description: WHAT y WHY de sacar servicios, rangos, multiplicadores, tabla de puntos y umbral del código y ponerlos en la base de datos, para que cambiar un precio no exija publicar el sitio.
tags: [sdd, spec, catalogo, precios, configuracion]
timestamp: 2026-09-14T19:28:57Z
topic: sdd
slug: catalogo-en-supabase
status: approved
---

# Spec — El catálogo comercial vive en la base de datos

> Slug: `catalogo-en-supabase` · Status: **aprobada** por Jose el 2026-09-14, leída y confirmada
> explícitamente. Las fases posteriores (`clarify` → `ship`) corren **en autopilot** con ese mismo
> consentimiento. · Creada: 2026-09-14
> Inherits: [constitution](../constitution.md) — en particular los principios 4, 5, 7, 8, 9, 10, 15 y 16
> Depende de: [leads-en-supabase](./leads-en-supabase.md)
> Fuente comercial: [Catálogo de Servicios y Rangos 2026](../../comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md)

## Problem & why

El principio 10 de la constitución dice, literalmente: *«Rangos y factores son configuración con
fecha de caducidad (31-12-2026), no constantes en el código. Quien los cambie en 2027 no debe tocar
lógica.»*

Hoy están en el código. Los seis servicios con sus rangos oficiales, los multiplicadores de tamaño,
madurez y urgencia, la tabla de puntos y el umbral de cualificación viven todos en el mismo fichero
del núcleo de la aplicación. Cambiar un precio significa editar ese fichero, pasar las pruebas, y
**publicar una versión nueva del sitio**.

Eso convierte una decisión comercial en una tarea de desarrollo. El dueño del catálogo no es quien
publica la web, pero depende de él para cada cifra. El principio 10 describe una separación que
todavía no existe.

## Cost of not building it

Conviene ser exacto y no inflarlo: **esto no es un incendio, es una deuda con fecha**.

El catálogo cambia poco — es la edición 2026 y caduca el 31-12-2026. El coste concreto de no hacerlo
llega por tres sitios:

1. **Cada cambio de precio arrastra una publicación del sitio entero.** Un número distinto obliga a
   desplegar todo el código, con el riesgo que eso conlleva, para algo que no es código.
2. **En diciembre de 2026 entra el catálogo 2027.** Ese trabajo, que es comercial, caerá sobre quien
   mantiene la web, que no es quien decide los precios. Es el escenario exacto que el principio 10
   dice querer evitar, y llegará en cuestión de meses.
3. **Un principio escrito que nadie cumple erosiona los demás.** La constitución vale lo que valen
   sus principios ejecutados; uno que solo describe una intención rebaja el listón de los otros 35.

Lo que **no** cuesta: no hay ningún lead perdido, ninguna cifra equivocada, ningún riesgo de
seguridad abierto por dejarlo como está. Nada se rompe mañana.

## The cheapest alternative

**Dejar el catálogo donde está y escribir cómo se cambia.** Un documento de media página: qué fichero
se toca, qué pruebas hay que ver en verde, cómo se publica. Cambiar seis números una vez al año, con
una lista de pasos delante, no es una carga grande — y de paso esos seis números siguen pasando por
el linter, los tipos y las 230 pruebas antes de tocar producción.

No es suficiente por dos razones: sigue exigiendo un despliegue del sitio para un cambio que no es de
código, y deja el principio 10 formalmente incumplido, que era el motivo de fondo.

## Objeción planteada y decisión

Esta objeción se planteó antes de escribir la spec y **el dueño del proyecto decidió seguir
adelante**. Queda aquí para que mañana se sepa que se miró, no para reabrirla.

> **La objeción:** el catálogo lo leen ocho módulos del núcleo, entre ellos los dos motores de
> cálculo. Hoy esa lectura es inmediata y no puede fallar. Sacarla a la base de datos introduce una
> dependencia de red en el camino que produce la cifra que sale con el membrete de Nexus. Y, sin un
> panel de edición —descartado expresamente—, cambiar un precio sigue siendo una edición manual:
> SQL en vez de un fichero, con menos red de seguridad debajo.

La decisión de seguir se apoya en el principio 10 y en evitar que la edición 2027 dependa de un
despliegue. La consecuencia que la objeción señalaba —la desaparición de la red de seguridad— se
recoge dentro de esta misma spec, con validación en la escritura y vigilancia del caso de referencia,
en vez de dejarse sin respuesta.

## Goals

- El catálogo comercial completo —servicios y rangos oficiales, multiplicadores de tamaño, madurez y
  urgencia, tabla de puntos y umbral de cualificación— deja de vivir en el código y pasa a la base de
  datos, que se convierte en su única fuente de verdad.
- Cambiar un precio surte efecto **sin publicar una versión nueva del sitio**, de inmediato: en el
  siguiente formulario.
- Un corte de la base de datos **no** deja al visitante sin cifra: se recurre a la foto del catálogo
  tomada en la última publicación del sitio, y eso **queda dicho en voz alta**, nunca en silencio.
- Dos visitantes que rellenan el formulario a la vez reciben cifras calculadas con el mismo
  catálogo. Nunca conviven dos precios vigentes.
- Nunca se entrega una cifra calculada con datos que no sean los vigentes: antes se entrega ninguna.
- La red de seguridad que hoy dan las pruebas no desaparece con la mudanza; cambia de sitio.
- Los datos comerciales internos siguen sin llegar jamás al navegador (principio 8, sin tocar).

## Non-goals / out of scope

- **Ningún panel ni pantalla de edición.** Los precios se editan contra la base de datos
  directamente. Descartado expresamente por el dueño del proyecto.
- **La fecha de caducidad sigue sin hacer nada.** Viaja con el catálogo y queda tan decorativa como
  hoy. Que la caducidad tenga consecuencias es una función nueva y merece su propio ciclo.
- **No se toca el método de cálculo.** Mismas fórmulas, mismo anclaje doble al rango oficial, mismo
  redondeo, mismo umbral. Solo cambia de dónde salen los números que entran.
- **No se guarda junto a cada lead la foto del catálogo con el que se calculó.** Es la otra lectura
  de la petición original y resuelve un problema distinto —la trazabilidad histórica—; se aparta a
  propósito, no se olvida.
- **No se versiona el catálogo ni se guarda historial de cambios.** Quién cambió qué precio y cuándo
  queda fuera de este ciclo.
- **No se mudan los textos públicos de los servicios.** Lo que el visitante lee sobre cada servicio
  es copy de marca, no precio, y se rige por el design system.
- **No se cambia nada de lo que ve el visitante.** Para él, esta spec es invisible.

## Users & context

- **Quien fija los precios en Nexus** (hoy, el dueño del proyecto). Tiene la autoridad comercial
  sobre las cifras y hoy necesita una publicación del sitio para ejercerla. Es el usuario de esta
  spec.
- **Quien mantiene el sitio.** Hoy es el cuello de botella involuntario de toda decisión de precio.
  Deja de serlo.
- **El posible cliente que rellena el formulario.** No es usuario de esta spec: no ve nada, no hace
  nada distinto, y la única promesa que se le hace es que la cifra que reciba sea la vigente o
  ninguna.

## Behaviour

### Camino principal

- Cada cálculo obtiene el catálogo de la base de datos. La cifra que recibe el visitante se calcula
  siempre con el catálogo vigente en ese instante.
- Al publicar el sitio se toma una **foto del catálogo** tal y como está en la base en ese momento, y
  esa foto viaja dentro de la publicación. Solo se usa si la base no responde.
- Cambiar un precio es: editarlo en la base de datos. El siguiente formulario ya usa la cifra nueva.
  Sin publicación, sin espera.

> **Por qué se descartó la copia en memoria.** El sitio se publica en Vercel, donde no hay un
> servidor encendido: se encienden copias al llegar visitas y se apagan solas. Con el tráfico
> esperado, la mayoría de las visitas caerían en una copia recién encendida, de modo que una copia en
> memoria apenas protegería de un corte — y, al refrescar cada copia por su cuenta, dos visitantes
> simultáneos podrían recibir precios distintos tras un cambio.

### Bordes

- **Escritura imposible rechazada.** La base de datos rechaza de plano lo que no puede ser cierto: un
  mínimo por encima de su máximo, una cifra negativa, un servicio sin rango, un multiplicador o una
  puntuación fuera de los límites admitidos. La escritura no se completa y el catálogo no cambia.
- **Servicio de rango abierto.** *Custom AI Solutions* no tiene techo publicable. Un servicio sin
  extremo superior es un dato válido, no un dato incompleto, y la validación debe distinguirlos.
- **Servicio en euros por mes.** *AI Executive Advisory* se expresa en cuota mensual, no en importe
  total. Esa distinción viaja con el catálogo.
- **Catálogo vacío o incompleto.** Un catálogo al que le falta alguno de los seis servicios, o alguno
  de los bloques de factores, no es un catálogo parcial: es un catálogo inválido.
- **Retirar un servicio no es un cambio de precio.** El formulario ofrece unos retos y cada reto
  apunta a un servicio. Un catálogo al que le falta un servicio al que un reto apunta queda inválido
  y la escritura se rechaza. Retirar comercialmente un servicio es un cambio de **producto**, toca
  los retos del formulario, y por tanto **sigue requiriendo publicar el sitio**. Esta mudanza hace
  editables los precios, no la forma del catálogo.
- **La base responde, pero tarda demasiado.** Existe un tiempo máximo de espera. Agotado, se trata
  exactamente igual que si la base no respondiera: se calcula con la foto y se avisa. Sin ese límite,
  una base lenta dejaría al visitante esperando indefinidamente, que es peor que un fallo limpio.
- **El sitio en producción nunca escribe el catálogo.** Solo lo lee. Escribir un precio es un acto
  manual y deliberado contra la base de datos; ninguna acción del visitante puede alterarlo, ni
  siquiera por error.
- **Publicación sin foto.** Si al publicar el sitio no se consigue tomar una foto válida del
  catálogo, **la publicación falla**. Publicar sin respaldo dejaría el sitio sin la red que esta spec
  promete, y hacerlo en silencio es peor que no publicar.

### Errores

- **La base de datos no responde.** Se calcula con la foto de la última publicación. El visitante
  recibe su rango con normalidad y no se entera de nada. **El equipo sí:** el aviso interno de ese
  lead declara que la cifra se calculó con la foto y de cuándo es esa foto. Es el patrón que ya sigue
  el registro de leads — un fallo que no se nota no existe hasta que cuesta caro.
- **La base responde con un catálogo que no supera la validación.** Se descarta entero y se recurre a
  la foto, con el mismo aviso. Nunca se adopta un catálogo a medias, ni se mezclan dos.
- **Ni la base responde ni hay foto utilizable.** No se entrega ninguna cifra. El visitante ve que no
  se ha podido calcular su estimación y que se le llamará; **su lead se registra igual**, con todas
  sus respuestas. Este caso no debería existir —la publicación falla antes que quedarse sin foto—,
  pero se define en vez de dejarse indefinido.
- **Un cambio de precio rompería el caso de referencia del principio 16.** Existe una comprobación
  que lo detecta y deja constancia, en vez de que el desajuste pase inadvertido.

### Lo que sigue sin ocurrir

- El navegador del visitante no recibe ningún multiplicador, ninguna puntuación y ningún umbral
  (principio 8, sin cambios).
- El catálogo en la base está tan cerrado como los leads: la llave pública del sitio no puede leerlo.
- El lead sigue sin ver su puntuación ni señal alguna de haber sido clasificado (principio 11).

## Acceptance criteria

- **CA-01.** Dado el catálogo vigente en la base de datos, cuando se calcula el caso de referencia
  (600 empleados, madurez inicial, arranque en 4 meses, diagnóstico de IA), entonces el rango
  entregado es exactamente **28.000 – 35.000 €**.
- **CA-02.** Dado un cambio de rango oficial escrito en la base de datos, cuando se envía el
  siguiente formulario, entonces usa el rango nuevo **sin que se haya publicado ninguna versión del
  sitio y sin ninguna espera**.
- **CA-03.** Dado un intento de escribir un servicio cuyo mínimo supera a su máximo, cuando se
  ejecuta, entonces la escritura se rechaza y el catálogo queda sin cambios.
- **CA-04.** Dado un intento de escribir una cifra negativa en cualquier rango, multiplicador o
  puntuación, cuando se ejecuta, entonces la escritura se rechaza y el catálogo queda sin cambios.
- **CA-05.** Dado un servicio de rango abierto, cuando se escribe sin extremo superior, entonces la
  escritura se acepta como dato válido (no como dato incompleto) y **el visitante sigue viendo
  exactamente el mismo texto que hoy**. Este criterio comprueba que nada cambia, no que algo nuevo
  aparezca: ningún texto público se redacta ni se modifica en este ciclo.
- **CA-06.** Dada una base de datos que no responde, cuando alguien envía el formulario, entonces
  recibe su rango calculado con la foto de la última publicación, **y el aviso interno de ese lead
  declara que se usó la foto y de qué fecha es**.
- **CA-07.** Dada una base de datos que devuelve un catálogo que no supera la validación, cuando
  alguien envía el formulario, entonces se descarta entero, se calcula con la foto y el aviso interno
  lo declara igual que en CA-06. No se adopta ninguna parte del catálogo inválido.
- **CA-08.** Dado un intento de publicar el sitio en el que no se consigue tomar una foto válida del
  catálogo, cuando se ejecuta, entonces **la publicación falla** y la versión anterior sigue viva.
- **CA-09.** Dado que ni la base responde ni hay foto utilizable, cuando alguien envía el
  formulario, entonces no se entrega ninguna cifra, se le indica que se le llamará, y su lead queda
  registrado con todas sus respuestas.
- **CA-10.** Dados dos formularios enviados a la vez, cuando se calculan, entonces ambos usan el
  mismo catálogo: nunca conviven dos rangos vigentes para el mismo servicio.
- **CA-11.** Dado el catálogo sembrado con los valores que hoy viven en el código, cuando se recorre
  **toda** combinación posible de respuestas, entonces cada rango entregado es **idéntico** al que
  entregaba antes de la mudanza. La mudanza no cambia ni una cifra.
- **CA-12.** Dado un intento de borrar del catálogo un servicio al que apunta un reto del
  formulario, cuando se ejecuta, entonces la escritura se rechaza y el catálogo queda sin cambios.
- **CA-13.** Dada una base de datos que acepta la conexión pero no contesta, cuando transcurre el
  tiempo máximo de espera, entonces el visitante recibe su rango calculado con la foto, con el mismo
  aviso interno que en CA-06, y no espera más allá de ese límite.
- **CA-14.** Dada la llave con la que el sitio publicado lee el catálogo, cuando se intenta escribir
  o borrar en él, entonces se deniega.
- **CA-15.** Dada la comprobación del caso de referencia contra el catálogo vivo, cuando no es
  posible alcanzar el catálogo vivo, entonces la comprobación **falla diciendo que no pudo
  ejecutarse**. Nunca se salta en silencio ni se da por buena.
- **CA-16.** Dada la prueba exhaustiva del principio 15 ejecutada contra el catálogo vivo, cuando se
  recorren todas las combinaciones de las respuestas 1 a 5, entonces ningún extremo de ningún rango
  entregado se sale de su rango oficial.
- **CA-17.** Dado el sitio publicado, cuando se inspecciona todo lo que recibe el navegador, entonces
  no aparece ningún multiplicador, ninguna tabla de puntos ni el umbral de cualificación.
- **CA-18.** Dada la llave pública del sitio, cuando se intenta leer, escribir o borrar el catálogo
  en la base de datos, entonces se deniega.
- **CA-19.** Dado el catálogo vivo, cuando se ejecuta la puerta de verificación, entonces la
  comprobación del caso de referencia falla si el catálogo ya no produce 28.000 – 35.000 €.

## Points to clarify

> Pasada de `clarify` del 2026-09-14. Cada entrada lleva su **desenlace declarado**: nada se cayó por
> el camino. Cinco preguntas abiertas: dos resueltas por la constitución, dos decididas con su razón,
> una convertida en decisión diferida. Cuatro suposiciones validadas. Tres diferidas, intactas.

### Resueltas en esta pasada

- ✅ **resuelta por la constitución** — *¿el caso de referencia debe seguir siendo exactamente
  28.000 – 35.000 €?* **Sí, exactamente.** El principio 16 no deja margen: es «una prueba de
  regresión **permanente**» con esa cifra escrita. **Consecuencia aceptada y dicha en voz alta:**
  esa prueba se pondrá roja cada vez que alguien actualice un precio del servicio de diagnóstico, y
  eso es lo que se quiere — actualizar el catálogo incluye actualizar la cifra esperada, y ese gesto
  es precisamente la constancia de que alguien miró.
- ✅ **resuelta por la constitución** — *¿importa la latencia de consultar la base en cada cálculo?*
  El principio 26 dice que **no hay presupuesto de rendimiento** y que `verify` no debe imponer uno.
  No es una pregunta abierta, es una decisión ya tomada. Lo que sí hacía falta era un **tiempo máximo
  de espera**, que es otra cosa: no un objetivo de rendimiento, sino un límite para no dejar al
  visitante colgado (CA-13).
- ✅ **decidida** — *¿dónde está la frontera de lo «imposible» para multiplicadores y puntos?*
  Multiplicadores: mayores que cero y como mucho 3. Puntuaciones: enteras, entre −10 y 10. Umbral:
  entero, entre 0 y la puntuación máxima. Rangos: enteros no negativos, con el mínimo nunca por
  encima del máximo. *Razón:* los valores vigentes (multiplicadores de 0,8 a 1,25; puntos de −1 a 3)
  caben holgadísimo. El límite solo tiene que atrapar el disparate —un multiplicador de 50—, no
  afinar; una frontera apretada rechazaría mañana un cambio comercial legítimo.
- ✅ **decidida** — *¿hay una antigüedad de la foto a partir de la cual no deba usarse?* **No hay
  límite duro.** *Razón:* un límite convierte el respaldo en una segunda forma de quedarse sin cifra,
  que es exactamente lo que el respaldo existe para evitar. Lo que sí se hace es **decir la fecha**:
  el aviso interno de CA-06 declara de cuándo es la foto, de modo que quien lea el correo juzgue.
- ✅ **decidida** — *¿qué pasa si alguien borra un servicio?* Se **rechaza** si algún reto del
  formulario apunta a él. *Razón, y es un hallazgo:* retirar un servicio no es un cambio de precio,
  es un cambio de **producto** — toca los retos del formulario, que son código. Esta mudanza hace
  editables los precios, **no la forma del catálogo**. Está escrito en los bordes para que nadie lo
  descubra el día que lo intente.

### Validadas (seguían en pie)

- ✅ **suposición validada** — el aviso de que se usó la foto viaja en **el correo interno de ese
  lead**. *Sigue en pie:* es el patrón de [leads-en-supabase](./leads-en-supabase.md), ya probado en
  producción. *Riesgo vivo:* si un día se deja de leer ese correo, el aviso se pierde con él.
- ✅ **suposición validada** — la foto se toma **en cada publicación** y no se refresca entre
  publicaciones. *Sigue en pie,* y se refuerza: al decidir que no hay antigüedad máxima, la foto
  vieja se usa igualmente, diciendo su fecha.
- ✅ **suposición validada** — el catálogo queda **tan cerrado como los leads**: seguridad de fila sin
  policies, permisos retirados a los roles públicos. *Sigue en pie,* y `clarify` la **afiló**: la
  llave con la que el sitio lee el catálogo **no puede escribirlo** (CA-14). El sitio en producción
  nunca escribe precios; escribirlos es un acto manual y deliberado.
- ✅ **suposición validada** — la vigilancia del caso de referencia (CA-19) vive **en la puerta de
  verificación**. *Sigue en pie,* y `clarify` la afiló: si no se alcanza el catálogo vivo, la
  comprobación **falla diciendo que no pudo ejecutarse** (CA-15). Nunca se salta en silencio.
  *Riesgo vivo:* un precio cambiado un martes no se detecta hasta la siguiente verificación.

### Diferidas (intactas, no se tocaron)

- **decisión diferida** — guardar junto a cada lead la foto del catálogo con el que se calculó
  (trazabilidad histórica). Es la otra lectura de la petición original; se apartó a favor de ésta.
- **decisión diferida** — panel de edición para el equipo comercial. Descartado para este ciclo.
- **decisión diferida** — historial de cambios del catálogo: quién cambió qué precio y cuándo.
- **decisión diferida** *(era pregunta abierta; degradada en esta pasada)* — una comprobación que
  avise cuando la foto y la base **divergen**. *Razón de diferirla:* la foto se refresca en cada
  publicación, así que la divergencia solo existe **entre** publicaciones; detectarla en continuo
  exige una pieza que vigile sola —un temporizador, un canal de aviso— y eso es alcance nuevo. El
  aviso de CA-06, que dice la fecha de la foto, cubre el caso que importa: el día que se use de
  verdad.

### Sigue sin poder formularse

- **área no formulable** — el relevo del catálogo 2026 por el 2027. ¿Conviven ambos con una fecha de
  entrada en vigor, se sobrescribe el vigente, queda rastro del anterior? La pasada de `clarify` la
  miró y **no consiguió afilarla**: depende de cómo Nexus decida publicar su edición 2027, que
  todavía no está decidido. Llegará antes de enero de 2027.

## Clarifications

Registro de la pasada del 2026-09-14. Formato: pregunta → decisión → por qué.

| # | Pregunta | Decisión | Por qué |
|---|----------|----------|---------|
| C-1 | ¿Caso de referencia exacto o recalculado? | **Exacto: 28.000 – 35.000 €** | Principio 16, literal: prueba de regresión permanente. Se acepta que se ponga roja al cambiar precios; ese gesto ES la constancia. |
| C-2 | ¿Frontera de lo «imposible»? | Multiplicadores en (0, 3]; puntos enteros en [−10, 10]; umbral entero en [0, máximo]; rangos enteros ≥ 0 con mínimo ≤ máximo | Atrapar el disparate sin rechazar mañana un cambio comercial legítimo. Los valores vigentes caben con mucho margen. |
| C-3 | ¿Antigüedad máxima de la foto? | **Sin límite duro; se declara su fecha** | Un límite convertiría el respaldo en otra forma de quedarse sin cifra. Decir la fecha deja juzgar a quien lee. |
| C-4 | ¿Vigilar la divergencia foto ↔ base? | **Diferida** | Solo existe entre publicaciones; vigilarla en continuo es una pieza nueva. El aviso del día que se use cubre lo que importa. |
| C-5 | ¿Borrar un servicio? | **Rechazado** si un reto apunta a él | Retirar un servicio es cambio de producto, no de precio: toca los retos, que son código, y sigue requiriendo publicar. |
| C-6 | *(nueva)* ¿Y si la base tarda en vez de fallar? | **Tiempo máximo de espera**; agotado, se trata como caída | Sin límite, el visitante espera indefinidamente — peor que un fallo limpio. Principio 26 no lo impide: no es rendimiento, es no dejar a nadie colgado. |
| C-7 | *(nueva)* ¿La mudanza puede cambiar alguna cifra? | **Ninguna.** Criterio explícito (CA-11) | Sembrar desde los valores actuales y demostrar que toda combinación da idéntico resultado es la única prueba de que esto fue una mudanza y no un rediseño encubierto. |
| C-8 | *(nueva)* ¿Puede el sitio escribir el catálogo? | **No. Solo lee** (CA-14) | Menor privilegio: ninguna acción de un visitante debe poder alterar un precio, ni siquiera por error. |

## Revisions

- **2026-09-14 (c)** — pasada de `clarify`, en autopilot. Cinco preguntas abiertas cerradas (dos por
  la constitución, dos decididas, una degradada a diferida) y cuatro suposiciones validadas, dos de
  ellas afiladas. El barrido de la taxonomía encontró **tres huecos que la spec no tenía**: qué pasa
  si la base tarda en vez de fallar (C-6), que hay que demostrar que la mudanza no cambia ni una
  cifra (C-7), y que el sitio no debe poder escribir el catálogo (C-8). Criterios de aceptación:
  de 14 a 19.
- **2026-09-14 (b)** — revisión en frío. Encontró que «cargar al arrancar y guardar en memoria»
  descansaba en una premisa falsa: el sitio se publica en Vercel, donde no hay un servidor encendido
  sino copias efímeras. Con el tráfico esperado, esa copia apenas habría protegido de un corte, y al
  refrescar cada copia por su cuenta habría permitido dos precios vivos a la vez. **Sustituida** por
  consulta a la base en cada cálculo más una foto tomada en la publicación. Corregida además una
  contradicción entre CA-05 y los non-goals: CA-05 comprueba que el texto público NO cambia.
- **2026-09-14** — creación. Objeción a la mudanza planteada y desestimada por el dueño del proyecto;
  registrada en la sección *Objeción planteada y decisión*. Cuatro decisiones tomadas en la fase de
  preguntas: fuente de verdad en la base (frente a foto histórica por lead), alcance completo (frente
  a solo servicios), copia en memoria refrescada (frente a consulta por petición o fallo ruidoso), y
  red de seguridad doble (validación en escritura + vigilancia del caso de referencia).
