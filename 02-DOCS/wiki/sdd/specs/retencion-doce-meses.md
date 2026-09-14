---
type: spec
title: Spec — La conservación de doce meses se ejecuta sola
description: WHAT y WHY de la supresión de leads — el aviso de privacidad promete doce meses; esta spec convierte esa promesa en algo que ocurre sin que nadie se acuerde.
tags: [sdd, spec, privacidad, retencion]
timestamp: 2026-09-14T11:05:00Z
topic: sdd
slug: retencion-doce-meses
status: approved in autopilot
---

# Spec — La conservación de doce meses se ejecuta sola

> Slug: `retencion-doce-meses` · Status: aprobada en autopilot · Creada: 2026-09-14
> Inherits: [constitution](../constitution.md) · Depende de: [leads-en-supabase](./leads-en-supabase.md)

## Problem & why

El aviso de privacidad del sitio, que está publicado y es vinculante, dice literalmente:

> «Conservamos los datos de tu solicitud durante doce meses desde que la envías, salvo que antes
> retires tu consentimiento o solicites su supresión. Si tu solicitud da lugar a una relación
> comercial, los datos pasan a regirse por el contrato correspondiente.»

Hasta ahora esa frase era **cierta como intención y falsa como práctica**: los leads vivían en un
buzón de correo, donde nadie podía ejecutar una supresión sistemática ni demostrar que se ejecutó.
Con el registro en base de datos la promesa pasa a ser ejecutable por primera vez. Esta spec la
ejecuta.

Que sea automática no es comodidad: una supresión que depende de que alguien se acuerde cada mes es
una supresión que no ocurre, y el incumplimiento no se nota hasta que alguien pregunta.

## Cost of not building it

Un compromiso publicado que no se cumple, sobre datos personales de terceros, indefinidamente y de
forma creciente: cada mes que pasa hay más filas que deberían haberse borrado y no se borraron. No
es una multa segura ni inminente —es un sitio de captación pequeño—, pero es exactamente el tipo de
incumplimiento que no admite explicación cuando alguien lo pregunta, porque está escrito por la
propia empresa en su propia web.

Y tiene un coste más barato de contar: cuanto más se tarde, más filas habrá que borrar a mano el día
que se haga, sin poder distinguir ya cuáles debían conservarse.

## The cheapest alternative

Un recordatorio en el calendario y un `delete` a mano una vez al año. Cuesta cero y **no es
suficiente** por la razón de siempre: depende de que una persona concreta se acuerde durante años,
y su fallo es silencioso — nadie se entera de que no se hizo. Tampoco deja rastro de que se hizo,
que es la mitad de lo que sirve cumplir.

Queda como plan B honesto si la programación automática diera problemas.

## Goals

- Los datos de una solicitud desaparecen solos a los doce meses de enviarse.
- Una solicitud que ha dado lugar a una relación comercial **no** se borra: el aviso de privacidad
  dice que esos datos pasan a regirse por el contrato, no por este plazo.
- Atender una petición de supresión anticipada es una operación de un paso, no una búsqueda.
- Se puede comprobar que el mecanismo está activo, sin esperar doce meses para saberlo.

## Non-goals / out of scope

- **Anonimizar en vez de borrar.** El aviso dice conservar, no anonimizar. Se borra.
- **Un panel para gestionar la retención.** Sigue fuera de alcance, como en `S-0025`.
- **Un registro de auditoría de cada borrado.** Sharp, pero es otra decisión: quién lo consulta y
  cuánto se conserva ese registro es una pregunta con su propia respuesta de privacidad.
- **Cambiar el texto del aviso de privacidad.** No hace falta: esta spec lo hace verdad, no lo
  modifica.
- **Retención de los correos.** Los avisos internos siguen en el buzón del equipo y esta spec no los
  toca. Es una limitación real y se declara.

## Users & context

- **Jose, como responsable del tratamiento.** Es quien responde si alguien pregunta. Necesita poder
  decir «se borran solos» y poder enseñarlo.
- **El equipo comercial.** Necesita que un lead que se convirtió en cliente no desaparezca de golpe
  a los doce meses.
- **La persona que rellenó el formulario.** No interactúa con esto. Es la titular de los datos y la
  destinataria de la promesa.

## Behaviour

- **Camino principal:** una solicitud enviada hace más de doce meses deja de existir en el registro,
  sin que nadie haga nada.
- **Excepción declarada:** una solicitud marcada como origen de una relación comercial se conserva,
  aunque pase el plazo.
- **Supresión anticipada:** ante una petición de la persona, sus datos se pueden eliminar
  inmediatamente identificándola por su correo.
- **Comprobable:** se puede preguntar si el mecanismo está programado y activo, y obtener una
  respuesta clara, sin esperar a que pase un año.
- **Nada de esto es alcanzable desde fuera.** No se abre ninguna puerta nueva a Internet: quien no
  tenga la llave del servidor no puede ni disparar el borrado ni consultarlo.

## Acceptance criteria

- **CA-R1** — Given una solicitud con fecha de envío anterior a doce meses y sin marca de relación
  comercial, When se ejecuta la retención, Then esa solicitud ya no existe en el registro.
- **CA-R2** — Given una solicitud de hace más de doce meses **marcada** como relación comercial,
  When se ejecuta la retención, Then esa solicitud sigue existiendo.
- **CA-R3** — Given una solicitud de hace menos de doce meses, When se ejecuta la retención, Then
  sigue existiendo.
- **CA-R4** — Given una petición de supresión de una persona identificada por su correo, When se
  atiende, Then no queda ninguna fila suya en el registro.
- **CA-R5** — Given el registro configurado, When se comprueba el estado del mecanismo, Then se
  obtiene si está programado y activo, sin ambigüedad.
- **CA-R6** — Given el mecanismo instalado, When se inspecciona la superficie pública del sitio,
  Then no existe ninguna ruta nueva capaz de disparar o consultar el borrado.

## Points to clarify

- **suposición tomada** — el plazo se cuenta desde la fecha de envío de la solicitud, no desde el
  último contacto. *Base:* es lo que dice el aviso publicado, literalmente «doce meses desde que la
  envías». *Riesgo:* si el equipo entiende otra cosa, cambia el criterio y hay que reescribir el
  aviso, no el código.
- **suposición tomada** — la marca de relación comercial la pone una persona, a mano. *Base:* este
  sistema no sabe si un lead se convirtió: esa información vive fuera. *Riesgo:* si nadie la marca,
  se borran leads de clientes reales al año. Mitigación declarada: la marca existe y está
  documentada; que se use es una decisión del equipo, no del código.
- **decisión diferida** — el registro de auditoría de los borrados.
- **área no formulable** — qué se hace con los avisos internos por correo, que contienen los mismos
  datos personales y no caducan. Hay una pregunta ahí y todavía no sé enunciarla sin meterme en cómo
  gestiona el equipo su buzón.
