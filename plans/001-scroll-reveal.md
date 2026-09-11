# 001 — Scroll-reveal for sections below the hero

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: MEDIUM
- **Category**: Missed opportunities (group entrance)
- **Estimated scope**: 3 files (`output/index.html`, `output/css/components.css`, `output/js/main.js`), ~60 lines
- **Depends on**: 000 (needs `--ease-out`)

## Problem

The hero has an entrance (`c-hero-zoom` at `output/css/components.css:424`, `c-hero-rise` at `:456`), then every section below it renders flat: welcome copy, stats, chapters, room panel, amenity cards, FAQ, reviews, CTA. Users see the page once per visit — this is the rare-frequency tier where a group entrance is welcome — and the contrast with the animated hero makes the rest read as static and monotonous.

```html
<!-- output/index.html:130 — current: no reveal hook on any section child -->
<section class="c-welcome" id="about">
  <div class="o-container o-grid-12">
    <div class="o-col-7 c-welcome__intro">
```

## Target

A single `IntersectionObserver` adds `is-inview` once to any element carrying `data-reveal`. The element starts slightly low and transparent and settles in place. A small subset (stats, amenity cards) gets a 60ms stagger via a per-item index.

```css
/* output/css/components.css — target, new block placed directly before
   the "/* ---------- Hero ---------- */" comment (currently near line 404) */

/* ---------- Scroll reveal ----------
   Elements with [data-reveal] enter once when scrolled into view. Decorative:
   pointer-events stay on, and the observer marks everything visible if it
   cannot run. */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
  transition-delay: calc(var(--reveal-i, 0) * 60ms);
}

[data-reveal].is-inview {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    transform: none;
    transition: opacity 300ms var(--ease-out);
    transition-delay: 0ms;
  }
}
```

```js
// output/js/main.js — target, new block inserted directly before the line
// `const amenitiesTrack = $('[data-amenities-track]');` (currently line 94)
const revealTargets = $$('[data-reveal]');
if ('IntersectionObserver' in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-inview'));
}
```

## Repo conventions to follow

- Data attributes are the JS hook, classes are the state: see `[data-menu-toggle]` / `.is-open` in `output/js/main.js:6-12` and `.is-scrolled` toggled at `main.js:15`. Follow the same `is-*` naming.
- `$` / `$$` helpers exist at `main.js:2-3`; use them, do not add `document.querySelectorAll`.
- CSS component blocks are separated with `/* ---------- Name ---------- */` headers; add the reveal block with the same header style.
- Custom-property-driven per-item values already appear in this codebase (`--amenities-inset` at `components.css:1409`). Setting `--reveal-i` on the item itself (not the parent) is required — AUDIT rule: never drive child transforms through a variable on the parent.

## Steps

1. `output/css/tokens.css` — confirm `--ease-out` exists (plan 000). If not, STOP.
2. `output/css/components.css` — insert the Target CSS block before the Hero section header.
3. `output/index.html` — add `data-reveal` to these elements (find each by the class shown; add the attribute, change nothing else):
   - `div.o-col-7.c-welcome__intro` (line ~132)
   - `div.o-col-5.c-welcome__map-column` (line ~156)
   - each of the three `div.c-stat` inside `.c-welcome__stats` (lines ~142–153): add `data-reveal` AND an inline style `style="--reveal-i: 0"`, `1`, `2` respectively. Inline style is permitted here only because it carries a per-item index — the project has no other mechanism for that in static HTML.
   - inside each `article.c-chapter` (lines ~221 and ~247): `div.c-chapter__media` and `div.c-chapter__body`
   - every `div.c-section-head` that is a direct child of a section container (facilities ~276, rooms ~292, amenities ~301, FAQ ~370). Skip section heads that are inside a `c-amenities__head` wrapper only if that wrapper itself gets the attribute — simplest: put `data-reveal` on `div.c-amenities__head` (line ~300) instead of its inner section head.
   - `div.c-room[data-room-display]` (line ~285)
   - each `article.c-amenity` (four cards, lines ~313, 325, 337, 350): `data-reveal` plus `style="--reveal-i: 0"` … `3`
   - `div.c-cta__inner.c-amenities__cta-wrap` (line ~357)
   - `div.c-faq__column` (line ~369) and `div.c-reviews` (line ~385)
   Do NOT add it to the hero, header, footer, or to any element that is `position: absolute` (map POIs, arrows).
4. `output/js/main.js` — insert the Target JS block before the amenities carousel code.
5. Re-run the room render check: `.c-room[data-room-display]` gets its innerHTML replaced by `renderRoom()`; the `data-reveal` attribute lives on the container, which is never replaced, so the reveal survives tab switches. Confirm by reading `main.js:79`.

## Boundaries

- Do NOT add reveal to elements inside the amenities scroll track other than the `article.c-amenity` cards themselves.
- Do NOT stagger more than 4 items in a group; stagger is decorative and must not delay content the user is reading.
- Do NOT add a parallax, mouse-tracking, or count-up effect. Rejected in the audit.
- Do NOT change `renderRoom` or `renderFaqs`.
- If line numbers drift from the excerpts above, locate by class name; if a class is missing, STOP and report.

## Verification

- **Mechanical**: `grep -c 'data-reveal' output/index.html` prints a number ≥ 18. `grep -n 'IntersectionObserver' output/js/main.js` prints one match.
- **No-JS note**: with JavaScript disabled, `[data-reveal]` elements stay at `opacity: 0`. This is accepted because the rooms panel and FAQ list are already JS-rendered (`main.js:79`, `main.js:120`) — the site does not have a no-JS mode. State this in the commit message.
- **Feel check**: reload at 1440×900, scroll slowly. Each block rises 16px and fades in over ~600ms with a strong ease-out (fast start, soft landing). Stats appear one after another with a barely perceptible ~60ms offset — if the stagger reads as a "wave" it is too long. Scroll back up: nothing re-animates. Scroll fast to the bottom: no block is left invisible (threshold 0.15 with negative root margin means very short elements still trigger; if any is stuck at opacity 0, lower `threshold` to `0.05`).
- DevTools → Animations panel at 25% playback: the transform and opacity end together; no element overshoots.
- Rendering → Emulate `prefers-reduced-motion: reduce`: blocks fade in over 300ms with no vertical movement and no stagger.
- **Done when**: all sections below the hero enter with the described motion, nothing re-animates on scroll-up, and the reduced-motion check passes.
