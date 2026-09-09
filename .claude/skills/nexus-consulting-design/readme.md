# Nexus Consulting — Design System

> **Tecnología que conecta. Soluciones que avanzan.** *"El punto donde todo conecta."*

The brand & UI system for **Nexus Consulting**, a premium technology consulting firm based in **Andorra la Vella, Andorra**. Nexus helps growing B2B companies operate better through **custom software, applied AI, process automation, and systems integration** — reducing manual work, connecting tools and data, improving operational visibility, and implementing AI with control.

**Audience:** CEOs, founders, COOs, operations leaders at growing B2B companies. **Personality:** strategic, precise, secure, innovative, premium, modern.

---

## Source material

This system was derived from the brand assets provided by the client (no codebase or Figma was supplied):

| Source | Location | Notes |
| --- | --- | --- |
| Logo (full lockup, square) | `uploads/LogoNexus.png` → `assets/nexus-logo-full.png` | Connected-node "N" + wordmark on night navy |
| Branding kit | `uploads/brandingkit.png` → `assets/branding-kit-reference.png` | Complete spec: logos, palette, type, attributes, graphic system, applications |
| Business cards | `uploads/tarjetas.png` → `assets/business-cards.png` | Dark & light card variants; contact: hola@nexus.ad · +376 123 456 |
| Palette reference | `uploads/nexus_palette_reference.pdf` | Image-only PDF; palette read from the branding kit |

Logo derivatives (`nexus-isotype.png`, `nexus-logo-horizontal.png`) were cropped from the full logo.

> **Nota de instalación (2026-09-02).** Al instalar este system como skill del proyecto
> `nexus-presupuestos` se eliminaron de `uploads/` los tres PNG que eran **copias byte a byte** de
> sus equivalentes en `assets/` (`LogoNexus.png`, `tarjetas.png`, `brandingkit.png`): 12 MB → 6,6 MB
> sin perder información. Los originales intactos siguen en la carpeta de descarga. En `uploads/`
> solo queda `nexus_palette_reference.pdf`, que no tiene equivalente en `assets/`. Para cualquier
> uso, **la ruta canónica es `assets/`**.

---

## CONTENT FUNDAMENTALS — how Nexus writes

- **Language:** Spanish-first (primary market is Andorra/EU). Use Spanish for product/marketing copy; English is fine for internal/technical docs.
- **Voice:** confident, strategic, plain. We translate operational complexity into clarity. We never hype or overpromise — we sound *in control*.
- **Person:** speak to the client as **"tú/tu"** (warm, direct B2B), and refer to ourselves as **"nosotros"** ("Convertimos…", "Conectamos…", "Diseñamos la solución contigo"). Verbs lead.
- **Casing:** Sentence case for body and most headings. The brand lockup and eyebrows use **UPPERCASE with wide tracking** (e.g. `NEXUS`, `CONSULTING`, `SERVICIOS`). Avoid Title Case In Headlines.
- **Tone of claims:** short, parallel, often paired ("Tecnología que conecta. Soluciones que avanzan." / "Rápido. Seguro. Personalizado."). The connective metaphor — *connection, nodes, flows, the point where things meet* — recurs.
- **Emoji:** never. Status and meaning are carried by icons, color, and the node motif — not emoji.
- **Numbers & proof:** use real, specific metrics in mono type (99.98% uptime, +120 proyectos, 486 h ahorradas). Don't invent vanity stats; one strong number beats five weak ones.
- **Brand attributes (the eight pillars):** Rápido, Innovador, Seguro, Claridad, Personalizado, Precisión, Premium, Conexión. Lean on these words.

**Example copy**

> *El punto donde todo conecta.* Software a medida, IA aplicada, automatización e integración de sistemas para empresas que quieren operar mejor. Convertimos complejidad operativa en sistemas digitales inteligentes, seguros y preparados para escalar.

---

## VISUAL FOUNDATIONS

**Overall vibe.** Dark navy "command-center" aesthetic — premium, technical, calm. Think high-end B2B SaaS / consulting: deep navy canvas, electric blue + cyan as energy, generous negative space, precise geometry. The signature motif is the **connected node network** (the "N" mark, particle fields, flow lines).

**Color.** Dark theme is the default.

- Base background **Night `#07111F`**; surfaces step up through a cool navy ramp (`#050C16` sunken → `#0A192C` card → `#0E2238` raised).
- **Nexus Blue `#145CFF`** is the primary action color; **Electric Cyan `#21D4FD`** is the accent / "connection energy."
- The signature gradient is **blue → cyan at \~120°** (`--accent-gradient`), used on primary buttons, key headlines (clipped text), and active states.
- Text: **Cold White `#F5F8FF`** for strong, `#C8D4E6` for body, **Technical gray `#94A3B8`** for muted.
- Semantic: success `#2DD4A7`, warning `#FBBF54`, danger `#FB6A6A`, info = cyan.

**Type.**

- **Sora** (geometric, modern) for display/headings and the brand voice. Tight tracking on large display (`-0.02em`); very wide tracking (`0.28em`) on uppercase eyebrows & the lockup.
- **Inter** for body & UI — neutral, legible at length.
- **IBM Plex Mono** for data, metrics, code, and system labels — reinforces the technical/precise feel.
- Display scale tops out around 48–68px; body 14–19px at 1.5–1.7 line-height.

**Backgrounds.** Mostly flat navy. Energy is added with: (1) **radial glow** behind heroes (blue, \~20% opacity), (2) the **animated node-field** canvas (drifting dots + faint connecting lines), (3) subtle **node dot patterns** (`radial-gradient` dots at 20px). No photography-led layouts; no busy textures. Imagery skews **cool, dark, high-tech** (deep blues, glowing points of light).

**Cards.** Gently rounded (`--radius-lg` = 14px — precise, never pill-soft), navy fill (`--surface-card`), 1px hairline border (`rgba(148,163,184,0.14)`), cool deep shadow (`--shadow-md`, navy-tinted not black). Feature cards use a subtle navy **gradient** fill; some carry the **node dot pattern**. Interactive cards lift 3px and gain a **cyan border + blue glow** on hover.

**Borders & lines.** Hairline slate at low opacity (0.14–0.38). Accent borders are cyan at \~0.45. Dividers are 1px subtle.

**Shadows vs. glows.** Two elevation languages: neutral **navy shadows** for depth, and **brand glows** (blue `--glow-blue-*`, cyan `--glow-cyan-*`) for energy/emphasis — primary buttons, live status dots, active nav, chart lines.

**Transparency & blur.** Sticky headers and overlay cards use **glass** — `rgba(7,17,31,0.6–0.72)` + `backdrop-filter: blur(10–16px)`. Used sparingly, only on floating chrome over content.

**Radii.** xs 4 / sm 6 / md 10 / lg 14 / xl 20 / 2xl 28 / pill 999. Buttons use sm–md; cards lg; pills for badges.

**Motion.** Confident and smooth — **no bounce**. Easing `cubic-bezier(0.22,1,0.36,1)` (out) and a stronger emphasis curve for chart/progress reveals. Durations 120/200/360/600ms. Hover = lift + glow; **press = translateY(1px) + scale(0.99)**. Live status dots and chart points carry a soft glow rather than animation.

**Layout rules.** Generous padding (section padding 96–120px on marketing; 28px gutters in app). Centered max-width containers (lg 1120, xl 1320). Dashboards are modular card grids. Eyebrow → headline → subhead → actions is the standard hero stack.

---

## ICONOGRAPHY

- **System:** **[Lucide](https://lucide.dev)** — thin-stroke (1.6–1.7), rounded, outline icons. This is a **substitution**: the branding kit's custom icons (lightning, rocket, shield, eye, person, target, diamond, share-nodes for the brand attributes; mail/phone/globe/pin on cards) are thin-line outline icons, and Lucide is the closest open CDN match in weight and style. ⚠️ *If you have the original icon set, share it and we'll swap Lucide out.*
- **Delivery:** loaded from CDN (`unpkg.com/lucide`), hydrated via a small `Icon` React helper in each UI kit's `helpers.jsx`.
- **Stroke weight:** keep at 1.6–1.7px to match the brand's delicate line work. Icons inherit `currentColor`; accent icons use cyan (`--nx-cyan-400`).
- **Emoji:** never used. **Unicode** is used only for tiny trend arrows (▴ ▾) in metrics.
- **The isotype** (connected-node "N") is the one bespoke mark — use `assets/nexus-isotype.png`; never redraw it.

---

## INDEX — what's in this system

**Root**

- `styles.css` — global entry point (import-only). Consumers link this.
- `readme.md` — this guide. · `SKILL.md` — portable Agent-Skill wrapper.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css` (all `@import`ed by `styles.css`).

**`assets/`** — `nexus-logo-full.png`, `nexus-logo-horizontal.png`, `nexus-isotype.png`, `branding-kit-reference.png`, `business-cards.png`.

**`guidelines/`** — foundation specimen cards (Design System tab): Colors (core, blue, cyan, navy, neutral, semantic), Type (display, body, mono, scale, eyebrow), Spacing (scale, radii, elevation, glows), Brand (lockup, isotype, gradient & motifs).

**`components/`** — reusable React primitives (namespace `window.NexusConsultingDesignSystem_c7745a`):

- `core/` — **Button**, **Card**, **Badge**
- `forms/` — **Input**, **Switch**
- `data/` — **StatCard**, **ProgressBar**
- `navigation/` — **Tabs**

**`ui_kits/`** — full product recreations:

- `website/` — Nexus marketing homepage (hero, services, contact CTA, footer).
- `dashboard/` — Nexus operations panel (sidebar, KPIs, flow chart, integrations, flows table).

---

## Usage

Link the global stylesheet and read components off the namespace:

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script>
  const { Button, Card, StatCard } = window.NexusConsultingDesignSystem_c7745a;
</script>
```

Style everything with the CSS custom properties (`var(--accent-gradient)`, `var(--surface-card)`, `var(--text-strong)`, …) — don't hard-code hex values.
