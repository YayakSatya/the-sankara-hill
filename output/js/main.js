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
    if (guestMenu) guestMenu.hidden = !open;
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

  const rooms = [
    { name: 'One-Bedroom Ocean View Villa with Private Pool', description: 'A private tropical sanctuary designed for couples. Featuring a generous outdoor terrace, an infinity plunge pool seamlessly merging with the horizon, and hand-carved details.', size: '110 sqm', views: 'Panoramic Ocean & Mount Agung View', capacity: '2 Adults + 1 Child', beds: '1 King Bed', price: '$195 / night', image: 'images/one-bedroom-ocean-view.jpg', tags: ['Best Seller', 'Romantic', 'Ocean View'], details: ['Private infinity plunge pool looking out to the Indian Ocean', 'Semi-open tropical bathroom with standalone stone soaking tub', 'Expansive wooden sun deck with luxury daybeds', 'Authentic hand-woven Balinese ikat textiles and teak finishes'] },
    { name: 'Sankara Deluxe Hill View Suite', description: 'Elegantly appointed suites tucked into the lush hillside flora. Offers a serene indoor-outdoor flow with a private terrace and customized Balinese craftsmanship.', size: '80 sqm', views: 'Lush Hillside & Tropical Forest View', capacity: '2 Adults', beds: '1 King Bed', price: '$140 / night', image: 'images/sankara-deluxe-hill.jpg', tags: ['Serene', 'Lush Canopy', 'Modern Comfort'], details: ['Private sun-drenched wooden balcony with forest canopy view', 'Luxurious marble bathroom with rain shower', 'Cozy reading lounge featuring hand-woven details', "Full access to the resort's main cliffside infinity pool"] },
    { name: 'Two-Bedroom Family Pool Villa', description: 'The ultimate island retreat for families or groups. Features two independent master suites, a massive shared living pavilion, and a spectacular private infinity pool.', size: '220 sqm', views: 'Unobstructed Panoramic Ocean View', capacity: '4 Adults + 2 Children', beds: '2 King Beds (or Twin Bed Setup)', price: '$340 / night', image: 'images/two-bedrooom-family-pool.jpg', tags: ['Luxury', 'Family Friendly', 'Exclusive'], details: ['12-meter private oceanfront infinity pool', 'Spacious semi-open living and dining lounge pavilion', 'Dedicated 24/7 personal butler service', 'Master en-suite bathrooms with premium organic spa products'] }
  ];
  const roomDisplay = $('[data-room-display]');
  let selectedRoom = 0;
  let showAllDetails = false;
  const renderRoom = () => {
    const room = rooms[selectedRoom];
    if (!roomDisplay) return;
    roomDisplay.setAttribute('aria-labelledby', `home_page_room_tab_${selectedRoom === 0 ? 'ocean_villa' : selectedRoom === 1 ? 'hill_suite' : 'family_villa'}`);
    roomDisplay.innerHTML = `<div class="c-room__gallery"><div class="c-room__frame"><img id="home_page_room_image" src="${room.image}" alt="${room.name}"><div class="c-room__price"><span class="c-room__price-label">From</span><span class="c-room__price-value">${room.price}</span></div><div class="c-room__tags">${room.tags.map((tag) => `<span class="c-tag">${tag}</span>`).join('')}</div></div></div><div class="c-room__panel"><div><h3 class="c-room__name">${room.name}</h3><p class="c-room__desc">${room.description}</p><div class="c-room__specs"><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-ruler"></use></svg></span><span><span class="c-spec__label">Size</span><span class="c-spec__value">${room.size}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-eye"></use></svg></span><span><span class="c-spec__label">Views</span><span class="c-spec__value">${room.views}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-users"></use></svg></span><span><span class="c-spec__label">Capacity</span><span class="c-spec__value">${room.capacity}</span></span></div><div class="c-spec"><span class="c-spec__icon"><svg aria-hidden="true"><use href="#i-bed-double"></use></svg></span><span><span class="c-spec__label">Bedding</span><span class="c-spec__value">${room.beds}</span></span></div></div><span class="c-room__details-label">Exclusive Details</span><ul class="c-room__details">${room.details.map((detail, index) => `<li class="c-room__detail${index > 2 ? ' is-extra' : ''}"${index > 2 && !showAllDetails ? ' hidden' : ''}>${detail}</li>`).join('')}</ul>${room.details.length > 3 ? `<button class="c-room__more" id="home_page_room_details_button" type="button" data-room-more>${showAllDetails ? 'Show Less' : `View All (${room.details.length - 3} More Details)`}</button>` : ''}</div><div class="c-room__actions"><a class="c-button c-button--primary" id="home_page_room_booking_button" href="https://www.booking.com/hotel/id/the-sankara-hill-penida.html?selected_room=${encodeURIComponent(room.name)}" target="_blank" rel="noopener noreferrer">Book Securely <svg aria-hidden="true"><use href="#i-arrow-up-right"></use></svg></a><a class="c-button c-button--outline" id="home_page_room_inquiry_button" href="https://wa.me/6281234567890?text=${encodeURIComponent(`Hello! I am interested in inquiring about a stay in the ${room.name} at The Sankara Hill Penida.`)}" target="_blank" rel="noopener noreferrer">Direct Inquiry</a></div></div>`;
    $('[data-room-more]', roomDisplay)?.addEventListener('click', () => { showAllDetails = !showAllDetails; renderRoom(); });
  };
  $$('[data-room-tab]').forEach((tab) => tab.addEventListener('click', () => {
    selectedRoom = Number(tab.dataset.roomTab);
    showAllDetails = false;
    $$('[data-room-tab]').forEach((item) => { const active = item === tab; item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active)); });
    renderRoom();
  }));
  renderRoom();

  const amenitiesTrack = $('[data-amenities-track]');
  $('[data-scroll-left]')?.addEventListener('click', () => amenitiesTrack?.scrollBy({ left: -360, behavior: 'smooth' }));
  $('[data-scroll-right]')?.addEventListener('click', () => amenitiesTrack?.scrollBy({ left: 360, behavior: 'smooth' }));

  const faqs = [
    ['Nusa Penida', "How do we get to The Sankara Hill Penida from Bali's mainland?", 'Nusa Penida is easily accessible via a 30-to-40 minute fast boat ride from Sanur Harbor in East Denpasar to either Toyapakeh or Sampalan Harbor in Nusa Penida. We provide a seamless transfer service, including private car pickups from Bali’s airport or your hotel, fast boat ticketing, and harbor luggage handling directly to our resort check-in desk.'],
    ['Resort', 'What is the check-in and check-out time?', 'Our standard check-in time is 2:00 PM (WIT) and check-out is at 12:00 PM (WIT). Early check-in or late check-out can be requested in advance and is subject to villa availability.'],
    ['Booking', 'Do you offer direct booking and secure payments?', "Yes, you can secure your booking through our official Booking.com page for guaranteed secure payments and immediate confirmation. For custom packages, honeymoon requests, or group retreats, speak directly with our reservation team on WhatsApp."],
    ['Activities', 'Can the resort arrange day trips to Kelingking Beach and Diamond Beach?', "Absolutely. We offer curated half-day and full-day private tours with a professional driver-guide to Kelingking Beach, Angel's Billabong, Broken Beach, Diamond Beach, Atuh Beach, and Thousand Islands viewpoint."],
    ['Activities', 'Are snorkeling or diving with Manta Rays available?', 'Yes. We can arrange private or shared snorkeling and scuba diving excursions to Manta Point, Crystal Bay, and Gamat Bay.']
  ];
  const faqList = $('[data-faq-list]');
  let faqFilter = 'All';
  let openFaq = -1;
  const renderFaqs = () => {
    if (!faqList) return;
    faqList.innerHTML = faqs.map((faq, index) => ({ faq, index })).filter(({ faq }) => faqFilter === 'All' || faq[0] === faqFilter).map(({ faq, index }) => `<article class="c-accordion__item" id="home_page_faq_item_${index}"><button class="c-accordion__trigger" type="button" aria-expanded="${openFaq === index}" id="home_page_faq_question_${faq[0].toLowerCase().replace(/\s+/g, '_')}_${index}" aria-controls="home_page_faq_answer_${index}" data-faq-index="${index}"><span class="c-accordion__question">${faq[1]}</span><span class="c-accordion__indicator" aria-hidden="true"><svg><use href="#i-${openFaq === index ? 'minus' : 'plus'}"></use></svg></span></button><div class="c-accordion__panel${openFaq === index ? ' is-open' : ''}" id="home_page_faq_answer_${index}" aria-labelledby="home_page_faq_question_${faq[0].toLowerCase().replace(/\s+/g, '_')}_${index}"${openFaq === index ? '' : ' hidden'}><div class="c-accordion__panel-inner"><p class="c-accordion__answer">${faq[2]}</p></div></div></article>`).join('');
    $$('[data-faq-index]', faqList).forEach((button) => button.addEventListener('click', () => { const index = Number(button.dataset.faqIndex); openFaq = openFaq === index ? -1 : index; renderFaqs(); }));
  };
  $$('[data-faq-filter]').forEach((button) => button.addEventListener('click', () => { faqFilter = button.dataset.faqFilter || 'All'; openFaq = -1; $$('[data-faq-filter]').forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); }); renderFaqs(); }));
  renderFaqs();

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq[1], acceptedAnswer: { '@type': 'Answer', text: faq[2] } })) };
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify(faqSchema);
  document.head.appendChild(schema);
})();
