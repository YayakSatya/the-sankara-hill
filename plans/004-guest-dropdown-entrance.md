# 004 — Guest dropdown scales from its trigger

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files (`output/css/components.css`, `output/js/main.js`), ~30 lines
- **Depends on**: 000

## Problem

The guest/suite picker in the booking widget pops in and out via `display: none → flex` with no connection to the button that opened it.

```css
/* output/css/components.css:620 — current */
.c-booking__menu {
  position: absolute;
  top: calc(100% + var(--space-1));
  inset-inline: 0;
  z-index: 30;
  display: none;
  flex-direction: column;
  padding-block: var(--space-1);
  background: var(--color-card);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.c-booking__menu.is-open {
  display: flex;
}
```

```js
// output/js/main.js:20 — current
const setGuestMenu = (open) => {
  guestToggle?.setAttribute('aria-expanded', String(open));
  guestMenu?.classList.toggle('is-open', open);
  if (guestMenu) guestMenu.hidden = !open;
};
```

The JS sets both `.is-open` and the `hidden` attribute. `hidden` maps to the UA's `display: none`, which bypasses any CSS transition. The attribute must go (`.is-open` + `aria-expanded` already carry the state; `display: none` in CSS keeps it out of the accessibility tree while closed).

## Target

```css
/* output/css/components.css — target */
.c-booking__menu {
  position: absolute;
  top: calc(100% + var(--space-1));
  inset-inline: 0;
  z-index: 30;
  display: none;
  flex-direction: column;
  padding-block: var(--space-1);
  background: var(--color-card);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  overflow: hidden;
  /* Grows out of the trigger sitting directly above it. */
  transform-origin: top center;
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
  transition:
    opacity 150ms var(--ease-out),
    transform 150ms var(--ease-out),
    display 150ms allow-discrete;
}

.c-booking__menu.is-open {
  display: flex;
  opacity: 1;
  transform: none;
}

@starting-style {
  .c-booking__menu.is-open {
    opacity: 0;
    transform: scale(0.97) translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-booking__menu,
  .c-booking__menu.is-open {
    transform: none;
  }

  @starting-style {
    .c-booking__menu.is-open {
      transform: none;
    }
  }
}
```

```js
// output/js/main.js — target
const setGuestMenu = (open) => {
  guestToggle?.setAttribute('aria-expanded', String(open));
  guestMenu?.classList.toggle('is-open', open);
};
```

Entry and exit use the same path (scale 0.97 + 4px lift), same 150ms. `display` transitions with `allow-discrete` so the exit can play before the element leaves layout.

## Repo conventions to follow

- State via `.is-open` + `aria-expanded`, toggled in `setGuestMenu` (`main.js:20`). Keep that function; just delete the `hidden` line.
- `transition` lists are written property-by-property in this codebase (`components.css:218` header rule); follow that, never `transition: all`.
- Easing token from plan 000.

## Steps

1. Confirm `--ease-out` exists in `output/css/tokens.css` (plan 000). If not, STOP.
2. `output/js/main.js:20-24` — remove the line `if (guestMenu) guestMenu.hidden = !open;`.
3. `output/index.html:118` — the `div.c-booking__menu#guest-menu` element: check whether it carries a `hidden` attribute in the markup. If it does, remove it (CSS `display: none` now handles the closed state). If it does not, no change.
4. `output/css/components.css:620-636` — replace `.c-booking__menu` and `.c-booking__menu.is-open` with the Target CSS and add the `@starting-style` and reduced-motion blocks directly after.

## Boundaries

- Do NOT change `.c-booking__option` or `.c-booking__trigger`.
- Do NOT change the outside-click close logic at `main.js:31-33`.
- Do NOT add a delay or a bounce; this is a dropdown, 150ms budget.
- If `setGuestMenu` no longer contains the `hidden` line, STOP and report.

## Verification

- **Mechanical**: `grep -n 'guestMenu.hidden' output/js/main.js` prints nothing. `grep -n 'allow-discrete' output/css/components.css` prints one match. With the menu closed, Accessibility tree in DevTools does not list the listbox (display:none keeps it out).
- **Feel check**: click "Guests" in the hero booking widget. The list grows from its top edge, 3% scale and a 4px drop, over ~150ms — it should feel attached to the button, not floating up from the page. Click outside: it shrinks back along the same path. Click the toggle rapidly: the menu reverses mid-motion, never blinks.
- Choose an option: menu closes with the exit animation, value updates in the trigger.
- Emulate reduced motion: opacity fade only.
- Browsers without `allow-discrete` (Chrome < 117, Safari < 17.4): the menu snaps as today — no regression.
- **Done when**: open/close animate symmetrically from the trigger, outside-click and option-select still close it, and the `hidden` attribute is gone.
