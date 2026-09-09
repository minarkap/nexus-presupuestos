/* Nexus website — services grid */
function Services() {
  const items = [
    { icon: 'code-2', title: 'Software a medida', desc: 'Aplicaciones y plataformas diseñadas en torno a tu operación real, no al revés.' },
    { icon: 'brain-circuit', title: 'Inteligencia artificial', desc: 'IA aplicada con control: copilotos, clasificación y decisiones asistidas.' },
    { icon: 'workflow', title: 'Automatización', desc: 'Eliminamos trabajo manual conectando tus procesos de extremo a extremo.' },
    { icon: 'network', title: 'Integración de sistemas', desc: 'Tus herramientas y datos hablando el mismo idioma, en un solo flujo.' },
  ];
  return (
    <section style={{ padding: '96px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-secondary)', marginBottom: 14 }}>Servicios</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: 0 }}>Tecnología que conecta</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-muted)', marginTop: 14 }}>Cuatro disciplinas, un mismo objetivo: que tu empresa opere mejor.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {items.map((it) => (
          <Card key={it.title} variant="gradient" interactive padding="lg">
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--radius-md)', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--accent-gradient-soft)', border: '1px solid var(--border-accent)',
              color: 'var(--accent-secondary)',
            }}>
              <Icon name={it.icon} size={24} color="var(--nx-cyan-400)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, color: 'var(--text-strong)', margin: '0 0 10px' }}>{it.title}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
Object.assign(window, { Services });
