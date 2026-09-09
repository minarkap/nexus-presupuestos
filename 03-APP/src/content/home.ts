import type { IconName } from '@/components/ui/Icon'

export const home = {
  hero: {
    eyebrow: 'Consultoría tecnológica · Andorra la Vella',
    /** El titular se compone en el componente: «El punto donde todo» + «conecta.» en degradado. */
    h1Lead: 'El punto donde todo',
    h1Accent: 'conecta.',
    lede: 'Software a medida, IA aplicada, automatización e integración para empresas que quieren operar mejor. Convertimos complejidad operativa en sistemas claros, seguros y preparados para escalar.',
    primary: { label: 'Calcular mi estimación', href: '/presupuesto' },
    secondary: { label: 'Ver servicios', href: '/servicios' },
    facts: ['Cuatro líneas de servicio', 'Seis rangos publicados', 'Llamada de 30 minutos, sin coste'],
  },
  thesis: {
    eyebrow: 'Por qué existimos',
    h2: 'Tu empresa crece. Tus sistemas no siempre crecen con ella.',
    p: 'Entramos donde tu empresa pierde tiempo, información o control, y construimos sistemas que encajan con su operativa real.',
    signals: [
      { icon: 'workflow' as IconName, h3: 'Trabajo manual que nadie eligió', p: 'Copiar datos entre sistemas, rehacer informes, perseguir aprobaciones por correo. Horas que el equipo no dedica a lo que sabe hacer.' },
      { icon: 'network' as IconName, h3: 'Herramientas que no se hablan', p: 'El CRM no sabe lo que dice el ERP. La información existe, pero hay que ir a buscarla a mano y casarla en una hoja.' },
      { icon: 'gauge' as IconName, h3: 'Decidir sin la cifra delante', p: 'Sin visibilidad de lo que importa, dirección decide con la última impresión en vez de con el último dato.' },
    ],
  },
  lines: {
    eyebrow: 'Servicios',
    h2: 'Cuatro líneas, un mismo criterio: negocio antes que tecnología.',
    p: 'Cada línea tiene detrás un servicio del catálogo 2026 con su rango orientativo publicado. Lo que no está catalogado se acota hablando.',
    more: 'Ver el detalle y los rangos',
  },
  method: {
    eyebrow: 'Cómo trabajamos',
    h2: 'De la complejidad al sistema, en cuatro conexiones.',
    p: 'Diseñamos la solución contigo. Tú mantienes el control en cada paso; nosotros ponemos criterio técnico y ejecución.',
  },
  before: {
    eyebrow: 'Antes de la llamada',
    h2: 'Un orden de magnitud en dos minutos.',
    p: 'Siete preguntas, dos minutos. A cambio, el rango orientativo del servicio que encaja con tu caso y la propuesta por correo. Es un rango orientativo, no un presupuesto: los presupuestos se cierran hablando.',
    notAsked: 'Sin teléfono, sin cargo, sin presupuesto exacto. Solo respuestas honestas: el rango sale de ahí.',
    question: '¿Cuál es el reto que tienes delante?',
  },
  cta: {
    h2: '¿Listos para operar mejor?',
    p: 'Treinta minutos con un socio, sin coste y sin presentación comercial. Salimos de la llamada sabiendo si encajamos.',
    primary: { label: 'Empezar por la estimación', href: '/presupuesto' },
  },
} as const
