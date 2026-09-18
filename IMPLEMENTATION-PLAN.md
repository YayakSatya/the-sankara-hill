# Implementation Plan — Halaman Website The Sankara Hill Penida

Rencana pembuatan seluruh halaman In Scope sesuai `prd.md`, dibangun di atas design system `design.md` dan output home phase 2 (`output/home.html`). Setiap halaman dibuat sebagai static HTML di `output/` terlebih dahulu (tokens → base → components → pages/*.css), lalu dipindahkan ke WordPress theme template.

Konvensi:

- **Komponen** merujuk ke class di `output/css/components.css` (lihat katalog di `design.md` §5).
- **Content** merujuk ke `TSH_Website_Contentwriting.md` (CW) dan `TSH_Hotel_Information_Presentation.md` (Deck).
- **ID** mengikuti `<page>_<element>_<component>`; prefix per halaman tercantum di tiap bagian.
- **Empty state** wajib ada (`.empty-state`, `hidden`) di setiap list yang dikelola CMS.
- Setiap Book Now = link ke STAAH URL global, `target="_blank"`, `data-booking-cta`.

---

## 0. Urutan pengerjaan

| Tahap | Halaman | Alasan |
|---|---|---|
| 0 | Komponen global baru (§1) | Dipakai semua halaman inner |
| 1 | `accommodation.html` | Jalur booking utama (PRD 7.1) |
| 2 | `contact.html` | Inquiry form + WhatsApp + Maps (PRD 5.6, 5.7) |
| 3 | `dining.html`, `spa.html` | Konten CW sudah lengkap |
| 4 | `experiences.html`, `offers.html` (+ detail) | Konten masih placeholder; struktur harus siap |
| 5 | `about.html`, `gallery.html`, `testimonials.html`, `faq.html` | Konten mayoritas sudah ada di home |
| 6 | `blog.html`, `article.html` | Konten dari client, template generik |
| 7 | `404.html`, mirror `/id/` | Penutup |

Definition of Done per halaman: semua section pada daftar terbangun, gambar tidak ada yang broken, ID unik, empty state tersedia, responsif 375 / 768 / 1024 / 1440 / 1920, `components.html` diperbarui bila ada komponen baru, checklist QA manual ditulis di akhir file.

---

## 1. Komponen global baru (dibuat sebelum halaman inner)

Ditambahkan ke `components.css` dan didokumentasikan di `components.html`.

| Komponen | Class | Kebutuhan |
|---|---|---|
| Page hero | `.page-hero`, `__media`, `__scrim`, `__content`, `__title`, `__tagline`, `__breadcrumb` | Hero inner page tinggi `80svh` (sama di semua halaman selain home), judul `--text-h2`, breadcrumb kecil di atas judul (tanpa kicker). Animasi sama dengan home (`hero-zoom` 1.2s, `hero-rise` 0.8s) |
| Breadcrumb | `.breadcrumb`, `__item`, `__separator` | `nav[aria-label="Breadcrumb"] > ol`, caption uppercase, item terakhir `aria-current="page"` |
| Prose | `.prose` | Rich text dari WordPress: `h2/h3`, `p`, `ul`, `blockquote`, `figure`; measure `--measure-md`; line-height `--line-loose` |
| Form | `.form`, `__row`, `__field`, `__label`, `__input`, `__textarea`, `__select`, `__checkbox`, `__radio`, `__hint`, `__error`, `__actions`, `__status`, `__status--success`, `__status--error` | Generalisasi `.booking__*`; input custom, `aria-describedby` ke hint/error, `:invalid` hanya setelah submit (`.is-submitted`) |
| Filter bar | `.filter-bar`, `__group` | Baris `.chip` untuk kategori (gallery, blog, experiences) |
| Pagination | `.pagination`, `__link`, `__link--current`, `__prev`, `__next` | Untuk blog & offers listing |
| Detail hero split | `.detail`, `__gallery`, `__panel` | Reuse `.room__gallery` / `.room__panel` untuk room & offer detail |
| Hours table | `.hours`, `__row` | `dl` jam operasional (dining, spa, facilities) |
| Menu list | `.menu-list`, `__group`, `__item`, `__name`, `__desc`, `__price` | Menu restoran & treatment spa; harga opsional |
| Lightbox (opsional) | `.lightbox`, `__figure`, `__close`, `__prev`, `__next` | `<dialog>` native, vanilla JS di `js/gallery.js`; tanpa JS link ke file gambar |
| Notice | `.notice`, `--info`, `--success`, `--error` | Pesan halaman (form terkirim, 404) |

JS tambahan di `js/main.js`: aktifkan `aria-current` nav berdasarkan `body[data-page]`, generic `[data-slider]` (dipakai testimonial dan gallery strip), sembunyikan `[data-booking-cta]` bila `body[data-booking-url]` kosong.

---

## 2. Halaman

### 2.1 Home — `home.html` (selesai, referensi)

Prefix ID: `home_page_`. Struktur mengikuti landing phase 1 (`index.html`) ditambah section PRD 5.2 yang belum ada:

Hero (booking widget: check-in/out + guests → STAAH URL dengan query dates) → Welcome + Island Map (link About) → Hotel Information → Facilities Overview (4 `.chapter`: Puṇṇa, Sukha, Radha, Archapala, masing-masing link ke halamannya) → Accommodation (`.rooms__tabs` + `.room` panel dari `main.js`, "View All Rooms") → Facilities slider (`.amenities` 4 kartu + CTA WhatsApp) → **Offers** (2 `.card` + empty state) → **Experiences** (3 `.card` + empty state) → **Gallery** (mosaic 8 + empty state) → FAQ (accordion + aside Guest Stories `#testimonials`) → Footer (link semua halaman + `.lang`) → WhatsApp float.

Perubahan global untuk phase 2: nav multi-page + `aria-current`, language switcher EN/ID (header, mobile menu, footer), `hreflang`, `body[data-booking-url]` dipakai `main.js` untuk Book Now di room panel (kosong → semua `[data-booking-cta]` disembunyikan).

Sisa TODO(content): hero video/slider, Hotel Information resmi, intro Accommodations, nama & isi dua paket Offers, foto per room/venue, review asli.

---

### 2.2 About Us — `about.html` (selesai)

Prefix ID: `about_page_`. PRD: 4.2 "membaca About Us agar memahami properti dan brand".
Content: CW Landing Page description, Deck "Welcome", "Facilities Overview", "Hotel Facilities", "Location & Distances".

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | Kicker "About Us", judul "The Altitude's Serenade", foto resort | Breadcrumb Home › About |
| 2 | Story | `.welcome` (col-7) + foto lobby (col-5) | Dua paragraf deskripsi CW | Tanpa map |
| 3 | Hotel information | `.info` | 6 item Deck | Sumber sama dengan home |
| 4 | Philosophy of names | `.chapter` ×4 (`--flip` bergantian) | Puṇṇa, Sukha, Radha, Archapala: arti nama + tagline | Setiap chapter link ke halaman venue |
| 5 | Facilities list `#facilities` | `.card-grid` 3 kolom, `.card` tanpa media atau `.amenity` | 12 fasilitas Deck + jam buka (`.hours`) | Target link "Explore all facilities" dari home |
| 6 | Location & distances `#location` | `.locate` (map island `.map` di kolom kanan) + tabel jarak (`.hours` reuse) | 6 landmark Deck | Link "Directions" ke contact |
| 7 | CTA band | `.cta__inner` | "Plan your stay" → Book Now (STAAH) + WhatsApp | |
| 8 | Footer + WhatsApp float | global | | |

CSS: `pages/about.css`. JS: tidak ada. Catatan build: fasilitas tidak dibangun sebagai 12 kartu seragam; venue dengan jam buka masuk tabel `.hours` (col-7) dan layanan tanpa jam masuk daftar `.room__details` berikon (col-5). Chapter nama memakai satu paragraf arti nama saja (deskripsi venue tinggal di halamannya). Peta di col-7, jarak Deck di col-5, tombol Google Maps memakai link search yang sama dengan contact.

---

### 2.3 Accommodation — `accommodation.html` (+ detail per room)

Prefix ID: `accommodation_page_`. PRD 5.3: list room, buka detail, amenities + media, Book Now ke STAAH, tanpa availability/payment.
Content: CW Accommodations (3 tipe + amenities), Deck (jumlah unit).

**Listing**

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Accommodations — 41 Suites & Pool Villas" | |
| 2 | Intro | `.section-head` + `.section-head__text` | Intro Deck (CW masih lorem) | TODO(content) |
| 3 | Room categories | `.rooms__tabs` (Suites / Villas) + `.card-grid` `.card--tall` | 3 kartu: nama, sqm, unit, bed, view, 2 tombol (Details, Book Now) | Empty state `accommodation_page_rooms_empty_state` |
| 4 | Room detail anchors `#ocean-hill-suite`, `#garden-view-pool-villa`, `#ocean-view-pool-villa` | `.room` (gallery 7 / panel 5) ×3 | Deskripsi, `.room__specs` (size, view, capacity, bedding), `.room__details` amenities lengkap (17 item, "View all"), `.room__actions` Book Now + Inquire | Static: 3 panel berurutan. WordPress: single template `single-room.php`, listing link ke `/accommodation/<slug>/` |
| 5 | Room gallery strip | `.gallery__grid` per room atau `[data-slider]` | Foto per tipe (pending) | Empty → sembunyikan |
| 6 | Good to know | `.info` versi light atau `.hours` | Check-in 14.00, check-out 12.00, pets no, disabled facilities not available | |
| 7 | Other rooms / CTA band | `.cta__inner` | "Not sure which room? Talk to us" → WhatsApp | |
| 8 | Footer + WhatsApp | global | | |

**Detail (static `room-<slug>.html`, WordPress `single-room.php`)**: hero foto room → breadcrumb Home › Accommodation › Room → `.detail` split (gallery 7 / panel 5: deskripsi, specs, highlights, Book Now + Inquire) → amenities grid penuh `#amenities` → gallery mosaic + lightbox → Good to know → "Other rooms" `.card-grid--2` → CTA. ID prefix `room_detail_page_`. Listing tidak memuat panel detail; kartu link ke halaman detail masing-masing, ditambah tabel `#compare`.

CSS: `pages/accommodation.css` (listing), `pages/room-detail.css` (template detail). JS: filter kategori via `[data-filter-group]` generik; lightbox `js/gallery.js`.

---

### 2.4 Dining — `dining.html` (selesai)

Prefix ID: `dining_page_`. PRD 5.4: overview, menu, dining experience, gallery, CTA.
Content: CW Dining (Puṇṇa, Sukha), Deck jam operasional.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Dining — The Sacred Moonlight Dining of Nusa Penida" | Foto dining sunset |
| 2 | Puṇṇa overview `#punna` | `.chapter` | Arti nama, deskripsi, badges jam (07.00–22.00, in-room dining) | |
| 3 | Dining experience | `.steps` (col-7) + foto (col-5) | Breakfast, Lunch & Dinner, In-villa dining (deskripsi ringkas, jam) | assumption: pembagian dari deskripsi CW; dibangun sebagai steps, bukan 3 kartu identik |
| 4 | Menu `#menu` | `.menu-list--2` 4 group (Breakfast / Lunch & Dinner / Desserts / Beverages) + tombol "Download Menu (PDF)" | CW "Link Menu: [link]" | TODO(content): item contoh, harga disembunyikan; empty state bila menu belum diunggah |
| 5 | Sukha Pool & Sunset Deck `#sukha` | `.chapter.chapter--flip` | Arti nama, deskripsi, jam 10.00–22.00 | Nama ikut CW (bukan "Phala") |
| 6 | Gallery | `.gallery__grid` 7 item (1 besar, 2 wide, 4 kecil) + lightbox | Foto dining | Empty state |
| 7 | Hours & reservation | `.hours` + `.cta__inner` | Jam ringkas, "Reserve a table" → WhatsApp, Book Now | |
| 8 | Footer + WhatsApp | global | | |

CSS: `pages/dining.css`. JS: tidak ada (menu statis / PDF).

---

### 2.5 Spa — `spa.html` (selesai)

Prefix ID: `spa_page_`. PRD 5.4: overview, treatments, packages, gallery, CTA.
Content: CW Spa (Radha), Deck jam 11.00–22.00.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Radha Spa Hill Penida — The Sky-Ridge Sanctuary" | |
| 2 | Overview | `.chapter` | Arti nama Radha, deskripsi, badge jam | |
| 3 | Signature treatments `#treatments` | `.menu-list--2` (Massages / Body and Face), durasi, tanpa harga | Daftar treatment: nama, durasi, deskripsi | TODO(content) "Link Menu: [link]": item contoh; empty state |
| 4 | Packages `#packages` | `.card-grid--2` `.card` | Paket spa (durasi, inklusi) | Empty state |
| 5 | Wellness facilities | `.amenities` slider | Yoga Pavilion, Gym, Infinity Pool (jam dari Deck) | Reuse kartu home |
| 6 | Gallery | `.gallery__grid` 7 item + lightbox | Foto spa | Empty state |
| 7 | CTA band | `.cta__inner` | "Reserve a treatment" → WhatsApp; secondary "Download spa menu" | |
| 8 | Footer + WhatsApp | global | | |

CSS: `pages/spa.css`. JS: tidak ada.

---

### 2.6 Experiences — `experiences.html` (selesai)

Prefix ID: `experiences_page_`. PRD 5.4: snorkeling, island tour, local activities, konten experience lain.
Content: Deck Experiences (Yoga, Canang Sari, Cooking Class), FAQ (tour & snorkeling), CW Archapala.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Experiences — Explore Nusa Penida" | |
| 2 | Intro | `.section-head` + text | Paragraf Deck "Activities" + "speak with our team" | |
| 3 | Filter | `.filter-bar` chips: All / On-site / Island Tours / Water / Culture | Filter client-side | JS `[data-filter]` generik dari FAQ chips |
| 4 | Experience list | `.card-grid` `.card` (kicker kategori, jam/durasi di `.card__meta`) | 6 kartu home + tambahan client | Empty state |
| 5 | Detail anchors `#hilltop-yoga` … `#snorkeling` | `.chapter` bergantian | Deskripsi panjang, jam, what to bring, how to book | Static; WordPress `single-experience.php` |
| 6 | Island map | `.map` (reuse home) + daftar jarak | Kelingking, Diamond, Billabong/Broken, Crystal Bay | |
| 7 | Archapala Wedding Chapel `#wedding-chapel` | `.chapter.chapter--flip` | CW Archapala | Bisa dipromosikan menjadi `weddings.html` bila client minta |
| 8 | CTA band | `.cta__inner` | "Arrange with our concierge" → WhatsApp | |
| 9 | Footer + WhatsApp | global | | |

CSS: `pages/experiences.css`. JS: filter chips (`[data-filter-group]` generik di `js/main.js`). Catatan build: intro + filter + list digabung dalam satu section; 6 kartu (3 on-site dari Deck, 2 island tour + 1 snorkeling dari FAQ) dengan chapter detail per kartu; peta di col-7 dengan daftar jarak Deck di col-5.

---

### 2.7 Offers — `offers.html` (+ detail, selesai)

Prefix ID: `offers_page_` / `offer_detail_page_`. PRD 5.5: admin CRUD promo, visitor lihat list & detail; edge case tidak ada promo aktif.
Content: CW Offers (lorem, "Packages Name 1/2").

**Listing**

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Special Offers" | |
| 2 | Intro | `.section-head` | TODO(content) | |
| 3 | Active offers | `.card-grid--2` `.card` (badge tipe, `.card__meta` periode & inklusi, tombol View Offer + Book Now) | 2 paket | Empty state **ditampilkan** bila tidak ada promo (PRD 6) |
| 4 | How to redeem | `.info` versi 3 item atau `.card-grid` 3 langkah | Pilih paket → Book via STAAH → Konfirmasi via email | assumption |
| 5 | CTA band | `.cta__inner` | Tailored stays → WhatsApp | |
| 6 | Footer + WhatsApp | global | | |

**Detail** (`offer-package-one.html`, `offer-package-two.html` static, prefix `offer_detail_page_`; WordPress `single-offer.php`; link home/listing "View Offer" ke file ini): hero foto → breadcrumb → `.room`-style split: gallery 7 + panel 5 (judul, periode `.card__meta`, deskripsi `.prose`, inklusi `.room__details`, T&C accordion, Book Now + Inquire) → "Other offers" `.card-grid--2` → CTA.

CSS: `pages/offers.css` (listing + detail). JS: accordion T&C via `[data-accordion]` generik di `main.js`; pagination hanya dirender WordPress bila > 6.

---

### 2.8 Blog — `blog.html` + `article.html` (selesai)

Prefix ID: `blog_page_` / `article_page_`. PRD 5.5: listing + detail article, Polylang.
Content: dari client (belum ada).

**Listing**

| # | Section | Komponen | Isi |
|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Stories from the Hill" |
| 2 | Featured article | `.chapter` | Artikel terbaru / sticky |
| 3 | Filter | `.filter-bar` kategori; search input tidak dibuat (tanpa backend di static build, kontrol tanpa fungsi melanggar R-26) | |
| 4 | Article grid | `.card-grid` `.card` (kicker kategori · tanggal, `.card__link` Read more) | Empty state |
| 5 | Pagination | `.pagination` | |
| 6 | Newsletter | **tidak dibuat** (Out of Scope) | |
| 7 | Footer + WhatsApp | global | |

**Article detail**

| # | Section | Komponen | Isi |
|---|---|---|---|
| 1 | Page hero | `.page-hero` (kicker kategori, judul, tanggal, waktu baca) | |
| 2 | Body | `.container` measure-md, `.prose` | Konten WordPress |
| 3 | Share / tags | `.chip` (tags) + link share (WhatsApp, Facebook, copy) | |
| 4 | Related articles | `.card-grid` 3 `.card` | |
| 5 | CTA band | `.cta__inner` | Book Now |
| 6 | Footer + WhatsApp | global | |

CSS: `pages/blog.css` (featured, list, article body + wide figure, tags/share, related, CTA). JS: `main.js` generic `[data-copy-link]` untuk tombol Copy link (hidden tanpa clipboard API).

---

### 2.9 Gallery — `gallery.html` (selesai)

Prefix ID: `gallery_page_`. PRD 5.5: gallery menampilkan media yang dipublish; empty → sembunyikan/empty state.
Content: Google Drive link CW (foto resmi), aset existing.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Gallery — Moments on the Hill" | |
| 2 | Filter | `.filter-bar`: All / Resort / Rooms / Villas / Dining / Spa / Pool / Weddings | Anchor `#resort`, `#suites`, `#villas`, `#dining`, `#spa`, `#pool`, `#lobby`, `#views` dari home | |
| 3 | Mosaic | `.gallery__grid` (`--wide`, `--tall` bergantian) | Semua foto published; `alt` dari media library | Empty state |
| 4 | Video (opsional) | `.chapter__media` dengan `<video poster>` + fallback gambar | Bila client sediakan | PRD 6: video gagal → fallback image |
| 5 | Lightbox | `.lightbox` (`<dialog>`) | Prev/next, caption, tutup dengan Esc | Progressive: tanpa JS, item link ke file gambar |
| 6 | Instagram CTA | `.cta__inner` | "Follow @sankarahillpenida" | Tanpa embed feed (Out of Scope integrasi) |
| 7 | Footer + WhatsApp | global | | |

CSS: `pages/gallery.css`. JS: filter chips via `[data-filter-group]` generik (`main.js`); `js/gallery.js` menambah pre-select chip dari hash (`data-filter-alias` memetakan `#lobby`/`#views` ke chip Resort, `#rooms` ke Suites) + lightbox. Catatan build: 11 foto aset existing, masing-masing sekali; chip Weddings tidak dibuat karena belum ada foto kapel (TODO(content)); section video tidak dirender karena client belum menyediakan video.

---

### 2.10 Testimonials — `testimonials.html` (selesai)

Prefix ID: `testimonials_page_`. PRD 5.5: testimonial dari input manual WordPress.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Guest Stories" | |
| 2 | Rating summary | `.info` 3 item (rating rata-rata, jumlah ulasan, sumber) | Manual input | assumption; sembunyikan bila kosong |
| 3 | Testimonial grid | `.card-grid` `.testimonial` (3 kolom, tanpa track) | Nama, tanggal, sumber, bintang, kutipan | Empty state |
| 4 | External reviews | `.card-grid` 3 `.card` tanpa media | Link TripAdvisor, Google, Booking.com | Link saja (Out of Scope integrasi otomatis) |
| 5 | CTA band | `.cta__inner` | Book Now | |
| 6 | Footer + WhatsApp | global | | |

CSS: `pages/testimonials.css`. JS: tidak ada. Catatan build: belum ada ulasan asli dari client, jadi grid `.testimonial` disembunyikan (markup placeholder berlabel untuk loop WordPress) dan empty state menjadi tampilan aktif dengan link ke TripAdvisor; rating summary `.info` `hidden` dengan nilai `[REAL DATA]` sampai diisi manual. External reviews hanya TripAdvisor + Google Maps (Booking.com menunggu URL resmi, TODO(config)).

---

### 2.11 FAQ — `faq.html` (selesai)

Prefix ID: `faq_page_`. PRD 5.5: FAQ dalam format mudah dibaca; empty → sembunyikan/empty state.
Content: 5 FAQ existing di `main.js` (pindahkan ke markup statis / WordPress CPT).

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Frequently Asked Questions" | |
| 2 | Filter | `.faq__filters` chips kategori | Nusa Penida / Resort / Booking / Activities / Dining / Spa | |
| 3 | Accordion per kategori | `.section-head` kecil + `.faq__list` `.accordion__item` | Markup statis, bukan innerHTML, agar SEO & Polylang | JSON-LD `FAQPage` tetap dibuat |
| 4 | Concierge aside | `.reviews` (sticky ≥1024px) | WhatsApp + Send an Inquiry | |
| 5 | CTA band | `.cta__inner` | Book Now | |
| 6 | Footer + WhatsApp | global | | |

CSS: `pages/faq.css` (layout 7/4 + sticky aside). JS: `[data-accordion]` + `[data-filter-group]` generik dari `main.js`; deep link `#faq_page_faq_item_<slug>` membuka pertanyaannya. Catatan build: 11 pertanyaan dalam 6 topik (5 dari `main.js` + 6 turunan data Deck/CW: jarak, pets, aksesibilitas, Wi-Fi, jam dining, jam spa); jawaban booking diarahkan ke booking engine (STAAH), bukan Booking.com; JSON-LD `FAQPage` statis di head dan `main.js` tidak lagi menyuntik schema di halaman tanpa `[data-faq-list]`.

---

### 2.12 Contact Us — `contact.html`

Prefix ID: `contact_page_`. PRD 5.6 (inquiry form), 5.7 (alamat, WhatsApp, Maps), 7.2 flow, 6 edge cases SMTP.
Content: CW Footer (phone, email, alamat, sosial), Deck Location & Distances.

| # | Section | Komponen | Isi | Catatan |
|---|---|---|---|---|
| 1 | Page hero | `.page-hero` | "Contact Us" | |
| 2 | Contact details | `.locate__body` (alamat, telepon `tel:`, WhatsApp `wa.me`, email `mailto:`, jam front desk 24h) + sosial `.footer__socials` versi light | | |
| 3 | Inquiry form `#inquiry` | `.form` dalam `.room__panel`-style card | Field wajib: Full name, Email, Phone/WhatsApp, Subject (select: Reservation / Event & Wedding / Dining / Spa / Other), Message; opsional: Check-in, Check-out, Guests; consent checkbox; honeypot tersembunyi; nonce (WordPress) | Validasi browser (`required`, `type=email`, pattern) + server; `.form__error` per field; `.form__status--success` / `--error` `role=status`; tombol `aria-busy` saat mengirim; cegah double submit (disable tombol) |
| 4 | Google Maps `#map` | `.locate__map` iframe + fallback | Embed URL client | PRD 6: gagal → alamat + link |
| 5 | Directions `#directions` | Tabel jarak Deck (`.hours`) + langkah transfer (Sanur → Sampalan/Toyapakeh fast boat, pickup) | Dari FAQ existing | |
| 6 | Island map | `.map` (reuse home) | | Opsional |
| 7 | CTA band | `.cta__inner` | "Ready to book?" → STAAH | |
| 8 | Footer + WhatsApp | global | | |

CSS: `pages/contact.css`. JS: `js/contact.js` — validasi client-side, state loading/success/error, submit via `fetch` ke endpoint WordPress (`admin-post.php` / REST) dengan nonce; SMTP credential hanya di server (PRD 5.6).

---

### 2.13 404 — `404.html` (selesai)

Prefix ID: `error_page_`. PRD 6: halaman 404 dengan navigasi kembali.

| # | Section | Komponen | Isi |
|---|---|---|---|
| 1 | Page hero (pendek) | `.page-hero` | Kicker "404", judul "This path leads off the hill" |
| 2 | Notice | `.notice--info` + `.hero__actions` | Tombol Home (primary), Contact (outline), WhatsApp |
| 3 | Quick links | `.card-grid` 3 `.card` tanpa media | Accommodation, Offers, Experiences |
| 4 | Footer + WhatsApp | global | |

CSS: `pages/error.css`. JS: tidak ada.

---

### 2.14 Mirror Bahasa Indonesia — `id/*.html`

Bukan halaman baru; salinan setiap halaman dengan `lang="id"`, `hreflang` dibalik, `.lang__link` aktif ID, dan copy terjemahan dari client (PRD: tanpa automatic translation). Pada WordPress digantikan Polylang; pada static build cukup `id/home.html` sebagai bukti pola.

---

## 3. Pemetaan WordPress (untuk tahap theme)

| Halaman static | Template | Sumber data |
|---|---|---|
| home.html | `front-page.php` | Options + CPT room/offer/experience/testimonial/faq + gallery |
| about.html | `page-about.php` | Page + ACF/blocks |
| accommodation.html | `archive-room.php` / `single-room.php` | CPT `room` |
| dining.html, spa.html | `page-dining.php`, `page-spa.php` | Page + menu PDF media |
| experiences.html | `archive-experience.php` / `single-experience.php` | CPT `experience` |
| offers.html | `archive-offer.php` / `single-offer.php` | CPT `offer` (periode, status) |
| blog.html, article.html | `home.php` / `single.php` | Post |
| gallery.html | `page-gallery.php` | Media taxonomy |
| testimonials.html | `page-testimonials.php` | CPT `testimonial` |
| faq.html | `page-faq.php` | CPT `faq` |
| contact.html | `page-contact.php` | Options (alamat, WA, email, Maps) + form handler |
| 404.html | `404.php` | — |

Global options (PRD 7.4): STAAH URL, WhatsApp number, email penerima, SMTP, Google Maps embed/link, sosial. Bila STAAH URL kosong → semua `[data-booking-cta]` disembunyikan; bila WhatsApp kosong → float disembunyikan.

---

## 4. Checklist lintas halaman

- [ ] Header/footer identik di semua halaman; `aria-current="page"` benar.
- [ ] Language switcher tampil di header (≥640px), mobile menu, dan footer.
- [ ] Semua Book Now → STAAH, `target="_blank" rel="noopener noreferrer"`, `data-booking-cta`.
- [ ] WhatsApp float ada di setiap halaman, tidak menutup kontrol footer di 375px.
- [ ] Setiap list CMS punya `.empty-state` dan komentar kondisi tampil.
- [ ] Gambar: `alt`, `width/height`, `loading="lazy"` (kecuali hero).
- [ ] Heading: satu `h1` per halaman.
- [ ] ID unik, format `<page>_<element>_<component>`, tanpa index.
- [ ] `components.html` diperbarui untuk setiap komponen baru di §1.
- [ ] Reduced-motion rule untuk setiap transisi baru.
- [ ] `<title>` dan `meta description` unik per halaman; `hreflang` en/id/x-default.
- [ ] Tidak ada horizontal scroll di 375, 768, 1024, 1440, 1920, 2560.
