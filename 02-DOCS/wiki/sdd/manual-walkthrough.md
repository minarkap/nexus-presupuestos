---
type: checklist
title: Recorrido manual de los tres perfiles
description: La lista escrita que T026 ejecuta. Sirve para no comprobar de memoria lo que el usuario va a ver.
tags: [sdd, verify, recorrido]
timestamp: 2026-08-26T17:30:00Z
topic: sdd
status: stable
---

# Recorrido manual de los tres perfiles

> Se ejecuta contra `npm run dev` en `03-APP/`, con adaptadores falsos (sin credenciales, el
> selector cae al falso fuera de producción). Los correos y las filas aparecen en la consola del
> servidor, no en un buzón real.

## Perfil A — cualificado, servicio catalogado

| Paso | Respuesta |
|---|---|
| 1 | IA y transformación digital |
| 2 | Un diagnóstico |
| 3 | De 250 a 999 |
| 4 | Inicial |
| 5 | De 3 a 6 meses |
| 6 | Sí: hay una persona del comité de dirección… |
| 7 | Asignado y aprobado |
| 8 | Nombre, correo válido, organización |

**Esperado:** rango **28.000 – 35.000 €** · advertencia de orientativo visible · **calendario
presente** · ninguna mención de puntuación ni de umbral · dos correos en consola, el interno con las
cinco líneas de desglose.

## Perfil B — no cualificado, servicio catalogado

Igual que A, pero: **6 →** «Todavía no», **7 →** «Todavía sin presupuesto», **5 →** «Menos de 3 meses».

**Esperado:** rango visible con su advertencia · **sin calendario** · aviso de que se envía la
propuesta · dos correos en consola.

## Perfil C — sin catalogar

| Paso | Respuesta |
|---|---|
| 1 | Estrategia y operaciones |
| 2 | *(no aparece)* |
| 3-7 | Cualquiera; para ver calendario, sponsor «Sí» y presupuesto «Asignado» |
| 8 | Contacto válido |

**Esperado:** **ninguna cifra en euros en toda la pantalla** · explicación de por qué no hay número ·
mención de los **30 minutos** · calendario presente si supera el umbral (CA-12).

## Comprobación transversal

- [ ] Retroceder en cualquier punto conserva lo ya respondido.
- [ ] Cambiar el reto de IA a otra línea hace desaparecer la pregunta 2.
- [ ] Un correo mal formado señala el campo sin borrar el resto.
- [ ] **Pestaña de red del navegador:** la respuesta del envío no contiene puntuación, umbral,
      multiplicadores ni el identificador interno del servicio (CA-06). *Es la comprobación más
      importante de la lista y la única que no se puede hacer desde el código.*
- [ ] Doble clic en «Ver mi estimación» no genera dos correos.
