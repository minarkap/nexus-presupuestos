---
type: article
title: Flujos de n8n de la agenda
description: Diseño de los cinco flujos de n8n (aviso de lead, reserva, cambios, borrados, limpieza del canal), los dos prompts de Perplexity con su esquema de salida, la plantilla del documento y los formatos de Slack.
tags: [stack, n8n, slack, perplexity, google, agenda]
timestamp: 2026-09-30T12:00:00Z
topic: stack
status: draft
sources: ["[Spec — Agenda y preparación de la llamada](../sdd/specs/agenda-y-preparacion-de-llamadas.md)", "[Plan](../sdd/plans/agenda-y-preparacion-de-llamadas.md)", "`01-TOOLS/N8N/contracts/lead-notice.v1.schema.json`"]
---

# Flujos de n8n de la agenda

> **Diseño, no construcción.** Nada de esto existe todavía en n8n: espera a la instancia del proyecto
> (B3), a Slack (B4), a Google (B5) y a Perplexity (B6). Cuando se construya, cada flujo se exporta a
> `01-TOOLS/N8N/workflows/` y este documento se actualiza con lo que cambió.
>
> **Instancia:** solo la de este proyecto. Ninguna otra, y nunca `n8n-templates`.

## Credenciales en n8n (por nombre)

| Nombre en n8n | Tipo | Lo usan |
|---|---|---|
| `Nexus · aviso de lead` | Header Auth: `Authorization` = `Bearer <N8N_LEAD_WEBHOOK_SECRET>` | W1 |
| `Nexus · Slack` | Slack API, token de bot de `01-TOOLS/SLACK` | W1–W5 |
| `Nexus · Google` | Google OAuth2 (Calendar, Drive, Docs) con la cuenta de Jose | W2–W4 |
| `Nexus · Perplexity` | Header Auth: `Authorization` = `Bearer <PERPLEXITY_API_KEY>` | W2 |
| `Nexus · Postgres agenda` | Postgres: rol `n8n_agenda` por el *connection pooler* de Supabase, SSL | W2–W4 |

Dos calendarios de Google:

- **«Llamada de alcance»**: el que recibe las reservas de la página (B1).
- **«Nexus · Preparación»**: uno propio para las entradas internas, que no se comparte con nadie de
  fuera. Recomendado en el plan (§7): es más fácil de limpiar y no ensucia la agenda principal.

## W1 — Aviso de lead (fase A)

```text
Webhook POST /nexus/lead  [auth: Nexus · aviso de lead · responde con el nodo «Respond to Webhook»]
  → IF body.version === 1 ─ no ─→ Respond 400 {error:"version"}
  → Code «mensaje»: construye el texto y los bloques de Slack (formatos abajo)
  → Slack · post message (canal SLACK_CHANNEL_ID)  [On error: continue → rama de error]
      ├─ ok    → Respond 200 {ok:true}
      └─ error → Respond 502 {error:"slack"}
```

- La web espera como máximo 5 s. Si pasa ese tiempo, o recibe algo distinto de 2xx, lo cuenta como
  fallo y el correo interno lo declara (CA-09). **Responde después de publicar**, no al recibir: es
  lo que hace que el «ok» signifique «está en el canal».
- **Sin comparación con el umbral.** La marca de cualificado es `booking_offered`, tal cual llega
  (constitución 9).
- **Sin deduplicación en n8n.** La hace la web con la caché de envíos, la misma garantía que los
  correos (plan §3).

### Formato de Slack de W1

Cualificado (`booking_offered = true`):

```text
🟢 *Lead cualificado* · {contact.company} · {score.total}/10
{contact.name} <{contact.email}>
Servicio: {service_label ?? "Sin catalogar — llamada de alcance"} · Rango: {range_text ?? "sin cifra"}
Desglose: {signal}: {answer} ({points}) · …
Le hemos ofrecido reservar. Te aviso aquí cuando reserve.
{client_email = failed → "⚠️ Su correo NO salió: escríbele a mano."}
{registry = failed → "⚠️ NO quedó guardado en la base: el correo interno es la única copia."}
```

No cualificado: la misma forma, con `⚪ *Lead*` y sin la línea de la reserva. Cierra con «Propuesta
enviada; responderá al correo si quiere avanzar».

## W2 — Reserva confirmada (fase B · se construye **desactivado**)

```text
Google Calendar Trigger «event created» sobre «Llamada de alcance» (sondeo cada minuto)
  → Code «¿es una reserva?»  ← criterio exacto: SPIKE S-1
  → Code «correo del reservante»: el invitado que no es el organizador, en minúsculas
  → Postgres: select … from leads_para_agenda where contact_email = $1 order by submitted_at desc limit 1
  → Switch
      sin fila                      → Slack «📅 Reserva sin lead asociado: {nombre} <{correo}>, {fecha}. Prepárala a mano.»   (CA-18)
      booking_offered = false       → Slack «📅 Reserva de {empresa}, que no cualificaba (¿enlace reenviado?). Sin investigación.» (CA-18b)
      ya hay lead_research          → (lo trata W3)                                                                          (CA-19)
      research_allowed = false      → Slack «📅 {nombre} de {empresa} reservó para {fecha}. Sin investigación: envió el formulario con un aviso anterior.» (CA-21)
      en otro caso ↓
  → Slack «📅 {nombre} de {empresa} ha reservado para {fecha}. Preparo la investigación.»
  → HTTP · Perplexity empresa ─┐  [On error: continue]
  → HTTP · Perplexity persona ─┤  [On error: continue]
  → Code «filtro»: une las dos salidas y DESCARTA toda afirmación sin source_url (CA-17a)
  → Google Docs · crear documento en la carpeta del equipo con la plantilla (abajo)      (CA-16)
  → Google Calendar · crear evento en «Nexus · Preparación»:                             (CA-15)
       inicio = inicio de la reserva − 15 min · fin = inicio de la reserva
       transparencia = libre (no quita huecos) · SIN invitados
       título «Preparar: {empresa} — {nombre}» · descripción = resumen + enlace al documento
  → Postgres · insert lead_research (booking_event_id único → un reintento no duplica)
  → Slack · resumen + enlace al documento + enlace a la entrada                          (CA-14)
  Cualquier paso de investigación en error → Slack «📅 Reserva de {empresa} confirmada; la investigación no está disponible, prepárala a mano.» (CA-20)
```

- **Nunca** se escribe en el evento de la reserva: ni descripción ni adjuntos. Ese evento lo ve el
  lead (spec, regla «el lead nunca ve su investigación»).
- Si el documento se crea pero falla el `insert`, Slack lo avisa con el id del documento (plan, R-10).

## W3 — Cambios de reserva (fase B)

```text
Google Calendar Trigger «event updated» y «event cancelled» sobre «Llamada de alcance»
  → Postgres: select … from lead_research where booking_event_id = $1   (sin fila → no es nuestra: fin)
  → cancelado       → Slack «❌ {empresa} ha cancelado la llamada del {fecha}.» (la investigación se queda hasta su caducidad)
  → cambió la hora  → update lead_research set booking_starts_at
                    → mover el evento «Preparar: …» a la hora nueva − 15 min
                    → Slack «🔁 {empresa} ha cambiado la llamada al {fecha nueva}. La investigación sigue valiendo.» (CA-19)
```

## W4 — Borrados pendientes (fase B)

```text
Schedule diario 04:00 (la retención corre a las 03:17)
  → Postgres: select id, kind, external_id from external_deletions order by queued_at
  → por cada fila: drive_file → Google Drive · borrar fichero · calendar_event → Google Calendar · borrar evento
      ok (o «no existe») → Postgres: delete from external_deletions where id = $1
      error               → se queda para mañana + Slack «⚠️ No pude borrar {kind} {id}; reintento mañana.»
```

## W5 — Limpieza del canal (fase A · puede llegar después; el primer borrado cae en 2027-10)

```text
Schedule diario 04:30
  → Slack · conversations.history (canal, latest = ahora − 365 días, paginado)
  → quedarse SOLO con los mensajes cuyo bot_id es el de nuestra app  (nunca los de una persona)
  → Slack · chat.delete por cada uno
  → error → Slack «⚠️ La limpieza del canal falló; reintento mañana.»                   (CA-26)
```

## Los prompts de Perplexity

Modelo: `sonar-pro`, con salida estructurada (`response_format` de tipo `json_schema`). Idioma de
respuesta: español. Temperatura baja. Los dos prompts comparten el esquema de salida.

**Reglas comunes (van en el mensaje de sistema de los dos):**

```text
Eres un analista que prepara una primera llamada comercial de una consultora. Buscas SOLO información
pública y profesional. Reglas que no se rompen:
1. Cada afirmación lleva la URL de la fuente donde la has leído. Si no tienes fuente, no la escribas.
2. Nada de vida privada, familia, domicilio, redes personales, ni datos de salud, ideología, religión,
   afiliación sindical, orientación sexual u origen étnico. Si una fuente los menciona, ignóralos.
3. Si hay varias personas u organizaciones con el mismo nombre y no puedes distinguirlas con certeza,
   márcalo con possible_homonym = true y no mezcles sus datos.
4. No deduzcas ni inventes. «No encontrado» es una respuesta válida.
5. Responde en español y solo con el JSON pedido.
```

**Empresa** (mensaje de usuario):

```text
Organización: «{contact_company}». Dominio del correo de contacto: «{dominio}». País probable: Andorra o España.
Quiero: a qué se dedica, sector, tamaño aproximado, sedes, noticias de los últimos 18 meses y señales
públicas sobre su tecnología, sus datos o sus procesos (ofertas de empleo, casos publicados, notas de prensa).
```

**Persona** (mensaje de usuario):

```text
Persona: «{contact_name}», que trabaja en «{contact_company}» (dominio «{dominio}»).
Quiero SOLO su perfil profesional público: cargo actual, trayectoria profesional y presencia profesional
pública (ponencias, artículos, entrevistas). Búscala siempre junto a su empresa.
```

**Esquema de salida (los dos):**

```json
{
  "type": "object",
  "required": ["claims", "summary"],
  "properties": {
    "claims": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["topic", "text", "source_url", "confidence", "possible_homonym"],
        "properties": {
          "topic": { "type": "string" },
          "text": { "type": "string" },
          "source_url": { "type": "string" },
          "confidence": { "enum": ["alta", "media", "baja"] },
          "possible_homonym": { "type": "boolean" }
        }
      }
    },
    "summary": { "type": "string" }
  }
}
```

El nodo «filtro» de W2 descarta toda afirmación con `source_url` vacío o que no empiece por
`http`, y marca como dudosa (⚠️) la que tenga `possible_homonym = true` o `confidence = baja`. Su
prueba unitaria (CA-17a) va con respuestas de Perplexity grabadas, junto al flujo exportado.

## Plantilla del documento de Drive

Título: `Preparación · {empresa} · {nombre} · {fecha de la llamada}`. Carpeta del equipo, compartida
**solo** con el equipo (CA-16).

```text
Punto de partida para la llamada, no un veredicto. Las afirmaciones marcadas con ⚠️ pueden ser de otra
persona u organización con el mismo nombre. Todo lo que hay aquí es público y lleva su fuente.

Resumen
  {summary empresa} {cargo de la persona}

La empresa
  • {text} — fuente: {source_url}   (⚠️ si es dudosa)

La persona (solo perfil profesional)
  • {text} — fuente: {source_url}

Del formulario
  Servicio que encaja: {service_label ?? "sin catalogar"}. Respuestas completas: correo interno del {fecha de envío}.

Este documento se borra solo doce meses después de que {nombre} enviara el formulario.
```

## Resumen de Slack de W2 (spec, (d))

```text
📋 *Preparación lista* · {empresa} · llamada el {fecha}
{2–4 líneas del summary de la empresa} · {nombre}: {cargo}
Documento: {enlace} · En tu agenda: {enlace a la entrada «Preparar: …»}
```

Solo el cargo de la persona. El resto va en el documento.

## Spikes antes de construir W2

- **S-1 — Cómo se reconoce una reserva.** Hacer una reserva de prueba en la página y leer el evento
  crudo que ve el disparador: tipo de evento, organizador, invitados, descripción. De ahí sale el
  criterio del nodo «¿es una reserva?» y de dónde se lee el correo del reservante.
- **S-2 — Qué pasa si n8n estuvo caído.** Parar W2, hacer una reserva y volver a activarlo:
  comprobar que el disparador la recoge. Si no la recoge, se añade una reconciliación diaria.

## Pruebas de extremo a extremo (cuando exista cada pieza)

Con datos marcados `Executive Lab (prueba agenda)`, por el camino de `S-0039`:

| Criterio | Prueba |
|---|---|
| CA-06, CA-09 | Enviar un lead de prueba y ver el mensaje en el canal. Parar W1 y enviar otro: el correo interno lo declara |
| CA-13 | Reservar con una cuenta de prueba: llega la confirmación con Meet y el recordatorio |
| CA-14, CA-15, CA-16 | Esa misma reserva: en 15 minutos o menos, mensaje, documento y entrada. La invitación de la cuenta de prueba no los contiene, y el documento no se abre desde fuera del equipo |
| CA-18, CA-18b, CA-18c | Reservar con un correo desconocido, con el de un lead no cualificado y con uno que tenga dos leads |
| CA-19, CA-20, CA-21 | Cambiar la hora; clave de Perplexity inválida en una copia de W2; lead con `research_allowed = false` |
| CA-22 | Borrar el lead de prueba: al día siguiente, documento y entrada borrados |
| CA-26 | Canal de pruebas con un mensaje de la app fechado hace más de un año |
