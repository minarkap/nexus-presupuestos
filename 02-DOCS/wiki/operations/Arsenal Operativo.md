---
type: article
title: Arsenal Operativo
description: La capa 01-TOOLS del workspace: qué es, sus convenciones y por qué está vacía a propósito.
tags: [operations, tooling, 01-tools]
timestamp: 2026-08-26T10:41:41Z
aliases: [arsenal-operativo]
topic: operations
status: stable
sources: ["01-TOOLS/README.md, 2026-08-26"]
score: 4.0
---

# Arsenal Operativo

> Sources: 01-TOOLS/README.md, 2026-08-26
> Raw: (el propio README de `01-TOOLS/` — no se duplica en `raw/`)

## Overview

`01-TOOLS/` es la capa de tooling operativo: una carpeta por proveedor externo, con las credenciales
co-localizadas junto a los scripts que las consumen. **Operaciones, no runtime**: aquí vive lo que un
operador lanza desde el terminal, no el SDK que la app usa en producción.

## Estado actual: vacío a propósito

Sólo existe `_TEMPLATE/`, que no es una tool sino la plantilla que se copia para crear una. Ningún
proveedor tiene carpeta porque la regla del arnés es **no tools especulativas**: un proveedor entra
cuando está integrado en el runtime o cuando hay una operación manual recurrente que duele. Sin
código, no hay evidencia.

La primera tool real será casi con seguridad el **proveedor de email transaccional**, en cuanto
`email-connector` elija entre Resend, SendGrid o Postmark. Es la pieza crítica del embudo: sin base de
datos, un email que no llega es un lead perdido.

## Convenciones que hereda cada tool

- Carpeta en MAYÚSCULAS con `_` (`RESEND`, `VERCEL`). Una carpeta = un proveedor.
- Ficheros obligatorios: `.env` (real, `chmod 600`, fuera de control de versiones), `.env.example`,
  `.gitignore`, `README.md`, `CREDENTIALS.md` y `test_connection.{sh,py}`.
- **Prueba de humo primero**: antes de cualquier otro script, demostrar que las credenciales funcionan.
- Las acciones destructivas exigen un flag `--confirmar` explícito; sin él, simulación con vista previa.
- **Nunca** se escribe un `.env` real ni se rellenan credenciales automáticamente.

## Related

- [Instrucciones Raíz del Workspace](../meta/Instrucciones%20Raiz%20del%20Workspace.md) — el gobierno general.
- [Landing de Captación de Leads](../producto/Landing%20de%20Captacion%20de%20Leads.md) — de dónde vendrá la necesidad de la primera tool.
