# Dashboard UI Kit — Nexus operations panel

High-fidelity recreation of the Nexus consulting product: an operations dashboard where clients see automation flows, integrations, and operational visibility — the product embodiment of "reduce manual work, connect tools and data, improve operational visibility."

## Screens
- `index.html` — full app shell: sidebar + top bar + Resumen (overview). Interactive: sidebar navigation switches the page title, the chart range toggle (7d/30d/90d) re-renders the area chart.

## Sections (factored components)
- `Sidebar.jsx` — dark nav rail with Lucide icons, active item gets the cyan inset bar + gradient-soft fill, user profile pinned to the bottom.
- `TopBar.jsx` — page title, search, notifications (with live dot), "Nuevo flujo" primary action.
- `Overview.jsx` — KPI `StatCard` row, area `FlowChart` with range toggle, integrations panel, and an active-flows table using `Badge` (status) + `ProgressBar` (health).
- `helpers.jsx` — `Icon` (Lucide) and `FlowChart` (canvas area chart with cyan glow), exported to `window`.

## Dependencies
- Design-system components via `_ds_bundle.js`: `Card`, `Badge`, `StatCard`, `ProgressBar`, `Button`, `Tabs`.
- Icons: [Lucide](https://lucide.dev) UMD from CDN.
- Assets: `assets/nexus-isotype.png`.

## Notes
Data is illustrative. Integration brand colors (HubSpot/Slack/etc.) are referenced only as small accent chips — the surrounding system stays on-brand navy/cyan.
