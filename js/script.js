/* =========================================================
   MIA'S BAKERY - JAVASCRIPT
   Part 3: Enhancing Functionality and SEO
   Author: Sisanda Martins (ST10376718)
   =========================================================
   One file is shared by all five pages. Each feature below
   starts by checking that its elements exist on the current
   page, so it only runs where it is needed.

   Contents:
   1. Settings and product data
   2. Small helper functions
   3. Mobile navigation (hamburger menu)
   4. Scroll-reveal animations
   5. Products page: dynamic cards, search, filter, sort
   6. Form validation engine (shared by both forms)
   7. Enquiry form: validation, estimate, AJAX submission
   8. Contact form: validation and email compilation
   9. Contact page: interactive Leaflet map
   10. Home page: gallery lightbox
   11. Enquiry page: FAQ accordion
   12. Start-up
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. SETTINGS AND PRODUCT DATA
  --------------------------------------------------------- */
  const CONFIG = {
    // AJAX endpoint for the enquiry form. Create a free form at formspree.io,
    // then replace YOUR_FORM_ID with the ID Formspree gives you.
    // While it still says YOUR_FORM_ID the form runs in demo mode (nothing is sent).
    formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',

    // The contact form is compiled into an email addressed to this recipient.
    contactRecipient: 'info@miasbakery.co.za',

    enquiryMessageMax: 500,
    contactMessageMax: 1000
  };

  const CATEGORY_LABELS = {
    bread: 'Fresh Bread',
    pastries: 'Pastries',
    cakes: 'Celebration Cakes'
  };

  // Single source of truth for the products page AND the enquiry form's cost estimate.
  // price = the "from" price in rand. leadDays = notice needed before collection.
  const PRODUCTS = [
    { id: 'white-loaf', name: 'Classic White Loaf', category: 'bread', price: 35, unit: 'per loaf', leadDays: 0,
      description: 'Soft, golden and perfect for sandwiches, baked fresh every morning.',
      image: 'product-bread', alt: 'Sliced sourdough bread loaves on a wooden board' },
    { id: 'whole-wheat-loaf', name: 'Whole Wheat Loaf', category: 'bread', price: 38, unit: 'per loaf', leadDays: 0,
      description: 'A hearty whole wheat loaf with a nutty flavour and a good crumb.',
      image: 'product-bread', alt: 'Sliced loaves of bread on a wooden board' },
    { id: 'sourdough-loaf', name: 'Sourdough Loaf', category: 'bread', price: 48, unit: 'per loaf', leadDays: 0,
      description: 'Slow-fermented sourdough with a crisp crust and a chewy, tangy inside.',
      image: 'product-bread', alt: 'Sourdough bread loaves, one sliced, on a wooden board' },

    { id: 'croissant', name: 'Butter Croissant', category: 'pastries', price: 28, unit: 'each', leadDays: 0,
      description: 'Flaky, buttery layers baked fresh every day.',
      image: 'product-pastries', alt: 'Assortment of croissants, muffins, and donuts' },
    { id: 'muffin', name: 'Muffin', category: 'pastries', price: 30, unit: 'each', leadDays: 0,
      description: 'Soft, generous muffins in a rotating selection of flavours.',
      image: 'product-pastries', alt: 'Muffins and croissants in a bakery display' },
    { id: 'danish', name: 'Danish Pastry', category: 'pastries', price: 32, unit: 'each', leadDays: 0,
      description: 'Light, flaky danishes with a sweet filling.',
      image: 'product-pastries', alt: 'Danish pastries and croissants in a bakery display' },

    { id: 'birthday-cake', name: 'Birthday Cake', category: 'cakes', price: 450, unit: 'per cake', leadDays: 3,
      description: 'A freshly baked cake for birthdays, finished with cream and your choice of topping.',
      image: 'product-cakes', alt: 'Decorated celebration cake with cream and cherries' },
    { id: 'celebration-cake', name: 'Custom Celebration Cake', category: 'cakes', price: 650, unit: 'per cake', leadDays: 3,
      description: 'Custom-designed for graduations, anniversaries and special occasions.',
      image: 'product-cakes', alt: 'Custom celebration cakes with cream, cherries and caramel' },
    { id: 'wedding-cake', name: 'Wedding Cake', category: 'cakes', price: 1800, unit: 'per cake', leadDays: 14,
      description: 'A multi-tier wedding cake designed with you, from flavours to finish.',
      image: 'product-cakes', alt: 'Elegant decorated cakes for a wedding celebration' }
  ];

  const productById = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------------------------------------------------------
     2. SMALL HELPER FUNCTIONS
  --------------------------------------------------------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Builds a DOM element. Text is always added as a text node (never as HTML),
  // which keeps anything a visitor types from being run as code (XSS-safe).
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === 'class') node.className = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    children.flat(Infinity).forEach((child) => node.append(child)); // flat(Infinity) copes with arrays inside arrays
    return node;
  }

  const formatRand = (n) => 'R' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const startOfToday = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

  const daysBetween = (from, to) => Math.round((to - from) / 86400000);

  // Turns "2026-11-05" into a local Date (avoids time-zone shifts from new Date("2026-11-05")).
  function parseDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return d.getMonth() === Number(match[2]) - 1 ? d : null;
  }

  const toInputDate = (d) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  const formatDate = (d) =>
    d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // We trade Monday to Saturday, so skip Sundays when suggesting a date.
  const nextTradingDay = (d) => (d.getDay() === 0 ? addDays(d, 1) : d);

  /* ---------------------------------------------------------
     3. MOBILE NAVIGATION (HAMBURGER MENU)
     The button is only visible below 600px (see CSS). It toggles
     an "is-open" class on the nav and keeps aria-expanded in sync
     for screen readers.
  --------------------------------------------------------- */
  function initNav() {
    const toggle = $('.nav-toggle');
    const nav = $('#site-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

    // Choosing a link closes the menu
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Growing the window past the mobile breakpoint resets the menu
    const mobileQuery = window.matchMedia('(max-width: 600px)');
    const onChange = () => setOpen(false);
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onChange);
    else if (mobileQuery.addListener) mobileQuery.addListener(onChange);
  }

  /* ---------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Elements with class "reveal" fade up when they scroll into view.
  --------------------------------------------------------- */
  let revealObserver = null;

  function initReveal() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      $$('.reveal').forEach((node) => node.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach((node) => revealObserver.observe(node));
  }

  function observeReveal(node) {
    if (revealObserver) revealObserver.observe(node);
    else node.classList.add('is-visible');
  }

  /* ---------------------------------------------------------
     5. PRODUCTS PAGE: DYNAMIC CARDS, SEARCH, FILTER, SORT
     The product grid is built from the PRODUCTS array. The static
     cards in the HTML are the fallback when JavaScript is off.
  --------------------------------------------------------- */
  function buildProductCard(product) {
    const base = 'images/responsive/' + product.image;
    return el('article', { class: 'product reveal' },
      el('img', {
        src: base + '-900.jpg',
        srcset: base + '-480.jpg 480w, ' + base + '-900.jpg 900w, ' + base + '-1600.jpg 1600w',
        sizes: '(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw',
        width: '900', height: '675', loading: 'lazy', decoding: 'async', alt: product.alt
      }),
      el('span', { class: 'tag' }, CATEGORY_LABELS[product.category]),
      el('h2', {}, product.name),
      el('p', {}, product.description),
      el('div', { class: 'product-meta' },
        el('p', { class: 'price' }, 'From ' + formatRand(product.price)),
        el('a', { class: 'btn btn-secondary btn-small', href: 'enquiry.html?product=' + encodeURIComponent(product.id) },
          'Enquire')
      )
    );
  }

  function initProducts() {
    const grid = $('#product-grid');
    const form = $('#product-filters');
    if (!grid || !form) return;

    const search = $('#product-search');
    const category = $('#product-category');
    const sort = $('#product-sort');
    const count = $('#result-count');
    const empty = $('#no-results');

    // Pre-select a category or search term from the link that brought us here
    const params = new URLSearchParams(window.location.search);
    const wantedCategory = params.get('category');
    if (wantedCategory && CATEGORY_LABELS[wantedCategory]) category.value = wantedCategory;
    if (params.get('q')) search.value = params.get('q');

    function getVisibleProducts() {
      const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      let list = PRODUCTS.filter((product) => {
        if (category.value !== 'all' && product.category !== category.value) return false;
        const haystack = (product.name + ' ' + product.description + ' ' + CATEGORY_LABELS[product.category]).toLowerCase();
        return words.every((word) => haystack.includes(word)); // every word must match
      });
      if (sort.value === 'price-asc') list = list.slice().sort((a, b) => a.price - b.price);
      else if (sort.value === 'price-desc') list = list.slice().sort((a, b) => b.price - a.price);
      else if (sort.value === 'name') list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
      return list;
    }

    function render() {
      const list = getVisibleProducts();
      grid.replaceChildren(...list.map(buildProductCard));
      $$('.reveal', grid).forEach(observeReveal);
      empty.hidden = list.length > 0;
      count.textContent = list.length === 0
        ? 'No products found.'
        : 'Showing ' + list.length + ' of ' + PRODUCTS.length + ' products';
    }

    function reset() {
      search.value = '';
      category.value = 'all';
      sort.value = 'featured';
      render();
      search.focus();
    }

    let timer = null;
    search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(render, 150); // wait for a pause in typing
    });
    category.addEventListener('change', render);
    sort.addEventListener('change', render);
    form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
    $('#filter-reset').addEventListener('click', reset);
    $('#no-results-reset').addEventListener('click', reset);

    render();
  }

  /* ---------------------------------------------------------
     6. FORM VALIDATION ENGINE (SHARED BY BOTH FORMS)
     rules = { fieldName: (value, form) => "error message" or "" }
     - Errors appear under each field in <span id="{field}-error">.
     - A field is checked when you leave it, then live as you type.
     - On submit every field is checked and the first bad one is focused.
  --------------------------------------------------------- */
  const validators = {
    name(value) {
      if (!value) return 'Please enter your full name.';
      if (value.length < 2) return 'Your name must be at least 2 characters.';
      if (value.length > 60) return 'Your name must be 60 characters or fewer.';
      if (!/^[\p{L}][\p{L}' -]*$/u.test(value)) return 'Use letters, spaces, hyphens or apostrophes only.';
      return '';
    },
    email(value) {
      if (!value) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email address, like name@example.com.';
      return '';
    },
    phone(value) {
      if (!value) return ''; // optional
      const digits = value.replace(/[\s\-()]/g, '');
      if (!/^(?:\+27|0)[1-9]\d{8}$/.test(digits)) {
        return 'Enter a valid South African number, like 021 424 5678 or 082 123 4567.';
      }
      return '';
    },
    message(max) {
      return (value) => {
        if (!value) return 'Please enter a message.';
        if (value.length < 10) return 'Your message must be at least 10 characters.';
        if (value.length > max) return 'Your message must be ' + max + ' characters or fewer.';
        return '';
      };
    }
  };

  function createFormValidator(form, rules) {
    const touched = new Set();

    const errorBox = (field) => document.getElementById(field.name + '-error');

    function showResult(field, message) {
      const box = errorBox(field);
      if (box) box.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function checkField(name) {
      const field = form.elements[name];
      const message = rules[name](field.value.trim(), form);
      showResult(field, message);
      return !message;
    }

    function checkAll() {
      let firstBad = null;
      Object.keys(rules).forEach((name) => {
        touched.add(name);
        if (!checkField(name) && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      field.addEventListener('blur', () => { touched.add(name); checkField(name); });
      field.addEventListener('input', () => { if (touched.has(name)) checkField(name); });
      field.addEventListener('change', () => { if (touched.has(name)) checkField(name); });
    });

    function clear() {
      touched.clear();
      Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        field.removeAttribute('aria-invalid');
        const box = errorBox(field);
        if (box) box.textContent = '';
      });
    }

    return { checkField, checkAll, clear, touched };
  }

  function attachCounter(textarea, counter, max) {
    const update = () => {
      counter.textContent = textarea.value.length + ' / ' + max;
    };
    textarea.addEventListener('input', update);
    update();
    return update;
  }

  // Sends the form data without reloading the page (AJAX using fetch).
  async function submitForm(payload) {
    if (CONFIG.formEndpoint.indexOf('YOUR_FORM_ID') !== -1) {
      // Demo mode: pretend to send so the page can be demonstrated without a Formspree account.
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.info('[Demo mode] Enquiry not sent. Set CONFIG.formEndpoint in js/script.js to send for real.', payload);
      return { ok: true, demo: true };
    }
    const response = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Request failed with status ' + response.status);
    return response.json();
  }

  /* ---------------------------------------------------------
     7. ENQUIRY FORM: VALIDATION, COST ESTIMATE, AJAX SUBMISSION
  --------------------------------------------------------- */
  function estimateAvailability(product, quantity, dateValue) {
    const today = startOfToday();
    const bulk = product.category !== 'cakes' && quantity >= 20;
    const noticeDays = Math.max(product.leadDays, bulk ? 1 : 0);

    const noticeText = product.category === 'cakes'
      ? product.name + 's need at least ' + product.leadDays + ' days\' notice.'
      : bulk ? 'Large orders of 20 or more need 24 hours\' notice.'
             : 'Baked fresh daily at both branches.';

    if (!dateValue) return { ok: true, text: noticeText };

    const wanted = parseDate(dateValue);
    const daysAway = daysBetween(today, wanted);
    if (daysAway >= noticeDays) {
      return { ok: true, text: 'Available for ' + formatDate(wanted) + '. ' + noticeText };
    }
    const earliest = nextTradingDay(addDays(today, noticeDays));
    return {
      ok: false,
      text: 'That date is too soon. ' + noticeText + ' The earliest we can do is ' + formatDate(earliest) + '.'
    };
  }

  function buildEnquiryResponse(data) {
    const product = productById(data.product);
    const firstName = data.name.split(/\s+/)[0];
    const rows = [];

    if (product) {
      const total = product.price * data.quantity;
      const availability = estimateAvailability(product, data.quantity, data.date);
      rows.push(['Product', product.name]);
      rows.push(['Quantity', String(data.quantity)]);
      rows.push(['Estimated cost', 'From ' + formatRand(total) + ' (' + formatRand(product.price) + ' ' + product.unit + ')']);
      rows.push(['Availability', el('span', { class: availability.ok ? 'status-ok' : 'status-warn' }, availability.text)]);
    } else {
      rows.push(['Enquiry', 'General question']);
      rows.push(['Estimated cost', 'We\'ll send you a quote once we know what you need.']);
    }

    return [
      el('h2', {}, 'Thank you, ' + firstName + '!'),
      el('p', {}, 'We have received your enquiry. Here is a quick summary:'),
      el('dl', {}, rows.map(([term, detail]) => [el('dt', {}, term), el('dd', {}, detail)])),
      el('p', {}, 'Prices are "from" prices; we\'ll confirm the final cost and details at ' + data.email + ' within one business day.')
    ];
  }

  function initEnquiryForm() {
    const form = $('#enquiry-form');
    if (!form) return;

    const productSelect = form.elements.product;
    const dateInput = form.elements.date;
    const status = $('#form-status');
    const response = $('#enquiry-response');
    const submitButton = $('button[type="submit"]', form);

    // Replace the plain category options with the real product list, grouped by category
    productSelect.replaceChildren(
      el('option', { value: '' }, 'Choose a product...'),
      ...Object.keys(CATEGORY_LABELS).map((key) =>
        el('optgroup', { label: CATEGORY_LABELS[key] },
          PRODUCTS.filter((p) => p.category === key).map((p) =>
            el('option', { value: p.id }, p.name + ' (from ' + formatRand(p.price) + ')')))),
      el('option', { value: 'other' }, 'Other / general question')
    );

    // Pre-select the product when arriving from a "Enquire" button on the products page
    const wanted = new URLSearchParams(window.location.search).get('product');
    if (wanted && productById(wanted)) productSelect.value = wanted;

    // Dates in the past cannot be chosen
    dateInput.min = toInputDate(startOfToday());

    const validator = createFormValidator(form, {
      name: validators.name,
      email: validators.email,
      phone: validators.phone,
      product: (value) => (value ? '' : 'Please choose a product.'),
      quantity: (value) => {
        if (!value) return 'Please enter a quantity.';
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 100) return 'Enter a whole number from 1 to 100.';
        return '';
      },
      date: (value, f) => {
        const product = productById(f.elements.product.value);
        if (!value) return product && product.category === 'cakes' ? 'Please choose the date you need your cake.' : '';
        const wantedDate = parseDate(value);
        if (!wantedDate) return 'Enter a valid date.';
        if (wantedDate < startOfToday()) return 'That date has already passed.';
        if (wantedDate.getDay() === 0) return 'We are closed on Sundays. Please choose Monday to Saturday.';
        if (wantedDate > addDays(startOfToday(), 365)) return 'Please choose a date within the next 12 months.';
        return '';
      },
      message: validators.message(CONFIG.enquiryMessageMax)
    });

    // "Date needed" becomes required for cakes, so re-check it when the product changes
    productSelect.addEventListener('change', () => {
      if (validator.touched.has('date')) validator.checkField('date');
    });

    const updateCounter = attachCounter(form.elements.message, $('#message-count'), CONFIG.enquiryMessageMax);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.hidden = true;
      if (!validator.checkAll()) return;

      // Honeypot: real visitors never see this field, bots fill it in
      if (form.elements.website.value) {
        form.reset();
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        product: form.elements.product.value,
        quantity: Number(form.elements.quantity.value),
        date: form.elements.date.value,
        message: form.elements.message.value.trim()
      };

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        await submitForm(Object.assign({}, data, {
          product: productById(data.product) ? productById(data.product).name : 'General question'
        }));
        response.replaceChildren(...buildEnquiryResponse(data));
        response.hidden = false;
        response.focus();
        response.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.reset();
        validator.clear();
        updateCounter();
      } catch (error) {
        console.error(error);
        status.replaceChildren(
          'Sorry, we could not send your enquiry just now. Please try again, or email us at ',
          el('a', { href: 'mailto:' + CONFIG.contactRecipient }, CONFIG.contactRecipient),
          '.'
        );
        status.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Enquiry';
      }
    });
  }

  /* ---------------------------------------------------------
     8. CONTACT FORM: VALIDATION AND EMAIL COMPILATION
     Once the form is valid, the details are compiled into an email
     addressed to CONFIG.contactRecipient. The visitor reviews it and
     sends it from their own email app (mailto link).
  --------------------------------------------------------- */
  function compileEmail(data) {
    const subject = 'Website message (' + data.type + ') from ' + data.name;
    const body = [
      'Hello Mia\'s Bakery,',
      '',
      data.message,
      '',
      '---',
      'Name: ' + data.name,
      'Email: ' + data.email,
      'Phone: ' + (data.phone || 'not provided'),
      'Type of message: ' + data.type,
      'Sent from the Mia\'s Bakery website contact form'
    ].join('\n');

    const mailto = 'mailto:' + CONFIG.contactRecipient +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n'));

    return { subject, body, mailto };
  }

  function initContactForm() {
    const form = $('#contact-form-element');
    if (!form) return;

    const preview = $('#email-preview');

    const validator = createFormValidator(form, {
      name: validators.name,
      email: validators.email,
      phone: validators.phone,
      type: (value) => (value ? '' : 'Please choose the type of message.'),
      message: validators.message(CONFIG.contactMessageMax)
    });

    const updateCounter = attachCounter(form.elements.message, $('#message-count'), CONFIG.contactMessageMax);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validator.checkAll()) return;

      if (form.elements.website.value) { // honeypot
        form.reset();
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        type: form.elements.type.value,
        message: form.elements.message.value.trim()
      };
      const email = compileEmail(data);

      const copyButton = el('button', { type: 'button', class: 'btn btn-secondary btn-small' }, 'Copy email text');
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('To: ' + CONFIG.contactRecipient + '\nSubject: ' + email.subject + '\n\n' + email.body);
          copyButton.textContent = 'Copied!';
        } catch (error) {
          copyButton.textContent = 'Copy failed - select the text above instead';
        }
      });

      const editButton = el('button', { type: 'button', class: 'btn btn-secondary btn-small' }, 'Edit message');
      editButton.addEventListener('click', () => {
        preview.hidden = true;
        form.elements.message.focus();
      });

      preview.replaceChildren(
        el('h3', {}, 'Your message is ready to send'),
        el('dl', {},
          el('dt', {}, 'To'), el('dd', {}, CONFIG.contactRecipient),
          el('dt', {}, 'Subject'), el('dd', {}, email.subject)),
        el('pre', {}, email.body),
        el('div', { class: 'response-actions' },
          el('a', { class: 'btn btn-small', href: email.mailto }, 'Open in my email app'),
          copyButton,
          editButton),
        el('p', { class: 'field-hint' }, 'Nothing has been sent yet. Choose "Open in my email app" and press send there.')
      );
      preview.hidden = false;
      preview.focus();
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------------------------------------------------------
     9. CONTACT PAGE: INTERACTIVE MAP (LEAFLET + OPENSTREETMAP)
     Branch details are read from the data-* attributes on each
     .location card, so the HTML stays the single source of truth.
  --------------------------------------------------------- */
  function initMap() {
    const canvas = $('#map-canvas');
    if (!canvas || typeof window.L === 'undefined') return; // Leaflet not loaded: fallback text stays

    const L = window.L;
    const map = L.map(canvas, { scrollWheelZoom: false });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const bounds = [];
    $$('.location[data-lat]').forEach((card) => {
      const position = [Number(card.dataset.lat), Number(card.dataset.lng)];
      const address = $('p', card).textContent;
      const popup = el('div', {}, el('strong', {}, card.dataset.name), el('br'), address);
      const marker = L.marker(position, { title: card.dataset.name }).addTo(map).bindPopup(popup);
      bounds.push(position);

      const button = $('.map-btn', card);
      if (button) {
        button.addEventListener('click', () => {
          canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
          map.flyTo(position, 16);
          marker.openPopup();
        });
      }
    });

    if (bounds.length) map.fitBounds(bounds, { padding: [60, 60] });

    // Scroll-wheel zoom only after the visitor clicks the map, so page scrolling is not hijacked
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());
  }

  /* ---------------------------------------------------------
     10. HOME PAGE: GALLERY LIGHTBOX
     Thumbnails are normal links to the large image, so they still
     work without JavaScript. Here they open a native <dialog>.
  --------------------------------------------------------- */
  function initLightbox() {
    const dialog = $('#lightbox');
    const links = $$('.gallery-item');
    if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

    const image = $('img', dialog);
    const caption = $('figcaption', dialog);
    let index = 0;

    function show(i) {
      index = (i + links.length) % links.length;
      const link = links[index];
      image.src = link.href;
      image.alt = link.dataset.alt || '';
      caption.textContent = (link.dataset.caption || '') + '  (' + (index + 1) + ' of ' + links.length + ')';
    }

    links.forEach((link, i) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        show(i);
        dialog.showModal();
      });
    });

    $('.lb-close', dialog).addEventListener('click', () => dialog.close());
    $('.lb-prev', dialog).addEventListener('click', () => show(index - 1));
    $('.lb-next', dialog).addEventListener('click', () => show(index + 1));

    // Clicking the dark backdrop (outside the picture) closes the viewer
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    // Arrow keys move between images (Escape is handled by <dialog> itself)
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ---------------------------------------------------------
     11. ENQUIRY PAGE: FAQ ACCORDION
     One panel open at a time. aria-expanded keeps screen readers
     informed; the CSS animates the height.
  --------------------------------------------------------- */
  function initAccordion() {
    const accordion = $('.accordion');
    if (!accordion) return;

    const items = $$('.accordion-item', accordion);
    const triggers = items.map((item) => $('.accordion-trigger', item));

    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      $('.accordion-trigger', item).setAttribute('aria-expanded', String(open));
    }

    triggers.forEach((trigger, i) => {
      trigger.addEventListener('click', () => {
        const willOpen = !items[i].classList.contains('is-open');
        items.forEach((item) => setOpen(item, false));
        setOpen(items[i], willOpen);
      });

      // Arrow keys, Home and End move between questions
      trigger.addEventListener('keydown', (event) => {
        const keys = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: triggers.length - 1 };
        if (event.key in keys) {
          event.preventDefault();
          triggers[(keys[event.key] + triggers.length) % triggers.length].focus();
        }
      });
    });

    setOpen(items[0], true); // first question open to show how it works
  }

  /* ---------------------------------------------------------
     12. START-UP
  --------------------------------------------------------- */
  initNav();
  initReveal();
  initProducts();
  initEnquiryForm();
  initContactForm();
  initMap();
  initLightbox();
  initAccordion();
})();
