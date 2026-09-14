(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const header = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.mobile-menu__link, .mobile-menu .button').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });

  const guestToggle = $('[data-guest-toggle]');
  const guestMenu = $('[data-guest-menu]');
  const guestValue = $('[data-guest-value]');
  const setGuestMenu = (open) => {
    guestToggle?.setAttribute('aria-expanded', String(open));
    guestMenu?.classList.toggle('is-open', open);
  };
  guestToggle?.addEventListener('click', () => setGuestMenu(guestToggle.getAttribute('aria-expanded') !== 'true'));
  $$('[data-guest-option]').forEach((option) => option.addEventListener('click', () => {
    if (guestValue) guestValue.textContent = option.dataset.guestOption || '';
    $$('[data-guest-option]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    setGuestMenu(false);
  }));
  document.addEventListener('click', (event) => {
    if (guestMenu && !guestMenu.parentElement?.contains(event.target)) setGuestMenu(false);
  });

  // Phase 2: every booking action is a redirect to the STAAH URL configured on
  // <body data-booking-url>. Empty value hides the CTAs (PRD edge case: STAAH URL kosong).
  // Phase 1 pages have no attribute and keep their Booking.com fallback.
  const bookingUrl = document.body.dataset.bookingUrl;
  if (bookingUrl === '') $$('[data-booking-cta], .booking').forEach((cta) => { cta.hidden = true; });

  // WhatsApp number lives on <body data-whatsapp>; empty value hides the float
  // (PRD 7.4 global options). Pages without the attribute keep the float.
  if (document.body.dataset.whatsapp === '') $$('.whatsapp-float').forEach((float) => { float.hidden = true; });

  // Active nav link from <body data-page="about">: matches the link's file
  // name (about.html, id/about.html) so header, mobile menu and footer agree.
  const page = document.body.dataset.page;
  if (page) {
    $$('.header__link, .mobile-menu__link').forEach((link) => {
      const file = (link.getAttribute('href') || '').split(/[?#]/)[0].split('/').pop().replace(/\.html$/, '');
      const active = file === page || (page === 'home' && (file === '' || file === 'index'));
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  const bookingForm = $('[data-booking-form]');
  const bookingNote = $('[data-booking-note]');
  const checkInEl = $('#home_page_check_in_input');
  const checkOutEl = $('#home_page_check_out_input');
  const today = new Date().toISOString().slice(0, 10);
  if (checkInEl) checkInEl.min = today;
  if (checkOutEl) checkOutEl.min = today;
  checkInEl?.addEventListener('change', () => {
    if (!checkOutEl) return;
    checkOutEl.min = checkInEl.value || today;
    if (checkOutEl.value && checkOutEl.value < checkOutEl.min) checkOutEl.value = '';
  });
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const checkIn = $('#home_page_check_in_input')?.value;
    const checkOut = $('#home_page_check_out_input')?.value;
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      if (bookingNote) {
        bookingNote.hidden = false;
        bookingNote.classList.add('is-error');
        bookingNote.textContent = 'Please choose a valid check-out date after check-in.';
      }
      return;
    }
    if (bookingNote) {
      bookingNote.hidden = false;
      bookingNote.classList.remove('is-error');
      bookingNote.textContent = 'Dates noted. Opening secure availability search…';
    }
    // TODO(config): confirm STAAH query parameter names for dates/guests with the client's booking engine.
    const url = new URL(bookingUrl || 'https://www.booking.com/hotel/id/the-sankara-hill-penida.html');
    url.searchParams.set('checkin', checkIn);
    url.searchParams.set('checkout', checkOut);
    if (bookingUrl && guestValue) url.searchParams.set('guests', guestValue.textContent.trim());
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  });

  // assumption: image files reused from existing asset set (no dedicated photo per room type; "Photo Link: [link]" still pending in the content doc); capacity not stated in source, defaulted to 2 Adults. Unit counts for villas (4 + 21 = 25) come from the presentation deck, not the content doc.
  const rooms = [
    { name: 'Ocean Hill Suite', description: 'Spanning 41 sqm, thoughtfully designed to embrace the surrounding seascape, this room features elegant interiors, a comfortable queen-size or twin-size bed, and a private balcony overlooking the ocean. Perfect for couples or travelers seeking a peaceful island retreat.', size: '41 sqm · 16 Rooms', views: 'Ocean View', capacity: '2 Adults', beds: 'Queen or Twin Beds', image: 'images/one-bedroom-ocean-view.jpg', tags: ['16 Rooms', 'Ocean View'], details: ['Double / Twin-size Bed', 'Premium Mattress & Linen', 'Balcony with View', 'Writing Desk', 'Smart TV', 'Air Conditioning', 'Wardrobe', 'Safety Deposit Box', 'Mini Refrigerator', 'Coffee Table', 'Full-Length Mirror', 'High-Speed Wi-Fi', 'Telephone', 'USB Charging Port', 'Luggage Rack', 'Bedside Reading Lamp', 'Bluetooth Speakers'] },
    { name: 'Garden View Pool Villa', description: "Set within Nusa Penida's tranquil hillside landscape, this private villa spans approximately 47 sqm, featuring a spacious bedroom, living area, and private pool overlooking rolling hills — offering a peaceful sanctuary for guests seeking relaxation.", size: '47 sqm · 4 Villas', views: 'Garden & Hill View', capacity: '2 Adults', beds: 'King-size Bed', image: 'images/villa-room.jpg', tags: ['4 Villas', 'Private Pool'], details: ['King-size Bed', 'Premium Mattress & Linen', 'Private Terrace Deck', 'Plunge Pool', 'Outdoor Sundeck', 'Writing Desk', 'Smart TV', 'Air Conditioning', 'Wardrobe', 'Safety Deposit Box', 'Mini Refrigerator', 'Coffee Table', 'Full-Length Mirror', 'High-Speed Wi-Fi', 'Telephone', 'USB Charging Port', 'Luggage Rack', 'Bedside Reading Lamp', 'Bluetooth Speakers'] },
    { name: 'Ocean View Pool Villa', description: 'Perched to capture breathtaking ocean views, this 51 sqm villa offers a refined island sanctuary with a private pool, spacious living area, and contemporary tropical design. Ideal for honeymooners or guests seeking an elevated and tranquil island escape.', size: '51 sqm · 21 Villas', views: 'Ocean View', capacity: '2 Adults', beds: 'King-size Bed', image: 'images/two-bedrooom-family-pool.jpg', tags: ['21 Villas', 'Private Pool'], details: ['King-size Bed', 'Premium Mattress & Linen', 'Private Terrace Deck', 'Plunge Pool', 'Outdoor Sundeck', 'Writing Desk', 'Smart TV', 'Air Conditioning', 'Wardrobe', 'Safety Deposit Box', 'Mini Refrigerator', 'Coffee Table', 'Full-Length Mirror', 'High-Speed Wi-Fi', 'Telephone', 'USB Charging Port', 'Luggage Rack', 'Bedside Reading Lamp', 'Bluetooth Speakers'] }
  ];
  const roomTabIds = ['ocean_hill_suite', 'garden_view_pool_villa', 'ocean_view_pool_villa'];
  const roomDisplay = $('[data-room-display]');
  let selectedRoom = 0;
  let showAllDetails = false;
  const renderRoom = () => {
    const room = rooms[selectedRoom];
    if (!roomDisplay) return;
    roomDisplay.setAttribute('aria-labelledby', `home_page_room_tab_${roomTabIds[selectedRoom]}`);
    roomDisplay.innerHTML = `<div class="room__gallery"><div class="room__frame"><img id="home_page_room_image" src="${room.image}" alt="${room.name}" loading="lazy" decoding="async" width="1600" height="1142"><div class="room__tags">${room.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div></div></div><div class="room__panel"><div><h3 class="room__name">${room.name}</h3><p class="room__desc">${room.description}</p><div class="room__specs"><div class="spec"><span class="spec__icon"><svg aria-hidden="true"><use href="#i-ruler"></use></svg></span><span><span class="spec__label">Size</span><span class="spec__value">${room.size}</span></span></div><div class="spec"><span class="spec__icon"><svg aria-hidden="true"><use href="#i-eye"></use></svg></span><span><span class="spec__label">Views</span><span class="spec__value">${room.views}</span></span></div><div class="spec"><span class="spec__icon"><svg aria-hidden="true"><use href="#i-users"></use></svg></span><span><span class="spec__label">Capacity</span><span class="spec__value">${room.capacity}</span></span></div><div class="spec"><span class="spec__icon"><svg aria-hidden="true"><use href="#i-bed-double"></use></svg></span><span><span class="spec__label">Bedding</span><span class="spec__value">${room.beds}</span></span></div></div><span class="room__details-label">Exclusive Details</span><ul class="room__details">${room.details.map((detail, index) => `<li class="room__detail${index > 2 ? ' is-extra' : ''}"${index > 2 && !showAllDetails ? ' hidden' : ''}>${detail}</li>`).join('')}</ul>${room.details.length > 3 ? `<button class="room__more" id="home_page_room_details_button" type="button" data-room-more>${showAllDetails ? 'Show Less' : `View All (${room.details.length - 3} More Details)`}</button>` : ''}</div><div class="room__actions">${bookingUrl === '' ? '' : `<a class="button button--primary" id="home_page_room_booking_button" href="${bookingUrl || `https://www.booking.com/hotel/id/the-sankara-hill-penida.html?selected_room=${encodeURIComponent(room.name)}`}" target="_blank" rel="noopener noreferrer" data-booking-cta>${bookingUrl ? 'Book Now' : 'Book Securely'} <svg aria-hidden="true"><use href="#i-arrow-up-right"></use></svg></a>`}</div></div>`;
    $('[data-room-more]', roomDisplay)?.addEventListener('click', () => { showAllDetails = !showAllDetails; renderRoom(); });
  };
  $$('[data-room-tab]').forEach((tab) => tab.addEventListener('click', () => {
    selectedRoom = Number(tab.dataset.roomTab);
    showAllDetails = false;
    $$('[data-room-tab]').forEach((item) => { const active = item === tab; item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active)); });
    renderRoom();
  }));
  renderRoom();

  // Reveal-on-scroll: one-shot entrance for [data-reveal] blocks below the hero.
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

  // Horizontal scroll-snap slider: arrows step one card, disable at the ends.
  // Shared by the home amenities track and every [data-slider] on inner pages.
  const initSlider = (track, prev, next, cardSelector) => {
    if (!track) return;
    const step = () => {
      const card = cardSelector ? $(cardSelector, track) : track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : 360;
    };
    const updateArrows = () => {
      const maxLeft = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= maxLeft - 1;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    updateArrows();
  };
  initSlider($('[data-amenities-track]'), $('[data-scroll-left]'), $('[data-scroll-right]'), '.amenity');
  $$('[data-slider]').forEach((slider) => initSlider($('[data-slider-track]', slider), $('[data-slider-prev]', slider), $('[data-slider-next]', slider)));

  // Generic chip filter: [data-filter-group] holds [data-filter="<cat>"] chips
  // and controls the list named by aria-controls / data-filter-target. Items
  // carry data-category (space-separated); "all" shows everything. Items stay
  // in the DOM (SEO, Polylang) and are toggled with `hidden`. The FAQ block on
  // home keeps its own render path (data-faq-filter) and is not affected.
  $$('[data-filter-group]').forEach((group) => {
    const targetId = group.dataset.filterTarget || group.getAttribute('aria-controls');
    const list = targetId ? document.getElementById(targetId) : null;
    if (!list) return;
    const items = $$('[data-filter-item]', list);
    const empty = list.parentElement ? $('.empty-state[data-filter-empty]', list.parentElement) : null;
    const apply = (value) => {
      let shown = 0;
      items.forEach((item) => {
        const categories = (item.dataset.category || '').split(/\s+/);
        const visible = value === 'all' || categories.includes(value);
        item.hidden = !visible;
        if (visible) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    };
    $$('[data-filter]', group).forEach((chip) => chip.addEventListener('click', () => {
      $$('[data-filter]', group).forEach((item) => { const active = item === chip; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      apply(chip.dataset.filter || 'all');
    }));
    const initial = $('[data-filter].is-active', group);
    if (initial && initial.dataset.filter !== 'all') apply(initial.dataset.filter);
  });

  // "View all" toggle for static amenity lists ([data-details-toggle] with
  // aria-controls -> list whose .is-extra items start hidden). The home room
  // panel keeps its own [data-room-more] because it re-renders.
  $$('[data-details-toggle]').forEach((button) => {
    const list = document.getElementById(button.getAttribute('aria-controls') || '');
    if (!list) return;
    const extras = $$('.is-extra', list);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      extras.forEach((item) => { item.hidden = open; });
      button.setAttribute('aria-expanded', String(!open));
      button.textContent = open ? (button.dataset.labelMore || 'View All') : (button.dataset.labelLess || 'Show Less');
    });
  });

  // .form: validation styling only after the first submit attempt (see
  // components.css `.form.is-submitted`). Page scripts (contact.js) own the
  // fetch/submit itself.
  $$('form.form').forEach((form) => {
    form.addEventListener('submit', () => form.classList.add('is-submitted'));
    form.addEventListener('invalid', () => form.classList.add('is-submitted'), true);
  });

  const faqs = [
    ['Nusa Penida', "How do we get to The Sankara Hill Penida from Bali's mainland?", 'Nusa Penida is easily accessible via a 30-to-40 minute fast boat ride from Sanur Harbor in East Denpasar to either Toyapakeh or Sampalan Harbor in Nusa Penida. We provide a seamless transfer service, including private car pickups from Bali’s airport or your hotel, fast boat ticketing, and harbor luggage handling directly to our resort check-in desk.'],
    ['Resort', 'What is the check-in and check-out time?', 'Our standard check-in time is 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out can be requested in advance and is subject to availability.'],
    ['Booking', 'Do you offer direct booking and secure payments?', "Yes, you can secure your booking through our official Booking.com page for guaranteed secure payments and immediate confirmation. For custom packages, honeymoon requests, or group retreats, speak directly with our reservation team on WhatsApp."],
    ['Activities', 'Can the resort arrange day trips to Kelingking Beach and Diamond Beach?', "Absolutely. We offer curated half-day and full-day private tours with a professional driver-guide to Kelingking Beach, Angel's Billabong, Broken Beach, Diamond Beach, Atuh Beach, and Thousand Islands viewpoint."],
    ['Activities', 'Are snorkeling or diving with Manta Rays available?', 'Yes. We can arrange private or shared snorkeling and scuba diving excursions to Manta Point, Crystal Bay, and Gamat Bay.']
  ];
  const faqList = $('[data-faq-list]');
  let faqFilter = 'All';
  let openFaq = -1;
  // Toggle in place so the panel's height transition can actually run;
  // re-rendering the list would recreate the node already open.
  const setFaqOpen = (item, open) => {
    const trigger = $('.accordion__trigger', item);
    const panel = $('.accordion__panel', item);
    trigger?.setAttribute('aria-expanded', String(open));
    panel?.classList.toggle('is-open', open);
  };
  const faqSlug = (question) => question.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 6).join('_');
  const renderFaqs = () => {
    if (!faqList) return;
    faqList.innerHTML = faqs.map((faq, index) => ({ faq, index })).filter(({ faq }) => faqFilter === 'All' || faq[0] === faqFilter).map(({ faq, index }) => { const slug = faqSlug(faq[1]); return `<article class="accordion__item" id="home_page_faq_item_${slug}"><button class="accordion__trigger" type="button" aria-expanded="${openFaq === index}" id="home_page_faq_question_${slug}" aria-controls="home_page_faq_answer_${slug}" data-faq-index="${index}"><span class="accordion__question">${faq[1]}</span><span class="accordion__indicator" aria-hidden="true"><svg><use href="#i-plus"></use></svg></span></button><div class="accordion__panel${openFaq === index ? ' is-open' : ''}" id="home_page_faq_answer_${slug}" aria-labelledby="home_page_faq_question_${slug}"><div class="accordion__panel-inner"><p class="accordion__answer">${faq[2]}</p></div></div></article>`; }).join('');
    $$('[data-faq-index]', faqList).forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.faqIndex);
      const item = button.closest('.accordion__item');
      const wasOpen = openFaq === index;
      $$('.accordion__item', faqList).forEach((other) => setFaqOpen(other, false));
      openFaq = wasOpen ? -1 : index;
      if (!wasOpen && item) setFaqOpen(item, true);
    }));
  };
  $$('[data-faq-filter]').forEach((button) => button.addEventListener('click', () => { faqFilter = button.dataset.faqFilter || 'All'; openFaq = -1; $$('[data-faq-filter]').forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); }); renderFaqs(); }));
  renderFaqs();

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq[1], acceptedAnswer: { '@type': 'Answer', text: faq[2] } })) };
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify(faqSchema);
  document.head.appendChild(schema);
})();
