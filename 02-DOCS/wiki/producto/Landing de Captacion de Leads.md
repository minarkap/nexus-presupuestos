---
type: article
title: Landing de Captación de Leads
description: Qué tiene que hacer el producto, derivado de los criterios comerciales de Nexus, y qué queda sin decidir.
tags: [producto, landing, formulario, requisitos]
timestamp: 2026-08-26T10:42:19Z
aliases: [landing-de-captacion-de-leads]
topic: producto
status: draft
sources: ["[Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)"]
score: 20.0
---

# Landing de Captación de Leads

> Sources: Criterios de estimación económica, edición 2026; conversación de arranque del arnés, 2026-08-26
> Raw: [Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)

## Overview

Una página pública donde un posible cliente describe su reto, recibe **un rango orientativo** de
inversión, y el equipo comercial recibe una ficha cualificada. Es el único producto de este workspace.
Este artículo recoge lo que las fuentes ya determinan y —con la misma claridad— **lo que todavía no
está decidido**, para que nadie lo dé por supuesto.

Base técnica: **Next.js (App Router)**, decidido en [decisions.md](../harness/decisions.md) D-0004.

## Lo que las fuentes ya determinan

**Dos cálculos, no uno.** Las mismas respuestas alimentan dos motores independientes: el
[método de estimación](../comercial/Metodo%20de%20Estimacion%20Economica.md) produce el rango en euros,
y la [cualificación](../comercial/Cualificacion%20de%20Oportunidades.md) produce una puntuación sobre 10.
Comparten tres entradas (tamaño, madurez, plazo) y no comparten nada más.

**El formulario tiene forma conocida.** Las preguntas se derivan de lo que ambos cálculos necesitan:

| Pregunta | Alimenta |
|----------|----------|
| Reto declarado (línea de servicio) | Elección de servicio |
| Qué necesita: diagnóstico / implantación / acompañamiento / desarrollo a medida | Elección de servicio (sólo en la línea de IA) |
| Tamaño de la organización | Estimación (× 0,80 – 1,25) **y** puntuación (+1) |
| Madurez en datos e IA | Estimación (× 0,90 – 1,15) **y** puntuación (+1) |
| Plazo de arranque | Estimación (× 0,95 – 1,15) **y** puntuación (+2 / +1 / −1) |
| Sponsor en dirección | Puntuación (+3 / +1 / 0) |
| Presupuesto | Puntuación (+3 / +2 / 0) |
| Datos de contacto | Aviso interno y email al cliente |

Siete preguntas de negocio más contacto. Ninguna es opcional para el cálculo, lo que deja poco margen
para "acortar el formulario" sin romper un motor.

**Tres salidas, no dos.** Además de las dos ramas por puntuación, existe una tercera que es fácil
olvidar: si el reto declarado cae en **Estrategia y operaciones**, no hay cifra que dar — se deriva a
llamada de alcance explicando por qué. Es una rama sin número.

| Caso | Pantalla final | Email al cliente |
|------|----------------|------------------|
| Cualificado (≥ 6) | Estimación + calendario para agendar con un socio | Propuesta, rango y confirmación de cita |
| No cualificado (< 6) | Estimación + aviso de propuesta. Sin calendario | Propuesta y rango, con invitación a responder |
| Línea sin catalogar | Sin cifra. Invitación a llamada de alcance | Explicación de por qué no damos número aún |

**El aviso interno es un requisito, no un extra.** A oportunidades@nexus-st.com, con contacto,
respuestas completas, servicio aplicable, rango estimado, puntuación **y su desglose**. Sin desglose,
el equipo comercial no puede discutir la decisión.

**El copy tiene reglas.** Ver [Voz de Nexus por Escrito](../firma/Voz%20de%20Nexus%20por%20Escrito.md):
nada de promesas de resultado, urgencia fabricada, descuentos ni plazos. El gancho es demostrar que se
ha entendido el problema.

## Restricciones de arquitectura

1. **El cálculo va en servidor.** Multiplicadores, tabla de puntos y umbral son internos. En el
   navegador, cualquiera los lee. Esta es la razón de fondo por la que Next.js era la elección
   correcta y no una página estática.
2. **El umbral, en un único punto de configuración.** Su dueño ya ha avisado de que lo va a cambiar
   (está marcado *EN REVISIÓN*).
3. **Los rangos caducan el 31-12-2026.** Son configuración con fecha, no constantes.
4. **Datos personales de posibles clientes** → aviso de privacidad, base legal y consentimiento. No es
   opcional. Skill: `gdpr-privacy`.
5. **Formulario público** → spam y bots son una certeza, no un riesgo.
6. **El email es el embudo entero.** Sin base de datos, un email que no llega es un lead perdido para
   siempre. Skill: `email-connector`.

## Lo que NO está decidido

- **El calendario del cualificado.** Nadie ha dicho con qué se agenda ni con qué socio. Es una
  integración externa sin elegir.
- **Proveedor de email** y dominio de envío.
- **Dónde se publica** y con qué dominio.
- **Volumen esperado** de visitas y de envíos.
- **Qué pasa con un lead sin base de datos**: el email es el único registro. Si el equipo no lo
  archiva, no hay histórico.
- **Diseño visual.** El usuario declaró "de cero, propuesta libre", pero los propios documentos de la
  firma traen una identidad clara (serif en titulares, azul marino, acento cobre). Conviene decidir si
  la landing la hereda o no.

## Siguiente paso natural

Esto es materia prima para la skill `specify`: hay suficiente para escribir un spec de verdad, y las
preguntas abiertas son exactamente las que ese spec tiene que cerrar.

## Related

- [Método de Estimación Económica](../comercial/Metodo%20de%20Estimacion%20Economica.md) — el motor de la cifra.
- [Cualificación de Oportunidades](../comercial/Cualificacion%20de%20Oportunidades.md) — el motor de la puntuación y las dos ramas.
- [Catálogo de Servicios y Rangos 2026](../comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md) — los rangos y la línea sin precio.
- [Voz de Nexus por Escrito](../firma/Voz%20de%20Nexus%20por%20Escrito.md) — las reglas del copy.
- [Instrucciones Raíz del Workspace](../meta/Instrucciones%20Raiz%20del%20Workspace.md) — cómo está gobernado este workspace.
