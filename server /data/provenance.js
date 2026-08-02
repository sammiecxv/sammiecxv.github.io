/* ThreadTrace — verifiable provenance layer.
 *
 * A Digital Product Passport is only trustworthy if a consumer can prove the
 * chain of custody was not forged or edited after the fact. This module turns
 * each passport's ordered supply-chain events into a signed, tamper-evident
 * hash chain (a minimal blockchain / Git-style Merkle-less DAG):
 *
 *   record[i].payloadHash = SHA-256(canonical event payload)
 *   record[i].recordHash  = SHA-256(seq ‖ payloadHash ‖ record[i-1].recordHash)
 *   record[i].signature   = Ed25519_sign(issuerPrivKey, record[i].recordHash)
 *
 * Two independent properties make it verifiable:
 *   1. LINKAGE  — each record commits to the previous record's hash, so you
 *      cannot insert, delete, or reorder an event without breaking every hash
 *      downstream of it (tamper-evidence).
 *   2. AUTHENTICITY — each event is signed by the private key of the actor who
 *      attested it (brand, spinner, mill, atelier, certifier). A consumer holds
 *      only public keys, so they can verify authorship without being able to
 *      forge it.
 *
 * The QR/NFC tag on a garment encodes the chain HEAD hash (the anchor). A scan
 * fetches the full chain and re-derives every hash + checks every signature
 * client↔server. If any byte of any event was altered, verification fails and
 * points at the exact broken event.
 *
 * Threat model — what this defends against:
 *   • Counterfeit / cloned tag ........ head hash won't match a signed chain
 *   • Silent edit of a claim .......... payloadHash changes → recordHash breaks
 *   • Inserted / deleted event ........ linkage breaks at the splice point
 *   • Forged attestation .............. signature check fails (no private key)
 * Out of scope: key distribution/PKI, revocation, replay across serials — noted
 * as future work in the thesis.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------ *
 * Issuing authorities. Each holds an Ed25519 keypair generated once at
 * server start. In production these live in an HSM / brand PKI; here the
 * public keys are exposed via /api/authorities so any client (or `curl`)
 * can verify signatures independently.
 * ------------------------------------------------------------------ */
const AUTHORITY_DEFS = [
  { id: 'brand',     name: 'Brand issuer',        role: 'Issues the passport & final assembly claim' },
  { id: 'spinner',   name: 'Fibre & spinning',    role: 'Attests raw-fibre origin and yarn' },
  { id: 'mill',      name: 'Mill / weaver',       role: 'Attests fabric construction & dye' },
  { id: 'atelier',   name: 'Cut-make-trim',       role: 'Attests garment assembly & finishing' },
  { id: 'certifier', name: 'Accredited certifier', role: 'Third-party audit & certificate issuance' },
];

// Keys persist to a keystore file so a signature signed at migration time still
// verifies after a server restart (each process would otherwise mint new keys).
// In production these private keys live in an HSM / brand PKI, never on disk.
const KEYSTORE = path.join(__dirname, '..', 'db', 'authority-keys.json');

function loadOrCreateAuthorities() {
  if (fs.existsSync(KEYSTORE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(KEYSTORE, 'utf8'));
      return AUTHORITY_DEFS.map((a) => {
        const rec = saved.find((s) => s.id === a.id);
        return {
          ...a,
          publicKey: crypto.createPublicKey(rec.publicKeyPem),
          privateKey: crypto.createPrivateKey(rec.privateKeyPem),
        };
      });
    } catch (_) { /* fall through to regenerate */ }
  }
  const gen = AUTHORITY_DEFS.map((a) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    return { ...a, publicKey, privateKey };
  });
  try {
    fs.mkdirSync(path.dirname(KEYSTORE), { recursive: true });
    fs.writeFileSync(KEYSTORE, JSON.stringify(gen.map((a) => ({
      id: a.id,
      publicKeyPem: a.publicKey.export({ type: 'spki', format: 'pem' }),
      privateKeyPem: a.privateKey.export({ type: 'pkcs8', format: 'pem' }),
    })), null, 2));
  } catch (_) { /* read-only fs — keys stay in-memory for this process */ }
  return gen;
}

const authorities = loadOrCreateAuthorities();
const authById = Object.fromEntries(authorities.map((a) => [a.id, a]));

// Public directory (safe to hand out) — used by /api/authorities.
function publicDirectory() {
  return authorities.map((a) => ({
    id: a.id, name: a.name, role: a.role,
    alg: 'Ed25519',
    publicKeyJwk: a.publicKey.export({ format: 'jwk' }),
    publicKeyPem: a.publicKey.export({ type: 'spki', format: 'pem' }),
  }));
}

/* ------------------------------------------------------------------ *
 * Hash helpers
 * ------------------------------------------------------------------ */
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Deterministic, key-sorted JSON so the same payload always hashes identically.
function canonical(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonical).join(',') + ']';
  return '{' + Object.keys(obj).sort().map((k) => JSON.stringify(k) + ':' + canonical(obj[k])).join(',') + '}';
}

// Map a story chapter to the authority that would have attested it.
function issuerFor(chapter, i, total) {
  const t = (chapter.title || '').toLowerCase();
  if (/fibre|cotton|leather|wool|fabric|yarn/.test(t)) return 'spinner';
  if (/weav|knit|dye|mill|tan/.test(t)) return 'mill';
  if (/cut|sew|assembl|finish|maker|atelier|made/.test(t)) return 'atelier';
  if (/cert|audit|standard|test/.test(t)) return 'certifier';
  if (i === 0) return 'spinner';
  if (i === total - 1) return 'brand';
  return 'atelier';
}

/* ------------------------------------------------------------------ *
 * Build the signed chain for a passport.
 * Genesis event = passport issuance (brand). Following events = the
 * garment's storyChapters, in order.
 * ------------------------------------------------------------------ */
function buildChain(passport) {
  const chapters = passport.storyChapters || [];
  const events = [];

  // Genesis — the passport itself is issued and bound to the serial.
  events.push({
    type: 'issue',
    actor: passport.brand,
    actorRole: 'Passport issued & bound to serial',
    place: passport.maker || passport.brand,
    date: '2025',
    summary: `Digital Product Passport issued for ${passport.name} (${passport.serial}).`,
    issuer: 'brand',
  });

  chapters.forEach((c, i) => {
    events.push({
      type: c.state === 'checked' ? 'verified-step' : 'declared-step',
      actor: c.place || passport.brand,
      actorRole: c.title,
      place: c.place,
      date: c.date,
      summary: c.body,
      state: c.state,
      issuer: issuerFor(c, i, chapters.length),
    });
  });

  // Sign into a linked chain.
  let prevHash = '0'.repeat(64); // genesis prev
  return events.map((e, seq) => {
    const payload = {
      seq, type: e.type, actor: e.actor, actorRole: e.actorRole,
      place: e.place, date: e.date, summary: e.summary, state: e.state || null,
      serial: passport.serial, issuer: e.issuer,
    };
    const payloadHash = sha256(canonical(payload));
    const recordHash = sha256(`${seq}|${payloadHash}|${prevHash}`);
    const auth = authById[e.issuer];
    const signature = crypto.sign(null, Buffer.from(recordHash, 'hex'), auth.privateKey).toString('base64');
    const rec = {
      seq, ...payload,
      prevHash, payloadHash, recordHash, signature,
      issuerName: auth.name,
    };
    prevHash = recordHash;
    return rec;
  });
}

function chainOf(passport) {
  const events = buildChain(passport);
  return {
    serial: passport.serial,
    slug: passport.slug,
    name: passport.name,
    brand: passport.brand,
    alg: 'Ed25519 + SHA-256 hash chain',
    head: events.length ? events[events.length - 1].recordHash : null,
    length: events.length,
    events,
  };
}

/* ------------------------------------------------------------------ *
 * Verify a chain. `tamper` (event seq) optionally mutates one event's
 * summary BEFORE verification, to demonstrate detection in a live demo.
 * Returns a per-event report and the first broken index.
 * ------------------------------------------------------------------ */
function verifyChain(passport, { tamper } = {}) {
  const events = buildChain(passport).map((e) => ({ ...e }));

  // Attack simulation: silently edit one event's claim after signing.
  let tamperedAt = null;
  if (tamper != null && events[tamper]) {
    events[tamper].summary = events[tamper].summary + ' [ALTERED]';
    tamperedAt = tamper;
  }

  const v = verifyEvents(events, passport.serial);
  return {
    serial: passport.serial, slug: passport.slug, name: passport.name, brand: passport.brand,
    alg: 'Ed25519 + SHA-256 hash chain',
    valid: v.valid,
    length: v.events.length,
    head: events.length ? events[events.length - 1].recordHash : null,
    tamperedAt, brokenAt: v.brokenAt,
    events: v.events,
  };
}

// Pure verifier over an arbitrary array of signed records. Re-derives every
// hash from the record's own payload + the RUNNING (recomputed) previous hash,
// so ANY edit/insert/delete/reorder cascades and is caught. Signatures are
// checked against the recomputed record hash using the claimed issuer's public
// key. This is the function the tests exercise with each attack.
function verifyEvents(records, serial) {
  let prevHash = '0'.repeat(64);
  let brokenAt = null;
  const events = records.map((e) => {
    const payload = {
      seq: e.seq, type: e.type, actor: e.actor, actorRole: e.actorRole,
      place: e.place, date: e.date, summary: e.summary, state: e.state || null,
      serial, issuer: e.issuer,
    };
    const payloadHash = sha256(canonical(payload));
    const recordHash = sha256(`${e.seq}|${payloadHash}|${prevHash}`);

    const contentOk = payloadHash === e.payloadHash;   // content untouched?
    const linkOk = prevHash === e.prevHash;            // linkage intact (no upstream edit)?
    let sigOk = false;                                 // signature matches recomputed hash?
    try {
      const auth = authById[e.issuer];
      sigOk = auth && crypto.verify(null, Buffer.from(recordHash, 'hex'), auth.publicKey, Buffer.from(e.signature, 'base64'));
    } catch (_) { sigOk = false; }

    const ok = contentOk && linkOk && sigOk;
    if (!ok && brokenAt === null) brokenAt = e.seq;

    prevHash = recordHash; // cascade: downstream links to the RE-DERIVED hash
    return {
      seq: e.seq, actor: e.actor, actorRole: e.actorRole, issuer: e.issuer,
      issuerName: e.issuerName, date: e.date, state: e.state || null, summary: e.summary,
      recordHash: e.recordHash, signature: e.signature,
      checks: { content: contentOk, linkage: linkOk, signature: sigOk }, ok,
    };
  });
  return { valid: brokenAt === null, brokenAt, events };
}

// Verify an array of records already loaded from the database (persisted chain),
// with an optional tamper(seq) to simulate a post-signing edit. Mirrors
// verifyChain but sources events from storage instead of rebuilding them.
function verifyStored(records, serial, { tamper } = {}) {
  const evs = records.map((e) => ({ ...e }));
  let tamperedAt = null;
  if (tamper != null && evs[tamper]) { evs[tamper].summary += ' [ALTERED]'; tamperedAt = tamper; }
  const v = verifyEvents(evs, serial);
  return { valid: v.valid, brokenAt: v.brokenAt, tamperedAt, length: v.events.length, events: v.events };
}

module.exports = { chainOf, verifyChain, verifyEvents, verifyStored, publicDirectory, buildChain, authorities };
