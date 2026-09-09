# Website UI Kit — Nexus Consulting marketing site

High-fidelity recreation of the Nexus marketing homepage, built from the branding-kit "Hero Web" application.

## Screens
- `index.html` — full homepage: sticky nav → hero → services → contact CTA → footer. Interactive: nav links highlight, "Hablemos" / hero buttons smooth-scroll to the contact form, the form submits to a "Gracias" confirmation.

## Sections (factored components)
- `NavBar.jsx` — glass sticky header, isotype + wordmark, nav links, primary CTA.
- `Hero.jsx` — eyebrow badge, gradient headline ("El punto donde todo **conecta**"), dual CTAs, animated node-field background.
- `Services.jsx` — 2×2 grid of the four service pillars (software, IA, automatización, integración) as gradient cards with Lucide icons.
- `CTA.jsx` — split contact panel: node-field + contact details on the left, working form on the right.
- `Footer.jsx` — link columns + legal row.
- `helpers.jsx` — shared `Icon` (Lucide) and `NodeField` (canvas connection animation) helpers, exported to `window`.

## Dependencies
- Design-system components via `_ds_bundle.js`: `Button`, `Card`, `Badge`, `Input`.
- Icons: [Lucide](https://lucide.dev) UMD from CDN (thin-stroke outline — matches the brand icon style).
- Assets: `assets/nexus-isotype.png`.

## Notes
Copy is Spanish (the brand's primary market is Andorra/EU). The node-field background is the signature "everything connects" motif rendered on canvas.
