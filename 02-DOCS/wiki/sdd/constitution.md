---
type: constitution
title: Nexus Presupuestos — Constitution
description: Los principios no negociables que toda fase del chain SDD obedece. Numerados, comprobables y con su ejecutor enlazado.
tags: [sdd, constitution, no-negociable]
timestamp: 2026-08-26T15:40:00Z
topic: sdd
version: v1.0.0
status: stable
---

# Nexus Presupuestos — Constitution

> Version: v1.0.0 · Ratificada: 2026-08-26 · Última enmienda: 2026-08-26
> Los principios que toda fase del chain SDD obedece. Este fichero **ratifica y hace comprobable**;
> el detalle mecánico vive en las skills y en `02-DOCS/wiki/`. Si un principio no se puede señalar en
> una revisión, no es un principio: es una preferencia, y no está aquí.
>
> Muchos de estos principios no se inventan hoy — se heredan del arnés
> ([decisions.md](../harness/decisions.md)) y del dossier comercial. Se ratifican para que `analyze`
> y `verify` puedan citarlos por número.

---

## 1. Canon de stack

1. **Next.js (App Router) con TypeScript.** Fijado por `D-0004`, cuya razón de fondo es `D-0010`: el
   cálculo debe correr en servidor y una página estática no puede. Cambiar de framework es una
   enmienda **MAJOR**.
2. **Gestor de paquetes: `npm`**, un único `package-lock.json`. Elegido por ser el que viene con Node
   y no exigir instalar nada más — el criterio es mínima sorpresa para un usuario no técnico, no
   velocidad de instalación.
3. **Node: la LTS activa**, fijada en `engines` de `package.json` al crear el proyecto. A partir de
   ese momento esa versión es la canónica y bajarla es una enmienda MINOR.

## 2. Reglas de producto (las que hacen que el trabajo esté mal aunque funcione)

4. **Solo se estiman servicios del catálogo oficial 2026.** Lo que no está catalogado deriva a
   llamada de alcance. **Nunca se aproxima un servicio por semejanza a otro.** Fuente:
   [Catálogo 2026](../comercial/Catalogo%20de%20Servicios%20y%20Rangos%202026.md).
5. **Toda cifra entregada es un rango**, anclado al rango oficial del servicio, acompañado siempre de
   la advertencia de que es orientativo y sujeto a alcance. Nunca un precio cerrado.
6. **Nunca un descuento. Nunca un plazo de entrega prometido.** No existen ni como caso límite.
   Fuente: [Método de Estimación](../comercial/Metodo%20de%20Estimacion%20Economica.md), reglas
   innegociables.
7. **El anclaje al rango oficial se aplica dos veces** — tras los factores y sobre el rango final. Un
   rango entregado fuera del oficial es un fallo, no una tolerancia (CA-02).
8. **Multiplicadores, tabla de puntos y umbral nunca llegan al navegador.** El cálculo se ejecuta en
   servidor (`D-0010`). Comprobable: inspeccionar lo que recibe el cliente y no encontrar ninguno
   (CA-06).
9. **El umbral de cualificación vive en un único punto de configuración.** Su dueño ha avisado por
   escrito de que va a cambiarlo. Comprobable: cambiarlo es tocar un valor y nada más (CA-13).
10. **Rangos y factores son configuración con fecha de caducidad (31-12-2026)**, no constantes en el
    código. Quien los cambie en 2027 no debe tocar lógica.
11. **El lead nunca ve su puntuación, el umbral, ni señal alguna de que ha sido clasificado** (CA-14).

## 3. Listón de calidad

12. **Formateador y linter limpios, cero avisos**, antes de dar por buena cualquier tarea.
13. **TypeScript en modo estricto.** En los dos motores de cálculo, además, **ningún `any`**: son el
    sitio donde un tipo flojo se convierte en una cifra equivocada enviada con el membrete de Nexus.
14. **Los dos motores —rango y puntuación— se construyen con TDD**: la prueba que falla se escribe
    antes que el código que la aprueba. Cobertura de línea **≥ 95 %** en ese módulo.
15. **Existe una prueba que recorre todas las combinaciones posibles** de las respuestas 1 a 5 y
    verifica que ningún extremo de ningún rango se sale del rango oficial (principio 7, CA-02). Es
    finita y pequeña: hay que ejecutarla entera, no muestrearla.
16. **El caso de referencia del catálogo es una prueba de regresión permanente**: 600 empleados,
    madurez inicial, arranque en 4 meses, diagnóstico de IA → exactamente **28.000 – 35.000 €**
    (CA-01). Ejercita el redondeo y el segundo anclaje a la vez.
17. **El resto de la aplicación** —formulario, tres salidas, correos— lleva pruebas del recorrido
    crítico, sin suelo de cobertura declarado.

## 4. Sin control de versiones

18. **Este proyecto no usa git**, ni la wiki ni el código (`D-0008`, reafirmado el 2026-08-26 al
    ratificar esta constitución). **Consecuencias aceptadas y escritas:** no hay historial, no hay
    deshacer, no hay ramas, y las fases **`worktrees` y `ship` quedan fuera del chain** — no tienen
    sobre qué operar. `implement` trabaja sin red.
19. **Compensación obligatoria:** antes de cualquier cambio estructural, borrado o reescritura amplia,
    se hace copia previa del alcance afectado. Es lo único que sustituye a un historial.
20. **Si algún día aparece git**, la autoría de los commits es del humano: sin `Co-Authored-By` de una
    IA y sin pie de "generado con". Principio fijo del ecosistema rsc, hoy inaplicable por el 18.

## 5. Suelo de seguridad y privacidad

21. **Ningún secreto vive en el código, en la wiki ni en un artefacto publicable.** Las credenciales
    van en `01-TOOLS/<proveedor>/.env`. Aplica igual sin git: aquí el riesgo no es el historial, es
    que un fichero de documentación acabe compartido.
22. **No hay requisito de residencia de los datos personales** (`S-0008`). Es una decisión explícita,
    no un olvido: los proveedores se eligen por comodidad. Ninguna fase debe "arreglarlo" por su
    cuenta.
23. **El aviso de privacidad y el consentimiento son requisito previo a publicar**, no a construir
    (`S-0004`). Mientras no existan, la landing no puede estar accesible en abierto. Es un bloqueo de
    la fase `ship`/`deployment`, y con el principio 22 tendrá que declarar transferencias fuera de la
    UE. Skill: `gdpr-privacy`.

## 6. Suelo de accesibilidad

24. **El recorrido del formulario —las ocho pantallas— cumple WCAG 2.2 AA**: navegable con teclado,
    foco visible, contraste suficiente, y los errores de validación anunciados a un lector de
    pantalla. Es donde se pierde gente si algo falla.
25. **El resto de la landing no tiene suelo declarado.** Se hace lo razonable. Decisión explícita: no
    inventar un criterio que nadie va a medir.

## 7. Rendimiento

26. **No hay presupuesto de rendimiento.** Decisión explícita del 2026-08-26. `verify` **no** debe
    comprobar Core Web Vitals ni inventar un objetivo: aquí no hay nada que medir, y eso está
    decidido, no olvidado.

## 8. Voz, conocimiento y decisiones

27. **Ningún texto de la landing, del formulario ni de los dos correos contiene** promesas de
    resultado, urgencia fabricada, descuentos, precios cerrados ni plazos concretos. Ejecutor:
    [Voz de Nexus por Escrito](../firma/Voz%20de%20Nexus%20por%20Escrito.md).
28. **El cumplimiento del principio 27 se verifica con una lista escrita, revisada por una persona
    antes de publicar, y queda acta** de quién la pasó y cuándo (CA-19). Sin acta, no está verificado.
29. **Toda decisión significativa se anexa** a [sdd/decisions.md](./decisions.md) con fecha, opciones
    consideradas y el porqué. Esta constitución es el registro de decisión de mayor rango.

---

## Definition of Done — el listón que `verify` ejecuta

Una tarea está terminada sólo si **todo** esto se cumple:

- [ ] Formateador y linter limpios, cero avisos (principio 12).
- [ ] El comprobador de tipos pasa sin errores; ningún `any` en los motores (principio 13).
- [ ] Las pruebas pasan. Cobertura ≥ 95 % en el módulo de cálculo (principio 14).
- [ ] La prueba exhaustiva de combinaciones pasa entera (principio 15).
- [ ] El caso de referencia sigue dando 28.000 – 35.000 € (principio 16).
- [ ] Ningún multiplicador, tabla de puntos ni umbral aparece en lo que recibe el navegador (principio 8).
- [ ] Si la tarea toca el formulario: teclado, foco y contraste comprobados (principio 24).
- [ ] Si la tarea toca texto visible: pasada por la lista de tono, con acta (principios 27-28).
- [ ] Copia previa hecha si el cambio era estructural (principio 19).
- [ ] Decisiones significativas anexadas al log (principio 29).

**No forma parte del listón**, deliberadamente: presupuesto de rendimiento (26), accesibilidad fuera
del formulario (25), residencia de datos (22), rama y PR (18).

---

## Log de enmiendas

| Versión | Fecha | Cambio |
|---------|-------|--------|
| v1.0.0 | 2026-08-26 | Constitución inicial, 29 principios. Ratificada tras la fase `clarify` del spec `landing-presupuestos-nexus`, no antes — de ahí que herede decisiones ya tomadas (`D-0004`, `D-0008`, `D-0010`, `S-0004`, `S-0008`) en vez de originarlas. |
