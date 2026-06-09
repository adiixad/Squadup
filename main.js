/* ═══════════════════════════════════════════════════════
   SQUADUP — main.js
   Handles: navbar scroll, mobile menu, reveal animations,
   counter animation, chat demo loop, floating card tilt
═══════════════════════════════════════════════════════ */

'use strict';

// ── DOM ready ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initRevealObserver();
  initCounterObserver();
  initChatLoop();
  initFloatingCardTilt();
  initCTAForm();
  initSmoothScroll();
  initCursorTrail();
  initRouter();
});


// ══════════════════════════════════════════
// ROUTER — /story navigation
// ══════════════════════════════════════════
function initRouter() {
  // Handle "Read our story" links
  document.querySelectorAll('a[href="/story"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'story.html';
    });
  });

  // Handle back-to-home from story page
  document.querySelectorAll('a[href="/"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  });

  document.querySelectorAll('a[href="/#connect"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html#connect';
    });
  });
}


// ══════════════════════════════════════════
// NAVBAR — scroll state
// ══════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // check on load
}


// ══════════════════════════════════════════
// MOBILE MENU — hamburger toggle
// ══════════════════════════════════════════
function initMobileMenu() {
  const btn   = document.getElementById('navHamburger');
  const menu  = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}


// ══════════════════════════════════════════
// REVEAL — intersection observer
// ══════════════════════════════════════════
function initRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════
// COUNTER — animated number count-up
// ══════════════════════════════════════════
function initCounterObserver() {
  const counters = document.querySelectorAll('.cstat-num[data-target]');
  if (!counters.length) return;

  const formatNum = (n, target) => {
    if (target >= 1000) return Math.round(n).toLocaleString();
    return Math.round(n).toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNum(eased * target, target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════
// CHAT LOOP — live chat demo animation
// ══════════════════════════════════════════
function initChatLoop() {
  const msgEl = document.getElementById('newMsg');
  if (!msgEl) return;

  // Fake message rotation pool
  const messages = [
    { name: 'raidzen', text: 'joining now, let\'s clutch 🔥', avClass: 'av-c' },
    { name: 'frostbyte_', text: 'gg last match 😤 rematch?', avClass: 'av-b' },
    { name: 'Zerova', text: 'squad full — ready when you are', avClass: 'av-c' },
    { name: 'nxght.exe', text: '1v1 me for warmup lmao', avClass: 'av-b' },
    { name: 'arclight99', text: 'loading into lobby 🎮', avClass: 'av-c' },
  ];

  let idx = 0;

  const cycleMessage = () => {
    const msg = messages[idx % messages.length];
    idx++;

    // Fade out
    msgEl.style.opacity = '0';
    msgEl.style.transform = 'translateY(8px)';
    msgEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

    setTimeout(() => {
      // Update content
      const avEl   = msgEl.querySelector('.app-msg-av');
      const nameEl = msgEl.querySelector('.app-msg-name');
      const textEl = msgEl.querySelector('.app-msg-text');

      avEl.className   = `app-msg-av ${msg.avClass}`;
      nameEl.textContent = msg.name;
      textEl.textContent = msg.text;

      // Fade in
      msgEl.style.opacity = '1';
      msgEl.style.transform = 'translateY(0)';
    }, 380);
  };

  // Show first message after a delay
  setTimeout(() => {
    msgEl.style.transition = 'opacity 0.5s ease';
    msgEl.style.opacity = '1';
    setInterval(cycleMessage, 3000);
  }, 1800);
}


// ══════════════════════════════════════════
// FLOATING CARD TILT — hero card 3D effect
// ══════════════════════════════════════════
function initFloatingCardTilt() {
  const card = document.querySelector('.card-mock');
  if (!card) return;

  const parent = document.querySelector('.hero-card-float');
  if (!parent) return;

  const MAX_TILT = 10; // degrees

  const onMouseMove = (e) => {
    const rect = parent.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const rotX =  dy * MAX_TILT;
    const rotY = -dx * MAX_TILT;

    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const onMouseLeave = () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  };

  parent.addEventListener('mousemove', onMouseMove);
  parent.addEventListener('mouseleave', onMouseLeave);
}


// ══════════════════════════════════════════
// CTA FORM — email validation + feedback
// ══════════════════════════════════════════
function initCTAForm() {
  const input = document.querySelector('.cta-input');
  const btn   = document.querySelector('.cta-btn');
  if (!input || !btn) return;

  const originalHTML = btn.innerHTML;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email) {
      shakeElement(input);
      return;
    }
    if (!isValidEmail(email)) {
      shakeElement(input);
      input.style.borderColor = 'rgba(239,68,68,0.5)';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }

    // Success state
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      You're in!
    `;
    btn.style.background = '#4ade80';
    btn.style.color = '#14532d';
    btn.disabled = true;
    input.value = '';
    input.disabled = true;
    input.placeholder = "We'll be in touch 👾";

    // Reset after 5s
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      input.disabled = false;
      input.placeholder = 'your@email.com';
    }, 5000);
  });

  // Enter key submit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}


// ══════════════════════════════════════════
// SMOOTH SCROLL — nav link offsets
// ══════════════════════════════════════════
function initSmoothScroll() {
  const NAV_HEIGHT = 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ══════════════════════════════════════════
// CURSOR TRAIL — subtle cream dot trail
// ══════════════════════════════════════════
function initCursorTrail() {
  // Only on desktop, skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const trail = [];
  const TRAIL_COUNT = 6;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${6 - i * 0.6}px;
      height: ${6 - i * 0.6}px;
      border-radius: 50%;
      background: rgba(200,185,154,${0.35 - i * 0.05});
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      will-change: transform;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: -100, y: -100 });
  }

  let mx = -100, my = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    trail.forEach(t => { t.el.style.opacity = '0'; });
  });
  document.addEventListener('mouseenter', () => {
    trail.forEach(t => { t.el.style.opacity = '1'; });
  });

  const animateTrail = () => {
    let px = mx, py = my;
    trail.forEach((t, i) => {
      const delay = i * 0.18;
      t.x += (px - t.x) * (0.35 - i * 0.04);
      t.y += (py - t.y) * (0.35 - i * 0.04);
      t.el.style.left = `${t.x}px`;
      t.el.style.top  = `${t.y}px`;
      px = t.x;
      py = t.y;
    });
    requestAnimationFrame(animateTrail);
  };

  animateTrail();
}


// ══════════════════════════════════════════
// CSS KEYFRAMES — injected at runtime
// (shake for form validation)
// ══════════════════════════════════════════
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }

  @keyframes slideInMsg {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .app-msg--new.visible {
    animation: slideInMsg 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;
document.head.appendChild(style);
