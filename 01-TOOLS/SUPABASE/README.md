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
6. **Producción.** Las mismas dos variables en Vercel → *Settings* → *Environment Variables*,
   marcando *Production* y *Preview*.

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
