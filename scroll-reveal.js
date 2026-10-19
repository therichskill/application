(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('main > section, main > .countdown, .hero-copy, .form-card, .reviews-section, .faq-section, .saved-registrations, .journey-actions, .interest-actions, .site-footer');
  if (reduceMotion || !('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-visible')); return; }
  targets.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    if (index % 2 === 1) el.classList.add('reveal-from-top');
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  targets.forEach(el => observer.observe(el));
})();

document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });
