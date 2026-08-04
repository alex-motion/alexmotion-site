/* AlexMotion — site behaviour: mobile nav, touch logo swap, video fallbacks. */
(function () {
  'use strict';

  /* --- Mobile nav --------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  /* --- SYMBOL grid: tap to swap on touch devices --------------------------
     CSS :hover covers pointer devices. On touch, first tap reveals the hover
     state and taps elsewhere clear it. */
  var logoLinks = document.querySelectorAll('.logo-link');

  if (logoLinks.length && window.matchMedia('(hover: none)').matches) {
    logoLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOn = link.classList.contains('mobile-hover');
        logoLinks.forEach(function (l) { l.classList.remove('mobile-hover'); });
        if (!wasOn) link.classList.add('mobile-hover');
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.logo-link')) return;
      logoLinks.forEach(function (l) { l.classList.remove('mobile-hover'); });
    });
  }

  initThemes();
  initContactForm();

  /* --- Video slots --------------------------------------------------------
     These pages carry a lot of video (the Play page is ~110MB all told), so
     nothing is fetched until it scrolls into view: each <video> holds its URL in
     data-src and preload="none". On entering the viewport the source is attached
     and played; on leaving, it pauses so offscreen clips don't burn CPU/battery.
     A missing file flips the slot to a styled placeholder instead of a broken box. */
  var slots = document.querySelectorAll('.video-slot');

  var markMissing = function (slot) {
    return function () { slot.setAttribute('data-state', 'missing'); };
  };

  // Videos that should be running right now (i.e. are in view).
  var wanted = [];

  // Autoplay gets refused for reasons that aren't permanent — an unpainted/hidden
  // tab, Low Power Mode, no interaction yet. None of these mean a missing file, so
  // failures are swallowed here and retried by the listeners below.
  var attemptPlay = function (video) {
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  };

  var retryWanted = function () {
    wanted.forEach(function (v) { if (v.paused) attemptPlay(v); });
  };

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) retryWanted();
  });
  // A first user gesture lifts autoplay restrictions in every browser that has them.
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, retryWanted, { passive: true, once: true });
  });

  var load = function (video, slot) {
    if (wanted.indexOf(video) === -1) wanted.push(video);
    if (video.dataset.src && !video.src) {
      video.addEventListener('error', markMissing(slot));
      // With preload="none" nothing buffers until play() is called, so play() has
      // to fire now to kick the load — but that first call is rejected while the
      // media is still unbuffered, hence the canplay retry once data arrives.
      video.addEventListener('canplay', function () { attemptPlay(video); });
      video.src = video.dataset.src;
    }
    attemptPlay(video);
  };

  var unload = function (video) {
    var i = wanted.indexOf(video);
    if (i !== -1) wanted.splice(i, 1);
    if (!video.paused) video.pause();
  };

  if (!('IntersectionObserver' in window)) {
    slots.forEach(function (slot) {
      var v = slot.querySelector('video');
      if (v) load(v, slot);
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting) load(video, entry.target);
      else unload(video);
    });
  }, { rootMargin: '200px 0px' });

  slots.forEach(function (slot) { io.observe(slot); });

  /* --- Theme A/B/C --------------------------------------------------------
     Applies ?theme=b|c (remembered afterwards) and, on localhost only, drops a
     small switcher in the corner. Theme A needs no attribute — it's the default
     in style.css, so the site renders correctly even if this never runs. */
  function initThemes() {
    var THEMES = ['a', 'b', 'c'];
    var root = document.documentElement;
    var store = {
      get: function () { try { return localStorage.getItem('am-theme'); } catch (e) { return null; } },
      set: function (v) { try { localStorage.setItem('am-theme', v); } catch (e) {} }
    };

    var apply = function (t) {
      if (t === 'a') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', t);
      store.set(t);
      var sw = document.querySelector('.theme-switch');
      if (sw) {
        sw.querySelectorAll('button').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.dataset.theme === t));
        });
      }
    };

    var fromUrl = (location.search.match(/[?&]theme=([abc])\b/i) || [])[1];
    var current = (fromUrl || store.get() || 'a').toLowerCase();
    if (THEMES.indexOf(current) === -1) current = 'a';
    apply(current);

    var isLocal = ['localhost', '127.0.0.1', ''].indexOf(location.hostname) !== -1;
    if (!isLocal) return;

    var bar = document.createElement('div');
    bar.className = 'theme-switch';
    bar.setAttribute('aria-label', 'Preview theme');
    THEMES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.theme = t;
      b.textContent = t.toUpperCase();
      b.title = 'Theme ' + t.toUpperCase();
      b.addEventListener('click', function () { apply(t); });
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
    apply(current);
  }

  /* --- Contact form -------------------------------------------------------
     Submits to Formspree over fetch so the visitor stays on the page and gets an
     inline result. With JS off the form posts natively to the same endpoint and
     still works — this is an enhancement, not a dependency. Declared as a hoisted
     function so it can run above, independent of the video code's early return. */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    var setStatus = function (msg, state) {
      status.textContent = msg;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    };

    /* Native constraint validation does the popup for us — this only replaces the
       generic "Please fill out this field" with the field's own name. The message
       is read off the <label>, so it stays correct if a label is reworded.

       These live on 'invalid' rather than 'submit' because a browser that fails
       validation shows its bubble and never fires 'submit' at all. */
    form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
      var labelEl = form.querySelector('label[for="' + el.id + '"]');
      var name = labelEl ? labelEl.textContent.trim() : 'This field';

      el.addEventListener('invalid', function () {
        form.setAttribute('data-submitted', 'true');
        el.setCustomValidity(el.validity.typeMismatch
          ? 'Enter a valid email address'
          : name + ' required');
      });

      // Must clear on input: a lingering custom message keeps the field invalid
      // forever, so the form could never be submitted once it had failed once.
      el.addEventListener('input', function () { el.setCustomValidity(''); });
    });

    form.addEventListener('submit', function (e) {
      // Surfaces the :invalid styling only after a real submit attempt.
      form.setAttribute('data-submitted', 'true');

      // Let the browser's own validation UI handle empty/malformed fields.
      if (!form.checkValidity()) return;

      // Guard against posting into the void before the endpoint is filled in.
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        setStatus('Form isn’t connected yet — add your Formspree ID to contact.html. ' +
                  'In the meantime, email alex@alexmotion.com directly.', 'error');
        return;
      }

      e.preventDefault();
      submitBtn.disabled = true;
      setStatus('Sending…');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          form.removeAttribute('data-submitted');
          setStatus('Thanks — your message is on its way.', 'ok');
          return;
        }
        return res.json().then(function (data) {
          var detail = (data && data.errors || []).map(function (x) { return x.message; }).join(', ');
          throw new Error(detail || 'Something went wrong.');
        });
      }).catch(function (err) {
        setStatus((err && err.message ? err.message + ' ' : '') +
                  'You can also email alex@alexmotion.com directly.', 'error');
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
  }
})();
