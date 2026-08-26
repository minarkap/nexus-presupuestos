/**
 * SUSTITUTO DE DEMO — no es producto.
 *
 * Existe sólo para que la pantalla de resultado tenga algo que incrustar mientras no haya
 * página de citas real del equipo (decisión C-07, todavía abierta). Se sustituye poniendo la
 * URL verdadera en NEXT_PUBLIC_CALENDAR_URL, y entonces esta carpeta se borra.
 *
 * BORRAR ANTES DE PUBLICAR.
 */

const HUECOS = [
  { dia: 'Martes 1 de septiembre', horas: ['09:30', '11:00', '16:00'] },
  { dia: 'Miércoles 2 de septiembre', horas: ['10:00', '12:30'] },
  { dia: 'Jueves 3 de septiembre', horas: ['09:00', '11:30', '15:30', '17:00'] },
]

export default function AgendaDemo() {
  return (
    <div style={{ padding: '2rem 1.75rem', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <p
        style={{
          background: '#fff4e5',
          border: '1px solid #e8c9a0',
          borderRadius: 4,
          padding: '0.6rem 0.85rem',
          fontSize: '0.8rem',
          color: '#7a4a12',
          margin: '0 0 1.75rem',
        }}
      >
        <strong>Sustituto de demostración.</strong> Aquí va la página de citas compartida del equipo
        cuando exista. Se cambia poniendo su URL en <code>NEXT_PUBLIC_CALENDAR_URL</code>.
      </p>

      <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.35rem' }}>Llamada de encaje · 30 minutos</h2>
      <p style={{ fontSize: '0.9rem', color: '#4a515c', margin: '0 0 1.75rem' }}>
        Con un socio. Sin coste. Para ver si encajamos y qué haría falta para acotar tu caso.
      </p>

      {HUECOS.map((d) => (
        <div key={d.dia} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a515c', margin: '0 0 0.6rem' }}>
            {d.dia}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {d.horas.map((h) => (
              <span
                key={h}
                style={{
                  border: '1px solid #d9dee6',
                  borderRadius: 4,
                  padding: '0.5rem 1rem',
                  fontSize: '0.92rem',
                  background: '#fff',
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
