/* ============================================================
   FeroFolio — main.js  (RESPONSIVE EDITION)
   Author : Firdaouss El Ouahabi
   ============================================================ */


/* ── SCROLL REVEAL ──────────────────────────────────────────
   WHY: Animates elements into view as the user scrolls.
   UNCHANGED from original — works on all screen sizes.
   Uses IntersectionObserver (modern, performant, no scroll event).
──────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      el.target.querySelectorAll('.skill-fill').forEach(fill => {
        const w = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = (parseFloat(w) * 100) + '%';
          fill.classList.add('animated');
        }, 200);
      });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-fill').forEach(fill => {
  fill.style.width = '0%';
});
revealEls.forEach(el => revealObserver.observe(el));


/* ── ACTIVE NAV LINK ON SCROLL ──────────────────────────────
   WHY: Highlights the nav link matching the current section.
   UNCHANGED from original — works on all screen sizes.
──────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--accent)';
    }
  });
});


/* ── PROJECT FILTER TABS ────────────────────────────────────
   WHY: Lets visitors filter the project grid by category.
   UNCHANGED from original — works on all screen sizes.
──────────────────────────────────────────────────────────── */
function filterProjects(type, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? 'flex' : 'none';
  });
}
window.filterProjects = filterProjects;


/* ── THEME TOGGLE ───────────────────────────────────────────
   WHY: Switches between dark (default) and light mode.
   UNCHANGED from original — works on all screen sizes.
──────────────────────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const root        = document.documentElement;

const savedTheme = localStorage.getItem('fero-theme');
if (savedTheme === 'light') {
  root.classList.add('light');
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('fero-theme', isLight ? 'light' : 'dark');
});


/* ── HAMBURGER MENU — NEW ───────────────────────────────────
   WHY ADDED: The horizontal nav doesn't fit on screens ≤900px.
   CSS hides the links and shows a hamburger button instead.
   This JS toggles the .open class to reveal the drawer.

   WHAT CHANGED vs original:
   • Entirely new block — original had no mobile nav logic.

   HOW IT WORKS:
   1. Click hamburger → add .open to both button and nav-links.
      CSS transitions max-height 0 → 400px + opacity 0 → 1.
   2. Click a nav link → close drawer automatically (UX: user
      navigated, drawer should close so they see the destination).
   3. Press Escape → close drawer (keyboard accessibility).
   4. Click outside nav area → close drawer.
   5. aria-expanded attribute updated for screen readers.
──────────────────────────────────────────────────────────── */
const menuBtn  = document.getElementById('nav-menu-btn');
const navMenu  = document.getElementById('nav-links');

if (menuBtn && navMenu) {

  // Toggle open/closed on hamburger click
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    // Update ARIA attribute for screen readers
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close drawer when a nav link is clicked
  // WHY: After tapping a link, user is scrolling to a section.
  // Leaving the drawer open obscures the content they want to see.
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close drawer on Escape key (keyboard accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      menuBtn.classList.remove('open');
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus(); // Return focus to trigger element
    }
  });

  // Close drawer when clicking outside the nav area
  // WHY: Tap-outside-to-dismiss is a standard mobile UI pattern.
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      menuBtn.classList.remove('open');
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

}


/* ─ CONTACT FORM — Formspree ─ */
const contactForm  = document.getElementById('contact-form');
const submitBtn    = document.getElementById('submit-btn');
const formSuccess  = document.getElementById('form-success');
const formError    = document.getElementById('form-error');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    formSuccess.style.display = 'none';
    formError.style.display   = 'none';
    submitBtn.textContent     = 'Sending…';
    submitBtn.disabled        = true;

    const endpoint = contactForm.getAttribute('action');

    if (!endpoint || endpoint.includes('YOUR_FORMSPREE_ID')) {
      formError.textContent   = '⚠ Contact form not configured yet. See scripts/main.js for setup instructions.';
      formError.style.display = 'block';
      submitBtn.textContent   = 'Send message →';
      submitBtn.disabled      = false;
      return;
    }

    try {
      const data = new FormData(contactForm);
      const res  = await fetch(endpoint, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        formSuccess.style.display = 'block';
        submitBtn.style.display   = 'none';
      } else {
        const json = await res.json();
        const msg  = json.errors
          ? json.errors.map(e => e.message).join(', ')
          : 'Something went wrong. Please try again.';
        formError.textContent   = '✗ ' + msg;
        formError.style.display = 'block';
        submitBtn.textContent   = 'Send message →';
        submitBtn.disabled      = false;
      }
    } catch (_) {
      formError.textContent   = '✗ Network error. Please check your connection and try again.';
      formError.style.display = 'block';
      submitBtn.textContent   = 'Send message →';
      submitBtn.disabled      = false;
    }
  });
}
