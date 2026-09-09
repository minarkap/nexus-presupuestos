/* SNAPSHOT — el landing original de Eric (2026-08-26), recuperado de `main`.
   Único cambio: los tipos vienen de `./types` (congelados) en vez del dominio vivo.
   No lo edites para "mejorarlo": es el antes de la comparación. */
export interface LandingProps {
  onStart: () => void
}

const LINEAS = [
  {
    titulo: 'IA y transformación digital',
    texto: 'Del diagnóstico de oportunidades al programa completo, incluida la gestión del cambio.',
  },
  {
    titulo: 'Ciberseguridad',
    texto: 'Resiliencia, Zero Trust y el cumplimiento de NIS2 y DORA que ya tenéis encima.',
  },
  {
    titulo: 'Sostenibilidad y ESG',
    texto: 'Estrategia ESG, CSRD, doble materialidad y taxonomía verde.',
  },
  {
    titulo: 'Estrategia y operaciones',
    texto: 'Cuando el problema todavía no tiene forma y hace falta acotarlo antes que resolverlo.',
  },
]

export function Landing({ onStart }: LandingProps) {
  return (
    <>
      <header className="hero shell">
        <p className="eyebrow">Nexus Strategy &amp; Technology</p>
        <h1>La mayoría de los proyectos de IA no fracasan por la tecnología.</h1>
        <p className="lede">
          Fracasan porque nadie en dirección los hizo suyos, porque el dato no estaba donde se creía,
          o porque se compró una solución antes de entender el problema. Trabajamos con comités de
          dirección para que eso no os pase.
        </p>
        <p>
          Cuéntanos tu caso en un par de minutos y te decimos en qué orden de magnitud se mueve la
          inversión. Es un rango orientativo, no un presupuesto: los presupuestos se cierran
          hablando.
        </p>
        <button type="button" className="cta" onClick={onStart}>
          Calcular mi estimación
        </button>
      </header>

      <div className="shell">
        <div className="lines">
          {LINEAS.map((l) => (
            <div className="line" key={l.titulo}>
              <h3>{l.titulo}</h3>
              <p>{l.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
