Modular content surface — the building block of Nexus layouts. Compose everything else inside it.

```jsx
<Card variant="gradient" interactive glow>
  <h3>Automatización</h3>
  <p>Conectamos tus herramientas y eliminamos trabajo manual.</p>
</Card>
```

Variants: `solid` (default graphite), `glass` (blur overlay for use over imagery), `gradient` (navy feature card), `node` (subtle cyan connection-dot pattern). `padding`: none/sm/md/lg. `interactive` lifts + adds a cyan border and glow on hover. `glow` swaps the neutral shadow for the blue connection glow.
