-- ThreadTrace — relational schema (SQLite).
-- Normalised model for the Digital Product Passport platform. The security-
-- critical, joinable entities (passports, materials, evidence, authorities and
-- the signed provenance ledger) are fully normalised with foreign keys; the
-- sprawling editorial content of a passport (story chapters, care, LCA, …) is
-- kept verbatim in a `doc` JSON column so the API can return it with full
-- fidelity — a normalised + document hybrid, a common production pattern.
--
-- Build/refresh:  npm run migrate   (server/db/migrate.js seeds from data/seed.js)

PRAGMA foreign_keys = ON;

-- ---- Brands -----------------------------------------------------------------
CREATE TABLE brand (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

-- ---- Passports (garment DPPs) ----------------------------------------------
CREATE TABLE passport (
  id              INTEGER PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  serial          TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  brand_id        INTEGER NOT NULL REFERENCES brand(id),
  season          TEXT,
  batch           TEXT,
  maker           TEXT,
  honesty_percent INTEGER,
  checked_count   INTEGER,
  total_claims    INTEGER,
  doc             TEXT NOT NULL          -- full passport object as JSON
);
CREATE INDEX idx_passport_brand ON passport(brand_id);

-- ---- Materials (one row per component of a passport) -----------------------
CREATE TABLE material (
  id           INTEGER PRIMARY KEY,
  passport_id  INTEGER NOT NULL REFERENCES passport(id) ON DELETE CASCADE,
  mat_key      TEXT NOT NULL,            -- e.g. 'cotton', 'thread'
  name         TEXT NOT NULL,
  pct          TEXT,
  pct_num      INTEGER,
  state        TEXT NOT NULL,            -- checked | told | notyet
  supplier     TEXT,
  origin       TEXT,
  process      TEXT,
  jargon       TEXT,
  plain        TEXT,
  UNIQUE (passport_id, mat_key)
);
CREATE INDEX idx_material_passport ON material(passport_id);

-- ---- Evidence (proofs attached to a material) ------------------------------
CREATE TABLE evidence (
  id           INTEGER PRIMARY KEY,
  material_id  INTEGER NOT NULL REFERENCES material(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  kind         TEXT,                     -- cert | report | decl
  doc_type     TEXT,
  issuer       TEXT,
  issued_date  TEXT,
  method       TEXT,
  hash         TEXT,
  detail       TEXT
);
CREATE INDEX idx_evidence_material ON evidence(material_id);

-- ---- Issuing authorities (provenance signers) ------------------------------
-- Public keys only; private keys live in the keystore (HSM in production).
CREATE TABLE authority (
  id              TEXT PRIMARY KEY,      -- 'brand','spinner','mill','atelier','certifier'
  name            TEXT NOT NULL,
  role            TEXT,
  alg             TEXT NOT NULL DEFAULT 'Ed25519',
  public_key_pem  TEXT NOT NULL
);

-- ---- Provenance ledger (the signed, tamper-evident hash chain) -------------
-- One row per supply-chain event. record_hash commits to prev_hash, forming an
-- append-only chain per passport; signature is Ed25519 over record_hash by the
-- issuing authority. This is the table the verifier reads and re-checks.
CREATE TABLE provenance_event (
  id           INTEGER PRIMARY KEY,
  passport_id  INTEGER NOT NULL REFERENCES passport(id) ON DELETE CASCADE,
  seq          INTEGER NOT NULL,         -- 0 = genesis (issuance)
  type         TEXT NOT NULL,            -- issue | verified-step | declared-step
  actor        TEXT,
  actor_role   TEXT,
  place        TEXT,
  event_date   TEXT,
  summary      TEXT,
  state        TEXT,
  issuer_id    TEXT NOT NULL REFERENCES authority(id),
  prev_hash    TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  record_hash  TEXT NOT NULL,
  signature    TEXT NOT NULL,
  UNIQUE (passport_id, seq)
);
CREATE INDEX idx_event_passport ON provenance_event(passport_id, seq);

-- ---- Certifications ---------------------------------------------------------
CREATE TABLE certificate_type (
  id    TEXT PRIMARY KEY,                -- 'gots','oekotex',…
  name  TEXT NOT NULL,
  full  TEXT,
  kind  TEXT
);
CREATE TABLE certificate (
  id           TEXT PRIMARY KEY,
  type_id      TEXT NOT NULL REFERENCES certificate_type(id),
  ref          TEXT,
  issuer       TEXT,
  issued       TEXT,
  expires      TEXT,
  status       TEXT,                     -- valid | expiring | expired
  file         TEXT
);
CREATE INDEX idx_cert_type ON certificate(type_id);

-- ---- Business: operations ledger -------------------------------------------
CREATE TABLE operations_ledger (
  id       INTEGER PRIMARY KEY,
  sku      TEXT NOT NULL UNIQUE,
  garment  TEXT NOT NULL,
  batch    TEXT,
  units    INTEGER,
  honesty  INTEGER,
  status   TEXT,                         -- published | draft | awaiting
  updated  TEXT
);

-- ---- Business: service desk (repair / maintenance / refurb) ----------------
CREATE TABLE service_job (
  id         TEXT PRIMARY KEY,
  garment    TEXT NOT NULL,
  batch      TEXT,
  type       TEXT,                       -- repair | maintenance | refurb
  issue      TEXT,
  owner      TEXT,
  requested  TEXT,
  sla        TEXT,
  status     TEXT                        -- new | in_progress | done
);

-- ---- Consumer: wardrobe (garments a keeper owns) ---------------------------
CREATE TABLE wardrobe_item (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  brand     TEXT,
  batch     TEXT,
  serial    TEXT,
  vault     TEXT,                        -- secured | pending
  since     TEXT,
  swatch    TEXT,
  retail    INTEGER,
  wears     INTEGER,
  passport_slug TEXT REFERENCES passport(slug),
  doc       TEXT NOT NULL                -- full wardrobe object as JSON
);
