/* ThreadTrace — database migration + seed.
 *
 *   npm run migrate      (or: node server/db/migrate.js)
 *
 * Builds server/db/threadtrace.db from schema.sql and populates every table
 * from data/seed.js — the single authoring source. Re-runnable: it drops and
 * rebuilds the file each time. The signed provenance ledger is generated with
 * the persistent authority keys (data/provenance.js) and written to the
 * provenance_event table, so verification can read signed records straight from
 * the database.
 *
 * Requires better-sqlite3 (a dependency in package.json). `build()` is exported
 * so the server can auto-migrate on first boot if the db file is missing.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'threadtrace.db');
const SCHEMA = path.join(__dirname, 'schema.sql');

function build({ log = () => {} } = {}) {
  const Database = require('better-sqlite3');
  const TT = require('../data/seed');
  const provenance = require('../data/provenance');

  // fresh file every run
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(fs.readFileSync(SCHEMA, 'utf8'));

  const PASSPORTS = [TT.passport, TT.cleanEileen, TT.organicTee, TT.rawDenim, TT.merinoBeanie].filter(Boolean);

  const insertMany = db.transaction(() => {
    // brands ------------------------------------------------------------------
    const brandNames = new Set([...PASSPORTS.map((p) => p.brand), ...TT.wardrobe.map((w) => w.brand)]);
    const insBrand = db.prepare('INSERT OR IGNORE INTO brand (name) VALUES (?)');
    brandNames.forEach((n) => n && insBrand.run(n));
    const brandId = (name) => db.prepare('SELECT id FROM brand WHERE name = ?').get(name).id;

    // passports + materials + evidence ---------------------------------------
    const insPassport = db.prepare(`INSERT INTO passport
      (slug, serial, name, brand_id, season, batch, maker, honesty_percent, checked_count, total_claims, doc)
      VALUES (@slug,@serial,@name,@brand_id,@season,@batch,@maker,@honesty_percent,@checked_count,@total_claims,@doc)`);
    const insMaterial = db.prepare(`INSERT INTO material
      (passport_id, mat_key, name, pct, pct_num, state, supplier, origin, process, jargon, plain)
      VALUES (@passport_id,@mat_key,@name,@pct,@pct_num,@state,@supplier,@origin,@process,@jargon,@plain)`);
    const insEvidence = db.prepare(`INSERT INTO evidence
      (material_id, title, kind, doc_type, issuer, issued_date, method, hash, detail)
      VALUES (@material_id,@title,@kind,@doc_type,@issuer,@issued_date,@method,@hash,@detail)`);

    const slugToId = {};
    PASSPORTS.forEach((p) => {
      const info = insPassport.run({
        slug: p.slug, serial: p.serial, name: p.name, brand_id: brandId(p.brand),
        season: p.season || null, batch: p.batch || null, maker: p.maker || null,
        honesty_percent: p.honestyPercent ?? null, checked_count: p.checkedCount ?? null,
        total_claims: p.totalClaims ?? null, doc: JSON.stringify(p),
      });
      const pid = info.lastInsertRowid;
      slugToId[p.slug] = pid;
      (p.materials || []).forEach((m) => {
        const mi = insMaterial.run({
          passport_id: pid, mat_key: m.id, name: m.name, pct: m.pct ?? null, pct_num: m.pctNum ?? null,
          state: m.state, supplier: m.supplier ?? null, origin: m.origin ?? null, process: m.process ?? null,
          jargon: m.jargon ?? null, plain: m.plain ?? null,
        });
        (m.evidence || []).forEach((e) => insEvidence.run({
          material_id: mi.lastInsertRowid, title: e.title, kind: e.kind ?? null, doc_type: e.docType ?? null,
          issuer: e.issuer ?? null, issued_date: e.date ?? null, method: e.method ?? null,
          hash: e.hash ?? null, detail: e.detail ?? null,
        }));
      });
    });

    // authorities (public keys) ----------------------------------------------
    const insAuth = db.prepare('INSERT INTO authority (id, name, role, alg, public_key_pem) VALUES (?,?,?,?,?)');
    provenance.publicDirectory().forEach((a) => insAuth.run(a.id, a.name, a.role, a.alg, a.publicKeyPem));

    // signed provenance ledger -----------------------------------------------
    const insEvent = db.prepare(`INSERT INTO provenance_event
      (passport_id, seq, type, actor, actor_role, place, event_date, summary, state, issuer_id, prev_hash, payload_hash, record_hash, signature)
      VALUES (@passport_id,@seq,@type,@actor,@actor_role,@place,@event_date,@summary,@state,@issuer_id,@prev_hash,@payload_hash,@record_hash,@signature)`);
    let eventCount = 0;
    PASSPORTS.forEach((p) => {
      provenance.buildChain(p).forEach((e) => {
        insEvent.run({
          passport_id: slugToId[p.slug], seq: e.seq, type: e.type, actor: e.actor ?? null,
          actor_role: e.actorRole ?? null, place: e.place ?? null, event_date: e.date ?? null,
          summary: e.summary ?? null, state: e.state ?? null, issuer_id: e.issuer,
          prev_hash: e.prevHash, payload_hash: e.payloadHash, record_hash: e.recordHash, signature: e.signature,
        });
        eventCount++;
      });
    });

    // certifications ----------------------------------------------------------
    const insCertType = db.prepare('INSERT INTO certificate_type (id, name, full, kind) VALUES (?,?,?,?)');
    (TT.certTypes || []).forEach((t) => insCertType.run(t.id, t.name, t.full, t.kind));
    const insCert = db.prepare('INSERT INTO certificate (id, type_id, ref, issuer, issued, expires, status, file) VALUES (?,?,?,?,?,?,?,?)');
    (TT.certs || []).forEach((c) => insCert.run(c.id, c.type, c.ref, c.issuer, c.issued, c.expires, c.status, c.file));

    // operations ledger -------------------------------------------------------
    const insLedger = db.prepare('INSERT INTO operations_ledger (sku, garment, batch, units, honesty, status, updated) VALUES (?,?,?,?,?,?,?)');
    (TT.ledger || []).forEach((r) => insLedger.run(r.sku, r.garment, r.batch, r.units, r.honesty ?? null, r.status, r.updated));

    // service desk ------------------------------------------------------------
    const insJob = db.prepare('INSERT INTO service_job (id, garment, batch, type, issue, owner, requested, sla, status) VALUES (?,?,?,?,?,?,?,?,?)');
    (TT.serviceJobs || []).forEach((j) => insJob.run(j.id, j.garment, j.batch, j.type, j.issue, j.owner, j.requested, j.sla, j.status));

    // wardrobe ----------------------------------------------------------------
    const ttKeyToSlug = { cleanEileen: 'clean-eileen-black-crosshatch', organicTee: 'mother-lover-t-shirt', rawDenim: 'falabella-tiny-tote-grey', merinoBeanie: 'campo-leather-white-black' };
    const insWard = db.prepare(`INSERT INTO wardrobe_item
      (id, name, brand, batch, serial, vault, since, swatch, retail, wears, passport_slug, doc)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
    (TT.wardrobe || []).forEach((w) => {
      const slug = w.current ? '365-midweight-hoodie-crocus-purple' : (ttKeyToSlug[w.passport] || null);
      insWard.run(w.id, w.name, w.brand, w.batch, w.serial ?? null, w.vault, w.since, w.swatch ?? null,
        w.retail ?? null, w.wears ?? null, slug, JSON.stringify(w));
    });

    return { eventCount };
  });

  const { eventCount } = insertMany();

  const counts = {
    brand: db.prepare('SELECT COUNT(*) n FROM brand').get().n,
    passport: db.prepare('SELECT COUNT(*) n FROM passport').get().n,
    material: db.prepare('SELECT COUNT(*) n FROM material').get().n,
    evidence: db.prepare('SELECT COUNT(*) n FROM evidence').get().n,
    authority: db.prepare('SELECT COUNT(*) n FROM authority').get().n,
    provenance_event: eventCount,
    certificate: db.prepare('SELECT COUNT(*) n FROM certificate').get().n,
    operations_ledger: db.prepare('SELECT COUNT(*) n FROM operations_ledger').get().n,
    service_job: db.prepare('SELECT COUNT(*) n FROM service_job').get().n,
    wardrobe_item: db.prepare('SELECT COUNT(*) n FROM wardrobe_item').get().n,
  };
  db.close();
  log(counts);
  return { path: DB_PATH, counts };
}

module.exports = { build, DB_PATH };

// Run directly → migrate + print a table.
if (require.main === module) {
  const { path: p, counts } = build({ log: () => {} });
  console.log('\nThreadTrace database built →', p, '\n');
  Object.entries(counts).forEach(([t, n]) => console.log(`  ${t.padEnd(18)} ${n}`));
  console.log('\nRun `npm start` to serve it.\n');
}
