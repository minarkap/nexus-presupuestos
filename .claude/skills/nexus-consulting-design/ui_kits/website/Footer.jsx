/* Nexus website — footer */
function Footer() {
  const cols = [
    { h: 'Servicios', items: ['Software a medida', 'Inteligencia artificial', 'Automatización', 'Integración'] },
    { h: 'Empresa', items: ['Nosotros', 'Casos de éxito', 'Proceso', 'Contacto'] },
    { h: 'Recursos', items: ['Blog', 'Guías', 'Soporte', 'Estado del sistema'] },
  ];
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--nx-navy-950)', padding: '56px 40px 36px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <img src="../../assets/nexus-isotype.png" alt="Nexus" style={{ height: 30, borderRadius: 5 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, letterSpacing: '0.2em', color: 'var(--text-strong)' }}>NEXUS</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 280, margin: 0 }}>
            Tecnología que conecta. Soluciones que avanzan.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-body)', marginBottom: 14 }}>{c.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {c.items.map((i) => (
                <a key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-link)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{i}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>© 2026 Nexus Consulting · Andorra</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>Privacidad · Términos</span>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
