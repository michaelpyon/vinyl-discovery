# DESIGN.md - CrateDigger (vinyl-discovery) source of truth

Read PERSONA.md and BRAND.md first. This file is the build contract.

## Layout / IA intent

Single-screen app, globe-first. The globe is the page; everything else floats over it.

- **Full-viewport 3D globe** (react-globe.gl), night-side dark, store pins colored by primary genre
- **Top-left**: product mark "CrateDigger" (Instrument Serif) + 1-line tagline + the trust stat in mono: "37 shops · 19 cities · 13 countries" (compute from stores.js, never hardcode, so it stays true as stores are added)
- **Left/overlay**: genre filter chips (existing GenreFilter), active state in amber
- **Right**: sliding sidebar with nearby-store list and the selected StoreCard
- **Floating**: Surprise Me button
- Mobile: sidebar becomes a bottom sheet; globe stays interactive above it; store card share URL must render perfectly at 390px width

No separate landing page. The app IS the landing; first paint must sell it.

## Hero / landing concept

First load = the pitch. Globe fades in already slowly auto-rotating with all 37 pins glowing, header stat visible, and a 1-time hint line: "Spin the globe. Tap a shop." Auto-rotation stops on first interaction. A visitor from X should understand the product within 3 seconds without reading anything.

## Key screens / states list

1. **Idle globe** (first load, auto-rotate, all pins)
2. **Genre-filtered globe** (chips active, pins reduced, cities without matches go dark) - this is the money screen
3. **Store selected** (fly-to animation done, StoreCard open: name, neighborhood, genre chips, house editorial album pick, vibe line, address in mono, Visit website link, Curated badge)
4. **Pin dropped on arbitrary point** (nearby list sorted by distance in sidebar)
5. **Surprise Me result** (random city fly-to + list)
6. **Shared-store deep link** (?store=id): must open with card visible and globe already flown in; this is the group-chat entry point, treat it as a first impression
7. **Mobile bottom-sheet variants of 3 and 4**

Carried-forward bets to honor (from V2): per-store Discogs jump link on the card (where Marcus actually buys), store-count stat in header and empty state, name resolution to CrateDigger everywhere.

## Empty / loading / error state intent

- **Loading**: never a blank black screen. Show a minimal amber spinning-record or pulsing-pin mark with "Loading the crates" in mono until the globe texture and three.js are ready. The globe is a heavy bundle; this state WILL be seen.
- **Empty (filter kills everything or no shops near pin)**: 1 honest line + action: "No shops within reach dig deep on that. 37 shops total, try Surprise Me or clear filters." Never a dead white void.
- **Error (WebGL unsupported / globe fails)**: graceful fallback to a flat store list grouped by city with the same cards. The data is the value; the globe is the delivery.
- **404 / bad ?store= id**: fall back silently to idle globe, no error screen.

## Metadata / OG intent (X-readiness mandatory)

- Title: "CrateDigger - Every record shop worth the detour, on 1 globe"
- Description: lead with the honest stat: "37 real record shops across 19 cities, each with a genre fingerprint and a CrateDigger album pick. No fake ratings."
- **og:image (1200x630)**: MUST show the actual 3D globe, night side, amber pins glowing, with the CrateDigger wordmark and the stat line. Screenshot the real app, do not illustrate a generic globe. Current og.png exists and serves 200 but should be regenerated to match any visual refresh.
- twitter:card summary_large_image (already set), keep canonical on vinyl-discovery.vercel.app
- Nice-to-have: per-store OG copy is impossible on a static SPA without prerender; do not fake it, but keep ?store= links resolving fast so the default card still looks great when a store link is shared.

## Data honesty (mandatory disclosure check)

Claim status: TRUE as shipped. The 37 stores in src/data/stores.js are real shops (Rough Trade NYC, Hard Wax, Amoeba, Disk Union, A1 Records) with real addresses and real websites; V2 already removed fabricated star ratings and replaced them with a "Curated" badge (StoreCard.jsx line 48).

Must remain disclosed:
1. Listings are editorially curated, not from a live API; keep the "Curated" badge and the README honesty section.
2. Album picks are house editorial, not quotes from actual shop staff. Label them as CrateDigger picks everywhere they surface; never call them shop staff picks in UI or OG copy.
3. Hours/inventory are not tracked; never imply real-time data ("open now", "in stock" are banned phrases).
4. Any store count shown must be computed from the dataset, not typed.

## The screenshot-worthy moment to engineer

**The filter-and-fly.** User taps the Techno chip: non-matching pins fade out over ~400ms and the globe becomes a sparse constellation with Berlin glowing. User clicks Hard Wax: 1200ms fly-in, card slides up with the CrateDigger pick. That 5-second sequence is the GIF Marcus posts. Engineer for it explicitly: smooth pin fade transitions (not pop-in/out), fly-to that never stutters, card entrance timed to land as the camera settles, and a UI clean enough that a raw screen recording needs no cropping.
