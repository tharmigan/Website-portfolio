/* =========================================================
   GEDEELDE FUNCTIES — smooth scroll, cursor, navigatie,
   paginaovergangen en scroll-reveals.
   ========================================================= */
gsap.registerPlugin(ScrollTrigger);
if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

const App = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touch: window.matchMedia('(hover: none)').matches,
  lenis: null
};

/* ---------- Tekst splitsen in woorden / letters ---------- */
App.split = (el, { chars = false } = {}) => {
  el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
  const out = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'w__i';
          if (chars) {
            [...part].forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'c';
              c.textContent = ch;
              inner.append(c);
              out.push(c);
            });
          } else {
            inner.textContent = part;
            out.push(inner);
          }
          w.append(inner);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        walk(n);
      }
    });
  };
  walk(el);
  return out;
};

/* ---------- Smooth scroll (Lenis) ---------- */
App.initScroll = () => {
  // Browser mag de scrollpositie niet onthouden: altijd bovenaan beginnen.
  // Via ScrollTrigger, anders zet die het later zelf terug op 'auto'.
  ScrollTrigger.clearScrollMemory('manual');
  if (App.reduced || !window.Lenis) return;
  App.lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  App.lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => App.lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
};

App.scrollTo = (target, immediate = false) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (App.lenis) App.lenis.scrollTo(el, { duration: 1.6, immediate, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
};

// Muisbewegingen hooguit één keer per frame verwerken
// (een snelle muis vuurt honderden events per seconde af)
App.perFrame = (fn) => {
  let last = null;
  let target = null;
  return (e) => {
    if (!last) {
      requestAnimationFrame(() => {
        // Muis is er in de tussentijd al af: niets meer doen (anders blijft iets scheef staan)
        if (target === window || target.matches(':hover')) fn(last);
        last = null;
      });
    }
    last = e;
    target = e.currentTarget;
  };
};

/* ---------- Custom cursor ---------- */
App.initCursor = () => {
  if (App.touch) return;
  const dot = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  const label = ring.querySelector('.cursor__label');
  const both = [dot, ring];
  gsap.set(both, { xPercent: -50, yPercent: -50 });
  // Het puntje staat direct op de muis, alleen de ring loopt iets achter
  const dotX = gsap.quickSetter(dot, 'x', 'px');
  const dotY = gsap.quickSetter(dot, 'y', 'px');
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
  let visible = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
    if (!visible) { visible = true; both.forEach((el) => el.classList.add('is-visible')); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => { visible = false; both.forEach((el) => el.classList.remove('is-visible')); });
  window.addEventListener('mousedown', () => ring.classList.add('is-down'));
  window.addEventListener('mouseup', () => ring.classList.remove('is-down'));

  document.addEventListener('mouseover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const clickable = e.target.closest('a, button, [role="slider"]');
    both.forEach((el) => {
      el.classList.toggle('is-label', !!labelled);
      el.classList.toggle('is-hover', !labelled && !!clickable);
    });
    if (labelled) label.textContent = labelled.dataset.cursor;
  });
};

/* ---------- Magnetische knoppen ---------- */
App.initMagnetic = () => {
  if (App.touch) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('mousemove', App.perFrame((e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    }));
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    });
  });
};

/* ---------- Elementen die meebewegen met de muis ---------- */
App.initDepth = () => {
  if (App.touch || App.reduced) return;
  const items = [...document.querySelectorAll('[data-depth]')].map((el) => ({
    depth: parseFloat(el.dataset.depth),
    x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' })
  }));
  window.addEventListener('mousemove', App.perFrame((e) => {
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    items.forEach((it) => { it.x(mx * it.depth * 60); it.y(my * it.depth * 40); });
  }));
};

/* ---------- Navigatie ---------- */
App.initNav = () => {
  const nav = document.querySelector('[data-nav-bar]');
  if (!nav) return;
  const pill = nav.querySelector('.nav__pill');
  const links = [...nav.querySelectorAll('.nav__link')];
  let active = nav.querySelector('.nav__link.is-current');

  const movePill = (link) => {
    if (!link) { gsap.to(pill, { opacity: 0, duration: 0.3, overwrite: true }); return; }
    gsap.to(pill, { x: link.offsetLeft, width: link.offsetWidth, opacity: 1, duration: 0.6, ease: 'expo.out', overwrite: true });
  };
  links.forEach((l) => l.addEventListener('mouseenter', () => movePill(l)));
  nav.querySelector('.nav__links').addEventListener('mouseleave', () => movePill(active));
  if (active) gsap.delayedCall(0.2, () => movePill(active));

  // Actieve link volgt de sectie in beeld (alleen op dezelfde pagina)
  links.forEach((l) => {
    const hash = l.getAttribute('href');
    if (!hash.startsWith('#')) return;
    const target = document.querySelector(hash);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: 'top center', end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) { active = l; movePill(l); }
        else if (active === l) { active = null; movePill(null); }
      }
    });
  });

  // Kleur van de navigatie past zich aan de sectie eronder aan
  document.querySelectorAll('[data-nav]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 60px', end: 'bottom 60px',
      onToggle: (self) => { if (self.isActive) nav.dataset.theme = sec.dataset.nav; }
    });
  });

  // Verbergen bij naar beneden scrollen, tonen bij omhoog scrollen
  let hidden = false;
  const progress = nav.querySelector('.nav__progress');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      if (progress) gsap.set(progress, { scaleX: self.progress });
      const hide = self.direction === 1 && self.scroll() > 240 && !document.body.classList.contains('menu-open');
      if (hide !== hidden) {
        hidden = hide;
        gsap.to(nav, { yPercent: hide ? -170 : 0, duration: 0.6, ease: 'power3.out' });
      }
    }
  });

  // Mobiel menu
  const menu = document.querySelector('[data-menu]');
  const toggle = nav.querySelector('[data-menu-toggle]');
  if (!menu || !toggle) return;
  const menuLinks = menu.querySelectorAll('a');
  const origin = () => `${window.innerWidth - 50}px 50px`;
  gsap.set(menu, { clipPath: `circle(0px at ${origin()})` });
  const tl = gsap.timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: () => `circle(${Math.hypot(window.innerWidth, window.innerHeight) * 1.1}px at ${origin()})`, duration: 0.9, ease: 'expo.inOut' })
    .from(menuLinks, { yPercent: 60, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'expo.out' }, '-=0.35');

  App.closeMenu = () => {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    tl.reverse();
    App.lenis && App.lenis.start();
  };
  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) return App.closeMenu();
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    tl.play();
    App.lenis && App.lenis.stop();
  });
};

/* ---------- Paginaovergangen ---------- */
App.panel = () => document.querySelector('.transition__panel');

App.hidePanel = () => {
  document.documentElement.classList.remove('is-entering');
  gsap.set(App.panel(), { yPercent: 100 });
};

App.enter = () => {
  const panel = App.panel();
  gsap.set(panel, { yPercent: 0 });
  document.documentElement.classList.remove('is-entering');
  return gsap.to(panel, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.1 });
};

App.leave = (href) => {
  gsap.fromTo(App.panel(), { yPercent: 100 }, {
    yPercent: 0, duration: 0.7, ease: 'expo.inOut',
    onComplete: () => { window.location.href = href; }
  });
};

App.initLinks = () => {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (/^(mailto|tel):/.test(href)) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;

    const samePage = url.pathname === location.pathname && url.search === location.search;
    e.preventDefault();
    if (samePage && url.hash) {
      App.closeMenu && App.closeMenu();
      App.scrollTo(url.hash);
    } else {
      App.leave(url.href);
    }
  });

  // Terugknop van de browser (bfcache): paneel weer weghalen
  window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(App.panel(), { yPercent: 100 }); });
};

/* ---------- Scroll-reveals ---------- */
App.initReveals = () => {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = App.split(el);
    if (App.reduced) return;
    gsap.from(words, {
      yPercent: 110, rotate: 4, duration: 1.1, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  if (App.reduced) return;
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
};

/* ---------- Klok + jaartal in de footer ---------- */
App.initClock = () => {
  const clocks = document.querySelectorAll('[data-clock]');
  const fmt = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' });
  const tick = () => clocks.forEach((c) => { c.textContent = fmt.format(new Date()); });
  tick();
  setInterval(tick, 10000);
  document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = new Date().getFullYear(); });
};

/* ---------- Nog in te vullen tekst: [[...]] wordt gemarkeerd ---------- */
App.todo = (text) => String(text).replace(/\[\[(.+?)\]\]/g, '<mark class="todo">$1</mark>');

/* ---------- Kerngegevens onderaan de pagina (uit projects.js) ---------- */
App.initKern = () => {
  document.querySelectorAll('[data-kern]').forEach((list) => {
    list.innerHTML = (window.KERN || []).map(([k, v]) => `<div><dt>${k}</dt><dd>${App.todo(v)}</dd></div>`).join('');
  });
};

/* ---------- Opstarten ---------- */
App.boot = () => {
  window.__booted = true;
  // Op een telefoon "tik" in plaats van "klik"
  if (App.touch) document.querySelectorAll('[data-touch-text]').forEach((el) => { el.textContent = el.dataset.touchText; });
  App.initScroll();
  App.initCursor();
  App.initMagnetic();
  App.initDepth();
  App.initLinks();
  App.initClock();
  App.initKern();
};

// Na het bouwen van alle pagina-animaties (i.v.m. pinnen en volgorde)
App.finish = () => {
  App.initNav();
  App.initReveals();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
};
