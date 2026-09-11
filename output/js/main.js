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
  $$('.c-mobile-menu__link, .c-mobile-menu .c-button').forEach((link) => link.addEventListener('click', () => setMenu(false)));
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

  const bookingForm = $('[data-booking-form]');
  const bookingNote = $('[data-booking-note]');
  const checkInEl = $('#check-in');
  const checkOutEl = $('#check-out');
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
    const checkIn = $('#check-in')?.value;
    const checkOut = $('#check-out')?.value;
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
    const url = new URL('https://www.booking.com/hotel/id/the-sankara-hill-penida.html');
    url.searchParams.set('checkin', checkIn);
    url.searchParams.set('checkout', checkOut);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  });

  // assumption: image files reused from existing asset set (no dedicated photo per room type); capacity not stated in source, defaulted to 2 Adults
  const rooms = [
    { name: 'Ocean Hill Suite', description: 'Spanning 41 sqm, thoughtfully designed to embrace the surrounding seascape, this room features elegant interiors, a comfortable king-size bed, and a private balcony overlooking the ocean. Perfect for couples or travelers seeking a peaceful island retreat.', size: '41 sqm · 16 Rooms', views: 'Ocean View', capacity: '2 Adults', beds: 'King-size Bed', image: 'images/one-bedroom-ocean-view.jpg', tags: ['16 Rooms', 'Ocean View'], details: ['Double / Twin-size Bed', 'Premium Mattress & Linen', 'Balcony with View', 'Writing Desk', 'Smart TV', 'Air Conditioning', 'Wardrobe', 'Safety Deposit Box', 'Mini Refrigerator', 'Coffee Table', 'Full-Length Mirror', 'High-Speed Wi-Fi', 'Telephone', 'USB Charging Port', 'Luggage Rack', 'Bedside Reading Lamp', 'Bluetooth Speakers'] },
    { name: 'Garden Hill Pool Villa', description: "Set within Nusa Penida's tranquil hillside landscape, this private villa spans approximately 47 sqm, featuring a spacious bedroom, living area, and private pool overlooking rolling hills — offering a peaceful sanctuary for guests seeking relaxation.", size: '47 sqm · 4 Units', views: 'Rolling Hills View', capacity: '2 Adults', beds: 'King-size Bed', image: 'images/villa-room.jpg', tags: ['4 Units', 'Private Pool'], details: ['Private Pool', 'Bedroom', 'Living Area', 'Hillside View'] },
    { name: 'Ocean Hill Pool Villa', description: 'Perched to capture breathtaking ocean views, this 51 sqm villa offers a refined island sanctuary with a private pool, spacious living area, and contemporary tropical design. Ideal for honeymooners or guests seeking an elevated and tranquil island escape.', size: '51 sqm · 21 Units', views: 'Ocean View', capacity: '2 Adults', beds: 'King-size Bed', image: 'images/two-bedrooom-family-pool.jpg', tags: ['21 Units', 'Private Pool'], details: ['King-size Bed', 'Premium Mattress & Linen', 'Private Terrace Deck', 'Plunge Pool', 'Outdoor Sundeck', 'Writing Desk', 'Smart TV', 'Air Conditioning', 'Wardrobe', 'Safety Deposit Box', 'Mini Refrigerator', 'Coffee Table', 'Full-Length Mirror', 'High-Speed Wi-Fi', 'Telephone', 'USB Charging Port', 'Luggage Rack', 'Bedside Reading Lamp', 'Bluetooth Speakers'] }
  ];
  const roomDisplay = $('[data-room-display]');
  let selectedRoom = 0;
  let showAllDetails = false;
  const renderRoom = () => {
    const room = rooms[selectedRoom];
    if (!roomDisplay) return;
    roomDisplay.setAttribute('aria-labelledby', `home_page_room_tab_${selectedRoom === 0 ? 'ocean_villa' : selectedRoom === 1 ? 'hill_suite' : 'family_villa'}`);
    roomDisplay.innerHTML = `<div class="c-room__gallery"><div class="c-room__frame"><img id="home_page_room_image" src="${room.image}" alt="${room.name}" loading="lazy" decoding="async" width="1600" height="1142"><div class="c-room__tags">${room.tags.map((tag) => `<span class="c-tag">${tag}</span>`).join('')}</div></div></div><div class="c-room__panel"><div><h3 class="c-room__name">${room.name}</h3><p class="c-room__desc">${room.description}</p><div class="c-room__specs"><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-ruler"></use></svg></span><span><span class="c-spec__label">Size</span><span class="c-spec__value">${room.size}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-eye"></use></svg></span><span><span class="c-spec__label">Views</span><span class="c-spec__value">${room.views}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-users"></use></svg></span><span><span class="c-spec__label">Capacity</span><span class="c-spec__value">${room.capacity}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-bed-double"></use></svg></span><span><span class="c-spec__label">Bedding</span><span class="c-spec__value">${room.beds}</span></span></div></div><span class="c-room__details-label">Exclusive Details</span><ul class="c-room__details">${room.details.map((detail, index) => `<li class="c-room__detail${index > 2 ? ' is-extra' : ''}"${index > 2 && !showAllDetails ? ' hidden' : ''}>${detail}</li>`).join('')}</ul>${room.details.length > 3 ? `<button class="c-room__more" id="home_page_room_details_button" type="button" data-room-more>${showAllDetails ? 'Show Less' : `View All (${room.details.length - 3} More Details)`}</button>` : ''}</div><div class="c-room__actions"><a class="c-button c-button--primary" id="home_page_room_booking_button" href="https://www.booking.com/hotel/id/the-sankara-hill-penida.html?selected_room=${encodeURIComponent(room.name)}" target="_blank" rel="noopener noreferrer">Book Securely <svg aria-hidden="true"><use href="#i-arrow-up-right"></use></svg></a></div></div>`;
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

  const amenitiesTrack = $('[data-amenities-track]');
  const amenitiesLeft = $('[data-scroll-left]');
  const amenitiesRight = $('[data-scroll-right]');
  if (amenitiesTrack) {
    const step = () => {
      const card = $('.c-amenity', amenitiesTrack);
      const gap = parseFloat(getComputedStyle(amenitiesTrack).columnGap) || 0;
      return card ? card.offsetWidth + gap : 360;
    };
    const updateArrows = () => {
      const maxLeft = amenitiesTrack.scrollWidth - amenitiesTrack.clientWidth;
      if (amenitiesLeft) amenitiesLeft.disabled = amenitiesTrack.scrollLeft <= 1;
      if (amenitiesRight) amenitiesRight.disabled = amenitiesTrack.scrollLeft >= maxLeft - 1;
    };
    amenitiesLeft?.addEventListener('click', () => amenitiesTrack.scrollBy({ left: -step(), behavior: 'smooth' }));
    amenitiesRight?.addEventListener('click', () => amenitiesTrack.scrollBy({ left: step(), behavior: 'smooth' }));
    amenitiesTrack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    updateArrows();
  }

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
    const trigger = $('.c-accordion__trigger', item);
    const panel = $('.c-accordion__panel', item);
    trigger?.setAttribute('aria-expanded', String(open));
    panel?.classList.toggle('is-open', open);
  };
  const renderFaqs = () => {
    if (!faqList) return;
    faqList.innerHTML = faqs.map((faq, index) => ({ faq, index })).filter(({ faq }) => faqFilter === 'All' || faq[0] === faqFilter).map(({ faq, index }) => `<article class="c-accordion__item" id="home_page_faq_item_${index}"><button class="c-accordion__trigger" type="button" aria-expanded="${openFaq === index}" id="home_page_faq_question_${faq[0].toLowerCase().replace(/\s+/g, '_')}_${index}" aria-controls="home_page_faq_answer_${index}" data-faq-index="${index}"><span class="c-accordion__question">${faq[1]}</span><span class="c-accordion__indicator" aria-hidden="true"><svg><use href="#i-plus"></use></svg></span></button><div class="c-accordion__panel${openFaq === index ? ' is-open' : ''}" id="home_page_faq_answer_${index}" aria-labelledby="home_page_faq_question_${faq[0].toLowerCase().replace(/\s+/g, '_')}_${index}"><div class="c-accordion__panel-inner"><p class="c-accordion__answer">${faq[2]}</p></div></div></article>`).join('');
    $$('[data-faq-index]', faqList).forEach((button) => button.addEventListener('click', () => {
      const index = Number(button.dataset.faqIndex);
      const item = button.closest('.c-accordion__item');
      const wasOpen = openFaq === index;
      $$('.c-accordion__item', faqList).forEach((other) => setFaqOpen(other, false));
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
