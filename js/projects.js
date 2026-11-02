/* =========================================================
   PROJECTDATA
   - Project 1 (video) en project 2 (A/B-vergelijking via compare) zijn klaar.
   - Projecten met comingSoon: true tonen een "Coming soon"-kaart
     en hebben (nog) geen eigen pagina.
   Een nieuw project toevoegen? Haal comingSoon weg en vul de
   velden in zoals bij project 1.

   layout  → plek in het speelse raster op de homepage
             (l-a, l-b, l-c, l-d, l-e, l-f)
   color   → achtergrondkleur (flame, aqua, lime, cream, onyx)
   ========================================================= */

window.PROJECTS = [
  {
    slug: 'interview-bjorn',
    title: 'Bjorn',
    subtitle: 'Een interview met Bjorn',
    category: 'Interview',
    year: '2026',
    duration: '2:32 min',
    color: 'aqua',
    layout: 'l-a',
    video: 'assets/bjorn-interview.mp4?v=2',
    preview: 'assets/bjorn-preview.mp4?v=2',
    cover: 'assets/bjorn-frame.jpg?v=2',
    // Optioneel: vul intro en story in om er meer over te vertellen
    intro: '',
    story: [],
    stats: [],
    gallery: []
  },
  {
    slug: 'teaser-bjorn',
    title: 'Teaser',
    subtitle: 'Twee versies van de teaser voor Bjorn',
    category: 'Teaser',
    year: '2026',
    duration: '0:16 min',
    color: 'flame',
    layout: 'l-b',
    cover: 'assets/teaser-cover.jpg',
    coverPos: '50% 12%',
    // Twee versies met dezelfde beelden en een andere hook.
    // at = seconde in de video waar die tekst in beeld is
    compare: [
      {
        label: 'Versie A', src: 'assets/teaser-1.mp4', poster: 'assets/teaser-a-poster.jpg',
        moments: ['Het is tijd.', 'Dit is zijn verhaal.', 'Bjorn × Muninn Media']
      },
      {
        label: 'Versie B', src: 'assets/teaser-2.mp4', poster: 'assets/teaser-b-poster.jpg',
        moments: ['Binnenkort.', 'Achter het succes.', 'Bjorn']
      }
    ],
    moments: [
      { name: 'Opening', at: 0.6 },
      { name: 'Midden', at: 9 },
      { name: 'Eindbeeld', at: 15 }
    ],
    intro: 'Zelfde beelden, andere woorden. Ik maakte twee versies van de teaser om te vergelijken welke hook het sterkst binnenkomt.',
    story: [],
    stats: [],
    gallery: []
  },
  { slug: 'project-03', title: 'Project 03', category: 'Campagne', color: 'onyx', layout: 'l-c', comingSoon: true },
  { slug: 'project-04', title: 'Project 04', category: 'Strategie', color: 'lime', layout: 'l-d', comingSoon: true },
  { slug: 'project-05', title: 'Project 05', category: 'Content', color: 'cream', layout: 'l-f', comingSoon: true },
  { slug: 'project-06', title: 'Project 06', category: 'Video', color: 'aqua', layout: 'l-e', comingSoon: true }
];
