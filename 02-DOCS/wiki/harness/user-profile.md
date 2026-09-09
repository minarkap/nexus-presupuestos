---
type: profile
title: User Profile
description: Nivel tecnico, dial de acompanamiento, objetivos, contexto y restricciones del usuario. Lectura obligada para toda skill.
tags: [perfil, dial, lectura-obligada]
timestamp: 2026-08-26T10:42:48Z
aliases: [user-profile]
topic: harness
status: stable
sources: ["Primer contacto de `init`, 2026-08-26"]
score: 3.0
---

# User Profile

> Source of truth for how every rsc skill talks to this user. Updated continuously.

## Levels
- technical_level: non-technical            <!-- non-technical | mixed | technical -->
- accompaniment_level: L3                    <!-- L0 | L1 | L2 | L3 -->
- language: es                               <!-- the user's working language -->
- last_updated: 2026-09-02

## Who they are
- eric.risco@andorratelecom.ad — pidió arrancar el arnés en este workspace.
- Se declara no técnico: lenguaje llano, analogías, sin código ni configs a menos que los pida.

## What they want to build or govern
- domain: software                           <!-- software | non-code-harness -->
- Landing de **Nexus Strategy & Technology** donde posibles leads rellenan un formulario y obtienen un
  **rango orientativo** de inversión; sirve
  como ventana de primera información para el equipo (captación + cualificación temprana).
- software surfaces: frontend (la landing y el formulario) + un envío de email server-side. Sin base
  de datos ni panel por ahora; sin IA.
- base técnica: Next.js (App Router). Elegida por dejar sitio a una calculadora de precios o a un
  panel sin rehacer el proyecto.
- non-code surfaces: ninguna.

## Goals
- Que un lead entre en la landing, rellene el formulario y salga con un presupuesto preliminar.
- Que el equipo reciba esa primera información de forma útil y no se pierda ningún lead.

## Context
- Greenfield: la carpeta solo contiene el arnés rsc (`.rsc/`, `.claude/`, `.codex/`, `AGENTS.md`).
- Sin manifiestos de proyecto (package.json, pyproject.toml, go.mod, pubspec.yaml, Cargo.toml).
- Sin repositorio git (`.git/` ausente) — a decidir en Fase 4 GROUND.
- Destino de los leads: un email al equipo (sin base de datos, sin CRM conectado).
- Diseño: **marca definida** desde 2026-09-02 — Nexus Consulting, con design system instalado como
  skill del proyecto (`nexus-consulting-design`). Ya no es propuesta libre.
- Context7 (docs de librerías en vivo): ya conectado como MCP en la sesión.
- Proveedor de email (Resend/SendGrid/Postmark): por decidir con `email-connector`.
- Sub-agente `developer` en tier `balanced` (Sonnet) — `.rsc/developer.json`.
- Tamaño de equipo y comodidad operando servidores: pendiente.

## Constraints
- Se recogen datos personales de posibles clientes → hace falta aviso de privacidad y consentimiento
  (`gdpr-privacy`). Presupuesto, plazos y residencia de datos: aún sin definir.
- Formulario público → hay que contar con spam y bots.

## Open questions
- ~~¿El formulario muestra una cifra?~~ **RESUELTO 2026-08-26** por `Estimacion Economica.pdf`: sí,
  siempre un rango orientativo, nunca precio cerrado. Método y multiplicadores en
  [Método de Estimación Económica](../comercial/Metodo%20de%20Estimacion%20Economica.md).
- ~~¿Qué campos pide el formulario?~~ **RESUELTO**: derivados de los dos motores de cálculo, en
  [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md).
- ~~¿Qué buzón recibe los avisos?~~ **RESUELTO**: oportunidades@nexus-st.com.
- ~~¿git en esta carpeta?~~ **RESUELTO**: no (D-0008).
- **Con qué se agenda la llamada del lead cualificado.** Integración externa sin elegir; es la única
  pieza funcional del flujo que no tiene fuente.
- Proveedor de email transaccional y dominio de envío (decisión de `email-connector`).
- ¿Dónde se publica y con qué dominio? (decisión de `deployment`)
- Volumen esperado de visitas y de envíos.
- ~~¿La landing hereda la identidad visual de los documentos de la firma?~~ **RESUELTO 2026-09-02**:
  ni una cosa ni la otra. Apareció una marca real —**Nexus Consulting**— con masterprompt y design
  system propios, y la landing la adopta por completo (dark navy, Sora/Inter/IBM Plex Mono, motivo de
  nodos). Ver [D-0015](./decisions.md), [S-0014](../sdd/decisions.md) y
  [Marca Nexus Consulting](../firma/Marca%20Nexus%20Consulting.md). La estética serif clara con acento
  cobre queda descartada.
