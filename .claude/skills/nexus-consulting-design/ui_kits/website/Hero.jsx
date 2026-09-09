/* Nexus website — hero section */
function Hero({ onPrimary, onSecondary }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '110px 40px 120px', textAlign: 'center' }}>
      <NodeField />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(20,92,255,0.20), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        <Badge tone="cyan" dot style={{ marginBottom: 28 }}>Consultoría tecnológica · Andorra</Badge>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 68,
          lineHeight: 1.04, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: 0,
        }}>
          El punto donde<br />todo&nbsp;
          <span style={{
            background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text',
            backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>conecta</span>.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 19, lineHeight: 1.6, color: 'var(--text-body)',
          maxWidth: 620, margin: '24px auto 40px',
        }}>
          Software a medida, IA aplicada, automatización e integración de sistemas
          para empresas que quieren operar mejor.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Button variant="primary" size="lg" onClick={onPrimary}
            iconRight={<Icon name="arrow-right" size={18} />}>Descubrir soluciones</Button>
          <Button variant="outline" size="lg" onClick={onSecondary}>Hablemos</Button>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 56, opacity: 0.7 }}>
          {['+120 proyectos', '99.98% uptime', 'Andorra · UE'].map((t) => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
