#!/usr/bin/env node
/*
  Builds the client into public/dist. Two jobs:

  1. Compile every .jsx file to plain JS. I use esbuild's transform() and not
     bundle(), because these files aren't ES modules. They load as separate
     <script> tags and pass things to each other through globals on window,
     so bundling them would break that.
  2. Bundle react, react-dom and qrcode-generator into one vendor.js.

  Files that are already plain JS skip this step (_ds_bundle.js,
  honesty-shim.js, image-slot.js, provenance-client.js). The HTML loads those
  straight from /public. Don't hand-edit _ds_bundle.js, it comes out of the
  design system export and gets overwritten.

  Run: node server/build/build-client.mjs [--watch]
*/

import esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(PUBLIC, 'dist');

const WATCH = process.argv.includes('--watch');
const PROD = process.env.NODE_ENV === 'production' || !WATCH;

// [source under public/, output under public/dist/]
// consumer.html and business.html each load their own subset of these.
const APP_FILES = [
  ['app/shell.jsx', 'app/shell.js'],

  // consumer.html
  ['consumer-root.jsx', 'consumer-root.js'],
  ['app/honesty-extras.jsx', 'app/honesty-extras.js'],
  ['app/provenance-verify.jsx', 'app/provenance-verify.js'],
  ['app/consumer.jsx', 'app/consumer.js'],
  ['app/tweaks-panel.jsx', 'app/tweaks-panel.js'],

  // business.html
  ['business-root.jsx', 'business-root.js'],
  ['app/supplier-extras.jsx', 'app/supplier-extras.js'],
  ['app/supplier-datacollection.jsx', 'app/supplier-datacollection.js'],
  ['app/supplier-trust.jsx', 'app/supplier-trust.js'],
  ['app/supplier-mobile.jsx', 'app/supplier-mobile.js'],

  // Neither page loads these yet. Both are finished screens that still need
  // an entry point: SupplierApp is the desktop console, WebPassport is the
  // web version of the passport.
  ['app/supplier.jsx', 'app/supplier.js'],
  ['app/passport.jsx', 'app/passport.js'],
];

async function ensureDir(file) {
  await mkdir(path.dirname(file), { recursive: true });
}

async function buildApp(src, out) {
  const srcPath = path.join(PUBLIC, src);
  const outPath = path.join(DIST, out);
  const code = await readFile(srcPath, 'utf8');
  const result = await esbuild.transform(code, {
    loader: 'jsx',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    minify: PROD,
    sourcefile: src,
    sourcemap: PROD ? false : 'inline',
  });
  await ensureDir(outPath);
  await writeFile(outPath, result.code);
}

async function buildVendor() {
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'vendor-entry.js')],
    outfile: path.join(DIST, 'vendor.js'),
    bundle: true,
    format: 'iife',
    minify: PROD,
    sourcemap: PROD ? false : 'inline',
    logLevel: 'silent',
  });
}

async function buildAll() {
  const start = Date.now();
  await buildVendor();
  await Promise.all(APP_FILES.map(([src, out]) => buildApp(src, out)));
  console.log(`[build-client] built ${APP_FILES.length + 1} file(s) → public/dist (${Date.now() - start}ms)`);
}

try {
  await buildAll();
} catch (err) {
  console.error('[build-client] build failed:', err.message || err);
  process.exit(1);
}

if (WATCH) {
  console.log('[build-client] watching for changes…');
  let pending = null;
  const rebuild = () => {
    if (pending) return;
    pending = setTimeout(async () => {
      pending = null;
      try {
        await buildAll();
      } catch (err) {
        console.error('[build-client] rebuild failed:', err.message || err);
      }
    }, 80);
  };
  watch(PUBLIC, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    if (filename.startsWith('dist')) return;   // ignore our own output
    if (filename.endsWith('.jsx')) rebuild();
  });
  watch(__dirname, { recursive: true }, () => rebuild());
}
