/* ================================================================
   KASHISH — MBA FINANCE PORTFOLIO
   script.js  |  GSAP Animations + UI Interactions
   ================================================================ */

/* ---------------------------------------------------------------
   WAIT FOR DOM + GSAP
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. GSAP PLUGIN REGISTRATION
  --------------------------------------------------------------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------------------------------------------------------
     2. FOOTER YEAR
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     3. STICKY NAVBAR — add .scrolled class
  --------------------------------------------------------------- */
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run once on load

  /* ---------------------------------------------------------------
     4. ACTIVE NAV HIGHLIGHT ON SCROLL
  --------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: `-${Math.floor(window.innerHeight * 0.45)}px 0px -${Math.floor(window.innerHeight * 0.45)}px 0px`,
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  /* ---------------------------------------------------------------
     5. HAMBURGER MENU (Mobile)
  --------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksMenu = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------------------------------------------------------------
     6. SCROLL-TO-TOP BUTTON
  --------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------
     7. SKILL BAR ANIMATION (CSS + IntersectionObserver)
  --------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => barObserver.observe(bar));

  /* ---------------------------------------------------------------
     8. CONTACT FORM VALIDATION
  --------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = {
      fname:    { el: form.querySelector('#fname'),    err: form.querySelector('#nameError'),    label: 'Name' },
      femail:   { el: form.querySelector('#femail'),   err: form.querySelector('#emailError'),   label: 'Email' },
      fsubject: { el: form.querySelector('#fsubject'), err: form.querySelector('#subjectError'), label: 'Subject' },
      fmessage: { el: form.querySelector('#fmessage'), err: form.querySelector('#messageError'), label: 'Message' },
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (key) => {
      const { el, err, label } = fields[key];
      const value = el.value.trim();

      if (!value) {
        err.textContent = `${label} is required.`;
        el.classList.add('error');
        return false;
      }

      if (key === 'femail' && !emailRegex.test(value)) {
        err.textContent = 'Please enter a valid email address.';
        el.classList.add('error');
        return false;
      }

      if (key === 'fmessage' && value.length < 15) {
        err.textContent = 'Message must be at least 15 characters.';
        el.classList.add('error');
        return false;
      }

      err.textContent = '';
      el.classList.remove('error');
      return true;
    };

    // Live validation on blur
    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const allValid = Object.keys(fields).map(validateField).every(Boolean);

      if (allValid) {
        const submitBtn = form.querySelector('.form-submit');
        const successEl = document.getElementById('formSuccess');

        // Simulate send
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending…';

        setTimeout(() => {
          form.reset();
          Object.keys(fields).forEach(key => {
            fields[key].el.classList.remove('error');
            fields[key].err.textContent = '';
          });
          successEl.removeAttribute('hidden');
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send Message';

          // Hide success after 4 seconds
          setTimeout(() => successEl.setAttribute('hidden', ''), 4000);

          // GSAP bounce on success message
          if (typeof gsap !== 'undefined') {
            gsap.from(successEl, { y: 10, opacity: 0, duration: 0.4, ease: 'back.out(2)' });
          }
        }, 1200);
      }
    });
  }

  /* ---------------------------------------------------------------
     9. GSAP ANIMATIONS
  --------------------------------------------------------------- */
  if (typeof gsap === 'undefined') {
    // Fallback: show everything if GSAP didn't load
    document.querySelectorAll('.hero-greeting, .hero-name, .hero-tagline, .hero-intro, .hero-cta, .hero-stats, .hero-visual')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  /* ---- 9a. Hero Section Timeline ---- */
  const heroTl = gsap.timeline({ delay: 0.15 });

  heroTl
    .fromTo('.hero-greeting', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
    .from('.hero-name', {
      opacity: 0,
      y: 60,
      skewY: 4,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.3')
    .to('.hero-name', { opacity: 1 }, '<')
    .from('.hero-tagline', { opacity: 0, y: 24, duration: 0.65, ease: 'power3.out' }, '-=0.5')
    .to('.hero-tagline', { opacity: 1 }, '<')
    .from('.hero-intro', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to('.hero-intro', { opacity: 1 }, '<')
    .from('.hero-cta', { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out' }, '-=0.35')
    .to('.hero-cta', { opacity: 1 }, '<')
    .from('.hero-stats', { opacity: 0, y: 14, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .to('.hero-stats', { opacity: 1 }, '<')
    .from('.hero-visual', { opacity: 0, x: 40, duration: 0.9, ease: 'power3.out' }, '-=0.8')
    .to('.hero-visual', { opacity: 1 }, '<');

  /* ---- 9b. Stat pills stagger ---- */
  gsap.from('.stat-pill', {
    opacity: 0,
    y: 12,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(2)',
    delay: 1.6
  });

  /* ---- 9c. About Section ---- */
  gsap.from('.about-avatar-wrap', {
    scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
    opacity: 0, x: -50, duration: 0.9, ease: 'power3.out'
  });
  
  gsap.from('.about-body p', {
    scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
    opacity: 0, y: 24, stagger: 0.15, duration: 0.7, ease: 'power3.out', delay: 0.2
  });
  
  gsap.from('.tag', {
    scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
    opacity: 0, scale: 0.85, stagger: 0.08, duration: 0.5, ease: 'back.out(2)', delay: 0.6
  });

  /* ---- 9d. Skills Cards Stagger ---- */
  gsap.from('.skill-card', {
    scrollTrigger: { trigger: '#skills', start: 'top 75%', once: true },
    opacity: 0, y: 50, rotateX: 8, stagger: 0.15, duration: 0.8, ease: 'power3.out', transformOrigin: 'top center',
    clearProps: 'all'
  });

  /* ---- 9e. Education Cards ---- */
  gsap.from('.edu-card', {
    scrollTrigger: { trigger: '#education', start: 'top 78%', once: true },
    opacity: 0, x: -40, stagger: 0.2, duration: 0.75, ease: 'power3.out',
    clearProps: 'all'
  });

  /* ---- 9f. Project Cards Stagger ---- */
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '#projects', start: 'top 78%', once: true },
    opacity: 0, y: 60, stagger: 0.18, duration: 0.85, ease: 'power4.out',
    clearProps: 'all'
  });

  /* ---- 9g. Achievement Cards ---- */
  gsap.from('.ach-card', {
    scrollTrigger: { trigger: '#achievements', start: 'top 78%', once: true },
    opacity: 0, y: 36, scale: 0.96, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)',
    clearProps: 'all'
  });

  /* ---- 9h. Learning Cards ---- */
  gsap.from('.learn-card', {
    scrollTrigger: { trigger: '#learning', start: 'top 80%', once: true },
    opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: 'power3.out',
    clearProps: 'all'
  });

  /* ---- 9i. Contact Section ---- */
  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
    opacity: 0, x: -40, duration: 0.85, ease: 'power3.out'
  });
  
  gsap.from('.contact-item', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
    opacity: 0, x: -24, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.25,
    clearProps: 'all'
  });
  
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
    opacity: 0, x: 40, duration: 0.85, ease: 'power3.out'
  });

  /* ---- 9j. Section Headers (all) ---- */
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header.querySelector('.section-label'), {
      scrollTrigger: { trigger: header, start: 'top 85%', once: true },
      opacity: 0, y: 12, duration: 0.5, ease: 'power2.out'
    });
    gsap.from(header.querySelector('.section-title'), {
      scrollTrigger: { trigger: header, start: 'top 85%', once: true },
      opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.1
    });
  });

  /* ---- 9k. Hover glow on project & skill cards ---- */
  const hoverCards = document.querySelectorAll('.project-card, .skill-card, .learn-card');

  hoverCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        boxShadow: '0 20px 60px rgba(201,168,76,0.15), 0 4px 20px rgba(0,0,0,0.4)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });

  /* ---- 9l. CTA button magnetic micro-effect ---- */
  const primaryBtns = document.querySelectorAll('.btn-primary, .btn-ghost');

  primaryBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(btn, { x: dx, y: dy, duration: 0.25, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ---- 9m. Footer entrance ---- */
  gsap.from('.footer-inner > *', {
    scrollTrigger: { trigger: 'footer', start: 'top 90%', once: true },
    opacity: 0, y: 16, stagger: 0.1, duration: 0.6, ease: 'power2.out'
  });

  /* ---- 9n. Scroll cue fade ---- */
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '20% top',
    onUpdate: (self) => {
      gsap.set('.scroll-cue', { opacity: 1 - self.progress * 3 });
    }
  });

  /* ---- 9o. Parallax on orbs ---- */
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gsap.set('.orb-1', { y: self.progress * -120 });
      gsap.set('.orb-2', { y: self.progress * 80 });
    }
  });

  /* ---------------------------------------------------------------
     10. SMOOTH SCROLLING (for older browsers lacking CSS support)
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('header').offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

}); // end DOMContentLoaded
