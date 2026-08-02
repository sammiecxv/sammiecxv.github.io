/* ThreadTrace — database access layer.
 *
 * Thin, synchronous data-access module over better-sqlite3. Every function
 * returns plain objects shaped exactly like the old seed projections, so the
 * REST layer can swap from in-memory to database without changing responses.
 *
 * Degrades gracefully: if better-sqlite3 isn't installed the module exports
 * { available:false } and the server falls back to serving data/seed.js. On
 * first use it auto-migrates (builds threadtrace.db from the seed) if the file
 * is missing, so a fresh `npm install && npm start` just works.
 */

const fs = require('fs');
let Database, migrate;
try {
  Database = require('better-sqlite3');
  migrate = require('./migrate');
} catch (_) {
  module.exports = { available: false };
}

let db = null;

if (Database) {
  try {
    if (!fs.existsSync(migrate.DB_PATH)) migrate.build();     // auto-migrate on first boot
    db = new Database(migrate.DB_PATH, { readonly: false, fileMustExist: true });
    db.pragma('foreign_keys = ON');
  } catch (e) {
    console.error('db: could not open threadtrace.db —', e.message);
  }
}

if (!db) {
  module.exports = { available: false };
} else {
  const parse = (row, col = 'doc') => (row ? JSON.parse(row[col]) : null);

  const api = {
    available: true,

    // ---- passports --------------------------------------------------------
    listPassports() {
      return db.prepare(`SELECT p.slug, p.name, b.name AS brand, p.season, p.batch, p.serial,
        p.honesty_percent AS honestyPercent, p.checked_count AS checkedCount, p.total_claims AS totalClaims
        FROM passport p JOIN brand b ON b.id = p.brand_id ORDER BY p.id`).all();
    },
    getPassport(slug) {
      return parse(db.prepare('SELECT doc FROM passport WHERE slug = ?').get(slug));
    },
    getMaterials(slug) {
      const p = this.getPassport(slug);
      return p ? (p.materials || []) : null;
    },

    // ---- provenance ledger ------------------------------------------------
    getChain(slug) {
      const p = db.prepare('SELECT id, slug, serial, name, brand_id FROM passport WHERE slug = ?').get(slug);
      if (!p) return null;
      const brand = db.prepare('SELECT name FROM brand WHERE id = ?').get(p.brand_id).name;
      const rows = db.prepare(`SELECT seq, type, actor, actor_role AS actorRole, place, event_date AS date,
        summary, state, issuer_id AS issuer, prev_hash AS prevHash, payload_hash AS payloadHash,
        record_hash AS recordHash, signature FROM provenance_event WHERE passport_id = ? ORDER BY seq`).all(p.id);
      const auth = Object.fromEntries(db.prepare('SELECT id, name FROM authority').all().map((a) => [a.id, a.name]));
      const events = rows.map((e) => ({ ...e, issuerName: auth[e.issuer] || e.issuer }));
      return {
        serial: p.serial, slug: p.slug, name: p.name, brand,
        alg: 'Ed25519 + SHA-256 hash chain',
        head: events.length ? events[events.length - 1].recordHash : null,
        length: events.length, events,
      };
    },

    // ---- authorities ------------------------------------------------------
    listAuthorities() {
      return db.prepare('SELECT id, name, role, alg, public_key_pem AS publicKeyPem FROM authority').all();
    },

    // ---- business / consumer collections ----------------------------------
    listProducts() {
      return db.prepare(`SELECT sku, garment, batch, units, honesty, status, updated
        FROM operations_ledger ORDER BY id`).all();
    },
    getProduct(sku) {
      return db.prepare('SELECT sku, garment, batch, units, honesty, status, updated FROM operations_ledger WHERE lower(sku)=lower(?)').get(sku) || null;
    },
    listServiceJobs() {
      return db.prepare('SELECT id, garment, batch, type, issue, owner, requested, sla, status FROM service_job ORDER BY id DESC').all();
    },
    listWardrobe() {
      return db.prepare('SELECT doc FROM wardrobe_item ORDER BY rowid').all().map((r) => JSON.parse(r.doc));
    },
    listCerts() {
      return {
        certs: db.prepare('SELECT id, type_id AS type, ref, issuer, issued, expires, status, file FROM certificate ORDER BY id').all(),
        types: db.prepare('SELECT id, name, full, kind FROM certificate_type ORDER BY id').all(),
      };
    },

    // expose the handle for ad-hoc queries / tests
    _db: db,
  };

  module.exports = api;
}
