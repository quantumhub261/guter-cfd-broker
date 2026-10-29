(function () {
  "use strict";

  /* Sticky header shadow */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  /* Active nav state via IntersectionObserver (only observes sections that exist on this page) */
  var sectionIds = ['vergleich', 'regulierung', 'kosten'];
  var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navLinks = document.querySelectorAll('.main-nav a');
  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id || a.getAttribute('href') === '/#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* Fade-in on scroll */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Hebel bars animate width when visible (homepage only) */
  var hebelWrap = document.querySelector('.hebel-bar-wrap');
  if (hebelWrap && 'IntersectionObserver' in window) {
    var hebelObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.hebel-bar-fill').forEach(function (bar) {
            var level = parseInt(bar.dataset.level, 10);
            var widths = { 30: 100, 20: 66, 10: 33, 5: 16, 2: 6 };
            bar.style.width = (widths[level] || 0) + '%';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    hebelObserver.observe(hebelWrap);
  }

  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var targetId = a.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var answer = q.nextElementSibling;
      var isOpen = q.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(function (other) {
        other.classList.remove('open');
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
        other.nextElementSibling.style.paddingBottom = '0px';
        other.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        q.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.paddingBottom = '20px';
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();
