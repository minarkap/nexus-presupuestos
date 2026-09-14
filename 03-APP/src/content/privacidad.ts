/**
 * APROBADO POR JOSE EL 2026-09-14. No ha pasado por asesoría jurídica externa.
 *
 * Los párrafos sobre la «huella técnica» (secciones `datos`, `base-legal` y `conservacion`) los
 * redactó un agente para la spec `limite-de-frecuencia`. Son texto que compromete a la empresa
 * frente a terceros, así que quedan señalados aquí: si algún día hay asesoría, esto es lo primero
 * que tiene que mirar.
 *
 * Los plazos y el alcance de la frase fueron CORREGIDOS el 2026-09-14 tras una revisión adversarial
 * que demostró que el texto anterior prometía «menos de 48 horas» mientras el mecanismo real podía
 * conservar hasta 72, y que afirmaba una no-asociación con la solicitud más fuerte de la que el
 * diseño puede sostener. Los números de ahora cuadran con el código: la limpieza corre cada hora y
 * borra lo que pase de 48, así que el peor caso real es 49 horas y el aviso promete tres días.
 *
 * La superficie S5 del acta de tono sigue sin firmar desde el 2026-09-02; este cambio no la cierra.
 */
export type PrivacyId = 'responsable' | 'datos' | 'finalidad' | 'base-legal' | 'destinatarios' | 'transferencias' | 'conservacion' | 'derechos'
export interface PrivacySection { readonly id: PrivacyId; readonly h2: string; readonly paragraphs: readonly string[] }

/**
 * Aviso de privacidad del estimador. Aprobado por Jose el 2026-09-14, sin asesoría jurídica externa (ver wiki/sdd/decisions.md).
 * Describe SOLO el tratamiento que el sitio hace: no hay analítica, ni cookies de seguimiento, ni perfilado.
 */
export const privacidad = {
  h1: 'Aviso de privacidad',
  lede: 'Qué datos recoge este sitio, para qué los usamos, quién los recibe y cómo puedes ejercer tus derechos. Escrito para leerse, no para cumplir un trámite.',
  updated: '2026-09-02',
  sections: [
    { id: 'responsable', h2: 'Quién es el responsable', paragraphs: ['El responsable del tratamiento es Nexus Consulting, con sede en Andorra la Vella, Andorra. Puedes escribirnos a hola@nexus.ad para cualquier cuestión relacionada con tus datos.'] },
    { id: 'datos', h2: 'Qué datos recogemos', paragraphs: ['Solo los que introduces en el estimador de presupuesto: tu nombre, tu correo de trabajo, el nombre de tu organización y tus respuestas a las siete preguntas sobre el reto, el tamaño de la organización, la madurez con los datos, el momento de arranque, el sponsor en dirección y la situación presupuestaria.', 'Este sitio no usa cookies de seguimiento ni herramientas de analítica, y no elabora ningún perfil de navegación. Para impedir el uso abusivo del formulario guardamos, durante unas horas, una huella técnica derivada de la dirección desde la que te conectas: no es la dirección, no permite recuperarla, y se guarda aparte de tu solicitud, en un registro que no contiene tu nombre, tu correo ni ninguna de tus respuestas. No se toma ninguna decisión automatizada con efectos jurídicos sobre ti: el estimador devuelve un rango orientativo y una persona revisa cada solicitud.'] },
    { id: 'finalidad', h2: 'Para qué los usamos', paragraphs: ['Para calcular y enviarte la estimación orientativa que has solicitado, preparar la propuesta que recibes por correo y, si decides reservarla, la llamada de alcance. También para que nuestro equipo comercial pueda valorar tu solicitud y contactarte en relación con ella.', 'No usamos tus datos para publicidad, no los vendemos y no los cedemos a terceros con fines propios.'] },
    { id: 'base-legal', h2: 'Con qué base legal', paragraphs: ['Tratamos tus datos con tu consentimiento, que nos das al marcar la casilla antes de enviar el formulario. Puedes retirarlo en cualquier momento escribiendo a hola@nexus.ad; retirarlo no afecta a lo tratado hasta entonces.', 'La huella técnica que impide el uso abusivo del formulario no se apoya en tu consentimiento sino en nuestro interés legítimo en proteger el servicio frente a un uso automatizado o malintencionado. Es una medida de seguridad, no sirve para identificarte ni para dirigirte publicidad, y se elimina automáticamente en un plazo máximo de tres días.'] },
    { id: 'destinatarios', h2: 'Quién los recibe', paragraphs: ['El equipo comercial de Nexus Consulting, por correo electrónico, y un registro interno de solicitudes. Para enviar los correos y mantener ese registro usamos proveedores de servicios que tratan los datos por cuenta nuestra, con las garantías contractuales que exige la normativa de protección de datos.', 'Si tu solicitud cumple los criterios para reservar una llamada, verás un calendario de citas de un proveedor externo incrustado en la pantalla de resultado. Ese calendario puede utilizar cookies propias; su uso se rige por la política de privacidad del proveedor.'] },
    { id: 'transferencias', h2: 'Transferencias fuera de la Unión Europea', paragraphs: ['Nexus Consulting está en Andorra, país que cuenta con una decisión de adecuación de la Comisión Europea (Decisión 2010/625/UE) que reconoce un nivel de protección equivalente al de la Unión.', 'Los proveedores de correo, registro y calendario pueden tratar los datos en países fuera del Espacio Económico Europeo. En esos casos nos apoyamos en las cláusulas contractuales tipo aprobadas por la Comisión Europea o en el marco de adecuación aplicable al proveedor.'] },
    { id: 'conservacion', h2: 'Cuánto tiempo los conservamos', paragraphs: ['Conservamos los datos de tu solicitud durante doce meses desde que la envías, salvo que antes retires tu consentimiento o solicites su supresión. Si tu solicitud da lugar a una relación comercial, los datos pasan a regirse por el contrato correspondiente.', 'La huella técnica descrita más arriba se conserva un máximo de tres días y se elimina de forma automática.'] },
    { id: 'derechos', h2: 'Tus derechos', paragraphs: ['Puedes acceder a tus datos, rectificarlos, suprimirlos, oponerte a su tratamiento, limitarlo, retirar tu consentimiento y solicitar su portabilidad. Basta con escribir a hola@nexus.ad indicando qué derecho quieres ejercer; te respondemos en el plazo de un mes.', 'Si consideras que no hemos atendido tu solicitud como corresponde, puedes reclamar ante la Agència Andorrana de Protecció de Dades o ante la autoridad de control de tu país de residencia.'] },
  ] as readonly PrivacySection[],
} as const
