# SUPABASE — registro duradero de leads

Base de datos donde se guarda cada lead del estimador. Sustituye a la hoja de cálculo de Google
(decisión `S-0025`; plan `leads-en-supabase`).

## Puesta en marcha

1. **Proyecto.** supabase.com → *New project*. Región: Europa (no es obligatorio — el principio 22
   de la constitución dice que no hay requisito de residencia — pero evita explicaciones).
2. **Tabla.** Abre *SQL Editor* → *New query*, pega `schema.sql` entero y ejecútalo. Entero: la
   tabla y su cierre de acceso van juntos a propósito.
3. **Credenciales.** *Settings* → *API*. Copia el *Project URL* y la clave **`service_role`** (la
   marcada como *secret*) en `.env`. La clave `anon` es opcional y sólo la usa la prueba de humo.
4. **Comprueba.** `bash test_connection.sh`. Verifica tres cosas: que la clave vale, que la tabla
   existe, y que **la tabla no responde a quien no tiene la llave**.
5. **Producción.** Las mismas dos variables en Vercel → *Settings* → *Environment Variables*,
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
| `03-APP/scripts/secret-gate.mjs` | inspecciona el paquete **ya compilado** y falla si alguna credencial viajó al navegador |

## Qué se guarda

Lo mismo que ya viajaba al aviso interno por correo: contacto y consentimiento, las siete respuestas
de negocio, los frenos declarados, el servicio aplicable, el rango entregado y la puntuación con su
desglose. **Ningún dato nuevo del visitante** — ni IP, ni user-agent, ni procedencia.

El aviso de privacidad del sitio no nombra proveedores y ya declara transferencias fuera de la UE,
así que no hubo que tocarlo. Lo que sí promete es **conservación de doce meses**: el borrado
automático todavía no está implementado (es una decisión diferida de la spec), pero a partir de
ahora es ejecutable, que antes no lo era.
