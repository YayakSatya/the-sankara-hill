# The Sankara Hill Penida — Design System

Reference for building every page of the website in the same visual language as the home page (`output/index.html` phase 1, `output/home.html` phase 2). Source of truth for values is `output/css/tokens.css`; source of truth for component markup is `output/components.html`. When this document and the CSS disagree, the CSS wins — update this file.

Related documents: `prd.md` (scope and acceptance criteria), `SKILL-FE.md` (frontend generation rules), `SCALING.md` (fluid scaling model), `IMPLEMENTATION-PLAN.md` (page-by-page build plan).

---

## 1. Brand and tone

| Aspect | Direction |
|---|---|
| Positioning | "The Altitude's Serenade" — refined hilltop sanctuary, elevated luxury, ocean panoramas, subtle Balinese touches |
| Mood | Calm, warm, editorial. Generous whitespace, photography-led, quiet gold accents. Never loud, never busy |
| Dials | ENERGY 1 / RHYTHM 2 / MOTION 2. Calm voice; sections keep one grid but break it once per page (editorial split, full-bleed band); motion is scroll reveal and hovers, no parallax |
| Voice | Second person, present tense, unhurried. Names of venues keep their Pali/Sanskrit origin (Puṇṇa, Sukha, Radha, Archapala) with the meaning explained once |
| Copy style | Kicker in uppercase sans → serif title → optional italic serif tagline → short sans body. Sentence case for titles except the hero (`THE SANKARA`) |
| Language | English is the build language. Indonesian is delivered through Polylang; markup must never assume string length |

---

## 2. File structure

```
output/
├── index.html            phase 1 single page (kept as-is)
├── home.html             phase 2 home — reference page for this system
├── accommodation.html    room listing (archive-room.php)
├── room-<slug>.html      room detail template ×3 (single-room.php)
├── contact.html          contact details, inquiry form, map, directions (page-contact.php)
├── dining.html           Puṇṇa overview, day at Puṇṇa, menu, Sukha deck, gallery, hours (page-dining.php)
├── spa.html              Radha overview, treatments, packages, wellness slider, gallery (page-spa.php)
├── experiences.html      filterable activity cards, one chapter per experience, island map, Archapala chapel (archive-experience.php / single-experience.php)
├── offers.html           active offers, how to book, tailored-stay CTA (archive-offer.php)
├── offer-<slug>.html     offer detail template ×2 (single-offer.php)
├── about.html            story, hotel information, the four names, facilities + hours, location (page-about.php)
├── gallery.html          filterable photo mosaic + lightbox; #dining, #suites, #lobby … pre-select a chip (page-gallery.php)
├── testimonials.html     guest stories grid (hidden until real reviews are entered), review platforms (page-testimonials.php)
├── faq.html              static accordion grouped by topic, topic chips, concierge aside, FAQPage JSON-LD in the head (page-faq.php)
├── blog.html             featured post as a chapter, category chips, article card grid, pagination (index.php)
├── article.html          post template: hero with category · date · reading time, prose body with one wide figure, tags + share, related posts, transfer CTA (single.php)
├── 404.html              short ink hero, info notice with three ways back, three quick-link cards without media (404.php)
├── components.html       living style guide, links the same CSS as every page
├── css/
│   ├── tokens.css        :root custom properties only
│   ├── base.css          reset, html/body, headings, focus, skip link
│   ├── components.css    every global/reusable component
│   └── pages/
│       ├── home.css      page-only layout (one file per page)
│       ├── accommodation.css
│       ├── room-detail.css  shared by the three room pages
│       ├── contact.css
│       ├── dining.css
│       ├── spa.css
│       ├── experiences.css
│       ├── offers.css       shared by the listing and the detail template
│       ├── about.css
│       ├── gallery.css
│       ├── testimonials.css
│       ├── faq.css
│       ├── blog.css         shared by the listing and the article template
│       └── error.css
├── js/
│   ├── main.js           vanilla JS for global components
│   ├── gallery.js        lightbox (pages with a photo gallery)
│   └── contact.js        inquiry form validation + fetch submit
└── images/               kebab-case assets
```

Every page links CSS in this order: `tokens.css` → `base.css` → `components.css` → `pages/<page>.css`. No inline `<style>`, no `style=""` (style-guide swatches excepted). Vanilla JS only.

Rule: anything used on two pages lives in `components.css` and gets a block in `components.html`. Page CSS holds only section shells and one-off layout.

---

## 3. Design tokens

### 3.1 Colour

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f8f6f2` | Page background, light sections |
| `--color-surface` | `#f5f2ea` | Alternate sections, input backgrounds, chip surfaces |
| `--color-card` | `#fff` | Cards, panels, accordion items |
| `--color-ink` | `#2d2d2a` | Primary text, dark sections (info band, CTA band, footer) |
| `--color-muted` | `#5c5852` | Body copy |
| `--color-soft` | `#6f6863` | Labels, meta, captions, placeholders. Darkened from `#78716c` so 12px text passes 4.5:1 on `--color-bg` and `--color-surface`, not only on white |
| `--color-accent` | `#4b5e50` | Primary button, active chip, bullet dots |
| `--color-accent-dark` | `#3d4d41` | Primary hover, header booking button once scrolled |
| `--color-gold` | `#c5a059` | Rules, stars, kicker on dark, active tab underline, gold button. Not on spec/meta icons (those use `--color-soft`) so gold stays the one accent per block |
| `--color-gold-dark` | `#b38f48` | Gold button hover |
| `--color-gold-text` | `#8a6a1f` | Gold **text** on light surfaces (4.5:1). Never use `--color-gold` for body-size text on light |
| `--color-line` | `#e7e3d4` | Hairlines, borders, dividers |
| `--color-inverse` | `#fff` | Text on dark |
| `--color-error` | `#e11d48` | Validation errors |
| `--color-success` | `#2f7a4f` | Success notices (inquiry sent) |
| `--color-whatsapp` | `#25d366` | WhatsApp float only |
| `--color-focus` | `var(--color-ink)` | Focus ring |

Translucent overlays are written inline as `rgb(… / %)` from these bases: header scrim `rgb(45 45 42 / 70%)`, hero scrim `rgb(0 0 0 / 45%)`, page-hero scrim gradient `70% → 40% → 15%` bottom to top (text sits at the bottom, so the dark band is heaviest there), badge and tag pills `rgb(248 246 242 / 92%)` with no blur, dark-surface hairlines `rgb(255 255 255 / 10–12%)`, dark-surface secondary text `rgb(255 255 255 / 60–70%)`. `backdrop-filter` is limited to the scrolled header, the slider arrow and the lightbox backdrop; badges over photos rely on their opaque fill. Text over hero photos (breadcrumb, tagline, meta) is full white, never a white alpha.

### 3.2 Typography

| Token | Family | Role |
|---|---|---|
| `--font-serif` | Lora 300–700 (Google Fonts) | Headings, taglines, quotes, spec values, footer name |
| `--font-sans` | Switzer 300–700 (Fontshare) | Body, labels, buttons, nav |

Body weight is **300**. Headings are **300** serif. Emphasis is done with size and colour, not bold — bold (600/700) is reserved for labels, buttons, meta, and kicker text.

Type scale (design px at 1440, fluid to 2560):

| Token | 1440px | Use |
|---|---|---|
| `--text-h1` | 88px | Hero title only |
| `--text-h2` | 52px | Section titles |
| `--text-h3` | 36px | Chapter / room / page-hero titles, footer name |
| `--text-h4` | 24px | Card titles, info values, CTA band title |
| `--text-body-lg` | 19px | Taglines, quotes, accordion question |
| `--text-body` | 16px | Body, accordion answer |
| `--text-body-sm` | 15px | Card text, buttons, meta, footer |
| `--text-label` | 13px | Kickers, nav, chips, tabs |
| `--text-caption` | 12px | Badges, spec labels, form labels |

Below 1440px the display sizes use the tuned ramp in `tokens.css` (`h1` 40→88px, `h2` 30→52px, `h3` 22→36px, `h4` 18→24px).

Line heights: `--line-tight` 1.15 (headings), `--line-snug` 1.4, `--line-body` 1.6 (default), `--line-loose` 1.8 (long prose in chapters/rooms). Caps tracking `--tracking-caps` 0.06em.

Recurring text styles:

- **Kicker** — `--text-label`, uppercase, tracking caps, weight 500, `--color-gold-text` (light) / `--color-gold` (dark). Classes: `.section-head__kicker`, `.chapter__subtitle`, `.welcome__eyebrow`, `.info__kicker`, `.cta__label`.
- **Tagline** — serif italic, `--text-body-lg` or `--text-body-sm`, `--color-gold-text`. Classes: `.chapter__tagline`, `.card__tagline`, `.amenity__tagline`, `.welcome__tagline`.
- **Meta label** — `--text-caption`, uppercase, weight 600, `--color-soft`. Classes: `.spec__label`, `.room__details-label`, `.card__kicker`, `.amenity__label`.

### 3.3 Spacing

`--space-1` 3px · `-2` 6px · `-3` 9px · `-4` 12px · `-5` 15px · `-6` 18px · `-8` 24px · `-10` 30px · `-12` 36px · `-16` 48px · `-20` 60px · `-24` 90px (all at 1440px; fluid above, phone overrides below 768px).

Rhythm rules:

- Section padding: `padding-block: var(--space-24)`.
- Section head → content: `--space-12` (`.section-head` margin-bottom).
- Between chapters: `--space-24`. Between cards: `--space-6` (grid) / `--space-5` (slider track).
- Card body padding: `--space-6`. Panel padding: `--space-8` (phone) → `--space-12` (≥768px).
- Horizontal gutter: `--gutter` (24px → 24px tablet → 24px, 1.5rem phone, 1.25rem ≤479px).

### 3.4 Radii, lines, controls

- `--radius-sm` 7.5px — cards, images, tags, accordion.
- `--radius-md` 12px — CTA band, booking widget, empty state.
- `--radius-lg` 18px — reviews / testimonial cards.
- `999px` — every `.button`, chips, POI markers, WhatsApp float, social buttons.
- Hairlines are always `1px solid var(--color-line)`; thick rules `--rule-thick` (2px) for active tab underline and hamburger bars.
- Hit targets: `--control-min` 44px on every button, the header pill, the hamburger toggle, the language links and footer list links. `--control-min-sm` 40px is for square icon controls only (slider arrows, lightbox nav). POI markers and breadcrumb links keep their visual size and grow to 44px through `::after`.
- Button arrows: `→` only on outline buttons that go to another page (about chapters), `↗` only on outline buttons that open a new tab (Open in Google Maps). Primary, gold and pill buttons never carry an arrow; a submit button never does; an in-page anchor button (View Treatments, See the Menu) never does.
- Disabled controls: a link is never rendered with `aria-disabled`; if its destination does not exist yet (menu PDF), the control is not rendered at all and a `TODO(content)` comment marks the spot.

### 3.5 Layout

- `--content-width` 1200px (fluid to 2560px), `--layout-max` 2560px pillarbox cap.
- `.container` = max-width + `--gutter` inline padding. `.grid-12` = 12 columns at ≥1024px, single column below; `.col-7` / `.col-5` split is the standard editorial pair (media 7, copy 5).
- Breakpoints (px, not scaled): `480`, `640`, `768`, `1024`, `1280`, `1440` (type ramp switch), `2560` (fluid cap).

### 3.6 Media heights

`--media-h-sm` 210px (card media), `--media-h-md` 350px (tall card, chapter phone), `--media-h-lg` 500px (chapter ≥768px, map), `--frame-h-room` 400px (room gallery). Phone overrides: 180 / 350 / 380px.

### 3.7 Icons

Lucide, 24px viewBox, stroke 2. Chosen because its 2px stroke matches the weight of Switzer 500 labels it sits beside, and its plain outlines stay quiet next to photography (a filled or duotone set would compete with the images). Icons appear only where they carry a value: spec rows (size, view, bedding), info-band items, contact rows, buttons, card meta (in `--color-soft`). Amenity lists and hours tables are plain text; no icon-per-row. Amenity slider cards carry no icon pill over the photo (the label under the photo already names the facility). Empty-state icons name the missing content (camera, flower, utensils); never sparkles. Inlined as an SVG sprite at the top of `<body>` and referenced with `<svg><use href="#i-name"></use></svg>`. Sizes `--icon-sm` 14px (inside buttons, meta), `--icon-md` 18px (arrows, nav), `--icon-lg` 20px (spec, emblem, float). Only the symbols a page uses are included in its sprite. Brand glyphs (WhatsApp, Facebook) use `fill="currentColor"`.

### 3.8 Motion

- Curves: `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)`.
- Colour/border hovers: 0.3s. Image zoom on hover: 0.4–0.5s `scale(1.04–1.05)`.
- Hero: `hero-zoom` 1.8s on the image, `hero-rise` 1s (0.3s delay) on the content. Used on the home hero only; page heroes use the same keyframes with shorter durations (see `IMPLEMENTATION-PLAN.md`).
- Scroll reveal: `[data-reveal]` → `.is-inview`, 900ms, 24px rise, staggered 80–100ms within grids (`.info__grid`, `.amenities__track`, `.card-grid`, `.testimonials__track`).
- Accordion: `grid-template-rows 0fr → 1fr` 300ms; plus icon rotates 45°.
- Mobile menu and dropdowns: `@starting-style` + `allow-discrete`, 200ms.
- `prefers-reduced-motion`: movement removed, fades kept (400ms). Every new transition must add its reduced-motion rule.

---

## 4. Page anatomy

Every page follows this skeleton. Sections alternate `--color-bg` and `--color-surface`, each closing with `border-bottom: 1px solid var(--color-line)`. Dark bands (`.info`, `.cta__inner`, `.footer`) break the rhythm at most twice per page.

```
<svg class="sprite">            icons used on this page
<a class="skip-link">
<header class="header" data-header>       fixed, transparent over hero → light on scroll
  .header__bar  (.container)  logo | .header__nav | .header__actions (.lang + Book Now + toggle)
  .mobile-menu  (data-mobile-menu)
<main id="main-content">
  hero  (.hero on home, .page-hero on inner pages)
  section … section
  .locate  (contact strip, optional)
<footer class="footer">  brand block | 4 link columns | bottom bar (© + .lang)
<a class="whatsapp-float">
<script src="js/main.js">
```

Navigation order (desktop): Home · About · Accommodation · Dining · Spa · Experiences · Offers · Contact. Mobile menu adds Gallery and Blog. Active page gets `aria-current="page"`. Every Book Now carries `data-booking-cta` and opens the STAAH URL in a new tab.

---

## 5. Component catalogue

All classes are BEM, no prefixes. State classes: `.is-active`, `.is-open`, `.is-scrolled`, `.is-inview`, `.is-error`; ARIA attributes carry the same state for assistive tech.

### Structure

| Component | Classes | Notes |
|---|---|---|
| Container | `.container` | Max width + gutter |
| 12-col grid | `.grid-12`, `.col-7`, `.col-5` | Editorial media/copy split |
| Section head | `.section-head`, `__kicker`, `__title`, `__text`, `__rule`, `__rule--center` | Stacked heading block |
| Section head, row | `.section-head--row`, `.section-head__actions` | Title left, "View all" button right; stacks <768px |

### Navigation

| Component | Classes | States |
|---|---|---|
| Header | `.header`, `__bar`, `__brand`, `__logo`, `__nav`, `__link`, `__actions`, `__booking`, `__lang`, `__toggle` | `.is-scrolled` after 24px: light background, blur, logo un-inverted, links go muted |
| Mobile menu | `.mobile-menu`, `__link`, `__meta` | `.is-open`; `aria-expanded` on toggle |
| Language switcher | `.lang`, `.lang__link`, `.lang--light` | `.is-active` + `aria-current="true"`; `hreflang` and `lang` on each link |
| Skip link | `.skip-link` | Visible on focus |

### Actions

| Variant | Class | Use |
|---|---|---|
| Primary | `.button.button--primary` | Book Now on cards, form submit |
| Outline | `.button.button--outline` | Secondary, "View all", details |
| Gold | `.button.button--gold` | Hero Book Now, WhatsApp inquiry |
| Light | `.button.button--light` | Header booking over hero; flips to dark when scrolled |
| Ghost | `.button.button--ghost` | Secondary link over photography |
| Pill (compact) | `.button--pill` | Modifier: 40px height, tighter padding (header) |
| Text link | `.card__link`, `.room__more` | Gold text, arrow slides 3px on hover |
| Chip | `.chip` | Filters; `.is-active` + `aria-pressed` |
| Tab | `.room-tab` | `.is-active` + `aria-selected`; gold underline |

Buttons are uppercase, `--text-body-sm`, weight 600, 44px min height, pill radius (999px) on every variant. Icon inside a button is `--icon-sm`.

### Content blocks

| Component | Classes | Where |
|---|---|---|
| Hero | `.hero`, `__media`, `__scrim`, `__content`, `__kicker`, `__title`, `__tagline`, `__tagline-line`, `__actions` + `.booking` widget | Home only (100svh); widget hands dates/guests to STAAH |
| Welcome | `.welcome`, `__intro`, `__eyebrow`, `__title`, `__tagline`, `__text`, `__actions` | Home; About reuses the pattern |
| Island map | `.map`, `__legend`, `__points`, `__contours`, `__land`, `__relief`, `__place`, `__footer`; `.poi` + `.poi--*-pos` position modifiers | Home, Contact |
| Info band | `.info`, `__inner`, `__head`, `__kicker`, `__title`, `__grid`; `.info-item`, `__icon`, `__label`, `__value` | Dark `<dl>` band, 2/3/6 columns |
| Chapter | `.chapter`, `.chapter--flip`, `__grid`, `__media`, `__badges`, `__badge`, `__body`, `__subtitle`, `__title`, `__tagline`, `__text` | Alternating 7/5 media-copy stories (Dining, Spa, About, Facilities) |
| Room panel | `.rooms`, `__tabs`; `.room`, `__gallery`, `__frame`, `__tags`, `__panel`, `__name`, `__desc`, `__specs`, `__details`, `__detail`, `__more`, `__actions`; `.spec`, `.tag` | Tabbed room detail (rendered by `main.js`) |
| Card | `.card`, `.card--tall`, `__media`, `__badges`, `__body`, `__kicker`, `__title`, `__tagline`, `__text`, `__meta`, `__actions`, `__link` | Rooms, offers, experiences, blog, treatments |
| Card grid | `.card-grid`, `.card-grid--2` | 1 / 2 / 3 columns (2 with modifier) |
| Amenity slider | `.amenities`, `__container`, `__head`, `__cta`, `__viewport`, `__arrow(--left/--right)`, `__track`; `.amenity`, `__media`, `__scrim`, `__body`, `__label`, `__name`, `__tagline`, `__text`, `__meta` | Horizontal scroll-snap, bleeds to viewport edge; `main.js` hides both arrows whenever every card fits (no permanently disabled arrows) |
| Gallery | `.gallery__grid`, `.gallery__item`, `--wide`, `--tall`, `__caption` | 2/4-column dense mosaic; captions on hover, always on touch |
| Testimonials | `.testimonials__track`; `.testimonial`, `__quote`, `__stars`, `__text`, `__meta` | Swipe track <1024px, 3-col grid above |
| Reviews aside | `.reviews`, `__stars`, `__eyebrow`, `__track`; `.review`, `__text`, `__meta` | Side card next to FAQ |
| FAQ | `.faq`, `__layout`, `__column`, `__filters`, `__list`, `__reviews`; `.accordion__item`, `__trigger`, `__question`, `__indicator`, `__panel`, `__panel-inner`, `__answer` | Single-open accordion, filter chips |
| CTA band | `.cta`, `.cta__inner`, `__label`, `__title` | Dark band with one gold button. On venue pages (dining, spa) the button is the venue action (Reserve a Table / Reserve a Treatment); no second "Book Now" beside it, the header already carries it. The band itself is not a reveal target |
| Locate strip | `.locate`, `__grid`, `__body`, `__list`, `__item`, `__actions`, `__map`, `__map-fallback` | Address + map (5/7) |
| Empty state | `.empty-state`, `__icon`, `__title`, `__text` | Dashed card; `hidden` until WordPress has no content |
| Footer | `.footer`, `__container`, `__brand`, `__emblem`, `__name`, `__tagline`, `__contact`, `__contact-item`, `__socials`, `__social`, `__columns`, `__heading`, `__list`, `__bottom` | Dark; 1/2/4 columns |
| WhatsApp float | `.whatsapp-float`, `__label` | Fixed bottom-right; icon-only <640px |

### Inner-page components (Phase 3, `IMPLEMENTATION-PLAN.md` §1)

| Component | Classes | Notes |
|---|---|---|
| Page hero | `.page-hero`, `--short`, `__media`, `__scrim`, `__content`, `__breadcrumb`, `__kicker`, `__title`, `__tagline`, `__meta` | `80svh` on every inner page, title `--text-h2`, `hero-zoom` 1.2s / `hero-rise` 0.8s; breadcrumb replaces the kicker above the title; `__meta` holds category (link) · date · reading time on articles; `--short` = ink background, no photo, `__kicker` in place of the breadcrumb (404) |
| Breadcrumb | `.breadcrumb`, `--light`, `__list`, `__item`, `__separator` | `nav[aria-label="Breadcrumb"] > ol`; last item `aria-current="page"` |
| Prose | `.prose` | WordPress rich text: `h2/h3`, `p`, `ul/ol`, `blockquote > cite`, `figure`, `hr`; measure `--measure-md`, `--line-loose` |
| Form | `.form`, `__row`, `__row--3`, `__field`, `__label`, `__required`, `__input`, `__textarea`, `__select`, `__checkbox`, `__radio`, `__hint`, `__error`, `__honeypot`, `__actions`, `__status`, `--success`, `--error` | `:invalid` paints only after `.is-submitted` (set by `main.js`); `.form__field.is-error` for server errors; submit button `aria-busy` while sending |
| Filter bar | `.filter-bar`, `__label`, `__group`, `__group--scroll` | `[data-filter-group][aria-controls]` + `.chip[data-filter]`; items `[data-filter-item][data-category]`, empty state `[data-filter-empty]` |
| Pagination | `.pagination`, `__list`, `__link`, `__link--current`, `__prev`, `__next`, `__ellipsis` | `nav[aria-label="Pagination"]`; disabled ends `aria-disabled="true"` |
| Detail split | `.detail`, `__gallery`, `__strip`, `__panel` | Static 7/5 split reusing `.room__frame`, `.room__specs`, `.room__details`, `.room__actions`; panel sticky ≥1024px |
| Hours table | `.hours`, `--dark`, `__row`, `__note` | `dl` of opening hours or distances |
| Menu list | `.menu-list`, `--2`, `__note`, `__group`, `__heading`, `__items`, `__item`, `__name`, `__duration`, `__badge`, `__desc`, `__price` | Restaurant menu, spa treatments; price/duration optional. `__note` is the visible "Sample menu" label that stays until the real menu is published |
| Slider | `.slider`, `__arrows`, `__arrow`, `__track` | `[data-slider]` + `[data-slider-track/prev/next]`; scroll-snap, arrows ≥768px |
| Lightbox | `.lightbox`, `__bar`, `__count`, `__figure`, `__caption`, `__nav`, `__close`, `__prev`, `__next` | One `<dialog data-lightbox>` per page, `js/gallery.js`; items are `[data-lightbox-item]` links to the full image |
| Notice | `.notice`, `--info`, `--success`, `--error`, `__icon`, `__title` | Page-level message (404, form sent) |
| Steps | `.steps`, `__item`, `__number`, `__body`, `__title`, `__text` | `ol` of 3–5 steps (transfer to the resort, how to redeem an offer); bare serif numeral in `--color-gold-text` + hairline connector, no circle. Numbered because the legs happen in order and the guest is handed over at each one |
| Social links | `.social-links`, `__link` | Light-surface twin of `.footer__socials` (Contact details) |

Global data attributes read by `main.js`: `body[data-page]` sets `aria-current` on the matching nav link; `body[data-booking-url=""]` hides `[data-booking-cta]`; `body[data-whatsapp=""]` hides `.whatsapp-float`; `[data-accordion]` turns a group of static `.accordion__item` blocks (trigger with `aria-controls`) into a single-open accordion and opens the item named by the URL hash; `[data-copy-link="<url>"]` (article share row) starts `hidden`, is shown only when the clipboard API exists, and reports "Link copied" to the element named by its `aria-describedby`. `gallery.js` also reads `.chip[data-filter-alias="lobby views"]` so a hash from another page (`gallery.html#lobby`) pre-selects the matching chip. An icon-led `.room__detail` (contains `.room__detail-icon`) drops its bullet dot.

### Forms (booking widget today, inquiry form next)

`.booking__field`, `.booking__label` (caption, icon gold), `.booking__input` (surface background, hairline, `--radius-md`, hover/focus border gold), `.booking__trigger` + `.booking__menu` + `.booking__option` (custom dropdown), `.booking__note` / `.is-error` (status line). The Contact inquiry form must reuse these tokens and states; see `IMPLEMENTATION-PLAN.md` for the `.form` block that generalises them.

---

## 6. States

| State | Treatment |
|---|---|
| Hover | Border → gold on cards; image `scale(1.05)`; text → gold-text; buttons darken one step |
| Focus | `:focus-visible` 2px ink outline, 2px offset — never removed |
| Active / selected | `.is-active` with matching ARIA (`aria-selected`, `aria-pressed`, `aria-current`) |
| Disabled | `opacity: 0.3; cursor: not-allowed` (slider arrows); buttons `disabled` attribute |
| Empty | `.empty-state` inside the section, section head stays; optional secondary action (WhatsApp, Instagram, TripAdvisor) |
| Error | `--color-error` text under the field; `.booking__note.is-error` for form-level |
| Success | `--color-success` notice replacing the form or above it, `role="status"` |
| Loading | Submit button text swaps to "Sending…" with `aria-busy="true"`; no spinner library |
| 404 | Page hero + short message + primary button to Home + secondary to Contact |

---

## 7. Imagery

- Photography fills its frame with `object-fit: cover`; always inside a bordered, rounded (`--radius-sm`) container.
- Overlays: dark bottom gradient on cards (`.amenity__scrim`, `.gallery__caption`), flat 45% scrim on hero.
- Glass pills over photos for hours/badges (`.chapter__badge`, `.tag`).
- Every `<img>` has descriptive `alt`, `width`/`height`, `loading="lazy"` (except hero), `decoding="async"`.
- Until the client photo set arrives, assets are reused across sections with an `<!-- assumption -->` comment.

---

## 8. Accessibility rules

- One `h1` per page (hero title). Section titles `h2`, card/chapter titles `h3`. Footer headings are `h2` visually styled as labels.
- Landmarks: `header`, `nav[aria-label]`, `main#main-content`, `footer`, `aside`.
- Icon-only controls get `aria-label`. Decorative SVGs get `aria-hidden="true"`.
- Custom widgets carry full ARIA: tabs (`role=tablist/tab/tabpanel`), accordion (`aria-expanded`, `aria-controls`), dropdown (`role=listbox/option`), status lines (`role=status`, `aria-live=polite`).
- Minimum 44px touch targets; 4.5:1 contrast for text (use `--color-gold-text` on light).
- Reduced motion honoured in every animated rule.

---

## 9. Automation IDs

Every interactive or QA-relevant element has a stable `id`: `<page>_<element>_<component>` in lowercase snake_case; repeated items append a business slug, never an index.

```
home_page_header_booking_button
home_page_room_card_ocean_hill_suite
home_page_offer_booking_button_package_one
home_page_faq_filter_booking_button
contact_page_inquiry_submit_button
accommodation_page_room_tab_garden_view_pool_villa
```

Suffix vocabulary: `_input`, `_button`, `_link`, `_checkbox`, `_radio`, `_select`, `_dropdown`, `_tab`, `_nav`, `_card`, `_item`, `_image`, `_label`, `_badge`, `_modal`, `_error`, `_loading`, `_empty_state`, `_list`, `_track`, `_grid`, `_embed`. Never rename an existing id.

---

## 10. Do / Don't

**Do**

- Start every section with `.section-head` (kicker → title → optional text → rule/actions). Every section on a page gets a kicker, or none does; chapters use `.chapter__subtitle` instead.
- Photos: each photo appears once per page below the hero; captions and `alt` describe what is in the frame, never the venue it stands in for. When no honest photo exists for a venue, the gallery shows its empty state.
- Alternate `bg` / `surface` backgrounds and close sections with a hairline.
- Use `.card` for any list of things with an image; use `.chapter` for any single story.
- Put content rules in `components.css` and document them in `components.html` in the same change.
- Keep a `hidden` `.empty-state` next to every CMS-driven list.

**Don't**

- Don't introduce new hex values, px spacing, or fonts outside `tokens.css`.
- Don't use bright `--color-gold` for text on light backgrounds.
- Don't add a third dark band on one page.
- Don't build a booking form — every booking action is a link to STAAH.
- Don't ship a section without its reduced-motion rule, focus state, and empty state.
