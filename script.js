/* =============================================
   HWC FASHION SCHOOL — Professional JavaScript
   ============================================= */

'use strict';

// ========== PRELOADER ==========
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.add('ready');

    // Trigger visible sections on load
    revealVisibleSections();
  }, 1800);
});

// Show body immediately if preloader missing
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
});


// ========== HERO SLIDESHOW ==========
(function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  const dotsContainer = document.querySelector('.slide-indicators');
  const currentNum = document.getElementById('currentSlideNum');
  const totalNum = document.getElementById('totalSlides');

  if (!slides.length) return;

  let current = 0;
  let timer = null;
  let isTransitioning = false;

  // Update total count
  if (totalNum) {
    totalNum.textContent = String(slides.length).padStart(2, '0');
  }

  // Build indicator dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function getDots() {
    return dotsContainer ? dotsContainer.querySelectorAll('.slide-dot') : [];
  }

  function goTo(index) {
    if (isTransitioning || index === current) return;
    isTransitioning = true;

    slides[current].classList.remove('active');
    getDots()[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    getDots()[current]?.classList.add('active');

    if (currentNum) {
      currentNum.textContent = String(current + 1).padStart(2, '0');
    }

    // Preload next slide
    const next = (current + 1) % slides.length;
    const nextSlide = slides[next];
    if (nextSlide) {
      const bgImg = nextSlide.style.backgroundImage;
      const url = bgImg.slice(5, -2); // strip url('...')
      if (url) {
        const img = new Image();
        img.src = url;
      }
    }

    setTimeout(() => { isTransitioning = false; }, 1500);
  }

  function next() {
    goTo(current + 1);
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(next, 5000);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Pause on hover / touch
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    hero.addEventListener('touchstart', stopTimer, { passive: true });
    hero.addEventListener('touchend', startTimer, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : goTo(current - 1);
      }
    }, { passive: true });
  }

  startTimer();
})();


// ========== NAVBAR SCROLL ==========
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


// ========== MOBILE NAV ==========
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  const body = document.body;
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.5);
      opacity:0;transition:opacity 0.35s ease;backdrop-filter:blur(2px);
    `;
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  }

  function removeOverlay() {
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => { overlay?.remove(); overlay = null; }, 350);
  }

  function openMenu() {
    navLinks.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    createOverlay();
  }

  function closeMenu() {
    navLinks.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    removeOverlay();
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('show') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  }, { passive: true });

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('show')) closeMenu();
  });
})();


// ========== ACTIVE NAV LINK ==========
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id].section, .school-section, .contact-section');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function update() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navbarH = document.querySelector('.navbar')?.offsetHeight || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ========== SCROLL REVEAL ==========
function revealVisibleSections() {
  const elements = document.querySelectorAll('.section, .school-section, .contact-section');
  const windowH = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowH * 0.92 && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    document.querySelectorAll('.section, .school-section, .contact-section').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.section, .school-section, .contact-section').forEach(el => {
    observer.observe(el);
  });
})();


// ========== PORTFOLIO LIGHTBOX ==========
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  if (!lightbox) return;

  const items = Array.from(document.querySelectorAll('.portfolio-item'));
  let currentIndex = 0;

  function open(index) {
    const item = items[index];
    if (!item) return;

    const img = item.querySelector('img');
    const caption = item.querySelector('h4')?.textContent || '';

    lightboxImg.src = img?.src || '';
    lightboxImg.alt = img?.alt || '';
    lightboxCaption.textContent = caption;
    currentIndex = index;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    closeBtn?.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const newIndex = (currentIndex + dir + items.length) % items.length;
    open(newIndex);
  }

  // Open on portfolio item click
  items.forEach((item, i) => {
    const overlay = item.querySelector('.portfolio-overlay');
    if (overlay) {
      overlay.style.cursor = 'pointer';
      overlay.addEventListener('click', () => open(i));
    }

    // Also open on image click
    const img = item.querySelector('.portfolio-img-wrap');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => open(i));
    }
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });

  // Touch swipe in lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });
})();


// ========== BACK TO TOP ==========
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('show', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ========== CONTACT FORM ==========
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.field-error');
    let error = '';

    if (input.required && !input.value.trim()) {
      error = 'This field is required.';
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) error = 'Please enter a valid email.';
    }

    if (group) group.classList.toggle('error', !!error);
    if (errorEl) errorEl.textContent = error;

    return !error;
  }

  // Live validation on blur
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group')?.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all fields
    const fields = form.querySelectorAll('input, textarea, select');
    let valid = true;
    fields.forEach(field => { if (!validateField(field)) valid = false; });
    if (!valid) return;

    // Simulate submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      form.reset();
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      form.querySelectorAll('.field-error').forEach(e => e.textContent = '');

      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1500);
  });
})();


// ========== TOUCH DEVICE FLAG ==========
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.body.classList.add('touch-device');
}