# CrateDigger (vinyl-discovery) - Suggestions

## The evangelist

A 32-year-old record collector who lives on r/vinyl and the Discogs forums and posts
"crate haul" photos every weekend. Right now they plan trips around a messy mix of
Discogs store pages, Google Maps saved lists, and screenshots of other people's
recommendation threads. CrateDigger makes them screenshot it the moment they spin the
globe, drop a pin on a city they are about to visit, and instantly see 3 to 4 real shops
with a genre fingerprint and a house editorial album pick for each. The single thing that turns a
screenshot into a share is the per-store link with a real name they recognize (Hard Wax,
Amoeba, Disk Union). What makes them bounce in 5 seconds: a globe that looks like a tech
demo with no obvious payoff, fake-looking star ratings that signal "AI generated travel
slop," or a store card that dead-ends with no way to actually go visit or buy. They want
to trust the list and then act on it.

## Ground-truth findings (repo HEAD)

Verified against repo HEAD, the source of truth for the next deploy.

- WORKING end to end. Pure static Vite plus React SPA, no backend, no dead /api calls.
  `vite build` passes clean (one pre-existing 2 MB chunk warning from three.js and
  react-globe.gl, not a regression).
- DATA IS REAL. `src/data/stores.js` lists real record stores with real addresses and
  real websites: Rough Trade, A1 Records, Academy, Hard Wax Berlin, Amoeba, Disk Union,
  Phonica, Third Man, and more across 15-plus cities. Spot checks confirm real shops.
- HONESTY FIX FROM PRIOR PASS IS PRESENT. `StoreCard.jsx` renders the word "Curated"
  with a tooltip "Curated editorial pick" instead of a fabricated numeric rating, and
  `Sidebar.jsx` footer states that listings and album picks are house editorial, not
  live inventory, hours, or shop quotes. No false claims of real-time or sourced data.
- The legacy `rating: 4.x` fields still sit in the stores.js data objects but are NOT
  rendered anywhere (confirmed: no `store.rating` reference in src). Dead data only, not
  a user-facing fabrication. Safe to leave or strip later.
- Per-store share works: `?store=<id>` URL state plus a Copy link button (iter2).
- DEPLOY MISMATCH RISK. The live URL is a client-rendered SPA, so a plain fetch only
  returns the static title and cannot confirm the rendered build. Prior pass committed
  and pushed the honesty fix but never deployed. Confirm the live build at
  vinyl-discovery.vercel.app actually shows "Curated" and the footer disclosure, not the
  old numeric stars, at the next flush.
- Pre-existing em dashes in `index.html` titles and `StaffPick.jsx` byline. Not
  introduced by this pass. Left untouched to stay additive.

## Shipped wave 2

- (#2, DONE) Replaced the default Vite boilerplate `README.md` with a real project
  description: what CrateDigger does, the curated-data honesty disclosure, the social
  card, tech notes, dev commands, and how to contribute a store. The GitHub page no
  longer reads like an empty template for the first sharer or contributor who lands on
  it. Honest counts only (13 countries, 19 cities).
- (#4, DONE) Stripped all 37 dead `rating: 4.x` fields from `stores.js`. They were never
  rendered (the card shows "Curated") but sitting in the data invited a future
  contributor to re-render a fabricated score and undo the honesty fix. Pure hygiene,
  module still parses, `vite build` clean.

Also confirmed this wave: vinyl-discovery.vercel.app serves the app (HTTP 200) and
`og.png` (1200x630 real PNG, image/png, 57807 bytes) under a Twitterbot user agent, so
the canonical, og:url, and og:image already point at the working host. No defect to fix.

## Prioritized plan

### Quick wins

1. (#1, DONE prior pass) Surface the real store website as a "Visit website" link on the
   active store card. `StoreCard.jsx` plus `index.css`. Every store already carries a
   real `website` field that was never rendered, so the collector hit a dead end with no
   way to go visit or buy. Now the active card shows a "Visit website" link next to Copy
   link when a website exists. Effort S. No deploy needed to verify, build is clean.

2. Remove the em dashes in `index.html` titles and `StaffPick.jsx` byline (use a comma or
   "by"). Small polish, keeps share previews and the staff byline clean. Effort S. Needs
   deploy to see in social previews. Left for a deploy-paired pass to stay additive.

### Bigger bets

5. Add a Discogs link or "search this shop on Discogs" affordance per store, so the
   collector can jump from a shop to its inventory. Matters because Discogs is where they
   actually buy. Effort M. Needs a stable per-store identifier or a search URL pattern.

6. Show a small store count and a "shops in N cities" stat in the header or empty state so
   the breadth of the curated list is visible before the user starts digging. Effort S to
   M. No deploy needed.

7. Add a lightweight list view toggle next to the globe for users who want to scan all
   shops without spinning the globe (accessibility and mobile). The globe is beautiful but
   it buries the payload for some users. Effort M.

8. Code-split the three.js and react-globe.gl bundle via manualChunks to cut the 2 MB
   initial payload and speed first paint, which reduces the 5-second bounce risk on
   mobile. Effort M. Best verified with a deploy and a Lighthouse run.
