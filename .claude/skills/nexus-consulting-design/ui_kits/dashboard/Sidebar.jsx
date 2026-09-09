/* Nexus dashboard — left navigation sidebar */
function Sidebar({ active, onNavigate }) {
  const nav = [
    { id: 'resumen', icon: 'layout-dashboard', label: 'Resumen' },
    { id: 'flujos', icon: 'workflow', label: 'Flujos' },
    { id: 'integraciones', icon: 'network', label: 'Integraciones' },
    { id: 'datos', icon: 'database', label: 'Datos' },
    { id: 'ia', icon: 'brain-circuit', label: 'Asistentes IA' },
    { id: 'informes', icon: 'bar-chart-3', label: 'Informes' },
  ];
  return (
    <aside style={{
      width: 240, flex: 'none', background: 'var(--nx-navy-950)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 22px' }}>
        <img src="../../assets/nexus-isotype.png" alt="Nexus" style={{ height: 30, borderRadius: 5 }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, letterSpacing: '0.18em', color: 'var(--text-strong)' }}>NEXUS</div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map((n) => {
          const on = n.id === active;
          return (
            <button key={n.id} onClick={() => onNavigate(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
              borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: on ? 'var(--accent-gradient-soft)' : 'transparent',
              color: on ? 'var(--text-strong)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14,
              boxShadow: on ? 'inset 2px 0 0 var(--nx-cyan-500)' : 'none',
              transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
            }}>
              <Icon name={n.icon} size={18} color={on ? 'var(--nx-cyan-400)' : 'currentColor'} />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#fff' }}>CC</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Carlos del Corral</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-faint)' }}>CEO · Nexus</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
Object.assign(window, { Sidebar });
