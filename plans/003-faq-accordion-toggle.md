# 003 — Make the FAQ accordion actually animate (toggle, don't re-render)

- **Status**: DONE
- **Commit**: 5e87f5d
- **Severity**: HIGH
- **Category**: Interruptibility / State indication
- **Estimated scope**: 2 files (`output/js/main.js`, `output/css/components.css`), ~40 lines

## Problem

The accordion panel has a height transition written for it, but it never runs. Every click rebuilds the whole list with `innerHTML`, so the opened item is created already carrying `.is-open` — there is no "from" state to transition from. The panel snaps. The +/− indicator is also swapped by re-render, so it jumps between two different icons.

```js
// output/js/main.js:120 — current (excerpt; one long line)
const renderFaqs = () => {
  if (!faqList) return;
  faqList.innerHTML = faqs.map(…).map(({ faq, index }) => `<article class="c-accordion__item" …><button class="c-accordion__trigger" … aria-expanded="${openFaq === index}" … data-faq-index="${index}"><span class="c-accordion__question">${faq[1]}</span><span class="c-accordion__indicator" aria-hidden="true"><svg><use href="#i-${openFaq === index ? 'minus' : 'plus'}"></use></svg></span></button><div class="c-accordion__panel${openFaq === index ? ' is-open' : ''}" …>…</div></article>`).join('');
  $$('[data-faq-index]', faqList).forEach((button) => button.addEventListener('click', () => { const index = Number(button.dataset.faqIndex); openFaq = openFaq === index ? -1 : index; renderFaqs(); }));
};
```

```css
/* output/css/components.css:1717 — current */
.c-accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows 0.4s ease, visibility 0.4s;
}

.c-accordion__panel.is-open {
  grid-template-rows: 1fr;
  visibility: visible;
}
```

## Target

**JS**: `renderFaqs()` only runs when the category filter changes. Clicking a question toggles state on the existing DOM: `aria-expanded` on the trigger, `.is-open` on its panel, and closes any other open item the same way. The indicator always renders `#i-plus`; open state rotates it 45° into an ×.

```js
// output/js/main.js — target: replace the click wiring inside renderFaqs
const setFaqOpen = (item, open) => {
  const trigger = $('.c-accordion__trigger', item);
  const panel = $('.c-accordion__panel', item);
  trigger?.setAttribute('aria-expanded', String(open));
  panel?.classList.toggle('is-open', open);
};
$$('[data-faq-index]', faqList).forEach((button) => button.addEventListener('click', () => {
  const index = Number(button.dataset.faqIndex);
  const item = button.closest('.c-accordion__item');
  const wasOpen = openFaq === index;
  $$('.c-accordion__item', faqList).forEach((other) => setFaqOpen(other, false));
  openFaq = wasOpen ? -1 : index;
  if (!wasOpen && item) setFaqOpen(item, true);
}));
```

In the template string, replace `#i-${openFaq === index ? 'minus' : 'plus'}` with the literal `#i-plus`.

**CSS**:

```css
/* output/css/components.css — target */
.c-accordion__indicator svg {
  width: var(--icon-sm);
  height: var(--icon-sm);
  transition: transform 200ms var(--ease-out);
}

.c-accordion__trigger[aria-expanded="true"] .c-accordion__indicator svg {
  transform: rotate(45deg);
}

.c-accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows 300ms var(--ease-out), visibility 300ms;
}

.c-accordion__panel.is-open {
  grid-template-rows: 1fr;
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  .c-accordion__panel {
    transition-duration: 0.01ms;
  }

  .c-accordion__indicator svg {
    transition: none;
  }
}
```

`grid-template-rows` is a layout property; it is kept because the `0fr → 1fr` grid trick is the only dependency-free way to animate auto height and the list is short (five items). Reduced motion drops the height animation entirely since the movement is the whole effect.

## Repo conventions to follow

- State via `is-*` classes and ARIA attributes toggled in place: see `setMenu` at `main.js:8-12` (sets `aria-expanded` and toggles `.is-open`) — imitate that shape for `setFaqOpen`.
- `$` / `$$` helpers at `main.js:2-3`.
- The `#i-plus` and `#i-minus` symbols are defined in the SVG sprite at the top of `index.html`; after this change `#i-minus` is unused. Leave the symbol in place — other pages/components may reference it.

## Steps

1. Confirm `--ease-out` exists in `output/css/tokens.css` (plan 000). If not, STOP.
2. `output/js/main.js`, inside `renderFaqs` (line ~120):
   a. In the template, change `<use href="#i-${openFaq === index ? 'minus' : 'plus'}">` to `<use href="#i-plus">`.
   b. Replace the single-line `$$('[data-faq-index]', faqList).forEach(...)` wiring with the Target JS (define `setFaqOpen` just above `renderFaqs`, outside it, so it is created once).
3. Leave the filter handler (`[data-faq-filter]`, line ~123) as is — it resets `openFaq = -1` and calls `renderFaqs()`, which is the one legitimate re-render.
4. `output/css/components.css`: apply the Target CSS to `.c-accordion__indicator svg` (line ~1712) and `.c-accordion__panel` (line ~1717); add the reduced-motion block directly after `.c-accordion__panel.is-open`.

## Boundaries

- Do NOT convert to `<details>`; the markup and ARIA wiring stay.
- Do NOT animate `height`/`max-height` instead of the grid trick.
- Do NOT touch the FAQ filter buttons' styling or the FAQ JSON-LD block (`main.js:131-136`).
- If `renderFaqs` no longer contains the `'minus' : 'plus'` ternary, STOP and report.

## Verification

- **Mechanical**: `grep -c "i-minus" output/js/main.js` prints `0`. `grep -n 'setFaqOpen' output/js/main.js` prints ≥ 3 matches. In the browser, click a question: DevTools Elements shows `.is-open` added to the existing panel node (the node identity does not change — select it first, then click; the selection stays highlighted).
- **Feel check**: click a question — the answer unfolds over ~300ms, fast at first then settling; the + rotates into an × in the same beat. Click it again — it folds up on the same curve. Click a second question while the first is open: the first closes and the second opens simultaneously. Click the same trigger twice quickly: the panel reverses mid-motion rather than snapping closed and reopening (this is the interruptibility win; if it snaps, the class is being re-rendered somewhere).
- Change a category filter: the list re-renders with everything closed, as before.
- Emulate reduced motion: panels open instantly; the icon switches without rotating.
- **Done when**: height and icon animate on every toggle, rapid toggles reverse smoothly, and filters still work.
