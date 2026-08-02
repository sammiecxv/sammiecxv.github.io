/* ThreadTrace — REST API + static client host.
   Run: npm install && npm start   →   http://localhost:3000
   The client boots by fetching /api/bootstrap, so all data comes from here. */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const TT = require('./data/seed');
const imageSlots = require('./data/image-slots.json');
const provenance = require('./data/provenance');
const db = require('./db/db');   // { available:false } if better-sqlite3 isn't installed

const SOURCE = db.available ? 'sqlite (server/db/threadtrace.db)' : 'in-memory seed (data/seed.js)';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---- request log (dev) ----
app.use((req, _res, next) => { console.log(`${req.method} ${req.url}`); next(); });

/* =====================================================================
   Domain helpers
   ===================================================================== */

// All garment passports, keyed by slug. `passport` is the canonical PANGAIA one.
const PASSPORTS = [TT.passport, TT.cleanEileen, TT.organicTee, TT.rawDenim, TT.merinoBeanie]
  .filter(Boolean);
const bySlug = (slug) => PASSPORTS.find((p) => p.slug === slug);
// Passport lookup preferring the database (full doc), falling back to seed.
const getP = (slug) => (db.available ? db.getPassport(slug) : bySlug(slug));

// Tiered honesty ring — resolves how far each material's claim actually travelled.
function computeTiers(passport) {
  const mats = passport.materials || [];
  const n = mats.length || 1;
  let t1 = 0, t2 = 0, t3 = 0;
  mats.forEach((m) => {
    t1++;
    if (m.supplier && m.supplier !== 'Unknown' && m.origin && m.origin !== 'Not recorded') t2++;
    if ((m.evidence || []).some((e) => e.kind === 'cert')) t3++;
  });
  return {
    tier1: { pct: Math.round((t1 / n) * 100), count: t1, total: n, label: 'Brand claims' },
    tier2: { pct: Math.round((t2 / n) * 100), count: t2, total: n, label: 'Supply chain proof' },
    tier3: { pct: Math.round((t3 / n) * 100), count: t3, total: n, label: 'Third-party audit' },
  };
}

/* =====================================================================
   API — read model
   ===================================================================== */

const api = express.Router();

// One call the client uses to hydrate the whole prototype.
api.get('/bootstrap', (_req, res) => res.json(TT));
api.get('/image-slots', (_req, res) => res.json(imageSlots));

// Same data as an executable classic script — runs before the Babel scripts so
// window.TT is populated in order, exactly like the old inline data.js. This is
// what the client loads; /bootstrap (JSON) is for any other REST consumer.
api.get('/bootstrap.js', (_req, res) => {
  const safe = (o) => JSON.stringify(o).replace(/<\//g, '<\\/');
  res.type('application/javascript').send(
`/* ThreadTrace bootstrap — data served by the API */
window.__resources = window.__resources || { logoMark: '/assets/logo-mark.svg' };
window.TT = ${safe(TT)};
window.__IMAGE_SLOT_STATE = ${safe(imageSlots)};
window.TT.computeTiers = function computeTiers() {
  var mats = window.TT.passport.materials, n = mats.length, t1 = 0, t2 = 0, t3 = 0;
  mats.forEach(function (m) {
    t1++;
    if (m.supplier && m.supplier !== 'Unknown' && m.origin && m.origin !== 'Not recorded') t2++;
    if ((m.evidence || []).some(function (e) { return e.kind === 'cert'; })) t3++;
  });
  return {
    tier1: { pct: Math.round((t1 / n) * 100), count: t1, total: n, label: 'Brand claims', color: 'var(--ochre-500)' },
    tier2: { pct: Math.round((t2 / n) * 100), count: t2, total: n, label: 'Supply chain proof', color: 'var(--indigo-500)' },
    tier3: { pct: Math.round((t3 / n) * 100), count: t3, total: n, label: 'Third-party audit', color: 'var(--leaf-600)' }
  };
};`);
});

api.get('/health', (_req, res) => res.json({ ok: true, source: SOURCE, passports: PASSPORTS.length, ts: Date.now() }));

// Passports (garment DPPs) — list & detail from the database when available.
api.get('/passports', (_req, res) => {
  if (db.available) return res.json(db.listPassports());
  res.json(PASSPORTS.map((p) => ({
    slug: p.slug, name: p.name, brand: p.brand, season: p.season, batch: p.batch,
    serial: p.serial, honestyPercent: p.honestyPercent,
    checkedCount: p.checkedCount, totalClaims: p.totalClaims,
  })));
});
api.get('/passports/:slug', (req, res) => {
  const p = getP(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found', slug: req.params.slug });
  res.json(p);
});
api.get('/passports/:slug/materials', (req, res) => {
  const p = getP(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found' });
  res.json(p.materials || []);
});
api.get('/passports/:slug/tiers', (req, res) => {
  const p = getP(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found' });
  res.json(computeTiers(p));
});
api.get('/passports/:slug/story', (req, res) => {
  const p = getP(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found' });
  res.json({ chapters: p.storyChapters || [], storyBook: p.storyBook || [], brandVoices: p.brandVoices || [] });
});

// Verifiable provenance — signed hash chain (tamper-evident chain of custody).
// The garment tag encodes chain.head; a scan re-derives every hash + signature.
// When the DB is present the chain is READ FROM STORAGE (provenance_event table)
// and re-verified, proving the persisted ledger — not a regenerated one.
api.get('/authorities', (_req, res) => res.json(db.available ? db.listAuthorities() : provenance.publicDirectory()));
api.get('/passports/:slug/chain', (req, res) => {
  if (db.available) {
    const chain = db.getChain(req.params.slug);
    return chain ? res.json(chain) : res.status(404).json({ error: 'passport not found' });
  }
  const p = bySlug(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found' });
  res.json(provenance.chainOf(p));
});
// ?tamper=<seq> simulates an attacker editing one event after signing, so the
// verifier can demonstrate detecting it. Omit for an honest verification.
api.get('/passports/:slug/verify', (req, res) => {
  const tamper = req.query.tamper != null ? parseInt(req.query.tamper, 10) : null;
  const t = Number.isNaN(tamper) ? null : tamper;
  if (db.available) {
    const chain = db.getChain(req.params.slug);
    if (!chain) return res.status(404).json({ error: 'passport not found' });
    const v = provenance.verifyStored(chain.events, chain.serial, { tamper: t });
    return res.json({ serial: chain.serial, slug: chain.slug, name: chain.name, brand: chain.brand,
      alg: chain.alg, head: chain.head, source: 'database', ...v });
  }
  const p = bySlug(req.params.slug);
  if (!p) return res.status(404).json({ error: 'passport not found' });
  res.json(provenance.verifyChain(p, { tamper: t }));
});

// Business — operations ledger (products)
api.get('/products', (_req, res) => res.json(db.available ? db.listProducts() : TT.ledger));
api.get('/products/:sku', (req, res) => {
  const row = db.available
    ? db.getProduct(req.params.sku)
    : TT.ledger.find((r) => r.sku.toLowerCase() === req.params.sku.toLowerCase());
  if (!row) return res.status(404).json({ error: 'product not found', sku: req.params.sku });
  res.json(row);
});

// Consumer — wardrobe, resale, rewards
api.get('/wardrobe', (_req, res) => res.json(db.available ? db.listWardrobe() : TT.wardrobe));
api.get('/resale', (_req, res) => res.json(TT.resale));
api.get('/rewards', (_req, res) => res.json(TT.rewards));

// Certifications & standards
api.get('/certs', (_req, res) => {
  const base = db.available ? db.listCerts() : { certs: TT.certs, types: TT.certTypes };
  res.json({ ...base, status: TT.CERT_STATUS, standards: TT.certStandards, coverage: TT.standardsCoverage });
});

// DPP compliance checklist
api.get('/compliance', (_req, res) => res.json(TT.dppCompliance));

// Service desk — repair / maintenance / refurb jobs (mutable, in-memory)
let serviceJobs = JSON.parse(JSON.stringify(TT.serviceJobs));
api.get('/service-jobs', (_req, res) => res.json(serviceJobs));
api.post('/service-jobs/:id/advance', (req, res) => {
  const job = serviceJobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'job not found', id: req.params.id });
  const next = (TT.serviceStatus[job.status] || {}).next;
  if (!next) return res.status(409).json({ error: 'job already complete', id: job.id });
  job.status = next;
  res.json(job);
});

app.use('/api', api);

/* =====================================================================
   Static client
   ===================================================================== */

// One page per app. They share this API but each loads only its own screens.
const PUBLIC = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC));
app.get('/consumer', (_req, res) => res.sendFile(path.join(PUBLIC, 'consumer.html')));
app.get('/business', (_req, res) => res.sendFile(path.join(PUBLIC, 'business.html')));
app.get('*', (_req, res) => res.redirect('/consumer'));

app.listen(PORT, () => {
  console.log(`\nThreadTrace running →  http://localhost:${PORT}`);
  console.log(`Data source         →  ${SOURCE}`);
  console.log(`REST API base       →  http://localhost:${PORT}/api`);
  console.log(`Try                 →  http://localhost:${PORT}/api/passports\n`);
});
