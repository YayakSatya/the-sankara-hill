# 000 — Add shared easing tokens and per-component reduced-motion

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens / Accessibility
- **Estimated scope**: 2 files (`output/css/tokens.css`, `output/css/base.css`), ~20 lines

Prerequisite for plans 001–005. They all reference `var(--ease-out)` and rely on reduced-motion being handled per component rather than globally.

## Problem

Every transition in the site uses a bare `ease`, `ease-out`, or the default curve, hand-typed per rule. There is no shared easing token, so the plans that follow would each invent their own values.

```css
/* output/css/components.css:155 — current */
transition: background-color 0.3s, color 0.3s, border-color 0.3s;
/* output/css/components.css:1231 — current */
transition: transform 0.4s ease;
/* output/css/components.css:1721 — current */
transition: grid-template-rows 0.4s ease, visibility 0.4s;
```

The reduced-motion block kills every animation and transition site-wide to 0.01ms. Reduced motion should mean fewer and gentler animations, not zero — opacity fades that aid comprehension must survive.

```css
/* output/css/base.css:78 — current */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Target

```css
/* output/css/tokens.css — target, inside :root, after --gutter */
  /* ---- Motion ----
     Shared curves so every transition on the site retargets the same way.
     Durations stay inline per rule (they depend on the element's size). */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

```css
/* output/css/base.css — target */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }

  /* Drop movement, keep fades. Individual components opt in to a gentler
     opacity-only variant under their own reduced-motion rules. */
  .c-hero__media img,
  .c-hero__content,
  .c-booking {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

The `*` blanket rule is removed. The three hero selectors are the only keyframe animations in the codebase (`c-hero-zoom`, `c-hero-rise`) — they animate `transform`, so they are the ones to suppress. Every other existing transition is a color/border/background change and is harmless under reduced motion.

## Repo conventions to follow

- Tokens live in `output/css/tokens.css` inside the `:root` block, one comment header per group (see `/* ---- Type scale ----` at `tokens.css:61`). Add a `/* ---- Motion ---- */` group directly after the `--gutter` token at `tokens.css:59`.
- Unscaled tokens (no `clamp()`) are allowed for values that are not lengths — see the `999px` pill and unitless line-height note in the file header.
- `base.css` holds resets and global media queries; keep the reduced-motion block there.

## Steps

1. In `output/css/tokens.css`, after line 59 (`--gutter: var(--space-8);`), insert the Motion group shown in Target.
2. In `output/css/base.css`, replace the block at lines 78–90 with the Target block. Confirm nothing else in `base.css` references the old blanket rule.
3. Do NOT retrofit existing transitions to the new token in this plan; plans 001–005 touch the rules they own. (Optional follow-up, out of scope here: swap the remaining bare `ease` values for `var(--ease-out)`.)

## Boundaries

- Do NOT touch `output/css/components.css` or `output/js/main.js` in this plan.
- Do NOT change the hero keyframes themselves.
- Do NOT add new dependencies or a build step — the site is static.
- If `base.css:78` does not match the excerpt above, STOP and report.

## Verification

- **Mechanical**: `grep -n -- '--ease-out' output/css/tokens.css` prints one line. `grep -c 'transition-duration: 0.01ms' output/css/base.css` prints `0`.
- **Feel check**: open `output/index.html` in Chrome, DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload. The hero image and copy appear instantly with no zoom/rise. Hover the Booking button — its color still transitions (0.3s) rather than snapping.
- **Done when**: both greps pass and the reduced-motion hero check holds.
