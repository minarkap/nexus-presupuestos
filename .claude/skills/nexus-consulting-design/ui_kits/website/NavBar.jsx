/* Nexus website — top navigation bar */
function NavBar({ onCta }) {
  const links = ['Soluciones', 'Servicios', 'Nosotros', 'Casos', 'Contacto'];
  const [active, setActive] = React.useState('Soluciones');
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(7,17,31,0.72)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="../../assets/nexus-isotype.png" alt="Nexus" style={{ height: 34, borderRadius: 6 }} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, letterSpacing: '0.22em', color: 'var(--text-strong)' }}>NEXUS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 9, letterSpacing: '0.34em', color: 'var(--text-muted)', marginTop: 2 }}>CONSULTING</div>
        </div>
      </div>
      <nav style={{ display: 'flex', gap: 4 }}>
        {links.map((l) => (
          <a key={l} onClick={() => setActive(l)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14,
            color: active === l ? 'var(--text-strong)' : 'var(--text-muted)',
            padding: '8px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            transition: 'color var(--dur-base) var(--ease-out)',
          }}
          onMouseEnter={(e) => { if (active !== l) e.currentTarget.style.color = 'var(--text-body)'; }}
          onMouseLeave={(e) => { if (active !== l) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >{l}</a>
        ))}
      </nav>
      <Button variant="primary" size="sm" onClick={onCta}>Hablemos</Button>
    </header>
  );
}
Object.assign(window, { NavBar });
