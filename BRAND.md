# Siterra — Brand Guide

## The name

**Siterra** = *site* + *terra* (earth, ground, terrain). The promise: a website built on solid ground — premium, stable, and unmistakably yours. The visual language draws on **topography** — contour lines, elevation, reaching a summit.

---

## Logo — "Contour Summit"

The mark is four concentric arcs whose centers drift upward and to the right, rising toward a single accent **summit dot**. It reads as topographic contour lines climbing to a peak — the brand idea (rising terrain, reaching the top) compressed into one geometric mark. The innermost ring and the summit dot carry the accent color; the outer rings use the ink color.

The wordmark is set in **Sora SemiBold/Bold** with tight tracking. In the generated assets, the wordmark is drawn as **vector paths extracted directly from the Sora typeface**, so the logo files carry no font dependency and render identically everywhere.

### Concepts considered

1. **Contour Summit** *(selected)* — concentric contour arcs rising to a summit dot. Distinctive, scales to a favicon, and ties cleanly to the "terra/terrain" meaning. Works as an animated motif in the hero.
2. **Meridian S** — an "S" formed from two interlocking map meridian curves. Elegant but read inconsistently at small sizes and leaned generic.
3. **Plotted Grid** — a pin dropped on a coordinate grid. Clear "location" signal, but felt closer to a maps/real-estate brand than a premium web studio.
4. **Strata Wordmark** — a type-only mark with stratified horizontal cuts through the letterforms. Strong as a wordmark but gave no standalone icon for avatars/favicons.

Contour Summit won because it is ownable, meaningful, animates naturally (the hero canvas extends the same contour language), and holds up from favicon to billboard.

---

## Logo system (in `public/brand/`)

| File | Use |
|---|---|
| `icon.svg` / `icon-dark.svg` | Icon only — light ink (for dark bg) / dark ink (for light bg) |
| `icon-mono.svg` | Single-color icon for stamps, embroidery, one-color print |
| `logo-horizontal.svg` / `-dark.svg` | Primary lockup, icon + wordmark |
| `logo-stacked.svg` / `-dark.svg` | Vertical lockup for square/narrow spaces |
| `favicon.svg` + `favicon.ico` | Browser favicons (SVG + multi-size ICO) |
| `favicon-16/32.png`, `icon-192/512.png` | PNG favicons / PWA icons |
| `icon-180.png` | Apple touch icon (solid background) |
| `social-avatar.png` | 1024×1024 social profile avatar |
| `og.png` (+ `og.svg`) | 1200×630 Open Graph / link-preview image |
| `brand-sheet.png` (+ `.svg`) | One-page brand overview |

Regenerate everything with `npm run brand`.

---

## Color

| Token | Hex | Role |
|---|---|---|
| Obsidian | `#07090d` | Primary dark background |
| Ink | `#eef2f8` | Light text / logo on dark |
| Accent | `#5fe0ff` | Glacial cyan — summit dot, highlights, CTAs (default theme) |
| Mute | `#99a5b8` | Secondary text, faint contour lines |

The accent is **theme-dependent**. The site ships with five themes, each with its own accent and surface palette: **Obsidian** (cyan, default), **Atlas** (deep electric blue), **Gallery** (light/luxury with brass), **Terra** (earthen amber on near-black), **Graphite** (steel monochrome). Because the accent is defined as `hsl(var(--accent-h) …)`, the Style Studio can shift the entire accent hue with one slider.

---

## Typography

- **Display — Sora** (600/700): headlines, the wordmark, prices. Geometric, modern, confident.
- **Body — Inter** (400/500/600): paragraphs and UI. Highly legible at every size.
- **Labels — IBM Plex Mono** (400/500): eyebrows, metadata, the "engineered" technical accents.

All three are self-hosted via `@fontsource` (no external font CDN), licensed under the **SIL Open Font License**.

---

## Voice

Confident, clear, and grounded. We sell outcomes — more booked jobs, looking like the obvious choice — not jargon. We never say "revolutionary," "game-changing," or "we leverage AI." We don't use fake testimonials; trust is earned through real demos, a transparent process, and the Design-First Guarantee.

---

## Exporting themes

Inside the Style Studio (`?studio`), **Export theme tokens** downloads the current theme's resolved CSS custom properties (background, surfaces, ink, accent, hue) as JSON — handy for syncing a client site's palette or handing tokens to another tool.
