/* ThreadTrace — provenance verification benchmark.
 *
 *   node bench/benchmark.js          (or: npm run bench)
 *
 * Measures verification latency as a function of chain length (number of
 * signed supply-chain events) and the on-tag / on-wire size of a chain.
 * Writes bench/results.json (consumed by bench/evaluation.html) and prints a
 * table. Pure Node crypto — no dependencies.
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const { chainOf, verifyEvents } = require('../server/data/provenance');
const TT = require('../server/data/seed');

// Build a synthetic passport with exactly `n` story chapters by tiling the
// PANGAIA passport's real chapters, so events have realistic content length.
function syntheticPassport(n) {
  const base = TT.passport.storyChapters || [];
  const chapters = [];
  for (let i = 0; i < n; i++) {
    const c = base[i % base.length];
    chapters.push({ ...c, title: `${c.title} #${i}` });
  }
  return { ...TT.passport, serial: `DPP-BENCH-${n}`, storyChapters: chapters };
}

function stats(a) {
  a = a.slice().sort((x, y) => x - y);
  const mean = a.reduce((s, v) => s + v, 0) / a.length;
  return { mean: +mean.toFixed(3), median: +a[Math.floor(a.length / 2)].toFixed(3), p95: +a[Math.floor(a.length * 0.95)].toFixed(3) };
}

const Ns = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
const REPS = 200;   // measured repetitions per size
const WARM = 20;    // warm-up iterations (JIT / key cache)

console.log(`\nThreadTrace provenance benchmark — Node ${process.version} on ${process.platform}/${process.arch}`);
console.log(`${REPS} reps per size, ${WARM} warm-up\n`);
console.log('  events |  mean ms |  p95 ms | µs/event |  chain KB');
console.log('  -------+----------+---------+----------+----------');

const samples = [];
for (const n of Ns) {
  const p = syntheticPassport(n - 1);           // +1 genesis event = n total
  const recs = chainOf(p).events;
  const chainBytes = Buffer.byteLength(JSON.stringify(recs));

  for (let w = 0; w < WARM; w++) verifyEvents(recs, p.serial);
  const t = [];
  for (let r = 0; r < REPS; r++) {
    const s = performance.now();
    verifyEvents(recs, p.serial);
    t.push(performance.now() - s);
  }
  const v = stats(t);
  const perEventUs = +((v.mean / n) * 1000).toFixed(1);
  samples.push({ n, verifyMs: v, perEventUs, chainBytes });
  console.log(
    `  ${String(n).padStart(6)} | ${v.mean.toFixed(3).padStart(8)} | ${v.p95.toFixed(3).padStart(7)} | ${String(perEventUs).padStart(8)} | ${(chainBytes / 1024).toFixed(1).padStart(8)}`
  );
}

const out = {
  generated: new Date().toISOString(),
  runtime: `Node ${process.version} · ${process.platform}/${process.arch}`,
  alg: 'Ed25519 + SHA-256 hash chain',
  reps: REPS,
  samples,
};
fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(out, null, 2));
console.log(`\nWrote bench/results.json — open bench/evaluation.html to chart it.\n`);
