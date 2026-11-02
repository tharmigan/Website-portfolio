/* =========================================================
   PROJECTDATA
   - Project 1 (video) en project 2 (A/B-vergelijking via compare) zijn klaar.
   - Projecten met comingSoon: true tonen een "Volgt snel"-kaart
     en hebben (nog) geen eigen pagina.
   Een nieuw project toevoegen? Haal comingSoon weg en vul de
   velden in zoals bij project 1.

   layout  → plek in het speelse raster op de homepage
             (l-a, l-b, l-c, l-d, l-e, l-f)
   color   → achtergrondkleur (flame, aqua, lime, cream, onyx)

   Tekst tussen [[ en ]] is nog in te vullen: die wordt op de site
   gemarkeerd. Vervang het (zonder de haken) door de echte tekst.
   ========================================================= */

/* Kerngegevens voor de beoordeling: staan onderaan elke pagina */
window.KERN = [
  ['Student', 'Tharmigan Kanapathypillai'],
  ['Studentnummer', '765150'],
  ['Klas', '1C'],
  ['Opleiding', 'HBO Creative Business'],
  ['Locatie', 'Inholland Rotterdam'],
  ['Module', 'Media Maker 3'],
  ['Onderwijseenheid', 'Sharing Media (2426CB113A)'],
  ['Opdrachtgever', 'Inholland'],
  ['Inleverdatum', '2 november 2026']
];

window.PROJECTS = [
  {
    slug: 'interview-bjorn',
    title: 'Björn',
    subtitle: 'Een interview met Björn Lagendijk',
    category: 'Interview',
    year: '2026',
    duration: '2:32 min',
    client: 'Inholland',
    color: 'aqua',
    layout: 'l-a',
    video: 'assets/bjorn-interview.mp4?v=2',
    preview: 'assets/bjorn-preview.mp4?v=2',
    cover: 'assets/bjorn-frame.jpg?v=2',
    intro: 'Björn Lagendijk vertelt over zijn onderneming Muninn Media en zijn blik op de toekomst van creatief ondernemerschap.',
    // Verantwoording: van losse beelden naar een publicatieklaar eindproduct
    storyLabel: '— Van materiaal naar eindproduct',
    story: [
      { title: 'Kanaal', text: 'Gepubliceerd op mijn portfoliowebsite. Een horizontale video (16:9) past bij de grote videospeler op de pagina en kijkt prettig op een laptop of desktop. Met 2:32 minuten is er ruimte voor Björns verhaal, maar blijft de video kort genoeg om helemaal uit te kijken.' },
      { title: 'Opbouw', text: 'Ik volgde een montagescript met een vaste volgorde:', specs: [
        ['0:00 – 0:06', 'Titelintro op een zwarte achtergrond'],
        ['0:06 – 0:44', 'Gesprek over Björns onderneming en toekomstplannen'],
        ['0:44 – 1:01', 'Zijn verhaal loopt door onder beelden van een presentatie'],
        ['1:01 – 2:20', 'Interview aan tafel, afgewisseld met presentatie- en buitenbeelden'],
        ['2:20 – 2:32', 'Afsluiting met de eindtitel “Inholland Interview”']
      ] },
      { title: 'Bewerking', text: 'Alles is gemonteerd en bewerkt in Adobe Premiere Pro: de montage, het geluid, de titels en de export. Het interview aan tafel is de rode draad. Mediumshots en detailbeelden van zijn handen wisselen elkaar af, en ondersteunende beelden laten zien waar hij over vertelt. Stiltes en zijpaden heb ik eruit geknipt, zodat alleen de kern van zijn verhaal overblijft.' },
      { title: 'Export', text: 'Geëxporteerd volgens de specificaties voor online video:', specs: [
        ['Resolutie', '1920 × 1080 (Full HD)'],
        ['Beeldverhouding', '16:9 (horizontaal)'],
        ['Framerate', '50 fps'],
        ['Bestand', 'MP4, H.264-video'],
        ['Audio', 'AAC stereo, 48 kHz'],
        ['Lengte', '2:32']
      ] },
      { title: 'Controle', text: 'Voor publicatie heb ik de video helemaal teruggekeken op leesbare tekst, goed verstaanbaar geluid en een logische opbouw. De feedback die ik kreeg heb ik verwerkt voordat ik de definitieve versie exporteerde.' },
    ],
    stats: [],
    gallery: []
  },
  {
    slug: 'teaser-bjorn',
    title: 'Teaser',
    subtitle: 'Twee versies van de teaser voor het interview met Björn',
    category: 'Teaser',
    year: '2026',
    duration: '0:16 min',
    client: 'Inholland',
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
    intro: 'Zelfde beelden, andere woorden. Ik maakte twee versies van de teaser om te kiezen welke hook het sterkst binnenkomt.',
    // Verantwoording: van losse beelden naar een publicatieklaar eindproduct
    storyLabel: '— Van materiaal naar eindproduct',
    story: [
      { title: 'Kanaal', text: 'Gepubliceerd op mijn portfoliowebsite, waar je beide versies naast elkaar kunt afspelen en vergelijken. Ik maakte de teaser in het formaat van sociale media: verticaal (9:16) en 16 seconden kort, met de belangrijkste boodschap direct in beeld.' },
      { title: 'Opbouw', text: 'Elke versie heeft dezelfde drie momenten:', specs: [
        ['0:00', 'Hook: de eerste tekst moet de kijker laten stoppen met scrollen'],
        ['± 0:09', 'Midden: maakt nieuwsgierig naar zijn verhaal'],
        ['0:15', 'Eindbeeld: wie het is en waar je het interview ziet']
      ] },
      { title: 'Bewerking', text: 'Gemonteerd in Adobe Premiere Pro. Ik koos de fragmenten waarin Björn het meest uitgesproken en energiek in beeld is, en zette ze in een kort, snel ritme met tekst in beeld. Daaronder staat rechtenvrije muziek met een opbouwend ritme, zodat de spanning groeit naar het eindbeeld. Beide versies hebben precies dezelfde beelden, muziek en lengte; alleen de teksten verschillen.' },
      { title: 'Export', text: 'Geëxporteerd voor verticale sociale media:', specs: [
        ['Resolutie', '1080 × 1920 (Full HD)'],
        ['Beeldverhouding', '9:16 (verticaal)'],
        ['Framerate', '50 fps'],
        ['Bestand', 'MP4, H.264-video'],
        ['Audio', 'AAC stereo, 48 kHz'],
        ['Lengte', '0:16']
      ] },
      { title: 'Keuze', text: 'Versie A werd de definitieve teaser. “Het is tijd.” geeft direct urgentie, terwijl “Binnenkort.” vager blijft. Het eindbeeld van A noemt bovendien Björn én Muninn Media, waardoor de kijker meteen weet over wie en wat het interview gaat.' }
    ],
    stats: [],
    gallery: []
  },
  { slug: 'project-03', title: 'Project 03', category: 'Campagne', color: 'onyx', layout: 'l-c', comingSoon: true },
  { slug: 'project-04', title: 'Project 04', category: 'Strategie', color: 'lime', layout: 'l-d', comingSoon: true },
  { slug: 'project-05', title: 'Project 05', category: 'Content', color: 'cream', layout: 'l-f', comingSoon: true },
  { slug: 'project-06', title: 'Project 06', category: 'Video', color: 'aqua', layout: 'l-e', comingSoon: true }
];
