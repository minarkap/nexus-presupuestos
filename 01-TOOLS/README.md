# 01-TOOLS

> Plantilla generada por `harness` el 2026-08-26.

Arsenal operativo de **nexus_presupuestos**. Cada subdirectorio es una **tool** que combina (a) las
credenciales co-localizadas en su propio `.env` y (b) los scripts que las consumen. Todo lo necesario
para operar un servicio externo vive bajo `01-TOOLS/<SERVICIO>/`.

> **Operaciones, no runtime.** Los scripts de aquí son los que un operador lanza desde el terminal.
> El SDK que la app consume en producción **no vive aquí** — vive en el repo del producto.

## Convenciones

### Nombres y estructura

- **Carpeta de tool**: MAYÚSCULAS con `_` como separador (sin acentos ni espacios) — `RESEND`,
  `SENDGRID`, `VERCEL`.
- **Una carpeta = un proveedor externo.**
- **Scripts**: snake_case, verbo en infinitivo + objeto — `test_connection.sh`, `enviar_prueba.sh`.
- **Variables `.env`**: MAYÚSCULAS con `_` y prefijo del proveedor — `RESEND_API_KEY`. Excepción: las
  variables que el SDK exige literalmente; se documentan en `CREDENTIALS.md`.

### Ficheros por tool

| Fichero | Obligatorio | Para qué |
|---------|-------------|----------|
| `.env` | sí (si hay secretos) | Credenciales reales — `chmod 600`, fuera del control de versiones. |
| `.env.example` | sí | Plantilla pública con los nombres de variable y valores vacíos. |
| `.gitignore` | sí | Como mínimo `.env` y `keys/`. |
| `README.md` | sí | Qué hace y cómo se lanzan los scripts. |
| `CREDENTIALS.md` | sí | Detalle de cada variable, panel del proveedor, rotación. |
| `test_connection.{py,sh}` | sí | Prueba de humo, sin parámetros. |

### Convenciones de script

- **Python 3.11+** por defecto. Bash solo para envoltorios cortos de `curl`. Node solo si el SDK lo exige.
- **`argparse` obligatorio** en Python — `--help` explica qué hace el script y todos sus parámetros.
- **Resolución del `.env`**: `$SCRIPT_DIR/.env` (bash) o `Path(__file__).parent / ".env"` (Python).
- **Salida**: legible por stdout; errores con código de salida `≠ 0` por stderr.
- **Acciones destructivas** (borrar, cancelar, cobrar, envío masivo) exigen un flag `--confirmar`
  explícito. Sin él, simulación con vista previa.

## Catálogo

| Tool | Categoría | Estado |
|------|-----------|--------|
| `_TEMPLATE` | boilerplate | Plantilla genérica. No es una tool: se copia para crear una. |

Ninguna tool real todavía. La regla es **no tools especulativas**: un proveedor entra aquí cuando
está integrado en el runtime o cuando hay una operación manual recurrente que duele. El proveedor de
email transaccional (Resend / SendGrid / Postmark) será casi con seguridad la primera, en cuanto la
skill `email-connector` lo elija.

## Flujos comunes

```bash
# Prueba de humo de cada tool (cuando exista alguna)
# 01-TOOLS/<TOOL>/test_connection.sh
```

## Añadir una tool nueva

1. `cp -r 01-TOOLS/_TEMPLATE 01-TOOLS/<NOMBRE>`
2. Rellena `.env.example` con los nombres reales de variable del proveedor.
3. Crea el `.env` real con los valores del panel. `chmod 600 .env`.
4. **Implementa `test_connection.{py,sh}` primero** — una prueba de humo tonta.
5. Añade otros scripts según haga falta — solo los que necesites ahora.
6. Actualiza el `README.md` de la tool.
7. Añade una fila al catálogo de este README.

## Filosofía

- **Sin tools especulativas.** Una tool se añade cuando la integración está en runtime o cuando hay
  una operación manual recurrente que duele.
- **Prueba de humo primero.** Antes de cualquier otro script, demuestra que las credenciales funcionan.
- **Co-localización.** Credenciales y scripts viven juntos. Rotar una clave = abrir una carpeta.

## Véase también

- `02-DOCS/` — wiki LLM del proyecto. Cuando una tool acumula operaciones recurrentes que merecen
  documentarse más allá del README local, el protocolo `harness` ingesta el README +
  `CREDENTIALS.md` a `02-DOCS/raw/operations/` y los compila en `02-DOCS/wiki/operations/`.
