---
type: article
title: Catálogo de Servicios y Rangos 2026
description: Los seis servicios catalogados de Nexus con sus rangos oficiales 2026, y la línea que deliberadamente no tiene precio.
tags: [catalogo, precios, servicios, 2026]
timestamp: 2026-08-26T10:39:25Z
aliases: [catalogo-de-servicios-y-rangos-2026]
topic: comercial
status: stable
sources: ["[Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)"]
score: 12.0
---

# Catálogo de Servicios y Rangos 2026

> Sources: Nexus Strategy & Technology, edición 2026 (documento interno, válido hasta 2026-12-31)
> Raw: [Criterios de estimación económica](../../raw/comercial/2026-08-26-criterios-estimacion-economica.md)

## Overview

Seis servicios catalogados, cada uno con un rango oficial en euros que **ninguna estimación puede
rebasar**. El catálogo es cerrado por diseño: es el mecanismo que impide que una cifra improvisada
salga de la firma. Una séptima línea —Estrategia y operaciones— existe comercialmente pero
deliberadamente **no tiene rango**, y eso es una decisión, no un olvido.

## Los seis rangos oficiales

| Servicio | Rango oficial 2026 | Cuándo aplica |
|----------|--------------------|---------------|
| AI Opportunity Assessment | 18.000 – 35.000 € | Diagnóstico de oportunidades de IA, priorización de casos de uso, business case. |
| AI Transformation Program | 90.000 – 350.000 € | Programa completo con implantación y gestión del cambio. |
| AI Executive Advisory | 6.000 – 15.000 € / mes | Acompañamiento continuo a comité de dirección. **Siempre cuota mensual.** |
| Cyber Resilience Assessment | 20.000 – 60.000 € | Resiliencia, Zero Trust, cumplimiento NIS2 / DORA. |
| ESG Strategy & Compliance | 25.000 – 80.000 € | Estrategia ESG, CSRD, doble materialidad, taxonomía verde. |
| Custom AI Solutions | desde 40.000 € | Desarrollo a medida. **Rango abierto por arriba**; el techo se cierra en llamada. |

Dos particularidades que cualquier implementación debe respetar: *AI Executive Advisory* se expresa en
€/mes y no en importe total, y *Custom AI Solutions* no tiene techo publicable — su extremo superior
se sustituye por «a confirmar en llamada de alcance».

## La línea sin precio

**Estrategia y operaciones no tiene producto catalogado.** Su alcance varía demasiado entre encargos
para admitir un rango estándar, y el documento es explícito: no existe cifra oficial y **no se puede
estimar por aproximación a otra**. Toda petición que caiga aquí se deriva a llamada de alcance,
explicando al cliente el motivo — preferimos no dar un número antes de entender el problema.

Para un sistema automático esto es un camino de código distinto, no un caso límite: hay una rama que
no produce cifra.

## De la petición al servicio

La elección no es libre: se deriva mecánicamente del reto declarado más lo que el cliente necesita.

| Reto declarado | Qué necesita | Servicio aplicable |
|----------------|--------------|--------------------|
| IA y transformación digital | Diagnóstico | AI Opportunity Assessment |
| IA y transformación digital | Implantación | AI Transformation Program |
| IA y transformación digital | Acompañamiento continuo | AI Executive Advisory |
| IA y transformación digital | Desarrollo a medida | Custom AI Solutions |
| Ciberseguridad | Cualquiera | Cyber Resilience Assessment |
| Sostenibilidad y ESG | Cualquiera | ESG Strategy & Compliance |
| Estrategia y operaciones | Cualquiera | Sin catalogar — llamada de alcance |

Sólo la línea de IA ramifica por necesidad; las otras tres resuelven con un único servicio. Eso
convierte el formulario en dos preguntas encadenadas, no en una matriz.

## Caducidad

La edición es **2026 y caduca el 31 de diciembre de 2026**. Los rangos son datos con fecha de
vencimiento, no constantes eternas: quien los implemente debe poder cambiarlos sin tocar la lógica.

## Related

- [Método de Estimación Económica](./Metodo%20de%20Estimacion%20Economica.md) — qué se hace con estos rangos para producir una cifra.
- [Cualificación de Oportunidades](./Cualificacion%20de%20Oportunidades.md) — la otra mitad del cálculo: cuánto interesa la oportunidad.
- [Identidad y Posicionamiento de Nexus](../firma/Identidad%20y%20Posicionamiento%20de%20Nexus.md) — de dónde salen estas líneas de servicio.
- [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md) — el producto que consume este catálogo.
