---
type: spec
title: Spec — Límite de frecuencia del formulario
description: WHAT y WHY del tope de envíos — impedir que la acción pública inunde la base de datos, sin bloquear jamás en silencio a un lead legítimo y sin que el aviso de privacidad deje de ser cierto.
tags: [sdd, spec, seguridad, privacidad, abuso]
timestamp: 2026-09-14T13:20:00Z
topic: sdd
slug: limite-de-frecuencia
status: approved in autopilot
---

# Spec — Límite de frecuencia del formulario

> Slug: `limite-de-frecuencia` · Status: aprobada en autopilot · Creada: 2026-09-14
> Inherits: [constitution](../constitution.md) · Cierra el riesgo abierto de [S-0027](../decisions.md)
> Depende de: [leads-en-supabase](./leads-en-supabase.md)

## Problem & why

La acción que recibe el formulario es **un endpoint HTTP público**, y el formulario no es su única
vía de entrada: se puede llamar directamente. Mientras el registro no escribía nada, abusar de ella
sólo engordaba un correo. Desde que escribe en una base de datos real, **cada llamada crea una fila
con coste**, y no hay nada que limite cuántas.

Lo señaló la revisión adversarial de seguridad del 2026-09-14 y quedó escrito como riesgo abierto en
`S-0027`, no resuelto: elegir el mecanismo podía rechazar leads legítimos, y esa decisión no era del
ciclo anterior.

El daño no es una fuga —la revisión descartó toda vía de exposición— sino **coste y ruido**: una
tabla inundada de filas basura en la que los leads de verdad dejan de encontrarse.

## Cost of not building it

Cualquiera con un navegador y diez minutos puede llenar la tabla de leads. No hace falta ser un
atacante sofisticado: basta un guion de cinco líneas. El coste llega por tres sitios a la vez —el
almacenamiento de Supabase, el cómputo de las funciones de Vercel y, si el abuso pasa por el camino
completo, **un correo real por cada envío**— y el buzón del equipo comercial queda inservible
justo cuando más se necesita.

Y hay un coste que no se mide en euros: el día que ocurra, no habrá forma de distinguir los leads
reales de los inventados sin revisarlos a mano uno por uno.

## The cheapest alternative

**El cortafuegos de Vercel**, configurado en el panel: bloquea por tasa antes de que la petición
llegue a la aplicación, no guarda nada nuestro, no exige código y deja el aviso de privacidad
intacto. Es genuinamente más barato y se planteó como primera opción.

No se elige por dos razones, y conviene que estén escritas: depende del plan contratado, que no se
ha podido verificar; y **no es incompatible** — sigue siendo la primera barrera recomendable. Lo que
esta spec construye es la red fina que actúa cuando algo pasa la barrera gruesa, dentro de la
aplicación, donde sí se puede razonar sobre qué es un lead.

Queda escrito: si mañana se activa el cortafuegos, esta spec no sobra; se complementan.

## Goals

- Un abuso repetido desde el mismo origen deja de crear filas.
- **Un lead legítimo atrapado por el tope nunca se queda sin camino**: siempre ve qué ha pasado y
  cómo llegar hasta el equipo por otra vía.
- El aviso de privacidad **sigue siendo cierto** después del cambio.
- El tope vive en **un único punto de configuración**: cambiarlo es tocar un valor y nada más.

## Non-goals / out of scope

- **Configurar el cortafuegos de Vercel.** Es panel, no código, y se decide aparte.
- **Una prueba anti-bot** (Turnstile, hCaptcha). Descartada en la conversación: añadiría un
  encargado del tratamiento nuevo y fricción en el último paso del formulario.
- **Bloquear por persona, correo o empresa.** El tope es por origen de la conexión; usar el correo
  invitaría a bloquear a alguien escribiendo su dirección.
- **Un panel para ver o levantar bloqueos.** El bloqueo caduca solo.
- **Proteger cualquier otra cosa del sitio.** Sólo el envío del formulario.
- **Cambiar el cálculo, el catálogo, la puntuación ni el contenido de los correos.**

## Users & context

- **El equipo comercial**, que necesita que su buzón y su tabla sigan siendo utilizables.
- **El lead legítimo**, que puede quedar atrapado sin comerlo ni beberlo: **varias personas de una
  misma empresa comparten una sola dirección pública**. Si cuatro compañeros prueban el estimador la
  misma tarde, para el sistema son el mismo origen. Es el usuario que esta spec debe proteger.
- **Jose**, como responsable del tratamiento: es quien responde si alguien pregunta qué se guarda.

## Behaviour

- **Camino principal:** un envío normal no nota absolutamente nada. Ni espera perceptible ni aviso.
- **Por encima del tope:** el envío se rechaza **antes de guardar nada y antes de enviar ningún
  correo**, y quien lo hizo ve un mensaje que dice, sin rodeos, que se han recibido varios envíos
  desde su conexión, que lo intente en unos minutos, **y una dirección de correo para llegar al
  equipo directamente**.
- **El bloqueo caduca solo** al pasar la ventana de tiempo. Nadie tiene que levantarlo.
- **Lo que se guarda para contar** es una huella técnica del origen, no la dirección en claro, sin
  nombre ni correo, imposible de cruzar con un lead. **Se borra en horas, no en meses.**
- **Si el mecanismo de conteo falla**, el envío **se deja pasar**. Entre perder un lead y aceptar
  uno de más, se acepta uno de más: el tope protege de coste, no de una fuga.
- **El aviso de privacidad gana un párrafo** que declara la huella, para qué sirve, con qué base
  legal y cuánto dura.

## Acceptance criteria

- **CA-L1** — Given un origen sin envíos recientes, When envía el formulario, Then se procesa con
  normalidad y no percibe ninguna diferencia.
- **CA-L2** — Given un origen que ya ha superado el tope de la hora, When vuelve a enviar, Then el
  envío se rechaza **sin crear ninguna fila y sin enviar ningún correo**.
- **CA-L3** — Given un envío rechazado por el tope, When el visitante lo recibe, Then el mensaje le
  dice qué ha pasado **y le ofrece una vía alternativa de contacto**.
- **CA-L4** — Given un origen bloqueado, When pasa la ventana de tiempo, Then vuelve a poder enviar
  sin que nadie intervenga.
- **CA-L5** — Given cualquier envío, When se inspecciona lo que se ha guardado para contar, Then no
  aparece ninguna dirección en claro ni ningún dato que identifique a una persona.
- **CA-L6** — Given el mecanismo de conteo caído, When alguien envía el formulario, Then el envío se
  procesa igualmente.
- **CA-L7** — Given el tope, When hay que cambiarlo, Then se cambia en un único sitio.
- **CA-L8** — Given el aviso de privacidad publicado, When se lee después del cambio, Then describe
  la huella técnica, su finalidad, su base legal y su plazo de conservación.

## Points to clarify

- **suposición tomada** — el tope es **5 envíos por hora y 15 por día** por origen. *Base:* decisión
  de Jose (2026-09-14), sobre el argumento de que el hueco entre el uso legítimo —una oficina de
  cuatro personas curioseando— y una inundación real —cientos por minuto— es tan ancho que afinar el
  número no cambia el resultado. *Riesgo:* una empresa grande con mucha gente detrás de una sola
  salida a Internet podría rozarlo; el mensaje con vía alternativa es la red para ese caso.
- **suposición tomada** — la huella se calcula de forma que no se pueda revertir con una lista de
  direcciones, y se borra en horas. *Base:* una dirección es un dato personal y una huella suya sin
  más sería seudonimización, no anonimización — el espacio de direcciones es pequeño y se recorre por
  fuerza bruta. *Riesgo:* si el secreto que la protege se filtra, la huella vuelve a ser reversible.
- **suposición tomada** — la base legal del párrafo nuevo es el **interés legítimo** en prevenir el
  abuso, no el consentimiento. *Base:* el consentimiento no sirve aquí — se pediría después de haber
  contado, y quien abusa no lo daría. *Riesgo:* es la parte que debe revisar alguien con criterio
  legal, no yo.
- **decisión diferida** — activar el cortafuegos de Vercel como primera barrera.
- **decisión diferida** — avisar a alguien cuando un origen cruza el tope muchas veces.
- **área no formulable** — qué hacer si el abuso llega distribuido desde muchas direcciones a la vez.
  Sospecho que la respuesta no está en la aplicación sino en el borde, y todavía no sé enunciar la
  pregunta sin haber visto un caso real.

## Puerta humana obligatoria

Esta spec **toca texto legal publicado**, así que no puede publicarse sólo con la puerta técnica:

1. **Revisión legal del párrafo nuevo** del aviso de privacidad. La constitución ya exige revisión
   legal de `/privacidad` (superficie S5 del acta de tono) y esa revisión **sigue pendiente desde el
   2026-09-02**. Este cambio la hace más necesaria, no menos.
2. **Firma de la superficie nueva** del acta de tono: el mensaje que ve quien cruza el tope es texto
   que lee un posible cliente en un mal momento, y el principio 28 exige juicio humano sobre él.

Ninguna de las dos la puede dar un agente. Se declaran aquí para que no se publiquen por descuido.
