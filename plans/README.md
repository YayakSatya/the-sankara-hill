# Animation plans

Written by `improve-animations plan` at commit `5e87f5d` from the `find-animation-opportunities` report. Each plan is self-contained; execute with `improve-animations execute plans/NNN-*.md` or hand it to any agent.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 000 | [Add shared easing tokens and per-component reduced-motion](000-motion-tokens.md) | MEDIUM | DONE |
| 001 | [Scroll-reveal for sections below the hero](001-scroll-reveal.md) | MEDIUM | DONE |
| 002 | [Cross-fade the room panel on tab switch](002-room-tab-crossfade.md) | MEDIUM | DONE |
| 003 | [Make the FAQ accordion actually animate](003-faq-accordion-toggle.md) | HIGH | DONE |
| 004 | [Guest dropdown scales from its trigger](004-guest-dropdown-entrance.md) | MEDIUM | DONE |
| 005 | [Mobile menu slides from the header](005-mobile-menu-entrance.md) | MEDIUM | DONE |

## Recommended order

1. **000** first — every other plan references `var(--ease-out)` and relies on the global reduced-motion blanket being removed.
2. **003** — the only HIGH: a bug, not a polish item. The accordion transition already exists and never runs.
3. **001** — highest visible leverage against "the page feels static"; largest diff (HTML attributes + CSS + JS).
4. **004** then **005** — same `@starting-style` + `allow-discrete` pattern; do 004 first, copy its structure for 005.
5. **002** — smallest, CSS-only, independent.

## Dependencies

- 001, 002, 003, 004, 005 → require 000.
- 005 imitates 004 but does not strictly depend on it.
- 001 and 002 both touch the rooms panel area (`[data-room-display]`): 001 puts `data-reveal` on the container, 002 animates its re-created children. No conflict, but run the room tab feel check after both.

## Not planned (rejected in the audit)

Hero parallax, stat count-up, nav-link underline motion, carousel arrow motion, booking-form submit animation, map POI label reveal. See the audit rationale before reopening any of these.
