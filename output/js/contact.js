// Contact page: inquiry form validation and submit (PRD 5.6, 7.2).
// Client-side checks mirror the server rules; the server is the authority.
// Sending goes through fetch to <form data-endpoint>; an empty endpoint
// (static build) resolves as a preview success without a network call.
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const form = $('[data-inquiry-form]');
  if (!form) return;

  const submitButton = $('[type="submit"]', form);
  const successStatus = $('[data-form-success]', form);
  const errorStatus = $('[data-form-error]', form);
  const checkIn = $('[data-check-in]', form);
  const checkOut = $('[data-check-out]', form);
  const honeypot = $('.form__honeypot input', form);
  const fields = $$('.form__input, .form__textarea, .form__select, .form__checkbox input', form);
  const phone = $('[name="phone"]', form);
  // Same rule as the pattern attribute; kept here so the check does not depend on the browser parsing it.
  const PHONE = /^\+?[0-9 ().\/-]{7,20}$/;

  const isoDate = (date) => date.toISOString().slice(0, 10);
  const today = isoDate(new Date());
  const nextDay = (value) => {
    const date = new Date(`${value}T00:00:00`);
    date.setDate(date.getDate() + 1);
    return isoDate(date);
  };

  if (checkIn) checkIn.min = today;
  if (checkOut) checkOut.min = nextDay(today);

  // Room and offer pages link here as ?subject=reservation&room=<slug>#inquiry.
  // Preselect the topic and open the message with the room name so the guest
  // does not retype what they just clicked.
  const params = new URLSearchParams(window.location.search);
  const subjectSelect = $('[name="subject"]', form);
  const messageField = $('[name="message"]', form);
  const wantedSubject = params.get('subject');
  if (subjectSelect && wantedSubject && $(`option[value="${CSS.escape(wantedSubject)}"]`, subjectSelect)) {
    subjectSelect.value = wantedSubject;
  }
  const roomSlug = params.get('room');
  if (messageField && roomSlug && !messageField.value) {
    const roomName = roomSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    messageField.value = `I am interested in the ${roomName}. `;
  }

  // Custom rules that HTML attributes cannot express: past check-in, check-out
  // on or before check-in. setCustomValidity feeds checkValidity() below.
  const applyDateRules = () => {
    if (!checkIn || !checkOut) return;
    checkIn.setCustomValidity(checkIn.value && checkIn.value < today ? 'past' : '');
    if (checkIn.value) checkOut.min = nextDay(checkIn.value);
    const outTooEarly = checkOut.value && checkIn.value && checkOut.value <= checkIn.value;
    checkOut.setCustomValidity(outTooEarly ? 'order' : '');
  };

  const setFieldError = (field, invalid) => {
    const wrapper = field.closest('.form__field');
    const error = wrapper ? $('.form__error', wrapper) : null;
    wrapper?.classList.toggle('is-error', invalid);
    if (error) error.hidden = !invalid;
    if (invalid) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const validateField = (field) => {
    applyDateRules();
    if (field === phone) phone.setCustomValidity(phone.value && !PHONE.test(phone.value) ? 'format' : '');
    const valid = field.checkValidity();
    setFieldError(field, !valid);
    return valid;
  };

  const validateAll = () => {
    let firstInvalid = null;
    fields.forEach((field) => {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  };

  // Errors appear on submit; afterwards each field re-checks itself as the
  // guest types so the message clears as soon as the value is right.
  fields.forEach((field) => {
    const revalidate = () => {
      if (!form.classList.contains('is-submitted')) return;
      validateField(field);
      // The two dates validate each other.
      if (field === checkIn && checkOut) validateField(checkOut);
    };
    field.addEventListener('input', revalidate);
    field.addEventListener('change', revalidate);
  });

  const setBusy = (busy) => {
    if (!submitButton) return;
    submitButton.disabled = busy;
    submitButton.setAttribute('aria-busy', String(busy));
    const label = busy ? submitButton.dataset.labelBusy : submitButton.dataset.labelIdle;
    const text = Array.from(submitButton.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (label && text) text.textContent = `${label} `;
  };

  const showStatus = (element) => {
    if (successStatus) successStatus.hidden = element !== successStatus;
    if (errorStatus) errorStatus.hidden = element !== errorStatus;
    element?.focus({ preventScroll: false });
  };

  const send = async () => {
    const endpoint = form.dataset.endpoint;
    // Static preview: no backend yet. WordPress sets data-endpoint to admin-post.php.
    if (!endpoint) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return;
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json().catch(() => ({}));
    if (payload.success === false) throw new Error(payload.message || 'Rejected');
  };

  // The first section carries its own WhatsApp link, so the float parks while
  // that section is on screen and comes back once the guest scrolls past it.
  const whatsappFloat = $('.whatsapp-float');
  const contactSection = form.closest('section');
  if (whatsappFloat && contactSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      whatsappFloat.classList.toggle('is-parked', entry.isIntersecting);
    }, { threshold: 0 }).observe(contactSection);
  }

  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    form.classList.add('is-submitted');
    if (successStatus) successStatus.hidden = true;
    if (errorStatus) errorStatus.hidden = true;

    const firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Bots fill the hidden field: act as sent, never call the endpoint.
    if (honeypot && honeypot.value) {
      form.reset();
      showStatus(successStatus);
      return;
    }

    sending = true;
    setBusy(true);
    try {
      await send();
      form.reset();
      form.classList.remove('is-submitted');
      fields.forEach((field) => setFieldError(field, false));
      showStatus(successStatus);
    } catch (error) {
      console.error('Inquiry could not be sent', error);
      showStatus(errorStatus);
    } finally {
      sending = false;
      setBusy(false);
    }
  });
})();
