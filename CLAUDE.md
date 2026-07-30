# Elizabeth Osorio — Flauta Traversa

One-page animated site for a flutist, implemented from a Figma prototype
(pages **Desktop** and **Mobile**). Stack: Next.js 15 (App Router) · React 19 ·
GSAP + Flip via `@gsap/react` · plain CSS. No TypeScript, no Tailwind, no
CSS-in-JS — keep it that way.

Code comments and commit messages are written in **Spanish** (site content is
Spanish too). Keep that convention.

## Commands

```bash
npm run dev     # dev server (use -p 3001 if 3000 is taken)
npm run build   # production build — run this to verify changes compile
```

Dev query params: `?nointro` (skip home intro), `?dbg` (style/hit-test
overlay), `?goto=%23/ruta` (navigate after 1.2s, to test transitions).

## Architecture: one scene, morphing states

This is NOT a multi-page app and NOT conditional rendering. React renders the
**entire scene once** (`app/page.jsx`): every view (home, bio, ensambles,
videos, trayectoria, contacto) coexists in the DOM permanently.

- The current state lives in **data attributes on the `.site` root**:
  `data-view`, `data-ens`, `data-tab`, `data-traycat`.
- CSS (`app/styles/*.css`) positions/hides each element **per state** via
  `[data-view="..."]` selectors.
- Navigation is a **hash router** (`hooks/useViewRouter.js`): `#/biografia`,
  `#/biografia/completa`, `#/ensambles/nomadas/videos`,
  `#/trayectoria/academia`, `#/videos`, `#/contacto`.
- On a state change, GSAP **Flip** captures the layout of `FLIP_TARGETS`,
  the data attributes are mutated, and `Flip.from()` morphs elements from the
  old layout to the new one.

**Never convert views to conditional rendering / mount-unmount.** Flip morphs
require the same DOM nodes to persist across states. Show/hide is always done
with data attributes and classes, never by removing elements.

React's job is markup and content; GSAP's job is all motion and all
state-driven DOM mutation. Don't introduce React state for anything the
animation engine owns (current view, active tab, menu open) — re-renders
would fight the imperative mutations.

## File map

```
app/page.jsx          composition root: renders the scene, wires the hooks
app/layout.jsx        metadata + globals.css import
app/globals.css       @import manifest — the import order IS the cascade
app/styles/*.css      one file per scene section; mobile.css last (overrides)
components/*.jsx      markup only — no animation code, no useEffect
hooks/use*.js         all GSAP/DOM logic, one concern per hook
data/*.jsx            content (nav links, ensembles, trayectoria entries)
lib/gsap.js           single gsap plugin-registration point
```

Hooks: `useViewRouter` (hash router + Flip + intro), `useTrayectoria`
(category strip, returns `setTrayCat` consumed by the router),
`useVideosCarousel` (drag/wheel/keys), `useDandelionParticles` (home
particles), `useDebugOverlay` (`?dbg`).

## GSAP rules

- **Import from `lib/gsap.js`**, never from `"gsap"` directly — it's the
  single `registerPlugin` point (Flip, useGSAP).
- **All animation code lives in hooks** under `hooks/`, inside
  `useGSAP(() => {...}, { scope: rootRef })`. Components stay markup-only.
  Return a cleanup function for event listeners, timers, and long-lived
  timelines (loops, timelines created inside callbacks) — the useGSAP context
  only auto-reverts tweens created synchronously inside the callback.
- **`clearProps` discipline**: every entrance tween and every Flip must clean
  up after itself (`clearProps: "transform,opacity,visibility"`, Flip's
  `onComplete` does `clearProps: "all"`). Leftover inline styles break the
  CSS-driven layout of the *next* state. If an element lands misplaced after
  a transition, a missing clearProps is the first suspect.
- **`overwrite: true`** on tweens that can compete for the same element
  (rapid navigation) — but **never on timeline steps**: a timeline with
  overwrite kills its own earlier steps at creation time. Kill the previous
  timeline explicitly instead (see `useTrayectoria`).
- **Adding an element that must morph between views** → add its selector to
  `FLIP_TARGETS` in `hooks/useViewRouter.js`; give it per-view CSS rules.
- **Adding a per-view entrance effect** → add an entry to `ENTER_FX`
  (selector + `{ y, delay }`) in `hooks/useViewRouter.js`.
- **Mobile (`<900px`) has no morphs**: state changes are a plain fade +
  staggered entrances (`applyState`'s mobile branch). Gate any
  desktop-only interaction with `isMobile()`
  (`matchMedia("(max-width: 899px)")` — same breakpoint as `mobile.css`).
- **Respect `prefers-reduced-motion`**: it skips the intro and the
  particles; any new ambient/looping animation must honor it too.
- Easings in use: `power3.out` for entrances, `power3.inOut` for morphs,
  `power2.in` for exits, `sine.inOut` for ambient loops. Stagger 0.06.
  Stay in that family so motion feels consistent.

## CSS rules

- `app/globals.css` only `@import`s the files in `app/styles/` — **the order
  is the cascade, don't reorder**, and `mobile.css` must stay last.
- Desktop layout is fluid between 900–1440px (fluid `clamp()` type tokens in
  `base.css`), centered max-width above 1440; `<900px` is the Figma Mobile
  page layout.
- Geometry coupling to know about: `TRAY_OFFSETS` in `data/trayectoria.jsx`
  mirrors the column widths in `styles/trayectoria.css`, and `GAP` in
  `hooks/useVideosCarousel.js` mirrors the track gap in `styles/videos.css`.
  If you touch those styles, update the constants.
- The design serif is **Kugile**; it falls back to self-hosted DM Serif
  Display if not installed (see `@font-face` in `styles/base.css`).

## Content

Real copy lives in `data/ensembles.jsx` and `data/trayectoria.jsx` (JSX
fragments — line breaks with `<br />` are intentional, they match the Figma
composition; don't "clean them up"). Video cards are placeholders, as in the
design.
