// ===== SKILLS BOOK INTERACTION =====
let bookCurrentPage = 0;
const bookTotalPages = 3;

function openSkillsBook() {
  const closed = document.getElementById('skills-book-closed');
  const open = document.getElementById('skills-book-open');
  if (!closed || !open) return;

  closed.classList.add('hidden');
  setTimeout(() => {
    open.classList.add('visible');
    open.classList.remove('closing');
    // Reset to first page
    bookGoToPage(0);
  }, 300);
}

function closeSkillsBook() {
  const closed = document.getElementById('skills-book-closed');
  const open = document.getElementById('skills-book-open');
  if (!closed || !open) return;

  open.classList.add('closing');
  setTimeout(() => {
    open.classList.remove('visible', 'closing');
    closed.classList.remove('hidden');
  }, 350);
}

function bookPageNav(direction) {
  const newPage = bookCurrentPage + direction;
  if (newPage < 0 || newPage >= bookTotalPages) return;
  bookGoToPage(newPage);
}

function bookGoToPage(pageIndex) {
  if (pageIndex < 0 || pageIndex >= bookTotalPages) return;

  const pages = document.querySelectorAll('.book-page');
  const dots = document.querySelectorAll('.book-dot');
  const prevBtn = document.getElementById('book-prev');
  const nextBtn = document.getElementById('book-next');
  const oldPage = bookCurrentPage;

  // Determine slide direction
  pages.forEach((page, i) => {
    page.classList.remove('active', 'exit-left');
    if (i === oldPage && i !== pageIndex) {
      // Exiting page slides in the opposite direction
      if (pageIndex > oldPage) {
        page.classList.add('exit-left');
      }
      // If going backward, it just fades via default (translateX(60px))
    }
  });

  // Small delay for the exit to register before entrance
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pages[pageIndex].classList.add('active');
    });
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === pageIndex);
  });

  // Update buttons
  if (prevBtn) prevBtn.disabled = pageIndex === 0;
  if (nextBtn) nextBtn.disabled = pageIndex === bookTotalPages - 1;

  bookCurrentPage = pageIndex;
}

// ===== SPA PAGE NAVIGATION =====
function showPage(pageId) {
  const allPages = document.querySelectorAll('.page');
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;

  // Find current active page
  const currentPage = document.querySelector('.page.active');

  // If clicking on already active page, do nothing
  if (currentPage && currentPage.id === pageId) return;

  // Exit animation on current page
  if (currentPage) {
    currentPage.classList.remove('active');
    currentPage.classList.add('page-exit');

    currentPage.addEventListener('animationend', function handler() {
      currentPage.classList.remove('page-exit');
      currentPage.removeEventListener('animationend', handler);
    });
  }

  // Remove active from all pages (in case)
  allPages.forEach(p => {
    if (p.id !== (currentPage && currentPage.id)) {
      p.classList.remove('active', 'page-exit');
    }
  });

  // Show new page with entrance animation (slight delay for exit)
  setTimeout(() => {
    allPages.forEach(p => p.classList.remove('active', 'page-exit'));
    targetPage.classList.add('active');

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Re-trigger reveal animations on the new page
    targetPage.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
      el.classList.remove('active');
      setTimeout(() => el.classList.add('active'), i * 80);
    });

    // Re-trigger skill bar animations
    targetPage.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = bar.dataset.width;
      }, 200);
    });

    // Re-trigger counter animations
    targetPage.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      el.textContent = '0' + suffix;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 30);
    });

    // Update active nav link styling
    updateActiveNavLink(pageId);
  }, currentPage ? 280 : 0);

  // Close mobile menu if open
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if (navLinks) navLinks.classList.remove('open');
  if (hamburger) hamburger.classList.remove('active');
}

function updateActiveNavLink(pageId) {
  // Map page IDs to nav link text
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = '';
  });
  const pageMap = {
    'home-page': 'Home',
    'skills-page': 'Skills',
    'projects-page': 'Projects',
    'experience-page': 'Experience',
    'education-page': 'Education',
    'contact-page': 'Contact'
  };
  const label = pageMap[pageId];
  if (label) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.textContent.trim() === label) {
        link.style.color = 'var(--neon-blue)';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== SPACE BACKGROUND STARS =====
  function createStars() {
    const layers = [
      { element: '.stars-layer-1', count: 150, maxSize: 3 },
      { element: '.stars-layer-2', count: 100, maxSize: 2 },
      { element: '.stars-layer-3', count: 50, maxSize: 1.5 }
    ];

    layers.forEach(layer => {
      const container = document.querySelector(layer.element);
      if (!container) return;

      for (let i = 0; i < layer.count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * layer.maxSize;
        star.classList.add(
          size < 1 ? 'small' : size < 2 ? 'medium' : 'large'
        );

        // Add some blue stars for variation
        if (Math.random() > 0.85) star.classList.add('blue');

        // Add animations
        if (Math.random() > 0.4) star.classList.add('twinkle');
        if (Math.random() > 0.6) star.classList.add('float');

        // Set animation properties
        star.style.setProperty('--twinkle-duration', (2 + Math.random() * 3) + 's');
        star.style.setProperty('--twinkle-delay', Math.random() * 3 + 's');
        star.style.setProperty('--float-duration', (4 + Math.random() * 4) + 's');
        star.style.setProperty('--float-delay', Math.random() * 4 + 's');

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        container.appendChild(star);
      }
    });
  }
  createStars();

  // ===== TYPING ANIMATION =====
  const taglines = [
    'Building intelligent systems using AI & IoT',
    'Turning real-world problems into smart solutions',
    'Creating ML-powered applications from scratch',
    'Bridging hardware and software with innovation'
  ];
  const taglineEl = document.getElementById('tagline');
  let tagIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = taglines[tagIdx];
    if (!deleting) {
      taglineEl.textContent = current.slice(0, charIdx++);
      if (charIdx > current.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      setTimeout(typeLoop, 60);
    } else {
      taglineEl.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) { deleting = false; tagIdx = (tagIdx + 1) % taglines.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 30);
    }
  }
  typeLoop();

  // ===== NAVBAR =====
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('active'); });
  });

  // ===== CURSOR GLOW =====
  const cursorGlow = document.querySelector('.cursor-glow');
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ===== SCROLL REVEAL (for initial home page) =====
  const revealElements = document.querySelectorAll('.page.active .reveal, .page.active .reveal-left, .page.active .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), i * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  // ===== SKILL BARS =====
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  // ===== PROJECT CARDS =====
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasExpanded = card.classList.contains('expanded');
      document.querySelectorAll('.project-card.expanded').forEach(c => c.classList.remove('expanded'));
      if (!wasExpanded) card.classList.add('expanded');
    });
  });

  // ===== PARTICLES =====
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
      p.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = 10 + Math.random() * 15 + 's';
      if (Math.random() > 0.5) p.style.background = 'var(--neon-purple)';
      particlesContainer.appendChild(p);
    }
  }

  // ===== COUNTER ANIMATION =====
  document.querySelectorAll('.page.active .stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + suffix;
        }, 30);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  // ===== FORM =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ===== SET HOME AS ACTIVE BY DEFAULT + trigger initial reveals =====
  updateActiveNavLink('home-page');
});