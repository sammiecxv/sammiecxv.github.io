/* ThreadTrace — client-side trustless verifier.
 *
 * Verifies a signed provenance chain ENTIRELY in the browser, using only the
 * published Ed25519 public keys (GET /api/authorities). The server is treated
 * as an untrusted data source: it hands over the chain and the public keys, and
 * this code independently re-derives every hash (SHA-256) and checks every
 * signature (WebCrypto Ed25519). If the server lied about a claim or a verdict,
 * the on-device check catches it — the phone never trusts the server's word.
 *
 * The hashing/canonicalisation MUST match server/data/provenance.js byte-for-
 * byte, or honest chains would fail here. Exposes window.TTVerifyClient.
 */
(function () {
  const enc = new TextEncoder();

  // Deterministic, key-sorted JSON — identical to canonical() on the server.
  function canonical(obj) {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) return '[' + obj.map(canonical).join(',') + ']';
    return '{' + Object.keys(obj).sort().map((k) => JSON.stringify(k) + ':' + canonical(obj[k])).join(',') + '}';
  }

  async function sha256hex(s) {
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(s));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const hexToBytes = (h) => Uint8Array.from(h.match(/.{2}/g).map((x) => parseInt(x, 16)));
  const b64ToBytes = (b) => Uint8Array.from(atob(b), (c) => c.charCodeAt(0));

  function pemToDer(pem) {
    const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    return b64ToBytes(body);
  }

  // Import an Ed25519 SPKI public key, trying the two algorithm spellings
  // browsers use.
  async function importEd25519(pem) {
    const der = pemToDer(pem);
    try {
      return await crypto.subtle.importKey('spki', der, { name: 'Ed25519' }, false, ['verify']);
    } catch (_) {
      return crypto.subtle.importKey('spki', der, { name: 'NODE-ED25519', namedCurve: 'Ed25519' }, false, ['verify']);
    }
  }

  async function verifySig(key, sigB64, recordHashHex) {
    const algo = { name: 'Ed25519' };
    const msg = hexToBytes(recordHashHex);   // server signs the 32 raw hash bytes
    const sig = b64ToBytes(sigB64);
    try {
      return await crypto.subtle.verify(algo, key, sig, msg);
    } catch (_) {
      try { return await crypto.subtle.verify({ name: 'NODE-ED25519' }, key, sig, msg); }
      catch (__) { return false; }
    }
  }

  // Fetch the chain + public keys and import the keys once.
  async function load(slug) {
    const [chain, auths] = await Promise.all([
      fetch(`/api/passports/${encodeURIComponent(slug)}/chain`).then((r) => r.json()),
      fetch('/api/authorities').then((r) => r.json()),
    ]);
    const keys = {};
    for (const a of auths) {
      const pem = a.publicKeyPem || a.public_key_pem;
      if (pem) { try { keys[a.id] = await importEd25519(pem); } catch (_) { keys[a.id] = null; } }
    }
    return { chain, keys };
  }

  // Verify a loaded chain on-device. `tamper` (event seq) mutates one event's
  // summary AFTER download, to prove the phone itself catches a bad claim.
  // Returns the same shape the server's /verify does, so the UI is unchanged.
  async function verify({ chain, keys }, tamperSeq) {
    const serial = chain.serial;
    const events = chain.events.map((e) => ({ ...e }));
    let tamperedAt = null;
    if (tamperSeq != null && events[tamperSeq]) { events[tamperSeq].summary += ' [ALTERED]'; tamperedAt = tamperSeq; }

    let prevHash = '0'.repeat(64);
    let brokenAt = null;
    const out = [];
    for (const e of events) {
      const payload = {
        seq: e.seq, type: e.type, actor: e.actor, actorRole: e.actorRole,
        place: e.place, date: e.date, summary: e.summary, state: e.state || null,
        serial, issuer: e.issuer,
      };
      const payloadHash = await sha256hex(canonical(payload));
      const recordHash = await sha256hex(`${e.seq}|${payloadHash}|${prevHash}`);
      const content = payloadHash === e.payloadHash;
      const linkage = prevHash === e.prevHash;
      const signature = keys[e.issuer] ? await verifySig(keys[e.issuer], e.signature, recordHash) : false;
      const ok = content && linkage && signature;
      if (!ok && brokenAt === null) brokenAt = e.seq;
      prevHash = recordHash;
      out.push({
        seq: e.seq, actor: e.actor, actorRole: e.actorRole, issuer: e.issuer,
        issuerName: e.issuerName, date: e.date, state: e.state || null, summary: e.summary,
        recordHash: e.recordHash, signature: e.signature,
        checks: { content, linkage, signature }, ok,
      });
    }
    return {
      serial, slug: chain.slug, name: chain.name, brand: chain.brand, alg: chain.alg,
      head: chain.head, source: 'browser (WebCrypto)',
      valid: brokenAt === null, length: out.length, tamperedAt, brokenAt, events: out,
    };
  }

  window.TTVerifyClient = { load, verify };
})();
