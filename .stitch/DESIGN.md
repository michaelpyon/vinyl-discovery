# Vinyl Discovery: Design Token System

## Concept

Record store globe explorer. Warm vinyl shop vibes, not cold tech dashboard. Dark foundation with orange heat, amber warmth, and a comprehensive genre color palette that makes every city feel alive.

## Color Tokens

### Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0a0a0a` | App background, deep black |
| `--surface` | `#161410` | Cards, sidebar, panels. Hint of brown, like wood grain. |
| `--surface-hover` | `#1e1a16` | Hover state for surfaces |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--border` | `#262626` | Default border, subtle separation |
| `--border-hover` | `#3a3a3a` | Interactive border hover state |

### Text

| Token | Value | Usage |
|---|---|---|
| `--text` | `#f5f5f5` | Primary text, high contrast |
| `--text-muted` | `#a3a3a3` | Secondary text, descriptions |
| `--text-subtle` | `#737373` | Tertiary text, hints, timestamps |

### Accents

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#f97316` | Primary accent. Orange. Buttons, links, active states. |
| `--accent-dim` | `rgba(249, 115, 22, 0.15)` | Tinted backgrounds, subtle highlights |
| `--accent-secondary` | `#e8d48b` | Soft gold. Labels, secondary emphasis. |
| `--accent-warm` | `#d4a05a` | Warm amber, like a vintage record sleeve |
| `--accent-cool` | `#5b8fb9` | Cool blue, like a Blue Note pressing. Contrast accent. |

### Layout

| Token | Value | Usage |
|---|---|---|
| `--sidebar-width` | `420px` | Sidebar width (100vw on mobile) |

## Genre Color Palette

Defined in `src/data/genreColors.js`. Each genre gets a distinct hue. Used for genre tags, globe markers, and visual coding throughout the app.

### Rock and Derivatives
- Indie Rock: `#e06b5e`
- Post-Punk: `#a855f7`
- Shoegaze: `#ec4899`
- Garage Rock: `#ef4444`
- Grunge: `#78716c`
- Psych Rock: `#f59e0b`
- Rock: `#dc2626`
- Punk: `#f43f5e`
- Prog: `#7c3aed`
- Indie: `#e06b5e`
- K-Indie: `#fb7185`

### Electronic
- Electronic: `#06b6d4`
- House: `#8b5cf6`
- Techno: `#6366f1`
- Ambient: `#64748b`
- Disco: `#f472b6`
- Dubstep: `#4f46e5`
- Experimental: `#a3a3a3`

### Jazz and Soul
- Jazz: `#f59e0b`
- Free Jazz: `#d97706`
- Latin Jazz: `#fbbf24`
- Soul: `#c084fc`
- Neo-Soul: `#a78bfa`
- Funk: `#fb923c`

### Hip-Hop and Beats
- Hip-Hop: `#facc15`
- Beats: `#eab308`

### World and Regional
- World: `#10b981`
- Afrobeat: `#22c55e`
- Highlife: `#4ade80`
- Afro-Funk: `#16a34a`
- Reggae: `#22c55e`
- Dub: `#059669`
- Ska: `#34d399`
- Dancehall: `#10b981`
- Tropicalia: `#14b8a6`
- MPB: `#2dd4bf`
- Bossa Nova: `#5eead4`
- Samba: `#0d9488`
- Son Cubano: `#f97316`
- Salsa: `#ef4444`
- Rumba: `#fb923c`
- City Pop: `#f9a8d4`
- J-Pop: `#f472b6`
- K-Pop: `#ec4899`

### Country and Folk
- Country: `#a3e635`
- Folk: `#84cc16`
- Blues: `#3b82f6`

### Classical and Other
- Classical: `#e2e8f0`
- Krautrock: `#fb923c`
- Avant-Garde: `#94a3b8`

Fallback for unknown genres: `#94a3b8`

## Typography

- Primary: Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- Display/Logo: Instrument Serif (fallback: Georgia, serif)
- Mono: JetBrains Mono (section labels, timestamps, data)

## Design Principles

1. **Warmth over precision.** Surface colors carry a hint of brown (wood grain). The palette leans warm, not clinical.
2. **Genre as color.** Every genre has a unique color. Tags, markers, and accents pull from this palette to make the UI feel alive.
3. **Crate-digging energy.** Dense information, tight cards, genre clouds. The sidebar feels like flipping through bins.
4. **Globe as anchor.** The dark radial gradient behind the globe creates depth. The globe is the hero, the sidebar is the companion.
5. **Orange runs the show.** `--accent` (#f97316) is the primary interactive color. Warm amber and cool blue are supporting accents for variety without chaos.
