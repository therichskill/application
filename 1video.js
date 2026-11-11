const WHATSAPP_NUMBER = '918005564525';
const video = document.getElementById('journeyVideo');
const videoThumbnail = document.querySelector('.video-thumbnail');
const watchButton = document.getElementById('watchButton');
const skipButton = document.getElementById('skipButton');
const timerNote = document.getElementById('timerNote');
const interestActions = document.getElementById('interestActions');
const watchedModal = document.getElementById('watchedModal');
const watchedNo = document.getElementById('watchedNo');
const watchedYes = document.getElementById('watchedYes');
let revealTimer;

function getRegistrationDetails() {
  try {
    const registration = JSON.parse(sessionStorage.getItem('webinarRegistration') || '{}');
    return [
      'Webinar Registration',
      `Name: ${registration.name || ''}`,
      `Mobile: ${registration.phone || ''}`,
      `Age: ${registration.age || ''}`,
      `Email: ${registration.email || ''}`,
      `Profession: ${registration.profession || ''}`
    ].join('\n');
  } catch {
    return 'Webinar Registration';
  }
}

function openWhatsApp(message) {
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

watchButton.addEventListener('click', () => {
  video.scrollIntoView({ behavior: 'smooth', block: 'center' });
  video.src = 'https://www.youtube-nocookie.com/embed/tWH1_B8Jekk?autoplay=1&playsinline=1&rel=0';
  video.hidden = false;
  videoThumbnail.hidden = true;
  watchButton.disabled = true;
  timerNote.textContent = 'Video dekhein — 1 minute baad aapke options yahan dikh jayenge.';
  revealTimer = window.setTimeout(() => {
    interestActions.hidden = false;
    timerNote.textContent = 'Ab apna option chunein.';
    interestActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 60_000);
});

skipButton.addEventListener('click', () => openWhatsApp(getRegistrationDetails()));
document.getElementById('interestedButton').addEventListener('click', () => {
  watchedModal.hidden = false;
  watchedYes.focus();
});
watchedNo.addEventListener('click', () => {
  watchedModal.hidden = true;
  document.getElementById('interestedButton').focus();
});
watchedYes.addEventListener('click', () => {
  openWhatsApp(`${getRegistrationDetails()}\n\nI'm Interested`);
});
document.getElementById('notInterestedButton').addEventListener('click', () => {
  window.location.href = 'feedback.html';
});

window.addEventListener('pagehide', () => window.clearTimeout(revealTimer));


// Review carousel: center the first card immediately and animate between cards.
(() => {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.review-card'));
  const dotsWrap = document.getElementById('reviewsDots');
  const prev = document.getElementById('reviewsPrev');
  const next = document.getElementById('reviewsNext');
  if (!cards.length || !dotsWrap || !prev || !next) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0, timer = null, resumeTimer = null;
  const carousel = track.closest('.reviews-carousel');
  const gap = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'review-dot';
    dot.setAttribute('aria-label', `Show review ${index + 1}`);
    dot.addEventListener('click', () => { goTo(index); restartAuto(); });
    dotsWrap.appendChild(dot); return dot;
  });
  function render() {
    const precedingWidth = cards.slice(0, active).reduce((sum, card) => sum + card.offsetWidth + gap(), 0);
    const cardCenter = precedingWidth + cards[active].offsetWidth / 2;
    const offset = carousel.clientWidth / 2 - cardCenter;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === active);
      card.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      if (i === active) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
    });
  }
  function goTo(index) { active = (index + cards.length) % cards.length; render(); }
  function stopAuto() { clearInterval(timer); timer = null; }
  function startAuto() { stopAuto(); if (!reduceMotion) timer = setInterval(() => goTo(active + 1), 4200); }
  function restartAuto() { startAuto(); }
  prev.addEventListener('click', () => { goTo(active - 1); restartAuto(); });
  next.addEventListener('click', () => { goTo(active + 1); restartAuto(); });
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(startAuto, 700); });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  window.addEventListener('resize', () => requestAnimationFrame(render));
  render(); requestAnimationFrame(render); startAuto();
})();

// Registration activity popups only use real registrations saved in this browser.
(() => {
  const popup = document.getElementById('registrationToast');
  const close = document.getElementById('registrationToastClose');
  const message = document.getElementById('registrationToastMessage');
  if (!popup || !message || !close) return;
  let hideTimer;
  let cursor = 0;
  function getRegistrations() {
    try { return JSON.parse(localStorage.getItem('webinarRegistrations') || '[]'); }
    catch { return []; }
  }
  function showNext() {
    const list = getRegistrations();
    if (!list.length) return; // Never invent names or fake activity.
    const item = list[cursor % list.length]; cursor++;
    message.textContent = `${item.name} booked a slot`;
    popup.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { popup.hidden = true; }, 3000);
  }
  close.addEventListener('click', () => { popup.hidden = true; clearTimeout(hideTimer); });
  setTimeout(showNext, 1800);
  setInterval(showNext, 9000);
})();

/* ===== PREMIUM FOCUS-ZOOM FAQ ===== */
(() => {
  const faqList = document.querySelector(".faq-list");
  if (!faqList) return;

  const questions = faqList.querySelectorAll(".faq-question");

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = document.getElementById(
        button.getAttribute("aria-controls")
      );
      const item = button.closest(".faq-item");

      if (!answer || !item) return;

      const wasOpen = button.getAttribute("aria-expanded") === "true";

      // Sabhi FAQ answers band karo
      questions.forEach((otherButton) => {
        const otherAnswer = document.getElementById(
          otherButton.getAttribute("aria-controls")
        );
        const otherItem = otherButton.closest(".faq-item");

        otherButton.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.hidden = true;
        if (otherItem) otherItem.classList.remove("is-open");
      });

      if (wasOpen) {
        // Khule FAQ par dobara click: sab normal
        faqList.classList.remove("has-active");
      } else {
        // Selected FAQ open aur zoom-in
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
        item.classList.add("is-open");
        faqList.classList.add("has-active");
      }
    });
  });
})();
