# 005 — Mobile menu slides from the header

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: MEDIUM
- **Category**: Purpose & frequency (preventing a jarring change)
- **Estimated scope**: 1 file (`output/css/components.css`), ~30 lines
- **Depends on**: 000. Same pattern as 004 — execute 004 first and imitate it.

## Problem

On viewports below the desktop nav breakpoint, the hamburger toggles a full-width panel with `display: none → flex`. It appears and vanishes instantly beneath the header.

```css
/* output/css/components.css:349 — current */
.c-mobile-menu {
  position: absolute;
  top: 100%;
  inset-inline: 0;
  display: none;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-6);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-line);
}

.c-mobile-menu.is-open {
  display: flex;
}
```

```js
// output/js/main.js:8 — current (already correct; no `hidden` attribute here)
const setMenu = (open) => {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('is-open', open);
};
```

## Target

```css
/* output/css/components.css — target */
.c-mobile-menu {
  position: absolute;
  top: 100%;
  inset-inline: 0;
  display: none;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-6);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-line);
  /* Drops out from under the header bar, exits the same way. */
  transform-origin: top center;
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out),
    display 200ms allow-discrete;
}

.c-mobile-menu.is-open {
  display: flex;
  opacity: 1;
  transform: none;
}

@starting-style {
  .c-mobile-menu.is-open {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-mobile-menu,
  .c-mobile-menu.is-open {
    transform: none;
  }

  @starting-style {
    .c-mobile-menu.is-open {
      transform: none;
    }
  }
}
```

The existing `@media` override at `components.css:367-373` (max-height + overflow) stays unchanged.

## Repo conventions to follow

- Identical pattern to plan 004 (`.c-booking__menu`): `display` transition with `allow-discrete`, `@starting-style` for entry, symmetric exit. Copy that block's structure.
- Property-by-property transition lists, `var(--ease-out)` from plan 000.

## Steps

1. Confirm `--ease-out` exists (plan 000) and that plan 004 is done (the `allow-discrete` pattern is already in the file). If 004 is not done, this plan can still proceed but should use the exact CSS above.
2. `output/css/components.css:349-363` — replace `.c-mobile-menu` and `.c-mobile-menu.is-open` with the Target CSS; add the `@starting-style` and reduced-motion blocks right after `.c-mobile-menu.is-open`, before the existing `@media` block at line ~367.
3. No JS change.

## Boundaries

- Do NOT touch `.c-mobile-menu__link` or the `.c-header__toggle` icon.
- Do NOT animate `max-height` or `height`.
- Do NOT change the desktop nav.
- If `.c-mobile-menu` at `components.css:349` does not match the excerpt, STOP and report.

## Verification

- **Mechanical**: `grep -c 'allow-discrete' output/css/components.css` prints `2` (this plan + plan 004) or `1` if 004 is not yet done.
- **Feel check**: DevTools device toolbar, iPhone 14 Pro (390×844). Tap the hamburger: the menu fades in while dropping 8px from under the header over ~200ms. Tap again: it lifts back and fades on the same curve. Tap a link: menu closes with the exit animation and the page scrolls to the section. Rapid double-tap: reverses mid-motion, no blink.
- Rotate to landscape with the menu open: the `max-height` cap still scrolls the menu internally.
- Emulate reduced motion: fade only.
- **Done when**: the menu enters and exits symmetrically on a real phone-sized viewport and link taps still close it.
