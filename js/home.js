/* =========================================================
   HOMEPAGINA
   ========================================================= */
App.boot();

/* ---------- Projecten renderen vanuit projects.js ---------- */
function renderProjects() {
  const grid = document.querySelector('[data-work-grid]');
  const accent = (p) => `var(--${p.color === 'cream' ? 'cream-2' : p.color})`;
  const num = (i) => `(${String(i + 1).padStart(2, '0')})`;

  grid.innerHTML = PROJECTS.map((p, i) => p.comingSoon ? `
    <div class="project-card project-card--soon ${p.layout} is-${p.color}" data-cursor="Binnenkort" style="--accent: ${accent(p)}">
      <div class="project-card__media">
        <div class="project-card__zoom">
          <div class="soon" aria-hidden="true"><span>Coming</span><span>soon</span></div>
        </div>
        <span class="project-card__badge mono">${p.category}</span>
      </div>
      <div class="project-card__info">
        <span class="mono">${num(i)}</span>
        <h3 class="project-card__title"><span>${p.title}</span></h3>
        <p class="project-card__sub">Binnenkort te zien</p>
      </div>
    </div>` : `
    <a class="project-card ${p.layout}${p.compare ? ' is-ab' : ''}" href="project.html?p=${p.slug}" data-cursor="Bekijk" style="--accent: ${accent(p)}">
      <div class="project-card__media">
        <div class="project-card__zoom">
          <img src="${p.cover}" alt="${p.title}: ${p.subtitle}" loading="lazy"${p.coverPos ? ` style="object-position: ${p.coverPos}"` : ''}>
          ${p.preview ? `<video class="project-card__preview" src="${p.preview}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ''}
          ${p.compare ? `
          <div class="ab" aria-hidden="true">
            <span class="ab__hook ab__hook--a">${p.compare[0].moments[0]}</span>
            <div class="ab__b">
              <img src="${p.cover}" alt="" loading="lazy"${p.coverPos ? ` style="object-position: ${p.coverPos}"` : ''}>
              <span class="ab__hook">${p.compare[1].moments[0]}</span>
            </div>
            <span class="ab__line"></span>
          </div>` : ''}
        </div>
        ${p.compare ? `
        <div class="thumb thumb--ab" aria-hidden="true">
          <span class="ab__chip ab__chip--a mono"><b>A</b>${p.compare[0].label}</span>
          <span class="ab__chip ab__chip--b mono"><b>B</b>${p.compare[1].label}</span>
          <span class="ab__vs">VS</span>
          <span class="thumb__tagline">Zelfde beelden. <em>Andere hook.</em></span>
          <span class="thumb__meta mono">${p.compare.length} versies · ${p.duration}</span>
          <span class="thumb__play">
            <svg viewBox="0 0 200 200"><defs><path id="thumbCircle-${i}" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
              <text><textPath href="#thumbCircle-${i}">VERGELIJK A + B • VERGELIJK A + B • </textPath></text></svg>
            <i>▶</i>
          </span>
        </div>` : p.video ? `
        <div class="thumb" aria-hidden="true">
          <span class="thumb__title">${p.title}</span>
          <span class="thumb__meta mono">${p.category} · ${p.duration}</span>
          <span class="thumb__play">
            <svg viewBox="0 0 200 200"><defs><path id="thumbCircle-${i}" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
              <text><textPath href="#thumbCircle-${i}">BEKIJK DE VIDEO • BEKIJK DE VIDEO • </textPath></text></svg>
            <i>▶</i>
          </span>
        </div>` : ''}
        <span class="project-card__badge mono">${p.category}</span>
        <span class="project-card__arrow" aria-hidden="true">→</span>
      </div>
      <div class="project-card__info">
        <span class="mono">${num(i)}</span>
        <h3 class="project-card__title"><span>${p.title}</span></h3>
        <p class="project-card__sub">${p.subtitle} — ${p.year}</p>
      </div>
    </a>`).join('');
  const pad = (n) => String(n).padStart(2, '0');
  const soonCount = PROJECTS.filter((p) => p.comingSoon).length;
  document.querySelector('[data-project-count]').textContent = pad(PROJECTS.length - soonCount);
  document.querySelector('[data-soon-count]').textContent = pad(soonCount);
}
renderProjects();

/* ---------- Hero ---------- */
const heroTitle = document.querySelector('[data-hero-title]');
const heroChars = App.split(heroTitle, { chars: true });

function buildHeroIntro() {
  const tl = gsap.timeline({ paused: true });
  if (App.reduced) return tl.add(() => heroTitle.classList.add('is-ready'));
  tl.from('.hero__top', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.inOut' }, 0)
    .from(heroChars, { yPercent: 115, duration: 1.2, stagger: 0.03, ease: 'expo.out' }, 0.2)
    .from('.hero__photo img', { scale: 1.6, duration: 1.6, ease: 'expo.out' }, 0.5)
    .from('.hero__photo', { scale: 0, rotate: -90, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 0.5)
    .from('.hero__sticker', { scale: 0, rotate: -120, duration: 1.4, ease: 'elastic.out(1, 0.55)' }, 0.8)
    .from('.hero__lead', { opacity: 0, y: 30, duration: 0.9, ease: 'expo.out' }, 0.8)
    .from('.reel', { y: 60, opacity: 0, rotate: 4, duration: 1.2, ease: 'expo.out' }, 0.9)
    .add(() => {
      heroTitle.classList.add('is-ready');
      gsap.set('.hero__photo, .hero__photo img', { clearProps: 'transform' });
    });
  return tl;
}
const heroIntro = buildHeroIntro();

// Letters die opzij springen voor de muis
function initHeroMouse() {
  if (App.touch || App.reduced) return;
  const chars = heroChars.map((c) => ({
    el: c,
    y: gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3' }),
    r: gsap.quickTo(c, 'rotation', { duration: 0.6, ease: 'power3' })
  }));
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', App.perFrame((e) => {
    if (!heroTitle.classList.contains('is-ready')) return;
    chars.forEach((c) => {
      const r = c.el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const force = Math.max(0, 1 - Math.hypot(dx, dy) / 220);
      c.y(-force * 40);
      c.r(force * (dx > 0 ? -8 : 8));
    });
  }));
  hero.addEventListener('mouseleave', () => chars.forEach((c) => { c.y(0); c.r(0); }));
}
initHeroMouse();

if (!App.reduced) {
  // Sticker draait rustig rond
  gsap.to('.hero__sticker svg', { rotation: 360, duration: 16, repeat: -1, ease: 'none' });
  // Titel schuift weg bij scrollen, regels elk met een eigen snelheid
  gsap.utils.toArray('.hero__line').forEach((line, i) => {
    gsap.to(line, {
      xPercent: i % 2 ? 8 : -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

/* ---------- Cassettespeler met audio ---------- */
function initReel() {
  const reel = document.querySelector('[data-reel]');
  const audio = reel.querySelector('[data-reel-audio]');
  const track = reel.querySelector('[data-reel-track]');
  const fill = reel.querySelector('.reel__fill');
  const knob = reel.querySelector('.reel__knob');
  const time = reel.querySelector('[data-reel-time]');
  const total = reel.querySelector('[data-reel-duration]');
  const btn = reel.querySelector('[data-reel-play]');
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const duration = () => (isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 60);

  const render = () => {
    const p = audio.currentTime / duration();
    fill.style.width = `${p * 100}%`;
    knob.style.left = `${p * 100}%`;
    time.textContent = fmt(audio.currentTime);
    track.setAttribute('aria-valuenow', Math.floor(audio.currentTime));
  };
  audio.addEventListener('loadedmetadata', () => {
    total.textContent = fmt(duration());
    track.setAttribute('aria-valuemax', Math.floor(duration()));
    render();
  });

  // Spoelen draaien mee zolang de audio speelt
  const spin = gsap.to(reel.querySelectorAll('.reel__spool'), { rotation: 360, duration: 2.4, ease: 'none', repeat: -1, paused: true });
  gsap.ticker.add(() => { if (!audio.paused) render(); });

  audio.addEventListener('play', () => {
    reel.classList.add('is-playing');
    btn.setAttribute('aria-label', 'Pauzeren');
    spin.play();
    gsap.to(spin, { timeScale: 1, duration: 0.6 });
  });
  const stopSpin = () => {
    reel.classList.remove('is-playing');
    btn.setAttribute('aria-label', 'Afspelen');
    gsap.to(spin, { timeScale: 0, duration: 0.8, onComplete: () => spin.pause() });
  };
  audio.addEventListener('pause', stopSpin);
  audio.addEventListener('ended', () => { audio.currentTime = 0; render(); });

  btn.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });

  const seekTo = (p) => {
    audio.currentTime = gsap.utils.clamp(0, 1, p) * duration();
    render();
  };
  const seek = (clientX) => {
    const r = track.getBoundingClientRect();
    seekTo((clientX - r.left) / r.width);
  };
  let dragging = false;
  track.addEventListener('pointerdown', (e) => { dragging = true; track.setPointerCapture(e.pointerId); seek(e.clientX); });
  track.addEventListener('pointermove', (e) => { if (dragging) seek(e.clientX); });
  track.addEventListener('pointerup', () => { dragging = false; });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      seekTo(audio.currentTime / duration() + (e.key === 'ArrowRight' ? 0.05 : -0.05));
    }
  });
  render();
}
initReel();

/* ---------- Projectkaarten: onthullen, parallax en 3D-tilt ---------- */
function initCards() {
  gsap.utils.toArray('.project-card').forEach((card) => {
    const media = card.querySelector('.project-card__media');
    const layers = media.querySelectorAll('img, video');
    const soon = card.classList.contains('project-card--soon');

    if (!App.reduced) {
      // Eenmalige onthulling; daarna de clip-path weghalen zodat scrollen licht blijft
      gsap.fromTo(media,
        { clipPath: 'inset(16% 12% 16% 12% round 32px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4, ease: 'expo.out', clearProps: 'clipPath',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
      if (layers.length) {
        gsap.fromTo(layers, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      gsap.from(card.querySelector('.project-card__info'), {
        y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 85%', once: true }
      });
    }

    // Voorbeeldfragment speelt alleen af als je over de kaart beweegt
    const preview = media.querySelector('.project-card__preview');
    if (preview && !App.touch) {
      card.addEventListener('mouseenter', () => { preview.play().catch(() => {}); card.classList.add('is-playing'); });
      card.addEventListener('mouseleave', () => { preview.pause(); card.classList.remove('is-playing'); });
    }

    if (soon || App.touch || App.reduced) return;
    gsap.set(media, { transformPerspective: 1000 });
    const rx = gsap.quickTo(media, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(media, 'rotationY', { duration: 0.8, ease: 'power3' });
    media.addEventListener('mousemove', App.perFrame((e) => {
      const r = media.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 6);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
    }));
    media.addEventListener('mouseleave', () => { rx(0); ry(0); });
  });
}

initCards();

// A/B-kaart: de schuine lijn tussen versie A en B volgt de muis
function initAbCard(card) {
  const media = card.querySelector('.project-card__media');
  const state = { s: 50 };
  const apply = () => media.style.setProperty('--s', `${state.s}%`);
  apply();
  if (App.reduced) return;
  if (App.touch) {
    // Telefoon: de lijn zwaait zelf heen en weer zolang de kaart in beeld is
    const swing = gsap.fromTo(state, { s: 24 }, {
      s: 76, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true, onUpdate: apply
    });
    ScrollTrigger.create({
      trigger: card, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => (self.isActive ? swing.play() : swing.pause())
    });
    return;
  }
  // Bij binnenkomen even laten zien dat het twee versies zijn
  gsap.fromTo(state, { s: 84 }, {
    s: 50, duration: 1.8, ease: 'elastic.out(1, 0.45)', delay: 0.5, onUpdate: apply,
    scrollTrigger: { trigger: card, start: 'top 80%', once: true }
  });
  const sTo = gsap.quickTo(state, 's', { duration: 0.6, ease: 'power3', onUpdate: apply });
  media.addEventListener('mousemove', App.perFrame((e) => {
    const r = media.getBoundingClientRect();
    sTo(gsap.utils.clamp(6, 94, ((e.clientX - r.left) / r.width) * 100));
  }));
  media.addEventListener('mouseleave', () => sTo(50));
}
document.querySelectorAll('.project-card.is-ab').forEach(initAbCard);


/* ---------- Stippellijn + papieren vliegtuigje door de projecten ---------- */
let pathTweens = [];
function buildWorkPath() {
  pathTweens.forEach((t) => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
  pathTweens = [];

  const sec = document.querySelector('.work');
  const svg = sec.querySelector('.work__path');
  const dash = svg.querySelector('.work__dash');
  const start = svg.querySelector('.work__start');
  const plane = sec.querySelector('.work__plane');

  const W = sec.offsetWidth, H = sec.offsetHeight;
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Slingerende lijn van links naar rechts door de sectie
  const top = H * 0.03, bottom = H * 0.97;
  const steps = Math.max(4, Math.round(H / 650));
  const xs = (i) => (i === 0 ? W * 0.1 : i % 2 ? W * 0.9 : W * 0.06);
  let d = `M ${xs(0)} ${top}`;
  for (let i = 1; i <= steps; i++) {
    const y0 = top + ((bottom - top) * (i - 1)) / steps;
    const y1 = top + ((bottom - top) * i) / steps;
    const dy = y1 - y0;
    d += ` C ${xs(i - 1)} ${y0 + dy * 0.65}, ${xs(i)} ${y0 + dy * 0.35}, ${xs(i)} ${y1}`;
  }
  dash.setAttribute('d', d);
  start.setAttribute('cx', xs(0));
  start.setAttribute('cy', top);

  if (App.reduced) return;

  const st = { trigger: sec, start: 'top 70%', end: 'bottom 85%', scrub: 1 };
  pathTweens.push(gsap.fromTo(plane, { opacity: 1 }, {
    opacity: 1, ease: 'none',
    motionPath: { path: dash, align: dash, alignOrigin: [0.5, 0.5], autoRotate: true },
    scrollTrigger: { ...st }
  }));
}
buildWorkPath();

let resizeTimer;
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth === lastWidth) return; // negeer mobiele adresbalk
    lastWidth = window.innerWidth;
    buildWorkPath();
    ScrollTrigger.refresh();
  }, 250);
});
if (document.fonts) document.fonts.ready.then(() => { buildWorkPath(); ScrollTrigger.refresh(); });

/* ---------- Over mij: rode draad ---------- */
if (!App.reduced) {
  gsap.to('.about__thread path', {
    strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { trigger: '.about__statement-wrap', start: 'top 80%', end: 'bottom 30%', scrub: 1 }
  });
}

/* ---------- Over mij: TikTok-telefoon ----------
   Kantelt in 3D mee met de muis. Dubbelklik (of dubbeltik) = hartjesregen,
   net als op TikTok. De hartknop werkt ook. */
function initPhone() {
  const wrap = document.querySelector('[data-phone-wrap]');
  if (!wrap) return;
  const phone = wrap.querySelector('[data-phone]');
  const screen = wrap.querySelector('[data-phone-screen]');
  const likeBtn = wrap.querySelector('[data-like]');
  const heartPath = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 4 4.3 7.3C19.5 16.4 12 21 12 21z';
  const colors = ['#ff683b', '#2cb6dd', '#bcd139', '#fff1d6'];

  const makeHeart = (cls, color) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', cls);
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', heartPath);
    if (color) p.setAttribute('fill', color);
    svg.appendChild(p);
    screen.appendChild(svg);
    return svg;
  };

  const burst = (x, y) => {
    // Groot hart dat kantelt, opploft en weer verdwijnt
    const big = makeHeart('heart-pop');
    gsap.set(big, { left: x, top: y, scale: 0, rotation: gsap.utils.random(-25, 25) });
    gsap.timeline({ onComplete: () => big.remove() })
      .to(big, { scale: 1.15, duration: 0.25, ease: 'back.out(3)' })
      .to(big, { scale: 1, duration: 0.15 })
      .to(big, { y: -120, scale: 0.6, opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.25');
    // Kleine gekleurde hartjes die alle kanten op vliegen
    for (let i = 0; i < 12; i++) {
      const bit = makeHeart('heart-bit', colors[i % colors.length]);
      const a = (Math.PI * 2 * i) / 12 + gsap.utils.random(-0.2, 0.2);
      const d = gsap.utils.random(70, 150);
      gsap.set(bit, { left: x, top: y, scale: gsap.utils.random(0.5, 1.1) });
      gsap.to(bit, {
        x: Math.cos(a) * d, y: Math.sin(a) * d - 40, rotation: gsap.utils.random(-90, 90), opacity: 0,
        duration: gsap.utils.random(0.8, 1.3), ease: 'power3.out', onComplete: () => bit.remove()
      });
    }
    setLiked(true);
  };

  const setLiked = (on) => {
    likeBtn.setAttribute('aria-pressed', String(on));
    gsap.fromTo(likeBtn.querySelector('svg'), { scale: 0.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
  };

  const pos = (e) => {
    const r = screen.getBoundingClientRect();
    return [(e.clientX - r.left) * (screen.offsetWidth / r.width), (e.clientY - r.top) * (screen.offsetHeight / r.height)];
  };
  screen.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) burst(...pos(e)); });
  // Dubbeltik op touch
  let lastTap = 0;
  screen.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch' || e.target.closest('button')) return;
    const now = Date.now();
    if (now - lastTap < 300) burst(...pos(e));
    lastTap = now;
  });
  likeBtn.addEventListener('click', () => {
    const on = likeBtn.getAttribute('aria-pressed') !== 'true';
    if (on) burst(screen.offsetWidth / 2, screen.offsetHeight * 0.45);
    else setLiked(false);
  });

  if (App.reduced) return;
  // Binnenkomen: telefoon draait de sectie in
  gsap.from(phone, {
    rotationY: -35, rotationX: 12, y: 80, opacity: 0, duration: 1.6, ease: 'expo.out',
    scrollTrigger: { trigger: wrap, start: 'top 80%', once: true }
  });
  // 3D-kanteling met de muis
  if (App.touch) return;
  const ry = gsap.quickTo(phone, 'rotationY', { duration: 0.9, ease: 'power3' });
  const rx = gsap.quickTo(phone, 'rotationX', { duration: 0.9, ease: 'power3' });
  wrap.addEventListener('mousemove', App.perFrame((e) => {
    const r = wrap.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * 22);
    rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
  }));
  wrap.addEventListener('mouseleave', () => { rx(0); ry(0); });
}
initPhone();

/* ---------- Over mij: physics-speelveld (Matter.js) ----------
   Woorden vallen naar beneden zodra het veld in beeld komt
   en zijn met de muis op te pakken en rond te gooien. */
function initPit() {
  const pit = document.querySelector('[data-pit]');
  if (!pit || !window.Matter) return;
  const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint, Events } = Matter;

  const words = [
    { t: 'TikTok', c: 'tiktok big' }, { t: '151,9K volgers', c: 'flame big' }, { t: '4,2M likes', c: 'aqua big' },
    { t: 'Trends', c: 'lime' }, { t: 'Algoritme', c: 'cream' }, { t: 'Hooks', c: 'flame' },
    { t: 'Storytelling', c: 'ghost' }, { t: 'Videobewerking', c: 'aqua' }, { t: 'Contentcreatie', c: 'cream' },
    { t: 'Community', c: 'lime' }, { t: 'Branding', c: 'ghost' }, { t: 'Strategie', c: 'flame' },
    { t: 'Campagnes', c: 'cream' }, { t: 'Creative Business', c: 'aqua' }, { t: 'MBO 4 Marketing & Communicatie', c: 'ghost' },
    { t: 'Viral gaan', c: 'lime' }
  ];

  const els = words.map((w) => {
    const el = document.createElement('span');
    el.className = 'pill ' + w.c.split(' ').map((c) => `pill--${c}`).join(' ');
    el.textContent = w.t;
    pit.appendChild(el);
    return el;
  });

  const engine = Engine.create({ gravity: { y: 1.1 } });
  let W = pit.clientWidth, H = pit.clientHeight;
  const T = 200; // dikte van de muren
  const wallOpts = { isStatic: true, restitution: 0.4, friction: 0.6 };
  const floor = Bodies.rectangle(W / 2, H + T / 2, W * 3, T, wallOpts);
  const left = Bodies.rectangle(-T / 2, H / 2, T, H * 4, wallOpts);
  const right = Bodies.rectangle(W + T / 2, H / 2, T, H * 4, wallOpts);
  Composite.add(engine.world, [floor, left, right]);

  const bodies = els.map((el, i) => {
    const w = el.offsetWidth, h = el.offsetHeight;
    const b = Bodies.rectangle(
      gsap.utils.random(w / 2 + 10, Math.max(w / 2 + 12, W - w / 2 - 10)),
      -h - i * 70 - gsap.utils.random(0, 60),
      w, h,
      { chamfer: { radius: h / 2 }, restitution: 0.45, friction: 0.3, frictionAir: 0.012, angle: gsap.utils.random(-0.4, 0.4) }
    );
    b.el = el; b.w = w; b.h = h;
    return b;
  });

  // Muis: oppakken en gooien (niet op touch, zodat scrollen blijft werken)
  if (!App.touch) {
    const mouse = Mouse.create(pit);
    mouse.pixelRatio = 1;
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((ev) => mouse.element.removeEventListener(ev, mouse.mousewheel));
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } } });
    Composite.add(engine.world, mc);
    Events.on(mc, 'startdrag', () => pit.classList.add('is-grabbing'));
    Events.on(mc, 'enddrag', () => pit.classList.remove('is-grabbing'));
  } else {
    // Op touch: tik om alles omhoog te laten springen
    pit.addEventListener('click', () => bodies.forEach((b) => Body.setVelocity(b, { x: gsap.utils.random(-6, 6), y: gsap.utils.random(-18, -10) })));
  }

  let running = false, dropped = false;
  const render = () => {
    if (!running) return;
    Engine.update(engine, 1000 / 60);
    for (const b of bodies) {
      b.el.style.transform = `translate(${b.position.x - b.w / 2}px, ${b.position.y - b.h / 2}px) rotate(${b.angle}rad)`;
    }
  };
  gsap.ticker.add(render);

  ScrollTrigger.create({
    trigger: pit, start: 'top 75%', end: 'bottom top',
    onToggle: (self) => { running = self.isActive; },
    onEnter: () => {
      if (dropped) return;
      dropped = true;
      Composite.add(engine.world, bodies);
      els.forEach((el) => { el.style.visibility = 'visible'; });
    }
  });

  window.addEventListener('resize', () => {
    const nw = pit.clientWidth, nh = pit.clientHeight;
    if (nw === W && nh === H) return;
    W = nw; H = nh;
    Body.setPosition(floor, { x: W / 2, y: H + T / 2 });
    Body.setPosition(left, { x: -T / 2, y: H / 2 });
    Body.setPosition(right, { x: W + T / 2, y: H / 2 });
    bodies.forEach((b) => {
      if (b.position.x > W - b.w / 2 || b.position.y > H) Body.setPosition(b, { x: W / 2, y: 0 });
    });
  });
}
initPit();

/* ---------- Cijfers die optellen (bijv. TikTok-volgers) ---------- */
document.querySelectorAll('[data-count-up]').forEach((el) => {
  const target = parseFloat(el.dataset.countUp);
  const dec = +(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || '';
  const fmt = (v) => v.toFixed(dec).replace('.', ',') + suffix;
  if (App.reduced) { el.textContent = fmt(target); return; }
  const obj = { v: 0 };
  el.textContent = fmt(0);
  gsap.to(obj, {
    v: target, duration: 2, ease: 'power3.out',
    onUpdate: () => { el.textContent = fmt(obj.v); },
    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
  });
});

/* ---------- Werkwijze: kaarten komen kort na elkaar binnen ---------- */
if (!App.reduced) {
  gsap.from('.step', {
    y: 60, rotate: 2, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.steps', start: 'top 92%' }
  });
}

/* ---------- Contact ---------- */
if (!App.reduced) {
  gsap.to('.contact__sticker svg', { rotation: 360, duration: 16, repeat: -1, ease: 'none' });
  gsap.from('.contact__sticker', {
    scale: 0, rotate: -120, duration: 1.4, ease: 'elastic.out(1, 0.55)',
    scrollTrigger: { trigger: '.contact__title', start: 'top 80%' }
  });
  // Grote naam onderaan schuift mee met het scrollen
  gsap.fromTo('.footer__mark', { xPercent: 6 }, {
    xPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });
}

/* ---------- Contact: jij + ik = ... en samenwerk-knop ---------- */
function initRotator() {
  const words = [...document.querySelectorAll('[data-rotator] > span')];
  if (words.length < 2 || App.reduced) return;
  let i = 0;
  setInterval(() => {
    const cur = words[i];
    i = (i + 1) % words.length;
    gsap.to(cur, { yPercent: -110, duration: 0.7, ease: 'expo.inOut' });
    gsap.fromTo(words[i], { yPercent: 110, y: 0 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
  }, 2000);
  gsap.set(words, { y: 0, yPercent: 110 });
  gsap.set(words[0], { yPercent: 0 });
}
initRotator();

if (!App.reduced) {
  gsap.from('[data-contact-line]', {
    yPercent: 60, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 85%', once: true }
  });
}

function initCollab() {
  const chips = [...document.querySelectorAll('.collab__chip')];
  const cta = document.querySelector('[data-collab-cta]');
  const label = document.querySelector('[data-collab-label]');
  if (!cta) return;
  const mail = '765150@student.inholland.nl';

  const update = () => {
    const picked = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.textContent.trim());
    const subject = picked.length ? `Samenwerking: ${picked.join(', ')}` : 'Samenwerking';
    cta.href = `mailto:${mail}?subject=${encodeURIComponent(subject)}`;
    const text = picked.length ? `Samen aan ${picked.length === 1 ? picked[0].toLowerCase() : picked.length + ' dingen'}` : 'Laten we samenwerken';
    if (label.textContent !== text) {
      gsap.fromTo(label, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
      label.textContent = text;
    }
  };
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    gsap.fromTo(chip, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    update();
  }));
  update();
}
initCollab();

/* ---------- Afronden + intro starten ---------- */
App.finish();

function runLoader() {
  const loader = document.querySelector('.loader');
  let skip = !!location.hash || App.reduced;
  try {
    if (sessionStorage.getItem('tk-loaded')) skip = true;
    sessionStorage.setItem('tk-loaded', '1');
  } catch (e) { /* opslag niet beschikbaar */ }

  if (skip) {
    loader.remove();
    return App.enter();
  }
  App.hidePanel();
  const count = { v: 0 };
  const num = loader.querySelector('[data-loader-count]');
  return gsap.timeline()
    .from('.loader__line > span', { yPercent: 110, stagger: 0.1, duration: 1, ease: 'expo.out' })
    .to(count, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(count.v); } }, 0)
    .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.15')
    .add(() => loader.remove());
}

// Met #werk e.d. in de link: daarheen springen en de hash weer weghalen,
// zodat een refresh altijd bovenaan begint
if (location.hash) {
  ScrollTrigger.refresh();
  App.scrollTo(location.hash, true);
  history.replaceState(null, '', location.pathname + location.search);
} else {
  window.scrollTo(0, 0);
  if (App.lenis) App.lenis.scrollTo(0, { immediate: true });
}
const entrance = runLoader();
gsap.delayedCall(Math.max(0, entrance.duration() - 0.55), () => heroIntro.play());
