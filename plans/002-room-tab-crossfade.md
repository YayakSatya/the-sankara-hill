# 002 — Cross-fade the room panel on tab switch

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: MEDIUM
- **Category**: Purpose & frequency (preventing a jarring change)
- **Estimated scope**: 1 file (`output/css/components.css`), ~20 lines
- **Depends on**: 000

## Problem

Switching room tabs replaces the entire panel via `innerHTML`. The photo, tags, copy, and specs teleport with no bridge.

```js
// output/js/main.js:79 — current (excerpt)
roomDisplay.innerHTML = `<div class="c-room__gallery">…</div><div class="c-room__panel">…</div>`;
```

Both children (`.c-room__gallery`, `.c-room__panel`) are freshly created DOM nodes on every render, which makes `@starting-style` the right tool: no JS change, the entrance runs from the browser's first style of the new node.

```css
/* output/css/components.css:1196 — current: .c-room is the grid parent */
.c-room {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-16);
  align-items: stretch;
  margin-top: var(--space-12);
}
```

## Target

```css
/* output/css/components.css — target, add directly after the .c-room
   @media (min-width: 1024px) block (currently ends near line 1208) */

/* Gallery and panel are re-created on every tab switch; give the new nodes a
   short entrance so the swap reads as a change, not a teleport. Enter only —
   the old nodes are already gone. */
.c-room__gallery,
.c-room__panel {
  transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out);
}

@starting-style {
  .c-room__gallery,
  .c-room__panel {
    opacity: 0;
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  @starting-style {
    .c-room__gallery,
    .c-room__panel {
      transform: none;
    }
  }
}
```

Do not add a delay between gallery and panel — they belong to one object (the room) and should arrive together.

## Repo conventions to follow

- Component rules are grouped under their `/* ---------- Room ---------- */`-style header; keep the new block inside the room group, after the grid rules.
- Only `transform` and `opacity` animate. The existing `.c-room__frame img` hover zoom at `components.css:1231` is the exemplar for a transform-only transition in this component.
- Easing token from plan 000: `var(--ease-out)`.

## Steps

1. Confirm `--ease-out` exists in `output/css/tokens.css` (plan 000). If not, STOP.
2. In `output/css/components.css`, locate the `.c-room` rule (line ~1196) and its `@media (min-width: 1024px)` override. Insert the Target block immediately after that media block.
3. No change to `output/js/main.js`. The "View All / Show Less" button also calls `renderRoom()` — the same entrance will run then. That is acceptable (occasional action), but if it feels like too much during the feel check, wrap the `@starting-style` selectors with `.c-room:not(.is-details-toggle) …` and set that class in the `[data-room-more]` click handler — only do this if the feel check demands it; otherwise leave JS untouched.

## Boundaries

- Do NOT add an exit animation; the old nodes are removed synchronously by `innerHTML` and cannot animate out without restructuring the render. Out of scope.
- Do NOT wrap the two children in a new element — `.c-room` is a 12-column grid and the children are its direct grid items.
- Do NOT touch `.c-room__tab` styles.
- If `.c-room` at `components.css:1196` does not match the excerpt, STOP and report.

## Verification

- **Mechanical**: `grep -n '@starting-style' output/css/components.css` prints at least two matches (one normal, one inside the reduced-motion query). Chrome ≥ 117 / Safari ≥ 17.5 / Firefox ≥ 129 support `@starting-style`; on older browsers the panel simply appears instantly, which is the current behaviour — no regression.
- **Feel check**: click between "Ocean Hill Suite", "Garden Hill Pool Villa", "Ocean Hill Pool Villa". The new photo and panel fade in together and settle 8px upward over ~250ms. Click rapidly three times: each render starts its own entrance; nothing flickers to full opacity mid-way. The tab bar itself does not move.
- Animations panel at 25%: gallery and panel start and end at the same instant.
- Emulate reduced motion: fade only, no vertical movement.
- **Done when**: tab switches cross-fade as described on all three tabs and the reduced-motion variant holds.
