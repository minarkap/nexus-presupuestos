---
type: spec
title: Spec — Agenda y preparación de la llamada
description: WHAT y WHY para que el lead cualificado pueda reservar de verdad su llamada de alcance, el equipo se entere de cada lead en su canal, y cada llamada reservada llegue preparada con una investigación de la empresa y de la persona que el lead nunca ve.
tags: [sdd, spec, agenda, leads, slack, privacidad]
timestamp: 2026-09-30T09:00:00Z
topic: sdd
slug: agenda-y-preparacion-de-llamadas
status: approved
---

# Spec — Agenda y preparación de la llamada

> Slug: `agenda-y-preparacion-de-llamadas` · Status: **approved** — «Dale! Haz todo lo que puedas hacer ya, y si, instala la skill de n8n» (Jose, 2026-09-30). Las fases siguientes corren en autopilot con ese mismo sí, parando solo ante acciones hacia fuera · Created: 2026-09-30
> Inherits: [constitution](../constitution.md) v1.1.0 · Parte de: [landing-presupuestos-nexus](./landing-presupuestos-nexus.md) (C-06, C-07)
> Origen: conversación con Jose del 2026-09-30. Sus cinco respuestas están en *Users & context*.
> Se entrega en **dos fases**: **A** (reserva y avisos) y **B** (preparación de la llamada). B no se
> activa hasta que el aviso de privacidad lo cuente (principio 23).

## Problem & why

La reserva de la llamada de alcance —la razón de ser de la rama cualificada— **no existe en
producción**. El lead cualificado ve «Reserva un hueco» y debajo «te escribimos con la disponibilidad
del equipo», porque no hay calendario configurado. Y el correo que recibe dice **«Tienes tu cita
confirmada con uno de nuestros socios»**: falso hoy, y falso siempre, porque ese correo sale antes
de que nadie reserve nada. El mejor lead del mes recibe, en el punto de máxima intención, una promesa
que el sistema no cumple y ninguna forma de reservar.

Del lado del equipo, un lead nuevo solo se ve en el buzón de Jose. Quien llega fuera de horas depende
de que alguien lo abra. Y la llamada, cuando ocurre, se hace sin haber mirado quién es la empresa ni
quién es la persona, o con una búsqueda manual de última hora.

## Cost of not building it

- **Cada lead cualificado recibe hoy una afirmación falsa por escrito.** Son pocos —3 leads reales
  en 16 días; la previsión es de decenas al mes (C-08)—, pero cada uno es de los mejores del mes, y lo
  primero que se lleva de la firma es una contradicción entre la pantalla y el correo.
- **Un lead cualificado no tiene forma de reservar.** Depende de que el equipo le escriba, y nada
  avisa al equipo de que tiene que hacerlo, salvo el buzón.
- **La preparación manual de cada llamada cuesta unos minutos.** A este volumen es **poco coste**:
  ese es el hallazgo honesto, y queda escrito. Automatizarla es una decisión de Jose, con la objeción
  registrada abajo.

## The cheapest alternative

Crear la página de reservas en Google (trae la videollamada y los recordatorios sin construir nada),
poner su enlace donde hoy está el hueco vacío, corregir la frase falsa del correo, y que el equipo
investigue a mano antes de cada llamada.

Esto resuelve el problema grave (G1 y G4) y es, casi entero, **la fase A de esta spec**. Lo que no
cubre: el equipo sigue sin enterarse de un lead fuera del buzón, y la preparación sigue siendo manual.
La fase A añade encima solo el aviso al canal. La fase B —la investigación— es la parte que la
alternativa barata no da y la que menos devuelve a este volumen. Se construye porque Jose lo ha
decidido así (respuesta 4 y objeción O-2).

## Goals

- **G1.** El lead cualificado puede reservar su llamada de alcance **él solo**, desde la pantalla de
  resultado y desde su correo, y **nada le promete una cita que no ha reservado**.
- **G2.** El equipo se entera de **cada** lead en su canal de Slack en el momento en que llega, con lo
  necesario para decidir qué hacer, y los cualificados se distinguen a simple vista.
- **G3.** Cuando un lead reserva, la llamada **llega preparada**. Hay una investigación de la empresa
  y de la persona, legible por el equipo desde su propia agenda y desde el canal, y guardada junto al
  resto del lead.
- **G4.** La confirmación, el enlace de videollamada y los recordatorios llegan al lead **sin que
  nadie del equipo intervenga**.
- **G5.** Nada de esto rompe lo que ya está garantizado:
  - el lead se guarda y el correo interno sale aunque falle cualquier pieza nueva;
  - nadie ve su puntuación;
  - el umbral sigue en un solo punto;
  - el aviso de privacidad sigue diciendo la verdad.

## Non-goals / out of scope

- **Enlace de reserva para quien no cualifica.** Explícito, respuesta 3 de Jose: solo lo reciben
  quienes hoy ven el calendario.
- **Seguimiento de quien no reserva** («aún no has reservado tu llamada»). Ni recordatorio ni segundo
  correo.
- **Investigar a quien no reserva.** La investigación prepara una llamada; sin llamada, no hay nada
  que preparar.
- **Investigar leads enviados antes del nuevo aviso de privacidad.** Consintieron a otra cosa.
- **Un panel para consultar investigaciones**, y cualquier integración con un CRM.
- **Cambios en los motores**, la puntuación, el umbral o el catálogo.
- **Gestión de cancelaciones y cambios de hora** más allá de avisar al equipo.
- **Borrar los leads de prueba de la tabla.** Pendiente ya registrado en `S-0039`; va aparte.

## Users & context

- **El lead cualificado.** Directivo de una pyme, una scaleup o una empresa familiar, que acaba de ver
  su rango. Es el momento de más intención de todo el recorrido: si aquí puede reservar, reserva.
- **El lead no cualificado.** Ve su rango y la invitación a responder al correo. **Para él no cambia
  nada**, salvo que el equipo ahora se entera por el canal.
- **El equipo comercial de Nexus** (hoy, Jose). Trabaja en Slack y en la suite de Google: Calendar,
  Meet y Drive. Quiere enterarse sin mirar el buzón y llegar a la llamada sabiendo con quién habla.

**Restricción dada por Jose.** La coordinación entre servicios vive en **n8n**, la herramienta de
automatizaciones. Es un *cómo*, así que el plan la recoge; la spec solo exige lo que se ve desde fuera.

**Las cinco respuestas de Jose (2026-09-30)**, que fijan esta spec:

1. «Clientes grandes» = **los que cualifican por puntuación**. Es el mismo criterio que hoy decide
   quién ve el calendario.
2. Aviso en Slack **para todos los leads**, con los cualificados marcados. **El correo interno de hoy
   se mantiene** como red.
3. El enlace de reserva va **dentro del correo de propuesta** que ya recibe, **solo para los que
   cualifican**. No hay un segundo correo.
4. Se investiga **la empresa y la persona**. La recomendación era solo la empresa; ver O-2.
5. La investigación se ve **desde la agenda** y **se guarda con el lead**. Jose propuso la
   descripción de la cita o un documento de Drive enlazado desde ella. La spec lo resuelve con un
   documento del equipo enlazado desde **una entrada interna de la agenda**, porque la descripción de
   la cita **la ve también el lead** (ver *Behaviour* y la suposición correspondiente).

## Behaviour

### Al enviar el formulario (fase A)

- **Main — cualificado.** Pasa lo mismo que ya decide hoy el sistema, pero ahora es real:
  - la pantalla de resultado muestra el calendario de reservas;
  - el correo de propuesta incluye el enlace para reservar;
  - la regla de quién lo recibe es **exactamente** la que hoy decide quién ve el calendario, incluido
    el lead sin catalogar que supera el umbral (spec original, tabla de salidas).
- **Main — no cualificado.** No aparece ningún enlace de reserva, ni en pantalla ni en el correo. Su
  correo sigue invitándole a responder.
- **Main — aviso al equipo.** Por **cada** lead válido llega **un** mensaje al canal del equipo. Lleva:
  - quién es y de qué empresa;
  - qué servicio encaja y qué rango se le dio (o que no hay cifra, si es la línea sin catalogar);
  - la puntuación con su desglose;
  - una marca visible de si cualifica;
  - si su correo salió bien.
- **El correo de propuesta nunca afirma una cita.** Sale antes de que el lead reserve, así que como
  mucho le **invita** a reservar. La confirmación que llega **después** de reservar la manda la
  propia agenda y sí da la cita por hecha, porque ya lo es.
- **Cada lead recuerda qué aviso de privacidad aceptó.** El sistema guarda con cada lead la versión
  del aviso vigente cuando envió el formulario. Hoy no la guarda; empieza a hacerlo en esta fase,
  porque la fase B depende de ello.
- **Edge — el enlace no está configurado.** Ni la pantalla ni el correo prometen nada que no existe.
  Los dos dicen que el equipo le escribirá con disponibilidad, que es lo que dice hoy la pantalla.
- **Edge — envío repetido** (doble clic, reintento): un solo aviso en el canal, igual que hoy un solo
  correo.
- **Edge — envío rechazado** (datos no válidos, tope de frecuencia): no hay aviso. El canal solo ve
  leads de verdad.
- **Error — el aviso al canal falla.**
  - El lead se guarda igual y los dos correos salen igual.
  - **El correo interno dice que el aviso no salió.** Un fallo que no se ve desde ningún sitio es el
    que la casa ya decidió no volver a tener (`S-0038`).

### Al reservar (fase B, salvo la confirmación)

- **Main — confirmación.** El lead recibe la confirmación de su cita con el enlace de videollamada, y
  después los recordatorios. Todo lo hace la propia agenda según su configuración: no se construye
  (G4).
- **Main — el equipo se entera.** Llega al canal un mensaje: quién ha reservado, de qué empresa y
  para cuándo.
- **Regla — cómo se asocia una reserva a un lead.** Se busca por **el correo que el lead escribe al
  reservar**, sin distinguir mayúsculas, entre los leads de los últimos **60 días**.
  - Si ese correo tiene varios leads, cuenta **el más reciente**.
  - Solo se investiga si ese lead **recibió el enlace de reserva**, es decir, si cualificaba.
  - Si el correo es de un lead que no cualificaba (por ejemplo, porque le reenviaron el enlace), el
    canal avisa de la reserva, dice que ese lead no cualificaba y no se investiga a nadie.
- **Main — la preparación.** Poco después de la reserva, sin que nadie haga nada, la investigación de
  la empresa y de la persona queda en cuatro sitios:
  - **(a)** en un documento que **solo el equipo** puede abrir;
  - **(b)** enlazada desde **una entrada de la agenda del equipo** asociada a esa llamada, que el
    lead no recibe y no ve;
  - **(c)** guardada junto al lead;
  - **(d)** resumida en el canal. El resumen son pocas líneas, centradas en la empresa; de la persona
    solo dice su cargo. El resto está en el documento enlazado.
- **Regla — el lead nunca ve su investigación.** Ni en su invitación, ni en la descripción de su
  cita, ni como enlace (aunque no pudiera abrirlo, el enlace ya dice que existe).
- **Regla — qué se investiga.** Solo información **pública y profesional**:
  - de la empresa: a qué se dedica, sector, tamaño, noticias recientes, señales sobre su tecnología o
    sus procesos;
  - de la persona: su cargo, su trayectoria profesional y su presencia profesional pública.

  Nunca su vida privada, su familia, sus redes personales ni ningún dato de categoría especial (salud,
  ideología, religión, etc.).
- **Regla — el informe se puede comprobar.** Cada afirmación lleva su fuente. Lo que sea dudoso se
  marca como dudoso, en particular una persona con el mismo nombre que otra. Es un punto de partida
  para el equipo, no un veredicto.
- **Edge — reserva que no casa con ningún lead.** Por ejemplo, alguien reserva con otro correo o con
  un enlace reenviado. El canal avisa de una reserva sin lead asociado y no se investiga a nadie.
- **Edge — el mismo lead reserva otra vez o cambia la hora.** Se hace una sola investigación. El canal
  dice que es un cambio y no una llamada nueva.
- **Edge — cancelación.** El canal avisa. La investigación se conserva hasta su caducidad normal.
- **Edge — el lead envió el formulario antes del nuevo aviso de privacidad.** No se investiga, y el
  canal dice por qué.
- **Error — la investigación falla.** El canal avisa: «reserva confirmada; investigación no
  disponible, prepárala a mano». La reserva del lead no se entera ni se ve afectada.
- **Conservación.** Cuando el lead caduca a los doce meses, **la investigación y todas sus copias**
  desaparecen con él: el documento, la entrada interna de la agenda y lo guardado junto al lead. La
  excepción es la de siempre: los leads que dieron lugar a relación comercial.
- **Conservación del canal (fases A y B).** Los mensajes del canal sobre cualquier lead —el aviso de
  llegada, el de reserva y el resumen— **desaparecen a los doce meses** de publicarse, sin excepción.
  El canal es un aviso, no un archivo: lo que haya que conservar de un cliente vive en su registro.

## Acceptance criteria

### Fase A — reserva y avisos

- **CA-01.** Given un lead que cualifica y el enlace de reserva configurado, When envía el formulario,
  Then la pantalla muestra el calendario de reservas **y** el correo de propuesta contiene el enlace.
- **CA-02.** Given un lead que no cualifica, When envía el formulario, Then ni la pantalla ni el
  correo contienen un enlace de reserva.
- **CA-03.** Given un lead sin catalogar que supera el umbral, When envía, Then recibe el enlace en
  pantalla y en el correo, igual que cualquier cualificado.
- **CA-04.** Given el enlace de reserva **no** configurado, When un lead cualificado envía, Then ni la
  pantalla ni el correo afirman una cita, y los dos dicen que el equipo le escribirá con
  disponibilidad.
- **CA-05.** Given el correo de propuesta que envía el sistema, en cualquiera de sus ramas, Then no
  contiene «cita confirmada» ni ninguna frase que dé una reserva por hecha. La confirmación que envía
  la agenda después de reservar queda fuera de este criterio.
- **CA-06.** Given un lead válido, When envía, Then llega **exactamente un** mensaje al canal del
  equipo. Contiene nombre, empresa, servicio (o «sin cifra»), rango, puntuación con desglose, marca de
  cualificación y estado del correo al lead.
- **CA-07.** Given el mismo envío repetido, When se procesa dos veces, Then hay un solo mensaje en el
  canal.
- **CA-08.** Given un envío rechazado por validación o por el tope de frecuencia, Then no hay mensaje
  en el canal.
- **CA-09.** Given que el aviso al canal falla, When un lead envía, Then el lead queda guardado, los
  dos correos salen, y el correo interno declara que el aviso no salió.
- **CA-10.** Given cualquier pantalla o correo que ve el lead, Then no aparece su puntuación, el
  umbral ni ninguna señal de clasificación más allá de la que ya existe: tener o no calendario
  (principio 11).
- **CA-11.** Given un cambio del umbral en su único punto de configuración, Then cambia a la vez quién
  recibe el enlace y quién sale marcado en el canal, sin tocar nada más (principio 9).
- **CA-12.** Given los textos nuevos que ve el lead —correo, pantalla y los de la página de reservas
  (título, descripción y texto de confirmación)—, Then existe el acta de la lista de tono firmada por
  una persona (principios 28 y 36).
- **CA-13.** Given un lead que reserva, When se confirma la reserva, Then recibe confirmación con
  enlace de videollamada y, antes de la cita, al menos un recordatorio, sin intervención del equipo.
  *(Es configuración de la agenda y pertenece a la fase A.)*
- **CA-24.** Given la fase A publicada, Then el aviso de privacidad publicado ya nombra, entre quienes
  reciben los datos, la mensajería interna del equipo y la herramienta de automatización (principio
  23).
- **CA-25.** Given un lead que envía el formulario, Then queda guardada con él la versión del aviso
  de privacidad vigente en ese momento.
- **CA-26.** Given un mensaje del canal sobre un lead publicado hace más de doce meses, Then ya no
  está en el canal.

### Fase B — preparación de la llamada
- **CA-14.** Given una reserva que casa con un lead, When se confirma, Then en **15 minutos como
  máximo**:
  - hay un mensaje en el canal con la fecha y un resumen de la investigación;
  - existe el documento del equipo con la investigación;
  - existe la entrada interna de la agenda que lo enlaza;
  - la investigación está guardada junto al lead.
- **CA-15.** Given la invitación y la cita que ve el lead, Then no contienen la investigación ni
  ningún enlace a ella.
- **CA-16.** Given el documento de investigación, When lo intenta abrir alguien de fuera del equipo,
  Then no puede.
- **CA-17a.** Given un informe de investigación, Then **cada** afirmación lleva una fuente. Una
  afirmación sin fuente no llega al informe. Es una comprobación automática.
- **CA-17b.** Given los **tres primeros** informes reales, Then una persona los ha revisado y firmado
  un acta de que no contienen datos de vida privada ni de categoría especial, y de que los posibles
  homónimos van marcados como dudosos. Sin acta, la fase B no se da por verificada.
- **CA-18.** Given una reserva cuyo correo no casa con ningún lead de los últimos 60 días, Then el
  canal avisa y no se investiga a nadie.
- **CA-18b.** Given una reserva cuyo correo casa con un lead que **no** recibió el enlace, Then el
  canal avisa de que ese lead no cualificaba y no se investiga a nadie.
- **CA-18c.** Given un correo con varios leads en los últimos 60 días, When reserva, Then la reserva
  se asocia al más reciente.
- **CA-19.** Given que un lead cambia la hora de su reserva, Then no se hace una segunda investigación
  y el canal lo señala como cambio.
- **CA-20.** Given que la investigación falla, Then el canal lo dice y la reserva del lead sigue
  intacta.
- **CA-21.** Given un lead enviado antes de la versión del aviso de privacidad que cuenta la
  investigación, When reserva, Then no se le investiga y el canal lo dice.
- **CA-22.** Given un lead que caduca a los doce meses y no está protegido, Then desaparecen su
  investigación y todas sus copias.
- **CA-23.** Given que el aviso de privacidad publicado **no** cuenta la investigación, Then la
  investigación no se ejecuta para nadie (principio 23).

## Objeciones registradas (no bloquean)

- **O-1 — Volumen.** Con el volumen actual y el previsto (decenas al mes), investigar a mano cuesta
  menos que mantener la automatización. Jose decide automatizar. Se registra para que, si dentro de
  unos meses la fase B se mantiene más de lo que ahorra, la decisión se pueda revisar con el dato.
- **O-2 — Investigar a la persona.** La recomendación era investigar solo la empresa, que prepara la
  llamada igual y es mucho menos delicado. Jose decide investigar las dos. Consecuencias:
  - el aviso de privacidad cambia más, porque habrá datos personales obtenidos de otras fuentes;
  - la regla de «solo público y profesional» y la de las fuentes (CA-17) dejan de ser opcionales;
  - la base legal necesita revisión (ver *Points to clarify*).

## Points to clarify

- **suposición tomada** — La regla de quién recibe el enlace es la misma que hoy decide quién ve el
  calendario, incluida la rama sin catalogar cualificada. *Base:* respuesta 1 de Jose y la tabla de
  salidas de la spec original. *Riesgo:* si Jose quería excluir la rama sin catalogar, CA-03 se
  invierte.
- **suposición tomada** — La investigación **no** va en la descripción de la cita del lead, sino en
  una entrada interna de la agenda del equipo que enlaza el documento. *Base:* la descripción de una
  cita de agenda la ve también el invitado. Escribir ahí la investigación se la enseñaría al propio
  lead. *Riesgo:* ninguno de producto; si Jose quiere verla «dentro» de la misma cita, no hay forma de
  hacerlo sin que el lead la vea.
- **suposición tomada** — Al principio hay **una** página de reservas, la de Jose. *Base:* la spec
  original quería una página compartida del equipo (C-07), pero hoy el equipo comercial es Jose.
  *Riesgo:* cuando haya más socios, habrá que ver si la agenda permite una página compartida o hace
  falta otra forma. No cambia el comportamiento que ve el lead.
- **suposición tomada** — El mensaje del canal lleva la puntuación y su desglose. *Base:* el correo
  interno ya los lleva y el canal es igual de interno. *Riesgo:* si al canal entra alguien que no
  debería verlos, sobra el desglose.
- **suposición tomada** — La entrada interna de la agenda **no ocupa hueco**: no quita disponibilidad
  a la página de reservas. *Base:* si ocupara, cada reserva bloquearía también el hueco anterior.
  *Riesgo:* ninguno visible para el lead.
- ~~**pregunta abierta**~~ **resuelta el 2026-09-30 (`S-0044`): interés legítimo**, por delegación de Jose y sin asesoría (demo). Pregunta original: ¿Con qué base legal se investiga a la persona: la misma casilla de
  consentimiento, ampliada a esta finalidad, o el interés legítimo en preparar una reunión que el
  propio lead ha pedido? Es para la revisión del aviso (skill `gdpr-privacy`) y bloquea la activación
  de la fase B, no su construcción.
- **pregunta abierta** — ¿Qué plan de Google Workspace tiene la firma, y permite su página de reservas
  enviar recordatorios? CA-13 depende de ello. Si el plan no lo permite, G4 cambia a «confirmación
  con videollamada», sin recordatorios.
- **pregunta abierta** — ¿En qué espacio y canal de Slack se avisa?
- **suposición tomada** — Los mensajes del canal se borran a los doce meses **todos**, también los de
  leads protegidos por relación comercial. *Base:* el canal es un aviso, no un registro; los datos del
  cliente siguen en la base. *Riesgo:* si el equipo usa el canal como histórico, lo perderá; la
  alternativa es aplicar al canal la misma excepción que a la base.
- **suposición tomada** — Una reserva se asocia a un lead por el correo, dentro de 60 días.
  *Base:* es el único dato que el lead escribe en los dos sitios; 60 días cubre de sobra el plazo
  entre recibir el enlace y reservar. *Riesgo:* quien reserve con otro correo queda sin preparar
  (CA-18); el equipo lo ve en el canal y lo prepara a mano.
- **decisión diferida** — Seguimiento de quien cualifica y no reserva. Fuera de este ciclo.
- **decisión diferida** — Qué hacer con la investigación cuando se cancela la cita, más allá de
  conservarla hasta su caducidad.
- **área no formulable** — Si la investigación de verdad sirve para la llamada. Solo se sabrá después
  de unas cuantas llamadas reales; puede acabar pidiendo otro formato o menos contenido.

## Revisions

- 2026-09-30 — Borrador inicial, con las cinco respuestas de Jose.
- 2026-09-30 — Revisión en frío (revisor sin contexto de la conversación): seis problemas, los seis
  incorporados.
  1. CA-05 chocaba con la confirmación de Google, y queda limitado al correo de propuesta.
  2. La conservación olvidaba el canal: se añaden el borrado a doce meses y CA-26.
  3. La fase A también da datos a encargados nuevos: CA-24, y guardar la versión del aviso pasa a la
     fase A (CA-25).
  4. La asociación reserva–lead no estaba definida: se añaden la regla, CA-18b y CA-18c.
  5. CA-17 no era binario: se parte en una comprobación automática (17a) y un acta humana (17b).
  6. CA-12 no cubría los textos de la página de reservas, y CA-13 estaba en la fase equivocada.
- 2026-09-30 — **Aprobada**: «Dale! Haz todo lo que puedas hacer ya, y si, instala la skill de n8n» (Jose, 2026-09-30), en respuesta a «¿apruebas la spec y el plan?».
- 2026-09-30 — Base legal resuelta (`S-0044`). Jose creó la página de reservas; solo sirve su versión para incrustar (`S-0043`).
