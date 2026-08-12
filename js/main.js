/* ==========================================================================
   Franco's Pizza Restaurant and Bar
   Site behaviour
   Built by Sirius Ascent
   --------------------------------------------------------------------------
   01. Config
   02. Helpers
   03. Header & navigation
   04. Scroll reveal
   05. Opening hours
   06. Lightbox
   07. Gallery filters & day tabs
   08. WhatsApp enquiry forms
   09. Toasts
   10. Easter eggs
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     01. Config
     ====================================================================== */
  var CONFIG = {
    // WhatsApp number in full international format, digits only.
    whatsapp: '27826180225',
    businessName: "Franco's Pizza Restaurant and Bar",
    timeZone: 'Africa/Johannesburg',
    // Opening hours as supplied by the business. 24h decimal, e.g. 23.5 = 23:30.
    hours: [
      { day: 'Sunday',    open: 10, close: 23.5 },
      { day: 'Monday',    open: 10, close: 23.5 },
      { day: 'Tuesday',   open: 10, close: 22.5 },
      { day: 'Wednesday', open: 10, close: 23.5 },
      { day: 'Thursday',  open: 10, close: 23.5 },
      { day: 'Friday',    open: 10, close: 23.5 },
      { day: 'Saturday',  open: 10, close: 23.5 }
    ]
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     02. Helpers
     ====================================================================== */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function on(el, evt, fn, opts) {
    if (el) el.addEventListener(evt, fn, opts);
  }

  /** Current date parts in the restaurant's timezone, with a safe fallback. */
  function localNow() {
    try {
      var fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: CONFIG.timeZone,
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      var parts = {};
      fmt.formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var index = days.indexOf(parts.weekday);
      return {
        dayIndex: index > -1 ? index : new Date().getDay(),
        decimal: parseInt(parts.hour, 10) + parseInt(parts.minute, 10) / 60
      };
    } catch (e) {
      var d = new Date();
      return { dayIndex: d.getDay(), decimal: d.getHours() + d.getMinutes() / 60 };
    }
  }

  function formatTime(decimal) {
    var h = Math.floor(decimal);
    var m = Math.round((decimal - h) * 60);
    var suffix = h >= 12 ? 'PM' : 'AM';
    var hour12 = h % 12 === 0 ? 12 : h % 12;
    return hour12 + ':' + (m < 10 ? '0' + m : m) + ' ' + suffix;
  }

  /* ======================================================================
     03. Header & navigation
     ====================================================================== */
  function initHeader() {
    var header = $('.header');
    var toggle = $('.nav-toggle');
    var links = $('.nav__links');

    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 8);
      };
      on(window, 'scroll', onScroll, { passive: true });
      onScroll();
    }

    if (toggle && links) {
      var close = function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      };

      on(toggle, 'click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('is-open', !open);
      });

      // Close the menu after tapping any link inside it.
      $$('a, button', links).forEach(function (el) { on(el, 'click', close); });

      on(document, 'keydown', function (e) {
        if (e.key === 'Escape') close();
      });

      // Reset state when returning to desktop width.
      var mq = window.matchMedia('(min-width: 821px)');
      var onChange = function (e) { if (e.matches) close(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);

      on(document, 'click', function (e) {
        if (!links.classList.contains('is-open')) return;
        if (links.contains(e.target) || toggle.contains(e.target)) return;
        close();
      });
    }

    // Back to top
    var toTop = $('.to-top');
    if (toTop) {
      var toggleTop = function () {
        toTop.classList.toggle('is-visible', window.scrollY > 600);
      };
      on(window, 'scroll', toggleTop, { passive: true });
      toggleTop();
      on(toTop, 'click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ======================================================================
     04. Scroll reveal
     ====================================================================== */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     05. Opening hours
     ====================================================================== */
  function initHours() {
    var now = localNow();
    var today = CONFIG.hours[now.dayIndex];
    var isOpen = today && now.decimal >= today.open && now.decimal < today.close;

    // Highlight today's row in any hours table on the page.
    $$('.hours__row').forEach(function (row) {
      var day = row.getAttribute('data-day');
      if (day !== String(now.dayIndex)) return;
      row.classList.add('is-today');
      var dayCell = $('.hours__day', row);
      if (dayCell && !$('.today-flag', dayCell)) {
        var flag = document.createElement('span');
        flag.className = 'today-flag';
        flag.textContent = 'Today';
        dayCell.appendChild(flag);
      }
    });

    // Live open / closed indicator.
    $$('[data-open-status]').forEach(function (el) {
      var dot = $('.status-dot', el);
      var label = $('[data-status-text]', el);
      if (dot) dot.setAttribute('data-state', isOpen ? 'open' : 'closed');
      if (!label) return;
      if (isOpen) {
        label.textContent = 'Open now until ' + formatTime(today.close);
      } else if (today && now.decimal < today.open) {
        label.textContent = 'Opens today at ' + formatTime(today.open);
      } else {
        var next = CONFIG.hours[(now.dayIndex + 1) % 7];
        label.textContent = 'Closed now, opens ' + next.day + ' at ' + formatTime(next.open);
      }
    });
  }

  /* ======================================================================
     06. Lightbox
     ====================================================================== */
  function initLightbox() {
    var triggers = $$('[data-lightbox]');
    if (!triggers.length) return;

    var box = $('.lightbox');
    if (!box) return;

    var img = $('.lightbox__img', box);
    var caption = $('.lightbox__caption', box);
    var btnClose = $('.lightbox__close', box);
    var btnPrev = $('.lightbox__prev', box);
    var btnNext = $('.lightbox__next', box);
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + triggers.length) % triggers.length;
      var t = triggers[index];
      img.src = t.getAttribute('data-lightbox');
      img.alt = t.getAttribute('data-caption') || '';
      caption.textContent = t.getAttribute('data-caption') || '';
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      btnClose.focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(function (t, i) {
      on(t, 'click', function (e) {
        e.preventDefault();
        open(i);
      });
    });

    on(btnClose, 'click', close);
    on(btnPrev, 'click', function () { show(index - 1); });
    on(btnNext, 'click', function () { show(index + 1); });

    on(box, 'click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__figure')) close();
    });

    on(document, 'keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      // Keep focus inside the dialog.
      if (e.key === 'Tab') {
        var focusable = [btnClose, btnPrev, btnNext].filter(Boolean);
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  /* ======================================================================
     07. Gallery filters & day tabs
     ====================================================================== */
  function initFilters() {
    var group = $('[data-filter-group]');
    if (!group) return;

    var buttons = $$('[data-filter]', group);
    var items = $$('[data-category]');

    buttons.forEach(function (btn) {
      on(btn, 'click', function () {
        var value = btn.getAttribute('data-filter');
        buttons.forEach(function (b) {
          b.setAttribute('aria-selected', String(b === btn));
        });
        items.forEach(function (item) {
          var match = value === 'all' || item.getAttribute('data-category') === value;
          item.hidden = !match;
        });
      });
    });
  }

  function initTabs() {
    $$('[data-tabs]').forEach(function (group) {
      var tabs = $$('[role="tab"]', group);
      var panels = tabs.map(function (t) {
        return document.getElementById(t.getAttribute('aria-controls'));
      });

      function select(i) {
        tabs.forEach(function (t, n) {
          var active = n === i;
          t.setAttribute('aria-selected', String(active));
          t.tabIndex = active ? 0 : -1;
          if (panels[n]) panels[n].hidden = !active;
        });
      }

      tabs.forEach(function (tab, i) {
        on(tab, 'click', function () { select(i); });
        on(tab, 'keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') next = 0;
          if (e.key === 'End') next = tabs.length - 1;
          if (next === null) return;
          e.preventDefault();
          select(next);
          tabs[next].focus();
        });
      });

      // Open on the current day when the tab set represents a week.
      var todayIndex = tabs.findIndex(function (t) {
        return t.getAttribute('data-day-index') === String(localNow().dayIndex);
      });
      select(todayIndex > -1 ? todayIndex : 0);
    });
  }

  /* ======================================================================
     08. WhatsApp enquiry forms
     ====================================================================== */
  function initForms() {
    $$('[data-whatsapp-form]').forEach(function (form) {
      var fields = $$('[data-field]', form);

      function validate(input) {
        var wrap = input.closest('.field');
        var value = input.value.trim();
        var message = '';

        if (input.required && !value) {
          message = 'This field is required.';
        } else if (value && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = 'Enter a valid email address.';
        } else if (value && input.type === 'tel' && value.replace(/[^\d]/g, '').length < 9) {
          message = 'Enter a valid phone number.';
        }

        if (wrap) {
          wrap.classList.toggle('has-error', Boolean(message));
          var err = $('.error', wrap);
          if (err) err.textContent = message;
        }
        return !message;
      }

      fields.forEach(function (input) {
        on(input, 'blur', function () { validate(input); });
        on(input, 'input', function () {
          var wrap = input.closest('.field');
          if (wrap && wrap.classList.contains('has-error')) validate(input);
        });
      });

      on(form, 'submit', function (e) {
        e.preventDefault();

        var valid = true;
        var firstBad = null;
        fields.forEach(function (input) {
          if (!validate(input)) {
            valid = false;
            if (!firstBad) firstBad = input;
          }
        });

        if (!valid) {
          if (firstBad) firstBad.focus();
          toast('Please complete the highlighted fields before sending.', 'alert');
          return;
        }

        var get = function (name) {
          var el = form.elements[name];
          return el ? el.value.trim() : '';
        };

        var lines = [
          'Hello ' + CONFIG.businessName + ',',
          '',
          'Name: ' + get('name'),
          'Phone: ' + get('phone'),
          'Email: ' + (get('email') || 'Not provided'),
          'Subject: ' + get('subject'),
          '',
          'Message:',
          get('message')
        ];

        var url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
        var win = window.open(url, '_blank', 'noopener');

        if (win) {
          toast('WhatsApp is opening with your message ready. Just press send.', 'success');
          form.reset();
        } else {
          toast('Please allow pop-ups, or tap the WhatsApp button to chat with us.', 'alert');
        }
      });
    });
  }

  /* ======================================================================
     09. Toasts
     ====================================================================== */
  var ICONS = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></svg>'
  };

  function toast(message, type) {
    var wrap = $('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }

    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = (ICONS[type] || ICONS.info) + '<span></span>';
    $('span', el).textContent = message;
    wrap.appendChild(el);

    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
    }, 4600);
  }

  /* ======================================================================
     10. Easter eggs
     ====================================================================== */
  function initEasterEggs() {
    if (reduceMotion) return;

    // A pizza peeks up once the visitor has scrolled past the gallery.
    var peek = $('.gallery-peek');
    var gallery = $('.gallery');
    if (peek && gallery && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0.85 || entry.boundingClientRect.top < 0) {
            peek.classList.add('is-revealed');
            io.disconnect();
          }
        });
      }, { threshold: [0.85] });
      io.observe(gallery);
    }

    // The spinning slice greeting removes itself once it has played.
    var slice = $('.slice-greeting');
    if (slice) {
      on(slice, 'animationend', function () {
        if (slice.parentNode) slice.parentNode.removeChild(slice);
      });
    }
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  function init() {
    initHeader();
    initReveal();
    initHours();
    initLightbox();
    initFilters();
    initTabs();
    initForms();
    initEasterEggs();

    // Stamp the current year into the footer.
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
