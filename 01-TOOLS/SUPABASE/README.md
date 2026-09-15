# SUPABASE — registro duradero de leads

Base de datos donde se guarda cada lead del estimador. Sustituye a la hoja de cálculo de Google
(decisión `S-0025`; plan `leads-en-supabase`).

## Puesta en marcha

1. **Proyecto.** supabase.com → *New project*. Región: Europa (no es obligatorio — el principio 22
   de la constitución dice que no hay requisito de residencia — pero evita explicaciones).
2. **Tabla.** Abre *SQL Editor* → *New query*, pega `schema.sql` entero y ejecútalo. Entero: va
   dentro de una transacción, así que o se crea la tabla **y** queda cerrada, o no se crea nada.
3. **Conservación.** Otra consulta nueva con `retention.sql` entero. Programa el borrado automático
   a los doce meses que el aviso de privacidad promete en público.
3b. **Catálogo.** Otra consulta nueva con `catalogo.sql` entero: crea las cuatro tablas del catálogo
   comercial, sus guardas, la función `catalogo_vigente()` y el rol `catalogo_lector`. Después,
   siembra los valores — **sin teclearlos**:

   ```
   cd 03-APP && node scripts/seed-catalog.ts > /tmp/semilla.sql
   ```

   y pega `/tmp/semilla.sql` entero en otra consulta. El SQL se genera desde `catalog-seed.ts`, que
   es el mismo fichero que usa la aplicación: teclear a mano seis rangos, diez multiplicadores y
   dieciséis puntuaciones es una invitación a que un dígito se caiga, y un dígito caído aquí
   produce rangos equivocados con el membrete de Nexus (riesgo R-1 del plan).
4. **Credenciales.** Están en **dos pantallas distintas**, no en una:
   - **Project URL** → menú izquierdo, *INTEGRATIONS* → **Data API**. Ya no vive en API Keys.
   - **Clave de servidor** → *Settings* → *API Keys* → **Secret keys** → revelar con el ojo.
     Empieza por `sb_secret_`.
   - **Clave pública** (opcional, sólo para la prueba de seguridad) → misma pantalla,
     **Publishable key**, empieza por `sb_publishable_`.

   Supabase renovó el formato: `sb_secret_` sustituye a la antigua `service_role` y
   `sb_publishable_` a la antigua `anon`. Las viejas siguen en la pestaña *Legacy* y funcionan
   igual, pero no hacen falta. **No pulses «Disable JWT-based API keys».**
5. **Comprueba.** `bash test_connection.sh`. Verifica tres cosas: que la clave vale, que la tabla
   existe, y que **la tabla no responde a quien no tiene la llave**.
5b. **Llave del catálogo.** *Settings* → *API Keys* → *Create secret key*, nombre
   `catalogo_lector` (sólo minúsculas y guiones bajos). **No hace falta elegir rol**: la garantía
   de que el sitio no puede escribir precios no vive en la llave sino en los permisos de la base —
   `catalogo.sql` se los retira a `service_role` (`S-0037`). Va a `SUPABASE_CATALOG_READ_KEY`.
   Luego:

   ```
   cd 03-APP && node scripts/catalog-gate.ts
   ```

   Debe decir **VERDE** y enseñar `28.000 – 35.000 €`. Si dice ROJA, no sigas: esa cifra es el caso
   de referencia del principio 16 y que no cuadre significa que el catálogo sembrado no es el que
   la aplicación espera.
6. **Producción.** Las mismas variables en Vercel → *Settings* → *Environment Variables*,
   marcando *Production* y *Preview*. **`SUPABASE_CATALOG_READ_KEY` es obligatoria en producción:**
   sin ella la publicación falla a propósito, porque publicar sin foto del catálogo dejaría el sitio
   sin respaldo el día que la base no responda (CA-08).

## La clave `service_role`

Se salta las reglas de acceso de la tabla **por diseño**: es la llave maestra. Por eso:

- vive sólo en `.env` y en las variables de Vercel, nunca en el código ni en la wiki;
- **nunca** con prefijo `NEXT_PUBLIC_` — eso la publicaría en el navegador;
- si se filtra, se rota desde *Settings* → *API* → *Reset service_role key* y se actualiza en Vercel.

Tres comprobaciones automáticas la vigilan, y fallan solas si algo se tuerce:

| Dónde | Qué comprueba |
|---|---|
| `03-APP/src/ports/registry.ts` | `import 'server-only'`: si un componente de cliente importara el registro, **la compilación falla** |
| `03-APP/src/ports/registry-security.test.ts` | que ninguna credencial esté marcada como pública y que ningún error la incluya |
| `03-APP/scripts/secret-gate.mjs` | inspecciona el paquete **ya compilado** y falla si alguna credencial viajó al navegador — incluida una clave del formato nuevo, que al no ser un JWT no la cazaba el detector estructural |

## Qué se guarda

Lo mismo que ya viajaba al aviso interno por correo: contacto y consentimiento, las siete respuestas
de negocio, los frenos declarados, el servicio aplicable, el rango entregado y la puntuación con su
desglose. **Ningún dato nuevo del visitante** — ni IP, ni user-agent, ni procedencia.

El aviso de privacidad del sitio no nombra proveedores y ya declara transferencias fuera de la UE,
así que no hubo que tocarlo.

## Las tres operaciones de privacidad

Lo que el aviso promete, y dónde se cumple. Todas se ejecutan en el *SQL Editor* de Supabase: ninguna
está expuesta en la API, a propósito (spec `retencion-doce-meses`, `CA-R6`).

| Promesa del aviso | Cómo se cumple |
|---|---|
| «Conservamos los datos durante doce meses» | Tarea programada diaria, instalada por `retention.sql`. Ocurre sola |
| «Salvo que antes retires tu consentimiento o solicites su supresión» | `delete from public.leads where contact_email = '…'` — operación manual, documentada en `retention.sql` |
| «Si tu solicitud da lugar a una relación comercial, los datos pasan a regirse por el contrato» | Columna `retention_hold`. Marcarla a `true` excluye esa fila del borrado automático |

**El riesgo vivo de esto es humano, no técnico**: si nadie marca `retention_hold` en los leads que se
convierten en cliente, a los doce meses se borran. El sistema no sabe quién es cliente — esa
información vive fuera. Está registrado como riesgo R-R1 del plan.

### Comprobar que el borrado está activo

```sql
select jobname, schedule, active from cron.job where jobname = 'nexus-retencion-leads';
```

Debe devolver una fila con `active = true`. Si no devuelve nada, `retention.sql` no llegó a
ejecutarse y la promesa de los doce meses **no se está cumpliendo**.


## El catálogo comercial (spec `catalogo-en-supabase`)

Desde el 2026-09-14 los precios **no viven en el código**. Cambiar un rango es editar una celda en
*Table Editor* → `catalogo_servicios`, y surte efecto en el siguiente formulario, sin publicar nada.

### Las cuatro tablas

| Tabla | Qué guarda | Se edita para… |
|---|---|---|
| `catalogo_servicios` | los seis servicios y sus rangos oficiales | cambiar un precio |
| `catalogo_factores` | multiplicadores de tamaño, madurez y urgencia | afinar el método |
| `catalogo_puntos` | la tabla de puntos de cualificación | afinar el método |
| `catalogo_ajustes` | umbral, puntuación máxima, margen, redondeo y caducidad | mover el umbral |

### Qué NO se puede hacer desde aquí

**Retirar un servicio.** La base lo rechaza, y no es un descuido: el formulario ofrece unos retos y
cada reto apunta a un servicio, así que borrar uno dejaría un reto apuntando al vacío. Retirar un
servicio es un cambio de **producto** — toca el código y requiere publicar el sitio.

Tampoco se pueden escribir disparates: un mínimo por encima de su máximo, una cifra negativa, un
multiplicador de 50 o un umbral por encima de la puntuación máxima se rechazan en la escritura.

### Después de cambiar un precio

Corre `npm run catalog-gate` desde `03-APP/`. Si has tocado el rango del diagnóstico de IA, la
puerta se pondrá **roja**: el caso de referencia del principio 16 dice que ese caso vale
`28.000 – 35.000 €`, y cambiarlo es cambiar la constitución. Eso es lo que tiene que pasar — la
puerta existe para que un cambio de precio no pase inadvertido. **Borrar la comprobación nunca es
la respuesta**; actualizar la cifra esperada y explicarlo en el commit, sí.

### Si Supabase se cae

No pasa nada visible. El sitio calcula con la **foto** del catálogo que se cocina en cada
publicación, y el aviso interno de cada lead afectado dice que se usó y de qué fecha es. Lo que
nunca ocurre es entregar un precio viejo en silencio.
