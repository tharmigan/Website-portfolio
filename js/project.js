/* =========================================================
   PROJECTPAGINA — vult de pagina met data uit projects.js
   via de URL, bijv. project.html?p=brew-and-co
   ========================================================= */
App.boot();

const slug = new URLSearchParams(location.search).get('p');
// Alleen projecten die klaar zijn hebben een pagina
const ready = PROJECTS.filter((p) => !p.comingSoon);
const index = Math.max(0, ready.findIndex((p) => p.slug === slug));
const project = ready[index];
const next = ready.length > 1 ? ready[(index + 1) % ready.length] : null;

const THEMES = {
  flame: { bg: 'var(--flame)', fg: 'var(--onyx)', nav: 'light' },
  aqua: { bg: 'var(--aqua)', fg: 'var(--onyx)', nav: 'light' },
  lime: { bg: 'var(--lime)', fg: 'var(--onyx)', nav: 'light' },
  cream: { bg: 'var(--cream-2)', fg: 'var(--onyx)', nav: 'light' },
  onyx: { bg: 'var(--onyx)', fg: 'var(--cream)', nav: 'dark' }
};

/* ---------- Renderen ---------- */
function renderProject(p) {
  document.title = `${p.title} — Tharmigan Kanapathypillai`;
  const theme = THEMES[p.color] || THEMES.flame;
  const hero = document.querySelector('[data-p-hero]');
  hero.style.setProperty('--pbg', theme.bg);
  hero.style.setProperty('--pfg', theme.fg);
  hero.dataset.nav = theme.nav;
  document.querySelector('[data-nav-bar]').dataset.theme = theme.nav;

  const set = (field, value) => document.querySelectorAll(`[data-field="${field}"]`).forEach((el) => { el.textContent = value; });
  ['title', 'subtitle', 'category', 'year', 'intro'].forEach((f) => set(f, p[f] || ''));

  // Alleen de gegevens tonen die zijn ingevuld
  const meta = [
    ['Type', p.category], ['Jaar', p.year], ['Duur', p.duration],
    ['Klant', p.client], ['Rol', p.role], ['Tools', (p.tools || []).join(', ')]
  ].filter(([, v]) => v);
  document.querySelector('[data-meta]').innerHTML = meta.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join('');

  const story = p.story || [];
  document.querySelector('.p-story').hidden = !p.intro && !story.length;
  document.querySelector('[data-field="intro"]').hidden = !p.intro;

  const cover = document.querySelector('[data-field="cover"]');
  if (p.compare) {
    // Twee versies naast elkaar in plaats van één coverbeeld
    document.querySelector('.p-cover').hidden = true;
    document.querySelector('.p-compare').hidden = false;
    document.querySelectorAll('[data-cmp-screen]').forEach((screen, i) => {
      const version = p.compare[i];
      const video = screen.querySelector('video');
      Object.assign(video, { src: version.src, poster: version.poster });
      video.setAttribute('aria-label', `${p.title}, ${version.label}`);
    });
    const quote = (t) => `<span class="cmp__quote">${t}</span>`;
    document.querySelector('[data-cmp-table]').innerHTML = `
      <div class="cmp__row cmp__row--head mono"><span>Moment</span><span>Versie A</span><span>Versie B</span></div>
      ${(p.moments || []).map((m, i) => `
      <button type="button" class="cmp__row" data-cmp-seek="${m.at}" data-cursor="Bekijk">
        <span class="mono">0${i + 1} ${m.name}</span>${quote(p.compare[0].moments[i])}${quote(p.compare[1].moments[i])}
      </button>`).join('')}`;
  } else if (p.video) {
    const video = document.createElement('video');
    Object.assign(video, { src: p.video, poster: p.cover || '', controls: true, playsInline: true, preload: 'metadata' });
    video.setAttribute('aria-label', p.title);
    cover.parentElement.classList.add('has-video');
    cover.replaceWith(video);
  } else {
    cover.src = p.cover;
    cover.alt = `${p.title}: ${p.subtitle}`;
  }

  document.querySelector('[data-story]').innerHTML = story.map((s, i) => `
    <article class="story-block" data-reveal>
      <div class="story-block__label"><span class="mono">0${i + 1}</span><h3>${s.title}</h3></div>
      <p>${s.text}</p>
    </article>`).join('');

  document.querySelector('.p-stats').hidden = !(p.stats || []).length;
  document.querySelector('.p-gallery').hidden = !(p.gallery || []).length;

  document.querySelector('[data-stats]').innerHTML = (p.stats || []).map((s) => `
    <div class="stat">
      <div class="stat__value"><span data-count="${s.value}">0</span>${s.suffix}</div>
      <p class="stat__label">${s.label}</p>
    </div>`).join('');

  document.querySelector('[data-gallery]').innerHTML = (p.gallery || []).map((src, i) => `
    <figure class="g-item"><img src="${src}" alt="${p.title}, beeld ${i + 1}" loading="lazy"></figure>`).join('');

  const nextLink = document.querySelector('[data-next-link]');
  if (next) {
    nextLink.href = `project.html?p=${next.slug}`;
    document.querySelector('[data-next-title]').textContent = next.title;
    document.querySelector('[data-next-cat]').textContent = `${next.category} — ${next.year}`;
    document.querySelector('[data-next-img]').src = next.cover || '';
  } else {
    // Nog geen ander project klaar: terug naar het overzicht
    nextLink.href = 'index.html#werk';
    nextLink.dataset.cursor = 'Terug';
    document.querySelector('.p-next > .mono').textContent = 'Meer werk volgt binnenkort';
    document.querySelector('[data-next-title]').textContent = 'Alle projecten';
    document.querySelector('[data-next-cat]').textContent = 'Terug naar het overzicht';
    document.querySelector('.p-next__preview').remove();
  }
}
renderProject(project);

/* ---------- Animaties ---------- */
const titleChars = App.split(document.querySelector('.p-title'), { chars: true });

const intro = gsap.timeline({ paused: true });
if (!App.reduced) {
  intro
    .from(titleChars, { yPercent: 115, rotate: 6, stagger: 0.03, duration: 1.2, ease: 'expo.out' })
    .from('.p-back, .p-hero__cat, .p-subtitle', { y: 24, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, 0.15)
    .from('.p-meta > div', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, 0.3)
    .from('.p-cover__media', { clipPath: 'inset(30% 8% 0% 8% round 32px)', duration: 1.6, ease: 'expo.out' }, 0.3);

  gsap.fromTo('.p-cover__media img', { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.p-cover', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.utils.toArray('.g-item').forEach((item) => {
    gsap.from(item, {
      clipPath: 'inset(20% 10% 20% 10% round 32px)', duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 88%' }
    });
    gsap.fromTo(item.querySelector('img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

// Cijfers tellen op zodra ze in beeld komen
document.querySelectorAll('[data-count]').forEach((el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = String(target).includes('.') ? 1 : 0;
  const obj = { v: App.reduced ? target : 0 };
  el.textContent = obj.v.toFixed(decimals);
  if (App.reduced) return;
  gsap.to(obj, {
    v: target, duration: 2, ease: 'power3.out',
    onUpdate: () => { el.textContent = obj.v.toFixed(decimals).replace('.', ','); },
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* ---------- A/B-vergelijking ---------- */
function initCompare(p) {
  if (!p.compare) return;
  const root = document.querySelector('[data-cmp]');
  const stage = root.querySelector('[data-cmp-stage]');
  const screens = [...root.querySelectorAll('[data-cmp-screen]')];
  const vids = screens.map((s) => s.querySelector('video'));
  const [a, b] = vids;
  const playBtn = root.querySelector('[data-cmp-play]');
  const track = root.querySelector('[data-cmp-track]');
  const fill = root.querySelector('[data-cmp-fill]');
  const timeEl = root.querySelector('[data-cmp-time]');
  const handle = root.querySelector('[data-cmp-handle]');
  const rows = [...root.querySelectorAll('.cmp__row[data-cmp-seek]')];
  const moments = p.moments || [];
  const dur = () => a.duration || 16;
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  // Markeringen op de tijdlijn voor elk tekstmoment
  const marks = moments.map((m) => {
    const mark = document.createElement('button');
    mark.type = 'button';
    mark.className = 'cmp__mark';
    mark.dataset.cmpSeek = m.at;
    mark.setAttribute('aria-label', `Spring naar ${m.name}`);
    track.appendChild(mark);
    return mark;
  });
  const placeMarks = () => marks.forEach((mark, i) => { mark.style.left = `${(moments[i].at / dur()) * 100}%`; });
  placeMarks();
  a.addEventListener('loadedmetadata', placeMarks);

  function render() {
    const t = a.currentTime;
    fill.style.transform = `scaleX(${Math.min(1, t / dur())})`;
    timeEl.textContent = `${fmt(t)} / ${fmt(Math.round(dur()))}`;
    let active = -1;
    moments.forEach((m, i) => { if (t + 0.4 >= m.at) active = i; });
    rows.forEach((r, i) => r.classList.toggle('is-active', i === active));
    marks.forEach((m, i) => m.classList.toggle('is-active', i <= active));
  }

  // A is leidend, B volgt en wordt bijgestuurd als hij afwijkt
  const tick = () => {
    if (Math.abs(b.currentTime - a.currentTime) > 0.15) b.currentTime = a.currentTime;
    render();
  };
  const setPlaying = (on) => {
    root.classList.toggle('is-playing', on);
    playBtn.firstElementChild.textContent = on ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', on ? 'Pauzeren' : 'Afspelen');
    gsap.ticker[on ? 'add' : 'remove'](tick);
  };
  const play = () => {
    root.classList.add('has-started');
    b.currentTime = a.currentTime;
    vids.forEach((v) => v.play().catch(() => {}));
    setPlaying(true);
  };
  const pause = () => { vids.forEach((v) => v.pause()); setPlaying(false); };
  const seek = (t) => { vids.forEach((v) => { v.currentTime = t; }); render(); };
  a.addEventListener('ended', () => { seek(0); play(); });

  // Kies van welke versie je het geluid hoort
  const soundBtns = [...root.querySelectorAll('[data-cmp-sound]')];
  function setSound(i) {
    vids.forEach((v, k) => { v.muted = k !== i; });
    screens.forEach((s, k) => s.classList.toggle('has-sound', k === i));
    soundBtns.forEach((btn) => btn.setAttribute('aria-pressed', String(Number(btn.dataset.cmpSound) === i)));
  }
  soundBtns.forEach((btn) => btn.addEventListener('click', () => setSound(Number(btn.dataset.cmpSound))));

  playBtn.addEventListener('click', () => (a.paused ? play() : pause()));
  root.querySelector('[data-cmp-bigplay]').addEventListener('click', () => {
    // Eerste klik: begin met het geluid van A
    if (root.querySelector('[data-cmp-sound="-1"]').getAttribute('aria-pressed') === 'true') setSound(0);
    play();
  });
  screens.forEach((s, i) => s.addEventListener('click', () => {
    if (stage.dataset.mode !== 'side') return;
    setSound(i);
    if (a.paused) play();
  }));
  root.addEventListener('click', (e) => {
    const target = e.target.closest('[data-cmp-seek]');
    if (!target) return;
    seek(parseFloat(target.dataset.cmpSeek));
    if (a.paused) play();
  });

  // Door de tijdlijn slepen
  const seekFromX = (x) => {
    const r = track.getBoundingClientRect();
    seek(gsap.utils.clamp(0, 1, (x - r.left) / r.width) * dur());
  };
  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.cmp__mark')) return;
    track.setPointerCapture(e.pointerId);
    seekFromX(e.clientX);
    const move = (ev) => seekFromX(ev.clientX);
    track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', () => track.removeEventListener('pointermove', move), { once: true });
  });

  // Schuifmodus: B ligt over A, de hendel bepaalt hoeveel je van B ziet
  const split = { v: 50 };
  const applySplit = () => {
    stage.style.setProperty('--split', `${split.v}%`);
    handle.setAttribute('aria-valuenow', Math.round(split.v));
  };
  applySplit();
  const splitFromX = (x) => {
    const r = stage.getBoundingClientRect();
    gsap.killTweensOf(split);
    split.v = gsap.utils.clamp(0, 100, ((x - r.left) / r.width) * 100);
    applySplit();
  };
  stage.addEventListener('pointerdown', (e) => {
    if (stage.dataset.mode !== 'wipe' || e.target.closest('[data-cmp-bigplay]')) return;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('is-dragging');
    splitFromX(e.clientX);
    const move = (ev) => splitFromX(ev.clientX);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', () => {
      stage.removeEventListener('pointermove', move);
      stage.classList.remove('is-dragging');
    }, { once: true });
  });
  handle.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -5, ArrowRight: 5 }[e.key];
    if (!step) return;
    e.preventDefault();
    split.v = gsap.utils.clamp(0, 100, split.v + step);
    applySplit();
  });

  const modeBtns = [...root.querySelectorAll('[data-cmp-mode]')];
  function setMode(mode) {
    if (stage.dataset.mode === mode) return;
    modeBtns.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.cmpMode === mode)));
    root.dataset.mode = mode;
    const swap = () => {
      stage.dataset.mode = mode;
      ScrollTrigger.refresh();
    };
    if (App.reduced) return swap();
    gsap.timeline()
      .to(stage, { opacity: 0, y: 24, duration: 0.25, ease: 'power2.in', onComplete: swap })
      .to(stage, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
      // Laat de hendel even zien wat hij doet
      .fromTo(split, { v: mode === 'wipe' ? 82 : 50 }, { v: 50, duration: 1.4, ease: 'elastic.out(1, 0.5)', onUpdate: applySplit }, '<');
  }
  modeBtns.forEach((btn) => btn.addEventListener('click', () => setMode(btn.dataset.cmpMode)));

  // Pauzeren als de vergelijking uit beeld scrolt
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !a.paused) pause();
  }).observe(stage);

  if (!App.reduced) {
    gsap.from(screens, {
      yPercent: 18, rotation: (i) => (i ? 7 : -7), opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: stage, start: 'top 85%', once: true },
      clearProps: 'transform,opacity'
    });
    gsap.from('.cmp__vs', {
      scale: 0, rotation: -180, duration: 1.2, ease: 'elastic.out(1, 0.55)', delay: 0.4,
      scrollTrigger: { trigger: stage, start: 'top 85%', once: true }
    });
  }
  render();
}
initCompare(project);

// Voorbeeld van het volgende project volgt de muis
(() => {
  const link = document.querySelector('[data-next-link]');
  const preview = document.querySelector('.p-next__preview');
  if (!preview || App.touch || App.reduced) return;
  gsap.set(preview, { xPercent: -50, yPercent: -50 });
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.7, ease: 'power3' });
  let lastX = 0;
  link.addEventListener('mousemove', App.perFrame((e) => {
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  }));
  link.addEventListener('mouseenter', (e) => {
    gsap.set(preview, { x: e.clientX, y: e.clientY });
    lastX = e.clientX;
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  });
  link.addEventListener('mouseleave', () => gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.4 }));
})();

/* ---------- Afronden ---------- */
App.finish();
window.scrollTo(0, 0);
const enter = App.enter();
gsap.delayedCall(0.45, () => intro.play());
