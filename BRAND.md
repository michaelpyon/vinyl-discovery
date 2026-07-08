# BRAND.md - CrateDigger (vinyl-discovery)

## Positioning line (in Marcus's language)

**"Every shop worth the detour, on 1 globe. Real stores, real staff picks, no fake ratings."**

Shorter variant for the header and OG copy: "The dig-day planner. 37 real record shops across 19 cities."

The name is **CrateDigger**. The repo and URL stay vinyl-discovery, but every surface the user sees (title tag, header, OG, README first line) says CrateDigger. Resolve the dual-name confusion by treating "vinyl discovery" as the category phrase in the tagline, never as the product name.

## Palette direction

Night-side globe is the anchor: the whole UI is a dark room the globe glows in.

- **Base**: near-black with a blue-charcoal cast (space, not #000 flat), like the run-out groove of the screen
- **Surface**: 1 step lighter charcoal panels for sidebar and cards, thin 1px borders, no heavy drop shadows
- **Accent**: warm amber/orange (record-lamp warmth, Technics strobe-light orange) for pins, active filters, and the Curated badge
- **Genre colors**: keep the existing genreColors.js system as the secondary palette; they are data colors, saturated but small-area (dots, chips), never large fills
- **Text**: warm off-white, never pure white

Never: purple-to-blue SaaS gradients, neon cyberpunk, or light mode. The globe demands dark.

## Type system

Keep the current 3-font stack, it is already right for this persona:

- **Instrument Serif**: display only. Product name, city headers, staff-pick album titles. This is the record-sleeve voice.
- **Inter 400/500/600**: all UI, body, buttons, labels
- **JetBrains Mono 400**: data details only - addresses, coordinates, store counts, genre chips. The mono is the "liner notes" texture that separates this from template sites.

Scale: big confident display sizes for city/store names, small dense mono for metadata. Contrast in size is the hierarchy tool, not weight soup.

## Spacing and motion personality

- Spacing: compact and information-dense like a well-organized crate, 8px base grid, cards comfortable but not airy-SaaS
- Motion: the globe does the theatrics; UI motion stays quiet. Globe fly-to at 1200ms eased (already in code) is the signature move. Cards and sidebar: 150 to 250ms ease-out slide/fade only
- Nothing bounces. Nothing pulses for attention except at most a soft glow on the dropped pin
- Hover states everywhere interactive; a globe app that ignores the cursor feels dead

## Voice and tone rules

1. Write like a shop clerk who knows you, not a travel brand. "Tiny, packed, and full of treasures" is the house voice; keep it.
2. Every factual claim stays checkable: real addresses, real websites, "Curated" instead of ratings. Never invent a number.
3. Confidence without hype: no "discover your next obsession!", no exclamation points in UI copy.
4. Use digger vocabulary correctly (shop, dig deep on, worth the detour, staff pick). Never say "vinyls".
5. Short. Card copy under 2 sentences. Empty states get 1 line plus 1 action.

## 3 taste references to measure against

1. **Radio Garden**: globe-first restraint. If a UI element competes with the globe, cut it.
2. **Vinyl Me, Please**: staff-pick editorial quality and record-sleeve typography confidence.
3. **Bandcamp**: honest information density and functional-first cards that still feel warm.

## 3 anti-references (never look like this)

1. **Generic AI-template slop**: purple gradient hero, glassmorphism cards, emoji-bulleted feature grid, "Built with love" footer. Instant bounce for Marcus.
2. **Yelp / TripAdvisor**: star ratings, review counts, "sponsored" energy. The moment this reads as a review aggregator, the Curated honesty story dies.
3. **Google My Maps / VinylHub**: utilitarian directory sprawl, default map pins, zero editorial voice. That is the incumbent Marcus is escaping, not the bar to match.
