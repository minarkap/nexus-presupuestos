---
type: article
title: Borrador del aviso de privacidad — agenda y preparación de la llamada
description: Los cambios que necesita el aviso de privacidad para las dos fases de la agenda. Fase A, pequeño y obligatorio antes de publicar; fase B, la investigación de la empresa y la persona que reservan. Con la base legal razonada y la evaluación de interés legítimo en borrador. NO PUBLICADO.
tags: [producto, privacidad, gdpr, agenda, borrador]
timestamp: 2026-09-30T12:30:00Z
topic: producto
status: draft
sources: ["[Spec — Agenda y preparación de la llamada](../sdd/specs/agenda-y-preparacion-de-llamadas.md)", "`03-APP/src/content/privacidad.ts` (aviso vigente, aprobado por Jose el 2026-09-14)"]
---

# Borrador del aviso de privacidad — agenda y preparación de la llamada

> **BORRADOR. No es asesoramiento jurídico y no está publicado.** Lo ha redactado un agente para la
> spec `agenda-y-preparacion-de-llamadas`. Antes de publicarlo lo tiene que revisar y aprobar Jose
> y, si la firma cuenta con ella, una asesoría de privacidad o un DPO. El aviso vigente tampoco pasó
> por asesoría externa (`S-0031`).
>
> - La **fase A** (apartado 2) va en el código de la rama `feat/agenda-y-preparacion-de-llamadas`
>   (tarea T016), porque la fase A no se puede publicar sin ella (CA-24).
> - La **fase B** (apartado 3) **no está en el código**. Cuando se apruebe, se copia a
>   `privacidad.ts`, se pone `coversResearch: true`, se cambia la fecha y se publica. Solo a partir
>   de ese momento se investiga, y solo a quien envíe el formulario después (CA-21, CA-23).

## 1. Qué tratamiento nuevo hay (el inventario manda)

El aviso tiene que describir lo que el sistema hace, ni más ni menos. Esto es lo que cambia:

| Actividad | Datos | Origen | Quién los trata | Dónde | Cuánto tiempo |
|---|---|---|---|---|---|
| **A1** Aviso al equipo de cada solicitud | Nombre, correo y organización; servicio, rango y puntuación interna | El formulario (art. 13) | Nexus; Slack y n8n como encargados | Posiblemente fuera del EEE | 12 meses: la limpieza del canal los borra (CA-26) |
| **A2** Enlace de reserva en el correo | Ninguno nuevo: el enlace va en el correo que ya se envía | — | Resend (ya declarado) | — | — |
| **B1** Preparación de la llamada, **solo si la persona reserva** | Información pública y profesional de la organización y de la persona: cargo, trayectoria y presencia profesional pública | **Fuentes públicas de internet** (art. 14), a través de un buscador | Nexus; Perplexity, Google (Drive, Calendar) y Slack como encargados | Perplexity en EE. UU.; los demás, posiblemente fuera del EEE | 12 meses desde el envío del formulario, con todas sus copias (CA-22) |

**No hay decisiones automatizadas.** La investigación no decide nada ni cambia la cifra, la
puntuación o si se atiende a la persona: la lee una persona del equipo antes de una llamada que
el propio lead ha pedido.

**No se buscan categorías especiales** (art. 9) ni datos de vida privada. Las instrucciones del
buscador los excluyen expresamente y los tres primeros informes pasan revisión humana con acta
(CA-17b).

## 2. Fase A — el cambio pequeño (va en el código, T016)

**«Quién los recibe», primer párrafo:**

> El equipo comercial de Nexus Consulting, por correo electrónico y por nuestra herramienta de
> mensajería interna, y un registro interno de solicitudes. Para enviar los correos, avisar al equipo
> y mantener ese registro usamos proveedores de servicios —de correo, de mensajería interna, de
> automatización y de base de datos— que tratan los datos por cuenta nuestra, con las garantías
> contractuales que exige la normativa de protección de datos.

**«Quién los recibe», segundo párrafo** (el enlace ahora también llega por correo):

> Si tu solicitud cumple los criterios para reservar una llamada, verás en la pantalla de resultado, y
> recibirás en tu correo, el enlace a un calendario de citas de un proveedor externo. Ese calendario
> puede utilizar cookies propias; su uso se rige por la política de privacidad del proveedor.

**«Transferencias fuera de la Unión Europea», segundo párrafo:**

> Los proveedores de correo, registro, calendario, mensajería interna y automatización pueden tratar
> los datos en países fuera del Espacio Económico Europeo. En esos casos nos apoyamos en las
> cláusulas contractuales tipo aprobadas por la Comisión Europea o en el marco de adecuación aplicable
> al proveedor.

**Fecha de actualización:** la del día en que se publique la fase A.

## 3. Fase B — la investigación (NO en el código hasta que se apruebe)

### 3.1 La base legal: la decisión que queda abierta

| Opción | A favor | En contra |
|---|---|---|
| **Consentimiento**, ampliando la casilla actual | Una sola base para todo el aviso | La casilla ya cubre «calcular y enviarte la estimación». Meter dentro una finalidad distinta lo convierte en un consentimiento **agrupado**, que no es específico (art. 4.11, cdo. 32). Hacerlo bien exige **una segunda casilla**, y eso cambia el formulario, que queda fuera de esta spec |
| **Interés legítimo** (art. 6.1.f), con evaluación escrita | Encaja con lo que pasa: la persona **ha pedido** la llamada y espera que quien la atiende sepa con quién habla. Se informa antes y se puede oponer con un correo | Exige la evaluación de interés legítimo (abajo), fechada y guardada, **antes** de empezar |

**Recomendación del borrador: interés legítimo**, con la evaluación del apartado 3.2 y el derecho de
oposición bien visible.

> **Decidido el 2026-09-30 (`S-0044`): interés legítimo.** Jose delegó: «como de momento esto es una
> demo no hace falta que hagas nada, pero si quieres haz de nuevo una base legal coherente». Se
> adopta la recomendación. **Sin asesoría y sin firma de una persona**: vale para la demo, no para
> publicar con leads reales sin revisarlo antes.

### 3.2 Evaluación de interés legítimo (borrador, para fechar y firmar)

1. **Finalidad.** Preparar una llamada de alcance de 30 minutos que la persona ha reservado ella
   misma, para que la conversación sirva: entender a qué se dedica su organización y qué papel tiene
   quien llama. Es un interés legítimo, real y actual: la reunión existe.
2. **Necesidad.** ¿Hay una forma menos intrusiva?
   - Investigar solo la organización es menos intrusivo. Se valoró y se recomendó (spec, objeción
     O-2), y Jose decidió incluir a la persona.
   - La medida que lo hace proporcionado: **solo** perfil profesional público, **solo** de quien
     reserva, **nunca** de quien no reserva, y con fuente para cada dato.
   - El resto se minimiza. El mensaje del canal solo da el cargo y el documento se borra con el lead.
3. **Ponderación.**
   - Expectativa razonable: alta para la organización. Para la persona, razonable si se le avisa
     **antes**, que es lo que hace este aviso.
   - Impacto: bajo. Es información que la propia persona o su organización ha hecho pública, no se
     toma ninguna decisión con ella y se borra a los doce meses.
   - Salvaguardas: oposición por correo sin justificar; no se investiga a nadie enviado antes de este
     aviso; revisión humana de los primeros informes; los homónimos van marcados.
   - Resultado propuesto: **la ponderación se supera**, siempre que se mantengan estas salvaguardas.

Fecha: 2026-09-30 · Firma: **sin firma de una persona** (demo; delegación de Jose, `S-0044`)

### 3.3 Texto propuesto

**«Qué datos recogemos»**, párrafo nuevo tras el primero:

> Si reservas una llamada con nosotros, antes de ella buscamos información **pública y profesional**
> sobre tu organización y sobre ti: a qué se dedica la organización, su sector y noticias recientes,
> y tu cargo, tu trayectoria profesional y tu presencia profesional pública. La obtenemos de fuentes
> abiertas de internet, a través de un proveedor de búsqueda. Nunca buscamos datos de tu vida privada
> ni de categorías especiales, como salud, ideología o creencias. Si no reservas, no buscamos nada.

**«Para qué los usamos»**, frase añadida al primer párrafo:

> Si reservas la llamada, también para prepararla: que quien te atienda sepa de antemano con quién va
> a hablar y a qué se dedica tu organización.

**«Con qué base legal»**, párrafo nuevo (si se elige interés legítimo):

> La información pública que buscamos cuando reservas una llamada no se apoya en tu consentimiento
> sino en nuestro interés legítimo en preparar una reunión que tú has pedido. Hemos valorado que es
> lo que cabe esperar de quien te atiende y que el impacto para ti es bajo. Puedes oponerte en
> cualquier momento escribiendo a hola@nexus.ad: dejamos de buscar y borramos lo encontrado.

**«Quién los recibe»**, frase añadida:

> Para buscar esa información y guardarla usamos un proveedor de búsqueda y nuestras herramientas de
> documentos, calendario y mensajería interna, que tratan los datos por cuenta nuestra. El resultado
> solo lo ve el equipo: no se comparte contigo ni con nadie más.

**«Transferencias»:** añadir «búsqueda» a la lista de proveedores del segundo párrafo.

**Sin cambios:** el derecho a reclamar ante la autoridad de control (la Agència Andorrana de Protecció
de Dades o la de tu país de residencia), el responsable y el resto de derechos ya están en el aviso
vigente y valen también para esta finalidad.

**«Cuánto tiempo los conservamos»**, frase añadida al primer párrafo:

> Lo que hayamos buscado para preparar tu llamada se borra a la vez que tu solicitud, incluidas todas
> sus copias.

**«Tus derechos»**, frase añadida al primer párrafo:

> También puedes oponerte a que preparemos tu llamada con información pública: basta con decírnoslo
> en el mismo correo.

## 4. Antes de publicar la fase B

- [x] Base legal elegida: interés legítimo (`S-0044`). Evaluación fechada, **sin firma humana** (demo).
- [ ] Asesoría o DPO, si la hay, revisa el texto.
- [ ] Contrato de encargado (art. 28) o cláusulas equivalentes con cada proveedor nuevo, y mecanismo
      de transferencia verificado:
  - **Perplexity**: condiciones de la API sobre retención y entrenamiento; cláusulas contractuales
    tipo o marco de privacidad UE-EE. UU., **solo si su certificación está vigente** (B6);
  - **Slack**, **n8n** (en la nube o autoalojado; cambia quién es el encargado) y **Google
    Workspace**: sus condiciones de tratamiento de datos.
- [ ] **Evaluación de impacto:** se ha revisado si hace falta. No hay categorías especiales, ni gran
      escala (decenas al mes), ni vigilancia sistemática, ni decisiones automatizadas, así que no
      parece obligatoria. Que la revisión quede apuntada, y si la asesoría opina otra cosa, se hace.
- [ ] Acta de tono de la superficie S5 (principio 28).
- [ ] Copiar el texto a `privacidad.ts`, poner `coversResearch: true` y cambiar la fecha en el mismo
      commit, y publicar. **Después** se activan W2–W4.
