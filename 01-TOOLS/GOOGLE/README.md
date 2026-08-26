# GOOGLE

Dos piezas del embudo viven en Google Workspace:

- **La hoja de cálculo** que hace de registro de respaldo. Consultable por cualquiera del equipo sin
  ser técnico, que era el requisito. Es *best-effort*, no una red de seguridad (`S-0006`).
- **La página de citas compartida del equipo** que ve el lead cualificado (`C-07`).

## Puesta en marcha

1. En Google Cloud, crea una **cuenta de servicio** y descarga su clave JSON.
2. Activa la **API de Google Sheets** en ese proyecto.
3. **Comparte la hoja** con el `client_email` de la cuenta de servicio, con permiso de edición. Este
   paso se olvida siempre y produce un 403 que parece un problema de credenciales.
4. Rellena `.env` y lanza `bash test_connection.sh`.

## Riesgo abierto (R-3 del plan)

La página de citas de Google puede rechazar ser incrustada en un `iframe`. La pantalla de resultado
ya trae el plan B —enlace en pestaña nueva— pero **sólo se puede confirmar con la URL real**.
