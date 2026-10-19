const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const countdown = document.getElementById('countdown');
let remainingSeconds = 34 * 60 + 43;

setInterval(() => {
  remainingSeconds = remainingSeconds > 0 ? remainingSeconds - 1 : 34 * 60 + 43;
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(remainingSeconds % 60).padStart(2, '0');
  countdown.textContent = `${minutes}:${seconds}`;
}, 1000);

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!registrationForm.reportValidity()) return;

  const formData = new FormData(registrationForm);
  const registration = Object.fromEntries(formData.entries());
  sessionStorage.setItem('webinarRegistration', JSON.stringify(registration));
  // Save actual submitted registrations in this browser only (static GitHub Pages has no shared database).
  try {
    const key = 'webinarRegistrations';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    const normalizedPhone = String(registration.phone || '').replace(/\D/g, '');
    const exists = saved.some(item => String(item.phone || '').replace(/\D/g, '') === normalizedPhone);
    if (!exists) { saved.push({ name: String(registration.name || '').trim(), phone: registration.phone, email: registration.email, age: registration.age, profession: registration.profession, savedAt: new Date().toISOString() }); localStorage.setItem(key, JSON.stringify(saved.slice(-100))); }
  } catch (error) { console.warn('Could not save registration in this browser.', error); }
  window.location.href = 'video.html';
});


// Review carousel: auto-advances, with the centered card crisp and side cards blurred.
(() => {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.review-card'));
  const dotsWrap = document.getElementById('reviewsDots');
  const prev = document.getElementById('reviewsPrev');
  const next = document.getElementById('reviewsNext');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let timer = null;
  let resumeTimer = null;
  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'review-dot';
    dot.setAttribute('aria-label', `Show review ${index + 1}`);
    dot.addEventListener('click', () => { goTo(index); restartAuto(); });
    dotsWrap.appendChild(dot);
    return dot;
  });
  const carousel = track.closest('.reviews-carousel');
  function render() {
    // Center the selected card using its real pixel position (works on desktop and mobile).
    const centerOffset = (carousel.clientWidth / 2) - (cards[active].offsetLeft + cards[active].offsetWidth / 2);
    track.style.transform = `translateX(${centerOffset}px)`;
    cards.forEach((card, index) => {
      card.classList.toggle('is-active', index === active);
      card.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      if (index === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
  function goTo(index) { active = (index + cards.length) % cards.length; render(); }
  function stopAuto() { window.clearInterval(timer); timer = null; }
  function startAuto() { stopAuto(); if (!reduceMotion) timer = window.setInterval(() => goTo(active + 1), 4200); }
  function restartAuto() { startAuto(); }
  prev.addEventListener('click', () => { goTo(active - 1); restartAuto(); });
  next.addEventListener('click', () => { goTo(active + 1); restartAuto(); });
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', () => { window.clearTimeout(resumeTimer); resumeTimer = window.setTimeout(startAuto, 700); });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  window.addEventListener('resize', () => requestAnimationFrame(render));
  render();
  requestAnimationFrame(render);
  startAuto();
})();

// Accessible FAQ accordion (keyboard-operable native buttons).
document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(!expanded));
    button.querySelector('.faq-icon').textContent = expanded ? '+' : '−';
    if (!expanded) {
      panel.hidden = false;
      panel.style.maxHeight = '0px';
      requestAnimationFrame(() => { panel.style.maxHeight = panel.scrollHeight + 'px'; });
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.maxHeight = '0px'; });
      window.setTimeout(() => { if (button.getAttribute('aria-expanded') === 'false') panel.hidden = true; }, 330);
    }
  });
});

// Render the local-only registration list and notification on the video page.
(() => {
  const list = document.getElementById('registrationNamesList');
  if (!list) return;
  let registrations = [];
  try { registrations = JSON.parse(localStorage.getItem('webinarRegistrations') || '[]'); } catch { registrations = []; }
  if (!registrations.length) return;
  list.replaceChildren();
  registrations.slice().reverse().slice(0, 10).forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry.name || 'Registered participant';
    list.appendChild(li);
  });
})();
