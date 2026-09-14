---
type: spec
title: Spec — Pregunta de frenos del lead en el formulario
description: WHAT y WHY para añadir al estimador una octava pregunta de negocio, de respuesta múltiple y saltable, que recoge qué frena al lead. Es informativa: viaja al aviso interno y no toca ni la cifra ni la puntuación de cualificación.
tags: [sdd, spec, formulario, comercial]
timestamp: 2026-09-14T10:05:00Z
topic: sdd
slug: pregunta-frenos-lead
status: draft
---

# Spec — Pregunta de frenos del lead

> Slug: `pregunta-frenos-lead` · Status: **draft, pendiente de aprobación** · Created: 2026-09-14
> Inherits: [constitution](../constitution.md) **v1.1.0**
> Antecesor: [Spec — Landing y estimador de presupuesto](./landing-presupuestos-nexus.md), cuyo
> comportamiento se conserva íntegro. Esta spec **añade** una pregunta; no modifica ninguna de las
> siete existentes, ni el motor de rango, ni el de puntuación.

## Problem & why

El comercial que abre el aviso de un lead sabe a qué se dedica, cuánta gente es, cuándo quiere
arrancar, si hay alguien de dirección detrás y cómo está de presupuesto. No sabe **qué le impide
avanzar**. Llega a la llamada de alcance sin saber qué objeción se va a encontrar, y una objeción de
dinero, una de falta de gente, una de miedo legal y una de "ya nos quemamos una vez" se preparan de
formas distintas. Hoy esa información se descubre dentro de la llamada, cuando la conversación ya
está encarrilada.

## Cost of not building it

Pequeño, y conviene decirlo sin adornos: **el freno acaba saliendo igual en la llamada de alcance**.
La información no se pierde, se obtiene treinta minutos más tarde y con la conversación ya empezada.
El coste es una primera llamada peor preparada por cada lead cualificado — no un lead perdido, ni una
cifra equivocada, ni un riesgo. Es una mejora de preparación comercial, y el alcance que se le dé
debe ser proporcional a eso.

## The cheapest alternative

Preguntarlo en la llamada, que es exactamente lo que ya se hace y no cuesta nada. La otra alternativa
barata es una línea de texto libre al final del formulario del tipo "¿algo más que debamos saber?".

Ninguna de las dos basta para lo que se busca: la llamada es justo el momento que se quiere adelantar,
y una respuesta abierta llega sin estructura, no se puede comparar entre leads ni contar, y la mayoría
la deja en blanco. Una lista corta de opciones marcables se responde en tres segundos y produce un
dato homogéneo.

## Goals

- El aviso interno de cada lead dice qué frena a ese lead, cuando el lead ha querido decirlo.
- El lead lo declara en un paso que no le cuesta esfuerzo y que puede saltarse entero.
- La decisión de cualificación significa exactamente lo mismo después de este cambio que antes.

## Non-goals / out of scope

- **No puntúa.** No entra en la escala de 10 puntos, no mueve el umbral y no altera quién ve la
  agenda. Decidido explícitamente, no omitido.
- **No cambia la cifra.** El rango que ve el lead es idéntico marque lo que marque.
- **No se le devuelve al lead.** Ni en su pantalla de resultado ni en su correo.
- **No se retira ni se reescribe ninguna de las siete preguntas actuales.** Se evaluó acortar el
  formulario y se descartó: las dos únicas preguntas que no afectan al precio —sponsor y
  presupuesto— suman los 6 puntos que son exactamente el umbral de cualificación, así que quitar
  cualquiera de ellas haría imposible cualificar a nadie; y la única candidata restante, madurez,
  aparece en el caso de regresión permanente que fija el principio 16 de la constitución.
- **No hay texto libre ni opción "otro".** La lista es cerrada.
- **No se añade la segunda pregunta, "¿Qué sistemas usáis?"** (ERP, CRM, Microsoft 365, Google
  Workspace, herramientas propias, ninguno). Queda descrita en *Points to clarify* como decisión
  diferida, con su motivo.

## Users & context

- **El lead** — una persona de dirección de una organización, respondiendo un formulario corto para
  obtener un rango orientativo. No es técnica, tiene prisa, y está a un paso de dejar sus datos.
- **El comercial de Nexus** — recibe el aviso interno de cada envío y decide cómo encarar el primer
  contacto. Es el único destinatario real de este dato.

## Behaviour

**Camino principal.** Después de responder la pregunta de presupuesto y antes de que se le pidan sus
datos de contacto, el lead ve una pregunta que admite varias respuestas a la vez: *¿Qué os está
frenando ahora mismo?*, con la indicación de que marque todas las que apliquen. Las opciones son
cuatro:

1. No tenemos perfiles técnicos
2. Dudas legales o de protección de datos
3. No sabemos por dónde empezar
4. Ya lo intentamos y salió mal

Marca las que quiera —ninguna, una, o las cuatro— y avanza. Lo que marque aparece en el aviso interno
que recibe el equipo.

**Casos límite.**

- No marca nada y avanza: se le deja continuar sin error. El aviso interno dice explícitamente que no
  declaró ningún freno, en vez de callar.
- Marca las cuatro: las cuatro constan en el aviso.
- Marca y desmarca antes de avanzar: vale lo que quede marcado al avanzar.
- Vuelve atrás y cambia la respuesta: vale la última.

**Caminos de error.**

- Llega un valor que no está entre las cuatro opciones: se rechaza, como ya ocurre con las demás
  respuestas de negocio. El formulario no es la única vía de entrada al envío.
- Cualquier fallo al recoger este dato no puede impedir que el lead vea su resultado ni que el equipo
  reciba el aviso. Es información añadida, nunca un bloqueo.

## Acceptance criteria

- **CA-1** · Given un lead en la pregunta de frenos, When no marca ninguna opción y avanza, Then pasa
  a la pantalla de contacto sin ver ningún error.
- **CA-2** · Given un lead que marca dos frenos, When completa el envío, Then el aviso interno nombra
  esos dos frenos y ningún otro.
- **CA-3** · Given un lead que no marca ninguno, When completa el envío, Then el aviso interno afirma
  expresamente que no declaró frenos.
- **CA-4** · Given dos leads con las siete respuestas de negocio idénticas y frenos distintos, When
  ambos envían, Then reciben la misma cifra y obtienen la misma puntuación de cualificación.
- **CA-5** · Given un envío que llega con un freno que no está en la lista de cuatro, When se procesa,
  Then se rechaza y no produce ni cifra ni aviso.
- **CA-6** · Given cualquier lead, When mira su pantalla de resultado y el correo que recibe, Then no
  encuentra ninguna referencia a los frenos que marcó.
- **CA-7** · Given el recorrido completo con la pantalla nueva, When se navega solo con teclado, Then
  se puede marcar, desmarcar, avanzar y retroceder, con el foco siempre visible (principio 24).
- **CA-8** · Given el texto de la pregunta y de sus cuatro opciones, When se revisa el tono, Then
  consta como superficie propia en el acta de tono (principios 27, 28 y 36).

## Points to clarify

- **pregunta abierta** — ¿cuál es la redacción final de la pregunta y de las cuatro opciones en la voz
  de la marca? El texto de partida es el del encargo; entra en el acta de tono, que sigue sin firmar.
- **suposición tomada** — los frenos viajan solo al aviso interno, nunca al correo del lead. *Base:*
  principio 11, el lead no percibe señal alguna de estar siendo clasificado, y un eco de sus frenos es
  la clase de señal que lo insinúa. *Riesgo:* bajo; si comercial quisiera devolvérselo, cambia CA-6.
- **suposición tomada** — sin frenos marcados, el aviso interno lo dice con una frase en lugar de
  omitir la línea. *Base:* una línea ausente se confunde con un fallo de envío. *Riesgo:* ninguno
  identificado.
- **suposición tomada** — la lista es cerrada, sin "otro" ni texto libre. *Base:* el texto libre abre
  moderación, datos personales no previstos y un dato que no se puede contar. *Riesgo:* si el comercial
  echa en falta matiz, vuelve como pregunta nueva.
- **decisión diferida** — la segunda pregunta, *¿Qué sistemas usáis?* (ERP, CRM, Microsoft 365, Google
  Workspace, herramientas propias, ninguno). Es la que de verdad cambiaría cómo se dimensiona un
  proyecto y es múltiple por naturaleza, pero es una pregunta **técnica** que a un perfil de dirección
  le cuesta responder, y ahí sí se nota la caída del formulario. Fuera de este ciclo por decisión
  explícita del 2026-09-14.
- **área no formulable** — qué hacer cuando haya leads suficientes para ver si los frenos declarados
  predicen algo. Se intuye una pregunta sobre si deberían pasar a puntuar, y no se puede enunciar con
  precisión sin datos reales delante.

## Revisions

- 2026-09-14 — versión inicial. Durante la fase `specify` cambiaron dos cosas respecto al encargo de
  partida: las opciones pasaron de seis a cuatro (se retiran *"El presupuesto no está aprobado"* y
  *"Resistencia interna al cambio"* por solapar con las preguntas 6 y 7, que sí puntúan), y se añadió
  la evaluación de acortar el formulario, descartada por el motivo recogido en *Non-goals*.
