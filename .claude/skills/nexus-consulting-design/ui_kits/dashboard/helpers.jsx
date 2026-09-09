/* Nexus dashboard kit — shared helpers */

function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.7, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: { width: size, height: size, stroke: color, 'stroke-width': strokeWidth },
        nameAttr: 'data-lucide',
      });
    }
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} style={{ display: 'inline-flex', lineHeight: 0, ...style }} />;
}

/* Lightweight area-line chart on canvas — brand cyan/blue gradient fill. */
function FlowChart({ data = [], height = 160, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function draw() {
      const w = canvas.parentElement.getBoundingClientRect().width;
      const h = height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pad = 8;
      const max = Math.max(...data) * 1.15 || 1;
      const min = Math.min(...data) * 0.85;
      const pts = data.map((d, i) => [
        pad + (i / (data.length - 1)) * (w - pad * 2),
        h - pad - ((d - min) / (max - min)) * (h - pad * 2),
      ]);
      // grid
      ctx.strokeStyle = 'rgba(148,163,184,0.08)';
      ctx.lineWidth = 1;
      for (let g = 0; g <= 3; g++) {
        const y = pad + (g / 3) * (h - pad * 2);
        ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
      }
      // area fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(33,212,253,0.32)');
      grad.addColorStop(1, 'rgba(20,92,255,0.02)');
      ctx.beginPath();
      ctx.moveTo(pts[0][0], h - pad);
      pts.forEach((p) => ctx.lineTo(p[0], p[1]));
      ctx.lineTo(pts[pts.length - 1][0], h - pad);
      ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      // line
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = '#21D4FD'; ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(33,212,253,0.6)'; ctx.shadowBlur = 8;
      ctx.stroke(); ctx.shadowBlur = 0;
      // last point
      const last = pts[pts.length - 1];
      ctx.fillStyle = '#21D4FD';
      ctx.beginPath(); ctx.arc(last[0], last[1], 3.5, 0, Math.PI * 2); ctx.fill();
    }
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [data, height]);
  return <canvas ref={ref} style={{ display: 'block', ...style }} />;
}

Object.assign(window, { Icon, FlowChart });
