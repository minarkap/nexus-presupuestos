/* Nexus dashboard — top bar */
function TopBar({ title }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7,17,31,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Panel operativo</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-strong)', margin: '2px 0 0' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px',
          background: 'var(--nx-navy-900)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
          width: 220,
        }}>
          <Icon name="search" size={15} color="var(--text-faint)" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-faint)' }}>Buscar flujo o sistema…</span>
        </div>
        <button style={{ position: 'relative', width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--nx-navy-900)', border: '1px solid var(--border-default)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={17} color="var(--text-muted)" />
          <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--nx-cyan-500)', boxShadow: '0 0 8px var(--nx-cyan-500)' }} />
        </button>
        <button style={{ height: 38, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, boxShadow: 'var(--glow-blue-sm)' }}>
          <Icon name="plus" size={16} color="#fff" /> Nuevo flujo
        </button>
      </div>
    </header>
  );
}
Object.assign(window, { TopBar });
