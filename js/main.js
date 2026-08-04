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
