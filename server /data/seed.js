/* Auto-generated seed — the ThreadTrace domain data.
   Single source of truth for the REST API. Derived from the prototype. */
/* ThreadTrace prototype — shared mock data.
   One canonical garment passport (Indigo Field Jacket, batch 0042) plus the
   supplier operations ledger. No backend — this is the prototype's source of truth. */
const TT = {};

TT.passport = {
  name: '365 Midweight Hoodie',
  brand: 'PANGAIA',
  season: 'Crocus Purple',
  batch: '0365',
  maker: 'Knitwear atelier',
  makerRole: 'Cut, sew & finish · Portugal',
  serial: 'DPP·PG–365H·CP07',
  slug: '365-midweight-hoodie-crocus-purple',
  honestyPercent: 70,
  checkedCount: 7,
  totalClaims: 10,
  fabricIntro: '100% organic cotton, ring-spun to a 320 GSM midweight loopback, knit and finished in Portugal.',
  careCopy: 'Wash cold at 30°, inside out, and only when it truly needs it — the PPRMINT™ finish keeps it fresh between wears. Line dry, iron low. Repair it and pass it on rather than replacing it.',
  footprintNote: 'The demand this hoodie places on nature, from cotton field to finished garment.',
  sustainNote: 'The hoodie’s headline sustainability metrics.',
  sustainRows: [
    { name: 'Organic cotton', val: '100%', extra: 'OCS certified' },
    { name: 'Rain-fed cotton', val: '~80%', extra: 'brand-modelled' },
    { name: 'Recycled trims', val: '100%', extra: 'trims, labels, thread' },
    { name: 'PPRMINT™ finish', val: 'wash less', extra: 'brand-reported' },
    { name: 'Compostable pack', val: '≤24 wk', extra: 'TIPA®' },
  ],
  componentNote: 'Named supplier and origin per component, down to trims and thread. Gaps shown, never hidden.',

  // C4 Materials Hub / C5 Evidence drawer
  materials: [
    {
      id: 'cotton', name: 'Organic cotton', pct: '100%', pctNum: 100, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Certified organic cotton growers', origin: 'Knit & finished in Portugal',
      process: 'Ring-spun · 320 GSM midweight loopback',
      jargon: '100% OCS-certified organic cotton, ring-spun; 320 g/m² loopback; grown without synthetic pesticides, fertilisers or GMOs · REACH Reg. EC 1907/2006 compliant.',
      plain: '100% organic cotton. Longer, hand-picked fibres make it soft and hard-wearing, and safer on skin.',
      evidence: [
        { title: 'OCS organic content certificate', meta: 'Organic Content Standard', kind: 'cert',
          docType: 'Scope certificate', issuer: 'Organic Content Standard (OCS)', date: '2025',
          method: 'Certifies 100% certified-organic content, traceable through the supply chain. Per the brand’s public material disclosure.',
          hash: null, detail: 'PANGAIA publicly declares the 365 Midweight is 100% OCS-certified organic cotton, 320 GSM, made in Portugal.' },
      ],
    },
    {
      id: 'thread', name: 'Sewing thread', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Stella McCartney supply partners', origin: 'Italy',
      process: 'Recycled or responsibly sourced',
      jargon: 'Thread declared recycled / responsibly sourced; content self-reported, not yet lab-verified.',
      plain: 'The brand says the thread is recycled or responsibly sourced. Not lab checked yet.',
      evidence: [
        { title: 'Supplier declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Self-declaration', issuer: 'PANGAIA', date: '2025-05-20',
          method: 'The brand made this statement itself. It has not been checked independently.',
          hash: null, detail: 'PANGAIA states all trims, labels and threads are recycled or responsibly sourced. No third-party test on file yet, so it stays “Told us”.' },
      ],
    },
    {
      id: 'trims', name: 'Trims & labels', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Stella McCartney supply partners', origin: 'Italy',
      process: 'Recycled paper tag · Algae Ink · recycled cotton string',
      jargon: 'Care labels and hangtag declared recycled; hangtag 100% recycled paper printed with algae-based ink.',
      plain: 'Labels and the hangtag are recycled. The tag is recycled paper printed with algae ink on a recycled cotton string.',
      evidence: [
        { title: 'Supplier declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Self-declaration', issuer: 'PANGAIA', date: '2025-05-20',
          method: 'The brand made this statement itself. It has not been checked independently.',
          hash: null, detail: 'Trims and labels declared recycled or responsibly sourced. Pending third-party confirmation, so it stays “Told us”.' },
      ],
    },
    {
      id: 'finish', name: 'PPRMINT™ finish', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'PANGAIA (proprietary)', origin: 'Applied in Portugal',
      process: 'Peppermint-oil odour-control treatment',
      jargon: 'PPRMINT™: plant-based peppermint-oil antimicrobial / odour-control finish; performance self-reported.',
      plain: 'A natural peppermint oil finish that fights odour so you can wash it less often. Brand-reported.',
      evidence: [
        { title: 'PPRMINT™ technology brief', meta: 'brand tech · PANGAIA', kind: 'decl',
          docType: 'Technology statement', issuer: 'PANGAIA', date: '2025-04-02',
          method: 'Manufacturer description of the finish. Independent wash-durability data not on file here.',
          hash: null, detail: 'Describes a durable peppermint-oil odour-control finish. Verification of longevity claims is pending, so it stays “Told us”.' },
      ],
    },
  ],

  // C6 Story Book
  makerNarrative:
    'The 365 is built to be seasonless — a boxy, midweight hoodie you reach for all year. ' +
    'A natural peppermint (PPRMINT™) finish keeps it fresh so it can be washed less and worn more.',
  makerAside:
    'Fewer washes, longer life. Repair it, pass it on, and when it is truly done the packaging composts.',
  // Editorial chapters — the narrative register (not verified facts). Each carries
  // an honesty mark so a reader can see what's Checked vs simply Told.
  storyChapters: [
    { n: '01', title: 'The fibre', place: 'Certified organic farms', date: '2025', state: 'checked',
      body: 'Grown as organic cotton — no synthetic pesticides, fertilisers or GMOs — then ring-spun to a 320 GSM midweight loopback. Backed by a 100% OCS organic content certificate, so it is Checked.',
      geo: null, photos: 4, audio: { title: 'On organic cotton', duration: '1:32' } },
    { n: '02', title: 'The finish', place: 'Portugal', date: '2025', state: 'told',
      body: 'Treated with PPRMINT™, a plant-based peppermint-oil finish that neutralises odour so the hoodie stays fresher between washes. Performance is brand-reported, so it stays Told us.',
      geo: null, photos: 3, audio: { title: 'How PPRMINT™ works', duration: '1:20' } },
    { n: '03', title: 'The making', place: 'Portugal', date: '2025 · batch 0365', state: 'told',
      body: 'Cut, sewn and finished by a knitwear atelier in Portugal — hooded, with a kangaroo pouch, ribbed cuffs and hem. Workshop details are self-reported.',
      geo: null, photos: 5, audio: null },
    { n: '04', title: 'In your keeping', place: 'Your wardrobe', date: 'ongoing', state: 'notyet',
      body: 'The last chapter is unwritten. Repairs, re-wears and the next owner are added here as they happen. Nothing on file yet.',
      geo: null, photos: 0, audio: null },
  ],
  // Aesthetic story book — the multimedia making-of, told tier by tier from
  // raw fibre (Tier 4) down to finished assembly (Tier 1). Each tier carries a
  // localized spoken-word clip, an artisan video fragment and an interactive
  // process blueprint. Honesty state is inherited from the verified chain.
  storyBook: [
    { num: 4, tier: 'Tier 4', stage: 'Raw fibre', title: 'Where the cotton grows',
      place: 'Söke Plain', region: 'Aegean · Türkiye', date: 'Spring 2025', state: 'checked',
      body: 'Rain-fed organic cotton, hand-picked from a smallholder cooperative on the Aegean plain. No synthetic pesticides and no chemical defoliants — the bolls are left to open on the plant and gathered in three passes as they ripen.',
      audio: { title: '“We read the sky, not the calendar.”', voice: 'Elif Demir · farmer', lang: 'Turkish · subtitled', duration: '1:32' },
      video: { title: 'First-pass hand harvest', duration: '0:48' },
      blueprint: { title: 'Fibre preparation', region: 'Aegean smallholder method', steps: [
        { k: 'Hand-pick', d: 'Bolls picked in three passes as they ripen, keeping the staple length long and unbroken.' },
        { k: 'Sun-cure', d: 'Laid on cloth in open air for five to seven days until moisture falls below 8%.' },
        { k: 'Roller-gin', d: 'Seed separated on a village roller gin — gentler on the fibre than industrial saw-ginning.' },
      ] } },
    { num: 3, tier: 'Tier 3', stage: 'Spinning & finish', title: 'Yarn, spun and scented',
      place: 'Vale do Ave', region: 'Norte · Portugal', date: 'Summer 2025', state: 'told',
      body: 'Ring-spun to a fine, even count, then plied for strength and given the PPRMINT™ peppermint-oil finish — a plant-based treatment the brand reports keeps the hoodie fresher between washes. Performance is self-reported, so this tier stays Told.',
      audio: { title: '“The yarn tells you when it’s ready.”', voice: 'João Pereira · spinner', lang: 'Portuguese · subtitled', duration: '1:11' },
      video: { title: 'Ring-spinning frame, close-up', duration: '0:36' },
      blueprint: { title: 'Yarn formation', region: 'Ave valley spinning', steps: [
        { k: 'Ring-spin', d: 'Carded sliver drawn and twisted into a fine single on the ring frame.' },
        { k: 'Ply & cone', d: 'Two singles plied for balance, then wound onto cones for the knitters.' },
        { k: 'PPRMINT™ bath', d: 'Peppermint-oil finish applied to the yarn to slow odour build-up.' },
      ] } },
    { num: 2, tier: 'Tier 2', stage: 'Knitting', title: 'A 320 GSM loopback',
      place: 'Guimarães', region: 'Norte · Portugal', date: 'Summer 2025', state: 'told',
      body: 'Knitted as a midweight loopback terry on a circular machine — a smooth face with soft looped pile behind. The 320 GSM set gives the hoodie its structured, boxy hand while staying breathable. Mill spec is self-reported.',
      audio: { title: '“A loopback breathes if you let it.”', voice: 'Marta Sousa · knitter', lang: 'Portuguese · subtitled', duration: '0:58' },
      video: { title: 'Terry pile forming on the cylinder', duration: '0:41' },
      blueprint: { title: 'Loopback knit', region: 'Guimarães circular knit', steps: [
        { k: 'Warp loops', d: 'Ground yarn laid as smooth face loops on the outer needle bed.' },
        { k: 'Terry pile', d: 'A second yarn pulled long behind to build the soft looped interior.' },
        { k: 'Set 320 GSM', d: 'Loop length tuned to land the fabric at its midweight 320 grams per square metre.' },
      ] } },
    { num: 1, tier: 'Tier 1', stage: 'Assembly', title: 'Cut, sewn, hooded',
      place: 'Barcelos', region: 'Norte · Portugal', date: 'Autumn 2025 · batch 0365', state: 'checked',
      body: 'Cut from the roll, flatlock-seamed and finished by hand — hood, kangaroo pouch, ribbed cuffs and hem. Assembled by a named atelier and stamped into this passport, so the final tier is Checked.',
      audio: { title: '“The hood is where a garment earns its keep.”', voice: 'Rui Alves · machinist', lang: 'Portuguese · subtitled', duration: '1:04' },
      video: { title: 'Setting the hood by hand', duration: '0:52' },
      blueprint: { title: 'Cut & make', region: 'Barcelos atelier', steps: [
        { k: 'Lay & cut', d: 'Fabric spread in plies and cut to the graded pattern with minimal offcut.' },
        { k: 'Flatlock', d: 'Panels joined with flat seams that sit smooth against the skin.' },
        { k: 'Hood & rib', d: 'Hood set, kangaroo pouch closed, cuffs and hem ribbed and pressed.' },
      ] } },
  ],
  reviews: { rating: '4.7', count: 148, recommend: '91%' },
  communityVoices: [
    { author: 'Verified buyer · XS', date: '2026', body: 'Great fit and super comfortable — love the colour and the boxy shape. True to size.' },
    { author: 'Verified buyer', date: '2026', body: 'Been buying the 365 for years. Soft, holds up wash after wash, and needs washing less often.' },
  ],

  // Community discussion — owners & shoppers talking about this garment and
  // about fashion & sustainability more broadly. Seeds the Story tab thread.
  community: [
    { author: 'Iben B.', date: '1 week ago', topic: 'This garment', body: 'Great fit and super comfortable — love the colour and the boxy shape. True to size in M.' },
    { author: 'mara_k', date: '2 weeks ago', topic: 'Care', body: 'The PPRMINT™ finish is real — I wash mine far less and it still smells fresh. Better for the planet and my water bill.' },
    { author: 'sole_repair', date: '3 weeks ago', topic: 'Repair & reuse', body: 'Small hole at the cuff ribbing. Any tips for mending rib knit without it looking bulky?' },
    { author: 'greenthread', date: '1 month ago', topic: 'Sustainability', body: 'Love that the hangtag is recycled paper with algae ink. Small details, but they add up across a whole line.' },
  ],

  // C7 Circularity Portal
  circularity: [
    { id: 'care', title: 'Care', sub: 'Wash-less habits, symbols & repair — care for it sustainably', state: 'checked' },
    { id: 'repair', title: 'Repair', sub: 'Find a local repairer', state: 'told' },
    { id: 'resale', title: 'Resell', sub: 'List on the ThreadTrace market · passport travels with it', state: 'told' },
    { id: 'recycle', title: 'Recycle / return', sub: 'Compostable packaging · take-back scheme', state: 'notyet' },
  ],
  lifecycle: [
    { label: 'Made', state: 'checked' },
    { label: 'Sold', state: 'checked' },
    { label: 'In use', state: 'checked' },
    { label: 'Repaired', state: 'notyet' },
    { label: 'Next life', state: 'notyet' },
  ],
};

// S2 Operations Ledger
TT.ledger = [
  { garment: '365 Midweight Hoodie', batch: '0365', sku: 'PG-365H', units: 240, honesty: 92, status: 'published', updated: '2d ago', rev: { tag: 2, live: 4, printed: '2026-01' } },
  { garment: 'Clean Eileen Black Crosshatch', batch: '0148', sku: 'NUD-148', units: 180, honesty: 88, status: 'published', updated: '1d ago', rev: { tag: 3, live: 3, printed: '2025-11' } },
  { garment: 'Mother Lover T-Shirt', batch: '0902', sku: 'STM-902', units: 120, honesty: 61, status: 'draft', updated: '5d ago' },
  { garment: 'Falabella Tiny Tote Bag', batch: '3916', sku: 'STM-3916', units: 40, honesty: null, status: 'awaiting', updated: 'today' },
  { garment: 'Campo Leather Sneaker', batch: 'CP05', sku: 'VEJ-CP05', units: 90, honesty: 79, status: 'published', updated: '3d ago', rev: { tag: 1, live: 2, printed: '2025-12' } },
];

TT.STATUS_LABEL = { published: 'Published', draft: 'Draft', awaiting: 'Awaiting data' };
TT.STATUS_TONE = { published: 'verified', draft: 'neutral', awaiting: 'pending' };

// Supplier certifications — textile + sustainability proofs.
TT.certTypes = [
  { id: 'gots',     name: 'GOTS',        full: 'Global Organic Textile Standard', kind: 'textile' },
  { id: 'oekotex',  name: 'OEKO-TEX 100', full: 'Standard 100 · harmful substances', kind: 'textile' },
  { id: 'grs',      name: 'GRS',         full: 'Global Recycled Standard', kind: 'sustainability' },
  { id: 'bluesign', name: 'bluesign®',   full: 'Approved materials & process', kind: 'sustainability' },
  { id: 'iso14001', name: 'ISO 14001',   full: 'Environmental management', kind: 'sustainability' },
  { id: 'fsc',      name: 'FSC',         full: 'Responsible fibre sourcing', kind: 'sustainability' },
];

// cert status: valid | expiring | expired  (mapped to honesty-ish tones in UI)
TT.certs = [
  { id: 'c1', type: 'gots',    ref: 'GT-2291',  issuer: 'Control Union', issued: '2025-02', expires: '2026-08', status: 'valid',    file: 'GOTS-GT-2291.pdf' },
  { id: 'c2', type: 'oekotex', ref: 'SH-0257',  issuer: 'Hohenstein',    issued: '2025-04', expires: '2026-09', status: 'expiring', file: 'OEKOTEX-SH-0257.pdf' },
  { id: 'c3', type: 'grs',     ref: 'GRS-8841', issuer: 'Control Union', issued: '2024-09', expires: '2026-09', status: 'valid',    file: 'GRS-8841.pdf' },
  { id: 'c4', type: 'bluesign',ref: 'BS-13007', issuer: 'bluesign tech', issued: '2024-06', expires: '2026-07', status: 'expiring', file: 'bluesign-13007.pdf' },
  { id: 'c5', type: 'iso14001',ref: 'EN-4420',  issuer: 'SGS',           issued: '2023-05', expires: '2026-05', status: 'expired',  file: 'ISO14001-4420.pdf' },
];
TT.CERT_STATUS = {
  valid:    { label: 'Valid',        tone: 'verified' },
  expiring: { label: 'Expiring soon', tone: 'pending' },
  expired:  { label: 'Expired',      tone: 'alert' },
};

// Certification mapping & standardisation — each certificate mapped to the
// regulatory standards it satisfies, plus overall CE/UKCA/EN/ISO coverage.
TT.certStandards = {
  gots:     ['EU 2018/848', 'EN ISO 14184'],
  oekotex:  ['REACH EC 1907/2006', 'EN ISO 105'],
  grs:      ['ISO 14021'],
  bluesign: ['ISO 14001'],
  iso14001: ['ISO 14001'],
  fsc:      ['EN ISO 38200'],
};
TT.standardsCoverage = [
  { code: 'CE',   label: 'EU conformity',   state: 'checked' },
  { code: 'UKCA', label: 'UK conformity',   state: 'checked' },
  { code: 'EN',   label: 'European Norms',  state: 'checked' },
  { code: 'ISO',  label: 'ISO standards',   state: 'told' },
];

// Base URL a generated product QR resolves to.
TT.qrBase = 'https://threadtrace.app/p/';

// Feature 1 — upstream co-sign lineage (multi-tier supplier trust).
// The child production run inherits the weakest of its parent tokens; pending
// parents can be co-signed by the assembler to lift the whole batch.
TT.lineage = {
  child: { id: 'BATCH·0042', title: 'Indigo Field Jacket', sub: '90 units · AW25', tier: 'Tier 1 · Assembly', maker: 'Atelier Nord' },
  parents: [
    { id: 'TKN·C1', material: 'Organic cotton yarn', supplier: 'Fio Verde Spinning', tier: 'Tier 4 · Spinning', cert: 'GOTS GT-2291', state: 'checked' },
    { id: 'TKN·W2', material: 'Recycled wool top', supplier: 'Biella Lanificio', tier: 'Tier 3 · Mill', cert: 'GRS 8841', state: 'pending' },
    { id: 'TKN·D3', material: 'Natural indigo dye', supplier: 'Casa Tinta', tier: 'Tier 3 · Dyehouse', cert: 'Dyehouse declaration', state: 'pending' },
  ],
};

// Feature — production stage pipeline (business supply-chain view; mirrors the
// desktop console's stage strip). Each stage maps to a supplier + honesty state.
TT.chainStages = [
  { id: 'design',   label: 'Design',       supplier: 'Atelier Nord (in-house)', state: 'checked' },
  { id: 'rawmat',   label: 'Raw material', supplier: 'Fio Verde Spinning',      state: 'checked' },
  { id: 'spinning', label: 'Spinning',     supplier: 'Fio Verde Spinning',      state: 'checked' },
  { id: 'weaving',  label: 'Weaving',      supplier: 'Biella Lanificio',        state: 'told' },
  { id: 'dyeing',   label: 'Dyeing',       supplier: 'Casa Tinta',              state: 'told' },
  { id: 'sampling', label: 'Sampling',     supplier: 'Atelier Nord',            state: 'checked' },
  { id: 'trims',    label: 'Trims',        supplier: 'Tagua Co-op · thread TBD', state: 'notyet' },
  { id: 'mfg',      label: 'Manufacturing', supplier: 'Atelier Nord · Hackney', state: 'checked' },
];

// Feature 2 — adaptive QA calibration presets for on-demand QR embroidery.
// `gap` insets each module (as a fraction of a cell) to counteract textile
// warp/bleed during machine embroidery, protecting downstream scan rates.
TT.substrates = [
  { id: 'denim', label: 'Rigid Denim', warp: '0% warp', gap: 0.0, comp: 'baseline spacing' },
  { id: 'knit', label: 'Stretch Knit', warp: '+15% warp', gap: 0.16, comp: '+15% stitch-boundary' },
  { id: 'wool', label: 'Heavy Pile Wool', warp: '+28% bleed', gap: 0.26, comp: '+28% stitch-boundary' },
];

// Tiered honesty ring — resolves the "oracle problem" at the UI layer by showing,
// concentrically, how far each material's claim actually travelled:
//   Tier 1 · Brand claims        — every material has one (ochre)
//   Tier 2 · Supply chain proof  — named supplier + origin on file (indigo)
//   Tier 3 · Third-party audit   — an independent certificate exists (leaf)
// computeTiers lives in server.js (logic, not seed data)

// Feature — geolocation repair partner routing (static mock; list only). London based.
TT.repairPartners = [
  { name: 'The Mendery', type: 'Independent tailor · seams and hems', distance: '0.4 mi', address: 'Mare Street, Hackney E8', hours: 'Open until 7pm' },
  { name: 'Atelier Nord Repair Depot', type: 'Brand authorised · full garment service', distance: '1.8 mi', address: 'Berwick Street, Soho W1', hours: 'By appointment' },
  { name: 'Sole & Stitch', type: 'Cobbler and hardware replacement', distance: '2.9 mi', address: 'Atlantic Road, Brixton SW9', hours: 'Open until 6pm' },
];

// Feature — machine-readable disassembly blueprint, surfaced only in Recycler mode.
TT.disassembly = {
  fiberMatrix: [
    { material: 'Organic cotton', weightG: 486, pctByWeight: '96.0%', recoveryPath: 'Mechanical recycling · fibre-to-fibre' },
    { material: 'Sewing thread', weightG: 13, pctByWeight: '2.6%', recoveryPath: 'Recycled / responsibly sourced' },
    { material: 'Woven labels & trims', weightG: 7, pctByWeight: '1.4%', recoveryPath: 'Remove before shredding' },
  ],
  dyeComposition: [
    { compound: 'Reactive dye (Crocus Purple)', pctConcentration: '—', hazard: 'REACH-compliant' },
    { compound: 'PPRMINT™ peppermint-oil finish', pctConcentration: 'trace', hazard: 'Plant-based, low' },
  ],
  stitchPath: [
    { step: '01', action: 'Remove woven labels & hangtag', tool: 'Seam ripper', location: 'Neck & side seam' },
    { step: '02', action: 'Unpick ribbed cuffs & hem', tool: 'Seam ripper', location: 'Cuffs & hem' },
    { step: '03', action: 'Separate hood & kangaroo pocket', tool: 'Unpick seams', location: 'Hood / front' },
    { step: '04', action: 'Shred cotton body', tool: 'Mechanical shredder', location: '—' },
  ],
};
TT.recyclerPin = '0000';

// Business service desk — repair, maintenance & refurbishment jobs booked
// against garments. Logging a completed job adds a Checked node to the passport.
TT.serviceTypes = {
  repair:      { label: 'Repair',         tone: 'info',    tint: 'var(--indigo-100)', line: 'var(--indigo-400)' },
  maintenance: { label: 'Maintenance',    tone: 'pending', tint: 'var(--ochre-100)',  line: 'var(--ochre-500)' },
  refurb:      { label: 'Refurbishment',  tone: 'verified',tint: 'var(--leaf-100)',   line: 'var(--leaf-400)' },
};
TT.serviceStatus = {
  new:         { label: 'New request', tone: 'pending',  next: 'in_progress', action: 'Accept job' },
  in_progress: { label: 'In progress', tone: 'info',     next: 'done',        action: 'Mark complete' },
  done:        { label: 'Completed',   tone: 'verified', next: null,          action: null },
};
// Repair intake — a single garment on the repair bench, opened from the Service desk.
TT.repairIntake = {
  pid: 'PID7412', batch: 'BT5412', arrival: '13 Sep 2022', status: 'Ready for Repair',
  flaws: [
    { title: 'Hole in the fabric', count: 2, note: 'Frayed edges near the left chest panel.', x: 34, y: 34 },
    { title: 'Unravelled top stitch', count: null, note: 'Along the right shoulder seam.', x: 68, y: 26 },
    { title: 'Hole in the seam', count: null, note: 'Underarm seam has opened up.', x: 74, y: 44 },
  ],
  materials: [
    { id: 'm1', name: 'Woven 1X1 cms', cost: '20 SEK', comp: 'Cotton 65% · Polyester 35%' },
    { id: 'm2', name: 'Woven 2X2 cms', cost: '30 SEK', comp: 'Cotton 65% · Polyester 35%' },
  ],
  repairTypes: [{ id: 'r1', name: 'Unravelled top stitch' }],
  history: [
    { title: 'Product Identification', date: '22 Jun 2022', by: 'Anne Hill', state: 'done' },
    { title: 'Washing', date: '28 Jun 2022', by: 'Karl Berg', state: 'done' },
    { title: 'Quality inspection', date: '05 Sep 2022', by: 'Anne Hill', state: 'done' },
    { title: 'Repairing', date: 'In progress', by: 'Emil Petersson', state: 'active' },
  ],
};

// Product detail — the desktop "Products" record view.
TT.productDetail = {
  pid: 'PID7412', status: 'Shipped',
  fields: [
    { label: 'Batch Number', value: 'BN0100' },
    { label: 'Style Number & Name', value: '21889 Silk Shirt' },
    { label: 'Division', value: "Women's Wear" },
    { label: 'Size', value: 'XL' },
    { label: 'Color Number & Name', value: '8394 Dark taupe' },
    { label: 'Style Category', value: 'Knit Tops' },
    { label: 'Product Group', value: 'Jersey' },
  ],
  flaws: ['Hole in the fabric', 'Unravelled top stitch', 'Hole in the seam'],
  composition: ['50% Organic Polyester', '50% Organic Cotton'],
  process: [
    { title: 'Product Identification', date: '22 Jun 2022', by: 'Anne Hill' },
    { title: 'Wash', date: '23 Jun 2022', by: 'Michael Wolfe' },
    { title: 'Repair', date: '29 Jun 2022', by: 'Joy Bradley' },
    { title: 'Ship', date: '5 Jul 2022', by: 'Ruth Olson' },
    { title: 'Cost - 315SEK', date: '7 Jul 2022', by: 'Cody Warren' },
  ],
};

TT.serviceJobs = [
  { id: 'SVC-118', garment: 'Indigo Field Jacket', batch: '0042', type: 'repair', issue: 'Torn left cuff seam', owner: 'M. Okafor', requested: 'today', sla: '3 days', status: 'new' },
  { id: 'SVC-117', garment: 'Wool Scarf', batch: '0041', type: 'maintenance', issue: 'Re-proofing & moth treatment', owner: 'Atelier Nord stock', requested: '1d ago', sla: '5 days', status: 'in_progress' },
  { id: 'SVC-115', garment: 'Denim Apron', batch: '0044', type: 'refurb', issue: 'Full re-dye & hardware swap', owner: 'J. Alvarez', requested: '2d ago', sla: '10 days', status: 'in_progress' },
  { id: 'SVC-112', garment: 'Indigo Field Jacket', batch: '0042', type: 'repair', issue: 'Button replacement (corozo ×2)', owner: 'S. Petrova', requested: '4d ago', sla: 'done', status: 'done' },
  { id: 'SVC-109', garment: 'Linen Tote', batch: '0039', type: 'refurb', issue: 'Strap reinforcement & clean', owner: 'Atelier Nord stock', requested: '6d ago', sla: 'done', status: 'done' },
];

// Resale market (peer-to-peer, Vinted-style). Listing a garment hands its
// passport to the next owner on sale, so provenance never resets to zero.
TT.resale = {
  currency: '$',
  retailPrice: 190,
  estLow: 70,
  estHigh: 110,
  conditions: [
    { id: 'new', label: 'New with tags', mult: 0.85 },
    { id: 'excellent', label: 'Excellent', mult: 0.68 },
    { id: 'good', label: 'Good', mult: 0.55 },
    { id: 'worn', label: 'Well worn', mult: 0.4 },
  ],
  marketNote: 'Verified passports resell for ~30% more on average. Buyers pay for proof.',
  boost: 'Passport-verified',
  // Similar live listings — the resale feed. Swatch is a fabric colour token.
  listings: [
    { id: 'l1', title: '365 Midweight Hoodie', size: 'M', price: 96, condition: 'Excellent', seller: 'mara_k', verified: true, likes: 24, swatch: '#8B77B9' },
    { id: 'l2', title: 'Madder Wool Scarf', size: 'OS', price: 62, condition: 'Good', seller: 'east_end_edit', verified: true, likes: 11, swatch: 'var(--madder-500)' },
    { id: 'l3', title: 'Linen Overshirt', size: 'L', price: 74, condition: 'New with tags', seller: 'sonja.re', verified: false, likes: 8, swatch: 'var(--leaf-600)' },
    { id: 'l4', title: 'Raw Denim Trouser', size: '32', price: 96, condition: 'Excellent', seller: 'w.mendery', verified: true, likes: 31, swatch: 'var(--indigo-500)' },
    { id: 'l5', title: '365 Midweight Hoodie', size: 'S', price: 84, condition: 'Good', seller: 'p.oakes', verified: true, likes: 6, swatch: '#6B5A9E' },
    { id: 'l6', title: 'Corozo Knit', size: 'M', price: 54, condition: 'Well worn', seller: 'reloved.uk', verified: false, likes: 4, swatch: 'var(--ochre-500)' },
  ],
};

// Keeper rewards (loyalty). Points come from acts of keeping, not spending.
TT.rewards = {
  points: 320,
  tier: 'Mender',
  nextTier: 'Keeper',
  nextAt: 500,
  history: [
    { action: 'Registered the jacket', pts: 100, date: 'Jan 2026' },
    { action: 'Logged a cold wash streak (6 months)', pts: 60, date: 'Apr 2026' },
    { action: 'Cuff re-dye at The Mendery', pts: 160, date: 'Jun 2026' },
  ],
  earnMore: [
    { action: 'Log a repair', pts: 150 },
    { action: 'Pass it to a new owner', pts: 200 },
    { action: 'Return at end of life', pts: 250 },
  ],
};

// Your data. What ThreadTrace holds about you, split by when it was gathered.
TT.customerData = {
  presale: [
    { item: 'Scan location (city level)', why: 'Counts scans by city so brands see where interest is', on: true },
    { item: 'Device type', why: 'Keeps the passport working well on your phone', on: true },
    { item: 'Pages you viewed before buying', why: 'Shows brands which claims shoppers actually read', on: false },
  ],
  postpurchase: [
    { item: 'Your name and email', why: 'Ties the vault to you so nobody else can claim it', on: true, locked: true },
    { item: 'Care and repair logs', why: 'Builds the jacket\u2019s history and earns you reward points', on: true },
    { item: 'Wear frequency estimates', why: 'Helps the brand design for real use', on: false },
  ],
};

// Transparency Insights tab — sustainability index stats + details accordion.
// Every stat wears an honesty mark, same rules as the rest of the passport.
TT.insights = {
  stats: [
    { value: '100%', state: 'checked', text: 'organic cotton — grown without synthetic pesticides, fertilisers or GMOs.' },
    { value: '320', state: 'checked', text: 'GSM midweight loopback, designed to be worn year-round.' },
    { value: 'PPRMINT™', state: 'told', text: 'peppermint-oil finish lets you wear it more and wash it less. Brand-reported.' },
    { value: '24 wk', state: 'told', text: 'the compostable packaging is designed to break down within, in a compost facility.' },
  ],
  certifiedBy: ['Organic cotton', 'REACH', 'TIPA® compostable'],
  details: [
    { id: 'materials', title: 'Materials and ingredients', body: [
      '100% organic cotton shell, ring-spun to a 320 GSM midweight loopback.',
      'All trims, labels and threads are recycled or responsibly sourced.',
      'Treated with PPRMINT™, a plant-based peppermint-oil odour-control finish.',
      'Hangtag is 100% recycled paper, printed with algae ink on recycled cotton string.',
    ] },
    { id: 'care', title: 'Care', body: [
      'Gentle machine wash cold with similar colours, inside out.',
      'Line dry away from direct sunlight. Do not tumble dry or bleach.',
      'Iron on reverse — never on the print or trims.',
    ] },
    { id: 'recycling', title: 'Recycling and disposal', body: [
      'Built to be worn for years and repaired first.',
      'Product packaging is part bio-based and compostable — discard in a compost facility.',
      'At end of life, return through a take-back scheme for fibre recovery.',
    ] },
  ],
};

// ---- C10 Care instructions (checked — from the brand's care spec, lab-confirmed) ----
TT.passport.care = {
  state: 'checked',
  aside: 'PPRMINT™ keeps it fresher for longer — wash it less often, and only when it truly needs it.',
  items: [
    { id: 'wash', label: 'Gentle wash cold', note: 'Inside out, with like colours' },
    { id: 'nobleach', label: 'No bleach', note: 'Keeps the colour true' },
    { id: 'linedry', label: 'Line dry', note: 'Away from sunlight · no tumble dry' },
    { id: 'ironlow', label: 'Iron on reverse', note: 'Not on the print or trims' },
  ],
  // General sustainable-care habits — apply to any garment, not just this one.
  habits: [
    { id: 'less', title: 'Wash less, wear more', body: 'The biggest footprint is in the laundry, not the making. Air out and spot-clean between wears — most clothes don’t need a full wash.', impact: 'Up to 30% longer garment life' },
    { id: 'cold', title: 'Cold & full loads', body: 'Wash at 30° or below on full loads. Heating water is where most laundry energy goes; cold protects colour and fibre too.', impact: '~60% less energy per wash' },
    { id: 'air', title: 'Skip the tumble dryer', body: 'Line or flat dry whenever you can. Dryers are energy-hungry and the heat breaks fibres down faster.', impact: 'No dryer energy · less pilling' },
    { id: 'micro', title: 'Catch microfibres', body: 'For anything with synthetics, use a filter bag or laundry ball so shed fibres don’t reach waterways.', impact: 'Fewer microplastics released' },
    { id: 'mend', title: 'Mend early', body: 'A loose thread or small hole is a five-minute fix. Repairing before it grows keeps clothes in use and out of landfill.', impact: 'Keeps it in rotation' },
    { id: 'store', title: 'Store it well', body: 'Fold knits, hang structured pieces, keep everything dry and out of direct sun. Good storage prevents most damage.', impact: 'Protects shape & colour' },
  ],
  detergent: 'Use a plant-based, phosphate-free detergent and half the dose the bottle suggests — most people use far too much.',
};

// ---- Sustainability index — headline circularity stats, shown in the Circularity Portal ----
TT.passport.circularStats = [
  { value: '~80%', icon: 'water', state: 'told', text: 'of the cotton is rain-fed, so this hoodie needs far less irrigation than conventional cotton.' },
  { value: '100%', icon: 'recycle', state: 'checked', text: 'of trims, labels and threads are recycled or responsibly sourced — verified against supplier records.' },
  { value: '55%', icon: 'energy', state: 'told', text: 'renewable-energy share modelled across the knit and finish stages in Portugal. Brand-reported.' },
  { value: '24 wk', icon: 'leaf', state: 'told', text: 'the compostable hangtag and packaging are designed to break down within, in a compost facility.' },
  { value: '0', icon: 'micro', state: 'checked', text: 'synthetic microfibres shed in the wash — the shell is 100% natural cotton fibre.' },
  { value: '~30%', icon: 'loop', state: 'told', text: 'higher resale value on average for garments that carry a verified passport into their next life.' },
];

// ---- Your wardrobe — garments the keeper owns, shown in the Vault ----
TT.wardrobe = [
  { id: 'w1', name: '365 Midweight Hoodie', brand: 'PANGAIA', batch: '0365', vault: 'secured', since: '2026-01-12', swatch: '#8B77B9', current: true,
    serial: 'DPP·PG–365H·CP07', material: '100% organic cotton, 320 GSM loopback', care: 'Wash cold 30° · line dry · iron low', story: 'A ring-spun organic-cotton hoodie finished with a peppermint-oil odour-control treatment. The everyday layer this whole passport is built around.', co2: '4.8 kg CO₂e', maker: 'Knitted in Portugal', retail: 190, wears: 34, since2: '2026-01-12' },
  { id: 'w2', name: 'Clean Eileen Black Crosshatch', brand: 'Nudie Jeans', batch: '0148', vault: 'secured', since: '2025-11-03', swatch: '#26242A', passport: 'cleanEileen',
    serial: 'DPP·TT–0148·NUD', material: '100% organic cotton · black crosshatch dry denim', care: 'Wash rarely · cold · inside out', story: 'A high-waist, tapered dry jean in black crosshatch organic denim, cut to fade to its keeper over years of wear. Backed by free repairs for life through the maker.', co2: '9.4 kg CO₂e', maker: 'Woven & sewn in Italy', retail: 220, wears: 61 },
  { id: 'w3', name: 'Mother Lover T-Shirt', brand: 'Stella McCartney', batch: '0902', vault: 'secured', since: '2025-09-21', swatch: '#2B2A2E', passport: 'organicTee',
    serial: 'DPP·TT–0902·STM', material: '100% organic cotton jersey · GOTS-certified', care: 'Dry clean only · wash rarely', story: 'A washed-black organic-cotton tee with a front graphic print and a relaxed crew neck, made responsibly in Italy from GOTS-certified cotton.', co2: '3.4 kg CO₂e', maker: 'Made in Italy', retail: 325, wears: 48 },
  { id: 'w4', name: 'Falabella Tiny Tote Bag', brand: 'Stella McCartney', batch: '3916', vault: 'pending', since: '2026-03-08', swatch: '#8A8B8E', passport: 'rawDenim',
    serial: 'DPP·TT–3916·STM', material: 'Vegan Shaggy Deer · recycled-brass Falabella chain', care: 'Wipe with a soft damp cloth · store in dust bag', story: 'A tiny vegan tote in steel grey, cut from matte Shaggy Deer fabric and framed by the signature Falabella diamond-cut chain. Cruelty-free and made in Italy.', co2: '6.2 kg CO₂e', maker: 'Made in Italy', retail: 775, wears: 9 },
  { id: 'w5', name: 'Campo Leather Sneaker', brand: 'VEJA', batch: 'CP05', vault: 'secured', since: '2025-12-15', swatch: '#E7E4DC', passport: 'merinoBeanie',
    serial: 'DPP·TT–CP05·VEJ', material: 'ChromeFree leather · Amazonian wild-rubber sole', care: 'Wipe clean · air dry · replace laces', story: 'A low-impact leather sneaker in white with black detailing — ChromeFree tanned leather on a wild-rubber sole tapped from the Amazon. Made in Brazil.', co2: '2.1 kg CO₂e', maker: 'Made in Brazil', retail: 130, wears: 22 },
];

// ---- Social impact — labour conditions at the making stage (told/checked mix) ----
TT.passport.social = {
  note: 'Working conditions declared for the Portugal knit atelier where this hoodie is cut, sewn and finished. Wage and safety data verified by audit; the rest is brand-reported.',
  labor: [
    { id: 'wages', label: 'Wages', state: 'checked', value: 'All workers paid a living wage — above the local legal minimum, verified in the latest audit.' },
    { id: 'hours', label: 'Working hours', state: 'checked', value: 'Standard 8-hour days, overtime capped at 2 hours/day and always voluntary and paid.' },
    { id: 'safety', label: 'Health & safety', state: 'told', value: 'Facility maintained to ISO 45001 occupational health & safety guidelines. Brand-reported.' },
    { id: 'freedom', label: 'Freedom of association', state: 'told', value: 'Workers are free to organise and join a union without reprisal. Self-declared.' },
    { id: 'childlabor', label: 'No child or forced labour', state: 'checked', value: 'Age and voluntary-employment checks passed at the last independent social audit.' },
  ],
  audit: { body: 'amfori BSCI', grade: 'B', date: '2025', state: 'told' },
};

/* =====================================================================
   Clean Eileen Black Crosshatch — a SECOND, self-contained passport for
   the Nudie Jeans jean (wardrobe w2). Same shape as TT.passport,
   but every description is written fresh for the jean. Rendered by
   EileenPassportPage; the PANGAIA passport above is untouched.
   ===================================================================== */
TT.cleanEileen = {
  name: 'Clean Eileen Black Crosshatch',
  brand: 'Nudie Jeans',
  season: 'High-waist tapered',
  batch: '0148',
  maker: 'Blue di Genova atelier · Italy',
  makerRole: 'Woven & sewn · Italy',
  serial: 'DPP·TT–0148·NUD',
  slug: 'clean-eileen-black-crosshatch',
  honestyPercent: 82,
  checkedCount: 9,
  totalClaims: 11,
  fabricIntro: '98% organic cotton denim with a 2% plant-based stretch core, woven in Italy into a 12.5 oz black crosshatch twill.',
  careCopy: 'Wash rarely, cold and inside out — dry denim is happiest left alone. Air between wears and spot-clean marks; line dry, never tumble. Every pair comes with free repairs for life through the maker.',
  footprintNote: 'The demand this jean places on nature, from cotton field to finished pair.',
  sustainNote: 'The jean’s headline sustainability metrics.',
  sustainRows: [
    { name: 'Organic cotton', val: '98%', extra: 'GOTS' },
    { name: 'Plant-based stretch', val: 'no elastane', extra: 'compostable core' },
    { name: 'Reduced-water dye', val: '≈75% less', extra: 'mill-reported' },
    { name: 'Repairability', val: 'lifetime', extra: 'free repairs' },
    { name: 'Resale-ready', val: 'passport travels', extra: 'ThreadTrace market' },
  ],
  componentNote: 'Named supplier and origin per component, down to the rivets. Gaps shown, never hidden.',

  materials: [
    {
      id: 'denim', name: 'Organic cotton denim', pct: '98%', pctNum: 98, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Candiani Denim · Italy', origin: 'Woven in Robecchetto, Lombardy',
      process: '12.5 oz ring-spun · black crosshatch weave',
      jargon: '98% GOTS organic cotton, ring-spun warp/weft; 12.5 oz/yd² right-hand crosshatch twill · REACH Reg. EC 1907/2006 compliant.',
      plain: 'Almost all of the jean is organic cotton, woven in Italy into a dense black denim with a distinctive crosshatch grain.',
      evidence: [
        { title: 'Organic content certificate', meta: 'PDF · GOTS', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'ICEA', date: '2025-02-18',
          method: 'Certifier traced the organic chain-of-custody from farm to woven fabric.',
          hash: 'a41c…7f02', detail: 'Confirms the cotton is certified organic and traceable through the supply chain; valid at time of weaving.' },
        { title: '3rd-party fibre test', meta: 'report · TexLab', kind: 'report',
          docType: 'Lab report (PDF)', issuer: 'TexLab Milano', date: '2025-06-30',
          method: 'Quantitative fibre-composition assay on a production cut.',
          hash: 'de90…1b47', detail: 'Independent lab measured the blend directly, confirming 98% cotton / 2% elastane recovery yarn within tolerance.' },
      ],
    },
    {
      id: 'stretch', name: 'Recovery yarn', pct: '2%', pctNum: 2, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Candiani Denim · Italy', origin: 'Robecchetto, Lombardy',
      process: 'Plant-based stretch core (COREVA™-type)',
      jargon: '2% biodegradable plant-based elastomer core in lieu of synthetic elastane; compostable at end of life.',
      plain: 'A tiny amount of plant-based stretch yarn lets the jean move with you — and it breaks down naturally instead of shedding plastic.',
      evidence: [
        { title: 'Biodegradability test', meta: 'report · mill', kind: 'report',
          docType: 'Lab report (PDF)', issuer: 'Candiani R&D', date: '2025-03-04',
          method: 'Soil-burial biodegradation test on the stretch core yarn.',
          hash: '5c22…9a10', detail: 'Shows the plant-based core breaks down under industrial compost conditions; mill-run test, third-party protocol.' },
      ],
    },
    {
      id: 'dye', name: 'Black crosshatch dye', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Candiani dyehouse', origin: 'Italy',
      process: 'Low-sulphur black rope dye · Kitotex® pre-treatment',
      jargon: 'Sulphur-black rope dyeing with chitosan (Kitotex®) sizing to cut water and PVA; effluent treated on-site. Concentrations self-reported.',
      plain: 'The deep black comes from a dyeing process the mill says uses far less water and no PVA plastic sizing. We have the brand’s word, not an outside test yet.',
      evidence: [
        { title: 'Process declaration', meta: 'self-reported · mill', kind: 'decl',
          docType: 'Process statement', issuer: 'Candiani Denim', date: '2025-02-20',
          method: 'The mill described its own dyeing process. It has not been independently verified here.',
          hash: null, detail: 'States a reduced-water, PVA-free rope-dye process. No third-party effluent report on file yet, so it stays “Told us”.' },
      ],
    },
    {
      id: 'thread', name: 'Sewing thread', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Nudie Jeans supply partners', origin: 'Italy',
      process: 'Organic cotton-wrapped thread',
      jargon: 'Seam thread declared organic cotton-wrapped; content self-reported, not yet lab-verified.',
      plain: 'The brand says the stitching thread is organic cotton. Not lab checked yet.',
      evidence: [
        { title: 'Supplier declaration', meta: 'self-reported · Nudie', kind: 'decl',
          docType: 'Self-declaration', issuer: 'Nudie Jeans', date: '2025-02-20',
          method: 'The brand made this statement itself. It has not been checked independently.',
          hash: null, detail: 'Thread declared organic cotton. Pending third-party confirmation, so it stays “Told us”.' },
      ],
    },
    {
      id: 'hardware', name: 'Rivets & buttons', pct: '—', pctNum: 0, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'YKK / Cobrax', origin: 'Italy',
      process: 'Nickel-free antique-brass shank button & rivets',
      jargon: 'Shank button and rivets nickel-free antique brass; migration tested to EN 1811 nickel-release limits.',
      plain: 'The button and rivets are nickel-free brass, so they’re kinder to sensitive skin — and that’s been tested.',
      evidence: [
        { title: 'Nickel-release test', meta: 'report · EN 1811', kind: 'report',
          docType: 'Lab report (PDF)', issuer: 'SGS', date: '2025-04-12',
          method: 'Standard nickel-migration assay on the metal trims.',
          hash: 'b7f0…33ce', detail: 'Confirms metal trims release nickel below the EN 1811 skin-contact limit.' },
      ],
    },
    {
      id: 'patch', name: 'Leather-free patch', pct: '—', pctNum: 0, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Jacron', origin: 'Italy',
      process: 'FSC recycled-cellulose waistband patch',
      jargon: 'Back waistband patch made from FSC-certified recycled cellulose (Jacron) in place of leather.',
      plain: 'The waistband patch is a paper-based material instead of leather — vegan, and made from certified recycled fibre.',
      evidence: [
        { title: 'FSC chain-of-custody', meta: 'PDF · FSC', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'FSC', date: '2024-11-09',
          method: 'Certifier verified the recycled-cellulose sourcing chain.',
          hash: 'c9a1…d720', detail: 'Confirms the patch material is FSC-certified recycled cellulose; leather-free.' },
      ],
    },
  ],

  makerNarrative:
    'Clean Eileen is a dry jean — woven in Italy from organic cotton and shipped raw, so it fades to the shape of the person who wears it. ' +
    'We’d rather you wore it hard and washed it rarely than bought another pair.',
  makerAside:
    'Every Nudie jean comes with free repairs for life. When it is finally worn out, send it back — we reuse it, or recycle the cotton into new denim.',
  storyChapters: [
    { n: '01', title: 'The cotton', place: 'Certified organic farms', date: '2025', state: 'checked',
      body: 'Grown as organic cotton — no synthetic pesticides or GMOs — then ring-spun for the warp and weft. Backed by an organic certificate and a fibre test, so it is Checked.',
      geo: null, photos: 4, audio: { title: 'On organic denim', duration: '1:28' } },
    { n: '02', title: 'The weave', place: 'Candiani · Italy', date: '2025', state: 'told',
      body: 'Woven on the banks of the Ticino into a 12.5 oz black crosshatch twill, using a chitosan pre-treatment the mill says cuts water and plastic sizing. Process is mill-reported, so it stays Told us.',
      geo: null, photos: 3, audio: { title: 'The crosshatch weave', duration: '1:41' } },
    { n: '03', title: 'The making', place: 'Italy', date: '2025 · batch 0148', state: 'told',
      body: 'Cut and sewn in Italy as a high-waist, tapered jean with a shank button, hidden rivets and a leather-free patch. Workshop details are self-reported.',
      geo: null, photos: 5, audio: null },
    { n: '04', title: 'In your keeping', place: 'Your wardrobe', date: 'ongoing', state: 'notyet',
      body: 'The last chapter is unwritten. Free repairs, re-wears and the next owner are added here as they happen. Nothing on file yet.',
      geo: null, photos: 0, audio: null },
  ],
  reviews: { rating: '4.6', count: 212, recommend: '88%' },
  communityVoices: [
    { author: 'Verified buyer · W27', date: '2026', body: 'Broke in beautifully after a few weeks. The black crosshatch fades to a lovely soft grey-black. True to size.' },
    { author: 'Verified buyer', date: '2026', body: 'Took a small tear at the pocket to the free repair service — back good as new. This is how jeans should work.' },
  ],
  community: [
    { author: 'lin_denim', date: '4 days ago', topic: 'This garment', body: 'High waist actually stays put when I cycle. The crosshatch is subtle but gorgeous in sunlight.' },
    { author: 'raw_and_slow', date: '2 weeks ago', topic: 'Care', body: 'Six months no wash, just aired out. The fades along the thighs are unreal. Freeze-don’t-wash is a myth though — just spot clean.' },
    { author: 'menda', date: '3 weeks ago', topic: 'Repair & reuse', body: 'Reminder that Nudie repairs these free forever. Took mine in for a knee patch, zero cost.' },
    { author: 'fibrenerd', date: '1 month ago', topic: 'Sustainability', body: 'Plant-based stretch instead of elastane is the detail that sold me — no microplastic shedding in the wash.' },
  ],

  // Story Book — voices from the BRAND and its named SUPPLIERS, each telling
  // their own ethics / sustainability story. Standalone; each wears a mark.
  brandVoices: [
    { who: 'Nudie Jeans', role: 'Brand · ethics', state: 'told',
      quote: 'We build jeans to be repaired, not replaced. Every pair carries free repairs for life, and when it is truly worn out we take it back to reuse or recycle the cotton.' },
    { who: 'Candiani Denim', role: 'Mill · Robecchetto, Italy', state: 'told',
      quote: 'The black crosshatch is woven on the banks of a protected river park. A chitosan pre-treatment lets us cut water and drop the plastic (PVA) sizing conventional denim relies on.' },
    { who: 'Blue di Genova atelier', role: 'Cut & sew · Italy', state: 'checked',
      quote: 'Every jean is cut and sewn under an SA8000-audited agreement — fair wages, a national union contract and capped, voluntary overtime. Verified at our last audit.' },
    { who: 'ICEA', role: 'Certifier · organic', state: 'checked',
      quote: 'We traced the organic cotton’s chain of custody from farm to woven fabric. The GOTS scope certificate on file confirms it is organic and traceable.' },
  ],

  social: {
    note: 'Working conditions declared for the Italian mill and sewing workshop. Wages and hours verified by audit; the rest is brand-reported.',
    labor: [
      { id: 'wages', label: 'Wages', state: 'checked', value: 'Workers paid at or above the national collective-bargaining wage for textiles, confirmed in the latest audit.' },
      { id: 'hours', label: 'Working hours', state: 'checked', value: 'Standard week with paid, voluntary overtime capped under Italian labour law.' },
      { id: 'safety', label: 'Health & safety', state: 'told', value: 'Facility declared ISO 45001-aligned for occupational health & safety. Brand-reported.' },
      { id: 'freedom', label: 'Freedom of association', state: 'checked', value: 'Workforce covered by a national textile union agreement; verified at audit.' },
      { id: 'childlabor', label: 'No child or forced labour', state: 'checked', value: 'Age and voluntary-employment checks passed at the last independent social audit.' },
    ],
    audit: { body: 'SA8000', grade: 'A', date: '2025', state: 'checked' },
  },
  lca: {
    state: 'told',
    note: 'Cradle-to-gate figures modelled for organic-cotton dry denim woven in Italy. Independent review pending, so marked Told us.',
    rows: [
      { label: 'Carbon footprint', value: '9.4 kg CO₂e', vs: 'organic cotton, Italian mill', big: '9.4', unit: 'kg CO₂e', ring: 34, ringLabel: 'below avg', state: 'told' },
      { label: 'Water at dye', value: 'reduced-water dye', vs: 'chitosan pre-treatment vs conventional', big: '75', unit: '% less', ring: 75, ringLabel: 'less water', state: 'told' },
      { label: 'Repairability', value: 'free repairs for life', vs: 'designed to be mended, not replaced', big: '100', unit: '% covered', ring: 100, ringLabel: 'repairable', state: 'checked' },
    ],
  },
  circularity: [
    { id: 'care', title: 'Care', sub: 'Wash rarely, cold, inside out — dry denim likes to be left alone', state: 'checked' },
    { id: 'repair', title: 'Repair', sub: 'Free repairs for life through the maker', state: 'checked' },
    { id: 'resale', title: 'Resell', sub: 'List on the ThreadTrace market · passport travels with it', state: 'told' },
    { id: 'recycle', title: 'Reuse / recycle', sub: 'Send worn-out pairs back · reused or recycled into new denim', state: 'told' },
  ],
  lifecycle: [
    { label: 'Made', state: 'checked' },
    { label: 'Sold', state: 'checked' },
    { label: 'In use', state: 'checked' },
    { label: 'Repaired', state: 'notyet' },
    { label: 'Next life', state: 'notyet' },
  ],
};

/* =====================================================================
   Organic Cotton Tee — PANGAIA (wardrobe w3). Own descriptions.
   ===================================================================== */
TT.organicTee = {
  name: 'Mother Lover T-Shirt', brand: 'Stella McCartney', season: 'Washed Black', batch: '0902',
  maker: 'Jersey atelier · Italy', makerRole: 'Knit, dye & sew · Italy',
  serial: 'DPP·TT–0902·STM', slug: 'mother-lover-t-shirt', shopUrl: 'https://www.stellamccartney.com/gb/en/women/sweatshirts-and-t-shirts/mother-lover-t-shirt-6J02733SQA611082.html', shopLabel: 'View at Stella McCartney', honestyPercent: 74, checkedCount: 7, totalClaims: 9,
  fabricIntro: '100% GOTS-certified organic cotton knitted to a soft single jersey, dyed a washed black and finished in Italy, with a front graphic print.',
  careCopy: 'Dry clean only, and clean it rarely — a washed-black jersey holds its depth for years if you air it between wears rather than over-washing. Mend small holes rather than binning it.',
  footprintNote: 'The demand this tee places on nature, from cotton field to finished garment.',
  sustainNote: 'The tee\u2019s headline sustainability metrics.',
  sustainRows: [
    { name: 'Organic cotton', val: '100%', extra: 'certified' },
    { name: 'Low-water dye', val: '\u224860% less', extra: 'brand-reported' },
    { name: 'Recycled trims', val: '100%', extra: 'labels & thread' },
    { name: 'Repairability', val: 'menders listed', extra: 'ThreadTrace' },
    { name: 'Resale-ready', val: 'passport travels', extra: 'ThreadTrace market' },
  ],
  componentNote: 'Named supplier and origin per component, down to the neck tape and thread. Gaps shown, never hidden.',
  materials: [
    { id: 'cotton', name: 'Organic cotton', pct: '100%', pctNum: 100, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Certified organic cotton growers', origin: 'Knit & finished in Portugal',
      process: 'Ring-spun · 180 GSM single jersey',
      jargon: '100% organic cotton, ring-spun; 180 g/m² single jersey; grown without synthetic pesticides, fertilisers or GMOs · REACH Reg. EC 1907/2006 compliant.',
      plain: '100% organic cotton, knitted light and soft for everyday wear and grown without synthetic chemicals.',
      evidence: [
        { title: 'Organic content certificate', meta: 'PDF · issued 2025', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'Control Union', date: '2025-04-02',
          method: 'Certifier verified the organic chain-of-custody from farm to knit.',
          hash: 'd21a…4c8f', detail: 'Confirms the cotton is certified organic and traceable through the supply chain.' },
        { title: '3rd-party fibre test', meta: 'report · LabCo', kind: 'report',
          docType: 'Lab report (PDF)', issuer: 'LabCo Testing', date: '2025-06-19',
          method: 'Quantitative fibre-composition assay on a production sample.',
          hash: '90ee…2b71', detail: 'Independent lab confirmed 100% cotton within tolerance.' },
      ] },
    { id: 'dye', name: 'Washed-black dye', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Stella McCartney dye partner', origin: 'Italy',
      process: 'Low-water reactive dye',
      jargon: 'Reactive dyeing declared low-water; effluent treated on-site. Concentrations self-reported.',
      plain: 'The washed-black colour comes from a dyeing process the brand says uses less water. We have their word, not an outside test yet.',
      evidence: [
        { title: 'Process declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Process statement', issuer: 'Stella McCartney', date: '2025-04-10',
          method: 'The brand described its own dyeing process. Not independently verified here.',
          hash: null, detail: 'States a reduced-water reactive-dye process. No third-party report on file yet, so it stays “Told us”.' },
      ] },
    { id: 'thread', name: 'Thread & neck tape', pct: '—', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Stella McCartney supply partners', origin: 'Italy',
      process: 'Recycled or responsibly sourced',
      jargon: 'Seam thread and neck tape declared recycled / responsibly sourced; content self-reported.',
      plain: 'The brand says the thread and neck tape are recycled. Not lab checked yet.',
      evidence: [
        { title: 'Supplier declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Self-declaration', issuer: 'Stella McCartney', date: '2025-04-10',
          method: 'The brand made this statement itself. Not checked independently.',
          hash: null, detail: 'Declared recycled or responsibly sourced. Pending confirmation, so it stays “Told us”.' },
      ] },
  ],
  makerNarrative:
    'A plain tee should be the hardest-working piece you own. We knit ours from organic cotton and dye it with less water, so the one thing you reach for daily costs the planet less. ' +
    'Wear it out before you replace it.',
  makerAside:
    'Softens with every wash and holds its shape. When it is finally worn through, the cotton can be recycled rather than sent to landfill.',
  storyChapters: [
    { n: '01', title: 'The fibre', place: 'Certified organic farms', date: '2025', state: 'checked',
      body: 'Grown as organic cotton — no synthetic pesticides, fertilisers or GMOs — then ring-spun and knitted to a light 180 GSM jersey. Backed by an organic certificate and a fibre test, so it is Checked.',
      geo: null, photos: 3, audio: { title: 'On organic cotton', duration: '1:18' } },
    { n: '02', title: 'The colour', place: 'Italy', date: '2025', state: 'told',
      body: 'Dyed a washed black with a reactive process the brand says uses far less water than conventional dyeing. Performance is brand-reported, so it stays Told us.',
      geo: null, photos: 2, audio: null },
    { n: '03', title: 'The making', place: 'Italy', date: '2025 · batch 0902', state: 'told',
      body: 'Cut and sewn by a jersey atelier in Italy — set-in sleeves, a ribbed crew neck and a clean twin-needle hem, with the front graphic printed in-house. Workshop details are self-reported.',
      geo: null, photos: 4, audio: null },
    { n: '04', title: 'In your keeping', place: 'Your wardrobe', date: 'ongoing', state: 'notyet',
      body: 'The last chapter is unwritten. Re-wears, repairs and the next owner are added here as they happen. Nothing on file yet.',
      geo: null, photos: 0, audio: null },
  ],
  reviews: { rating: '4.5', count: 96, recommend: '90%' },
  communityVoices: [
    { author: 'Verified buyer · S', date: '2026', body: 'The colour is gorgeous and hasn’t faded after months of washing. Soft but not flimsy.' },
    { author: 'Verified buyer', date: '2026', body: 'My go-to plain tee. Keeps its shape and the fabric feels substantial for the weight.' },
  ],
  social: {
    note: 'Working conditions declared for the Italian jersey atelier where this tee is knit, dyed and sewn. Wage and safety data verified by audit; the rest is brand-reported.',
    labor: [
      { id: 'wages', label: 'Wages', state: 'checked', value: 'Workers paid at or above the Italian textile-sector minimum, confirmed in the latest audit.' },
      { id: 'hours', label: 'Working hours', state: 'checked', value: 'Standard week with capped, voluntary overtime under EU labour law.' },
      { id: 'safety', label: 'Health & safety', state: 'told', value: 'Facility declared ISO 45001-aligned. Brand-reported.' },
      { id: 'childlabor', label: 'No child or forced labour', state: 'checked', value: 'Age and voluntary-employment checks passed at the last independent audit.' },
    ],
    audit: { body: 'amfori BSCI', grade: 'B', date: '2025', state: 'checked' },
  },
  lca: {
    state: 'told',
    note: 'Cradle-to-gate figures modelled by the brand for organic-cotton jersey. Independent review pending, so marked Told us.',
    rows: [
      { label: 'Carbon footprint', value: '4.2 kg CO₂e', vs: 'organic cotton, light jersey', big: '4.2', unit: 'kg CO₂e', ring: 22, ringLabel: 'below avg', state: 'told' },
      { label: 'Water use', value: 'largely rain-fed', vs: 'organic cotton is mostly rain-fed', big: '80', unit: '% rain-fed', ring: 80, ringLabel: 'rain-fed', state: 'told' },
      { label: 'Water at dye', value: 'reduced-water dye', vs: 'low-water reactive process', big: '60', unit: '% less', ring: 60, ringLabel: 'less water', state: 'told' },
    ],
  },
};

/* =====================================================================
   Raw Denim Trouser — Nudie Jeans (wardrobe w4). Own descriptions.
   ===================================================================== */
TT.rawDenim = {
  name: 'Falabella Tiny Tote Bag', brand: 'Stella McCartney', season: 'Steel Grey · tiny', batch: '3916',
  maker: 'Falabella atelier · Italy', makerRole: 'Cut & assembled · Italy',
  serial: 'DPP·TT–3916·STM', slug: 'falabella-tiny-tote-grey', shopUrl: 'https://www.stellamccartney.com/gb/en/women/the-iconic-falabella/falabella-tiny-tote-bag-391698W91321220.html', shopLabel: 'View at Stella McCartney', honestyPercent: 71, checkedCount: 6, totalClaims: 9,
  fabricIntro: 'A tiny vegan tote in steel grey, cut from matte Shaggy Deer fabric with a semi-gloss grain and framed by the signature Falabella diamond-cut chain — cruelty-free and made in Italy.',
  careCopy: 'Wipe gently with a soft damp cloth and a little demineralised water, then leave to dry — never scrub. Keep it away from sharp objects and rough surfaces, and store it in its dust bag when not in use. A carefully kept Falabella lasts for years.',
  footprintNote: 'The demand this bag places on nature, from recycled fabric to finished tote.',
  sustainNote: 'The tote\u2019s headline sustainability metrics.',
  sustainRows: [
    { name: 'Vegan / non-leather', val: '100%', extra: 'cruelty-free' },
    { name: 'Recycled polyester body', val: '45%', extra: 'GRS Newlife\u2122' },
    { name: 'GOTS cotton lacing', val: '100%', extra: 'certified' },
    { name: 'Recycled brass chain', val: '100%', extra: 'handle & strap' },
    { name: 'Resale-ready', val: 'passport travels', extra: 'ThreadTrace market' },
  ],
  componentNote: 'Named material and origin per component, down to the lacing and the medallion. Gaps shown, never hidden.',
  materials: [
    { id: 'body', name: 'Shaggy Deer fabric', pct: 'main', pctNum: 100, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Vegan-fabric mill', origin: 'Made up in Italy',
      process: 'Matte Shaggy Deer with semi-gloss grain',
      jargon: 'Main fabric 55% polyester / 45% GRS-certified Newlife\u2122 post-consumer recycled polyester; trims 70% solventless polyurethane / 30% recycled polyester. Non-leather, cruelty-free.',
      plain: 'A soft vegan fabric \u2014 not leather \u2014 that\u2019s almost half recycled polyester made from pre-loved textiles. The recycled part is third-party certified.',
      evidence: [
        { title: 'GRS recycled-content certificate', meta: 'PDF · GRS', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'Control Union', date: '2025-03-14',
          method: 'Certifier traced the recycled-polyester chain-of-custody into the finished fabric.',
          hash: 'b74c…9f21', detail: 'Confirms the Newlife\u2122 recycled-polyester content is certified and traceable.' },
        { title: 'Cruelty-free / non-leather declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Material statement', issuer: 'Stella McCartney', date: '2025-03-14',
          method: 'The brand declared the fabric contains no animal-derived leather.',
          hash: null, detail: 'States a fully vegan, non-leather construction in keeping with the house cruelty-free ethos.' },
      ] },
    { id: 'chain', name: 'Falabella diamond-cut chain', pct: 'trim', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Metal-trim supplier', origin: 'Italy',
      process: 'Ruthenium recycled brass & aluminium; zamac medallion',
      jargon: 'Handle/strap 100% recycled brass; body chain 100% aluminium; medallion 100% zamac (zinc-aluminium alloy); magnet stainless steel. Recycled content self-reported.',
      plain: 'The signature chain is made from recycled brass and aluminium. The brand tells us it\u2019s recycled; we don\u2019t have an outside test on file yet.',
      evidence: [
        { title: 'Recycled-metal declaration', meta: 'self-reported · Stella McCartney', kind: 'decl',
          docType: 'Process statement', issuer: 'Stella McCartney', date: '2025-03-14',
          method: 'The brand described the recycled-brass and aluminium sourcing. Not independently verified here.',
          hash: null, detail: 'States recycled brass and aluminium reduce virgin mining. No third-party report yet, so it stays “Told us”.' },
      ] },
    { id: 'lacing', name: 'GOTS cotton lacing', pct: 'trim', pctNum: 0, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Certified organic cotton', origin: 'Italy',
      process: 'Waxed with corn-starch coating, hand-laced through the chain',
      jargon: 'Lacing 100% GOTS-certified organic cotton with a corn-starch wax coating; hand-laced through the diamond-cut chain.',
      plain: 'The cotton that laces the chain is certified organic and finished with a plant-based wax \u2014 and that\u2019s been verified.',
      evidence: [
        { title: 'Organic content certificate', meta: 'PDF · GOTS', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'ICEA', date: '2025-02-11',
          method: 'Certifier traced the organic chain-of-custody for the cotton lacing.',
          hash: 'e3a1…77d0', detail: 'Confirms the lacing cotton is GOTS-certified organic and traceable.' },
      ] },
  ],
  makerNarrative:
    'The Falabella has been made without a scrap of leather since the day it launched \u2014 proof that an icon doesn\u2019t need cruelty to be desirable. ' +
    'This tiny tote carries the everyday essentials, framed by the diamond-cut chain we\u2019ve become known for.',
  makerAside:
    'Kept well, a Falabella is handed on rather than thrown away. When you\u2019re ready to part with it, the passport travels to the next owner.',
  storyChapters: [
    { n: '01', title: 'The fabric', place: 'Vegan-fabric mill', date: '2025', state: 'checked',
      body: 'A vegan Shaggy Deer fabric, almost half GRS-certified recycled polyester made from pre-loved textiles. Backed by a recycled-content certificate, so it is Checked.',
      geo: null, photos: 3, audio: { title: 'On leather-free luxury', duration: '1:20' } },
    { n: '02', title: 'The chain', place: 'Italy', date: '2025', state: 'told',
      body: 'The signature Falabella diamond-cut chain in recycled brass and aluminium, hand-laced with waxed organic cotton. Recycled content is brand-reported, so it stays Told us.',
      geo: null, photos: 2, audio: null },
    { n: '03', title: 'The making', place: 'Italy', date: '2025 · batch 3916', state: 'told',
      body: 'Cut and assembled in Italy \u2014 two top handles, a shoulder strap, a magnetic snap and a recycled-polyester monogram lining. Workshop details are self-reported.',
      geo: null, photos: 4, audio: null },
    { n: '04', title: 'In your keeping', place: 'Your wardrobe', date: 'ongoing', state: 'notyet',
      body: 'The last chapter is unwritten. Wear, repairs and the next owner are added here as they happen. Nothing on file yet.',
      geo: null, photos: 0, audio: null },
  ],
  reviews: { rating: '4.8', count: 132, recommend: '94%' },
  communityVoices: [
    { author: 'Verified buyer', date: '2026', body: 'The tiny size fits my phone and cards perfectly and the chain makes it feel special. Love that it\u2019s completely leather-free.' },
    { author: 'Verified buyer', date: '2026', body: 'Lighter than it looks and the grey goes with everything. Wipes clean with a damp cloth.' },
  ],
  brandVoices: [
    { who: 'Stella McCartney', role: 'Brand · ethics', state: 'told',
      quote: 'The Falabella has never used leather. It proves that desirable, iconic design and a cruelty-free ethos belong together.' },
    { who: 'Vegan-fabric mill', role: 'Material · Italy', state: 'told',
      quote: 'Our Shaggy Deer fabric blends recycled Newlife\u2122 polyester from pre-loved textiles, keeping waste out of landfill and cutting virgin fibre.' },
    { who: 'Falabella atelier', role: 'Cut & assemble · Italy', state: 'checked',
      quote: 'Each tote is hand-laced and assembled in Italy under audited conditions \u2014 fair wages and capped, voluntary overtime. Verified at our last audit.' },
  ],
  social: {
    note: 'Working conditions declared for the Italian atelier where this tote is cut, laced and assembled. Wages and hours verified by audit; the rest is brand-reported.',
    labor: [
      { id: 'wages', label: 'Wages', state: 'checked', value: 'Workers paid at or above the Italian textile-sector collective wage, confirmed at audit.' },
      { id: 'hours', label: 'Working hours', state: 'checked', value: 'Standard week with paid, voluntary overtime capped under Italian labour law.' },
      { id: 'safety', label: 'Health & safety', state: 'told', value: 'Facility declared ISO 45001-aligned. Brand-reported.' },
      { id: 'freedom', label: 'Freedom of association', state: 'checked', value: 'Workforce covered by a national textile union agreement; verified at audit.' },
    ],
    audit: { body: 'SMETA 4-pillar', grade: 'A', date: '2025', state: 'checked' },
  },
  lca: {
    state: 'told',
    note: 'Cradle-to-gate figures modelled for a recycled-blend vegan tote made in Italy. Independent review pending, so marked Told us.',
    rows: [
      { label: 'Carbon footprint', value: '6.2 kg CO₂e', vs: 'small vegan tote, recycled blend', big: '6.2', unit: 'kg CO₂e', ring: 30, ringLabel: 'below avg', state: 'told' },
      { label: 'Recycled content', value: 'recycled body & chain', vs: 'recycled polyester and brass', big: '45', unit: '% recycled', ring: 45, ringLabel: 'recycled', state: 'told' },
      { label: 'Cruelty-free', value: 'no animal leather', vs: 'fully vegan construction', big: '100', unit: '% vegan', ring: 100, ringLabel: 'vegan', state: 'checked' },
    ],
  },
};
/* =====================================================================
   Merino Beanie — Colorful Standard (wardrobe w5). Own descriptions.
   ===================================================================== */
TT.merinoBeanie = {
  name: 'Campo Leather Sneaker', brand: 'VEJA', season: 'White Black', batch: 'CP05',
  maker: 'Sneaker factory · Brazil', makerRole: 'Cut & assembled · Brazil',
  serial: 'DPP·TT–CP05·VEJ', slug: 'campo-leather-white-black', shopUrl: 'https://www.veja-store.com/en_gg/p/campo-leather-white-black-CP0501537.html', shopLabel: 'View at VEJA', honestyPercent: 76, checkedCount: 7, totalClaims: 9,
  fabricIntro: 'A low-impact leather sneaker in white with black detailing \u2014 ChromeFree tanned leather over a sole of wild rubber tapped from the Amazon, laced with organic cotton and lined with recycled polyester. Assembled in Brazil.',
  careCopy: 'Wipe the leather clean with a soft damp cloth and let it air dry \u2014 never machine wash or tumble. Protect white leather with a suitable spray, and swap in fresh organic-cotton laces rather than replacing the whole shoe. Kept this way, a good sneaker lasts for years and can be resoled.',
  footprintNote: 'The demand this sneaker places on nature, from tannery and rubber tree to finished pair.',
  sustainNote: 'The sneaker\u2019s headline sustainability metrics.',
  sustainRows: [
    { name: 'ChromeFree leather', val: 'metal-free tan', extra: 'third-party tested' },
    { name: 'Amazonian wild rubber', val: 'in the sole', extra: 'traceable' },
    { name: 'Recycled polyester lining', val: '100%', extra: 'recycled bottles' },
    { name: 'Organic cotton laces', val: '100%', extra: 'GOTS' },
    { name: 'Resale-ready', val: 'passport travels', extra: 'ThreadTrace market' },
  ],
  componentNote: 'Named material and origin per component, down to the laces and the insole. Gaps shown, never hidden.',
  materials: [
    { id: 'leather', name: 'ChromeFree leather upper', pct: 'upper', pctNum: 100, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'ChromeFree tannery', origin: 'Tanned & cut in Brazil',
      process: 'Bovine leather tanned without chromium or heavy metals',
      jargon: 'Bovine leather tanned by a ChromeFree process free of chromium and heavy metals; effluent within tannery discharge limits. Independently tested.',
      plain: 'The white upper is real leather, but tanned without the chromium and heavy metals most tanneries use \u2014 gentler on workers and rivers. That\u2019s been tested.',
      evidence: [
        { title: 'Metal-free tanning test', meta: 'PDF · lab report', kind: 'report',
          docType: 'Lab report (PDF)', issuer: 'SGS', date: '2025-04-08',
          method: 'Assay for chromium and heavy-metal residues on the finished leather.',
          hash: 'c92a…41be', detail: 'Confirms the leather is tanned free of chromium and heavy metals within test limits.' },
        { title: 'Tannery environmental audit', meta: 'report · LWG-aligned', kind: 'report',
          docType: 'Audit report (PDF)', issuer: 'Independent auditor', date: '2025-03-20',
          method: 'On-site review of the tannery\u2019s water and chemical management.',
          hash: '58d0…12a7', detail: 'Confirms effluent and chemical handling meet the audited environmental standard.' },
      ] },
    { id: 'sole', name: 'Amazonian wild-rubber sole', pct: 'sole', pctNum: 0, state: 'told',
      statusLine: 'The brand told us, not checked yet',
      supplier: 'Amazon rubber-tapper cooperatives', origin: 'Acre, Brazil',
      process: 'Wild rubber blended with synthetic rubber',
      jargon: 'Outsole contains wild Amazonian latex (Hevea) tapped by seringueiro cooperatives, blended with synthetic rubber. Wild-content share self-reported.',
      plain: 'Part of the sole is rubber tapped from wild trees in the Amazon, which gives forest communities a reason to keep the trees standing. The exact share is the brand\u2019s word, not an outside test yet.',
      evidence: [
        { title: 'Wild-rubber sourcing declaration', meta: 'self-reported · VEJA', kind: 'decl',
          docType: 'Sourcing statement', issuer: 'VEJA', date: '2025-03-12',
          method: 'The brand described its wild-rubber supply from Amazon cooperatives. Not independently verified here.',
          hash: null, detail: 'States wild Amazonian rubber in the sole supporting standing-forest livelihoods. No third-party share audit yet, so it stays “Told us”.' },
      ] },
    { id: 'lining', name: 'Recycled lining & organic laces', pct: 'trim', pctNum: 0, state: 'checked',
      statusLine: 'Checked, verified independently',
      supplier: 'Recycled-polyester & organic-cotton suppliers', origin: 'Brazil',
      process: 'Lining from recycled bottles; GOTS organic-cotton laces',
      jargon: 'Lining 100% recycled polyester from post-consumer PET; laces 100% GOTS-certified organic cotton. Both third-party certified.',
      plain: 'Inside, the lining is made from recycled plastic bottles and the laces are certified organic cotton \u2014 both verified.',
      evidence: [
        { title: 'Recycled-content certificate', meta: 'PDF · GRS', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'Control Union', date: '2025-02-18',
          method: 'Certifier traced the recycled-polyester chain-of-custody into the lining.',
          hash: 'a71f…3c48', detail: 'Confirms the lining\u2019s recycled-PET content is certified and traceable.' },
        { title: 'Organic cotton certificate', meta: 'PDF · GOTS', kind: 'cert',
          docType: 'Scope certificate (PDF)', issuer: 'ICEA', date: '2025-02-18',
          method: 'Certifier traced the organic chain-of-custody for the lace cotton.',
          hash: '6b20…d9e1', detail: 'Confirms the laces are GOTS-certified organic cotton.' },
      ] },
  ],
  makerNarrative:
    'A sneaker touches almost every environmental issue at once \u2014 leather, rubber, plastic, cotton, glue. We make ours the hard way: ChromeFree leather, wild rubber that keeps the Amazon standing, and recycled linings, then we tell you exactly what\u2019s inside.',
  makerAside:
    'A well-kept pair can be cleaned, re-laced and resoled for years. When you\u2019re ready to move it on, the passport travels to the next owner.',
  storyChapters: [
    { n: '01', title: 'The leather', place: 'ChromeFree tannery', date: '2025', state: 'checked',
      body: 'The white upper is bovine leather tanned without chromium or heavy metals, then tested. Backed by a metal-free tanning report and an environmental audit, so it is Checked.',
      geo: null, photos: 3, audio: { title: 'On metal-free tanning', duration: '1:22' } },
    { n: '02', title: 'The rubber', place: 'Acre, Brazil', date: '2025', state: 'told',
      body: 'Part of the sole is wild rubber tapped from Amazon trees by seringueiro cooperatives, giving forests a standing value. The wild share is brand-reported, so it stays Told us.',
      geo: null, photos: 2, audio: { title: 'Tapping wild rubber', duration: '1:30' } },
    { n: '03', title: 'The making', place: 'Brazil', date: '2025 · batch CP05', state: 'told',
      body: 'Cut and assembled at a footwear factory in Brazil \u2014 stitched upper, recycled lining and a stacked wild-rubber sole. Workshop details are self-reported.',
      geo: null, photos: 4, audio: null },
    { n: '04', title: 'In your keeping', place: 'Your wardrobe', date: 'ongoing', state: 'notyet',
      body: 'The last chapter is unwritten. Wear, cleaning, re-lacing and the next owner are added here as they happen. Nothing on file yet.',
      geo: null, photos: 0, audio: null },
  ],
  reviews: { rating: '4.7', count: 211, recommend: '93%' },
  communityVoices: [
    { author: 'Verified buyer · EU40', date: '2026', body: 'Clean white leather that wipes up easily, and they get more comfortable after a week. Love knowing the rubber comes from the Amazon.' },
    { author: 'Verified buyer', date: '2026', body: 'Swapped the laces once and they look brand new. Solid everyday sneaker with a conscience.' },
  ],
  social: {
    note: 'Working conditions declared for the Brazilian footwear factory where this sneaker is cut and assembled. Wages and hours verified by audit; the rest is brand-reported.',
    labor: [
      { id: 'wages', label: 'Wages', state: 'checked', value: 'Workers paid at or above the Brazilian footwear-sector agreement, confirmed at audit.' },
      { id: 'hours', label: 'Working hours', state: 'checked', value: 'Standard week with capped, voluntary overtime under Brazilian labour law.' },
      { id: 'safety', label: 'Health & safety', state: 'told', value: 'Facility declared ISO 45001-aligned. Brand-reported.' },
      { id: 'childlabor', label: 'No child or forced labour', state: 'checked', value: 'Age and voluntary-employment checks passed at the last independent audit.' },
    ],
    audit: { body: 'SA8000', grade: 'A', date: '2025', state: 'checked' },
  },
  lca: {
    state: 'told',
    note: 'Cradle-to-gate figures modelled for a leather sneaker with wild-rubber sole. Independent review pending, so marked Told us.',
    rows: [
      { label: 'Carbon footprint', value: '2.1 kg CO₂e', vs: 'per shoe, lower-impact materials', big: '2.1', unit: 'kg CO₂e', ring: 24, ringLabel: 'below avg', state: 'told' },
      { label: 'Wild / recycled content', value: 'sole & lining', vs: 'wild rubber and recycled PET', big: '50', unit: '% lower-impact', ring: 50, ringLabel: 'lower-impact', state: 'told' },
      { label: 'Repairability', value: 'clean, re-lace, resole', vs: 'built to be kept, not binned', big: '100', unit: '% serviceable', ring: 100, ringLabel: 'serviceable', state: 'checked' },
    ],
  },
};

// ---- C11 Life cycle assessment (told — brand-modelled, awaiting third-party review) ----
TT.passport.lca = {
  state: 'told',
  note: 'Cradle-to-gate figures modelled by the brand for organic-cotton knitwear. Independent review pending, so marked Told us.',
  rows: [
    { label: 'Carbon footprint', value: '9.6 kg CO₂e', vs: 'organic cotton, lower-impact spinning', big: '9.6', unit: 'kg CO₂e', ring: 28, ringLabel: 'below avg', state: 'told' },
    { label: 'Water use', value: 'largely rain-fed', vs: 'organic cotton is mostly rain-fed', big: '80', unit: '% rain-fed', ring: 80, ringLabel: 'rain-fed', state: 'told' },
    { label: 'Energy in making', value: 'modelled', vs: 'renewable share at knit & finish', big: '55', unit: '% renew.', ring: 55, ringLabel: 'renewable', state: 'told' },
  ],
};

// ---- Digital Product Passport compliance checklist ----
// The brand's readiness journey toward DPP requirements. Shown to the business
// (interactive, Marcus works through it) and to the consumer (read-only progress).
TT.dppCompliance = {
  note: 'Seven steps to a compliant Digital Product Passport. Each is owned by a named team and moves from planned to verified.',
  steps: [
    { n: '01', title: 'Define product scope', state: 'done', owner: 'Compliance',
      task: 'Define the scope of products and categories affected by Digital Product Passport requirements.',
      detail: 'Apparel & footwear in scope from 2027; textiles categorised against EU delegated acts.' },
    { n: '02', title: 'Structure product data', state: 'done', owner: 'Product data',
      task: 'Identify and structure product-level data across existing systems.',
      detail: 'Materials, care, origin and composition modelled to one schema per SKU.' },
    { n: '03', title: 'Map data sources', state: 'active', owner: 'Data & IT',
      task: 'Map data sources and ensure consistency between internal platforms.',
      detail: 'PLM, ERP and the traceability ledger reconciled; 2 mismatches open.' },
    { n: '04', title: 'Define governance', state: 'active', owner: 'Operations',
      task: 'Define governance, ownership, and responsibilities for data management.',
      detail: 'RACI drafted; sign-off owners named for each data domain.' },
    { n: '05', title: 'Align IT systems', state: 'todo', owner: 'Data & IT',
      task: 'Align IT systems to support data integration and updates over time.',
      detail: 'API layer to keep passports live as records change — scoping underway.' },
    { n: '06', title: 'Engage suppliers', state: 'todo', owner: 'Sourcing',
      task: 'Engage suppliers to collect and validate required information.',
      detail: 'Tier 1 onboarded; tiers 2–3 invited to submit and validate proofs.' },
    { n: '07', title: 'Maintain & verify', state: 'todo', owner: 'Compliance',
      task: 'Prepare processes for ongoing data maintenance and verification.',
      detail: 'Recurring review cadence and third-party audit schedule to be set.' },
  ],
  challengesNote: 'The checklist looks straightforward, but implementation gets complex because data and responsibilities are spread across the organisation.',
  challenges: [
    { title: 'Fragmented data', body: 'Product information scattered across multiple systems.' },
    { title: 'Unclear ownership', body: 'No single owner accountable for each piece of product data.' },
    { title: 'Limited integration', body: 'Internal platforms don’t talk to each other reliably.' },
    { title: 'Supplier dependencies', body: 'Critical data relies on external suppliers to provide and validate.' },
  ],
};

module.exports = TT;
