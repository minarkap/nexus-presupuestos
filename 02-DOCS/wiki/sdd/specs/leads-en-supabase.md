---
type: spec
title: Spec — El registro de leads pasa a Supabase
description: WHAT y WHY del cambio de registro — el lead se guarda en una base de datos duradera y consultable, y el fallo de guardado deja de ser mudo.
tags: [sdd, spec]
timestamp: 2026-09-14T10:20:05Z
topic: sdd
slug: leads-en-supabase
status: approved in autopilot
---

# Spec — El registro de leads pasa a Supabase

> Slug: `leads-en-supabase` · Status: aprobada en autopilot · Creada: 2026-09-14
> Inherits: [constitution](../constitution.md) · Decisión de alcance: [S-0025](../decisions.md)

## Problem & why

Un lead que rellena el formulario existe hoy **en un solo sitio: un correo**. El registro de
respaldo está previsto en el código pero **nunca ha escrito una fila real en producción**: el
entorno desplegado no tiene credenciales del proveedor de la hoja de cálculo, así que el selector
de adaptadores devuelve el puerto «mal configurado» y cada intento de guardado falla.

Y falla **en silencio**. El despacho es best-effort: si el guardado no ocurre, el visitante ve su
rango con normalidad, el equipo recibe su correo, y nada en ese correo indica que ese lead no ha
quedado registrado en ninguna parte. El riesgo estaba escrito y aceptado (`C-01` / `S-0006`) para
una landing sin almacén duradero; lo que no estaba previsto es que el respaldo llevara desde el
primer día apagado sin producir ningún síntoma.

El defecto real, por tanto, son dos cosas y no una: **no hay almacén duradero** y **su ausencia no
se nota**. Cambiar de proveedor sin tocar el silencio dejaría el mismo agujero con mejor decorado.

## Cost of not building it

Cada lead depende de que un correo se entregue y de que nadie lo borre del buzón. Un fallo del
proveedor de correo en el momento del envío pierde el lead entero, sin rastro y sin aviso: no queda
ni el nombre de quien lo intentó.

Además, hay una promesa pública que hoy no es ejecutable. El aviso de privacidad dice que los datos
de la solicitud se conservan **doce meses**. Con los leads dispersos en un buzón, nadie puede
ejecutar esa supresión de forma sistemática ni demostrar que se ejecutó. La promesa es cierta como
intención y falsa como práctica.

Y no se puede responder a preguntas elementales del negocio —cuántas solicitudes entraron este mes,
qué reto predomina, cuántas superan el umbral— sin contar correos a mano.

## The cheapest alternative

Rellenar las dos credenciales que faltan del proveedor de hoja de cálculo en el entorno desplegado.
Son **minutos y cero código**: el adaptador ya está escrito, probado y en verde.

Se planteó como objeción explícita antes de escribir esta spec, y **no es suficiente por dos
razones**: no arregla el silencio del fallo, que es la mitad del defecto; y una hoja de cálculo no
permite ni consulta agregada ni supresión sistemática, que es lo que la promesa de los doce meses
necesita. Jose la descartó con ese argumento sobre la mesa — no por inviable.

**Queda escrita como parche válido**: si este ciclo se retrasa y hay campaña en marcha, rellenar
esas dos credenciales es mejor que seguir sin registro.

## Goals

- Todo envío válido del formulario queda guardado en un registro **duradero y consultable**.
- Cuando el guardado **no** ocurre, el equipo se entera **en el mismo correo interno de ese lead**,
  sin tener que mirar ningún log.
- El visitante no percibe ninguna diferencia, ni cuando todo va bien ni cuando el guardado falla.
- La supresión a los doce meses pasa a ser **ejecutable**, aunque este ciclo no la automatice.

## Non-goals / out of scope

- **Un panel de consulta en la web.** Pedido y retirado por Jose en la misma conversación
  (`S-0025`). Es una spec futura con su autenticación y sus permisos, no un añadido de este ciclo.
- **El borrado automático a los doce meses.** Este ciclo lo hace *posible*; no lo automatiza.
- **Deduplicación persistente entre arranques.** Hoy la deduplicación vive en memoria y se pierde
  en cada arranque en frío. Es un defecto real y anterior a este cambio; se arregla en su propia
  spec.
- **Cualquier cambio en el formulario, el motor de rango, la puntuación o los correos al visitante.**
- **Reescribir el aviso de privacidad.** Su texto no nombra proveedores y ya declara transferencias
  fuera de la UE con cláusulas tipo; sigue siendo cierto sin tocar una palabra.
- **Migrar histórico.** No hay: nunca se escribió una fila.
- **Recoger ningún dato nuevo del visitante.** Se guarda lo que ya viaja al aviso interno.

## Users & context

- **El equipo comercial de Nexus Consulting.** Recibe hoy un correo por lead y no tiene otra fuente.
  Su necesidad no es un panel: es que el lead exista en algún sitio que no sea su bandeja de entrada.
- **Jose, como operador del sitio.** Necesita poder responder «¿se ha guardado?» sin leer logs de
  servidor, y poder atender una petición de supresión sin buscar en un buzón.
- **El visitante.** No es usuario de esto. Su contrato no cambia: rellena, ve su rango orientativo,
  y nada de lo que pase por detrás puede afectarle.

## Behaviour

- **Camino principal:** un envío válido queda guardado **antes** de que salga ningún correo. El
  visitante ve su rango exactamente igual que hoy.
- **El aviso interno declara el resultado del guardado.** Si quedó guardado, no dice nada especial.
  Si no quedó guardado, lleva una línea explícita e inequívoca de que **ese lead no está registrado
  en ninguna parte** y que el correo es la única copia.
- **Registro sin configurar:** se comporta igual que un fallo de guardado —aviso en el correo
  interno— y en producción el intento falla ruidosamente, nunca se repliega a un registro de
  mentira.
- **Envío repetido** (doble clic, recarga) dentro de la ventana de deduplicación: el registro no
  gana una segunda entrada.
- **Error:** si el guardado falla, el visitante ve su resultado con normalidad. Ningún detalle del
  fallo, del proveedor ni de la credencial llega al navegador.
- **Lo que se guarda** es lo que ya viaja al aviso interno: contacto y consentimiento, respuestas de
  negocio, frenos declarados, servicio aplicable, rango entregado y puntuación con su desglose.
  Ni un campo más.

## Acceptance criteria

- **CA-S1** — Given un formulario completo y válido, When se envía, Then existe en el registro una
  entrada con el contacto, las respuestas de negocio, los frenos, el servicio, el rango y la
  puntuación con su desglose.
- **CA-S2** — Given el registro operativo, When se envía un lead, Then el correo interno **no**
  contiene ningún aviso de no guardado.
- **CA-S3** — Given el registro caído o sin configurar, When se envía un lead, Then el visitante ve
  su rango con normalidad **y** el correo interno contiene una línea explícita de que ese lead no ha
  quedado guardado.
- **CA-S4** — Given un envío ya despachado, When se repite con el mismo identificador dentro de la
  ventana de deduplicación, Then el registro no gana una segunda entrada.
- **CA-S5** — Given cualquier envío, When se inspecciona lo que recibe el navegador, Then no aparece
  ninguna credencial del registro ni ningún dato procedente de él.
- **CA-S6** — Given el entorno de producción sin credenciales del registro, When se selecciona el
  adaptador, Then se obtiene el que falla ruidosamente y **nunca** el falso (mantiene `F-1`).
- **CA-S7** — Given un fallo de guardado, When el visitante termina el formulario, Then no ve ningún
  error, ninguna espera extra perceptible y ninguna señal de que algo ha ido mal.

## Points to clarify

- **suposición tomada** — el guardado ocurre **antes** que los correos, invirtiendo el orden actual.
  *Base:* es la única manera de que el aviso interno pueda declarar si el lead quedó guardado
  (`CA-S3`); con el orden de hoy el correo sale antes de saberlo. *Riesgo:* añade la latencia del
  guardado antes de que salga el primer correo. Se considera aceptable porque el visitante ya ve su
  resultado por otra vía y ninguna de las tres salidas le bloquea.
- **suposición tomada** — se guarda exactamente lo que ya compone el aviso interno, sin campos
  nuevos. *Base:* no ampliar la recogida de datos personales sin una finalidad declarada
  (constitution 5, principio 21-23). *Riesgo:* si mañana hacen falta IP, user-agent o procedencia
  de campaña, es otro ciclo y probablemente otra línea en el aviso de privacidad.
- **suposición tomada** — la región del proveedor se elige por comodidad, con preferencia por
  Europa. *Base:* el principio 22 declara explícitamente que **no hay requisito de residencia** y
  que ninguna fase debe «arreglarlo» por su cuenta. *Riesgo:* ninguno legal; sólo latencia.
- **pregunta abierta** — ¿el adaptador de la hoja de cálculo se borra o se deja dormido? `S-0025`
  dejó la pregunta abierta a propósito. Borrarlo simplifica; dejarlo dormido conserva el parche
  barato descrito arriba.
- **decisión diferida** — la supresión automática a los doce meses. Sharp, fuera de este ciclo.
- **decisión diferida** — el panel de consulta, con su autenticación y sus permisos.
- **área no formulable** — qué significa que el mismo contacto vuelva a enviar el formulario semanas
  después: ¿un lead nuevo, o el mismo actualizado? Hoy serían dos entradas y nadie ha dicho que esté
  mal. Sospecho que hay una pregunta de negocio ahí y todavía no sé enunciarla con precisión.

## Revisions

- **2026-09-14** — Spec escrita a posteriori. La decisión de alcance (`S-0025`) se tomó y se
  registró en una sesión anterior que terminó antes de crear este fichero: el índice lo enlazaba y
  el fichero no existía. El contenido de esta spec **recupera** lo decidido allí, no lo redecide.
  Aprobada en autopilot («Perfecto, hazlo», 2026-09-14) — no punto por punto.
