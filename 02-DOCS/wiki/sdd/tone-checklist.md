---
type: checklist
title: Lista de comprobación de tono — bloqueo de publicación
description: La revisión humana que exige CA-19 y el principio 28. Sin acta firmada, el criterio no está verificado.
tags: [sdd, tono, verify, bloqueo-publicacion]
timestamp: 2026-08-26T17:30:00Z
topic: sdd
status: stable
---

# Lista de comprobación de tono

> **Esto no lo puede firmar un agente.** El principio 28 exige revisión humana con acta: quién la
> pasó y cuándo. Hasta que exista esa firma, **CA-19 no está verificado** y la landing no se publica.
> Las pruebas automáticas ya cazan los anti-patrones literales (`landing.test.tsx`,
> `proposal.test.ts`, `outcome.test.ts`); lo que ninguna prueba puede juzgar es si el texto *suena*
> a Nexus.

Fuente del criterio: [Voz de Nexus por Escrito](../firma/Voz%20de%20Nexus%20por%20Escrito.md).

## Superficies a revisar

| # | Superficie | Dónde vive |
|---|---|---|
| S1 | Titular y entradilla de la landing | `03-APP/src/components/Landing.tsx` |
| S2 | Las cuatro líneas de servicio | `03-APP/src/components/Landing.tsx` |
| S3 | Los enunciados de las 8 preguntas | `03-APP/src/components/FormWizard.tsx` |
| S4 | Las etiquetas de las opciones | `03-APP/src/core/options.ts` |
| S5 | Las tres pantallas de resultado | `03-APP/src/core/outcome.ts` |
| S6 | El correo de propuesta al cliente | `03-APP/src/core/proposal.ts` |
| S7 | El aviso interno al equipo | `03-APP/src/core/submit.ts` |

## Qué se comprueba en cada una

| Comprobación | Por qué |
|---|---|
| **No promete resultado.** Ni ROI, ni multiplicadores, ni «garantizamos» | El gancho declarado es demostrar que se entiende el problema, no prometer un final |
| **No fabrica urgencia.** Ni plazas limitadas, ni cuentas atrás | Anti-patrón explícito de la firma |
| **No hay descuentos ni precios cerrados** | Regla innegociable del método de estimación (constitution 6) |
| **No promete plazos de entrega** | Íbid. Ni «en 6 semanas» ni equivalentes |
| **La advertencia de orientativo acompaña a toda cifra** | constitution 5, CA-05 |
| **El correo al cliente se lee como un texto, no como una plantilla** | CA-20: la estructura de la casa está, los rótulos no |
| **No insulta la inteligencia del lector** | El visitante objetivo es un directivo |
| **Suena a la firma, no a una web genérica de consultoría** | Lo único de esta lista que un humano tiene que juzgar de verdad |

## Acta

Rellenar antes de publicar. Una superficie sin marcar es un bloqueo, no un descuido.

| Superficie | ¿Pasa? | Revisor | Fecha | Notas |
|---|---|---|---|---|
| S1 | ☐ | | | |
| S2 | ☐ | | | |
| S3 | ☐ | | | |
| S4 | ☐ | | | |
| S5 | ☐ | | | |
| S6 | ☐ | | | |
| S7 | ☐ | | | |

**Firma de la revisión:** ______________________  **Fecha:** ____________

---

## Deuda de demostración a retirar antes de publicar

- [ ] Borrar `03-APP/src/app/agenda-demo/` (sustituto local de la página de citas, 2026-08-26).
- [ ] Poner la URL real del calendario compartido del equipo en `NEXT_PUBLIC_CALENDAR_URL`.
- [ ] Comprobar que esa página real **acepta ser incrustada** (riesgo R-3). Si no, queda el enlace
      en pestaña nueva, que ya está implementado.
