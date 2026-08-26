# RESEND

Proveedor de correo transaccional de la landing. Elegido en `S-0012`: con decenas de envíos al mes
(C-08) el plan gratuito cubre el caso entero y su API es la que menos adaptador exige.

La app consume estas mismas variables en `03-APP/`. Aquí viven para operar a mano y para probar la
conexión sin arrancar la aplicación.

## Uso

```bash
cp .env.example .env && chmod 600 .env   # rellena RESEND_API_KEY y RESEND_FROM
bash test_connection.sh
```

## Antes de publicar

- El dominio de envío **debe estar verificado en Resend**. Sin verificar, sólo llegan correos a la
  dirección del titular de la cuenta y todos los leads reales se quedan sin propuesta.
- Recuerda el riesgo aceptado en `S-0007`: sin anti-spam, los bots disparan correos a direcciones
  inventadas y eso degrada la reputación del dominio. Vigila el panel de Resend.
