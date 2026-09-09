/* Nexus dashboard — main overview content */
function Overview() {
  const [tab, setTab] = React.useState('30d');
  const series = {
    '7d': [42, 48, 39, 61, 55, 72, 68],
    '30d': [30, 41, 38, 52, 49, 63, 58, 71, 66, 78, 74, 88],
    '90d': [20, 28, 35, 31, 44, 52, 60, 57, 69, 73, 81, 92],
  };

  const flows = [
    { name: 'Facturación → ERP', status: 'success', label: 'Operativo', runs: '1,284', prog: 100, accent: 'cyan' },
    { name: 'Leads CRM → Slack', status: 'success', label: 'Operativo', runs: '842', prog: 100, accent: 'cyan' },
    { name: 'Onboarding empleados', status: 'warning', label: 'En revisión', runs: '67', prog: 62, accent: 'blue' },
    { name: 'Clasificación tickets IA', status: 'success', label: 'Operativo', runs: '3,401', prog: 100, accent: 'cyan' },
    { name: 'Sincronización inventario', status: 'danger', label: 'Error', runs: '12', prog: 28, accent: 'blue' },
  ];

  const integrations = [
    { n: 'HubSpot', i: 'contact', c: '#FF7A59' },
    { n: 'Slack', i: 'message-square', c: '#611f69' },
    { n: 'Notion', i: 'file-text', c: '#cfcfcf' },
    { n: 'Stripe', i: 'credit-card', c: '#635bff' },
    { n: 'Google', i: 'mail', c: '#4285F4' },
  ];

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Tareas automatizadas" value="12,840" delta="18%" trend="up" accent="cyan" icon={<Icon name="zap" size={18} color="var(--nx-cyan-400)" />} />
        <StatCard label="Horas ahorradas / mes" value="486" unit="h" delta="12%" trend="up" accent="blue" icon={<Icon name="clock" size={18} color="var(--nx-blue-300)" />} />
        <StatCard label="Flujos activos" value="38" delta="4" trend="up" accent="cyan" icon={<Icon name="workflow" size={18} color="var(--nx-cyan-400)" />} />
        <StatCard label="Incidencias" value="2" delta="33%" trend="down" accent="blue" icon={<Icon name="alert-triangle" size={18} color="var(--nx-blue-300)" />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* Chart */}
        <Card variant="solid" padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)', margin: 0 }}>Ejecuciones de flujos</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Volumen procesado en el periodo</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--nx-navy-900)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {['7d', '30d', '90d'].map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  border: 'none', cursor: 'pointer', padding: '5px 11px', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                  background: tab === t ? 'var(--accent-gradient)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <FlowChart data={series[tab]} height={180} />
        </Card>

        {/* Integrations */}
        <Card variant="solid" padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)', margin: 0 }}>Integraciones</h3>
            <Badge tone="success" dot>5 conectadas</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {integrations.map((it) => (
              <div key={it.n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'var(--nx-navy-900)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: it.c + '22', border: '1px solid ' + it.c + '55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={it.i} size={15} color={it.c} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-body)', flex: 1 }}>{it.n}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--nx-success)', boxShadow: '0 0 8px var(--nx-success)' }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Flows table */}
      <Card variant="solid" padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)', margin: 0 }}>Flujos activos</h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-link)', cursor: 'pointer' }}>Ver todos →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 16, padding: '0 8px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
            {['Flujo', 'Estado', 'Ejecuciones', 'Salud'].map((h) => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{h}</span>
            ))}
          </div>
          {flows.map((f) => (
            <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 16, alignItems: 'center', padding: '13px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-strong)' }}>{f.name}</span>
              <span><Badge tone={f.status} dot>{f.label}</Badge></span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>{f.runs}</span>
              <ProgressBar value={f.prog} tone={f.status === 'danger' ? 'blue' : f.accent} size="sm" showValue={false} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { Overview });
