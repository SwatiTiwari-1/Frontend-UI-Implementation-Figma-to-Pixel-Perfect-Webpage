'use strict';

/* ==========================================================
   Navbar: mobile menu toggle
   ========================================================== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    list.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after choosing a link
  list.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) setOpen(false);
  });

  // Close with Escape and return focus to the toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();

'use strict';

/* ==========================================================
   Recommendations carousel (centre-mode)
   The active slide is centred; its neighbours peek in at both edges.
   ========================================================== */
(() => {
  const track = document.querySelector('.reviews-track');
  const dots = document.querySelectorAll('.slider-dot');
  if (!track || !dots.length) return;

  const viewport = track.parentElement;
  const slides = track.children;
  let currentIndex = 2; // the third slide is active on load (matches the design)

  function updateSlide(index) {
    currentIndex = index;

    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

    // Put the active slide in the middle of the viewport
    const offset = viewport.clientWidth / 2 - slideWidth / 2 - currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateSlide(index));
  });

  // Arrow keys move between slides while a dot has focus
  document.querySelector('.slider-dots').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = e.key === 'ArrowRight'
      ? Math.min(currentIndex + 1, dots.length - 1)
      : Math.max(currentIndex - 1, 0);
    updateSlide(next);
    dots[next].focus();
  });

  window.addEventListener('resize', () => updateSlide(currentIndex));

  // Position without animation first, then enable the transition
  updateSlide(currentIndex);
  requestAnimationFrame(() => track.classList.add('is-ready'));
})();