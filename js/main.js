/* ============================================================
   KALVI MINI TUITION — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── 1. HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    // Close when any link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ─── 2. ACTIVE NAV LINK ─── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── 3. SCROLL-TRIGGERED FADE-UP ANIMATIONS ─── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for grouped elements
          const delay = entry.target.dataset.delay || (i * 60);
          setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── 4. BACK-TO-TOP BUTTON ─── */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── 5. STICKY NAVBAR SHADOW ON SCROLL ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(79,70,229,0.15)'
        : '0 2px 16px rgba(79,70,229,0.10)';
    }, { passive: true });
  }

  /* ─── 6. CLASS PILLS FILTER ─── */
  const classPills = document.querySelectorAll('.class-pill[data-class]');
  classPills.forEach(pill => {
    pill.addEventListener('click', () => {
      classPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cls = pill.dataset.class;
      // Filter post/material cards that have data-class attribute
      document.querySelectorAll('[data-class-filter]').forEach(card => {
        const match = !cls || cls === 'all' || card.dataset.classFilter === cls;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ─── 7. SEARCH BAR (client-side keyword highlight) ─── */
  const searchInput = document.getElementById('navSearchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
  }

  /* ─── 8. COOKIE CONSENT BANNER ─── */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('km_cookie_ok')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1800);
    }
    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('km_cookie_ok', '1');
    });
  }

  /* ─── 9. SMOOTH ANCHOR SCROLL (offset for sticky nav) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 68;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── 10. COUNTER ANIMATION (for stats sections) ─── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ─── 11. TICKER PAUSE ON HOVER (handled via CSS, safeguard) ─── */
  // CSS handles this via .ticker:hover { animation-play-state: paused; }

  /* ─── 12. SUBJECT PILL HOVER RIPPLE ─── */
  document.querySelectorAll('.subject-pill, .class-pill').forEach(pill => {
    pill.addEventListener('click', function (e) {
      const rect = pill.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;width:6px;height:6px;background:rgba(255,255,255,0.5);
        border-radius:50%;pointer-events:none;
        left:${e.clientX - rect.left - 3}px;top:${e.clientY - rect.top - 3}px;
        transform:scale(0);animation:ripple-anim 0.5s ease-out forwards;
      `;
      if (getComputedStyle(pill).position === 'static') pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple-anim{to{transform:scale(30);opacity:0;}}';
    document.head.appendChild(s);
  }

  /* ─── 13. CONTACT FORM (basic validation + success toast) ─── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Simulate submission — replace with real fetch() to your backend/FormSubmit
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        showToast('Message sent! We will reply within 24 hours. 📬');
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      }, 1600);
    });
  }

  /* ─── 14. TOAST NOTIFICATION ─── */
  function showToast(message, type = 'success') {
    const existing = document.getElementById('km-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'km-toast';
    toast.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);
      background:${type === 'success' ? '#065f46' : '#7f1d1d'};
      color:#fff;padding:13px 24px;border-radius:12px;font-family:'Nunito',sans-serif;
      font-size:0.9rem;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.2);
      z-index:9999;opacity:0;transition:all 0.35s ease;white-space:nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Expose globally if needed
  window.showToast = showToast;

  /* ─── 15. PDF DOWNLOAD CLICK TRACKING (for AdSense / Analytics) ─── */
  document.querySelectorAll('a[data-pdf], .btn-pdf, a[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', () => {
      const name = link.dataset.pdf || link.href;
      // Google Analytics event (gtag must be loaded on page)
      if (typeof gtag === 'function') {
        gtag('event', 'pdf_download', { file_name: name });
      }
    });
  });

  /* ─── 16. LAZY-LOAD IMAGES ─── */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

});