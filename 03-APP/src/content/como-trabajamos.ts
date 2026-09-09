import type { IconName } from '@/components/ui/Icon'

export interface FaqItem { readonly id: string; readonly q: string; readonly a: string }

export const metodo = [
  { num: '01', icon: 'search' as IconName, h3: 'Diagnóstico', p: 'Entendemos cómo trabaja tu empresa: procesos, herramientas, datos y objetivos. Localizamos dónde se pierden horas, dónde la información no fluye y qué decisiones se toman sin la cifra delante.' },
  { num: '02', icon: 'route' as IconName, h3: 'Diseño de solución', p: 'Definimos qué sistema necesita realmente la empresa y en qué orden. Arquitectura, integraciones, qué se compra, qué se construye y qué se deja como está. Con criterio, no con catálogo.' },
  { num: '03', icon: 'code-2' as IconName, h3: 'Desarrollo e integración', p: 'Construimos, conectamos e implantamos con entregas frecuentes que tu equipo puede probar. La seguridad y el gobierno del dato van dentro del diseño, no como capa posterior.' },
  { num: '04', icon: 'gauge' as IconName, h3: 'Mejora continua', p: 'Medimos lo que prometimos medir, ajustamos y acompañamos. Un sistema que nadie revisa vuelve a ser un problema en un año; el nuestro se queda con alguien mirándolo.' },
] as const

export const llamada = {
  eyebrow: 'La llamada de alcance',
  h2: 'Treinta minutos, sin coste, sin presentación comercial.',
  p1: 'La llamada de alcance es una conversación con un socio para ver si encajamos y qué haría falta para acotar tu caso. No entregamos análisis, informe ni cifra en ella: sirve para entender el problema y decidir, los dos, si tiene sentido seguir.',
  p2: 'Sales de la llamada sabiendo tres cosas: si el reto cabe en alguno de nuestros servicios, qué información necesitaríamos para proponer un alcance, y en qué orden de magnitud se movería. Si no encajamos, te lo decimos en la misma llamada.',
} as const

export const faq: readonly FaqItem[] = [
  { id: 'rango-no-precio', q: '¿Por qué me dais un rango y no un precio?', a: 'Porque un precio cerrado antes de entender el problema es la forma más rápida de equivocarse en los dos sentidos. Cada servicio del catálogo 2026 de Nexus Consulting tiene un rango oficial en euros, y el estimador lo ajusta al tamaño de tu organización, tu madurez con los datos y el momento en que queréis arrancar. El resultado es un rango orientativo, sujeto a alcance. La cifra concreta se acota en una conversación.' },
  { id: 'de-donde-sale', q: '¿De dónde sale la cifra del estimador?', a: 'De un catálogo cerrado de seis servicios, cada uno con su rango oficial de 2026, y de un método de estimación con reglas fijas: solo se estima lo catalogado, el resultado nunca sale del rango oficial y nunca incluye rebajas ni plazos prometidos. El cálculo se ejecuta en nuestro servidor; en tu navegador solo llega el rango final con su advertencia de orientativo.' },
  { id: 'reto-no-catalogado', q: '¿Qué pasa si mi reto no está en el catálogo?', a: 'La línea de estrategia y operaciones no tiene rango publicado a propósito: su alcance cambia demasiado de un encargo a otro. Si tu reto cae ahí, el estimador no te da ninguna cifra y te propone una llamada de alcance de 30 minutos, sin coste. Nunca aproximamos un servicio por parecido a otro.' },
  { id: 'quien-ve-respuestas', q: '¿Quién ve mis respuestas y qué hacéis con ellas?', a: 'Tus respuestas y tus datos de contacto los recibe el equipo comercial de Nexus Consulting por correo y quedan en un registro interno de leads. Los usamos para preparar la propuesta que te enviamos y, si la reservas, la llamada. No los vendemos ni los cedemos con fines de publicidad. El detalle, con plazos y derechos, está en el aviso de privacidad.' },
  { id: 'pymes-o-grandes', q: '¿Trabajáis con pymes o solo con grandes empresas?', a: 'Con las dos, y el estimador lo refleja: la pregunta sobre el tamaño de tu organización va de menos de 50 personas a más de 1.000, y el rango se mueve con ella. Lo que sí necesitamos, sea cual sea el tamaño, es alguien de dirección detrás del proyecto: sin sponsor, un sistema nuevo no llega a usarse.' },
  { id: 'donde-estais-datos', q: '¿Dónde estáis y dónde van mis datos?', a: 'Nexus Consulting tiene su sede en Andorra la Vella. Andorra no forma parte de la Unión Europea, pero cuenta con una decisión de adecuación de la Comisión Europea en protección de datos (Decisión 2010/625/UE), que reconoce un nivel de protección equivalente. Los proveedores que usamos para el correo y el registro de leads pueden tratar los datos fuera de la UE; lo declaramos, con su base legal, en el aviso de privacidad.' },
  { id: 'ia-con-control', q: '¿Cómo aplicáis la IA con control?', a: 'Empezamos por el caso de uso, no por la herramienta: qué proceso o decisión mejora, con qué datos, y quién revisa el resultado. Cada sistema con IA que construimos lleva definido qué puede hacer, qué no, y dónde interviene una persona. La gobernanza del dato y la trazabilidad van dentro del diseño desde el primer día, y preferimos un modelo más pequeño y controlable a uno espectacular que nadie puede explicar.' },
  { id: 'que-me-llevo', q: '¿Qué me llevo de la llamada de alcance?', a: 'Claridad, no un documento. Sales sabiendo si tu reto encaja en alguno de nuestros servicios, qué información haría falta para proponer un alcance y en qué orden de magnitud se movería. Si no encajamos, te lo decimos en la misma llamada. No hay presentación comercial ni compromiso.' },
]

export const comoTrabajamos = {
  eyebrow: 'Cómo trabajamos',
  h1: 'De la complejidad al sistema, con el control en tus manos.',
  lede: 'Cuatro fases, una llamada de alcance para empezar y las preguntas que nos hacen antes de hablar, sin rodeos.',
  faqH2: 'Preguntas frecuentes',
  faqP: 'Cada respuesta se sostiene sola. Si te falta alguna, escríbenos.',
} as const
