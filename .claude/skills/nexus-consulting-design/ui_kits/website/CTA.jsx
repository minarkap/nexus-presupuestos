/* Nexus website — closing CTA with contact form */
function CTA() {
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  return (
    <section id="contacto" style={{ padding: '40px 40px 110px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
        <Card variant="solid" padding="none" style={{ overflow: 'hidden', borderColor: 'var(--border-default)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr' }}>
            <div style={{ position: 'relative', padding: '56px 48px', overflow: 'hidden' }}>
              <NodeField />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(20,92,255,0.22), transparent 70%)' }} />
              <div style={{ position: 'relative' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: 0 }}>
                  ¿Listos para<br />operar mejor?
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--text-body)', maxWidth: 360, marginTop: 16 }}>
                  Cuéntanos qué quieres mejorar. Diseñamos la solución contigo.
                </p>
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['mail', 'hola@nexus.ad'], ['phone', '+376 123 456'], ['map-pin', 'Andorra la Vella, Andorra']].map(([ic, t]) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon name={ic} size={16} color="var(--nx-cyan-400)" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--nx-navy-900)', padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {sent ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-gradient-soft)', border: '1px solid var(--border-accent)' }}>
                    <Icon name="check" size={26} color="var(--nx-cyan-400)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-strong)', fontSize: 22, margin: '0 0 6px' }}>Gracias</h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Te respondemos en menos de 24 h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input label="Nombre" placeholder="Tu nombre" />
                  <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" iconLeft={<Icon name="mail" size={16} />} />
                  <Input label="¿Qué quieres mejorar?" placeholder="Cuéntanos brevemente" />
                  <Button variant="primary" size="lg" type="submit" full>Enviar mensaje</Button>
                </form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
Object.assign(window, { CTA });
