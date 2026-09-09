---
name: nexus-consulting-design
description: Use this skill to generate well-branded interfaces and assets for Nexus Consulting, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files (`styles.css` + `tokens/`, `guidelines/`, `components/`, `ui_kits/`, `assets/`).

Nexus Consulting is a premium technology consulting firm (Andorra) — dark navy aesthetic, electric blue + cyan accents, connected-node motif. Brand voice is Spanish-first, confident and precise. Claim: "Tecnología que conecta. Soluciones que avanzan."

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key rules:
- Link `styles.css` and style with the CSS custom properties (`--accent-gradient`, `--surface-card`, `--text-strong`, …). Never hard-code hex.
- Fonts: Sora (display), Inter (body), IBM Plex Mono (data) — loaded via Google Fonts in `tokens/fonts.css`.
- Icons: Lucide (thin stroke 1.6–1.7), from CDN. Never emoji.
- Components live on `window.NexusConsultingDesignSystem_c7745a` once `_ds_bundle.js` is loaded.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
