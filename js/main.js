/* Avi Jani: sheet header, mobile nav, scroll reveals, drawing animation */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* Mobile nav */
  var navbtn = document.getElementById('navbtn');
  var nav = document.getElementById('nav');

  if (navbtn && nav) {
    navbtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navbtn.setAttribute('aria-expanded', String(open));
      navbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navbtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Hairline under the sheet header once scrolled */
  var sheet = document.getElementById('sheet');
  var onScroll = function () {
    if (sheet) sheet.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveals, including the self-drawing schematic */
  var items = document.querySelectorAll('.reveal, .draw');

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    items.forEach(function (el, i) {
      if (!el.classList.contains('draw')) {
        el.style.transitionDelay = Math.min(i % 3, 2) * 70 + 'ms';
      }
      io.observe(el);
    });

    /* Stagger the drawing so lines ink in sequence rather than all at once */
    var strokes = document.querySelectorAll('.draw__svg .dbox, .draw__svg .dl');
    strokes.forEach(function (s, i) {
      s.style.animationDelay = (i * 22) + 'ms';
    });
  }

  /* Active section in the nav */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
